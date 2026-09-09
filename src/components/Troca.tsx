import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { troca } from '../lib/motion';

/**
 * Substitui um conteúdo por outro no mesmo lugar, com passagem suave.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  O site tinha quatro lugares com a mesma falha, todos no formato      │
 * │  `if (estado) return <outraCoisa/>`:                                  │
 * │                                                                       │
 * │  · o formulário da lista de espera virando confirmação;               │
 * │  · as quatro telas do /admin (verificando, login, sem acesso, lista); │
 * │  · a fachada do vídeo virando player, em dois componentes.            │
 * │                                                                       │
 * │  Em todos, o bloco antigo desaparecia no mesmo quadro em que o novo   │
 * │  aparecia. Depois de uma ação, corte seco é lido como falha, não como │
 * │  conclusão: quem envia o formulário não vê o envio terminar, vê a     │
 * │  tela pular. É o item "smooth handoff, not instantaneous replacement" │
 * │  da auditoria do design-motion-principles.                            │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * `mode="wait"` é deliberado: o bloco que sai termina antes de o próximo
 * entrar. Com os dois sobrepostos, alturas diferentes brigam pelo mesmo
 * espaço e a página salta — que é pior do que o corte que estamos
 * consertando. As durações somadas ficam em 350ms, dentro da faixa.
 *
 * `initial={false}` garante que a PRIMEIRA renderização saia pronta, sem
 * animação. Isso não é detalhe: o site é pré-renderizado, e um
 * `initial="hidden"` gravaria `opacity:0` no HTML servido — quem não
 * executa JavaScript veria a página em branco. O `npm run smoke` mede
 * exatamente isso e falha abaixo de 95% de texto visível.
 *
 * A `chave` é o que dispara a troca: quando ela muda, o Motion entende
 * que é outro conteúdo. Passar um valor que não muda desliga a animação
 * em silêncio.
 */
export default function Troca({
  chave,
  children,
  className,
}: {
  /** Identifica o conteúdo atual. Mudar isto é o que anima. */
  chave: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={chave}
        variants={troca}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
