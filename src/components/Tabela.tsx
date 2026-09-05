import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

/**
 * Os dois padrões que substituem o grid de cards.
 *
 * O site tinha, em sete arquivos, a mesma solução para tudo: um grid de
 * cartões arredondados com ícone no topo, título, parágrafo e borda que
 * acende no hover. Serve para qualquer conteúdo — e é justamente o problema,
 * porque não distingue uma lista ordenada (a trilha de formações, onde a
 * ordem é a informação) de um conjunto de atributos soltos.
 *
 * Aqui são dois padrões com trabalhos diferentes:
 *
 *   Dados  — atributos comparáveis, lado a lado, separados por régua vertical.
 *   Trilha — sequência ordenada e numerada, uma linha por item.
 */

/* ── Dados ───────────────────────────────────────────────────────────────── */

export interface Dado {
  rotulo: string;
  valor: string;
  nota?: string;
}

/**
 * A faixa de evidência: rótulo em mono, valor em destaque, nota curta.
 * Delimitada por régua acima e abaixo, com réguas verticais entre colunas —
 * a mesma medida da grade de fundo.
 */
export function Dados({ itens, className }: { itens: Dado[]; className?: string }) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 border-y border-white/12 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {itens.map((item, i) => (
        <div
          key={item.rotulo}
          className={cn(
            'px-0 py-7 sm:px-6',
            /* A régua fica entre as colunas, nunca na borda externa: a
               primeira não tem recuo à esquerda, a última não tem à direita. */
            'sm:border-l sm:border-white/8',
            i % 2 === 0 && 'sm:border-l-0 lg:border-l',
            i === 0 && 'lg:border-l-0 lg:pl-0',
            i % 2 === 0 && 'sm:pl-0',
          )}
        >
          <dt className="rotulo mb-3">{item.rotulo}</dt>
          <dd>
            <span className="block text-[17px] font-semibold text-white">{item.valor}</span>
            {item.nota && (
              <span className="mt-1.5 block text-[13.5px] leading-snug">{item.nota}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Trilha ──────────────────────────────────────────────────────────────── */

export interface ItemTrilha {
  numero: string;
  titulo: string;
  resumo: string;
  /** Como aparece à direita: preço, "Em breve", carga horária. */
  valor: string;
  /** Rota interna. Quando ausente, a linha não é clicável. */
  para?: string;
  /** Marca a linha como o próximo passo recomendado. Use em uma só. */
  destaque?: boolean;
  /** Texto do estado, quando a linha não está disponível. */
  estado?: string;
}

/**
 * A sequência de formações como registro ordenado.
 *
 * A ordem aqui é conteúdo, não arranjo: o Practitioner é pré-requisito da
 * Hipnoterapia, que é pré-requisito do Master. Numa vitrine de três cards
 * lado a lado essa dependência desaparece — quem chega não sabe por onde
 * começar, e o site inteiro depende de que ele saiba.
 */
export function Trilha({ itens }: { itens: ItemTrilha[] }) {
  return (
    <ol className="border-t border-white/12">
      {itens.map((item) => {
        const conteudo = (
          <>
            <span className="dado text-[13px] text-brand-quiet">{item.numero}</span>
            <span className="min-w-0">
              <span className="block text-[17px] font-semibold text-white">
                {item.titulo}
                {item.destaque && (
                  <span className="rotulo-accent ml-3 align-middle">comece aqui</span>
                )}
              </span>
              <span className="mt-1 block text-[13.5px] leading-snug sm:hidden">
                {item.resumo}
              </span>
            </span>
            <span className="hidden text-[13.5px] leading-snug sm:block">{item.resumo}</span>
            <span
              className={cn(
                'dado justify-self-start text-[14px] sm:justify-self-end',
                item.estado ? 'text-brand-quiet' : 'text-brand-accent',
              )}
            >
              {item.estado ?? item.valor}
            </span>
          </>
        );

        // A coluna do título é `auto`: dimensiona pela linha mais larga e
        // mantém o resumo logo ao lado. Com 1fr no título, ele esticava até
        // o meio da tabela e abria um vão morto entre o nome e a descrição.
        const grade =
          'grid grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-b border-white/8 py-5 sm:grid-cols-[48px_auto_minmax(0,1fr)_110px] sm:gap-x-8';

        return (
          <li key={item.numero}>
            {item.para ? (
              <Link
                to={item.para}
                className={cn(grade, 'transition-colors hover:bg-white/[0.03]')}
              >
                {conteudo}
              </Link>
            ) : (
              <div className={grade}>{conteudo}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ── Ementa ──────────────────────────────────────────────────────────────── */

export interface Modulo {
  numero: string;
  titulo: string;
  conteudo: string;
  carga: string;
  /** Módulo de ética e limites: recebe marcação própria, porque é o
   *  argumento de responsabilidade que diferencia a formação. */
  etica?: boolean;
}

/**
 * A ementa como tabela vinda de dados.
 *
 * O PNL Practitioner tinha 741 linhas de currículo escritas à mão em JSX,
 * com a marcação repetida módulo a módulo. Editar uma aula era mexer em
 * marcação, e foi assim que os formatos divergiram entre as páginas de
 * curso. Aqui o currículo é um array e a tabela é uma só.
 */
export function Ementa({ modulos }: { modulos: Modulo[] }) {
  return (
    <table className="w-full border-t border-white/12 text-left">
      <caption className="sr-only">Ementa oficial da formação, módulo por módulo</caption>
      <thead>
        <tr>
          <th scope="col" className="rotulo py-3 pr-4 font-normal">
            Mód.
          </th>
          <th scope="col" className="rotulo py-3 pr-4 font-normal">
            Conteúdo
          </th>
          <th scope="col" className="rotulo py-3 text-right font-normal">
            Carga
          </th>
        </tr>
      </thead>
      <tbody>
        {modulos.map((mod) => (
          <tr
            key={mod.numero}
            className={cn('border-t border-white/8', mod.etica && 'bg-brand-danger/[0.05]')}
          >
            <th
              scope="row"
              className={cn(
                'dado py-4 pr-4 align-baseline text-[12.5px] font-normal',
                mod.etica ? 'text-brand-danger' : 'text-brand-quiet',
              )}
            >
              {mod.numero}
            </th>
            <td className="py-4 pr-4 align-baseline">
              <span
                className={cn(
                  'block text-[15.5px] font-semibold',
                  mod.etica ? 'text-brand-danger' : 'text-white',
                )}
              >
                {mod.titulo}
              </span>
              <span className="mt-1 block text-[13px] leading-snug">{mod.conteudo}</span>
            </td>
            <td
              className={cn(
                'dado py-4 align-baseline text-right text-[12.5px] whitespace-nowrap',
                mod.etica ? 'text-brand-danger' : 'text-brand-quiet',
              )}
            >
              {mod.carga}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Especificação ───────────────────────────────────────────────────────── */

/**
 * Lista de par rótulo/valor: carga horária, acesso, certificado.
 * Usada na coluna de compra das páginas de curso.
 */
export function Especificacao({ itens }: { itens: { rotulo: string; valor: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-white/8">
      {itens.map((item) => (
        <div key={item.rotulo} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-[13.5px]">{item.rotulo}</dt>
          <dd className="dado text-[13.5px] text-white">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
