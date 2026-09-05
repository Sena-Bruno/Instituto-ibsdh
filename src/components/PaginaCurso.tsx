import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../config/courses';
import { cn } from '../lib/utils';
import RailCompra from './RailCompra';

/**
 * O esqueleto das páginas de formação.
 *
 * Duas mudanças de estrutura, além da linguagem visual:
 *
 * 1. COLUNA DE COMPRA FIXA. O preço aparecia no topo e só voltava a
 *    aparecer cerca de 900 pixels abaixo. No meio disso fica a ementa — o
 *    argumento que convence — e quem decidia comprar precisava procurar
 *    onde clicar. Agora preço e ação acompanham a leitura.
 *
 * 2. A TRILHA NO TOPO. Cada página era uma ilha: não dizia onde o curso
 *    fica na sequência, e o pré-requisito só aparecia no meio do texto.
 *    A faixa superior mostra a posição na trilha, e o pré-requisito é a
 *    primeira coisa depois do título.
 */

export interface PassoTrilha {
  rotulo: string;
  para?: string;
  atual?: boolean;
}

export default function PaginaCurso({
  curso,
  trilha,
  aviso,
  titulo,
  resumo,
  preRequisito,
  acao,
  especificacoes,
  children,
}: {
  curso: Course;
  /** Onde este curso fica na sequência de formações */
  trilha: PassoTrilha[];
  /** Tarja de responsabilidade, quando a formação tem módulos de ética */
  aviso?: ReactNode;
  titulo: string;
  resumo: ReactNode;
  /** Bloco de pré-requisito, logo abaixo do resumo */
  preRequisito?: ReactNode;
  acao: string;
  especificacoes: { rotulo: string; valor: string }[];
  children: ReactNode;
}) {
  return (
    <main>
      {/* A trilha: onde esta formação fica na sequência */}
      <nav
        aria-label="Posição na trilha de formações"
        className="border-b border-white/12 pt-24 md:pt-28"
      >
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-6 py-3.5">
          {trilha.map((passo, i) => (
            <li key={passo.rotulo} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-brand-quiet">
                  →
                </span>
              )}
              {passo.para && !passo.atual ? (
                <Link
                  to={passo.para}
                  className="rotulo transition-colors hover:text-brand-accent"
                >
                  {passo.rotulo}
                </Link>
              ) : (
                <span
                  className={passo.atual ? 'rotulo-accent' : 'rotulo'}
                  aria-current={passo.atual ? 'step' : undefined}
                >
                  {passo.rotulo}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grade border-b border-white/8">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          {aviso && (
            <p className="mb-7 inline-flex items-center gap-2.5 border border-brand-danger/40 bg-brand-danger/[0.08] px-4 py-2.5 text-[13px] text-brand-danger">
              {aviso}
            </p>
          )}

          <h1 className="max-w-3xl font-display text-[38px] leading-[1.06] font-semibold tracking-tight text-white sm:text-5xl md:text-[56px]">
            {titulo}
          </h1>

          <div className="mt-6 max-w-2xl text-[17px] leading-relaxed md:text-lg">{resumo}</div>

          {preRequisito && (
            <div className="mt-8 max-w-2xl border-l-2 border-brand-accent bg-brand-accent/[0.05] px-5 py-4">
              {preRequisito}
            </div>
          )}
        </div>
      </div>

      {/* Corpo em duas colunas: conteúdo à esquerda, compra fixa à direita.
          Em telas estreitas a coluna de compra vem primeiro, para que o
          preço não fique enterrado sob a página inteira. */}
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_336px] lg:gap-16">
          <div className="order-2 lg:order-1">{children}</div>
          <div className="order-1 lg:order-2">
            <RailCompra curso={curso} acao={acao} especificacoes={especificacoes} />
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Uma seção dentro da coluna de conteúdo da página de curso.
 * Mais estreita que a Secao da home, porque divide a largura com a coluna
 * de compra — por isso a numeração fica na mesma linha do título, e não
 * numa coluna à parte.
 */
export function SecaoCurso({
  numero,
  rotulo,
  id,
  titulo,
  children,
  className,
}: {
  numero: string;
  rotulo: string;
  id?: string;
  titulo?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn('border-t border-white/12 py-12 first:border-t-0 first:pt-0', className)}
    >
      <p className="rotulo-accent mb-6">
        <span aria-hidden="true">§ {numero} — </span>
        {rotulo}
      </p>
      {titulo && (
        <h2 className="mb-6 max-w-2xl font-display text-[26px] leading-tight font-semibold tracking-tight text-white md:text-[32px]">
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

/**
 * Tabela comparativa de duas colunas — usada no "PNL vs. Hipnoterapia" e
 * nos dois níveis de certificado. Antes era uma <table> com raio de 32px,
 * fundo próprio e largura mínima de 800px, que estourava no celular.
 */
export function Comparativo({
  legenda,
  colunas,
  linhas,
}: {
  legenda: string;
  colunas: [string, string];
  linhas: { rotulo: string; a: ReactNode; b: ReactNode }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">{legenda}</caption>
        <thead>
          <tr className="border-b border-white/12">
            <th scope="col" className="rotulo w-1/5 py-3 pr-4 font-normal">
              <span className="sr-only">Critério</span>
            </th>
            <th scope="col" className="py-3 pr-4 text-[14.5px] font-semibold text-white">
              {colunas[0]}
            </th>
            <th scope="col" className="py-3 pl-4 text-[14.5px] font-semibold text-brand-accent">
              {colunas[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.rotulo} className="border-b border-white/8 align-baseline">
              <th scope="row" className="rotulo py-4 pr-4 font-normal">
                {linha.rotulo}
              </th>
              <td className="py-4 pr-4 text-[14px] leading-snug">{linha.a}</td>
              <td className="border-l border-white/8 py-4 pl-4 text-[14px] leading-snug text-white">
                {linha.b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Lista de itens com marcador em régua — substitui os grids de card com ícone. */
export function ListaItens({
  itens,
  className,
}: {
  itens: { titulo: string; nota?: string }[];
  className?: string;
}) {
  return (
    <ul className={cn('border-t border-white/12', className)}>
      {itens.map((item) => (
        <li key={item.titulo} className="border-b border-white/8 py-4">
          <span className="block text-[15px] font-semibold text-white">{item.titulo}</span>
          {item.nota && (
            <span className="mt-1 block text-[13.5px] leading-snug">{item.nota}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
