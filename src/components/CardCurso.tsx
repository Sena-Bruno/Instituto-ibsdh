import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type Course, corDoCurso } from '../config/courses';
import { paletas } from '../lib/cores';
import { cn } from '../lib/utils';

/**
 * O card de formação.
 *
 * Recebe só o curso: cor, selo, resumo, preço, dados e situação saem todos
 * de `config/courses.ts`. É o que permite acrescentar um curso novo sem
 * tocar em componente nenhum — e o que garante que o card da home, o do
 * catálogo e o da página 404 nunca discordem entre si.
 *
 * A cor vem do EIXO do curso, não dele próprio: com vinte formações, uma
 * cor por curso esgotaria as cores distinguíveis e viraria uma tabela para
 * decorar, em vez de uma pista de reconhecimento.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  DUAS MUDANÇAS DEPOIS DA PRIMEIRA VERSÃO                              │
 * │                                                                       │
 * │  A capa era uma faixa de 96px de cor com um ícone pequeno flutuando   │
 * │  no canto — quase um décimo da altura do card gasto em nada. O ícone  │
 * │  desceu para a linha do título e a faixa virou uma régua fina: a cor  │
 * │  continua identificando o eixo, sem cobrar espaço por isso.           │
 * │                                                                       │
 * │  E entrou a linha de dados: carga horária, aulas e certificado. Card  │
 * │  de curso sem esses três é uma promessa com um preço embaixo — são    │
 * │  eles que fazem a oferta parecer uma formação, e não um anúncio.      │
 * └───────────────────────────────────────────────────────────────────────┘
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
  /** Ícone do card, exibido junto ao selo. */
  icone?: ReactNode;
}) {
  const p = paletas[corDoCurso(curso)];
  const emBreve = curso.situacao === 'emBreve';
  const dados = [curso.carga, curso.aulas, curso.certificado].filter(Boolean);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[22px] border bg-brand-surface transition-colors duration-200',
        p.borda,
        p.bordaHover,
      )}
    >
      {/* A régua de cor identifica o eixo sem gastar altura. Usa a cor cheia,
          não o gradiente da capa: com 28% de opacidade sobre fundo escuro ela
          simplesmente não era vista. */}
      <div className={cn('h-1', p.fundo)} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2.5">
          {icone && <span className={p.texto}>{icone}</span>}
          {curso.selo && <span className={cn('sobretitulo', p.texto)}>{curso.selo}</span>}
        </div>

        <h3 className="titulo-card mb-2">{curso.title}</h3>
        <p className="mb-5 text-[14px] leading-relaxed">{curso.resumo}</p>

        {/* Os dados objetivos. Sem eles o card é só promessa e preço. */}
        {dados.length > 0 && (
          <ul className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] text-brand-quiet">
            {dados.map((dado, i) => (
              <li key={dado} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-white/20">
                    ·
                  </span>
                )}
                {dado}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto border-t border-white/[0.07] pt-5">
          {emBreve ? (
            <>
              <p className={cn('mb-4 font-display text-[22px] font-extrabold', p.texto)}>
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
                    'flex items-center justify-center rounded-full py-3.5 text-[14px] font-bold text-brand-dark transition-opacity hover:opacity-90',
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
