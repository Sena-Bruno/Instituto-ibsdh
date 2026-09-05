import { useState } from 'react';
import { cn } from '../lib/utils';

/**
 * Imagem com reserva visual.
 *
 * As capas dos cursos foram perdidas: a exportação do projeto passou os
 * binários por uma decodificação UTF-8, que trocou a assinatura PNG e cerca
 * de um quinto de cada arquivo pelo caractere de substituição — dano
 * irreversível. Enquanto os originais não voltam, uma imagem ausente ou
 * quebrada vira uma reserva com o nome do curso, em vez do ícone de imagem
 * quebrada do navegador.
 *
 * Serve também como proteção permanente: se um arquivo sumir do servidor,
 * o layout continua íntegro.
 *
 * A reserva é um campo de cor discreto com o nome do curso, não uma imagem
 * falsa: fica claro que falta um arquivo, sem competir com o conteúdo ao
 * redor nem chamar mais atenção do que a foto real chamaria.
 */
export default function CourseImage({
  src,
  alt,
  title,
  className,
  imgClassName,
  width,
  height,
  loading = 'lazy',
}: {
  src?: string;
  alt: string;
  /** Texto mostrado na reserva; por padrão usa o alt */
  title?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);

  /**
   * Uma imagem já em cache pode terminar de carregar antes de o React
   * ligar o onLoad — o evento se perde e a imagem ficaria invisível para
   * sempre. Este ref confere `complete` assim que o elemento existe,
   * cobrindo esse caso ao voltar para uma página já visitada.
   */
  const imgRef = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  };

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex h-full w-full flex-col items-start justify-end gap-2 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6',
          className,
        )}
      >
        <span className="sobretitulo text-brand-accent">Imagem pendente</span>
        <span className="font-display text-[17px] leading-tight font-bold text-white/90">
          {title ?? alt}
        </span>
      </div>
    );
  }

  return (
    // A imagem entra sobre uma reserva do tom da marca em vez de aparecer
    // de uma vez sobre o vazio. Com lazy loading, o "pipocar" acontece
    // no meio da rolagem, bem no campo de visão de quem lê.
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-white/[0.07] to-white/[0.02] transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          'relative w-full h-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}
