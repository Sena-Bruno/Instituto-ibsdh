import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import Ementa from '../components/Ementa';
import Faq from '../components/Faq';
import PaginaCurso, { Comparativo, ListaItens, SecaoCurso } from '../components/PaginaCurso';
import SenaExplanation from '../components/SenaExplanation';
import { courses } from '../config/courses';
import { contarAulas, curriculoPnlPractitioner, somarCarga } from '../config/curriculos';
import { routes, site } from '../config/site';

const curso = courses.pnlPractitioner;
const aulas = contarAulas(curriculoPnlPractitioner);
const horas = somarCarga(curriculoPnlPractitioner);

const competencias = [
  {
    titulo: 'Ler padrões mentais',
    nota: 'Identificar sistemas representacionais (VAKOG) e estruturas de pensamento em minutos de conversa.',
  },
  {
    titulo: 'Reprogramar estados emocionais',
    nota: 'Usar ancoragem para criar recursos instantâneos, eliminar gatilhos negativos e gerenciar emoções.',
  },
  {
    titulo: 'Reformular crenças',
    nota: 'Desmontar crenças limitantes com o Metamodelo e reestruturar a codificação interna via submodalidades.',
  },
  {
    titulo: 'Comunicar para influenciar',
    nota: 'Aplicar linguagem que programa e desprograma a mente, do diálogo cotidiano à intervenção terapêutica.',
  },
  {
    titulo: 'Estruturar intervenções',
    nota: 'Conduzir sessões completas de reprogramação mental, do início ao fim, com segurança metodológica e ética.',
  },
];

const aplicacoes = [
  {
    rotulo: 'Âmbito pessoal',
    itens: [
      'Relacionamentos mais saudáveis',
      'Gestão emocional efetiva',
      'Eliminação de hábitos indesejados',
      'Clareza de objetivos e propósito',
    ],
  },
  {
    rotulo: 'Profissional, não terapêutico',
    itens: [
      'Vendas e negociações',
      'Liderança e gestão de equipes',
      'RH e desenvolvimento organizacional',
      'Comunicação persuasiva',
    ],
  },
  {
    rotulo: 'Âmbito terapêutico',
    itens: [
      'Atendimento clínico estruturado',
      'Coaching com resultados mensuráveis',
      'Consultoria em desenvolvimento humano',
      'Abertura de próprio negócio',
    ],
  },
];

const perguntas = [
  {
    q: 'Nunca estudei nada disso. Vou conseguir acompanhar?',
    a: 'Sim. O método foi desenvolvido para quem está começando do zero. Cada conceito é explicado desde a base, com exemplos do dia a dia. E o SENA nunca se cansa de explicar de novo, de outro jeito, até você entender.',
  },
  {
    q: 'Já sou terapeuta ou coach. Este curso agrega?',
    a: 'Com certeza. Muitos alunos experientes relatam que a estrutura organizou conhecimentos que eles tinham de forma fragmentada. O diferencial é o SENA: finalmente um lugar para praticar sem arriscar clientes reais enquanto ainda não está fluente.',
  },
  {
    q: 'Quanto tempo tenho acesso?',
    a: 'Vitalício. E inclui as atualizações que fizermos no futuro, inclusive melhorias no SENA.',
  },
  {
    q: 'O certificado vale para trabalhar?',
    a: 'Sim, para prática de PNL e coaching. O certificado é válido nacionalmente como comprovação de formação, e é emitido apenas após aprovação no exame final com o SENA (nota mínima 7/10) — atestando competência real, não apenas presença.',
  },
  {
    q: 'Preciso fazer prova?',
    a: 'Avaliação prática com o SENA na última aula: você conduz uma sessão simulada e recebe nota e devolutiva detalhada. É necessária para o certificado de competência, mas não para o acesso ao conteúdo.',
  },
  {
    q: 'Como funciona o SENA tecnicamente?',
    a: 'É um agente de IA integrado à área de membros. Você acessa por chat, escolhe o modo (paciente, instrutor ou avaliador) e interage por texto, áudio ou vídeo. Funciona no celular e no computador, sem instalar nada.',
  },
  {
    q: 'E se eu não gostar do SENA?',
    a: 'A garantia de 7 dias cobre todo o curso, incluindo a experiência com o SENA. Se não achar que agrega valor, devolvemos seu dinheiro.',
  },
];

