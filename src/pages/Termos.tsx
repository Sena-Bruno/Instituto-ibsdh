import { Helmet } from '@dr.pogodin/react-helmet';
import { site } from '../config/site';

export default function Termos() {
  return (
    <>
      <Helmet>
        <title>Termos de Uso | {site.name}</title>
        <meta
          name="description"
          content="Condições de uso do site e das formações do Instituto Bruno Sena."
        />
        <link rel="canonical" href={`${site.url}/termos`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        <h1 className="mb-4 font-display text-4xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
          Termos de Uso
        </h1>
        <p className="sobretitulo mb-12 text-brand-quiet">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">1. Objeto</h2>
            <p>
              Este site apresenta as formações do {site.legalName} e permite o cadastro em
              listas de espera e a publicação de avaliações. Ao usá-lo, você concorda com estas
              condições.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">
              2. Natureza das formações
            </h2>
            <p>{site.legalDisclaimer}</p>
            <p className="mt-3">
              Os conteúdos têm caráter educacional. Resultados individuais dependem da dedicação
              e do contexto de cada aluno, e não são garantidos.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">
              3. Compras, prazos e reembolso
            </h2>
            <p>
              Os pagamentos são processados pela {site.paymentPlatform}, sujeitos aos termos
              dela. Nos termos do Código de Defesa do Consumidor, você pode desistir da compra
              em até 7 dias corridos a contar do acesso, com devolução integral do valor.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">
              4. Propriedade intelectual
            </h2>
            <p>
              Todo o material das formações — aulas, apostilas, marca e método — é protegido por
              direito autoral. O acesso é pessoal e intransferível; reproduzir ou distribuir o
              conteúdo sem autorização é proibido.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">
              5. Conduta nas avaliações
            </h2>
            <p>
              As avaliações são de responsabilidade de quem as publica. Removemos conteúdo
              ilegal, ofensivo, de spam ou que viole direitos de terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-white">6. Contato</h2>
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
      </article>
    </>
  );
}
