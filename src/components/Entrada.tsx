import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useAntesDaPintura } from '../lib/useAntesDaPintura';

/**
 * Bloco que sobe e aparece assim que a página abre.
 *
 * É o irmão de `Revela` (em `Secao.tsx`) para o conteúdo que já está na
 * dobra: o hero. Ambos existem pelo mesmo motivo, e é um motivo de busca,
 * não de design.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ACONTECIA ANTES                                                │
 * │                                                                       │
 * │  O hero era um `motion.div` com `initial={{ opacity: 0 }}`. Com o     │
 * │  site montado no navegador isso não custava nada — o HTML chegava     │
 * │  vazio e o estado inicial não existia em lugar nenhum.                │
 * │                                                                       │
 * │  Depois da pré-renderização, esse estado passou a ser gravado no      │
 * │  arquivo: a manchete, o vídeo e os fatos saíam com `opacity:0`        │
 * │  embutido. Medido num navegador com JavaScript desligado, o que um    │
 * │  robô de rede social ou um rastreador de IA lia da home era 5% do     │
 * │  texto. A promessa principal do site estava tecnicamente presente e   │
 * │  visualmente ausente.                                                 │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A inversão: o HTML sai visível e é o JavaScript que esconde, dentro da
 * janela entre montar o DOM e pintar a tela — então o visitante continua
 * vendo a animação inteira, sem lampejo, e quem não executa JavaScript
 * simplesmente lê o texto.
 *
 * Os estados vivem em `index.css`, nos seletores `[data-entrada]`.
 */
export default function Entrada({
  children,
  className,
  atraso = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar os blocos do hero */
  atraso?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useAntesDaPintura(() => {
    const el = ref.current;
    if (!el) return;
    // Quem pediu menos movimento não recebe nem o estado escondido.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.dataset.entrada = 'oculto';
    if (atraso) el.style.transitionDelay = `${atraso}s`;

    /* Dois quadros: o primeiro pinta o estado escondido, o segundo troca o
       atributo e a transição de CSS tem de onde partir. Com um só, o
       navegador junta as duas mudanças e o bloco aparece de uma vez. */
    let segundo = 0;
    const primeiro = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => {
        el.dataset.entrada = 'visivel';
      });
    });

    return () => {
      cancelAnimationFrame(primeiro);
      cancelAnimationFrame(segundo);
    };
  }, [atraso]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
