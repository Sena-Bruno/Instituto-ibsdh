/**
 * Smoke test de navegador para as rotas públicas.
 *
 * Verifica o que quebrou de verdade neste site no passado: CTA de compra
 * sem destino, imagem que não carrega, título de página duplicado ou
 * ausente, e erro de console.
 *
 * O Playwright NÃO é dependência do projeto: ele baixa centenas de MB de
 * navegadores na instalação, o que só atrasaria o build de produção de um
 * site estático. Instale sob demanda:
 *
 *   npm install --no-save playwright
 *   npm run build && npm run preview &
 *   npm run smoke
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const base = process.env.SMOKE_URL || 'http://localhost:4173';
const routes = [
  '/',
  '/formacoes',
  '/pnl-practitioner',
  '/master-pnl',
  '/hipnoterapia',
  '/jornada',
  '/master-coach',
  '/artigos',
  '/artigos/o-que-e-pnl',
  /* As duas páginas institucionais. A /sobre entra também por um motivo
     que não é o dela: é o endereço que os sete artigos declaram como
     autoria nos dados estruturados, então uma quebra aqui derruba o
     E-E-A-T do conteúdo inteiro, e não só desta página. */
  '/sobre',
  '/contato',
  /* A página do material é `noindex` e fica fora do sitemap, mas PRECISA
     existir em disco: é o link que o formulário do artigo entrega no
     mesmo clique. Sem arquivo, o servidor devolve 404 para o endereço que
     o site acabou de prometer — e é justamente o tipo de quebra que só
     aparece em produção. */
  '/materiais/sete-perguntas',
];

/*
  As rotas que existem de propósito fora do índice de busca.

  A página do material é `noindex` e fica fora do sitemap: se aparecesse na
  busca, chegaria a todo mundo sem passar pelo formulário — e o formulário é
  a razão de ela existir. Mesmo assim ela É verificada aqui, porque é o link
  que o formulário do artigo entrega no mesmo clique: se ela deixar de ser
  gerada, o site promete um endereço que responde 404.
*/
const SEM_INDICE = new Set(['/materiais/sete-perguntas']);

// O ambiente traz um Chromium pré-instalado que pode não bater com a build
// esperada pela versão do Playwright; apontar direto evita baixar outro.
const executablePath =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});

