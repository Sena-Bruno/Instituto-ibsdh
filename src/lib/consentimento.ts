import { useSyncExternalStore } from 'react';

/**
 * A escolha do visitante sobre cookies de medição.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE, E POR QUE NÃO É ENFEITE JURÍDICO                │
 * │                                                                       │
 * │  O GA4 grava cookie no navegador de quem visita. Sob a LGPD, tratar   │
 * │  dado pessoal exige base legal, e para medição de audiência a prática │
 * │  corrente no Brasil é o consentimento — informado, específico e       │
 * │  revogável.                                                           │
 * │                                                                       │
 * │  "Revogável" é a parte que a maioria dos avisos de cookie esquece:    │
 * │  retirar o consentimento precisa ser tão fácil quanto dá-lo. Por isso │
 * │  a decisão não é um `true` gravado e esquecido — ela é um estado que  │
 * │  a /privacidade lê, mostra e permite trocar a qualquer momento.       │
 * │                                                                       │
 * │  E "específico" é por que RECUSAR é um botão igual ao de aceitar, e   │
 * │  não um X discreto no canto: um aviso em que só uma das saídas é      │
 * │  visível não coleta consentimento, coleta desistência.                │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE NÃO PASSA POR AQUI, E POR QUÊ                                  │
 * │                                                                       │
 * │  A etiqueta de campanha (`lib/campanha.ts`) não espera consentimento. │
 * │  Ela é de primeira parte, vive só na aba, não identifica ninguém e    │
 * │  não sai do aparelho — a menos que a própria pessoa preencha um       │
 * │  formulário, e aí ela sai como parte de um cadastro que a pessoa      │
 * │  escolheu enviar, com a finalidade declarada na /privacidade.         │
 * │                                                                       │
 * │  O que o GA4 faz é diferente em natureza: é um terceiro, recebendo    │
 * │  cada página vista e cada clique de quem não pediu nada. É essa       │
 * │  diferença que a linha separa.                                        │
 * └───────────────────────────────────────────────────────────────────────┘
 */

export type Decisao = 'aceito' | 'recusado';

/**
 * `localStorage`, e não `sessionStorage`: a escolha precisa sobreviver ao
 * fechamento da aba. Um aviso que reaparece a cada visita transforma a
 * recusa em pergunta repetida até a pessoa ceder — que é a definição de
 * consentimento não livre.
 */
const CHAVE = 'ibsdh:cookies';

const ouvintes = new Set<() => void>();

function ler(): Decisao | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === 'aceito' || valor === 'recusado' ? valor : null;
  } catch {
    /* Aba anônima ou armazenamento bloqueado. Sem poder guardar a escolha,
       o estado é "ainda não decidiu" — e na dúvida nada é medido, que é o
       lado seguro do erro. */
    return null;
  }
}

/** A decisão gravada, ou `null` para quem ainda não respondeu. */
export function decisaoDeCookies(): Decisao | null {
  return typeof window === 'undefined' ? null : ler();
}

/**
 * Grava a escolha. `null` apaga, e o aviso volta a aparecer — é o caminho
 * de quem clica em "rever minha escolha" na /privacidade.
 */
export function registrarDecisao(decisao: Decisao | null): void {
  try {
    if (decisao) localStorage.setItem(CHAVE, decisao);
    else localStorage.removeItem(CHAVE);
  } catch {
    /* Não poder gravar não pode travar a interface. O aviso reaparecerá na
       próxima visita, que é incômodo — e ainda assim melhor do que medir
       alguém cuja recusa não coube no aparelho. */
  }

  for (const ouvinte of ouvintes) ouvinte();
}

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);

  /* Duas abas abertas são a mesma pessoa: recusar numa e continuar sendo
     medido na outra seria ignorar a recusa. O evento `storage` só chega às
     OUTRAS abas, que é exatamente o alcance que falta ao laço acima. */
  const entreAbas = (e: StorageEvent) => {
    if (e.key === CHAVE) ouvinte();
  };
  window.addEventListener('storage', entreAbas);

  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener('storage', entreAbas);
  };
}

/**
 * A decisão, como estado de React.
 *
 * `null` na pré-renderização e na primeira pintura do cliente — as duas
 * PRECISAM produzir a mesma árvore, senão a hidratação descarta o HTML
 * que veio do servidor. Quem consome isto combina com `useMontado` para
 * só desenhar no segundo passe.
 */
export function useDecisaoDeCookies(): Decisao | null {
  return useSyncExternalStore(assinar, decisaoDeCookies, () => null);
}
