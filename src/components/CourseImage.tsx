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
 * A reserva era um bloco em gradiente com o nome em tipo grande, e por isso
 * chamava mais atenção que uma foto de verdade chamaria — uma ausência
 * ganhando destaque. Na Direção B ela é uma placa técnica: hachura, régua e
 * rótulo em mono. Fica claro que falta um arquivo, sem competir com o
 * conteúdo ao redor.
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
          'hachura flex h-full w-full flex-col items-start justify-end gap-2 border border-white/10 p-5',
          className,
        )}
      >
        <span className="rotulo">Imagem pendente</span>
        <span className="text-[15px] leading-tight font-semibold text-white/85">
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
          'hachura absolute inset-0 transition-opacity duration-500',
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
