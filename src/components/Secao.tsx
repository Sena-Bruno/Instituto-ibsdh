import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { type NomeCor, paletas } from '../lib/cores';
import { revealUp } from '../lib/motion';
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
 * `once` para não reanimar quem rola de volta, e margem negativa para
 * disparar um pouco antes de o bloco encostar na borda.
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
  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: atraso }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
