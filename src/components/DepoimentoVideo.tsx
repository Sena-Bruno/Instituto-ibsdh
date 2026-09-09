import { Play } from 'lucide-react';
import { useState } from 'react';
import type { Depoimento } from '../config/depoimentos';
import Troca from './Troca';

/**
 * Um depoimento dentro de uma moldura de celular.
 *
 * O formato veio da referência do Instituto Mix que o Bruno apontou, e a
 * moldura não é enfeite: ela diz, antes de qualquer leitura, que aquilo foi
 * gravado por uma pessoa no celular dela, e não produzido por uma agência.
 * Depoimento com cara de produção publicitária levanta a suspeita que o
 * depoimento existe para desfazer.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  A MOLDURA APARECE SEMPRE — COM OU SEM VÍDEO                          │
 * │                                                                       │
 * │  Na primeira versão a seção só trocava de formato quando houvesse um  │
 * │  vídeo preenchido. Na prática isso queria dizer que nada mudava: sem  │
 * │  vídeo gravado, a página continuava idêntica à de antes, e o formato  │
 * │  novo existia só no código.                                           │
 * │                                                                       │
 * │  Agora o celular aparece sempre, e o que muda é o conteúdo dele:      │
 * │                                                                       │
 * │  · COM vídeo   — quadro de abertura, botão de play, e o vídeo toca    │
 * │                  ali dentro.                                          │
 * │  · SEM vídeo   — a citação ocupa a tela do celular, como um post, com │
 * │                  o monograma do aluno ao fundo. E não há botão de     │
 * │                  play: botão que não toca nada é promessa quebrada.   │
 * │                                                                       │
 * │  Preencher `video` em `config/depoimentos.ts` faz a troca acontecer   │
 * │  sozinha, um aluno de cada vez.                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Com vídeo, o reprodutor usa fachada: a imagem e o botão são estáticos, e o
 * player só é montado no clique. Numa fileira de três, montar três iframes do
 * YouTube de saída custaria perto de três megabytes antes de alguém decidir
 * assistir a um.
 */
export default function DepoimentoVideo({ dep }: { dep: Depoimento }) {
  const [tocando, setTocando] = useState(false);
  /* Miniatura que não carrega cai para o monograma. O endereço do YouTube
     abaixo é derivado, não conferido: se o vídeo for privado ou o id estiver
     errado, ele responde 404 e a moldura ficaria com o ícone de imagem
     quebrada dentro. */
  const [posterFalhou, setPosterFalhou] = useState(false);

  const video = dep.video;

  /* A ordem importa. Um `poster` próprio é sempre o melhor resultado: o vídeo
     de depoimento é vertical, e a miniatura que o YouTube gera é 16:9 com
     tarjas pretas em cima e embaixo, que ao ser recortada para o formato do
     celular vira quase só tarja.

     Mesmo assim vale derivar a miniatura quando não há poster: ela é ruim, e
     um celular preto é pior. `hqdefault` existe para todo vídeo —
     `maxresdefault` só para alguns, e falha em silêncio.

     É o único endereço de terceiro que o site carrega, e é justificável: vem
     do mesmo serviço que hospeda o vídeo, então se ele cair o vídeo já não
     tocaria de qualquer forma. */
  const posterEscolhido =
    video?.poster ??
    dep.poster ??
    (video?.tipo === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : undefined);
  const poster = posterFalhou ? undefined : posterEscolhido;

  const src =
    video?.tipo === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
      : video?.tipo === 'vimeo'
        ? `https://player.vimeo.com/video/${video.id}?autoplay=1`
        : undefined;

  /* O monograma. Grande e apagado de propósito: no tamanho do texto comum ele
     ficava exatamente atrás do botão de play, de 56px, que o cobria por
     inteiro. Como marca-d'água, sobra para fora do botão. */
  const monograma = (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-elevated to-brand-dark font-display text-[86px] leading-none font-bold text-white/12"
    >
      {dep.iniciais}
    </span>
  );

  const rodape = (
    <span className="absolute right-4 bottom-4 left-4 text-left">
      <span className="block font-display text-[16px] font-semibold text-brand-cream">
        {dep.nome}
      </span>
      <span className="block text-[13px] text-white/75">{dep.papel}</span>
    </span>
  );

  return (
    <figure className="flex w-full flex-col items-center">
      <div className="relative w-full max-w-[248px] rounded-[38px] border-[7px] border-brand-muted bg-brand-dark shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
        {/* O entalhe no topo é o que faz a silhueta ser reconhecida como
            celular sem precisar de legenda. */}
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 z-20 h-2 w-16 -translate-x-1/2 rounded-full bg-brand-muted"
        />

        <div className="relative aspect-[9/16] overflow-hidden rounded-[31px]">
          {/* `h-full w-full` no <Troca> porque ele insere uma div entre este
              contêiner e os filhos, e todos eles se dimensionam por `h-full`:
              sem isso a moldura do celular colapsaria. */}
          <Troca
            chave={tocando ? 'player' : video ? 'fachada' : 'citacao'}
            className="h-full w-full"
          >
            {tocando && src ? (
              <iframe
                title={`Depoimento de ${dep.nome}`}
                src={src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0 bg-black"
              />
            ) : tocando && video?.tipo === 'arquivo' ? (
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
            ) : video ? (
              <button
                type="button"
                onClick={() => setTocando(true)}
                className="group block h-full w-full"
                aria-label={`Assistir ao depoimento de ${dep.nome}, ${dep.papel}`}
              >
                {/* O monograma fica ATRÁS da miniatura, sempre desenhado, e não
                  num ramo alternativo do `if`. Com `onError` sozinho a moldura
                  ficava preta quando a requisição travava em vez de falhar — e
                  travar é o que uma rede ruim faz com mais frequência do que
                  devolver erro. */}
                {monograma}
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
                {rodape}
              </button>
            ) : (
              /* Sem vídeo: a citação ocupa a tela do celular, como um post.
               Sem botão de play, porque não há o que tocar. */
              <div className="relative h-full w-full">
                {monograma}
                <span className="absolute inset-0 bg-gradient-to-t from-brand-dark/92 via-brand-dark/25 to-transparent" />
                <blockquote className="absolute inset-x-5 top-7 bottom-24 flex items-center text-center text-[14.5px] leading-relaxed text-brand-cream">
                  <p>“{dep.texto}”</p>
                </blockquote>
                {rodape}
              </div>
            )}
          </Troca>
        </div>
      </div>

      {/* A citação embaixo só existe quando ela NÃO está dentro do celular —
          senão apareceria duas vezes na mesma peça. */}
      {video && (
        <figcaption className="mt-5 max-w-[280px] text-center text-[14px] leading-relaxed text-brand-platinum italic">
          “{dep.texto}”
        </figcaption>
      )}
    </figure>
  );
}
