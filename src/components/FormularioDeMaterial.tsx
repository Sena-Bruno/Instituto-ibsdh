import { addDoc, collection, serverTimestamp } from 'firebase/firestore/lite';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Material } from '../config/materiais';
import { routes } from '../config/site';
import { db } from '../firebase/banco';
import { avisarLead } from '../lib/avisarLead';
import FormularioDeCaptacao from './FormularioDeCaptacao';

/**
 * Nome e e-mail em troca de um material — a captação dos artigos.
 *
 * Grava na coleção `leads` do Firestore, irmã da `waitlist`: as regras
 * permitem criar e proíbem leitura pública, porque nome e e-mail são
 * dados pessoais sob a LGPD. As duas aparecem no /admin, em abas, e saem
 * no mesmo CSV.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O CAMPO `origem` É O QUE TORNA ESTA LISTA ÚTIL                       │
 * │                                                                       │
 * │  Ele guarda a rota em que a pessoa preencheu o formulário. Sem ele a  │
 * │  lista responde "quantos leads chegaram"; com ele, responde QUAL      │
 * │  ARTIGO os trouxe — que é a única pergunta cuja resposta muda o que   │
 * │  se escreve depois. Um artigo que converte dez vezes mais que os      │
 * │  outros diz o assunto do próximo.                                     │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function FormularioDeMaterial({
  material,
  origem,
}: {
  material: Material;
  /** A rota em que este formulário está. Ex.: `/artigos/o-que-e-pnl`. */
  origem: string;
}) {
  const gravar = async ({ name, email }: { name: string; email: string }) => {
    await addDoc(collection(db, 'leads'), {
      name,
      email,
      materialId: material.id,
      origem,
      createdAt: serverTimestamp(),
    });

    avisarLead({
      name,
      email,
      tipo: 'material',
      referencia: material.id,
      origem,
    });
  };

  const destino = `${routes.materiais}/${material.id}`;

  return (
    <FormularioDeCaptacao
      id={`material-${material.id}`}
      colecao="leads"
      assunto="seu pedido"
      gravar={gravar}
      chamada={material.chamada}
      sucesso={
        <>
          <h3 className="mb-2 font-display text-xl font-semibold text-brand-cream">
            Pronto. O guia está aqui.
          </h3>
          <p className="mb-6 text-[13.5px] leading-relaxed">
            Abre agora, sem espera e sem confirmação por e-mail. Guarde o link — a página não
            expira.
          </p>
          {/* O material abre na hora, e não "chega no seu e-mail": o aviso
              por e-mail depende de uma chave do Resend e de um domínio
              verificado, e prometer o que essa configuração pode não
              cumprir seria a primeira coisa que a pessoa aprenderia sobre
              o instituto. Ver `config/materiais.ts`. */}
          <Link to={destino} className="btn-primary inline-flex">
            {material.titulo}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </>
      }
      rodape={
        <p className="text-[12.5px] leading-relaxed text-brand-quiet">
          Usamos seu e-mail para enviar o material e novidades do instituto. Nada de spam, e
          você pode pedir a exclusão a qualquer momento — veja a{' '}
          <Link to={routes.privacidade} className="underline hover:text-brand-cream">
            política de privacidade
          </Link>
          .
        </p>
      }
    >
      <h3 className="mb-3 font-display text-xl font-semibold text-brand-cream">
        {material.titulo}
      </h3>
      <p className="mb-6 text-[14.5px] leading-relaxed">{material.promessa}</p>
    </FormularioDeCaptacao>
  );
}
