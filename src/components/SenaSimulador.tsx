import { ArrowRight, Check, ExternalLink, Lock, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { sena } from '../config/sena';
import { collapse, duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * A amostra do SENA.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTA AMOSTRA É UMA CÓPIA FIEL DO SIMULADOR, ATÉ ONDE PODE SER        │
 * │                                                                       │
 * │  O SENA de verdade dá um paciente virtual, recebe a intervenção       │
 * │  ESCRITA pelo aluno (mínimo de 50 caracteres), pede uma autoavaliação │
 * │  e só então uma IA devolve nota e análise da condução.                │
 * │                                                                       │
 * │  A amostra faz os três primeiros passos de verdade. No quarto ela     │
 * │  para: mostra uma resposta de REFERÊNCIA já avaliada, no formato      │
 * │  exato em que o simulador devolve, e diz que a nota é da resposta de  │
 * │  referência e não da do visitante.                                    │
 * │                                                                       │
 * │  Isso não é uma limitação a esconder, é a linha certa. Avaliar de     │
 * │  verdade exige a IA do simulador; inventar uma nota para o texto de   │
 * │  quem está de fora seria mentir sobre o produto na demonstração dele. │
 * │  E o visitante ainda assim exercita a parte que importa — escrever a  │
 * │  intervenção — e vê a devolutiva que vai receber quando se matricular.│
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A versão anterior era múltipla escolha, e o produto não é. Amostra que
 * ensina a mecânica errada é pior do que não ter amostra.
 *
 * O texto clínico mora em `config/sena.ts`, com o aviso de revisão.
 */

type Etapa = 'escrever' | 'autoavaliar' | 'referencia';

export default function SenaSimulador() {
  const [etapa, setEtapa] = useState<Etapa>('escrever');
  const [resposta, setResposta] = useState('');
  const [marcados, setMarcados] = useState<string[]>([]);
  const idCampo = useId();
  const idContador = useId();

  const { paciente, minimoCaracteres, maximoCaracteres, autoavaliacao, referencia } = sena;
  const faltam = minimoCaracteres - resposta.trim().length;
  const podeEnviar = faltam <= 0;

  function reiniciar() {
    setEtapa('escrever');
    setResposta('');
    setMarcados([]);
  }

  return (
    <div className="cartao overflow-hidden">
      {/* Cabeçalho: identificação da sessão, como no simulador */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/8 bg-white/[0.02] px-5 py-3.5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className="pulso h-2 w-2 rounded-full bg-brand-emerald" />
          <span className="font-display text-[13px] font-semibold tracking-[0.06em] text-brand-cream uppercase">
            Paciente virtual
          </span>
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-white/12" />
        <span className="sobretitulo">
          {paciente.id} · perfil {paciente.perfil}
        </span>
        <span className="sobretitulo ml-auto">Amostra</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* ── O paciente ─────────────────────────────────────────────── */}
        <p className="text-[15px] leading-relaxed text-brand-platinum">{paciente.descricao}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[14px] border border-white/8 bg-white/[0.02] p-4">
            <p className="sobretitulo mb-2.5">Resistências esperadas</p>
            <ul className="flex flex-wrap gap-1.5">
              {paciente.resistencias.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-brand-danger/25 bg-brand-danger/8 px-2.5 py-1 text-[12px] text-brand-danger"
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[14px] border border-white/8 bg-white/[0.02] p-4">
            <p className="sobretitulo mb-2.5">Abordagem recomendada</p>
            <p className="text-[13px] leading-relaxed text-brand-platinum">
              {paciente.abordagem}
            </p>
          </div>
        </div>

        {/* O estado emocional, com a barra que o simulador mostra */}
        <div className="mt-4 flex items-center gap-3.5">
          <span className="sobretitulo shrink-0">{paciente.estado.rotulo}</span>
          <span
            aria-hidden="true"
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8"
          >
            <span
              className="block h-full rounded-full bg-brand-danger"
              style={{ width: `${paciente.estado.valor}%` }}
            />
          </span>
          <span className="shrink-0 font-display text-[13px] font-semibold text-brand-danger">
            {paciente.estado.valor}%
          </span>
        </div>

        <blockquote className="mt-5 rounded-[14px] border-l-2 border-brand-accent bg-white/[0.03] px-5 py-4 text-[15.5px] leading-relaxed text-brand-cream italic">
          “{paciente.falaInicial}”
        </blockquote>

        {/* ── Etapa 1: escrever a intervenção ────────────────────────── */}
        <div className="mt-6">
          <label
            htmlFor={idCampo}
            className="mb-2.5 block font-display text-[14px] font-semibold text-brand-cream"
          >
            Como você responderia?
          </label>
          <textarea
            id={idCampo}
            value={resposta}
            onChange={(e) => setResposta(e.target.value.slice(0, maximoCaracteres))}
            disabled={etapa !== 'escrever'}
            rows={4}
            aria-describedby={idContador}
            placeholder="Escreva a sua intervenção com as suas palavras, como faria no atendimento."
            className="w-full resize-y rounded-[14px] border border-white/12 bg-brand-dark/60 p-4 text-[15px] leading-relaxed text-brand-cream placeholder:text-brand-quiet disabled:opacity-60"
          />
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
            <p id={idContador} className="text-[12.5px] text-brand-quiet">
              {faltam > 0
                ? `Faltam ${faltam} caracteres — o SENA exige no mínimo ${minimoCaracteres}.`
                : `${resposta.trim().length} caracteres`}
            </p>
            {etapa === 'escrever' && (
              <button
                type="button"
                disabled={!podeEnviar}
                onClick={() => setEtapa('autoavaliar')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors',
                  podeEnviar
                    ? 'bg-brand-accent text-brand-dark hover:bg-brand-accent-light'
                    : 'cursor-not-allowed border border-white/12 text-brand-quiet',
                )}
              >
                Enviar para avaliação
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* ── Etapa 2: autoavaliação ─────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {etapa !== 'escrever' && (
            <motion.div
              variants={collapse}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: duration.base, ease: ease.out }}
              className="overflow-hidden"
            >
              <div className="mt-7 border-t border-white/8 pt-6">
                <p className="sobretitulo mb-1.5">Autoavaliação, antes da IA</p>
                <p className="mb-4 text-[13.5px] leading-relaxed text-brand-platinum">
                  No SENA você julga a própria condução antes de ver a nota. Sem isso a nota
                  vira placar, e o aluno aprende a agradar o avaliador em vez de conduzir a
                  sessão.
                </p>
                <ul className="space-y-2">
                  {autoavaliacao.map((item) => {
                    const marcado = marcados.includes(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-pressed={marcado}
                          onClick={() =>
                            setMarcados((atual) =>
                              marcado
                                ? atual.filter((i) => i !== item.id)
                                : [...atual, item.id],
                            )
                          }
                          className={cn(
                            'flex w-full items-start gap-3 rounded-[12px] border p-3 text-left text-[13.5px] leading-snug transition-colors',
                            marcado
                              ? 'border-brand-emerald/40 bg-brand-emerald/8 text-brand-cream'
                              : 'border-white/8 text-brand-platinum hover:border-white/20',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'mt-px flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border',
                              marcado
                                ? 'border-brand-emerald bg-brand-emerald text-brand-dark'
                                : 'border-white/25',
                            )}
                          >
                            {marcado && <Check size={12} strokeWidth={3} />}
                          </span>
                          {item.texto}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {etapa === 'autoavaliar' && (
                  <button
                    type="button"
                    onClick={() => setEtapa('referencia')}
                    className="btn-primary mt-5 w-full"
                  >
                    Ver como o SENA avalia
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Etapa 3: a devolutiva de referência ────────────────────── */}
        <AnimatePresence initial={false}>
          {etapa === 'referencia' && (
            <motion.div
              variants={collapse}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: duration.base, ease: ease.out }}
              className="overflow-hidden"
            >
              <div className="mt-7 border-t border-white/8 pt-6">
                {/* O aviso vem ANTES da nota, não depois: se aparecesse
                    embaixo, quem lê rápido levaria a nota como sendo sua. */}
                <p className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-brand-accent/25 bg-brand-accent/8 p-3.5 text-[13px] leading-relaxed text-brand-platinum">
                  <Lock
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand-accent"
                  />
                  <span>
                    A nota abaixo é de uma{' '}
                    <strong className="text-brand-cream">resposta de referência</strong>, não da
                    sua. Quem avalia o seu texto é a IA do simulador, dentro da formação — esta
                    amostra mostra o formato da devolutiva que você vai receber.
                  </span>
                </p>

                <p className="sobretitulo mb-2">Resposta de referência</p>
                <blockquote className="mb-6 rounded-[14px] border border-white/8 bg-white/[0.02] p-4 text-[14.5px] leading-relaxed text-brand-platinum italic">
                  “{referencia.resposta}”
                </blockquote>

                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[14px] border border-brand-emerald/25 bg-brand-emerald/8 p-4">
                  <span className="font-display text-[38px] leading-none font-bold text-brand-emerald">
                    {referencia.nota.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                  </span>
                  <span>
                    <span className="block font-display text-[15px] font-semibold text-brand-cream">
                      {referencia.rotulo}
                    </span>
                    <span className="block text-[12.5px] text-brand-quiet">
                      Nota mínima desta aula: {referencia.notaMinima},0
                    </span>
                  </span>
                </div>

                <ul className="space-y-3.5">
                  {referencia.blocos.map((bloco) => (
                    <li
                      key={bloco.titulo}
                      className={cn(
                        'rounded-[14px] border-l-2 bg-white/[0.02] py-3.5 pr-4 pl-4',
                        bloco.tipo === 'good' ? 'border-brand-emerald' : 'border-brand-accent',
                      )}
                    >
                      <p
                        className={cn(
                          'mb-1.5 font-display text-[14px] font-semibold',
                          bloco.tipo === 'good' ? 'text-brand-emerald' : 'text-brand-accent',
                        )}
                      >
                        {bloco.titulo}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-brand-platinum">
                        {bloco.texto}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={sena.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1"
                  >
                    Já sou aluno, abrir o SENA
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                  <button type="button" onClick={reiniciar} className="btn-ghost sm:px-5">
                    <RotateCcw size={15} aria-hidden="true" />
                    Refazer
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
