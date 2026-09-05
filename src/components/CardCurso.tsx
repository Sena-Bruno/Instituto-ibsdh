import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../config/courses';
import { type NomeCor, paletas } from '../lib/cores';
import { cn } from '../lib/utils';

/**
 * O card de formação.
 *
 * A vitrine de cards volta — mas cada card agora é dono de uma cor, e a cor
 * é a mesma que ele terá na página, no botão e no brilho de fundo. Antes os
 * cards eram quase iguais e a cor era decoração aplicada por cima; aqui ela
 * é o que liga o card ao resto da jornada.
 *
 * Os dois botões continuam separados de propósito: "Matricular" vai direto
 * ao checkout e "Detalhes" abre a página. O site já teve um "Detalhes" que
 * era um <button> sem destino nenhum.
 */
export default function CardCurso({
  curso,
  cor,
  icone,
  selo,
  resumo,
  destaque = false,
}: {
  curso: Course;
  cor: NomeCor;
  icone: ReactNode;
  /** Texto do selo no topo do card: "Mais popular", "Requer o nível 01"… */
  selo?: string;
  resumo: string;
  /** Card de maior valor: ganha brilho e botão em gradiente */
  destaque?: boolean;
}) {
  const p = paletas[cor];

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[22px] border bg-brand-surface transition-colors duration-200',
        p.borda,
        p.bordaHover,
        destaque && 'shadow-[0_0_46px_rgba(229,195,101,0.13)]',
      )}
    >
      {/* A capa é o campo de cor do card. Substitui a foto que se perdeu na
          exportação, e não finge ser uma imagem. */}
      <div className={cn('flex h-24 items-center bg-gradient-to-br px-6', p.capa)}>
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark/55',
            p.texto,
          )}
        >
          {icone}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {selo && <p className={cn('sobretitulo mb-2.5', p.texto)}>{selo}</p>}

        <h3 className="titulo-card mb-2">{curso.title}</h3>
        <p className="mb-6 text-[14px] leading-relaxed">{resumo}</p>

        <div className="mt-auto">
          {curso.comingSoon ? (
            <>
              <p className={cn('mb-5 font-display text-[26px] font-extrabold', p.texto)}>
                Em breve
              </p>
              <Link to={curso.route} className="btn-outline w-full">
                Entrar na lista de espera
              </Link>
            </>
          ) : (
            <>
              <p className="font-display text-[26px] leading-none font-extrabold text-white">
                {curso.installment ? `12x ${curso.installment}` : curso.price}
              </p>
              {curso.installment && (
                <p className="mt-2 mb-5 text-[13px]">ou {curso.price} à vista</p>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={curso.checkout}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-center rounded-full py-3.5 text-[14px] font-bold text-brand-dark transition-transform',
                    destaque
                      ? 'bg-gradient-to-br from-brand-accent-light to-brand-accent'
                      : p.fundo,
                  )}
                >
                  Matricular
                </a>
                <Link
                  to={curso.route}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-3.5 text-[14px] font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  Detalhes
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
