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
    // Era uma pilha de cards arredondados com fundo próprio. Aqui é uma lista
    // com régua: um sumário de documento que se abre, não seis caixas.
    <div className={cn('border-t border-white/12', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-painel-${i}`;
        const buttonId = `faq-botao-${i}`;

        return (
          <div key={item.q} className="border-b border-white/8">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-baseline justify-between gap-4 py-5 text-left transition-colors hover:text-brand-accent"
              >
                <span className="dado shrink-0 text-[12px] text-brand-quiet">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[15.5px] font-semibold text-white">{item.q}</span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="shrink-0 text-brand-accent"
                >
                  <ChevronDown size={18} />
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
                  {/* Alinhado com a pergunta, não com a numeração: o recuo
                      da esquerda casa com a largura do dado + espaçamento. */}
                  <div className="pb-6 pl-[38px] text-[14.5px] leading-relaxed">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
