import Seo from '../components/Seo';
import { routes, site } from '../config/site';
import { organizacao } from '../lib/schema';

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
const ULTIMA_REVISAO = '2026-09-07';

/** `2026-09-07` → `07/09/2026`, sem passar por fuso horário. */
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function Termos() {
  return (
    <>
      <Seo
        rota={routes.termos}
        titulo={`Termos de Uso | ${site.name}`}
        descricao="Condições de uso do site e das formações do Instituto Bruno Sena."
        dados={[organizacao()]}
      />

      <main className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        <h1 className="mb-4 font-display text-4xl leading-tight font-semibold tracking-tight text-brand-cream md:text-5xl">
          Termos de Uso
        </h1>
        <p className="sobretitulo mb-12 text-brand-quiet">
          Última atualização:{' '}
          <time dateTime={ULTIMA_REVISAO}>{formatarData(ULTIMA_REVISAO)}</time>
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              1. Objeto
            </h2>
            <p>
              Este site apresenta as formações do {site.legalName} e permite o cadastro em
              listas de espera e a publicação de avaliações. Ao usá-lo, você concorda com estas
              condições.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              2. Natureza das formações
            </h2>
            <p>{site.legalDisclaimer}</p>
            <p className="mt-3">
              Os conteúdos têm caráter educacional. Resultados individuais dependem da dedicação
              e do contexto de cada aluno, e não são garantidos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              3. Compras, prazos e reembolso
            </h2>
            <p>
              Os pagamentos são processados pela {site.paymentPlatform}, sujeitos aos termos
              dela. Nos termos do Código de Defesa do Consumidor, você pode desistir da compra
              em até 7 dias corridos a contar do acesso, com devolução integral do valor.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              4. Propriedade intelectual
            </h2>
            <p>
              Todo o material das formações — aulas, apostilas, marca e método — é protegido por
              direito autoral. O acesso é pessoal e intransferível; reproduzir ou distribuir o
              conteúdo sem autorização é proibido.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              5. Conduta nas avaliações
            </h2>
            <p>
              As avaliações são de responsabilidade de quem as publica. Removemos conteúdo
              ilegal, ofensivo, de spam ou que viole direitos de terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-brand-cream">
              6. Contato
            </h2>
            <p>
              Dúvidas sobre estes termos:{' '}
              <a
                href={`mailto:${site.email.contact}`}
                className="text-brand-accent hover:underline"
              >
                {site.email.contact}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
