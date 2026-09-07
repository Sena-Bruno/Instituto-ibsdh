import { type ReactNode, useRef } from 'react';
import { type NomeCor, paletas } from '../lib/cores';
import { useAntesDaPintura } from '../lib/useAntesDaPintura';
import { cn } from '../lib/utils';

/**
 * A seção do site.
 *
 * Duas regras que vieram da direção escolhida:
 *
 * · O BRILHO TEM DONO. Ele herda a cor da seção e só aparece onde a seção
 *   tem cor. Antes eram 33 orbes iguais, um em cada seção — como tudo
 *   brilhava do mesmo jeito, nada se destacava. Agora o brilho diz onde
 *   você está, e a maioria das seções não tem nenhum.
 *
 * · O TÍTULO É GRANDE. A hierarquia se lê de longe: `titulo-secao` é bem
 *   maior que o texto ao redor, e o sobretítulo em maiúsculas dá o assunto
 *   antes de a pessoa ler a frase.
 */

interface SecaoProps {
  id?: string;
  /** Cor que governa o brilho e o sobretítulo desta seção */
  cor?: NomeCor;
  /** Liga o brilho de fundo. Use com parcimônia: é o destaque mais caro. */
  brilho?: boolean;
  /** Posição do brilho, quando ligado */
  brilhoEm?: 'topo' | 'centro' | 'esquerda' | 'direita';
  /** Faixa de fundo mais clara, alternando o ritmo entre seções vizinhas */
  elevada?: boolean;
  className?: string;
  children: ReactNode;
}

const posicaoBrilho: Record<string, string> = {
  topo: '-top-40 left-1/2 -translate-x-1/2 w-[760px] h-[520px]',
  centro: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[620px]',
  esquerda: 'top-1/4 -left-40 w-[560px] h-[560px]',
  direita: 'top-1/4 -right-40 w-[560px] h-[560px]',
};

export default function Secao({
  id,
  cor,
  brilho = false,
  brilhoEm = 'topo',
  elevada = false,
  className,
  children,
}: SecaoProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden border-t border-white/5 py-20 md:py-28',
        elevada && 'bg-brand-band',
        className,
      )}
    >
      {brilho && (
        <div
          aria-hidden="true"
          className={cn('brilho', posicaoBrilho[brilhoEm])}
          style={
            {
              '--brilho': cor ? paletas[cor].brilho : paletas.accent.brilho,
            } as React.CSSProperties
          }
        />
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

/**
 * O cabeçalho de uma seção: sobretítulo, título e texto de apoio.
 * Existe como componente para que as sete páginas não divirjam em tamanho
 * e espaçamento, como divergiram antes.
 */
export function Cabecalho({
  sobretitulo,
  cor = 'accent',
  titulo,
  children,
  centralizado = false,
  className,
}: {
  sobretitulo?: string;
  cor?: NomeCor;
  titulo: ReactNode;
  /** Texto de apoio abaixo do título */
  children?: ReactNode;
  centralizado?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(centralizado && 'mx-auto text-center', 'max-w-3xl', className)}>
      {/* A régua colorida antes do sobretítulo.
          Custa oito pixels e é o que transforma dezesseis seções soltas numa
          sequência: o olho aprende que aquele traço marca começo de assunto e
          passa a achar o próximo sem ler. Foi o detalhe mais reaproveitável
          das referências.

          A cor é a do EIXO da seção — é aqui que a cor de formação continua
          fazendo trabalho de orientação depois de ter saído dos botões. */}
      {sobretitulo && (
        <div className={cn('mb-4 flex items-center gap-3.5', centralizado && 'justify-center')}>
          <span aria-hidden="true" className={cn('regua-secao', paletas[cor].fundo)} />
          <p className="sobretitulo">{sobretitulo}</p>
        </div>
      )}
      <h2 className="titulo-secao">{titulo}</h2>
      {children && (
        <p
          className={cn(
            'mt-5 text-[17px] leading-relaxed md:text-lg',
            centralizado && 'mx-auto',
          )}
        >
          {children}
        </p>
      )}
    </div>
  );
}

/**
 * Envelope que revela o conteúdo ao entrar na área visível.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO NÃO USA MAIS `motion` COM `initial="hidden"`            │
 * │                                                                       │
 * │  Era um `motion.div` com `initial="hidden"` e `whileInView`. Enquanto │
 * │  o site montava tudo no navegador, isso não custava nada: o HTML      │
 * │  chegava vazio e ninguém via o estado inicial.                        │
 * │                                                                       │
 * │  Com a pré-renderização, o estado inicial passou a ser gravado no     │
 * │  HTML: 34 blocos da home saíam com `style="opacity:0"` embutido. O    │
 * │  efeito, medido num navegador sem cabeça, era que 48% do texto da     │
 * │  home ficava invisível para quem renderiza sem rolar a página — e     │
 * │  28% mesmo num viewport de 9000px, parecido com o que o Googlebot     │
 * │  usa. O que sumia não era enfeite: depoimentos, as certificações e a  │
 * │  lista de onde os formados atuam.                                     │
 * │                                                                       │
 * │  A inversão resolve isso sem tirar a animação de ninguém:             │
 * │                                                                       │
 * │  · O HTML sai VISÍVEL. Nenhum estilo de opacidade é renderizado, no   │
 * │    servidor ou na primeira pintura do cliente — então a hidratação    │
 * │    também continua batendo.                                           │
 * │  · Quem tem JavaScript esconde o bloco em `useLayoutEffect`, que roda │
 * │    ANTES da pintura. Não há lampejo: o visitante nunca vê o conteúdo  │
 * │    aparecer e sumir.                                                  │
 * │  · Quem não tem JavaScript, ou não tem IntersectionObserver, fica com │
 * │    o conteúdo visível para sempre. O pior caso é não ter animação —   │
 * │    não é perder o texto.                                              │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A animação em si vive em `index.css`, nos seletores `[data-revela]`.
 */
export function Revela({
  children,
  className,
  atraso = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar uma sequência de blocos */
  atraso?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useAntesDaPintura(() => {
    const el = ref.current;
    if (!el) return;

    /* Sem IntersectionObserver não há como saber quando revelar, e um
       bloco escondido para sempre é pior do que um bloco sem animação. */
    if (typeof IntersectionObserver === 'undefined') return;

    /* Quem pediu menos movimento no sistema não recebe nem o estado
       escondido: o conteúdo simplesmente já está lá. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.dataset.revela = 'oculto';
    if (atraso) el.style.transitionDelay = `${atraso}s`;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          el.dataset.revela = 'visivel';
          // `once`: revelado uma vez, não volta a esconder ao rolar de volta.
          observador.disconnect();
        }
      },
      // A margem negativa dispara um pouco antes de o bloco encostar na borda.
      { rootMargin: '-60px' },
    );
    observador.observe(el);

    return () => observador.disconnect();
  }, [atraso]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
