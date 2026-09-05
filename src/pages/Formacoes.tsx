import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CardCurso from '../components/CardCurso';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import { cursosDoEixo, eixosComCurso, listaCursos } from '../config/courses';
import { routes, site, whatsappLink, whatsappMessages } from '../config/site';
import { paletas } from '../lib/cores';

/**
 * O catálogo de formações.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTA PÁGINA EXISTE                                           │
 * │                                                                       │
 * │  O instituto é de desenvolvimento humano, e o catálogo vai crescer    │
 * │  muito além dos cinco cursos de hoje. Três consequências de interface │
 * │  que esta página resolve:                                             │
 * │                                                                       │
 * │  LEI DE HICK. O tempo para decidir cresce com o número de opções      │
 * │  visíveis ao mesmo tempo. Um menu com cinco cursos funciona; com      │
 * │  vinte, paralisa. Agrupar por eixo transforma "escolha entre 20" em   │
 * │  "escolha entre 4, depois entre 5".                                   │
 * │                                                                       │
 * │  DIVULGAÇÃO PROGRESSIVA. A home mostra só os destaques e manda para   │
 * │  cá; o catálogo mostra tudo, agrupado; a página do curso mostra o     │
 * │  detalhe. Cada nível responde a uma pergunta diferente.               │
 * │                                                                       │
 * │  UM SÓ LUGAR PARA A LISTA. Cabeçalho, rodapé, home, 404 e esta        │
 * │  página derivam de `config/courses.ts`. Curso novo aparece em todas   │
 * │  sozinho, e nenhuma delas pode discordar da outra.                    │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function Formacoes() {
  const eixos = eixosComCurso();
  const abertos = listaCursos.filter((c) => c.situacao === 'aberto').length;

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.formacoes}`} />
        <title>Formações | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Todas as formações do Instituto Bruno Sena, organizadas por eixo: PNL, Hipnoterapia, Coaching e jornadas completas. Certificação NLPEA e IBSDH."
        />
        <meta property="og:title" content="Formações | Instituto Bruno Sena" />
        <meta
          property="og:description"
          content="Todas as formações do instituto, organizadas por eixo, com prática supervisionada no simulador SENA."
        />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta property="og:url" content={`${site.url}${routes.formacoes}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-16">
          <div
            aria-hidden="true"
            className="brilho -top-44 left-1/2 h-[520px] w-[860px] -translate-x-1/2"
            style={{ '--brilho': paletas.accent.brilho } as React.CSSProperties}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <p className="sobretitulo mb-6 text-brand-accent">Catálogo</p>
            <h1 className="titulo-hero max-w-3xl">
              Todas as <span className="texto-gradiente">formações.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17.5px] leading-relaxed md:text-lg">
              {abertos} formações com matrícula aberta, organizadas por eixo. Todas incluem
              prática supervisionada no SENA, acesso vitalício e certificação por competência
              demonstrada.
            </p>

            {/* Índice: leva direto ao eixo. Com poucos eixos é conveniência;
                quando forem seis e o catálogo tiver vinte cursos, é o que
                evita rolar a página inteira para achar um. */}
            <nav aria-label="Eixos de formação" className="mt-10">
              <ul className="flex flex-wrap gap-2.5">
                {eixos.map((eixo) => (
                  <li key={eixo.id}>
                    <a
                      href={`#${eixo.id}`}
                      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[13.5px] font-semibold transition-colors ${paletas[eixo.cor].borda} ${paletas[eixo.cor].bordaHover} ${paletas[eixo.cor].tenue} ${paletas[eixo.cor].texto}`}
                    >
                      {eixo.nome}
                      <span className="text-brand-quiet">{cursosDoEixo(eixo.id).length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {eixos.map((eixo, i) => {
          const cursos = cursosDoEixo(eixo.id);
          return (
            <Secao key={eixo.id} id={eixo.id} cor={eixo.cor} elevada={i % 2 === 1}>
              {/* O sobretítulo traz a contagem, não o nome do eixo: repetir
                  "PNL" acima de "PNL" ocupa espaço sem informar nada. */}
              <Cabecalho
                sobretitulo={`${cursos.length} ${cursos.length === 1 ? 'formação' : 'formações'}`}
                cor={eixo.cor}
                titulo={eixo.nome}
              >
                {eixo.descricao}
              </Cabecalho>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cursos.map((curso, j) => (
                  <Revela key={curso.route} atraso={j * 0.06} className="h-full">
                    <CardCurso curso={curso} />
                  </Revela>
                ))}
              </div>
            </Secao>
          );
        })}

        <Secao cor="accent" brilho brilhoEm="centro" className="py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="titulo-secao">Não sabe por onde começar?</h2>
            <p className="mt-5 leading-relaxed">
              A coordenação ajuda a escolher a formação certa para o seu momento — sem
              compromisso de compra.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink(whatsappMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                Falar com a coordenação <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link to={routes.home} className="btn-outline w-full sm:w-auto">
                Conhecer o método
              </Link>
            </div>
          </div>
        </Secao>
      </main>
    </>
  );
}
