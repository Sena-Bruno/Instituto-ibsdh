import { Play } from 'lucide-react';
import { useState } from 'react';
import type { Depoimento } from '../config/depoimentos';

/**
 * Um depoimento em vídeo, dentro de uma moldura de celular.
 *
 * O formato veio da referência do Instituto Mix que o Bruno apontou, e a
 * moldura não é enfeite: ela diz, antes de qualquer leitura, que o vídeo foi
 * gravado por uma pessoa no celular dela, e não produzido por uma agência.
 * Depoimento com cara de produção publicitária levanta a suspeita que o
 * depoimento existe para desfazer.
 *
 * Como o `Video`, este reprodutor usa fachada: a imagem e o botão de play são
 * estáticos, e o player só é montado no clique. Numa fileira de três, montar
 * três iframes do YouTube de saída custaria perto de três megabytes antes de
 * alguém decidir assistir a um.
 *
 * O nome e a profissão ficam DENTRO da moldura, sobre um degradê, e a citação
 * fica fora, embaixo. É o arranjo da referência, e funciona porque a citação
 * é longa demais para caber legível sobre a imagem.
 */
export default function DepoimentoVideo({ dep }: { dep: Depoimento }) {
  const [tocando, setTocando] = useState(false);
  /* Miniatura que não carrega cai para as iniciais. O endereço do YouTube
     abaixo é derivado, não conferido: se o vídeo for privado ou o id estiver
     errado, ele responde 404 e a moldura ficaria com o ícone de imagem
     quebrada dentro. */
  const [posterFalhou, setPosterFalhou] = useState(false);
  const video = dep.video;
  if (!video) return null;

  /* A ordem importa. Um `poster` próprio é sempre o melhor resultado: o
     vídeo de depoimento é vertical, e a miniatura que o YouTube gera é 16:9
     com tarjas pretas em cima e embaixo, que ao ser recortada para o formato
     do celular vira quase só tarja.

     Mesmo assim vale derivar a miniatura do YouTube quando não há poster:
     ela é ruim, e um celular preto e vazio é pior. `hqdefault` existe para
     todo vídeo — `maxresdefault` só para alguns, e falha em silêncio.

     É o único endereço de terceiro que o site carrega, e é justificável:
     vem do mesmo serviço que hospeda o vídeo, então se ele cair o vídeo já
     não tocaria de qualquer forma. */
  const posterEscolhido =
    video.poster ??
    dep.poster ??
    (video.tipo === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : undefined);
  const poster = posterFalhou ? undefined : posterEscolhido;
  const src =
    video.tipo === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
      : video.tipo === 'vimeo'
        ? `https://player.vimeo.com/video/${video.id}?autoplay=1`
        : undefined;

  return (
    <figure className="flex flex-col items-center">
      {/* A moldura. O entalhe no topo e a borda grossa são o que fazem a
          silhueta ser reconhecida como celular sem precisar de legenda. */}
      <div className="relative w-full max-w-[248px] rounded-[38px] border-[7px] border-brand-muted bg-brand-dark shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 z-20 h-2 w-16 -translate-x-1/2 rounded-full bg-brand-muted"
        />

        <div className="relative aspect-[9/16] overflow-hidden rounded-[31px]">
          {tocando && src ? (
            <iframe
              title={`Depoimento de ${dep.nome}`}
              src={src}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0 bg-black"
            />
          ) : tocando && video.tipo === 'arquivo' ? (
            <video
              src={video.src}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="h-full w-full bg-black object-cover"
            >
              {/* Declarada mesmo vazia: havendo um .vtt, é só apontar o src. */}
              <track kind="captions" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setTocando(true)}
              className="group block h-full w-full"
              aria-label={`Assistir ao depoimento de ${dep.nome}, ${dep.papel}`}
            >
              {/* As iniciais ficam ATRÁS da miniatura, sempre desenhadas, em
                  vez de num ramo alternativo do `if`.

                  Com `onError` sozinho a moldura ficava preta quando a
                  requisição da miniatura travava em vez de falhar — e
                  travar é o que uma rede ruim faz com mais frequência do
                  que devolver erro. Atrás, elas aparecem em qualquer um dos
                  dois casos e somem sozinhas quando a imagem pinta por
                  cima. O `onError` fica, para o 404 explícito.

                  Elas são grandes e apagadas de propósito: a 44px e no tom
                  do texto comum ficavam exatamente atrás do botão de play,
                  que tem 56px e as cobria por inteiro. Como monograma de
                  fundo, sobram para fora do botão e continuam legíveis. */}
              <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-elevated to-brand-dark font-display text-[86px] leading-none font-bold text-white/12">
                {dep.iniciais}
              </span>

              {poster && (
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setPosterFalhou(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <span className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/20" />

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 bg-brand-dark/35 pl-0.5 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  <Play
                    size={22}
                    fill="currentColor"
                    className="text-white"
                    aria-hidden="true"
                  />
                </span>
              </span>

              <span className="absolute right-4 bottom-4 left-4 text-left">
                <span className="block font-display text-[16px] font-semibold text-brand-cream">
                  {dep.nome}
                </span>
                <span className="block text-[13px] text-white/75">{dep.papel}</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-5 max-w-[280px] text-center text-[14px] leading-relaxed text-brand-platinum italic">
        “{dep.texto}”
      </figcaption>
    </figure>
  );
}
