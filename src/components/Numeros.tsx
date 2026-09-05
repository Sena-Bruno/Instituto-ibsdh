import { cn } from '../lib/utils';

/**
 * A faixa de números grandes.
 *
 * Vem da direção E: a prova entra em escala, não em card. Os quatro selos de
 * confiança que o site tinha eram caixas arredondadas com ícone, título e
 * três linhas de texto cada — ocupavam uma seção inteira e liam-se como
 * mais um grid qualquer. Um número grande com uma legenda curta comunica a
 * mesma coisa e se lê de relance.
 *
 * A parte destacada do valor (o "+", o "h") sai em dourado, para o olho
 * pegar a unidade sem precisar ler.
 */

export interface Numero {
  valor: string;
  /** Sufixo destacado em dourado: "+", "h", "d" */
  sufixo?: string;
  legenda: string;
}

export default function Numeros({ itens, className }: { itens: Numero[]; className?: string }) {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10 lg:grid-cols-4',
        className,
      )}
    >
      {itens.map((item) => (
        <div key={item.legenda}>
          <dd className="font-display text-[40px] leading-none font-extrabold tracking-[-0.035em] text-brand-cream md:text-[46px]">
            {item.valor}
            {item.sufixo && <span className="text-brand-accent">{item.sufixo}</span>}
          </dd>
          <dt className="mt-3 text-[13.5px] leading-snug">{item.legenda}</dt>
        </div>
      ))}
    </dl>
  );
}
