/**
 * Gera um arquivo HTML por rota a partir do build de servidor.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTE SCRIPT RESOLVE                                            │
 * │                                                                       │
 * │  O site era servido como SPA: qualquer endereço devolvia o mesmo      │
 * │  `index.html`, com o `<div id="root">` vazio e sempre o mesmo         │
 * │  <title>. Título, descrição, canônico e o texto inteiro da página só  │
 * │  existiam depois que o React montava no navegador.                    │
 * │                                                                       │
 * │  O Google até renderiza JavaScript, mas em uma segunda passagem, numa │
 * │  fila separada e com teto de 2 MB por recurso. Robôs de rede social e │
 * │  a maior parte dos rastreadores de IA não renderizam nada: para eles  │
 * │  as sete páginas eram um único documento repetido.                    │
 * │                                                                       │
 * │  Depois deste passo, cada rota tem arquivo próprio com o conteúdo já  │
 * │  materializado na resposta HTTP 200. O JavaScript segue no lugar e    │
 * │  hidrata a página; ele deixou de ser condição para o conteúdo existir.│
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Roda depois dos dois `vite build` (cliente e servidor), encadeado no
 * script `build` do package.json. O build de servidor é descartado no
 * fim: ele é ferramenta de compilação, não coisa para publicar.
 */

import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const raiz = process.cwd();
const dist = path.join(raiz, 'dist');
const distServidor = path.join(raiz, 'dist-ssr');

/** Onde o `index.html` do build de cliente guarda o bloco substituível. */
const MARCA_INICIO = '<!-- seo:inicio -->';
const MARCA_FIM = '<!-- seo:fim -->';

const { renderizar, rotasParaGerar, rotasPrivadas, rotasDoSitemap, ROTA_404 } = await import(
  pathToFileURL(path.join(distServidor, 'entry-server.js')).href
);

const modelo = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!modelo.includes(MARCA_INICIO) || !modelo.includes(MARCA_FIM)) {
  throw new Error(
    `dist/index.html não tem os marcadores ${MARCA_INICIO} / ${MARCA_FIM}. ` +
      'Ou eles saíram do index.html da raiz, ou este script rodou duas vezes ' +
      'sobre o mesmo dist — a primeira passagem substitui o bloco. Rode ' +
      '`npm run build`, que refaz o dist antes de chegar aqui.',
  );
}

/** Troca o bloco SEO padrão pelas tags que o Helmet produziu na rota. */
function comCabeca(html, cabeca) {
  const inicio = html.indexOf(MARCA_INICIO);
  const fim = html.indexOf(MARCA_FIM) + MARCA_FIM.length;
  return `${html.slice(0, inicio)}${cabeca}${html.slice(fim)}`;
}

/** Injeta o HTML renderizado dentro do contêiner que o React hidrata. */
function comCorpo(html, corpo) {
  const alvo = '<div id="root"></div>';
  if (!html.includes(alvo)) {
    throw new Error(`index.html não tem mais ${alvo} — o corpo não tem onde entrar.`);
  }
  return html.replace(alvo, `<div id="root">${corpo}</div>`);
}

