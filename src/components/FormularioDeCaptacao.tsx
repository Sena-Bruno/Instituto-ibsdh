import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { type ReactNode, useState } from 'react';
import { collapse } from '../lib/motion';
import Troca from './Troca';

/**
 * Nome e e-mail, gravados em algum lugar — o formulário de captação do site.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO FOI EXTRAÍDO                                            │
 * │                                                                       │
 * │  Havia um formulário de captação, o da lista de espera do Master      │
 * │  Coach, e ele guardava um punhado de decisões que custaram caro para  │
 * │  serem descobertas:                                                   │
 * │                                                                       │
 * │   · o segundo clique não pode gravar de novo (duplo toque numa rede   │
 * │     lenta criava dois cadastros da mesma pessoa);                     │
 * │   · o e-mail entra em minúsculas e sem espaço nas pontas, senão a     │
 * │     mesma pessoa entra duas vezes na lista;                           │
 * │   · a mensagem de erro entra e sai animada, porque erro que pisca     │
 * │     não é lido — e quem não o lê tenta de novo;                       │
 * │   · a troca para a confirmação é suave, porque corte seco depois de   │
 * │     uma ação é lido como falha, não como conclusão.                   │
 * │                                                                       │
 * │  Um segundo formulário escrito do zero acertaria talvez metade disso. │
 * │  O que muda de um ponto de captação para outro é o texto e o destino  │
 * │  da gravação; o comportamento é o mesmo, e agora existe uma vez só.   │
 * └───────────────────────────────────────────────────────────────────────┘
 */

type Status = 'idle' | 'submitting' | 'success' | 'error';

export interface DadosDoLead {
  /** Já vem sem espaço nas pontas. */
  name: string;
  /** Já vem em minúsculas e sem espaço nas pontas. */
  email: string;
}

export default function FormularioDeCaptacao({
  id,
  gravar,
  chamada,
  erroAoGravar,
  sucesso,
  children,
  rodape,
}: {
  /**
   * Prefixo dos `id` dos campos.
   *
   * Não é enfeite: dois formulários na mesma página com o mesmo `id`
   * quebram o `<label for>` — clicar no rótulo de um foca o campo do
   * outro, e o leitor de tela anuncia o campo errado.
   */
  id: string;
  /** Onde o lead é gravado. Um erro daqui vira a mensagem de falha. */
  gravar: (dados: DadosDoLead) => Promise<void>;
  /** Texto do botão em repouso. */
  chamada: string;
  /** A frase que aparece quando `gravar` falha. */
  erroAoGravar: string;
  /** O que substitui o formulário depois do envio. */
  sucesso: ReactNode;
  /** O título e a promessa, acima dos campos. */
  children: ReactNode;
  /** Linha miúda abaixo do botão — o aviso de privacidade, em geral. */
  rodape?: ReactNode;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // A guarda do duplo clique. Sem ela, um toque repetido numa rede lenta
    // grava o mesmo lead duas vezes.
    if (status === 'submitting') return;

    setStatus('submitting');
    setError('');

    try {
      /* Normalizar aqui, e não em quem grava: "Maria@Exemplo.com " e
         "maria@exemplo.com" são a mesma pessoa, e sem isto elas entram na
         lista como duas — o mesmo lead contado duas vezes. */
      await gravar({ name: name.trim(), email: email.trim().toLowerCase() });
      setStatus('success');
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Erro ao gravar o cadastro:', err);
      setStatus('error');
      setError(erroAoGravar);
    }
  };

  const busy = status === 'submitting';
  const confirmado = status === 'success';
  const idErro = `${id}-erro`;
  const campo =
    'w-full rounded-[14px] border border-white/12 bg-brand-dark/60 px-4 py-3.5 text-[14.5px] text-brand-cream transition-colors placeholder-brand-quiet focus:border-brand-accent disabled:opacity-60';

  /* Um único <Troca> envolve os dois estados, e não um por `return`.
     AnimatePresence só anima a saída de filhos que saem de DENTRO dele: com
     duas instâncias, a primeira desmontaria inteira e o formulário sairia
     no corte seco que estamos justamente consertando. */
  return (
    <Troca chave={confirmado ? 'confirmado' : 'formulario'}>
      {confirmado ? (
        <div className="py-2" role="status" aria-live="polite">
          {sucesso}
        </div>
      ) : (
        <>
          {children}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="text-left">
              <label htmlFor={`${id}-name`} className="sr-only">
                Seu nome
              </label>
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                required
                disabled={busy}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={campo}
              />
            </div>

            <div className="text-left">
              <label htmlFor={`${id}-email`} className="sr-only">
                Seu melhor e-mail
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Seu melhor e-mail"
                required
                disabled={busy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={status === 'error' || undefined}
                aria-describedby={status === 'error' ? idErro : undefined}
                className={campo}
              />
            </div>

            {/* O erro entra e sai animado. Mensagem de falha que aparece num
                piscar é fácil de não ver — e quem não a vê tenta enviar de
                novo, o que gera cadastro duplicado. */}
            <AnimatePresence initial={false}>
              {status === 'error' && (
                <motion.div
                  variants={collapse}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <p
                    id={idErro}
                    role="alert"
                    className="text-left text-[13.5px] text-brand-danger"
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={busy}
              className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 className="animate-spin" size={18} aria-hidden="true" />}
              {busy ? 'Enviando…' : chamada}
            </button>

            {rodape ? <div className="mt-1 text-left">{rodape}</div> : null}
          </form>
        </>
      )}
    </Troca>
  );
}
