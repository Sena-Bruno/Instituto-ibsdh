import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { collapse, duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Acordeão de perguntas frequentes.
 *
 * O site tinha três implementações diferentes do mesmo componente. Em três
 * das cinco páginas de curso o acordeão era um <div onClick> sem role,
 * tabIndex nem onKeyDown — não abria pelo teclado, e leitor de tela não
 * anunciava que era clicável. As outras duas já usavam <button>, o que
 * mostra que a diferença era regressão de copiar e colar, não decisão de
 * design. Aqui fica um só, com <button> e aria-expanded.
 */
export default function Faq({
  items,
  className,
}: {
  items: readonly FaqItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-painel-${i}`;
        const buttonId = `faq-botao-${i}`;

        return (
          <div key={item.q} className="cartao overflow-hidden hover:border-white/20">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="flex-1 font-display text-[16.5px] font-bold text-brand-cream">
                  {item.q}
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="shrink-0 text-brand-accent"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
            </h3>

            {/* AnimatePresence dá saída ao painel: sem ele, fechar era um
                corte seco enquanto abrir era animado — assimetria que faz o
                fechamento parecer falha. */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  variants={collapse}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-[14.5px] leading-relaxed">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