/** `/pnl-practitioner` → `dist/pnl-practitioner/index.html`. */
function arquivoDaRota(rota) {
  if (rota === ROTA_404) return path.join(dist, '404.html');
  if (rota === '/') return path.join(dist, 'index.html');
  return path.join(dist, rota.replace(/^\//, ''), 'index.html');
}

let gerados = 0;

for (const rota of rotasParaGerar) {
  const { corpo, cabeca } = await renderizar(rota);

  if (!corpo.trim()) {
    throw new Error(`A rota ${rota} renderizou vazia.`);
  }
  if (!cabeca.includes('<title')) {
    throw new Error(`A rota ${rota} não declarou <title> pelo Helmet.`);
  }
  if (!cabeca.includes('rel="canonical"')) {
    throw new Error(`A rota ${rota} não declarou canônico.`);
  }
  /*
    O render do servidor é síncrono: um componente que suspenda faz o
    React devolver o fallback sem reclamar, e a página iria para produção
    com o esqueleto de carregamento no lugar do texto — indexável, e
    igual ao de todas as outras. Melhor quebrar o build.
  */
  if (corpo.includes('Carregando página…')) {
    throw new Error(
      `A rota ${rota} saiu com o skeleton de carregamento no lugar do conteúdo: ` +
        'algum componente suspendeu durante a pré-renderização.',
    );
  }

  const arquivo = arquivoDaRota(rota);
  await mkdir(path.dirname(arquivo), { recursive: true });
  await writeFile(arquivo, comCorpo(comCabeca(modelo, cabeca), corpo));
  gerados += 1;
  console.log(`  ✓ ${rota.padEnd(20)} → ${path.relative(raiz, arquivo)}`);
}

/*
  As rotas privadas não são pré-renderizadas — o painel importa o SDK do
  Firebase, que não roda em Node, e o conteúdo dele não deve existir em
  arquivo público. Mas elas precisam de um arquivo próprio mesmo assim:
  sem ele, o servidor devolveria o `index.html` da home e o React
  hidrataria uma árvore que não corresponde à rota. O que vai aqui é a
  casca vazia do SPA — o `main.tsx` detecta o `#root` vazio e monta do
  zero, como sempre fez.
*/
for (const rota of rotasPrivadas) {
  const cabeca = [
    '<title>Instituto Bruno Sena</title>',
    '<meta name="robots" content="noindex, nofollow" />',
  ].join('\n    ');
  const arquivo = arquivoDaRota(rota);
  await mkdir(path.dirname(arquivo), { recursive: true });
  await writeFile(arquivo, comCabeca(modelo, cabeca));
  gerados += 1;
  console.log(`  ✓ ${rota.padEnd(20)} → ${path.relative(raiz, arquivo)} (casca, noindex)`);
}

/* ── Sitemap ─────────────────────────────────────────────────────────────
   Sai daqui, e não de um arquivo em `public/`, pelo mesmo motivo do HTML:
   a lista de rotas mora num lugar só. O sitemap antigo era escrito à mão
   e já mentia — as nove URLs anunciavam o mesmo `lastmod`, fixo na data
   em que o arquivo foi criado, e nenhuma delas mudava quando a página
   mudava. Um `lastmod` que não corresponde à verdade não é inofensivo: o
   Google aprende a desconfiar do arquivo e passa a ignorar o sinal, que é
   justamente o que faz uma página revisada voltar à fila de rastreio na
   frente das outras.
   ───────────────────────────────────────────────────────────────────── */

const BASE = 'https://institutobrunosena.com.br';

/** Data do último commit que tocou o arquivo, em W3C Datetime completo. */
function ultimaAlteracao(arquivo) {
  if (!arquivo) return new Date().toISOString();
  try {
    const saida = execFileSync('git', ['log', '-1', '--format=%cI', '--', arquivo], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (saida) return saida;
  } catch {
    // Sem git (clone raso em servidor de build) ou arquivo não commitado.
  }
  return new Date().toISOString();
}

const escaparXml = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const urls = rotasDoSitemap
  .map((p) => {
    const linhas = [
      `    <loc>${escaparXml(BASE + p.rota)}</loc>`,
      `    <lastmod>${ultimaAlteracao(p.fonte)}</lastmod>`,
    ];
    if (p.frequencia) linhas.push(`    <changefreq>${p.frequencia}</changefreq>`);
    if (p.prioridade !== undefined) {
      linhas.push(`    <priority>${p.prioridade.toFixed(1)}</priority>`);
    }
    /*
      A extensão de imagens aponta a arte principal da página. Sem ela, o
      rastreador de imagens teria de chegar sozinho à página e adivinhar
      qual das dezenas de <img> é a que representa o documento.
    */
    if (p.imagem) {
      linhas.push('    <image:image>');
      linhas.push(`      <image:loc>${escaparXml(BASE + p.imagem)}</image:loc>`);
      linhas.push('    </image:image>');
    }
    return `  <url>\n${linhas.join('\n')}\n  </url>`;
  })
  .join('\n');

/*
  O namespace de imagens é declarado no <urlset>, e não no bloco onde é
  usado: fora daqui, um analisador rigoroso rejeita o arquivo inteiro por
  causa do prefixo desconhecido.
*/
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`,
);
console.log(`  ✓ sitemap.xml          → ${rotasDoSitemap.length} URLs`);

await rm(distServidor, { recursive: true, force: true });

console.log(`\nPré-renderização concluída: ${gerados} arquivos.`);
