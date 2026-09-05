import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import CourseImage from '../components/CourseImage';
import Faq from '../components/Faq';
import Secao, { Revela, SecaoIntro, SecaoTitulo } from '../components/Secao';
import SenaSimulador from '../components/SenaSimulador';
import { Dados, type ItemTrilha, Trilha } from '../components/Tabela';
import { courses } from '../config/courses';
import { site, whatsappLink, whatsappMessages } from '../config/site';
import { duration, ease } from '../lib/motion';

/**
 * A home, reestruturada de 16 seções para 8.
 *
 * O diagnóstico era de hierarquia, não de estética: as 16 seções tinham
 * todas a mesma altura, o mesmo orbe de blur no fundo e o mesmo par
 * badge + título + grid de cards. Sem pico nem vale, quem rolava não
 * guardava nada — e a seção que mais importa ficava em quarto lugar.
 *
 * O que mudou de estrutura:
 *
 *   · O SENA subiu da 4ª para a 2ª posição e virou interativo. É o único
 *     argumento que a concorrência não copia, e estava sendo apresentado
 *     como captura de tela.
 *   · Sete pares de seções redundantes viraram uma cada: Cursos + Como
 *     funciona, Para quem é + Por que nós, Certificados + Parceiros,
 *     Mentor + Depoimentos, FAQ + Pagamento seguro.
 *   · Os selos de confiança viraram uma faixa de dados dentro do hero:
 *     promessa, ação e prova na mesma tela.
 *   · Os Ebooks saíram. Oferecer um ebook de R$ 27 na mesma página de uma
 *     formação de R$ 997 dá uma saída barata a quem estava quase comprando.
 *     (Os três botões daquela seção também não tinham destino nenhum.)
 *   · O In Company saiu para o rodapé: é outro público e outra jornada de
 *     compra, e no meio da home competia com a matrícula.
 *   · A vitrine de "instituições parceiras" saiu. Os quatro nomes eram
 *     genéricos e repetidos para preencher o carrossel; a credencial real
 *     do instituto — NLPEA e IBSDH — está na seção de certificação.
 */

/* ── Hero ─────────────────────────────────────────────────────────────────── */

const provas = [
  { rotulo: 'Alunos formados', valor: '+2.500', nota: 'De terapeutas a executivos.' },
  { rotulo: 'Certificação', valor: 'NLPEA + IBSDH', nota: 'Internacional e nacional.' },
  { rotulo: 'Acesso', valor: 'Vitalício', nota: 'Inclui as atualizações.' },
  { rotulo: 'Garantia', valor: '7 dias', nota: 'Devolução integral.' },
];

function Hero() {
  return (
    <section className="grade relative border-b border-white/8 pt-32 pb-0 md:pt-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out }}
          >
            <p className="rotulo-accent mb-7">
              Instituto de formação em desenvolvimento humano
            </p>

            <h1 className="max-w-[19ch] font-display text-[40px] leading-[1.06] font-semibold tracking-tight text-white sm:text-[52px] lg:text-[60px]">
              Aprender a técnica é a parte fácil. Saber quando usar é a formação.
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed md:text-lg">
              PNL, Hipnoterapia e Coaching com prática supervisionada antes do primeiro
              atendimento real. Para terapeutas, coaches, líderes — e para quem quer
              autodomínio, sem intenção de atender ninguém.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#formacoes" className="btn-primary">
                Ver as formações <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#sena" className="btn-outline">
                Experimentar o simulador
              </a>
            </div>
          </motion.div>

          {/* O retrato é o elemento LCP da home: carrega com prioridade alta e
              tem dimensões declaradas para não deslocar o layout. Perdeu o
              orbe de brilho e a sombra dourada de 30px que tinha atrás. */}
          <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
            <img
              src="/brunosena.webp"
              alt="Bruno Sena, fundador do Instituto"
              width={900}
              height={1206}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full object-cover object-top"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
              }}
            />
          </div>
        </div>

        {/* A prova entra na mesma tela da promessa, em vez de virar uma
            seção própria 900 pixels abaixo. */}
        <Dados itens={provas} className="mt-4 border-b-0" />
      </div>
    </section>
  );
}

