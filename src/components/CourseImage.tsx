import { useState } from 'react';
import { cn } from '../lib/utils';

/**
 * Imagem com reserva visual.
 *
 * As capas dos cursos foram perdidas: a exportação do projeto passou os
 * binários por uma decodificação UTF-8, que trocou a assinatura PNG e cerca
 * de um quinto de cada arquivo pelo caractere de substituição — dano
 * irreversível. Enquanto os originais não voltam, uma imagem ausente ou
 * quebrada vira um bloco em gradiente da marca com o nome do curso, em vez
 * do ícone de imagem quebrada do navegador.
 *
 * Serve também como proteção permanente: se um arquivo sumir do servidor,
 * o layout continua íntegro.
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
  accentClassName = 'from-brand-accent/25 to-brand-dark',
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
  accentClassName?: string;
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
          'w-full h-full flex items-center justify-center bg-gradient-to-br p-6 text-center',
          accentClassName,
          className,
        )}
      >
        <span className="font-display font-bold text-white/90 text-lg md:text-xl leading-tight drop-shadow">
          {title ?? alt}
        </span>
      </div>
    );
  }

  return (
    // A imagem entra sobre um fundo do tom da marca em vez de aparecer
    // de uma vez sobre o vazio. Com lazy loading, o "pipocar" acontece
    // no meio da rolagem, bem no campo de visão de quem lê.
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-br transition-opacity duration-500',
          accentClassName,
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse',
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
