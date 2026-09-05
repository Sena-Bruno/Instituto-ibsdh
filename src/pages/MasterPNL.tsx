import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import Ementa from '../components/Ementa';
import Faq from '../components/Faq';
import PaginaCurso, { Comparativo, ListaItens, SecaoCurso } from '../components/PaginaCurso';
import SenaExplanation from '../components/SenaExplanation';
import { courses } from '../config/courses';
import { contarAulas, curriculoMasterPnl } from '../config/curriculos';
import { routes, site } from '../config/site';

const curso = courses.masterPnl;
const aulas = contarAulas(curriculoMasterPnl);

const arsenal = [
  {
    titulo: 'Modelagem comportamental',
    nota: 'Extrair a estratégia de excelência de qualquer pessoa e instalá-la em si mesmo ou em clientes.',
  },
  {
    titulo: 'Linguagem hipnótica (Milton)',
    nota: 'Uso avançado de padrões de linguagem para contornar o fator crítico com elegância.',
  },
  {
    titulo: 'Sleight of Mouth',
    nota: '24 padrões para ressignificar crenças limitantes dentro da própria conversa.',
  },
  {
    titulo: 'Metaprogramas',
    nota: 'Identificar os filtros inconscientes que determinam como alguém decide, compra e se motiva.',
  },
  {
    titulo: 'Linha do tempo avançada',
    nota: 'Intervenções no passado para liberar emoções negativas e construir um futuro compulsivo.',
  },
  {
    titulo: 'Valores e critérios',
    nota: 'Alinhar conflitos internos profundos que sabotam o resultado pessoal e profissional.',
  },
];

/** Depoimentos específicos desta formação, mantidos como estavam. */
const depoimentos = [
  {
    nome: 'Carlos M.',
    papel: 'Consultor de vendas',
    iniciais: 'CM',
    texto:
      'O módulo de Sleight of Mouth mudou minhas negociações. Consigo desarmar objeções de clientes high-ticket antes mesmo que eles percebam. O SENA me treinou para ser rápido.',
  },
  {
    nome: 'Ana P.',
    papel: 'Psicanalista e Master Practitioner',
    iniciais: 'AP',
    texto:
      'Sou terapeuta há 10 anos. O Master me deu a estrutura para casos que antes me travavam. A avaliação do SENA é rigorosa, reprovei duas vezes, mas quando passei, sabia que estava pronta.',
  },
  {
    nome: 'Roberto F.',
    papel: 'Gerente de projetos',
    iniciais: 'RF',
    texto:
      'A modelagem comportamental é um superpoder. Usei as técnicas do módulo 1 para modelar o melhor gestor da minha empresa. Fui promovido em 6 meses.',
  },
];

const perguntas = [
  {
    q: 'Preciso ter feito o Practitioner com vocês?',
    a: 'Não obrigatoriamente. Se você tem formação Practitioner por outra instituição e domina os fundamentos (Rapport, VAKOG, Metamodelo, Ancoragem), conseguirá acompanhar. O SENA Avançado testará esses conhecimentos na prática.',
  },
  {
    q: 'O que acontece se eu reprovar na avaliação do SENA Avançado?',
    a: 'Você pode refazer a avaliação quantas vezes precisar. O objetivo não é punir, e sim garantir que você atinja a excelência. O SENA dá devolutiva detalhada sobre onde você falhou, para estudar e tentar de novo.',
  },
  {
    q: 'O certificado é reconhecido pelo MEC?',
    a: 'A PNL é classificada como curso livre de qualificação profissional. Nosso certificado atesta competência técnica por avaliação rigorosa no SENA, o que tem alto valor no mercado privado — mas não é uma pós-graduação acadêmica.',
  },
  {
    q: 'O Master ensina hipnose clínica?',
    a: 'Ensinamos a Linguagem Hipnótica (Modelo Milton) aplicada à conversação e à mudança de crenças. Não é curso de hipnose de palco nem de hipnoterapia clássica — para isso existe a formação em Hipnoterapia Clínica.',
  },
];

