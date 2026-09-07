import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type Course, corDoCurso } from '../config/courses';
import { paletas } from '../lib/cores';
import { cn } from '../lib/utils';
import CourseImage from './CourseImage';

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
 * │  A ARTE VOLTOU AO TOPO DO CARD                                        │
 * │                                                                       │
 * │  Este espaço já foi uma faixa de 96px de cor chapada com um ícone     │
 * │  pequeno flutuando no canto: quase um décimo da altura do card gasto  │
 * │  em nada. Ela virou uma régua fina de 1px enquanto não havia imagem   │
 * │  nenhuma — as capas originais tinham sido destruídas na exportação.   │
 * │                                                                       │
 * │  Com as artes de volta, o topo passa a mostrar a arte da formação, e  │
 * │  a régua de cor continua acima dela. É o que a referência do Kronos   │
 * │  faz, e é o que separa um card de curso de uma linha de tabela de     │
 * │  preços: a pessoa reconhece o produto antes de ler o nome dele.       │
 * │                                                                       │
 * │  Quem não tem arte ainda (a Hipnoterapia) cai na reserva do           │
 * │  `CourseImage`, que ocupa exatamente a mesma altura — a grade não     │
 * │  desalinha, e fica evidente que falta um arquivo.                     │
 * │                                                                       │
 * │  Abaixo da arte vem a linha de dados: carga horária, aulas e          │
 * │  certificado. Card de curso sem esses três é uma promessa com um      │
 * │  preço embaixo — são eles que fazem a oferta parecer uma formação.    │
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
      {/* A régua de cor identifica o eixo. Usa a cor cheia, não o gradiente:
          com 28% de opacidade sobre fundo escuro ela não era vista. */}
      <div className={cn('h-1', p.fundo)} />

      {/* A arte da formação. `capaFaixa` é o recorte deitado do pôster, sem o
          nome do curso impresso — o card escreve esse nome logo abaixo, e as
          duas coisas juntas ficariam repetidas.

          A proporção fica NESTE invólucro, e não no CourseImage: por dentro
          ele usa `h-full`, e como o card é um item de grade com altura
          definida, esse `h-full` vencia o `aspect-ratio` e a arte esticava
          até a altura inteira do card. */}
      <div className="aspect-[3/2] w-full shrink-0 overflow-hidden border-b border-white/8">
        <CourseImage
          src={curso.capaFaixa}
          alt={`Arte da formação ${curso.title}`}
          title={curso.title}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
          width={860}
          height={573}
        />
      </div>

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
              <p className="font-display text-[26px] leading-none font-extrabold text-brand-cream">
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
                  className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-3.5 text-[14px] font-bold text-brand-cream transition-colors hover:border-white/40 hover:bg-white/5"
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
