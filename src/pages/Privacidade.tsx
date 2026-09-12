import Seo from '../components/Seo';
import { routes, site } from '../config/site';
import { registrarDecisao, useDecisaoDeCookies } from '../lib/consentimento';
import { organizacao } from '../lib/schema';
import { useMontado } from '../lib/useMontado';

/**
 * Quando este documento foi revisado pela última vez.
 *
 * Era `new Date()`, o que fazia a página anunciar a data de HOJE, todo
 * dia, sem que uma linha do texto tivesse mudado. Isso é errado por dois
 * motivos independentes:
 *
 * 1. É uma declaração falsa num documento legal. Quem precisa saber se
 *    os termos mudaram desde que aceitou não tem como saber, porque a
 *    data nunca para de avançar.
 *
 * 2. Quebrava a hidratação. O HTML é gerado no build e a data congela
 *    ali; no dia seguinte o navegador renderiza outra data, o React vê
 *    que a árvore não bate com o HTML recebido e redesenha o documento
 *    inteiro — perdendo a página pré-renderizada por causa de uma linha.
 *
 * AO REVISAR O TEXTO, ATUALIZE ESTA DATA. É a única coisa que precisa
 * ser feita à mão aqui, e é o que dá sentido ao aviso.
 */
const ULTIMA_REVISAO = '2026-09-12';

/**
 * O estado do consentimento, e o botão que o desfaz.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE REVOGAR PRECISA MORAR AQUI                                   │
 * │                                                                       │
 * │  A LGPD dá o direito de revogar o consentimento a qualquer momento, e │
 * │  revogar tem de ser tão fácil quanto consentir. Um aviso que aparece  │
 * │  uma vez e some para sempre cumpre a primeira metade e ignora a       │
 * │  segunda: depois do clique não há mais nenhuma tela em que a pessoa   │
 * │  possa mudar de ideia.                                                │
 * │                                                                       │
 * │  Esta é essa tela. É também a página que o próprio aviso linka, então │
 * │  o caminho de volta existe desde o primeiro segundo.                  │
 * └───────────────────────────────────────────────────────────────────────┘
 */
function EscolhaDeCookies() {
  const montado = useMontado();
  const decisao = useDecisaoDeCookies();

  /* Antes de montar, o texto neutro: é o que o servidor pré-renderizou e o
     que o robô lê. Sem essa igualdade a hidratação descarta o documento. */
  if (!montado) {
    return <p>Você pode aceitar ou recusar os cookies de medição a qualquer momento.</p>;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="text-[14.5px]">
        {decisao === 'aceito'
          ? 'Hoje você aceita os cookies de medição.'
          : decisao === 'recusado'
            ? 'Hoje você recusa os cookies de medição, e nada é medido.'
            : 'Você ainda não respondeu ao aviso de cookies.'}
      </p>

      {decisao !== null && (
        <button
          type="button"
          onClick={() => registrarDecisao(null)}
          className="btn-ghost shrink-0 justify-center"
        >
          Rever minha escolha
        </button>
      )}
    </div>
  );
}

/** `2026-09-07` → `07/09/2026`, sem passar por fuso horário. */
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Política de Privacidade — exigida pela LGPD.
 * O site autentica com Google e grava dados pessoais (nome, e-mail,
 * avaliações) no Firestore, mas não tinha nenhuma página legal: o link do
 * rodapé apontava para href="#".
 */
