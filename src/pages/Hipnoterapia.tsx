import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import Ementa from '../components/Ementa';
import Faq from '../components/Faq';
import PaginaCurso, { Comparativo, ListaItens, SecaoCurso } from '../components/PaginaCurso';
import SenaExplanation from '../components/SenaExplanation';
import { courses } from '../config/courses';
import { contarAulas, curriculoHipnoterapia, somarCarga } from '../config/curriculos';
import { routes, site } from '../config/site';

const curso = courses.hipnoterapia;
const aulas = contarAulas(curriculoHipnoterapia);
const horas = somarCarga(curriculoHipnoterapia);

const competencias = [
  {
    titulo: 'Induzir transe terapêutico',
    nota: 'Do leve ao profundo, com segurança e controle.',
  },
  {
    titulo: 'Aplicar protocolos específicos',
    nota: 'Ansiedade, fobias, hábitos, dor, insônia, performance.',
  },
  {
    titulo: 'Conduzir regressão terapêutica',
    nota: 'Acessar e reprocessar memórias com ética absoluta.',
  },
  {
    titulo: 'Usar hipnose conversacional',
    nota: 'Sugestão indireta em diálogo cotidiano — vendas, liderança.',
  },
  { titulo: 'Ensinar auto-hipnose', nota: 'Empoderar clientes para autonomia.' },
  {
    titulo: 'Estruturar sessão completa',
    nota: 'Da anamnese à documentação, protegendo você e o cliente.',
  },
];

const perguntas = [
  {
    q: 'Posso fazer sem PNL Practitioner?',
    a: 'Avaliação de entrada obrigatória. Hipnoterapia exige base de leitura de padrões e comunicação. Se não tem, comece pelo Practitioner.',
  },
  {
    q: 'Qual a diferença do SENA Hipno para o SENA comum?',
    a: 'SENA Hipno simula estados de transe. Ele reporta sinais (peso nas pálpebras, respiração alterada, distanciamento temporal), resiste se a indução for mal feita, e avalia profundidade. É específico para hipnose.',
  },
  {
    q: 'O certificado me permite atender?',
    a: 'Atesta formação em hipnoterapia. Verifique a legislação da sua região — alguns estados exigem vínculo a conselho profissional para atendimento terapêutico formal.',
  },
  {
    q: 'E se eu não atingir 7/10 no exame final?',
    a: '3 tentativas incluídas. O SENA dá devolutiva detalhada entre as tentativas.',
  },
  {
    q: 'Como funciona a garantia?',
    a: 'Acesse, teste o SENA Hipno, tente sua primeira indução. Se em 7 dias você não sentir que este é o caminho mais seguro para dominar a hipnose, devolvemos 100%. Mas saiba: o curso não deixa você avançar sem ética — os quizzes de 100% são obrigatórios.',
  },
];

