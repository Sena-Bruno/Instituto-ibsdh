import { Helmet } from '@dr.pogodin/react-helmet';
import { site } from '../config/site';

/**
 * Política de Privacidade — exigida pela LGPD.
 * O site autentica com Google e grava dados pessoais (nome, e-mail,
 * avaliações) no Firestore, mas não tinha nenhuma página legal: o link do
 * rodapé apontava para href="#".
 */
export default function Privacidade() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | {site.name}</title>
        <meta
          name="description"
          content="Como o Instituto Bruno Sena coleta, usa e protege seus dados pessoais, conforme a LGPD."
        />
        <link rel="canonical" href={`${site.url}/privacidade`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-24 prose-institucional">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Política de Privacidade
        </h1>
        <p className="text-brand-platinum/70 mb-12">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="space-y-8 text-brand-platinum/85 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              1. Quem somos
            </h2>
            <p>
              O {site.legalName} ({site.shortName}) é responsável pelo tratamento dos
              dados pessoais coletados neste site. Para qualquer questão relativa a
              privacidade, escreva para{' '}
              <a href={`mailto:${site.email.contact}`} className="text-brand-accent hover:underline">
                {site.email.contact}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              2. Que dados coletamos
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Lista de espera:</strong> nome e e-mail,
                quando você se cadastra para ser avisado sobre uma formação.
              </li>
              <li>
                <strong className="text-white">Avaliações de curso:</strong> ao entrar
                com sua Conta Google, recebemos seu nome, foto de perfil e um
                identificador de usuário, associados à avaliação que você publica.
              </li>
              <li>
                <strong className="text-white">Contato:</strong> os dados que você nos
                envia por e-mail ou WhatsApp.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              3. Para que usamos
            </h2>
            <p>
              Para avisar sobre turmas e formações que você pediu para acompanhar,
              publicar as avaliações que você escolheu tornar públicas e responder ao
              seu contato. Não vendemos seus dados e não os usamos para finalidade
              diferente da que motivou a coleta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              4. Com quem compartilhamos
            </h2>
            <p>
              Usamos o Google Firebase (autenticação e banco de dados) como operador
              de dados e a Kiwify para processar pagamentos. As compras acontecem no
              ambiente da Kiwify: não recebemos nem armazenamos dados de cartão.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              5. Seus direitos
            </h2>
            <p>
              A LGPD garante a você confirmar a existência de tratamento, acessar,
              corrigir, anonimizar, portar ou excluir seus dados, e revogar o
              consentimento a qualquer momento. Avaliações podem ser apagadas por você
              mesmo, dentro do site. Para os demais pedidos, escreva para{' '}
              <a href={`mailto:${site.email.contact}`} className="text-brand-accent hover:underline">
                {site.email.contact}
              </a>{' '}
              — respondemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              6. Retenção e segurança
            </h2>
            <p>
              Guardamos os dados pelo tempo necessário às finalidades acima ou até que
              você peça a exclusão. O acesso é restrito e protegido por regras de
              segurança que impedem a leitura pública da lista de espera.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
