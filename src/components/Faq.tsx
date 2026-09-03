import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className={cn('space-y-4', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-painel-${i}`;
        const buttonId = `faq-botao-${i}`;

        return (
          <div
            key={item.q}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors hover:bg-white/10"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left font-bold text-white"
              >
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 text-brand-accent transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                  size={20}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-6 text-brand-platinum/80 leading-relaxed"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