export default function MasterPNL() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.masterPnl}`} />
        <title>Formação Master PNL | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Formação Master em PNL: modelagem comportamental, metaprogramas, Sleight of Mouth e Modelo Milton, com avaliação por competência no simulador SENA Avançado."
        />
        <meta property="og:title" content="Formação Master PNL | Instituto Bruno Sena" />
        <meta
          property="og:description"
          content="Modelagem, metaprogramas e intervenção avançada, com avaliação por competência demonstrada."
        />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta property="og:url" content={`${site.url}${routes.masterPnl}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <PaginaCurso
        curso={curso}
        trilha={[
          { rotulo: 'PNL Practitioner', para: routes.pnlPractitioner },
          { rotulo: 'Hipnoterapia Clínica', para: routes.hipnoterapia },
          { rotulo: 'Master PNL', atual: true },
        ]}
        titulo="Master PNL"
        resumo={
          <p>
            Do competente ao referência. Para quem já domina o básico e quer as técnicas que
            separam técnicos de estrategistas. No{' '}
            <strong className="text-white">SENA Avançado</strong> a prática é com casos de alta
            dificuldade, avaliados por decisão clínica — nota mínima 8/10 para a certificação.
          </p>
        }
        preRequisito={
          <>
            <p className="text-[14.5px] font-semibold text-white">
              Assume domínio dos fundamentos
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed">
              Esta formação parte de VAKOG, Rapport, Ancoragem e Metamodelo já sabidos. Sem
              formação Practitioner — por nós ou por outra instituição — o SENA Avançado
              bloqueia o progresso já nas primeiras aulas.{' '}
              <Link to={routes.pnlPractitioner} className="text-brand-accent hover:underline">
                Ver o Practitioner
              </Link>
              .
            </p>
          </>
        }
        acao="Garantir minha vaga"
        especificacoes={[
          { rotulo: 'Carga horária', valor: '120h' },
          { rotulo: 'Aulas', valor: String(aulas) },
          { rotulo: 'Acesso', valor: 'vitalício' },
          { rotulo: 'Certificado', valor: 'IBSDH' },
          { rotulo: 'SENA Avançado', valor: 'incluso' },
          { rotulo: 'Nota mínima', valor: '8/10' },
        ]}
      >
        <SecaoCurso
          numero="01"
          rotulo="O problema"
          titulo="Você já sabe aplicar PNL. Mas será que domina?"
        >
          <p className="max-w-2xl text-[15.5px] leading-relaxed">
            O Practitioner te deu o vocabulário. O Master te dá a fluência. Muitos param no
            básico e travam quando o cliente apresenta resistências complexas, crenças
            emaranhadas, ou quando a técnica “de livro” simplesmente não funciona.
          </p>

          <ListaItens
            className="mt-8"
            itens={[
              {
                titulo: 'Casos complexos',
                nota: 'Quando uma fobia esconde um ganho secundário profundo.',
              },
              {
                titulo: 'Resistência',
                nota: 'Quando o cliente diz “sim” mas a fisiologia grita “não”.',
              },
              {
                titulo: 'Estratégia',
                nota: 'Saber qual técnica usar, em qual ordem, e por quê.',
              },
            ]}
          />
        </SecaoCurso>

        <SecaoCurso numero="02" rotulo="Competências" titulo="O arsenal de um Master">
          <p className="mb-8 max-w-2xl text-[15.5px] leading-relaxed">
            Técnicas avançadas, validadas por simulação — não por leitura.
          </p>
          <ListaItens itens={arsenal} />
        </SecaoCurso>

        <SecaoCurso numero="03" rotulo="Para quem é" titulo="Para quem é o Master?">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="rotulo mb-4">Terapeutas e coaches</p>
              <ListaItens
                itens={[
                  { titulo: 'Lidar com clientes difíceis ou resistentes' },
                  { titulo: 'Resultados mais rápidos em casos complexos' },
                  { titulo: 'Aumentar o valor da sua hora de sessão' },
                ]}
              />
            </div>
            <div>
              <p className="rotulo mb-4">Líderes e negociadores</p>
              <ListaItens
                itens={[
                  { titulo: 'Persuasão ética com Sleight of Mouth' },
                  { titulo: 'Modelar a excelência de top performers' },
                  { titulo: 'Resolver conflitos de valores em equipes' },
                ]}
              />
            </div>
          </div>
        </SecaoCurso>

        <SecaoCurso numero="04" rotulo="Ementa" id="ementa" titulo="Ementa Master PNL — 120h">
          <Ementa modulos={curriculoMasterPnl} />
        </SecaoCurso>

        <SecaoCurso
          numero="05"
          rotulo="Certificação"
          titulo="Não vendemos diplomas. Certificamos competência."
        >
          <Comparativo
            legenda="Comparação entre certificado de conclusão e certificado de competência Master"
            colunas={['Certificado de conclusão', 'Certificado de competência Master']}
            linhas={[
              {
                rotulo: 'Como obter',
                a: 'Emitido automaticamente ao assistir todas as aulas',
                b: 'Aprovação no SENA Avançado (nota 8/10) e projeto de modelagem entregue',
              },
              {
                rotulo: 'Valida',
                a: 'Presença no conteúdo',
                b: 'Decisão clínica em caso complexo, com ecologia verificada',
              },
            ]}
          />

          <img
            src="/Certificado-IBSDH.webp"
            alt="Certificado de competência Master emitido pelo IBSDH"
            className="mt-10 w-full border border-white/10"
            loading="lazy"
            decoding="async"
          />
        </SecaoCurso>

        <SecaoCurso numero="06" rotulo="Comparação" titulo="Qual o seu próximo passo?">
          <Comparativo
            legenda="Comparação entre as formações Practitioner e Master"
            colunas={['Practitioner — o fundamento', 'Master — a excelência']}
            linhas={[
              {
                rotulo: 'Foco',
                a: 'Aprender o vocabulário, aplicar técnicas base, resolver questões pontuais.',
                b: 'Fluência, estratégia, casos complexos, modelagem de excelência.',
              },
              {
                rotulo: 'Ementa',
                a: 'VAKOG, Rapport, Metamodelo, Ancoragem, cura de fobia simples.',
                b: 'Metaprogramas, Valores, Sleight of Mouth, Modelo Milton, Modelagem.',
              },
              {
                rotulo: 'Simulador',
                a: 'SENA Básico: guia o paciente, corrige erro de estrutura, foca em aprender.',
                b: 'SENA Avançado: cliente resistente, avalia estratégia, exige ecologia.',
              },
              {
                rotulo: 'Certificação',
                a: 'Nota mínima 7/10.',
                b: 'Nota mínima 8/10 e projeto de modelagem.',
              },
              {
                rotulo: 'Investimento',
                a: `12x ${courses.pnlPractitioner.installment}`,
                b: `12x ${curso.installment}`,
              },
            ]}
          />

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to={routes.pnlPractitioner} className="btn-outline">
              Começar pelo Practitioner
            </Link>
            <Link to={routes.jornada} className="btn-outline">
              Ver o pacote com os três
            </Link>
          </div>
        </SecaoCurso>

        <SecaoCurso numero="07" rotulo="Alunos" titulo="O que dizem os Masters">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {depoimentos.map((dep) => (
              <figure key={dep.nome} className="border-t border-white/12 pt-5">
                <blockquote className="text-[14.5px] leading-relaxed">“{dep.texto}”</blockquote>
                <figcaption className="mt-4 flex items-baseline gap-3">
                  <span className="dado text-[11px] text-brand-accent">{dep.iniciais}</span>
                  <span>
                    <span className="block text-[14px] font-semibold text-white">
                      {dep.nome}
                    </span>
                    <span className="rotulo">{dep.papel}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </SecaoCurso>

        <SecaoCurso numero="08" rotulo="Garantia" titulo="Garantia de evolução">
          <p className="max-w-2xl text-[15.5px] leading-relaxed">
            Você tem 7 dias para testar o Master e o SENA Avançado. Se achar que o nível de
            exigência não é para você, ou que o conteúdo não entrega o que promete, devolvemos
            100% do seu investimento. Sem perguntas.
          </p>

          <ListaItens
            className="mt-8"
            itens={[
              { titulo: 'Formação Master PNL completa — 120h' },
              { titulo: 'Acesso ilimitado ao SENA Avançado' },
              { titulo: 'Certificação de competência, mediante aprovação' },
              { titulo: 'Apostilas e materiais de apoio' },
              { titulo: 'Acesso vitalício, com as atualizações futuras' },
            ]}
          />
        </SecaoCurso>

        <SecaoCurso numero="09" rotulo="Perguntas" titulo="Dúvidas frequentes">
          <Faq items={perguntas} />
        </SecaoCurso>

        <SecaoCurso numero="10" rotulo="Método">
          <SenaExplanation />
        </SecaoCurso>

        <SecaoCurso numero="11" rotulo="Avaliações">
          <CourseReviews courseId={curso.slug} />
        </SecaoCurso>
      </PaginaCurso>
    </>
  );
}
