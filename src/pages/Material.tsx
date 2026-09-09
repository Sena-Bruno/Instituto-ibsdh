import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import CorpoArtigo from '../components/CorpoArtigo';
import Secao, { Cabecalho } from '../components/Secao';
import Seo from '../components/Seo';
import { eixos } from '../config/eixos';
import { materialPorId } from '../config/materiais';
import { routes, site } from '../config/site';
import { paletas } from '../lib/cores';
import NotFound from './NotFound';

/**
 * A página de um material — o que a pessoa recebe em troca do contato.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTA PÁGINA É `noindex`, E ISSO NÃO É DESCUIDO                       │
 * │                                                                       │
 * │  Ela existe fora do índice e fora do sitemap de propósito. Se         │
 * │  aparecesse na busca, o material chegaria a todo mundo sem passar     │
 * │  pelo formulário — e o formulário é a razão de ele existir.           │
 * │                                                                       │
 * │  Não é um cofre: quem tiver o endereço abre. Também não precisa ser.  │
 * │  O objetivo é que quem QUER o material deixe o contato, não impedir   │
 * │  que alguém o leia. Um portão de verdade custaria autenticação,       │
 * │  tokens e uma tela de erro para quem perdeu o link — para proteger    │
 * │  um texto que queremos que circule.                                   │
 * │                                                                       │
 * │  O que ela precisa ter, e tem, é ARQUIVO PRÓPRIO no build: sem ele o  │
 * │  servidor devolve 404 para quem abre o endereço direto, e o link que  │
 * │  o formulário acabou de prometer não leva a lugar nenhum. Ver a       │
 * │  entrada de `/materiais/:id` em `config/paginas.ts`.                  │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function Material() {
  const { id } = useParams();
  const material = materialPorId(id);

  /* Endereço inventado cai no 404 de verdade, e não numa tela vazia que
     responde 200 — mesma decisão da página de artigo. */
  if (!material) return <NotFound />;

  const cor = eixos[material.eixo].cor;
  const p = paletas[cor];

  return (
    <>
      <Seo
        rota={`${routes.materiais}/${material.id}`}
        titulo={`${material.tituloSeo ?? material.titulo} | ${site.name}`}
        descricao={material.promessa}
        indexar={false}
      />

      <main>
        <article className="relative overflow-hidden pt-32 pb-10 md:pt-40">
          <div
            aria-hidden="true"
            className="brilho -top-44 left-1/2 h-[480px] w-[820px] -translate-x-1/2"
            style={{ '--brilho': p.brilho } as React.CSSProperties}
          />

          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <Link
              to={routes.artigos}
              className="mb-8 inline-flex items-center gap-2 text-[14px] text-brand-quiet transition-colors hover:text-brand-cream"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Artigos
            </Link>

            <p className={`sobretitulo mb-5 ${p.texto}`}>{material.formato}</p>

            <h1 className="font-display text-[34px] leading-[1.1] font-bold tracking-tight text-brand-cream md:text-[46px]">
              {material.titulo}
            </h1>

            <p className="mt-6 text-[18px] leading-relaxed text-white/80">
              {material.promessa}
            </p>

            {/* A mesma assinatura dos artigos: numa área sem conselho
                profissional, quem assina o conselho é a informação mais
                importante da página. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-6 text-[14px] text-brand-quiet">
              <span className="font-semibold text-brand-cream">Bruno Sena</span>
              <span aria-hidden="true">·</span>
              <span>Fundador do {site.shortName}</span>
            </div>

            <p className="mt-6 rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-4 text-[14.5px] leading-relaxed">
              Este é o seu link. Guarde-o ou mande para quem estiver na mesma dúvida — a página
              continua no ar, e não expira.
            </p>

            <div className="mt-12">
              <CorpoArtigo blocos={material.corpo} cor={cor} />
            </div>
          </div>
        </article>

        <Secao elevada className="mt-10">
          <Cabecalho sobretitulo="Continue" cor={cor} titulo="As ementas estão publicadas">
            Cada formação do instituto tem a grade completa no ar, aula por aula, com carga
            horária e conteúdo — que é a resposta à primeira das sete perguntas.
          </Cabecalho>
          <Link to={routes.formacoes} className={`${p.botao} mt-8 inline-flex`}>
            Ver as formações
          </Link>
        </Secao>
      </main>
    </>
  );
}
