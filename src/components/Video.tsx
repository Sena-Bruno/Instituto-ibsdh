import { Play } from 'lucide-react';
import { useState } from 'react';
import type { Video } from '../config/midia';
import { type NomeCor, paletas } from '../lib/cores';
import { cn } from '../lib/utils';

/**
 * Reprodutor de vídeo com fachada.
 *
 * A fachada é o que evita o custo escondido do vídeo incorporado: um iframe
 * do YouTube carrega perto de um megabyte de scripts e abre uma dúzia de
 * conexões de rastreamento — antes de alguém decidir assistir. Numa página
 * de vendas, isso atrasa justamente o primeiro carregamento, que é o que
 * decide se a pessoa fica.
 *
 * Aqui a página mostra só a imagem e o botão de play. O player de verdade só
 * é montado quando alguém clica, e já entra tocando. Para quem não clica —
 * a maioria — o vídeo custa uma imagem.
 *
 * Arquivo próprio (`tipo: 'arquivo'`) não tem esse problema, então o
 * elemento <video> nativo entra direto, com `preload="none"`.
 */
export default function VideoPlayer({
  video,
  titulo,
  cor = 'accent',
  posterAlternativo,
  className,
}: {
  video: Video;
  /** Descreve o vídeo para quem usa leitor de tela e para o título do iframe */
  titulo: string;
  cor?: NomeCor;
  /** Imagem usada quando o vídeo não traz `poster` */
  posterAlternativo?: string;
  className?: string;
}) {
  const [tocando, setTocando] = useState(false);
  const p = paletas[cor];
  const poster = video.poster ?? posterAlternativo;

  if (tocando) {
    return (
      <div className={cn('relative aspect-video overflow-hidden rounded-[22px]', className)}>
        {video.tipo === 'arquivo' ? (
          <video
            src={video.src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full bg-black object-cover"
          >
            {/* A faixa de legenda fica declarada mesmo vazia: quando houver
                um arquivo .vtt, é só apontar o `src` aqui. */}
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            title={titulo}
            src={
              video.tipo === 'youtube'
                ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
                : `https://player.vimeo.com/video/${video.id}?autoplay=1`
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0 bg-black"
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      className={cn(
        'group relative block aspect-video w-full overflow-hidden rounded-[22px] border bg-brand-surface',
        p.borda,
        p.bordaHover,
        className,
      )}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
        />
      ) : (
        <span className={cn('absolute inset-0 bg-gradient-to-br', p.capa)} />
      )}

      {/* A camada escura garante contraste do botão sobre qualquer imagem. */}
      <span className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/20 to-transparent" />

      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-full pl-1 text-brand-dark shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none',
            p.fundo,
          )}
        >
          <Play size={26} fill="currentColor" aria-hidden="true" />
        </span>
      </span>

      <span className="absolute right-5 bottom-5 left-5 text-left text-[14.5px] font-semibold text-brand-cream">
        {titulo}
      </span>
    </button>
  );
}
