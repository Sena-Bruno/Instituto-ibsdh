import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../config/courses';
import { type NomeCor, paletas } from '../lib/cores';
import { cn } from '../lib/utils';
import RailCompra from './RailCompra';

/**
 * O esqueleto das páginas de formação.
 *
 * Cada formação é dona de uma cor, e a página inteira responde a ela: o
 * brilho de fundo, o sobretítulo de cada seção, o botão de matrícula e a
 * barra da trilha no topo. É o que liga o card da home a esta página.
 *
 * Duas mudanças de estrutura, além da cor:
 *
 * 1. COLUNA DE COMPRA FIXA. O preço aparecia no topo e só voltava a
 *    aparecer cerca de 900 pixels abaixo. No meio disso fica a ementa — o
 *    argumento que convence — e quem decidia comprar precisava procurar
 *    onde clicar. Agora preço e ação acompanham a leitura.
 *
 * 2. A TRILHA NO TOPO. Cada página era uma ilha: não dizia onde o curso
 *    fica na sequência, e o pré-requisito só aparecia no meio do texto.
 */

export interface PassoTrilha {
  rotulo: string;
  para?: string;
  atual?: boolean;
}

export default function PaginaCurso({
  curso,
  cor,
  trilha,
  selo,
  aviso,
  titulo,
  resumo,
  preRequisito,
  acao,
  especificacoes,
  children,
}: {
  curso: Course;
  cor: NomeCor;
  trilha: PassoTrilha[];
  /** Selo em pílula acima do título: "Mais popular", "Lançamento em breve"… */
  selo?: string;
  /** Tarja de responsabilidade, quando a formação tem módulos de ética */
  aviso?: ReactNode;
  titulo: string;
  resumo: ReactNode;
  preRequisito?: ReactNode;
  acao: string;
  especificacoes: { rotulo: string; valor: string }[];
  children: ReactNode;
}) {
  const p = paletas[cor];

  return (
    <main>
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
        <div
          aria-hidden="true"
          className="brilho -top-44 left-1/2 h-[540px] w-[880px] -translate-x-1/2"
          style={{ '--brilho': p.brilho } as React.CSSProperties}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Onde esta formação fica na sequência */}
          <nav aria-label="Posição na trilha de formações" className="mb-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold tracking-[0.1em] uppercase">
              {trilha.map((passo, i) => (
                <li key={passo.rotulo} className="flex items-center gap-2">
                  {i > 0 && (
                    <ChevronRight size={14} className="text-white/25" aria-hidden="true" />
                  )}
                  {passo.para && !passo.atual ? (
                    <Link
                      to={passo.para}
                      className="text-brand-quiet transition-colors hover:text-white"
                    >
                      {passo.rotulo}
                    </Link>
                  ) : (
                    <span
                      className={passo.atual ? p.texto : 'text-brand-quiet'}
                      aria-current={passo.atual ? 'step' : undefined}
                    >
                      {passo.rotulo}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {selo && <p className={cn('selo mb-6', p.borda, p.tenue, p.texto)}>{selo}</p>}

          {aviso && (
            <p className="selo mb-6 border-brand-danger/35 bg-brand-danger/10 text-brand-danger normal-case tracking-normal">
              {aviso}
            </p>
          )}

          <h1 className="titulo-hero max-w-4xl">{titulo}</h1>

          <div className="mt-6 max-w-2xl text-[17.5px] leading-relaxed md:text-lg">
            {resumo}
          </div>

          {preRequisito && (
            <div
              className={cn(
                'mt-8 max-w-2xl rounded-[18px] border bg-gradient-to-br from-white/[0.04] to-transparent p-6',
                p.borda,
              )}
            >
              {preRequisito}
            </div>
          )}
        </div>
      </section>

      {/* Corpo em duas colunas. `min-w-0` nos filhos do grid não é decoração:
          item de grid tem min-width:auto e não encolhe abaixo do conteúdo,
          então a tabela mais larga da ementa esticaria a coluna inteira e a
          página ganharia rolagem horizontal no celular. */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div className="order-2 min-w-0 lg:order-1">{children}</div>
          <div className="order-1 min-w-0 lg:order-2">
            <RailCompra curso={curso} cor={cor} acao={acao} especificacoes={especificacoes} />
          </div>
        </div>
      </div>
    </main>
  );
}

/** Uma seção dentro da coluna de conteúdo da página de curso. */
export function SecaoCurso({
  sobretitulo,
  cor,
  id,
  titulo,
  children,
  className,
}: {
  sobretitulo: string;
  cor: NomeCor;
  id?: string;
  titulo?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn('border-t border-white/8 py-12 first:border-t-0 first:pt-0', className)}
    >
      <p className={cn('sobretitulo mb-4', paletas[cor].texto)}>{sobretitulo}</p>
      {titulo && (
        <h2 className="mb-6 max-w-2xl font-display text-[27px] leading-tight font-bold tracking-[-0.025em] text-white md:text-[34px]">
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

/** Tabela comparativa de duas colunas. */
export function Comparativo({
  legenda,
  colunas,
  cor,
  linhas,
}: {
  legenda: string;
  colunas: [string, string];
  cor: NomeCor;
  linhas: { rotulo: string; a: ReactNode; b: ReactNode }[];
}) {
  const p = paletas[cor];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">{legenda}</caption>
        <thead>
          <tr className="border-b border-white/12">
            <th scope="col" className="w-1/5 py-4 pr-4">
              <span className="sr-only">Critério</span>
            </th>
            <th scope="col" className="py-4 pr-4 font-display text-[15px] font-bold text-white">
              {colunas[0]}
            </th>
            <th
              scope="col"
              className={cn('py-4 pl-5 font-display text-[15px] font-bold', p.texto)}
            >
              {colunas[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.rotulo} className="border-b border-white/[0.07] align-baseline">
              <th
                scope="row"
                className="py-4 pr-4 text-[12px] font-semibold tracking-[0.08em] text-brand-quiet uppercase"
              >
                {linha.rotulo}
              </th>
              <td className="py-4 pr-4 text-[14.5px] leading-snug">{linha.a}</td>
              <td
                className={cn(
                  'rounded-lg py-4 pl-5 text-[14.5px] leading-snug text-white',
                  p.tenue,
                )}
              >
                {linha.b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Lista de competências ou itens inclusos, com marcador na cor do curso. */
export function ListaItens({
  itens,
  cor,
  className,
}: {
  itens: { titulo: string; nota?: string }[];
  cor: NomeCor;
  className?: string;
}) {
  const p = paletas[cor];
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)}>
      {itens.map((item) => (
        <li key={item.titulo} className="cartao flex gap-3.5 p-5">
          <span
            className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', p.fundo)}
            aria-hidden="true"
          />
          <span>
            <span className="block font-semibold text-white">{item.titulo}</span>
            {item.nota && (
              <span className="mt-1 block text-[13.5px] leading-relaxed">{item.nota}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