export default function PNLPractitioner() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.pnlPractitioner}`} />
        <title>Formação PNL Practitioner | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Formação PNL Practitioner: VAKOG, rapport, ancoragem, metamodelo e submodalidades, com prática ilimitada no simulador SENA e certificação por competência."
        />
        <meta property="og:title" content="Formação PNL Practitioner | Instituto Bruno Sena" />
        <meta
          property="og:description"
          content="Do zero à competência em reprogramação mental, com prática supervisionada no simulador SENA."
        />
        <meta property="og:image" content={`${site.url}/mockuppnl.webp`} />
        <meta property="og:url" content={`${site.url}${routes.pnlPractitioner}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <PaginaCurso
        curso={curso}
        trilha={[
          { rotulo: 'PNL Practitioner', atual: true },
          { rotulo: 'Hipnoterapia Clínica', para: routes.hipnoterapia },
          { rotulo: 'Master PNL', para: routes.masterPnl },
        ]}
        titulo="PNL Practitioner"
        resumo={
          <p>
            Domine a linguagem da mente e reprograme padrões limitantes, em você ou em qualquer
            pessoa. Sem jargão incompreensível e sem promessa mística — só a técnica, com{' '}
            <strong className="text-white">prática ilimitada no SENA</strong> desde a primeira
            aula.
          </p>
        }
        preRequisito={
          <>
            <p className="text-[14.5px] font-semibold text-white">Sem pré-requisito</p>
            <p className="mt-1 text-[13.5px] leading-relaxed">
              É a porta de entrada da trilha, construída para quem começa do zero — e a base que
              a Hipnoterapia e o Master assumem que você tem.
            </p>
          </>
        }
        acao="Quero começar agora"
        especificacoes={[
          { rotulo: 'Carga horária', valor: `${horas}h` },
          { rotulo: 'Aulas', valor: String(aulas) },
          { rotulo: 'Acesso', valor: 'vitalício' },
          { rotulo: 'Certificado', valor: 'IBSDH' },
          { rotulo: 'Simulador SENA', valor: 'ilimitado' },
          { rotulo: 'Nota mínima', valor: '7/10' },
        ]}
      >
        <SecaoCurso
          numero="01"
          rotulo="Competências"
          titulo={`Em ${curriculoPnlPractitioner.length} módulos, você sai apto a:`}
        >
          <ListaItens itens={competencias} />

          <div className="bloco-accent mt-8 p-6">
            <p className="rotulo-accent mb-3">E o mais importante</p>
            <p className="text-[15px] leading-relaxed">
              Você não apenas “aprende” — você <strong className="text-white">pratica</strong>.
              O SENA simula situações reais para você treinar quantas vezes quiser, com
              devolutiva imediata, sem depender de ninguém para servir de cobaia.
            </p>
          </div>
        </SecaoCurso>

        <SecaoCurso numero="02" rotulo="Para quem é" titulo="Este curso é para você que:">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="rotulo mb-4">Uso pessoal</p>
              <ListaItens
                itens={[
                  { titulo: 'Quer parar de sabotar os próprios objetivos' },
                  { titulo: 'Deseja melhorar relacionamentos e comunicação' },
                  { titulo: 'Busca autoconhecimento profundo e prático' },
                  { titulo: 'Quer ferramentas para ansiedade e estresse' },
                ]}
              />
            </div>
            <div>
              <p className="rotulo mb-4">Uso profissional</p>
              <ListaItens
                itens={[
                  { titulo: 'É terapeuta e quer somar PNL à caixa de ferramentas' },
                  { titulo: 'É coach e precisa de resultado mais rápido' },
                  { titulo: 'Trabalha com vendas, RH ou liderança' },
                  { titulo: 'Quer construir carreira em desenvolvimento humano' },
                ]}
              />
            </div>
          </div>

          <p className="mt-8 border-l-2 border-brand-accent pl-5 font-display text-lg leading-snug text-white/85 italic">
            “Não importa seu objetivo. As ferramentas são as mesmas. O que muda é onde você
            aplica.”
          </p>
        </SecaoCurso>

        <SecaoCurso
          numero="03"
          rotulo="Ementa"
          id="ementa"
          titulo={`${horas} horas. ${aulas} aulas. Sem enchimento.`}
        >
          <p className="mb-8 max-w-2xl text-[15.5px] leading-relaxed">
            Cada módulo inclui demonstração em vídeo e prática no SENA, conforme a ementa
            oficial IBSDH.
          </p>
          <Ementa modulos={curriculoPnlPractitioner} />
        </SecaoCurso>

        <SecaoCurso numero="04" rotulo="Aplicação" titulo="Onde você pode aplicar">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aplicacoes.map((grupo) => (
              <div key={grupo.rotulo}>
                <p className="rotulo mb-4">{grupo.rotulo}</p>
                <ListaItens itens={grupo.itens.map((titulo) => ({ titulo }))} />
              </div>
            ))}
          </div>
        </SecaoCurso>

        <SecaoCurso numero="05" rotulo="Incluso" titulo="O que vem junto">
          <ListaItens
            itens={[
              { titulo: 'Apostila completa em PDF, conforme a ementa oficial IBSDH' },
              { titulo: `Biblioteca de demonstrações práticas das ${aulas} aulas` },
              { titulo: 'SENA: prática ilimitada, 24 horas, em todos os módulos' },
              { titulo: 'Grupo de suporte e networking' },
              {
                titulo: 'Certificado de PNL Practitioner',
                nota: 'Emitido após aprovação no exame final com o SENA, nota mínima 7/10.',
              },
            ]}
          />
        </SecaoCurso>

        <SecaoCurso
          numero="06"
          rotulo="Comparação"
          titulo="Mesma profundidade. Sem a barreira de preço."
        >
          <Comparativo
            legenda="Comparação entre cursos presenciais tradicionais e a formação do IBSDH"
            colunas={['Cursos tradicionais', 'IBSDH']}
            linhas={[
              { rotulo: 'Investimento', a: 'R$ 2.000 a R$ 5.000', b: curso.price },
              {
                rotulo: 'Formato',
                a: 'Presencial, com deslocamento',
                b: 'Online, no seu ritmo',
              },
              { rotulo: 'Foco', a: 'Teoria e história', b: 'Prática e aplicação' },
              {
                rotulo: 'Prática',
                a: '“Faça com amigos”, se tiver',
                b: 'SENA: simulação ilimitada',
              },
              {
                rotulo: 'Devolutiva',
                a: 'Esperar dias pelo professor',
                b: 'Imediata e específica',
              },
              {
                rotulo: 'Certificação',
                a: 'Apenas presença',
                b: 'Competência demonstrada, nota 7/10',
              },
            ]}
          />

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to={routes.masterPnl} className="btn-outline">
              Já tenho base — ver o Master
            </Link>
            <Link to={routes.jornada} className="btn-outline">
              Ver o pacote com os três
            </Link>
          </div>
        </SecaoCurso>

        <SecaoCurso
          numero="07"
          rotulo="Garantia"
          titulo="Você não arrisca nada. Exceto continuar do jeito que está."
        >
          <div className="max-w-2xl space-y-4 text-[15.5px] leading-relaxed">
            <p>Acesse o curso, assista às primeiras aulas, tente as técnicas.</p>
            <p>
              Se em 7 dias você não sentir que é exatamente o que precisava — seja para uso
              pessoal ou profissional — devolvemos 100% do seu investimento. Sem perguntas, sem
              burocracia.
            </p>
            <p className="font-display text-lg text-white">
              O risco é todo nosso. A transformação pode ser sua.
            </p>
          </div>
        </SecaoCurso>

        <SecaoCurso numero="08" rotulo="Perguntas" titulo="Dúvidas frequentes">
          <Faq items={perguntas} />
        </SecaoCurso>

        <SecaoCurso numero="09" rotulo="Método">
          <SenaExplanation />
        </SecaoCurso>

        <SecaoCurso numero="10" rotulo="Avaliações">
          <CourseReviews courseId={curso.slug} />
        </SecaoCurso>
      </PaginaCurso>
    </>
  );
}
