import type { CSSProperties } from 'react';
import { cn } from '../lib/utils';

/**
 * Blocos de carregamento.
 *
 * A regra que vale mais aqui: o skeleton tem que ter o formato do que
 * vai chegar. Um retângulo genérico no lugar de uma lista de avaliações
 * só troca "vazio" por "cinza" — e ainda desloca o layout quando o
 * conteúdo real aparece. Por isso cada skeleton abaixo espelha a
 * estrutura do componente que substitui.
 *
 * O brilho é `animate-pulse` do Tailwind, que já respeita
 * prefers-reduced-motion pela regra global em index.css.
 */

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn('animate-pulse rounded-lg bg-white/10', className)}
    />
  );
}

/** Espelha um card de avaliação: estrelas, duas linhas de texto, autor. */
export function SkeletonReview() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-sm" />
        ))}
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-3 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Espelha uma linha da tabela de cadastros do painel. */
export function SkeletonRow() {
  return (
    <tr className="border-t border-white/5">
      {[40, 56, 28, 32].map((w, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Espelha o formato de uma página: título, subtítulo e blocos.
 * Usado enquanto o chunk da rota é baixado.
 */
export function SkeletonPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-36 pb-24" aria-hidden="true">
      <Skeleton className="h-4 w-32 mb-8" />
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-12 w-1/2 mb-8" />
      <Skeleton className="h-5 w-full mb-3" />
      <Skeleton className="h-5 w-11/12 mb-3" />
      <Skeleton className="h-5 w-4/5 mb-12" />
      <div className="grid sm:grid-cols-2 gap-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    </div>
  );
}
