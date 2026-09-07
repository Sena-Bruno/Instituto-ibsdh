import { HelmetProvider, type HelmetServerState } from '@dr.pogodin/react-helmet';
import { MotionConfig } from 'motion/react';
import type { ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { paginas } from './config/paginas';
import Rotas from './Rotas';

/**
 * O lado servidor do site — usado só pelo `scripts/prerender.mjs`.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  Até aqui o site era uma SPA pura: o servidor devolvia sempre o mesmo │
 * │  `index.html`, com o mesmo <title> e o mesmo canônico, e todo o       │
 * │  conteúdo aparecia depois, quando o React montava no navegador.       │
 * │                                                                       │
 * │  Isso custa caro em busca. O Google separa rastreio de renderização:  │
 * │  primeiro lê o HTML cru, e só depois enfileira a página para um       │
 * │  Chromium sem cabeça executar o JavaScript. Essa fila é o gargalo, e  │
 * │  qualquer coisa que a interrompa — orçamento de rastreio esgotado,    │
 * │  script que falha, teto de 2 MB por recurso — deixa a página indexada │
 * │  com o texto de outra. E os robôs que não executam JavaScript         │
 * │  (WhatsApp, LinkedIn, boa parte dos agregadores e dos rastreadores de │
 * │  IA) nunca chegam à segunda etapa: para eles as sete páginas do site  │
 * │  eram literalmente a mesma.                                           │
 * │                                                                       │
 * │  Com a pré-renderização, cada rota vira um arquivo HTML com o texto,  │
 * │  os links, o <title>, a descrição, o canônico e o JSON-LD já          │
 * │  materializados na primeira resposta 200. O JavaScript continua       │
 * │  existindo — ele hidrata o HTML e devolve a interatividade — mas      │
 * │  deixou de ser condição para o conteúdo existir.                      │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export interface Renderizacao {
  /** O HTML do corpo, para dentro de `<div id="root">`. */
  corpo: string;
  /** As tags que o Helmet coletou, prontas para o `<head>`. */
  cabeca: string;
}

/**
 * O endereço usado para gerar o `404.html`.
 *
 * Precisa ser um caminho de verdade, e não o curinga `*`: o StaticRouter
 * casa a localização contra as rotas como um navegador faria, e `*` não é
 * um caminho — nenhuma rota casaria e a página sairia vazia. Este valor
 * nunca é servido; só existe para fazer o roteador cair no NotFound.
 */
export const ROTA_404 = '/__404__';

/** Recorta e injeta as rotas conhecidas; o resto cai na página 404. */
async function componenteDaRota(rota: string): Promise<Record<string, ComponentType>> {
  const pagina = paginas.find((p) => p.rota === rota);
  if (!pagina) {
    const mod = await import('./pages/NotFound');
    return { '*': mod.default };
  }
  const mod = await pagina.carregar();
  return { [pagina.rota]: mod.default };
}

export async function renderizar(rota: string): Promise<Renderizacao> {
  const resolvidos = await componenteDaRota(rota);

  /*
    A fronteira de <Suspense> vem de dentro de `Rotas`, e não daqui: os
    dois lados precisam ter exatamente a mesma, porque o React marca a
    fronteira no HTML com comentários e conta com eles para hidratar.

    Como `renderToString` é síncrono, um componente que suspenda faria o
    React devolver o fallback em silêncio e a página iria para produção
    com um skeleton no lugar do texto. É por isso que `prerender.mjs`
    confere, em cada rota, que o HTML gerado não contém a reserva.
  */
  let estado: HelmetServerState | undefined;
  const corpo = renderToString(
    <HelmetProvider
      onServerState={(s) => {
        estado = s;
      }}
    >
      <MotionConfig reducedMotion="user">
        <StaticRouter location={rota}>
          <Rotas resolvidos={resolvidos} />
        </StaticRouter>
      </MotionConfig>
    </HelmetProvider>,
  );

  /*
    O React 19 gera sozinho um <link rel="preload"> para cada imagem
    marcada como prioritária. No servidor esses links saem no começo do
    corpo, porque `renderToString` não tem um <head> onde pô-los; no
    navegador, o mesmo React os hospeda no <head> e não os desenha no
    lugar onde a imagem está.

    Deixá-los no corpo custava caro duas vezes: a hidratação encontrava
    nós que a árvore do cliente não produz — e descartava o HTML inteiro,
    justamente o HTML que existe para o robô ler — e o preload perdia o
    efeito, porque um `preload` declarado depois do conteúdo não adianta
    trabalho nenhum. Movê-los para o <head> resolve as duas coisas de uma
    vez.
  */
  const preloads = [...new Set(corpo.match(/<link\b[^>]*rel="preload"[^>]*>/g) ?? [])];
  const corpoLimpo = preloads.length
    ? corpo.replace(/<link\b[^>]*rel="preload"[^>]*>/g, '')
    : corpo;

  /*
    A ordem importa: o <title> e o canônico precisam estar o mais alto
    possível no <head>. O Googlebot corta a leitura de cada recurso em
    2 MB, e o que ficar depois desse ponto simplesmente não existe para
    ele — inclusive uma etiqueta canônica empurrada para o fim por um
    bloco grande de qualquer outra coisa.
  */
  const cabeca = [
    estado?.title.toString(),
    estado?.link.toString(),
    estado?.meta.toString(),
    estado?.script.toString(),
    ...preloads,
  ]
    .filter(Boolean)
    .join('\n    ');

  return { corpo: corpoLimpo, cabeca };
}

/** As rotas que recebem HTML pré-renderizado, mais a página de erro. */
export const rotasParaGerar: string[] = [
  ...paginas.filter((p) => p.publica).map((p) => p.rota),
  ROTA_404,
];

/** As rotas que recebem só a casca vazia do SPA, com `noindex`. */
export const rotasPrivadas: string[] = paginas.filter((p) => !p.publica).map((p) => p.rota);

/**
 * O que o sitemap precisa saber de cada rota pública.
 *
 * Reexportado daqui porque `scripts/prerender.mjs` roda em Node puro,
 * sobre o build de servidor — é o único ponto em que a tabela de rotas,
 * escrita em TypeScript, já está compilada e legível para o script.
 */
export const rotasDoSitemap = paginas
  .filter((p) => p.publica)
  .map(({ rota, frequencia, prioridade, imagem, fonte }) => ({
    rota,
    frequencia,
    prioridade,
    imagem,
    fonte,
  }));
