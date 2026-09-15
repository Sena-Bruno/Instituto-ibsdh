import { Clock } from 'lucide-react';
import ArtigosDoCurso from '../components/ArtigosDoCurso';
import AvaliacoesDoCurso from '../components/AvaliacoesDoCurso';
import ListaDeEspera from '../components/ListaDeEspera';
import { ListaItens } from '../components/PaginaCurso';
import Secao, { Cabecalho } from '../components/Secao';
import Seo from '../components/Seo';
import { courses } from '../config/courses';
import { routes } from '../config/site';
import { cursoComoSchema, trilhaDeNavegacao } from '../lib/schema';

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
    titulo: 'Intervenção breve',
    nota: 'Protocolos com começo, meio e fim definidos — para processos que não se arrastam por meses.',
  },
];

export default function MasterCoach() {
  return (
    <>
      <Seo
        rota={routes.masterCoach}
        titulo="Formação Master Coach | Instituto Bruno Sena"
        descricao="Formação Master Coach do Instituto Bruno Sena: coaching executivo, abordagem sistêmica e estruturação de negócio. Entre na lista de espera do lançamento."
        imagem="/og-coaching.jpg"
        imagemAlt="Arte da formação Master Coach do Instituto Bruno Sena"
        dados={[
          cursoComoSchema(curso),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Formações', rota: routes.formacoes },
            { nome: 'Master Coach', rota: routes.masterCoach },
          ]),
        ]}
      />

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
                  Coaching executivo, abordagem sistêmica e estruturação de negócio. A formação
                  está em produção e segue o mesmo formato das outras três: prática no SENA,
                  avaliação por competência e critérios de aprovação publicados.
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
                <ListaDeEspera courseId={curso.slug} />
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
          <Cabecalho
            sobretitulo="Certificação"
            cor="emerald"
            titulo="O que o certificado atesta"
          >
            A certificação de Coach Profissional atesta a condução de um processo completo de
            coaching — do contrato inicial ao fechamento — demonstrada em avaliação, não
            presumida pela presença nas aulas.
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
            width={2339}
            height={1653}
            alt="Certificado de Coach Profissional emitido pelo IBSDH"
            className="mt-10 w-full max-w-3xl rounded-[22px] border border-brand-emerald/20"
            loading="lazy"
            decoding="async"
          />
        </Secao>

        <ArtigosDoCurso rota={routes.masterCoach} cor="emerald" variante="largura" />

        <Secao elevada>
          <AvaliacoesDoCurso courseId={curso.slug} />
        </Secao>
      </main>
    </>
  );
}
