import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { type RespostaSena, sena, type Veredito } from '../config/sena';
import { duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * A demonstração do SENA, funcionando.
 *
 * O que havia antes: uma captura de tela estática do simulador, com duas
 * falas fixas e um selo de "Rapport Estabelecido" que não respondia a nada.
 * O diferencial mais forte do instituto estava sendo *afirmado* numa imagem
 * congelada. Aqui o visitante escolhe a intervenção e recebe a devolutiva —
 * ele experimenta o produto antes de comprar.
 *
 * Acessibilidade, que a versão em imagem não tinha como ter:
 *  · as opções são <button> de verdade, operáveis por teclado;
 *  · a transcrição é uma região aria-live, então quem usa leitor de tela
 *    ouve a reação do paciente e a devolutiva sem precisar caçar o foco;
 *  · a cor nunca é o único portador do veredito — ele vem escrito.
 */

const corPorVeredito: Record<Veredito, string> = {
  estabelecido: 'text-brand-success',
  perdido: 'text-brand-danger',
  ruptura: 'text-brand-danger',
};

export default function SenaSimulador() {
  const [escolhida, setEscolhida] = useState<RespostaSena | null>(null);
  const idOpcoes = useId();

  return (
    <div className="bloco flex flex-col">
      {/* Cabeçalho da sessão */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/12 px-5 py-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-brand-accent" />
          <span className="text-[14.5px] font-semibold text-white">Paciente virtual</span>
          <span className="rotulo border-l border-white/15 pl-3">Perfil: {sena.perfil}</span>
        </div>
        <span className="rotulo">Sessão 01</span>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* A transcrição. aria-live para anunciar cada turno novo. */}
        <div className="flex flex-col gap-4" aria-live="polite">
          <Fala quem="Paciente">{sena.falaInicial}</Fala>

          <AnimatePresence initial={false}>
            {escolhida && (
              <motion.div
                key={escolhida.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.fast, ease: ease.out }}
                className="flex flex-col gap-4"
              >
                <Fala quem="Você" lado="direita">
                  {escolhida.texto}
                </Fala>
                <Fala quem="Paciente">{escolhida.reacao}</Fala>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* As opções, enquanto ninguém escolheu */}
        {!escolhida && (
          <fieldset className="mt-2 border-0 p-0">
            <legend className="rotulo mb-3">Como você responderia?</legend>
            <div className="flex flex-col gap-2" id={idOpcoes}>
              {sena.respostas.map((resposta) => (
                <button
                  key={resposta.id}
                  type="button"
                  onClick={() => setEscolhida(resposta)}
                  className="border border-white/14 px-4 py-3.5 text-left text-[14.5px] leading-snug text-brand-platinum transition-colors hover:border-brand-accent/45 hover:bg-white/[0.04] hover:text-white"
                >
                  {resposta.texto}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* A devolutiva */}
        {escolhida && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: 0.15, ease: ease.out }}
            className="mt-2 border-t border-white/12 pt-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rotulo-accent">Devolutiva SENA</span>
              <span
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.08em]',
                  corPorVeredito[escolhida.veredito],
                )}
              >
                {escolhida.vereditoRotulo}
              </span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-brand-platinum">
              {escolhida.analise}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button type="button" onClick={() => setEscolhida(null)} className="btn-ghost">
                Tentar outra resposta
              </button>
              <span className="rotulo">
                Na formação são {sena.totalCenarios} cenários assim
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Fala({
  quem,
  lado = 'esquerda',
  children,
}: {
  quem: string;
  lado?: 'esquerda' | 'direita';
  children: React.ReactNode;
}) {
  const doVisitante = lado === 'direita';
  return (
    <div
      className={cn(
        'max-w-[85%] border px-4 py-3.5',
        doVisitante
          ? 'self-end border-brand-accent/28 bg-brand-accent/10'
          : 'self-start border-white/8 bg-white/[0.04]',
      )}
    >
      <p className={cn('mb-2', doVisitante ? 'rotulo-accent' : 'rotulo')}>{quem}</p>
      <p className={cn('text-[15px] leading-relaxed', doVisitante ? 'text-white' : '')}>
        {children}
      </p>
    </div>
  );
}
