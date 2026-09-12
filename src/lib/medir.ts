import { combos, listaCursos } from '../config/courses';
import { precoEmNumero } from './schema';

/**
 * Medição de conversão — o que acontece DEPOIS que a pessoa chega.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ISTO MEDE, E O QUE JÁ ERA MEDIDO SEM ELE                       │
 * │                                                                       │
 * │  O Search Console responde "como as pessoas me acham": consulta,      │
 * │  posição, clique no resultado. Ele acaba no instante em que o         │
 * │  visitante entra no site, e só enxerga busca orgânica do Google —     │
 * │  Instagram, WhatsApp e anúncio pago são invisíveis para ele.          │
 * │                                                                       │
 * │  A Kiwify responde "quanto vendeu". Não responde de onde veio a       │
 * │  venda.                                                               │
 * │                                                                       │
 * │  Entre as duas havia um vão, e era o vão inteiro: o site vendia,      │
 * │  captava lead e mandava gente para o WhatsApp sem contar nada disso.  │
 * │  Não havia como responder se o simulador do SENA converte, se o       │
 * │  vídeo de boas-vindas é assistido, ou qual artigo gera matrícula.     │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  SEM VITE_GA4_ID, CUSTO ZERO                                          │
 * │                                                                       │
 * │  A mesma decisão do `sentry.ts`: o Vite substitui `import.meta.env`   │
 * │  em tempo de build, então sem a variável definida `ligado` é `false`  │
 * │  literal, toda função vira retorno vazio e nada é baixado. O          │
 * │  desenvolvimento local fica silencioso e o site em produção só passa  │
 * │  a medir no dia em que a variável for criada no Netlify.              │
 * │                                                                       │
 * │  Para ligar: Netlify → Site settings → Environment variables          │
 * │    VITE_GA4_ID   o identificador do fluxo de dados (G-XXXXXXXXXX)     │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠ CONSENTIMENTO — UMA DECISÃO QUE AINDA É SUA                        │
 * │                                                                       │
 * │  O GA4 grava cookie no navegador do visitante. Sob a LGPD isso pede   │
 * │  base legal, e a prática corrente no Brasil é o aviso de cookies com  │
 * │  recusa possível. Este arquivo NÃO desenha esse aviso: ele mudaria a  │
 * │  primeira tela de todo visitante, e essa é uma escolha de negócio.    │
 * │                                                                       │
 * │  O arquivo está preparado para ela: `iniciarMedicao()` é o único      │
 * │  ponto de entrada, e basta chamá-lo depois do "aceitar" em vez de no  │
 * │  arranque para que nada seja carregado antes da autorização.          │
 * │                                                                       │
 * │  Enquanto a decisão não vier, a /privacidade precisa dizer que o site │
 * │  usa medição de audiência do Google — hoje ela ainda não diz.         │
 * └───────────────────────────────────────────────────────────────────────┘
 */

const ID = import.meta.env.VITE_GA4_ID;

/** Parâmetros de um evento. `undefined` é descartado antes do envio. */
type Parametros = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let iniciado = false;
let carregando = false;

/** Os sinais de que há alguém do outro lado, e não um robô de rastreio. */
const INTERACOES = ['pointerdown', 'keydown', 'scroll'] as const;

/*
  A fila oficial do Google. Um evento empurrado para `dataLayer` ANTES de o
  gtag.js chegar não se perde: o script processa o acumulado assim que
  carrega. É o que permite adiar o download sem cegar o primeiro minuto da
  visita, que é justamente quando as decisões acontecem.
*/
function empurrar() {
  // biome-ignore lint/complexity/noArguments: o gtag.js lê o objeto `arguments` da fila; um array não é a mesma coisa para o SDK.
  window.dataLayer?.push(arguments);
}
const gtag = empurrar as (...args: unknown[]) => void;

/**
 * Busca o gtag.js. Uma vez só, e nunca no caminho crítico.
 *
 * O script pesa mais de 100 kB e abre conexão com dois domínios. Baixá-lo
 * junto com a página cobraria isso de toda visita, inclusive da que
 * abandona em dois segundos — num público majoritariamente móvel, é peso
 * tirado exatamente de onde a primeira pintura acontece.
 */
function carregarGtag() {
  if (carregando) return;
  carregando = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);
}

/**
 * Liga a medição: define a fila, agenda o download e escuta os cliques.
 *
 * Chamada no arranque, em `main.tsx`.
 */
export function iniciarMedicao(): void {
  if (!ID || iniciado || typeof window === 'undefined') return;
  iniciado = true;

  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  gtag('config', ID, {
    /*
      O IP do visitante não é guardado junto do evento. É o mínimo que um
      site que também coleta nome e e-mail deve fazer com o serviço que
      NÃO precisa saber quem a pessoa é — a mesma linha que o `sentry.ts`
      traça com `sendDefaultPii: false`.
    */
    anonymize_ip: true,
  });

  /*
    Duas largadas, o que vier primeiro:

    · a primeira interação real (um toque, uma tecla, uma rolagem) — quem
      interage é quem pode converter, e a partir daí o evento precisa
      encontrar o script pronto;
    · o tempo ocioso depois do `load`, com teto de 2 segundos, para que
      quem lê parado e vai embora ainda seja contado. Sem este segundo
      caminho, a taxa de rejeição do site apareceria menor do que é — o
      pior tipo de erro, porque é o que agrada.
  */
  const largar = () => {
    for (const evt of INTERACOES) window.removeEventListener(evt, largar);
    carregarGtag();
  };
  for (const evt of INTERACOES) {
    window.addEventListener(evt, largar, { once: true, passive: true });
  }

  const ocioso = () => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(largar, { timeout: 2000 });
    else setTimeout(largar, 2000);
  };
  if (document.readyState === 'complete') ocioso();
  else window.addEventListener('load', ocioso, { once: true });

  document.addEventListener('click', aoClicar, { capture: true });
}

