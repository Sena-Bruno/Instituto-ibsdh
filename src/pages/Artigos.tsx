import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import Seo from '../components/Seo';
import { artigosPublicados } from '../config/artigos';
import { eixos } from '../config/eixos';
import { routes } from '../config/site';
import { paletas } from '../lib/cores';
import { listaDeArtigos, organizacao, trilhaDeNavegacao } from '../lib/schema';

/**
 * A lista de artigos.
 *
 * Mostra apenas o que já foi revisado — ver o aviso no topo de
 * `config/artigos.ts`. Enquanto não houver nenhum artigo revisado, a
 * página existe e diz isso, em vez de exibir uma lista vazia sem
 * explicação: é o mesmo princípio das outras telas do site, que sempre
 * dizem em que pé as coisas estão.
 */
export default function Artigos() {
  const lista = [...artigosPublicados].sort((a, b) =>
    b.publicadoEm.localeCompare(a.publicadoEm),
  );

  return (
    <>
      <Seo
        rota={routes.artigos}
        titulo="Artigos | Instituto Bruno Sena"
        descricao="Textos sobre PNL, hipnoterapia e desenvolvimento humano — o que as técnicas fazem, o que não fazem e onde ficam os limites éticos de cada uma."
        imagemAlt="Artigos do Instituto Bruno Sena"
        dados={[
          organizacao(),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Artigos', rota: routes.artigos },
          ]),
          ...(lista.length > 0 ? [listaDeArtigos(lista)] : []),
        ]}
      />

      <main>
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-16">
          <div
            aria-hidden="true"
            className="brilho -top-44 left-1/2 h-[520px] w-[860px] -translate-x-1/2"
            style={{ '--brilho': paletas.accent.brilho } as React.CSSProperties}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <p className="sobretitulo mb-6 text-brand-accent">Artigos</p>
            <h1 className="titulo-hero max-w-3xl">
              O que a técnica faz — e{' '}
              <span className="texto-gradiente">o que ela não faz.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17.5px] leading-relaxed md:text-lg">
              Textos sobre PNL, hipnoterapia e desenvolvimento humano, escritos com a mesma
              regra que vale nas formações: onde há limite, o limite é dito.
            </p>
          </div>
        </section>

        <Secao>
          {lista.length === 0 ? (
            <div className="cartao mx-auto max-w-2xl p-8">
              <p className="sobretitulo mb-3 text-brand-accent">Em preparação</p>
              <p className="text-[17px] leading-relaxed">
                Os primeiros artigos estão escritos e em revisão. Enquanto isso, as ementas
                completas das formações estão publicadas aula por aula — é o material mais
                detalhado que temos no ar.
              </p>
              <Link to={routes.formacoes} className="btn-primary mt-7 inline-flex">
                Ver as formações
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {lista.map((artigo, i) => {
                const cor = eixos[artigo.eixo].cor;
                const p = paletas[cor];
                return (
                  <Revela key={artigo.slug} atraso={i * 0.05}>
                    <Link
                      to={`${routes.artigos}/${artigo.slug}`}
                      className={`cartao flex h-full flex-col p-7 transition-colors ${p.bordaHover}`}
                    >
                      <p className={`sobretitulo mb-4 ${p.texto}`}>{eixos[artigo.eixo].nome}</p>
                      <h2 className="font-display text-[21px] leading-snug font-bold text-brand-cream">
                        {artigo.titulo}
                      </h2>
                      <p className="mt-4 flex-1 text-[15.5px] leading-relaxed">
                        {artigo.resumo}
                      </p>
                      <span
                        className={`mt-6 inline-flex items-center gap-2 font-semibold ${p.texto}`}
                      >
                        Ler
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </Link>
                  </Revela>
                );
              })}
            </div>
          )}
        </Secao>

        <Secao elevada>
          <Cabecalho sobretitulo="Formações" titulo="Da leitura à prática">
            Os artigos explicam os conceitos. As formações treinam a execução — com prática
            supervisionada no simulador antes do primeiro atendimento real.
          </Cabecalho>
          <Link to={routes.formacoes} className="btn-primary mt-8 inline-flex">
            Ver as formações
          </Link>
        </Secao>
      </main>
    </>
  );
}