export default function Privacidade() {
  return (
    <>
      <Seo
        rota={routes.privacidade}
        titulo={`Política de Privacidade | ${site.name}`}
        descricao="Como o Instituto Bruno Sena coleta, usa e protege seus dados pessoais, conforme a LGPD."
        dados={[organizacao()]}
      />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-24 prose-institucional">
        <h1 className="mb-4 font-display text-4xl leading-tight font-semibold tracking-tight text-brand-cream md:text-5xl">
          Política de Privacidade
        </h1>
        <p className="sobretitulo mb-12 text-brand-quiet">
          Última atualização:{' '}
          <time dateTime={ULTIMA_REVISAO}>{formatarData(ULTIMA_REVISAO)}</time>
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              1. Quem somos
            </h2>
            <p>
              O {site.legalName} ({site.shortName}) é responsável pelo tratamento dos dados
              pessoais coletados neste site. Para qualquer questão relativa a privacidade,
              escreva para{' '}
              <a
                href={`mailto:${site.email.contact}`}
                className="text-brand-accent hover:underline"
              >
                {site.email.contact}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              2. Que dados coletamos
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-brand-cream">Lista de espera:</strong> nome e e-mail,
                quando você se cadastra para ser avisado sobre uma formação.
              </li>
              <li>
                <strong className="text-brand-cream">Materiais gratuitos:</strong> nome, e-mail
                e a página em que você pediu o material, quando você o solicita ao final de um
                artigo.
              </li>
              <li>
                <strong className="text-brand-cream">Avaliações de curso:</strong> ao entrar com
                sua Conta Google, recebemos seu nome, foto de perfil e um identificador de
                usuário, associados à avaliação que você publica.
              </li>
              <li>
                <strong className="text-brand-cream">Contato:</strong> os dados que você nos
                envia por e-mail ou WhatsApp.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              3. Para que usamos
            </h2>
            <p>
              Para avisar sobre turmas e formações que você pediu para acompanhar, enviar o
              material que você solicitou e conteúdos relacionados a ele, publicar as avaliações
              que você escolheu tornar públicas e responder ao seu contato. A página de origem
              registrada com o material serve para sabermos qual texto foi útil, e não para
              criar perfil de comportamento. Não vendemos seus dados e não os usamos para
              finalidade diferente da que motivou a coleta.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              4. Com quem compartilhamos
            </h2>
            <p>
              Usamos o Google Firebase (autenticação e banco de dados) como operador de dados e
              a {site.paymentPlatform} para processar pagamentos. As compras acontecem no
              ambiente dela: não recebemos nem armazenamos dados de cartão. Se você autorizar os
              cookies de medição, o Google Analytics também recebe dados de navegação — veja a
              seção seguinte.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              5. Cookies e medição de audiência
            </h2>
            <p className="mb-4">
              Usamos o Google Analytics para saber quais páginas são lidas, quais formações
              despertam interesse e por onde as pessoas chegam até nós. Ele grava cookies no seu
              navegador e recebe informações como as páginas visitadas, o tipo de aparelho e a
              origem do acesso. O seu endereço de IP é anonimizado, e não usamos esses dados
              para identificar você nem para publicidade.
            </p>
            <p className="mb-4">
              <strong className="text-brand-cream">
                Esses cookies só existem se você autorizar.
              </strong>{' '}
              Enquanto você não responder ao aviso — e se responder que não —, nada é carregado
              e nada é medido. O site funciona igual nos dois casos: a medição não é necessária
              para navegar, comprar ou se cadastrar.
            </p>
            <p className="mb-4">
              Guardamos também, no seu navegador, a sua própria resposta a esse aviso (para não
              perguntar de novo) e, durante a visita, a campanha pela qual você chegou — que é
              enviada junto apenas se você preencher um formulário, e serve para sabermos qual
              anúncio ou texto foi útil.
            </p>
            <EscolhaDeCookies />
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              6. Seus direitos
            </h2>
            <p>
              A LGPD garante a você confirmar a existência de tratamento, acessar, corrigir,
              anonimizar, portar ou excluir seus dados, e revogar o consentimento a qualquer
              momento. Avaliações podem ser apagadas por você mesmo, dentro do site. Para os
              demais pedidos, escreva para{' '}
              <a
                href={`mailto:${site.email.contact}`}
                className="text-brand-accent hover:underline"
              >
                {site.email.contact}
              </a>{' '}
              — respondemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              7. Retenção e segurança
            </h2>
            <p>
              Guardamos os dados pelo tempo necessário às finalidades acima ou até que você peça
              a exclusão. O acesso é restrito e protegido por regras de segurança que impedem a
              leitura pública da lista de espera e da lista de quem pediu materiais.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
