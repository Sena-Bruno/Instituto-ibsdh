import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { contarAulas, type ModuloCurriculo, somarCarga } from '../config/curriculos';
import { type NomeCor, paletas } from '../lib/cores';
import { collapse, duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * A ementa oficial, vinda de dados.
 *
 * O que havia: três implementações diferentes da mesma tabela, uma por
 * página, cada uma com um conjunto de colunas. A do PNL Practitioner eram
 * 741 linhas de <tr> escritas à mão — corrigir o título de uma aula era
 * mexer em marcação. Todas usavam <details>/<summary> com list-none e um
 * hack de ::-webkit-details-marker, o que dava comportamento diferente
 * entre navegadores e nenhum controle sobre a animação.
 *
 * Aqui é um componente só, alimentado por src/config/curriculos.ts, com
 * <button aria-expanded> como em todo o resto do site.
 */
export default function Ementa({
  modulos,
  cor,
  className,
}: {
  modulos: ModuloCurriculo[];
  cor: NomeCor;
  className?: string;
}) {
  const p = paletas[cor];
  // O primeiro módulo já vem aberto: uma ementa toda fechada esconde
  // justamente a evidência que convence, e obriga a um clique para saber
  // se vale a pena olhar.
  const [aberto, setAberto] = useState<string | null>(modulos[0]?.numero ?? null);

  const horas = somarCarga(modulos);
  const aulas = contarAulas(modulos);

  return (
    <div className={className}>
      <p className={`sobretitulo mb-5 ${p.texto}`}>
        Ementa oficial · {modulos.length} módulos · {aulas} aulas
        {horas > 0 && ` · ${horas}h`}
      </p>

      <div className="flex flex-col gap-3">
        {modulos.map((modulo) => {
          const isOpen = aberto === modulo.numero;
          const painelId = `modulo-painel-${modulo.numero}`;
          const botaoId = `modulo-botao-${modulo.numero}`;

          return (
            <div key={modulo.numero} className="cartao overflow-hidden hover:border-white/20">
              <h3>
                <button
                  type="button"
                  id={botaoId}
                  aria-expanded={isOpen}
                  aria-controls={painelId}
                  onClick={() => setAberto(isOpen ? null : modulo.numero)}
                  className="flex w-full items-baseline gap-4 p-5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className={`shrink-0 font-display text-[13px] font-bold ${p.texto}`}>
                    {modulo.numero}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16.5px] font-bold text-white">
                      {modulo.titulo}
                    </span>
                    {modulo.resumo && (
                      <span className="mt-1 block text-[13px] leading-snug">
                        {modulo.resumo}
                      </span>
                    )}
                  </span>
                  {modulo.carga && (
                    <span className="shrink-0 text-[12.5px] font-semibold text-brand-quiet">
                      {modulo.carga}
                    </span>
                  )}
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                    className="shrink-0 text-brand-accent"
                  >
                    <ChevronDown size={19} />
                  </motion.span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={painelId}
                    role="region"
                    aria-labelledby={botaoId}
                    variants={collapse}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    {modulo.aulas.length > 0 ? (
                      <ListaAulas modulo={modulo} cor={cor} />
                    ) : (
                      // Um módulo sem aulas listadas é uma lacuna na ementa,
                      // não um módulo vazio. Melhor dizer isso do que exibir
                      // um painel em branco que parece defeito.
                      <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-brand-quiet">
                        Detalhamento por aula em atualização. O módulo integra a carga horária e
                        a certificação.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListaAulas({ modulo, cor }: { modulo: ModuloCurriculo; cor: NomeCor }) {
  // Só mostramos a coluna de conteúdo se a ementa deste curso a registra:
  // uma coluna vazia em todas as linhas é ruído, não informação.
  const temConteudo = modulo.aulas.some((aula) => aula.conteudo);

  return (
    // A tabela rola sozinha na horizontal em tela estreita, em vez de
    // empurrar a página inteira para o lado.
    <div className="overflow-x-auto px-5 pb-5">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">
          Aulas do módulo {modulo.numero} — {modulo.titulo}
        </caption>
        <thead>
          <tr className="border-b border-white/8">
            <th
              scope="col"
              className="w-14 py-2.5 pr-3 text-[11.5px] font-semibold tracking-[0.1em] text-brand-quiet uppercase"
            >
              Aula
            </th>
            <th
              scope="col"
              className="py-2.5 pr-4 text-[11.5px] font-semibold tracking-[0.1em] text-brand-quiet uppercase"
            >
              Título
            </th>
            {temConteudo && (
              <th
                scope="col"
                className="py-2.5 pr-4 text-[11.5px] font-semibold tracking-[0.1em] text-brand-quiet uppercase"
              >
                Conteúdo
              </th>
            )}
            <th
              scope="col"
              className="py-2.5 text-[11.5px] font-semibold tracking-[0.1em] text-brand-quiet uppercase"
            >
              Prática no SENA
            </th>
          </tr>
        </thead>
        <tbody>
          {modulo.aulas.map((aula) => (
            <tr
              key={aula.id}
              className={cn(
                'border-b border-white/5 align-baseline',
                aula.etica && 'bg-brand-danger/[0.06]',
              )}
            >
              <th
                scope="row"
                className={cn(
                  'py-3 pr-3 text-[12.5px] font-semibold',
                  aula.etica ? 'text-brand-danger' : 'text-brand-quiet',
                )}
              >
                {aula.id}
              </th>
              <td
                className={cn(
                  'py-3 pr-4 text-[13.5px] font-medium',
                  aula.etica ? 'text-brand-danger' : 'text-white',
                )}
              >
                {aula.titulo}
                {aula.destaque && (
                  <span
                    className={`ml-2 text-[11px] font-bold tracking-[0.1em] uppercase whitespace-nowrap ${paletas[cor].texto}`}
                  >
                    avaliação
                  </span>
                )}
              </td>
              {temConteudo && (
                <td className="py-3 pr-4 text-[13px] leading-snug">{aula.conteudo}</td>
              )}
              <td
                className={cn(
                  'py-3 text-[13px] leading-snug',
                  aula.etica ? 'text-brand-danger/90' : paletas[cor].texto,
                )}
              >
                {aula.pratica}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
