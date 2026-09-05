import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type Course, corDoCurso } from '../config/courses';
import { paletas } from '../lib/cores';
import { cn } from '../lib/utils';

/**
 * O card de formação.
 *
 * Recebe só o curso: cor, selo, resumo, preço e situação saem todos de
 * `config/courses.ts`. É o que permite acrescentar um curso novo sem tocar
 * em componente nenhum — e o que garante que o card da home, o do catálogo
 * e o da página 404 nunca discordem entre si.
 *
 * A cor vem do EIXO do curso, não dele próprio: com vinte formações, uma
 * cor por curso esgotaria as cores distinguíveis e viraria uma tabela para
 * decorar, em vez de uma pista de reconhecimento.
 *
 * Os dois botões continuam separados de propósito: "Matricular" vai direto
 * ao checkout e "Detalhes" abre a página. O site já teve um "Detalhes" que
 * era um <button> sem destino nenhum.
 */
export default function CardCurso({
  curso,
  icone,
}: {
  curso: Course;
  /** Ícone do card. Sem ele, a capa fica só com o campo de cor. */
  icone?: ReactNode;
}) {
  const p = paletas[corDoCurso(curso)];
  const emBreve = curso.situacao === 'emBreve';

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[22px] border bg-brand-surface transition-colors duration-200',
        p.borda,
        p.bordaHover,
      )}
    >
      {/* A capa é o campo de cor do card. Substitui a foto que se perdeu na
          exportação, e não finge ser uma imagem. */}
      <div className={cn('flex h-24 items-center bg-gradient-to-br px-6', p.capa)}>
        {icone && (
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark/55',
              p.texto,
            )}
          >
            {icone}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {curso.selo && <p className={cn('sobretitulo mb-2.5', p.texto)}>{curso.selo}</p>}

        <h3 className="titulo-card mb-2">{curso.title}</h3>
        <p className="mb-6 text-[14px] leading-relaxed">{curso.resumo}</p>

        <div className="mt-auto">
          {emBreve ? (
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
                    p.fundo,
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
