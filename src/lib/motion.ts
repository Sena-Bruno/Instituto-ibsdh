import type { Transition, Variants } from 'motion/react';

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
  /** Retorno imediato: hover, foco, troca de cor */
  instant: 0.12,
  /** Padrão de interface: abrir menu, revelar painel */
  fast: 0.2,
  /** Entrada de conteúdo ao rolar a página */
  base: 0.35,
  /** Blocos grandes, imagem entrando */
  slow: 0.5,
} as const;

/** Mola sem repique. Repique chama atenção para o movimento, que é
 *  justamente o que se quer evitar em conteúdo de venda. */
export const spring: Transition = {
  type: 'spring',
  duration: 0.45,
  bounce: 0,
};

/**
 * Entrada de conteúdo ao entrar na área visível.
 * Deslocamento curto e desfoque leve: sugere profundidade sem que a
 * página pareça "montar" na frente de quem lê.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** Igual ao revealUp, sem deslocamento — para elementos que já estão
 *  no lugar certo e só precisam surgir. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
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
 * Troca de rota. Bem contido de propósito: trocar de página é frequente,
 * e animação longa aqui vira imposto cobrado em toda navegação.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.instant, ease: ease.in } },
};

/** Configuração padrão de `whileInView`: anima uma vez só, e dispara
 *  um pouco antes de o elemento encostar na borda da tela. */
export const inView = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -80px 0px',
} as const;
