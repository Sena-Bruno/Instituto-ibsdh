import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import CorpoArtigo from '../components/CorpoArtigo';
import OfertaDeMaterial from '../components/OfertaDeMaterial';
import Secao, { Cabecalho } from '../components/Secao';
import Seo from '../components/Seo';
import { artigoPorSlug } from '../config/artigos';
import { listaCursos } from '../config/courses';
import { eixos } from '../config/eixos';
import { materialParaOEixo } from '../config/materiais';
import { routes, site } from '../config/site';
import { paletas } from '../lib/cores';
import { artigoComoSchema, organizacao, trilhaDeNavegacao } from '../lib/schema';
import NotFound from './NotFound';

/** `2026-09-07` → `7 de setembro de 2026`, sem passar por fuso horário. */
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
function porExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${Number(dia)} de ${MESES[Number(mes) - 1]} de ${ano}`;
}

export default function Artigo() {
  const { slug } = useParams();
  const artigo = artigoPorSlug(slug);

  /* Slug inexistente cai no 404 de verdade, com o mesmo `noindex` e a
     mesma página que qualquer outro endereço errado — e não numa tela
     vazia que responde 200 e vira soft 404 no índice. */
  if (!artigo) return <NotFound />;

  const cor = eixos[artigo.eixo].cor;
  const p = paletas[cor];
  const rota = `${routes.artigos}/${artigo.slug}`;
  const curso = listaCursos.find((c) => c.route === artigo.cursoRelacionado);
  /* Rascunho não oferece nada: o texto ainda não foi conferido, e um
     material entregue a partir dele começaria a relação pedindo o
     e-mail em troca de uma página que o instituto ainda não assinou. */
  const material = artigo.revisado ? materialParaOEixo(artigo.eixo) : undefined;

  return (
    <>
      <Seo
        rota={rota}
        titulo={`${artigo.tituloSeo ?? artigo.titulo} | ${site.name}`}
        descricao={artigo.resumo}
        tipo="article"
        /* Rascunho não revisado fica fora do índice. Ver `config/artigos.ts`. */
        indexar={artigo.revisado}
        dados={[
          organizacao(),
          artigoComoSchema(artigo),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Artigos', rota: routes.artigos },
            { nome: artigo.titulo, rota },
          ]),
        ]}
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

            <p className={`sobretitulo mb-5 ${p.texto}`}>{eixos[artigo.eixo].nome}</p>

            <h1 className="font-display text-[34px] leading-[1.1] font-bold tracking-tight text-brand-cream md:text-[46px]">
              {artigo.titulo}
            </h1>

            <p className="mt-6 text-[18px] leading-relaxed text-white/80">{artigo.resumo}</p>

            {/*
              A assinatura não é enfeite. O sistema de conteúdo útil do
              Google avalia se o leitor consegue saber QUEM escreveu, e uma
              página sem autoria visível é uma página sem responsável — o
              que pesa contra numa área em que o conselho errado faz mal.
              O mesmo par autor/data vai para o JSON-LD, em `schema.ts`.
            */}
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-6 text-[14px] text-brand-quiet">
              <span className="font-semibold text-brand-cream">Bruno Sena</span>
              <span aria-hidden="true">·</span>
              <span>Fundador do {site.shortName}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={artigo.revisadoEm ?? artigo.publicadoEm}>
                {porExtenso(artigo.revisadoEm ?? artigo.publicadoEm)}
              </time>
            </div>

            {!artigo.revisado ? (
              <p className="mt-6 rounded-[14px] border border-brand-warm/30 bg-brand-warm/5 px-5 py-4 text-[14.5px] leading-relaxed text-brand-cream">
                <strong className="font-semibold">Rascunho em revisão.</strong> Este texto ainda
                não foi conferido e assinado, e por isso está fora do índice de busca e da
                listagem de artigos.
              </p>
            ) : null}

            <div className="mt-12">
              <CorpoArtigo blocos={artigo.corpo} cor={cor} />
            </div>

            {/* A caixa vem DEPOIS do texto, e não antes nem no meio. Quem
                acabou de ler é quem tem motivo para deixar o e-mail; quem
                ainda não leu só encontra um obstáculo entre ele e a
                resposta que veio buscar. */}
            {material ? <OfertaDeMaterial material={material} origem={rota} /> : null}
          </div>
        </article>

        {curso ? (
          <Secao elevada className="mt-10">
            <Cabecalho sobretitulo="Formação relacionada" cor={cor} titulo={curso.title}>
              {curso.resumo}
            </Cabecalho>
            <Link to={curso.route} className={`${p.botao} mt-8 inline-flex`}>
              Ver a ementa completa
            </Link>
          </Secao>
        ) : null}
      </main>
    </>
  );
}
