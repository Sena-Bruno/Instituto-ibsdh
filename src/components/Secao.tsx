import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { revealUp } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * A seção numerada da Direção B.
 *
 * Duas coisas que o site não tinha:
 *
 * 1. NUMERAÇÃO. Cada seção se anuncia como "§ 02 — MÉTODO", numa coluna à
 *    esquerda do conteúdo. É o que faz a página ler como documento de uma
 *    instituição em vez de rolagem de página de vendas. Também dá a quem
 *    chega uma noção de onde está e de quanto falta.
 *
 * 2. PESO. As 16 seções da home antiga tinham todas a mesma altura, o mesmo
 *    orbe de blur no fundo e o mesmo par badge + título + grid de cards.
 *    Como tudo pesava igual, nada ficava na memória. Aqui o peso é explícito
 *    e escasso: só o SENA é `maximo`, e só o hero e a ação final são `alto`.
 *    Se tudo virar `alto` de novo, a hierarquia se perde outra vez — é para
 *    ser um orçamento apertado, não uma opção de gosto.
 */

type Peso = 'maximo' | 'alto' | 'base' | 'compacto';

const alturaPorPeso: Record<Peso, string> = {
  maximo: 'py-28 md:py-40',
  alto: 'py-24 md:py-32',
  base: 'py-16 md:py-24',
  compacto: 'py-12 md:py-16',
};

interface SecaoProps {
  /** O número do parágrafo, como aparece: "01", "02"… */
  numero?: string;
  /** O rótulo em mono ao lado do número. Vai para maiúsculas no CSS. */
  rotulo?: string;
  peso?: Peso;
  id?: string;
  /** Liga a grade de fundo. Reservada para as seções de peso alto ou máximo:
   *  se aparecer em todas, volta a ser o problema dos orbes. */
  grade?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Secao({
  numero,
  rotulo,
  peso = 'base',
  id,
  grade = false,
  className,
  children,
}: SecaoProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative border-t border-white/8',
        alturaPorPeso[peso],
        grade && 'grade',
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-10 lg:gap-16">
          {/* A coluna da numeração. Em telas estreitas ela vira uma linha
              acima do conteúdo, porque 160px de recuo num celular comem
              metade da largura útil. */}
          {(numero || rotulo) && (
            <div className="mb-8 md:mb-0">
              <div className="rotulo-accent md:sticky md:top-28">
                {numero && <span aria-hidden="true">§ {numero}</span>}
                {numero && rotulo && <span aria-hidden="true"> — </span>}
                {rotulo}
              </div>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * O título de uma seção. Serif, tamanho grande, medida de linha curta.
 * Existe como componente para que os sete arquivos não divirjam em tamanho
 * e entrelinha como divergiram antes.
 */
export function SecaoTitulo({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag
      className={cn(
        'max-w-3xl font-display text-3xl leading-[1.12] font-semibold tracking-tight text-white sm:text-4xl md:text-[42px]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Texto de apoio logo abaixo do título. */
export function SecaoIntro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('mt-5 max-w-2xl text-[17px] leading-relaxed md:text-lg', className)}>
      {children}
    </p>
  );
}

/**
 * Envelope que revela o conteúdo ao entrar na área visível.
 * `once` para não reanimar quem rola de volta, e margem negativa para
 * disparar um pouco antes de o bloco encostar na borda.
 */
export function Revela({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
