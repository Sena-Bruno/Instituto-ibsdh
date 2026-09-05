import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { contarAulas, type ModuloCurriculo, somarCarga } from '../config/curriculos';
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
  className,
}: {
  modulos: ModuloCurriculo[];
  className?: string;
}) {
  // O primeiro módulo já vem aberto: uma ementa toda fechada esconde
  // justamente a evidência que convence, e obriga a um clique para saber
  // se vale a pena olhar.
  const [aberto, setAberto] = useState<string | null>(modulos[0]?.numero ?? null);

  const horas = somarCarga(modulos);
  const aulas = contarAulas(modulos);

  return (
    <div className={className}>
      <p className="rotulo-accent mb-5">
        Ementa oficial · {modulos.length} módulos · {aulas} aulas
        {horas > 0 && ` · ${horas}h`}
      </p>

      <div className="border-t border-white/12">
        {modulos.map((modulo) => {
          const isOpen = aberto === modulo.numero;
          const painelId = `modulo-painel-${modulo.numero}`;
          const botaoId = `modulo-botao-${modulo.numero}`;

          return (
            <div key={modulo.numero} className="border-b border-white/8">
              <h3>
                <button
                  type="button"
                  id={botaoId}
                  aria-expanded={isOpen}
                  aria-controls={painelId}
                  onClick={() => setAberto(isOpen ? null : modulo.numero)}
                  className="flex w-full items-baseline gap-4 py-5 text-left transition-colors hover:text-brand-accent"
                >
                  <span className="dado shrink-0 text-[12.5px] text-brand-quiet">
                    {modulo.numero}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15.5px] font-semibold text-white">
                      {modulo.titulo}
                    </span>
                    {modulo.resumo && (
                      <span className="mt-1 block text-[13px] leading-snug">
                        {modulo.resumo}
                      </span>
                    )}
                  </span>
                  {modulo.carga && (
                    <span className="dado shrink-0 text-[12.5px] text-brand-quiet">
                      {modulo.carga}
                    </span>
                  )}
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: duration.fast, ease: ease.out }}
                    className="shrink-0 text-brand-accent"
                  >
                    <ChevronDown size={18} />
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
                      <ListaAulas modulo={modulo} />
                    ) : (
                      // Um módulo sem aulas listadas é uma lacuna na ementa,
                      // não um módulo vazio. Melhor dizer isso do que exibir
                      // um painel em branco que parece defeito.
                      <p className="pb-6 pl-[38px] text-[13.5px] leading-relaxed text-brand-quiet">
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

function ListaAulas({ modulo }: { modulo: ModuloCurriculo }) {
  // Só mostramos a coluna de conteúdo se a ementa deste curso a registra:
  // uma coluna vazia em todas as linhas é ruído, não informação.
  const temConteudo = modulo.aulas.some((aula) => aula.conteudo);

  return (
    // A tabela rola sozinha na horizontal em tela estreita, em vez de
    // empurrar a página inteira para o lado.
    <div className="overflow-x-auto pb-6 pl-0 sm:pl-[38px]">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <caption className="sr-only">
          Aulas do módulo {modulo.numero} — {modulo.titulo}
        </caption>
        <thead>
          <tr className="border-b border-white/8">
            <th scope="col" className="rotulo w-14 py-2.5 pr-3 font-normal">
              Aula
            </th>
            <th scope="col" className="rotulo py-2.5 pr-4 font-normal">
              Título
            </th>
            {temConteudo && (
              <th scope="col" className="rotulo py-2.5 pr-4 font-normal">
                Conteúdo
              </th>
            )}
            <th scope="col" className="rotulo py-2.5 font-normal">
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
                  'dado py-3 pr-3 text-[12.5px] font-normal',
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
                  <span className="rotulo-accent ml-2 whitespace-nowrap">avaliação</span>
                )}
              </td>
              {temConteudo && (
                <td className="py-3 pr-4 text-[13px] leading-snug">{aula.conteudo}</td>
              )}
              <td
                className={cn(
                  'py-3 text-[13px] leading-snug',
                  aula.etica ? 'text-brand-danger/90' : 'text-brand-accent',
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
