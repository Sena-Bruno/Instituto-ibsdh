import { addDoc, collection, serverTimestamp } from 'firebase/firestore/lite';
import { CheckCircle2 } from 'lucide-react';
import { db } from '../firebase/banco';
import { avisarLead } from '../lib/avisarLead';
import { campanhaDaVisita } from '../lib/campanha';
import { gravarComExtras } from '../lib/gravarComExtras';
import { evento } from '../lib/medir';
import FormularioDeCaptacao from './FormularioDeCaptacao';

/**
 * Captação de lista de espera.
 *
 * A versão original deste formulário chamava `alert('Você foi adicionado…')`
 * e dava `reset()` sem gravar nada em lugar nenhum — todo lead captado era
 * descartado silenciosamente. Agora grava na coleção `waitlist` do Firestore,
 * cujas regras permitem criar mas proíbem leitura pública.
 *
 * O comportamento do formulário (guarda de duplo clique, normalização,
 * erro animado, troca suave para a confirmação) mora em
 * `FormularioDeCaptacao`, compartilhado com a captação de material dos
 * artigos. Aqui fica só o que é da lista de espera: onde gravar e o texto.
 */
export default function WaitlistForm({ courseId }: { courseId: string }) {
  const gravar = async ({ name, email }: { name: string; email: string }) => {
    /*
      ┌───────────────────────────────────────────────────────────────────┐
      │  ESTA LISTA NÃO DIZIA DE ONDE VINHA NINGUÉM                       │
      │                                                                   │
      │  Gravava nome, e-mail e curso. A captação dos artigos já guardava │
      │  `origem` desde o primeiro dia, e a diferença aparecia no /admin: │
      │  a lista de materiais dizia qual texto trouxe o lead; a de        │
      │  espera — que é a de quem está MAIS PERTO DE COMPRAR — chegava    │
      │  anônima quanto à procedência.                                    │
      │                                                                   │
      │  Agora as duas gravam as mesmas duas coisas: `origem`, a página   │
      │  do formulário, e `campanha`, a etiqueta `utm_` da entrada.       │
      └───────────────────────────────────────────────────────────────────┘
    */
    const origem = typeof window === 'undefined' ? '' : window.location.pathname;
    const campanha = campanhaDaVisita();

    await gravarComExtras(
      (extras) =>
        addDoc(collection(db, 'waitlist'), {
          name,
          email,
          courseId,
          createdAt: serverTimestamp(),
          ...extras,
        }),
      { origem, campanha },
    );

    avisarLead({
      name,
      email,
      tipo: 'lista-de-espera',
      referencia: courseId,
      origem,
      campanha,
    });

    evento('generate_lead', {
      formulario: 'lista-de-espera',
      referencia: courseId,
      origem,
      campanha,
    });
  };

  return (
    <FormularioDeCaptacao
      id="waitlist"
      colecao="waitlist"
      assunto="seu cadastro"
      gravar={gravar}
      chamada="Quero notificação prioritária"
      sucesso={
        <>
          <CheckCircle2 className="mb-4 text-brand-accent" size={28} aria-hidden="true" />
          <h3 className="mb-2 font-display text-xl font-semibold text-brand-cream">
            Cadastro confirmado
          </h3>
          <p className="text-[13.5px] leading-relaxed">
            Você está na lista de espera. Avisaremos por e-mail assim que as vagas abrirem — com
            o desconto exclusivo de lançamento garantido.
          </p>
        </>
      }
    >
      <h3 className="mb-3 font-display text-xl font-semibold text-brand-cream">
        Entre para a lista de espera
      </h3>
      <p className="mb-6 text-[13.5px] leading-relaxed">
        Seja o primeiro a saber quando abrirmos as vagas e garanta{' '}
        <strong>desconto exclusivo</strong> de lançamento.
      </p>
    </FormularioDeCaptacao>
  );
}