/* ── § 01 — SENA ──────────────────────────────────────────────────────────── */

function Sena() {
  return (
    <Secao numero="01" rotulo="Método" peso="maximo" id="sena" grade>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <SecaoTitulo>Experimente atender agora.</SecaoTitulo>
          <SecaoIntro>
            O SENA é a plataforma de simulação clínica do instituto: pacientes virtuais com
            perfil psicológico definido, e devolutiva técnica a cada intervenção. Este é um
            deles. Escolha como você responderia.
          </SecaoIntro>

          <div className="mt-8 border-t border-white/12">
            {[
              { rotulo: 'Perfis clínicos', valor: '8' },
              { rotulo: 'Devolutiva', valor: 'por intervenção' },
              { rotulo: 'Prontuário', valor: 'automático' },
            ].map((item) => (
              <div
                key={item.rotulo}
                className="flex items-baseline justify-between border-b border-white/8 py-3"
              >
                <span className="text-[14px]">{item.rotulo}</span>
                <span className="dado text-[14px] text-white">{item.valor}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-md text-[13.5px] leading-relaxed text-brand-quiet">
            Nenhuma outra formação de PNL no Brasil oferece prática supervisionada antes do
            primeiro atendimento real. É o que separa formação de videoaula.
          </p>
        </div>

        <Revela>
          <SenaSimulador />
        </Revela>
      </div>
    </Secao>
  );
}

/* ── § 02 — Formações ─────────────────────────────────────────────────────── */

const trilha: ItemTrilha[] = [
  {
    numero: '01',
    titulo: courses.pnlPractitioner.title,
    resumo: 'Fundamento. A base que torna o resto mais fácil.',
    valor: courses.pnlPractitioner.price,
    para: courses.pnlPractitioner.route,
    destaque: true,
  },
  {
    numero: '02',
    titulo: courses.hipnoterapia.title,
    resumo: 'Acesso ao inconsciente, com protocolo e limite.',
    valor: courses.hipnoterapia.price,
    para: courses.hipnoterapia.route,
  },
  {
    numero: '03',
    titulo: courses.masterPnl.title,
    resumo: 'Modelagem e intervenção avançada.',
    valor: courses.masterPnl.price,
    para: courses.masterPnl.route,
  },
  {
    numero: '04',
    titulo: courses.masterCoach.title,
    resumo: 'Coaching executivo e ferramentas sistêmicas.',
    valor: courses.masterCoach.price,
    para: courses.masterCoach.route,
    estado: 'Em breve',
  },
];

const etapas = [
  'Escolha a formação pelo objetivo, não pelo nome.',
  'Estude no seu ritmo: aulas gravadas, acesso vitalício.',
  'Pratique no SENA, com devolutiva a cada intervenção.',
  'Seja avaliado por competência demonstrada, não por presença.',
];

function Formacoes() {
  return (
    <Secao numero="02" rotulo="Formações" id="formacoes">
      <SecaoTitulo>Uma trilha, não uma vitrine.</SecaoTitulo>
      <SecaoIntro>
        A ordem aqui é conteúdo: o Practitioner é pré-requisito da Hipnoterapia, que prepara o
        Master. Se você está começando, comece pela primeira linha.
      </SecaoIntro>

      <div className="mt-10">
        <Trilha itens={trilha} />
      </div>

      {/* Como funciona: era uma seção própria com quatro círculos numerados e
          uma linha de gradiente ligando eles. Aqui é o desdobramento natural
          da trilha, em quatro linhas. */}
      <div className="mt-14">
        <p className="rotulo mb-5">Como funciona</p>
        <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {etapas.map((etapa, i) => (
            <li key={etapa} className="flex gap-4 border-t border-white/8 pt-4">
              <span className="dado shrink-0 text-[13px] text-brand-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14.5px] leading-relaxed">{etapa}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* A Trilogia. Era um card dourado centralizado com selo de "OFERTA
          ESPECIAL" e botão em pílula com brilho — a estética exata que a
          Direção B abandona. Continua sendo a oferta de maior valor, e agora
          se apresenta como o que é: um pacote com preço e economia. */}
      <div className="bloco-accent mt-14 flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between md:p-9">
        <div>
          <p className="rotulo-accent mb-3">Pacote completo</p>
          <h3 className="font-display text-2xl font-semibold text-white md:text-[28px]">
            Trilogia IBSDH
          </h3>
          <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed">
            Practitioner, Hipnoterapia e Master PNL juntos, por{' '}
            <strong className="text-white">{courses.trilogia.price}</strong> — menos do que a
            soma das três matrículas separadas.
          </p>
        </div>
        <Link to={courses.trilogia.route} className="btn-primary shrink-0">
          Ver a Trilogia <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Secao>
  );
}

/* ── § 03 — Diferencial ───────────────────────────────────────────────────── */

const publicos = [
  {
    rotulo: 'Para você',
    titulo: 'Desenvolvimento pessoal',
    texto:
      'Quebre ciclos de autossabotagem, elimine crenças limitantes e assuma o controle das suas emoções. Sem intenção de atender ninguém — e isso é um caminho legítimo aqui.',
    itens: [
      'Ansiedade e procrastinação',
      'Foco e disciplina',
      'Relacionamentos',
      'Inteligência emocional',
    ],
  },
  {
    rotulo: 'Para profissionais',
    titulo: 'Carreira e clínica',
    texto:
      'Ferramentas de transformação humana para aplicar em pacientes, clientes ou equipe. Com certificação que permite atuação profissional imediata.',
    itens: [
      'Prática clínica certificada',
      'Nova fonte de renda',
      'Ferramentas para psicólogos',
      'Liderança e negociação',
    ],
  },
];

const diferenciais = [
  {
    numero: '01',
    titulo: 'Método A.P.L.I.C.A.R.',
    tese: 'Teoria sem prática é entretenimento. Prática sem método é acidente.',
    texto:
      'Sete etapas progressivas em que você faz, erra, corrige e domina — desde a primeira aula, não no final do curso.',
  },
  {
    numero: '02',
    titulo: 'Linguagem sem jargão',
    tese: 'Descomplicamos o que é complexo, sem perder a profundidade.',
    texto:
      'Não importa se você nunca estudou psicologia ou se já atua na área: o método traduz conceito avançado em passo acionável.',
  },
  {
    numero: '03',
    titulo: 'Avaliação por competência',
    tese: 'O certificado atesta o que você sabe fazer, não onde você esteve.',
    texto:
      'Exame prático com critérios publicados. Quem não demonstra a competência não recebe o certificado — é o que dá valor a quem recebe.',
  },
];

function Diferencial() {
  return (
    <Secao numero="03" rotulo="Diferencial">
      <SecaoTitulo>Por que isto e não um curso de R$ 47.</SecaoTitulo>
      <SecaoIntro>
        A pergunta é justa: o mercado está cheio de curso de PNL barato. A diferença não está na
        lista de técnicas — está em como você é levado a aplicá-las e em quem assina que você
        sabe.
      </SecaoIntro>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
        {publicos.map((publico) => (
          <div key={publico.rotulo} className="border-t border-white/12 pt-6">
            <p className="rotulo mb-4">{publico.rotulo}</p>
            <h3 className="font-display text-2xl font-semibold text-white">{publico.titulo}</h3>
            <p className="mt-3 text-[15px] leading-relaxed">{publico.texto}</p>
            <ul className="mt-5">
              {publico.itens.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 border-b border-white/8 py-2.5 text-[14px]"
                >
                  <span aria-hidden="true" className="text-brand-accent">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="rotulo mb-6">O que sustenta isso</p>
        <div className="grid gap-8 md:grid-cols-3">
          {diferenciais.map((item) => (
            <div key={item.numero} className="border-t border-white/12 pt-5">
              <p className="dado mb-4 text-[13px] text-brand-accent">{item.numero}</p>
              <h3 className="font-display text-xl font-semibold text-white">{item.titulo}</h3>
              <p className="mt-3 font-display text-[15.5px] leading-snug text-white/75 italic">
                {item.tese}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </Secao>
  );
}

/* ── § 04 — Certificação ──────────────────────────────────────────────────── */

const certificados = [
  {
    rotulo: 'Reconhecimento internacional',
    titulo: 'Certificação NLPEA',
    texto:
      'Emitida pela Neuro Linguistic Programming Excellence Assurance, com sede no Reino Unido. Registro único e vitalício, válido em qualquer país.',
    imagem: undefined,
    alt: 'Certificado Internacional NLPEA',
    nome: 'Certificado NLPEA',
  },
  {
    rotulo: 'Chancela nacional',
    titulo: 'Certificação IBSDH',
    texto:
      'Emitida pelo Instituto Bruno Sena de Desenvolvimento Humano, apenas após avaliação de performance prática e aprovação no exame. Atesta competência clínica, técnica e ética.',
    imagem: '/Certificado-IBSDH.webp',
    alt: 'Certificado IBSDH',
    nome: 'Certificado IBSDH',
  },
];

function Certificacao() {
  return (
    <Secao numero="04" rotulo="Certificação">
      <SecaoTitulo>Duas assinaturas no seu certificado.</SecaoTitulo>
      <SecaoIntro>
        Credencial é âncora de confiança neste mercado, e por isso merece ser verificável. Cada
        formação emite os dois documentos abaixo.
      </SecaoIntro>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {certificados.map((cert) => (
          <div key={cert.titulo}>
            <div className="border border-white/10">
              <CourseImage
                src={cert.imagem}
                alt={cert.alt}
                title={cert.nome}
                className="aspect-[4/3]"
              />
            </div>
            <p className="rotulo mt-5 mb-3">{cert.rotulo}</p>
            <h3 className="font-display text-xl font-semibold text-white">{cert.titulo}</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed">{cert.texto}</p>
          </div>
        ))}
      </div>
    </Secao>
  );
}

/* ── § 05 — Quem ensina ───────────────────────────────────────────────────── */

const depoimentos = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Psicóloga Clínica',
    initial: 'AS',
    text: 'A formação em Master PNL transformou completamente a minha abordagem clínica. Hoje consigo acessar a raiz dos problemas dos meus pacientes de forma muito mais rápida e profunda.',
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Empresário',
    initial: 'CM',
    text: 'O curso me deu ferramentas práticas para liderar minha equipe com mais empatia e assertividade. Os resultados na empresa foram imediatos após aplicar as técnicas de ancoragem.',
  },
  {
    id: 3,
    name: 'Juliana Costa',
    role: 'Coach de Carreira',
    initial: 'JC',
    text: 'Fiz a formação em Hipnoterapia e foi um divisor de águas. A didática do Instituto Bruno Sena é excepcional, e o suporte pós-curso faz toda a diferença na nossa segurança profissional.',
  },
  {
    id: 4,
    name: 'Roberto Almeida',
    role: 'Terapeuta Holístico',
    initial: 'RA',
    text: 'A Jornada do Herói me ajudou a ressignificar traumas que eu nem sabia que estavam me travando. É uma experiência intensa e profundamente curadora.',
  },
  {
    id: 5,
    name: 'Mariana Souza',
    role: 'Professora',
    initial: 'MS',
    text: 'Sempre tive muito medo de falar em público. Com as técnicas de PNL Practitioner, consegui superar esse bloqueio e hoje dou palestras para centenas de pessoas com tranquilidade.',
  },
  {
    id: 6,
    name: 'Fernando Dias',
    role: 'Gestor Comercial',
    initial: 'FD',
    text: 'O método A.P.L.I.C.A.R mudou o jogo para mim. Não é só teoria vazia. Consegui dobrar os resultados do meu time de vendas usando as estratégias de comunicação e rapport avançado que aprendi aqui.',
  },
];

function QuemEnsina() {
  return (
    <Secao numero="05" rotulo="Quem ensina" id="sobre-mentor">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="border border-white/10">
            <img
              loading="lazy"
              decoding="async"
              src="/brunosena.webp"
              width={900}
              height={1206}
              className="w-full object-cover"
              alt="Bruno Sena"
            />
          </div>
          <p className="rotulo mt-4">Bruno Sena · Fundador · Membro vitalício NLPEA</p>
        </div>

        <div>
          <SecaoTitulo as="h2">
            “O método é o protagonista. Eu sou apenas o arquiteto.”
          </SecaoTitulo>

          <div className="mt-7 space-y-5 text-[15.5px] leading-relaxed">
            <p>Não sou o terapeuta com 30 anos de clínica. Não sou um guru de palco lotado.</p>
            <p className="font-display text-xl text-white">Sou obcecado por método.</p>
            <p>
              Passei os últimos anos desmontando as técnicas dos melhores profissionais em PNL,
              Hipnoterapia e Coaching do Brasil. Testei, falhei, refinei, sistematizei. O
              resultado funciona tanto para o terapeuta que quer cobrar R$ 500 por sessão quanto
              para a pessoa que simplesmente quer parar de sabotar a própria vida.
            </p>
            <p>
              Não vendo transformação mágica. Entrego{' '}
              <strong className="text-white">ferramentas reproduzíveis</strong>.
            </p>
            <blockquote className="border-l-2 border-brand-accent pl-5 font-display text-[15.5px] leading-relaxed text-white/75 italic">
              “Se você quer charlatanismo, existem milhares de gurus por aí. Se quer estrutura
              que gera resultado, você está no lugar certo.”
            </blockquote>
          </div>

          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-7 inline-flex"
          >
            {site.social.instagramHandle} no Instagram
          </a>
        </div>
      </div>

      {/* Os depoimentos ficam nesta seção, não em uma própria: a pessoa e a
          prova do que ela ensina andam juntas. Eram cards arredondados com
          cinco estrelas idênticas em cada um — a estrela repetida seis vezes
          não informa nada. Agora são citações com atribuição. */}
      <div className="mt-16">
        <p className="rotulo mb-6">Alunos, nas palavras deles</p>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {depoimentos.map((dep) => (
            <figure key={dep.id} className="border-t border-white/12 pt-5">
              <blockquote className="text-[14.5px] leading-relaxed">“{dep.text}”</blockquote>
              <figcaption className="mt-4 flex items-baseline gap-3">
                <span className="dado text-[11px] text-brand-accent">{dep.initial}</span>
                <span>
                  <span className="block text-[14px] font-semibold text-white">{dep.name}</span>
                  <span className="rotulo">{dep.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Secao>
  );
}

/* ── § 06 — Objeções ──────────────────────────────────────────────────────── */

const perguntas = [
  {
    q: 'Preciso ser da área da saúde ou ter formação prévia?',
    a: 'Não. Nossos alunos vão desde psicólogos até donos de pequenos negócios, de coaches a pessoas em transição de carreira. O método foi construído para ser acessível a qualquer pessoa com disposição para praticar.',
  },
  {
    q: 'Posso usar para atender outras pessoas profissionalmente?',
    a: 'Sim. Todos os cursos entregam certificado válido para prática profissional. Porém, verifique a legislação específica da sua região. Algumas práticas podem exigir regulamentação adicional dependendo do estado.',
  },
  {
    q: 'E se eu quiser usar só para mim, para autoconhecimento?',
    a: 'Perfeito. Muitos alunos fazem exatamente isso. As técnicas de reprogramação mental funcionam independentemente de quem está aplicando, em você ou em outros.',
  },
  {
    q: 'Os cursos são gravados ou ao vivo?',
    a: '100% gravados, com acesso vitalício. Você estuda no seu ritmo. Mas oferecemos encontros mensais ao vivo para tirar dúvidas — opcionais e gravados para quem não pode participar.',
  },
  {
    q: 'Tem garantia?',
    a: '7 dias de garantia incondicional. Acesse o conteúdo, teste o método. Se não fizer sentido para você, devolvemos 100%.',
  },
  {
    q: 'Qual a diferença entre PNL Practitioner e Master PNL?',
    a: 'O Practitioner é a base completa: tudo que você precisa para usar PNL com competência. O Master aprofunda técnicas avançadas, modelagem estratégica e estruturação de sessões profissionais de alto nível. Comece pelo Practitioner.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: `Todos os pagamentos são processados pela ${site.paymentPlatform}, plataforma especializada em cursos online. Os dados do seu cartão são tratados no ambiente seguro dela — o instituto não os recebe nem armazena. Aceita Pix, boleto e cartão em até 12x.`,
  },
];

function Objecoes() {
  return (
    <Secao numero="06" rotulo="Objeções">
      <SecaoTitulo>O que costuma travar a decisão.</SecaoTitulo>
      <SecaoIntro>
        Reunimos aqui tudo que aparece antes da matrícula — pré-requisito, uso do certificado,
        garantia e forma de pagamento — em vez de espalhar pela página.
      </SecaoIntro>

      <div className="mt-10">
        <Faq items={perguntas} />
      </div>

      <p className="mt-8 max-w-2xl text-[13.5px] leading-relaxed text-brand-quiet">
        Continua em dúvida sobre qual formação serve para o seu momento?{' '}
        <a
          href={whatsappLink(whatsappMessages.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-accent underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-accent"
        >
          Fale com a coordenação no WhatsApp
        </a>
        .
      </p>
    </Secao>
  );
}

/* ── § 07 — Matrícula ─────────────────────────────────────────────────────── */

function Matricula() {
  return (
    <Secao numero="07" rotulo="Matrícula" peso="alto" grade>
      <SecaoTitulo>Comece pelo Practitioner.</SecaoTitulo>
      <SecaoIntro>
        É a base que torna todas as outras formações mais fáceis, e a única que não tem
        pré-requisito. {courses.pnlPractitioner.price} à vista, ou 12x de{' '}
        {courses.pnlPractitioner.installment} sem juros.
      </SecaoIntro>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href={courses.pnlPractitioner.checkout}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Matricular no Practitioner <ArrowRight size={16} aria-hidden="true" />
        </a>
        <Link to={courses.pnlPractitioner.route} className="btn-outline">
          Ver a ementa completa
        </Link>
      </div>

      <p className="rotulo mt-8">7 dias de garantia · devolução integral · acesso vitalício</p>
    </Secao>
  );
}

/* ── Página ───────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}/`} />
        <title>Instituto Bruno Sena | Formações em PNL, Hipnoterapia e Coaching</title>
        <meta
          name="description"
          content="Formações em PNL, Hipnoterapia e Coaching com prática clínica supervisionada no simulador SENA. Certificação NLPEA e IBSDH."
        />
        <meta
          property="og:title"
          content="Instituto Bruno Sena | Formações em PNL, Hipnoterapia e Coaching"
        />
        <meta
          property="og:description"
          content="Prática clínica supervisionada antes do primeiro atendimento real. Certificação NLPEA e IBSDH."
        />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta property="og:url" content={`${site.url}/`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <Hero />
        <Sena />
        <Formacoes />
        <Diferencial />
        <Certificacao />
        <QuemEnsina />
        <Objecoes />
        <Matricula />
      </main>
    </>
  );
}