/*
  O convite de material abre depois de meia página rolada, e o Playwright rola
  sozinho para clicar em qualquer coisa. Nos testes de INTERAÇÃO ele passaria a
  interceptar os cliques, e o smoke falharia por um motivo que não é defeito do
  site. Aqui ele é calado antes de a página carregar, com a mesma marca que o
  navegador de uma pessoa que já deixou o contato usaria.

  O comportamento do convite não deixa de ser testado por isso: ele tem um
  bloco só dele mais abaixo, e é lá que se verifica o que importa de verdade,
  que é ele NÃO estar na tela na chegada.
*/
async function paginaSemConvite() {
  const pagina = await browser.newPage();
  await pagina.addInitScript(() => {
    try {
      localStorage.setItem('ibsdh:convite', JSON.stringify({ convertido: true }));
    } catch {
      // Sem armazenamento, o convite pode aparecer; o teste de interação
      // abaixo falharia, e falhar alto é melhor que passar por acaso.
    }
  });
  return pagina;
}
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message}`));

let failures = 0;

for (const route of routes) {
  // 'networkidle' não serve aqui: a página ainda busca recursos de
  // terceiros (fontes, ícones, fotos de stock) que podem nunca responder.
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, null, {
    timeout: 20000,
  });
  await page.waitForTimeout(2500);

  const title = await page.title();
  const titleCount = await page.locator('head title').count();
  // Só imagens servidas pelo próprio site: recursos externos podem falhar
  // por bloqueio de rede do ambiente, o que não é defeito do site.
  const brokenImages = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((i) => {
        const src = i.getAttribute('src') || '';
        const local = src.startsWith('/') && !src.startsWith('//');
        return local && i.complete && i.naturalWidth === 0;
      })
      .map((i) => i.getAttribute('src')),
  );
  const deadCtas = await page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((b) => {
        // Acordeões e alternadores têm aria-expanded/aria-controls: são
        // controles legítimos sem href, não CTAs de compra quebrados.
        if (b.hasAttribute('aria-expanded') || b.hasAttribute('aria-controls')) return false;
        if (b.closest('form')) return false;
        const t = (b.textContent || '').toLowerCase();
        return /comprar|garantir|matricular|quero (me |acessar|dominar)|minha vaga|inscrever/.test(
          t,
        );
      })
      .map((b) => b.textContent.trim().slice(0, 50)),
  );

  console.log(`\n${route}`);
  console.log(`  título (${titleCount}): ${title}`);
  console.log(`  imagens quebradas: ${brokenImages.length}`);
  for (const s of brokenImages) console.log(`      ✗ ${s}`);
  console.log(`  CTAs sem destino: ${deadCtas.length}`);
  for (const t of deadCtas) console.log(`      ✗ "${t}"`);

  if (!title || titleCount !== 1) {
    console.log(`      ✗ esperado exatamente 1 <title>, veio ${titleCount}`);
    failures++;
  }
  failures += brokenImages.length + deadCtas.length;
}

/*
  Ruído de ambiente, não defeito do site: a rede restrita em que o smoke roda
  bloqueia recursos de terceiros e o backend do Firestore.

  As duas últimas alternativas entraram quando as avaliações passaram a usar
  `firebase/firestore/lite`. O SDK completo, ao não alcançar o servidor,
  escrevia "Could not reach Cloud Firestore backend"; o `lite` fala por HTTP
  comum e a mesma falha sai como `RPC_ERROR` e "Request failed with error:
  undefined". Sem estas duas linhas, o smoke passa a reprovar toda execução
  em rede fechada — e um filtro que reprova sempre deixa de ser lido.
*/
const environmental =
  /ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|Could not reach Cloud Firestore|offline mode|net::ERR_|@firebase\/firestore.*RPC_ERROR|Request failed with error: undefined/i;

// --- Movimento ---
// Verifica o que é fácil regredir sem ninguém notar: o painel que volta a
// abrir num corte seco, e a preferência de menos movimento sendo ignorada
// pelas animações em JavaScript (que a regra de CSS não alcança).
{
  const p2 = await paginaSemConvite();
  await p2.goto(`${base}/hipnoterapia`, { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('h1', { timeout: 20000 });
  await p2.waitForTimeout(700);

  const faq = p2.locator('button[aria-controls^="faq-painel"]').first();
  await faq.click();
  await p2.waitForTimeout(120);
  const meio = await p2.locator('#faq-painel-0').boundingBox();
  await p2.waitForTimeout(500);
  const fim = await p2.locator('#faq-painel-0').boundingBox();
  const abriuAnimado = !!(meio && fim && meio.height < fim.height);

  await faq.click();
  await p2.waitForTimeout(450);
  const saiuDoDom = (await p2.locator('#faq-painel-0').count()) === 0;

  console.log('\n=== movimento ===');
  console.log(`  FAQ abre com altura animada: ${abriuAnimado ? 'sim' : 'NÃO'}`);
  console.log(`  FAQ sai do DOM ao fechar: ${saiuDoDom ? 'sim' : 'NÃO'}`);
  if (!abriuAnimado) failures++;
  if (!saiuDoDom) failures++;
  await p2.close();

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p3 = await ctx.newPage();
  await p3.addInitScript(() => {
    try {
      localStorage.setItem('ibsdh:convite', JSON.stringify({ convertido: true }));
    } catch {
      /* ver paginaSemConvite */
    }
  });
  await p3.goto(`${base}/hipnoterapia`, { waitUntil: 'domcontentloaded' });
  await p3.waitForSelector('h1', { timeout: 20000 });
  await p3.waitForTimeout(700);
  await p3.locator('button[aria-controls^="faq-painel"]').first().click();
  await p3.waitForTimeout(60);
  const bx = await p3.locator('#faq-painel-0').boundingBox();
  const instantaneo = !!(bx && bx.height > 20);
  console.log(`  reduced-motion abre sem animação: ${instantaneo ? 'sim' : 'NÃO'}`);
  if (!instantaneo) failures++;
  await ctx.close();

  /*
    Troca de conteúdo no mesmo lugar (componente `Troca`).

    O site tinha quatro lugares que substituíam a tela num corte seco, todos
    no formato `if (estado) return <outraCoisa/>`: o formulário da lista de
    espera virando confirmação, as quatro telas do /admin e as duas fachadas
    de vídeo virando player. A fachada da home é a única das quatro que dá
    para disparar sem autenticar nem gravar dado, então é ela que guarda o
    padrão contra regressão.

    O que prova que o <Troca> está funcionando é a fachada SAIR DO DOM depois
    do clique: se ela desaparecesse no mesmo quadro, o AnimatePresence não
    estaria no caminho — e é justamente esse caminho que se perde ao voltar a
    escrever dois `return` separados, cada um com sua própria instância.
  */
  const p5 = await paginaSemConvite();
  await p5.goto(base, { waitUntil: 'domcontentloaded' });
  await p5.waitForSelector('h1', { timeout: 20000 });
  await p5.waitForTimeout(700);

  const fachada = p5.locator('button:has(svg.lucide-play)').first();
  const temFachada = (await fachada.count()) > 0;

  if (temFachada) {
    await fachada.click();
    // Meio da transição: com mode="wait" a fachada ainda está saindo aqui.
    await p5.waitForTimeout(500);
    const fachadaSaiu = (await p5.locator('button:has(svg.lucide-play)').count()) === 0;
    const playerEntrou = (await p5.locator('iframe, video').count()) > 0;
    console.log(`  fachada de vídeo sai do DOM na troca: ${fachadaSaiu ? 'sim' : 'NÃO'}`);
    console.log(`  player entra no lugar: ${playerEntrou ? 'sim' : 'NÃO'}`);
    if (!fachadaSaiu) failures++;
    if (!playerEntrou) failures++;
  } else {
    // Sem vídeo em `config/midia.ts` não há fachada para trocar. Não é falha:
    // é o estado documentado de quando os vídeos ainda não foram gravados.
    console.log('  fachada de vídeo: nenhuma na home (midia.ts sem vídeo)');
  }

  /*
    Resposta ao toque. O botão afunda enquanto está pressionado — o retorno
    que faltava em tela de toque, onde não existe hover. A ordem no CSS é o
    que quebra fácil: `:active` declarado antes dos `:hover` perde a cascata
    com o ponteiro, e o afundamento passa a acontecer só no toque, onde
    ninguém está olhando o computed style.
  */
  const botao = p5.locator('.btn-primary').first();
  let afunda = false;
  if ((await botao.count()) > 0) {
    const caixa = await botao.boundingBox();
    if (caixa) {
      await p5.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      await p5.mouse.down();
      await p5.waitForTimeout(200);
      const t = await botao.evaluate((el) => getComputedStyle(el).transform);
      await p5.mouse.up();
      // scale(0.97) vira matrix(0.97, 0, 0, 0.97, …); o hover sozinho seria
      // matrix(1, 0, 0, 1, 0, -2).
      afunda = /^matrix\(0\.9/.test(t);
    }
  }
  console.log(`  botão afunda ao ser pressionado: ${afunda ? 'sim' : 'NÃO'}`);
  if (!afunda) failures++;
  await p5.close();
}

// --- O que o robô lê ---
//
// Esta é a verificação que protege a pré-renderização. Tudo o que vem
// acima roda com JavaScript ligado, e por isso passaria igual num site
// que só monta o conteúdo no navegador — que era o estado anterior, e o
// motivo de as sete páginas serem, para qualquer rastreador que não
// executa JS, um único documento repetido.
//
// Aqui o navegador entra com JavaScript DESLIGADO: o que sobra é
// exatamente o que chega na primeira resposta HTTP.
{
  console.log('\n=== HTML sem JavaScript ===');
  const semJs = await browser.newContext({ javaScriptEnabled: false });
  const p4 = await semJs.newPage();
  const vistos = new Map();

  for (const route of routes) {
    const resposta = await p4.goto(base + route, { waitUntil: 'domcontentloaded' });
    const dados = await p4.evaluate(() => {
      const raiz = document.getElementById('root');
      const texto = (raiz?.textContent ?? '').trim().length;

      /*
        Texto PRESENTE não é texto LEGÍVEL. As animações de entrada
        gravavam `opacity:0` no HTML pré-renderizado, e um robô que aplica
        CSS sem executar JavaScript lia 5% da home — o resto estava lá,
        invisível. Nenhuma verificação pegava isso: o texto existia, o
        título existia, o JSON-LD existia. Por isso a conta aqui é de
        estilo computado, não de conteúdo.
      */
      let oculto = 0;
      for (const el of document.querySelectorAll('#root *')) {
        const cs = getComputedStyle(el);
        const some = cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none';
        if (!some || !el.textContent?.trim()) continue;
        // Só o ancestral mais alto, para não somar os filhos de novo.
        if (!el.parentElement?.closest('[style*="opacity: 0"],[data-revela],[data-entrada]')) {
          oculto += el.textContent.trim().length;
        }
      }

      return {
        titulo: document.title,
        canonico: document.querySelector('link[rel=canonical]')?.href ?? '',
        descricao: document.querySelector('meta[name=description]')?.content ?? '',
        dadosEstruturados: document.querySelectorAll('script[type="application/ld+json"]')
          .length,
        h1: document.querySelectorAll('h1').length,
        texto,
        legivel: texto - oculto,
        links: document.querySelectorAll('#root a[href^="/"]').length,
      };
    });

    const problemas = [];
    if (resposta?.status() !== 200) problemas.push(`status ${resposta?.status()}`);
    if (!dados.titulo) problemas.push('sem <title>');
    if (!dados.canonico) problemas.push('sem canônico');
    if (!dados.descricao) problemas.push('sem descrição');
    /* Dados estruturados existem para o resultado de busca. Numa página
       `noindex` — a do material entregue em troca de contato — não há
       resultado de busca para enriquecer, e exigi-los ali seria cobrar
       trabalho que não produz efeito nenhum. O resto da verificação vale
       igual: a página precisa responder 200, ter título e trazer o texto
       no HTML, senão o link que o formulário entrega não leva a nada. */
    if (dados.dadosEstruturados === 0 && !SEM_INDICE.has(route)) {
      problemas.push('sem JSON-LD');
    }
    if (dados.h1 !== 1) problemas.push(`${dados.h1} <h1> (esperado 1)`);
    // Abaixo disto, o que veio foi casca: título e menu, sem conteúdo.
    if (dados.texto < 1500) problemas.push(`só ${dados.texto} caracteres de texto`);
    if (dados.links < 5) problemas.push(`só ${dados.links} links internos`);
    // Sem JavaScript, nada deveria estar escondido por animação nenhuma.
    const pctLegivel = dados.texto ? (dados.legivel / dados.texto) * 100 : 0;
    if (pctLegivel < 95) {
      problemas.push(
        `só ${Math.round(pctLegivel)}% do texto está visível (o resto sai com opacity:0)`,
      );
    }

    // Título e canônico repetidos entre rotas é o sintoma clássico de
    // SPA não pré-renderizada: todas as páginas com o <head> da home.
    const anterior = vistos.get(dados.titulo);
    if (anterior) problemas.push(`título igual ao de ${anterior}`);
    vistos.set(dados.titulo, route);
    if (dados.canonico !== `https://institutobrunosena.com.br${route === '/' ? '/' : route}`) {
      problemas.push(`canônico aponta para ${dados.canonico}`);
    }

    console.log(
      `  ${route.padEnd(20)} ${dados.texto.toString().padStart(6)} car. · ` +
        `${Math.round((dados.legivel / (dados.texto || 1)) * 100)}% visível · ` +
        `${dados.links} links · ${dados.dadosEstruturados} JSON-LD` +
        (problemas.length ? `\n      ✗ ${problemas.join('; ')}` : ''),
    );
    failures += problemas.length;
  }

  /* ── O convite de material ─────────────────────────────────────────────
     ┌───────────────────────────────────────────────────────────────────┐
     │  O QUE ESTE BLOCO PROTEGE                                          │
     │                                                                    │
     │  Desde 2017 o Google rebaixa página cujo conteúdo principal é       │
     │  coberto por um interstício quando a pessoa chega DA BUSCA. Os      │
     │  sete artigos do site existem para trazer gente da busca orgânica.  │
     │                                                                    │
     │  "O convite não está na tela na chegada" é a linha que separa uma   │
     │  captação boa de uma perda de posição, e é invisível no código: um  │
     │  gatilho trocado passa em lint, em tipo e em teste de unidade, e    │
     │  cobra a conta semanas depois, em ranking.                          │
     │                                                                    │
     │  `lib/useConvite.test.ts` já guarda a lógica. Aqui a verificação é  │
     │  no produto montado, num navegador de verdade.                     │
     └───────────────────────────────────────────────────────────────────┘ */
  {
    console.log('\n=== convite de material ===');
    const p6 = await browser.newPage();
    await p6.goto(`${base}/hipnoterapia`, { waitUntil: 'domcontentloaded' });
    await p6.waitForSelector('h1', { timeout: 20000 });

    /*
      Responder o aviso de cookies primeiro, porque é o que um visitante
      faz — e porque o convite espera essa resposta de propósito: os dois
      moram no mesmo canto inferior, e o convite cobriria no celular uma
      pergunta sobre dados pessoais com uma oferta.

      "Recusar", e não "aceitar": assim este teste também prova que o
      convite não depende de consentimento para funcionar. Quem recusa
      medição continua vendo o site inteiro.
    */
    await p6.getByRole('button', { name: /^recusar$/i }).click({ timeout: 10000 });
    await p6.waitForTimeout(2500);

    const caixa = p6.locator('[aria-labelledby="convite-titulo"]');
    const naChegada = await caixa.count();
    console.log(`  na chegada: ${naChegada === 0 ? 'ausente' : 'PRESENTE'}`);
    if (naChegada !== 0) {
      console.log('      ✗ o convite abriu sozinho na chegada (interstício intrusivo)');
      failures++;
    }

    // E aparece depois de a pessoa rolar metade da página, que é o sinal
    // de que ela está lendo em vez de passando.
    await p6.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await p6.waitForTimeout(1200);
    const aposRolar = await caixa.count();
    console.log(`  depois de rolar: ${aposRolar > 0 ? 'presente' : 'AUSENTE'}`);
    if (aposRolar === 0) {
      console.log('      ✗ o convite não apareceu nem depois de meia página rolada');
      failures++;
    }
    await p6.close();
  }

  /* ── O grafo de pedaços do Firebase ────────────────────────────────────
     ┌───────────────────────────────────────────────────────────────────┐
     │  ESTA VERIFICAÇÃO EXISTE POR CAUSA DE DOIS ERROS SEGUIDOS         │
     │                                                                   │
     │  O caminho de LEITURA das avaliações, que é o que toda página de  │
     │  curso baixa, deve carregar só o núcleo do Firebase e o Firestore  │
     │  `lite`. O Auth é para quem vai ESCREVER, e desce por import()     │
     │  dinâmico.                                                        │
     │                                                                   │
     │  Duas vezes isso quebrou em silêncio:                             │
     │                                                                   │
     │  1. `firebase-banco` importava `firebase-auth` sem que nada        │
     │     dissesse, porque o núcleo compartilhado tinha caído dentro do  │
     │     pedaço do Auth. O adiamento do Auth não entregava nada, e a    │
     │     medição feita no pedaço nomeado (27 kB) escondia os 59 kB que  │
     │     a página realmente baixava.                                   │
     │  2. Pôr o convite de material no Layout mudou o grafo e empurrou   │
     │     43 kB de núcleo para dentro do pedaço de leitura.              │
     │                                                                   │
     │  Nenhum dos dois aparece em teste de unidade, em tipo ou em lint:  │
     │  o build passa, o site funciona, e a conta chega em quem abre a    │
     │  página no celular.                                               │
     │                                                                   │
     │  MEÇA SEMPRE O FECHO TRANSITIVO, nunca o pedaço nomeado sozinho.   │
     └───────────────────────────────────────────────────────────────────┘ */
  {
    console.log('\n=== pedaços do Firebase ===');
    const pasta = path.resolve('dist/assets');
    const arquivos = readdirSync(pasta);
    const acha = (prefixo) => arquivos.find((n) => n.startsWith(prefixo));
    const importesDe = (f) =>
      [...readFileSync(path.join(pasta, f), 'utf8').matchAll(/from"\.\/([^"]+)"/g)].map(
        (m) => m[1],
      );

    /** Tudo o que o navegador baixa ANTES de executar uma linha do módulo. */
    const fechoEstatico = (inicio) => {
      const vistos = new Set();
      const fila = [inicio];
      while (fila.length) {
        const f = fila.pop();
        if (!f || vistos.has(f)) continue;
        vistos.add(f);
        fila.push(...importesDe(f));
      }
      return [...vistos];
    };

    const leitura = acha('CourseReviews-');
    if (!leitura) {
      console.log('      ✗ não achei o pedaço de CourseReviews em dist/assets');
      failures++;
    } else {
      const doFirebase = fechoEstatico(leitura).filter((f) => f.includes('firebase'));
      const comprimido = doFirebase.reduce(
        (soma, f) => soma + gzipSync(readFileSync(path.join(pasta, f)), { level: 9 }).length,
        0,
      );
      const rotulos = doFirebase.map((f) => f.replace(/-[^-]+\.js$/, '')).sort();
      console.log(`  ler avaliações: ${rotulos.join(' + ') || '(nenhum)'} · ${comprimido} B`);

      if (rotulos.some((r) => r.includes('auth'))) {
        console.log('      ✗ o Auth voltou para o caminho de LEITURA das avaliações');
        failures++;
      }
      /* O teto é folgado de propósito: ele não existe para perseguir bytes,
         e sim para acusar quando um pedaço inteiro reaparece aqui. Hoje são
         ~37 kB; o Auth sozinho são 23 kB, então qualquer volta dele estoura. */
      const TETO = 48 * 1024;
      if (comprimido > TETO) {
        console.log(`      ✗ ${comprimido} B comprimidos, acima do teto de ${TETO} B`);
        failures++;
      }
    }
  }

  // Um endereço que não existe tem de responder 404 de verdade. Servido
  // com 200, ele vira "soft 404": o Google indexa endereços inventados,
  // todos com o mesmo conteúdo, e gasta neles o rastreio das páginas reais.
  const inexistente = await p4.goto(`${base}/endereco-que-nao-existe`, {
    waitUntil: 'domcontentloaded',
  });
  const status = inexistente?.status();
  console.log(`  ${'/endereco-que-nao-existe'.padEnd(20)} HTTP ${status}`);
  if (status !== 404) {
    console.log('      ✗ esperado 404; um 200 aqui é soft 404');
    failures++;
  }

  await semJs.close();
}

const unique = [...new Set(consoleErrors)].filter((e) => !environmental.test(e));
console.log(`\n=== erros de console: ${unique.length} ===`);
for (const e of unique.slice(0, 10)) console.log(`  ${e}`);
failures += unique.length;

await browser.close();
console.log(`\n${failures === 0 ? '✓ tudo certo' : `✗ ${failures} problema(s)`}`);
process.exit(failures === 0 ? 0 : 1);
