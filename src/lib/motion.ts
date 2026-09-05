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
  /** Retorno imediato: hover, foco, troca de cor */
  instant: 0.12,
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
 * Troca de rota. Bem contido de propósito: trocar de página é frequente,
 * e animação longa aqui vira imposto cobrado em toda navegação.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.instant, ease: ease.in } },
};