/**
 * Registra um evento.
 *
 * Os nomes seguem o vocabulário do GA4 onde ele existe — `begin_checkout`
 * e `generate_lead` são eventos RECOMENDADOS, e o GA4 os encaixa sozinho
 * nos relatórios de funil e de geração de lead. Um nome em português no
 * lugar deles seria mais bonito no código e mudo no painel. Os demais são
 * próprios do instituto, e aí sim em português.
 */
export function evento(nome: string, parametros: Parametros = {}): void {
  if (!ID || !iniciado) return;

  // O SDK aceita `undefined`, mas ele vira coluna "(not set)" no relatório.
  const limpos: Parametros = {};
  for (const [k, v] of Object.entries(parametros)) {
    if (v !== undefined && v !== '') limpos[k] = v;
  }

  gtag('event', nome, limpos);
}

/**
 * Uma página vista. Chamada a cada troca de rota, nunca na primeira.
 *
 * A primeira é enviada pelo `config` acima, com a URL que o visitante
 * abriu. Repeti-la aqui contaria toda entrada duas vezes — e uma métrica
 * inflada é pior do que métrica nenhuma, porque parece confiável.
 */
export function verPagina(caminho: string, titulo: string): void {
  if (!ID || !iniciado) return;

  gtag('event', 'page_view', {
    page_path: caminho,
    page_title: titulo,
    page_location: window.location.href,
  });
}

/* ── Cliques que saem do site ──────────────────────────────────────────────

   Os botões de compra e de WhatsApp estão espalhados por quinze pontos —
   cartões de curso, trilho de compra, jornada, rodapé, 404, o flutuante.
   Instrumentar um por um significaria tocar em quinze arquivos hoje e
   lembrar de tocar no décimo sexto amanhã: a medição furaria em silêncio
   no dia em que alguém acrescentasse um botão, que é o dia em que ela mais
   importaria.

   Um ouvinte só, no documento, reconhece o destino em vez do botão. Quem
   acrescentar um link para a Kiwify amanhã é medido sem saber que isto
   existe. */

/**
 * Todo checkout do catálogo, apontando de volta para o produto.
 *
 * Formações e combos entram na mesma tabela: para o funil, os dois são a
 * mesma coisa — um endereço de pagamento que precisa de nome e de valor no
 * relatório. Os combos ainda não têm link (ver `courses.ts`), e é por isso
 * que a montagem filtra em vez de supor.
 */
const CHECKOUTS = new Map<string, { id: string; title: string; price: string }>();
for (const item of [...listaCursos, ...Object.values(combos)]) {
  if (item.checkout) CHECKOUTS.set(item.checkout, item);
}

/**
 * O que um endereço significa para o funil.
 *
 * Separada do ouvinte, e pura, porque é a única parte com regra de
 * verdade — e um teste dela não precisa de DOM, de clique nem de rede.
 */
export function classificarDestino(
  href: string,
): { nome: string; parametros: Parametros } | undefined {
  if (!href) return undefined;

  if (href.startsWith('mailto:')) {
    return { nome: 'clique_email', parametros: { destino: href.slice(7).split('?')[0] } };
  }

  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return undefined;
  }

  if (url.hostname === 'wa.me' || url.hostname.endsWith('whatsapp.com')) {
    return { nome: 'clique_whatsapp', parametros: {} };
  }

  if (url.hostname.endsWith('kiwify.com.br') || url.hostname.endsWith('kiwify.com')) {
    /*
      O curso sai do próprio endereço, pela tabela do catálogo. A
      alternativa seria marcar cada botão com um atributo — e aí o botão
      que alguém esquecesse de marcar viraria uma venda sem nome no
      relatório.
    */
    const curso = CHECKOUTS.get(url.href) ?? CHECKOUTS.get(href);
    const valor = curso ? precoEmNumero(curso.price) : undefined;

    return {
      nome: 'begin_checkout',
      parametros: {
        /* `value` e `currency` são o que fazem o GA4 somar dinheiro em vez
           de contar cliques: sem eles o relatório mostra intenção, e não o
           tamanho dela. É valor de INTENÇÃO — a venda confirmada vive na
           Kiwify, que é quem sabe se o cartão passou. */
        value: valor ? Number(valor) : undefined,
        currency: valor ? 'BRL' : undefined,
        curso: curso?.id,
        item_name: curso?.title,
      },
    };
  }

  if (url.hostname && url.hostname !== window.location.hostname) {
    return { nome: 'clique_externo', parametros: { destino: url.hostname } };
  }

  return undefined;
}

function aoClicar(e: MouseEvent) {
  const alvo = e.target;
  if (!(alvo instanceof Element)) return;

  const link = alvo.closest('a');
  if (!link) return;

  const classificado = classificarDestino(link.getAttribute('href') ?? '');
  if (!classificado) return;

  evento(classificado.nome, {
    ...classificado.parametros,
    /* De onde o clique partiu. É o que transforma "42 cliques no WhatsApp"
       em "o artigo de hipnose manda mais gente para o WhatsApp do que a
       página da formação". */
    origem: window.location.pathname,
  });
}