export default function Hipnoterapia() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.hipnoterapia}`} />
        <title>Formação Hipnoterapia Clínica | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Formação em Hipnoterapia Clínica: induções, protocolos terapêuticos, regressão e hipnose ericksoniana, com prática supervisionada no simulador SENA."
        />
        <meta
          property="og:title"
          content="Formação Hipnoterapia Clínica | Instituto Bruno Sena"
        />
        <meta
          property="og:description"
          content="Induções, protocolos terapêuticos e regressão, com prática supervisionada antes do primeiro atendimento real."
        />
        <meta property="og:image" content={`${site.url}/mockuphip.webp`} />
        <meta property="og:url" content={`${site.url}${routes.hipnoterapia}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <PaginaCurso
        curso={curso}
        cor="purple"
        trilha={[
          { rotulo: 'PNL Practitioner', para: routes.pnlPractitioner },
          { rotulo: 'Hipnoterapia Clínica', atual: true },
          { rotulo: 'Master PNL', para: routes.masterPnl },
        ]}
        aviso="Formação responsável — 4 módulos de ética e limites. Não formamos amadores."
        titulo="Hipnoterapia Clínica"
        resumo={
          <p>
            Aprenda a induzir transe terapêutico com segurança. Você pratica induções no{' '}
            <strong className="text-white">SENA Hipno</strong> — com pacientes simulados e
            devolutiva a cada intervenção — antes de encostar em alguém de verdade.
          </p>
        }
        preRequisito={
          <>
            <p className="text-[14.5px] font-semibold text-white">Requer o PNL Practitioner</p>
            <p className="mt-1 text-[13.5px] leading-relaxed">
              Hipnoterapia exige base de comunicação e leitura de padrões. Se você não tem,{' '}
              <Link to={routes.pnlPractitioner} className="text-brand-accent hover:underline">
                comece por lá
              </Link>
              . Se tem formação de outra escola, faça a avaliação de entrada no SENA.
            </p>
          </>
        }
        acao="Quero acessar o inconsciente com segurança"
        especificacoes={[
          { rotulo: 'Carga horária', valor: `${horas}h` },
          { rotulo: 'Aulas', valor: String(aulas) },
          { rotulo: 'Acesso', valor: 'vitalício' },
          { rotulo: 'Certificado', valor: 'IBSDH' },
          { rotulo: 'Simulador SENA', valor: 'incluso' },
          { rotulo: 'Suporte', valor: '12 meses' },
        ]}
      >
        <SecaoCurso
          cor="purple"
          sobretitulo="O problema"
          titulo="Você sabe que a mente tem poder. Mas não sabe acessar."
        >
          <div className="space-y-5 text-[15.5px] leading-relaxed">
            <p>
              Seus clientes — ou você mesmo — repetem padrões que a mente consciente{' '}
              <strong className="text-white">já entendeu</strong>, mas continua fazendo.
            </p>
            <ul className="border-l-2 border-brand-accent/40 pl-5">
              <li className="border-b border-white/8 py-2.5">
                Sabem que fumar mata, mas acendem o cigarro
              </li>
              <li className="border-b border-white/8 py-2.5">
                Sabem que a fobia é irracional, mas suam e tremem
              </li>
              <li className="py-2.5">Sabem que “deveriam” relaxar, mas o corpo não obedece</li>
            </ul>
            <p className="font-display text-xl text-white">
              O consciente sabe. O inconsciente não cooperou.
            </p>
            <p>
              A hipnoterapia é a ponte. Mas aprender hipnose sem{' '}
              <strong className="text-white">segurança</strong> é perigoso; sem{' '}
              <strong className="text-white">prática real</strong> é teatro; sem{' '}
              <strong className="text-white">ética</strong> é irresponsabilidade.
            </p>
          </div>
        </SecaoCurso>

        <SecaoCurso
          cor="purple"
          sobretitulo="Competências"
          titulo={`Em ${curriculoHipnoterapia.length} módulos, você se torna capaz de:`}
        >
          <ListaItens cor="purple" itens={competencias} />

          <div className="mt-8 border border-brand-danger/35 bg-brand-danger/[0.06] p-6">
            <p className="rotulo mb-3 text-brand-danger">E o mais importante</p>
            <p className="text-[15px] leading-relaxed">
              Você aprende{' '}
              <strong className="text-brand-danger">quando NÃO usar hipnose</strong>.
              Esquizofrenia, borderline severo, trauma complexo não processado — você saberá
              identificar e encaminhar.
            </p>
          </div>
        </SecaoCurso>

        <SecaoCurso cor="purple" sobretitulo="Para quem é" titulo="Este curso é para você que:">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="rotulo mb-4">Terapeutas e coaches</p>
              <ListaItens
                cor="purple"
                itens={[
                  { titulo: 'Adiciona ferramenta de acesso direto ao inconsciente' },
                  {
                    titulo:
                      'Resolve em sessões o que levaria meses em abordagem só conversacional',
                  },
                  { titulo: 'Quer resultado mensurável para justificar valor premium' },
                ]}
              />
            </div>
            <div>
              <p className="rotulo mb-4">Uso pessoal e desenvolvimento</p>
              <ListaItens
                cor="purple"
                itens={[
                  { titulo: 'Busca autodomínio profundo: auto-hipnose, regulação emocional' },
                  { titulo: 'Quer entender a própria mente em nível inconsciente' },
                  { titulo: 'Deseja ferramenta para performance, foco e hábitos' },
                ]}
              />
            </div>
          </div>
        </SecaoCurso>

        <SecaoCurso
          cor="purple"
          sobretitulo="Ementa"
          id="ementa"
          titulo={`${horas} horas. ${aulas} aulas. Ética em primeiro lugar.`}
        >
          <Ementa cor="purple" modulos={curriculoHipnoterapia} />
        </SecaoCurso>

        <SecaoCurso
          cor="purple"
          sobretitulo="Certificação"
          titulo="Dois níveis. Um significa competência real."
        >
          <Comparativo
            cor="purple"
            legenda="Comparação entre o certificado de conclusão e o de hipnoterapeuta clínico"
            colunas={['Certificado de conclusão', 'Certificado de hipnoterapeuta clínico']}
            linhas={[
              {
                rotulo: 'Como obter',
                a: `${aulas} aulas + quizzes éticos 100%`,
                b: 'Exame final (nota 7/10) + 2 casos documentados',
              },
              {
                rotulo: 'Valida',
                a: 'Conhecimento teórico e ético',
                b: 'Indução real, profundidade testada, segurança comprovada',
              },
              {
                rotulo: 'Alerta legal',
                a: '—',
                b: 'Verifique a legislação da sua região para prática clínica',
              },
            ]}
          />

          <img
            src="/Certificado-IBSDH-hipnoterapia.webp"
            alt="Certificado de Hipnoterapeuta Clínico emitido pelo IBSDH"
            className="mt-10 w-full border border-white/10"
            loading="lazy"
            decoding="async"
          />
        </SecaoCurso>

        <SecaoCurso
          cor="purple"
          sobretitulo="Comparação"
          id="comparativo"
          titulo="PNL ou hipnoterapia?"
        >
          <p className="mb-8 max-w-2xl text-[15.5px] leading-relaxed">
            As duas abordagens resolvem coisas diferentes, e se somam. Entenda onde cada uma
            atua antes de escolher.
          </p>

          <Comparativo
            cor="purple"
            legenda="Comparação entre PNL e Hipnoterapia Clínica"
            colunas={['PNL (Practitioner / Master)', 'Hipnoterapia Clínica']}
            linhas={[
              {
                rotulo: 'Alvo',
                a: 'Estrutura do pensamento e comportamento',
                b: 'Estados de consciência e acesso inconsciente',
              },
              {
                rotulo: 'Metáfora',
                a: 'Reprogramar o software',
                b: 'Acessar o modo de programação diretamente',
              },
              {
                rotulo: 'Velocidade',
                a: 'Mudanças em semanas ou sessões',
                b: 'Mudanças em minutos, quando indicado',
              },
              {
                rotulo: 'Controle do cliente',
                a: 'Ativo, consciente, participativo',
                b: 'Dissociado leve, acesso a recursos automáticos',
              },
              {
                rotulo: 'Profundidade',
                a: 'Crenças, estratégias, identidade',
                b: 'Emoções, memórias, padrões automáticos profundos',
              },
            ]}
          />

          <div className="mt-10 border-t border-white/12 pt-8">
            <p className="mb-6 font-display text-xl leading-snug text-white italic">
              “A mágica não está em escolher um. Está em saber quando combinar.”
            </p>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="rotulo mb-3">Exemplo: fobia de avião</p>
                <ul className="space-y-2 text-[13.5px] leading-relaxed">
                  <li>
                    <strong className="text-white">PNL:</strong> análise da crença “aviões
                    caem”, swish pattern para imagem positiva.
                  </li>
                  <li>
                    <strong className="text-white">Hipnoterapia:</strong> dessensibilização em
                    transe, ancoragem de calma para o dia do voo.
                  </li>
                  <li className="text-brand-accent">
                    Resultado: mudança estrutural mais recurso emocional sob demanda.
                  </li>
                </ul>
              </div>
              <div>
                <p className="rotulo mb-3">Exemplo: insônia</p>
                <ul className="space-y-2 text-[13.5px] leading-relaxed">
                  <li>
                    <strong className="text-white">Hipnoterapia:</strong> indução noturna,
                    higiene do sono.
                  </li>
                  <li>
                    <strong className="text-white">PNL:</strong> submodalidades da “cama como
                    lugar de preocupação” para “cama como lugar de sono”.
                  </li>
                  <li className="text-brand-accent">
                    Resultado: transe para adormecer mais reestruturação do estímulo.
                  </li>
                </ul>
              </div>
            </div>

            <figure className="mt-10 border-l-2 border-brand-accent pl-5">
              <blockquote className="font-display text-[16.5px] leading-relaxed text-white/85 italic">
                “PNL é a língua que falo com a mente consciente. Hipnoterapia é a língua que
                falo com a mente inconsciente. Fluente em ambas, sou bilíngue da transformação.”
              </blockquote>
              <figcaption className="rotulo mt-3">Bruno Sena</figcaption>
            </figure>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to={routes.pnlPractitioner} className="btn-outline">
                Quero PNL
              </Link>
              <Link to={routes.jornada} className="btn-outline">
                Quero os dois — ver o pacote
              </Link>
            </div>
          </div>
        </SecaoCurso>

        <SecaoCurso cor="purple" sobretitulo="Perguntas" titulo="Dúvidas frequentes">
          <Faq items={perguntas} />
        </SecaoCurso>

        <SecaoCurso cor="purple" sobretitulo="Método">
          <SenaExplanation />
        </SecaoCurso>

        <SecaoCurso cor="purple" sobretitulo="Avaliações">
          <CourseReviews courseId={curso.slug} />
        </SecaoCurso>
      </PaginaCurso>
    </>
  );
}
