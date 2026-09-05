import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { db } from '../firebase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Captação de lista de espera.
 *
 * A versão anterior deste formulário chamava `alert('Você foi adicionado…')`
 * e dava `reset()` sem gravar nada em lugar nenhum — todo lead captado era
 * descartado silenciosamente. Agora grava na coleção `waitlist` do Firestore,
 * cujas regras permitem criar mas proíbem leitura pública.
 */
export default function WaitlistForm({ courseId }: { courseId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError('');

    const lead = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      courseId,
    };

    try {
      await addDoc(collection(db, 'waitlist'), {
        ...lead,
        createdAt: serverTimestamp(),
      });

      // Aviso por e-mail é acessório: o cadastro já está salvo. Uma falha
      // aqui não pode virar erro na tela nem fazer o visitante tentar de
      // novo, o que criaria um cadastro duplicado.
      fetch('/.netlify/functions/notificar-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch((err) => console.error('Falha ao notificar por e-mail:', err));

      setStatus('success');
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Erro ao entrar na lista de espera:', err);
      setStatus('error');
      setError(
        'Não conseguimos concluir seu cadastro. Verifique sua conexão e tente novamente.',
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="py-2" role="status" aria-live="polite">
        <CheckCircle2 className="mb-4 text-brand-accent" size={28} aria-hidden="true" />
        <h3 className="mb-2 font-display text-xl font-semibold text-brand-cream">
          Cadastro confirmado
        </h3>
        <p className="text-[13.5px] leading-relaxed">
          Você está na lista de espera. Avisaremos por e-mail assim que as vagas abrirem — com o
          desconto exclusivo de lançamento garantido.
        </p>
      </div>
    );
  }

  const busy = status === 'submitting';

  return (
    <>
      <h3 className="mb-3 font-display text-xl font-semibold text-brand-cream">
        Entre para a lista de espera
      </h3>
      <p className="mb-6 text-[13.5px] leading-relaxed">
        Seja o primeiro a saber quando abrirmos as vagas e garanta{' '}
        <strong>desconto exclusivo</strong> de lançamento.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="text-left">
          <label htmlFor="waitlist-name" className="sr-only">
            Seu nome
          </label>
          <input
            id="waitlist-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            required
            disabled={busy}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[14px] border border-white/12 bg-brand-dark/60 px-4 py-3.5 text-[14.5px] text-brand-cream transition-colors placeholder-brand-quiet focus:border-brand-accent disabled:opacity-60"
          />
        </div>

        <div className="text-left">
          <label htmlFor="waitlist-email" className="sr-only">
            Seu melhor e-mail
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Seu melhor e-mail"
            required
            disabled={busy}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={status === 'error' || undefined}
            aria-describedby={status === 'error' ? 'waitlist-error' : undefined}
            className="w-full rounded-[14px] border border-white/12 bg-brand-dark/60 px-4 py-3.5 text-[14.5px] text-brand-cream transition-colors placeholder-brand-quiet focus:border-brand-accent disabled:opacity-60"
          />
        </div>

        {status === 'error' && (
          <p
            id="waitlist-error"
            role="alert"
            className="text-left text-[13.5px] text-brand-danger"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <Loader2 className="animate-spin" size={18} aria-hidden="true" />}
          {busy ? 'Enviando…' : 'Quero notificação prioritária'}
        </button>
      </form>
    </>
  );
}
