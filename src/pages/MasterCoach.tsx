import { Helmet } from '@dr.pogodin/react-helmet';
import { Clock } from 'lucide-react';
import { CourseReviews } from '../components/CourseReviews';
import { ListaItens } from '../components/PaginaCurso';
import Secao, { Cabecalho } from '../components/Secao';
import WaitlistForm from '../components/WaitlistForm';
import { courses } from '../config/courses';
import { routes, site } from '../config/site';

const curso = courses.masterCoach;

const arsenal = [
  {
    titulo: 'Coaching executivo',
    nota: 'Ferramentas para atuar no mundo corporativo e desenvolver líderes.',
  },
  {
    titulo: 'Abordagem sistêmica',
    nota: 'Entender as dinâmicas ocultas que travam o resultado dos seus clientes.',
  },
  {
    titulo: 'Negócio de coaching',
    nota: 'Como estruturar, precificar e vender processos de alto valor.',
  },
  {
    titulo: 'Resultados acelerados',
    nota: 'Técnicas de intervenção rápida para gerar mudança profunda.',
  },
];

export default function MasterCoach() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.masterCoach}`} />
        <title>Formação Master Coach | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Formação Master Coach do Instituto Bruno Sena: coaching executivo, abordagem sistêmica e estruturação de negócio. Entre na lista de espera do lançamento."
        />
        <meta property="og:title" content="Formação Master Coach | Instituto Bruno Sena" />
        <meta
          property="og:description"
          content="Coaching executivo, abordagem sistêmica e estruturação de negócio. Lançamento em breve."
        />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta property="og:url" content={`${site.url}${routes.masterCoach}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          <div
            aria-hidden="true"
            className="brilho -top-44 left-1/2 h-[520px] w-[820px] -translate-x-1/2"
            style={{ '--brilho': 'rgb(57 212 161 / 20%)' } as React.CSSProperties}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
              <div>
                <p className="selo mb-7 border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald">
                  <Clock size={14} aria-hidden="true" /> Lançamento em breve
                </p>

                <h1 className="titulo-hero max-w-2xl">Formação Master Coach</h1>

                <p className="mt-6 max-w-2xl text-[17px] leading-relaxed md:text-lg">
                  Eleve seus atendimentos ao nível de excelência: ferramentas sistêmicas,
                  liderança e estruturação de negócio. Estamos preparando a formação para
                  coaches que querem se destacar e gerar resultado consistente para os clientes.
                </p>

                <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-brand-quiet">
                  Ainda não há data de abertura nem preço definido. Quem entra na lista é
                  avisado primeiro, sem compromisso de compra.
                </p>
              </div>

              {/* O formulário fica ao lado do texto, não como um card
                  centralizado embaixo dele: é a única ação desta página. */}
              <div className="cartao self-start p-7">
                <p className="sobretitulo mb-5 text-brand-emerald">Lista de espera</p>
                <WaitlistForm courseId={curso.slug} />
              </div>
            </div>
          </div>
        </section>

        <Secao cor="emerald" elevada>
          <Cabecalho sobretitulo="Conteúdo" cor="emerald" titulo="O que você vai dominar">
            Uma prévia do arsenal de ferramentas que estará à disposição. A ementa completa é
            publicada junto com a abertura das matrículas.
          </Cabecalho>
          <ListaItens cor="emerald" className="mt-10" itens={arsenal} />
        </Secao>

        <Secao cor="emerald" brilho brilhoEm="direita">
          <Cabecalho sobretitulo="Certificação" cor="emerald" titulo="A mais alta titulação">
            A certificação de Coach Profissional atesta a capacidade de conduzir processos de
            transformação profunda com segurança, método e resultado verificável.
          </Cabecalho>

          <ListaItens
            cor="emerald"
            className="mt-10"
            itens={[
              { titulo: 'Certificado válido nacionalmente' },
              { titulo: 'Chancelado pelo IBSDH' },
              { titulo: 'Foco em resultados clínicos e sistêmicos' },
            ]}
          />

          <img
            src="/Certificado-IBSDH-coach.webp"
            alt="Certificado de Coach Profissional emitido pelo IBSDH"
            className="mt-10 w-full max-w-3xl rounded-[22px] border border-brand-emerald/20"
            loading="lazy"
            decoding="async"
          />
        </Secao>

        <Secao elevada>
          <CourseReviews courseId={curso.slug} />
        </Secao>
      </main>
    </>
  );
}
