import type { Variants } from 'motion/react';

/**
 * Sistema de movimento do site.
 *
 * Segue os princípios de design-motion-principles (kylezantos), com a
 * lente indicada para site de marketing: polimento sutil e discreto,
 * na faixa de 200–500ms — e movimento rápido ou nenhum em navegação e
 * formulários, que são de uso frequente.
 *
 * A regra que guia tudo: "a melhor animação é a que passa despercebida".
 * Se o visitante repara na animação em vez do conteúdo, ela está grande
 * demais para um site que precisa vender.
 *
 * Toda a duração fica aqui em vez de espalhada pelo JSX, pelo mesmo
 * motivo de preços e contatos: valores repetidos divergem com o tempo.
 */

/** Curvas. Entrada com ease-out (o elemento chega e desacelera);
 *  saída com ease-in (parte e acelera para fora). */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  /**
   * Retorno imediato: hover, foco, troca de cor.
   *
   * 150ms é piso, não escolha estética: abaixo disso a transição de hover
   * é percebida como corte, e a checklist de auditoria do
   * design-motion-principles trata 150–200ms como o mínimo para mudança
   * de estado no ponteiro. Estava em 120ms.
   */
  instant: 0.15,
  /** Padrão de interface: abrir menu, revelar painel */
  fast: 0.2,
  /** Entrada de conteúdo ao rolar a página */
  base: 0.35,
  /** Blocos grandes, imagem entrando */
  slow: 0.5,
} as const;

/**
 * Entrada de conteúdo ao entrar na área visível.
 *
 * Era opacidade + deslocamento + blur(4px). O desfoque saiu junto com o
 * resto do desfoque decorativo da Direção B: numa página que se apresenta
 * como documento, texto que entra fora de foco contradiz a premissa. Só
 * opacidade e um deslocamento curto — o bastante para dar ordem de leitura.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/**
 * Entrada em cascata de uma lista.
 * 60ms entre itens: o bastante para o olho perceber ordem, pouco o
 * bastante para a lista inteira terminar em menos de meio segundo.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/**
 * Painel que abre e fecha (FAQ, menu).
 * A saída é mais curta que a entrada — fechar deve parecer imediato,
 * abrir pode ter um instante de graça.
 */
export const collapse: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: duration.fast, ease: ease.in },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: duration.base, ease: ease.out },
  },
};

/**
 * Substituição de conteúdo no mesmo lugar da tela.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ISTO RESOLVE                                                   │
 * │                                                                       │
 * │  O padrão que faltava no site. Quatro lugares trocavam a tela inteira │
 * │  num corte seco: o formulário da lista de espera virando confirmação, │
 * │  as quatro telas do /admin, e as duas fachadas de vídeo virando       │
 * │  player. Em todos, um `if (estado) return outraCoisa` — o bloco       │
 * │  anterior desaparecia no mesmo quadro em que o novo aparecia.         │
 * │                                                                       │
 * │  Corte seco depois de uma ação é lido como falha, não como conclusão: │
 * │  quem enviou o formulário não vê o envio terminar, vê a tela pular.   │
 * │  É o item "loading-to-content: smooth handoff, not instantaneous      │
 * │  replacement" da auditoria de movimento.                              │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A saída é mais curta e não desloca: só opacidade. Quem sai não deve
 * disputar atenção com quem entra — e um `y` na saída, somado ao `y` da
 * entrada, faz o bloco parecer que escorrega.
 *
 * Usado pelo componente `Troca`, que é o que o JSX chama.
 */
export const troca: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: ease.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.instant, ease: ease.in },
  },
};

/**
 * Troca de rota. Bem contido de propósito: trocar de página é frequente,
 * e animação longa aqui vira imposto cobrado em toda navegação.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.instant, ease: ease.in } },
};
