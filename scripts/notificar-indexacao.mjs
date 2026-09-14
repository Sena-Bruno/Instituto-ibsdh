/**
 * Avisa o Google, automaticamente, quando uma URL do sitemap é nova ou mudou.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTE SCRIPT SUBSTITUI                                          │
 * │                                                                       │
 * │  Sem ele, publicar um artigo significa: escrever o texto, esperar o   │
 * │  deploy, abrir o Google Search Console, colar a URL na inspeção e     │
 * │  clicar em "Solicitar indexação" — à mão, uma vez por artigo. Este    │
 * │  script roda depois de cada build (ver .github/workflows/             │
 * │  indexacao-google.yml) e faz a mesma chamada que aquele botão faz,    │
 * │  mas para toda URL do sitemap que apareceu ou mudou desde a última    │
 * │  vez.                                                                 │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  O QUE ISTO NÃO É                                                  │
 * │                                                                       │
 * │  A Indexing API do Google só tem suporte OFICIAL para páginas com     │
 * │  dados estruturados de vaga de emprego (`JobPosting`) ou transmissão  │
 * │  ao vivo (`BroadcastEvent`) — não é o caso deste site. Usá-la para    │
 * │  uma página comum é prática difundida entre quem trabalha com SEO e,  │
 * │  na prática, funciona: acelera a fila de rastreio do Google para a    │
 * │  URL notificada. Mas não é o mesmo contrato documentado, o Google     │
 * │  pode simplesmente ignorar a notificação, e nada aqui GARANTE         │
 * │  indexação — só pede que o rastreador olhe mais cedo.                 │
 * │                                                                       │
 * │  Por isso o script também resubmete o sitemap.xml pela Search Console │
 * │  API (`sitemaps.submit`) a cada mudança: essa chamada É o mecanismo   │
 * │  oficial e documentado para qualquer tipo de página, e funciona como  │
 * │  uma segunda rede de proteção — mais lenta, mas sem o "pode ser que   │
 * │  não funcione" da Indexing API.                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * PRÉ-REQUISITO (configuração única, feita pelo Bruno, fora deste repo):
 * ver a seção "Indexação automática no Google" do README.
 */

import crypto from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const raiz = process.cwd();
const CAMINHO_SITEMAP = path.join(raiz, 'dist', 'sitemap.xml');
const CAMINHO_ESTADO = path.join(raiz, 'scripts', 'indexacao-notificadas.json');

/**
 * A propriedade tal como cadastrada no Search Console. Aceita as duas
 * formas que o Google usa — `sc-domain:institutobrunosena.com.br` (dono do
 * domínio inteiro) ou `https://institutobrunosena.com.br/` (prefixo de
 * URL, com barra no fim). São propriedades diferentes para a API, e não
 * há como adivinhar qual o Bruno verificou — por isso é configurável, e
 * não fixo no código.
 */
const PROPRIEDADE =
  process.env.GOOGLE_SEARCH_CONSOLE_PROPRIEDADE ?? 'https://institutobrunosena.com.br/';

const URL_SITEMAP = 'https://institutobrunosena.com.br/sitemap.xml';

const desescaparXml = (v) =>
  String(v).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Extrai `{ loc, lastmod }` de cada bloco `<url>` do sitemap gerado pelo build. */
function analisarSitemap(xml) {
  const blocos = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  return blocos
    .map((bloco) => {
      const loc = bloco.match(/<loc>(.*?)<\/loc>/)?.[1];
      const lastmod = bloco.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '';
      return loc ? { loc: desescaparXml(loc), lastmod } : null;
    })
    .filter((v) => v !== null);
}

async function lerEstado() {
  try {
    return JSON.parse(await readFile(CAMINHO_ESTADO, 'utf8'));
  } catch {
    return {};
  }
}

/** Troca a chave privada PEM por um JWT assinado, e o JWT por um access token OAuth2. */
async function obterTokenDeAcesso(credenciais) {
  const agora = Math.floor(Date.now() / 1000);
  const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

  const cabecalho = { alg: 'RS256', typ: 'JWT' };
  const corpo = {
    iss: credenciais.client_email,
    // As duas APIs usadas aqui, num único token: evita autenticar duas vezes.
    scope: [
      'https://www.googleapis.com/auth/indexing',
      'https://www.googleapis.com/auth/webmasters',
    ].join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: agora,
    exp: agora + 3600,
  };
  const semAssinar = `${base64url(cabecalho)}.${base64url(corpo)}`;
  const assinatura = crypto.sign(
    'RSA-SHA256',
    Buffer.from(semAssinar),
    credenciais.private_key,
  );
  const jwt = `${semAssinar}.${assinatura.toString('base64url')}`;

  const resposta = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!resposta.ok) {
    throw new Error(`Falha ao trocar o JWT por um access token: ${await resposta.text()}`);
  }
  return (await resposta.json()).access_token;
}

async function notificarUrl(token, url) {
  const resposta = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  if (!resposta.ok) {
    console.warn(
      `  ✗ Indexing API recusou ${url}: ${resposta.status} ${await resposta.text()}`,
    );
    return false;
  }
  return true;
}

async function resubmeterSitemap(token) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    PROPRIEDADE,
  )}/sitemaps/${encodeURIComponent(URL_SITEMAP)}`;
  const resposta = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) {
    console.warn(
      `  ✗ Search Console recusou o sitemap: ${resposta.status} ${await resposta.text()}`,
    );
    return false;
  }
  return true;
}

async function main() {
  const credenciaisBrutas = process.env.GOOGLE_INDEXACAO_CREDENCIAIS;
  if (!credenciaisBrutas) {
    /*
      Sem credencial configurada isto não é uma falha do build — é o
      estado normal antes do Bruno concluir a configuração única descrita
      no README. Um `exit 1` aqui deixaria o repositório com CI vermelho
      permanente por um passo opcional.
    */
    console.warn(
      'GOOGLE_INDEXACAO_CREDENCIAIS não configurado — pulando o aviso ao Google. ' +
        'Ver "Indexação automática no Google" no README.',
    );
    return;
  }

  const credenciais = JSON.parse(credenciaisBrutas);
  const sitemap = analisarSitemap(await readFile(CAMINHO_SITEMAP, 'utf8'));
  const estadoAnterior = await lerEstado();

  const mudou = sitemap.filter((p) => estadoAnterior[p.loc] !== p.lastmod);

  if (mudou.length === 0) {
    console.log('Nenhuma URL nova ou revisada desde o último aviso ao Google.');
    return;
  }

  console.log(`${mudou.length} URL(s) nova(s) ou revisada(s):`);
  for (const p of mudou) console.log(`  · ${p.loc}`);

  const token = await obterTokenDeAcesso(credenciais);

  // Novo estado a partir do sitemap atual — URLs removidas do sitemap saem
  // daqui junto, em vez de acumular para sempre um registro de página que
  // não existe mais.
  const novoEstado = {};
  for (const p of sitemap) novoEstado[p.loc] = estadoAnterior[p.loc] ?? null;

  for (const p of mudou) {
    const ok = await notificarUrl(token, p.loc);
    if (ok) novoEstado[p.loc] = p.lastmod;
  }

  await resubmeterSitemap(token);

  await writeFile(CAMINHO_ESTADO, `${JSON.stringify(novoEstado, null, 2)}\n`);
  console.log('Estado de indexação atualizado.');
}

await main();
