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
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('w-full h-full object-cover', imgClassName, className)}
    />
  );
}
