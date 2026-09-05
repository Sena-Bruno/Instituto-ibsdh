import { Helmet } from '@dr.pogodin/react-helmet';
import {
  ArrowRight,
  Award,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  Globe,
  Instagram,
  Lock,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import CardCurso from '../components/CardCurso';
import CourseImage from '../components/CourseImage';
import Faq from '../components/Faq';
import Numeros from '../components/Numeros';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import SenaSimulador from '../components/SenaSimulador';
import { courses } from '../config/courses';
import { site, whatsappLink, whatsappMessages } from '../config/site';
import { paletas } from '../lib/cores';
import { duration, ease } from '../lib/motion';

/**
 * A home.
 *
 * A linguagem visual é a mistura das direções D (cor como sistema de
 * orientação) e E (escala e contraste). O brilho voltou, mas com dono: ele
 * herda a cor da seção e só aparece onde há uma cor governando.
 *
 * Sobre o tamanho: uma versão anterior cortou a home de 16 para 8 seções, e
 * ficou curta demais. Aqui as seções voltaram — Ebooks, In Company e a faixa
 * de instituições — e as fusões foram desfeitas: "Como funciona", "Por que
 * nós", "Depoimentos" e "Pagamento seguro" voltam a ter seção própria.
 *
 * Três blocos voltaram com o conteúdo trocado, e é de propósito:
 *
 *   · A faixa de instituições listava quatro nomes genéricos ("Global Tech",
 *     "Institutos Financeiros") repetidos para preencher o carrossel, sob a
 *     frase "metodologia aplicada em instituições como". Nomes de parceiro
 *     que não existem são risco de credibilidade, então a faixa passou a
 *     listar as ÁREAS em que os alunos atuam — que é verdade e diz a mesma
 *     coisa. Quando houver logo de parceiro real, entra aqui.
 *   · O selo "+50 Empresas Transformadas" vinha com quatro avatares
 *     inventados. O número ficou, os rostos falsos saíram.
 *   · Os três botões dos Ebooks não tinham destino. Enquanto não houver
 *     link de checkout, o pedido chega pela coordenação no WhatsApp.
 */

/* ── Hero ─────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
      <div
        aria-hidden="true"
        className="brilho -top-48 left-[44%] h-[560px] w-[820px]"
        style={{ '--brilho': paletas.accent.brilho } as React.CSSProperties}
      />
      <div
        aria-hidden="true"
        className="brilho top-32 -left-40 h-[520px] w-[520px]"
        style={{ '--brilho': paletas.blue.brilho } as React.CSSProperties}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out }}
          >
            <p className="selo mb-7 border-white/12 bg-white/5 text-brand-accent">
              <span
                aria-hidden="true"
                className="pulso h-1.5 w-1.5 rounded-full bg-brand-emerald shadow-[0_0_10px_#39d4a1]"
              />
              Turmas abertas
            </p>

            <h1 className="titulo-hero max-w-[16ch]">
              Domine as ferramentas que{' '}
              <span className="texto-gradiente">reprogramam vidas.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[17.5px] leading-relaxed md:text-lg">
              PNL, Hipnoterapia e Coaching com prática supervisionada no SENA — nosso simulador
              clínico. Você treina em pacientes virtuais, com devolutiva a cada intervenção,
              antes do primeiro atendimento real.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#cursos" className="btn-primary">
                Quero começar agora <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a href="#sena" className="btn-outline">
                Experimentar o SENA
              </a>
            </div>
          </motion.div>

          {/* A pilha de cores é a legenda visual do site: quem chega já
              aprende que azul é Practitioner, roxo é Hipnoterapia e dourado
              é Master, antes de rolar até os cards. */}
          <div className="flex flex-col gap-3">
            {[
              { nivel: 'Nível 01', curso: courses.pnlPractitioner, cor: 'blue' as const },
              { nivel: 'Nível 02', curso: courses.hipnoterapia, cor: 'purple' as const },
              { nivel: 'Nível 03', curso: courses.masterPnl, cor: 'accent' as const },
            ].map(({ nivel, curso, cor }) => (
              <Link
                key={curso.route}
                to={curso.route}
                className={`rounded-[20px] border bg-gradient-to-br px-6 py-5 transition-colors ${paletas[cor].borda} ${paletas[cor].bordaHover} ${paletas[cor].capa}`}
              >
                <span className={`sobretitulo block ${paletas[cor].texto}`}>{nivel}</span>
                <span className="mt-1.5 block font-display text-lg font-bold text-white">
                  {curso.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Números ──────────────────────────────────────────────────────────────── */

function Prova() {
  return (
    <Secao className="py-14 md:py-16">
      <Numeros
        itens={[
          {
            valor: '2.500',
            sufixo: '+',
            legenda: 'Alunos formados, de terapeutas a executivos',
          },
          { valor: '100', sufixo: 'h', legenda: 'De formação em cada trilha completa' },
          { valor: '8', legenda: 'Perfis clínicos no simulador SENA' },
          { valor: '7', sufixo: 'd', legenda: 'De garantia incondicional, em qualquer curso' },
        ]}
        className="border-t-0 pt-0"
      />
    </Secao>
  );
}

/* ── SENA ─────────────────────────────────────────────────────────────────── */

function Sena() {
  return (
    <Secao id="sena" cor="accent" brilho brilhoEm="direita" elevada>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Cabecalho
            sobretitulo="Tecnologia exclusiva"
            titulo={
              <>
                Experimente <span className="texto-gradiente">atender agora.</span>
              </>
            }
          >
            O SENA é a plataforma de simulação clínica do instituto: pacientes virtuais com
            perfil psicológico definido e devolutiva técnica a cada intervenção. Este é um deles
            — escolha como você responderia.
          </Cabecalho>

          <div className="mt-9 grid grid-cols-2 gap-3">
            {[
              { valor: '8', rotulo: 'Perfis clínicos' },
              { valor: '44', rotulo: 'Cenários por formação' },
              { valor: 'Texto, áudio', rotulo: 'e vídeo' },
              { valor: 'Automático', rotulo: 'Prontuário de sessão' },
            ].map((item) => (
              <div key={item.rotulo} className="cartao-vidro p-4">
                <p className="font-display text-lg font-bold text-white">{item.valor}</p>
                <p className="mt-1 text-[13px] leading-snug">{item.rotulo}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-md text-[14px] leading-relaxed text-brand-quiet">
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

/* ── Para quem é ──────────────────────────────────────────────────────────── */

const publicos = [
  {
    cor: 'accent' as const,
    icone: <User size={26} aria-hidden="true" />,
    selo: 'Para você',
    titulo: 'Desenvolvimento pessoal',
    texto:
      'Quebre ciclos de autossabotagem, elimine crenças limitantes e assuma o controle da sua mente e das suas emoções. Uma jornada de autoconhecimento — sem nenhuma intenção de atender ninguém, e isso é um caminho legítimo aqui.',
    itens: [
      'Desbloqueie seu potencial oculto',
      'Vença a ansiedade e a procrastinação',
      'Melhore seus relacionamentos pessoais',
      'Tenha mais foco, disciplina e inteligência emocional',
    ],
  },
  {
    cor: 'blue' as const,
    icone: <Briefcase size={26} aria-hidden="true" />,
    selo: 'Para profissionais',
    titulo: 'Carreira e negócios',
    texto:
      'Construa uma carreira como terapeuta ou coach. Ferramentas avançadas de transformação humana para aplicar em pacientes, clientes ou na sua equipe — com certificação que permite atuação imediata.',
    itens: [
      'Certificação reconhecida nacionalmente',
      'Nova fonte de renda ajudando pessoas',
      'Ferramentas para terapeutas e psicólogos',
      'Comunicação persuasiva e liderança',
    ],
  },
];

function ParaQuem() {
  return (
    <Secao cor="blue">
      <Cabecalho
        sobretitulo="Duas trilhas, o mesmo método"
        cor="blue"
        titulo="Para quem é o Instituto Bruno Sena?"
        centralizado
      >
        As formações servem tanto para quem busca uma transformação pessoal quanto para quem
        quer construir carreira em desenvolvimento humano.
      </Cabecalho>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {publicos.map((publico, i) => (
          <Revela key={publico.titulo} atraso={i * 0.08} className="h-full">
            <div
              className={`h-full rounded-[22px] border bg-gradient-to-br p-8 md:p-10 ${paletas[publico.cor].borda} ${paletas[publico.cor].bordaHover} from-white/[0.04] to-transparent transition-colors`}
            >
              <span
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${paletas[publico.cor].tenue} ${paletas[publico.cor].texto}`}
              >
                {publico.icone}
              </span>
              <p className={`sobretitulo mb-3 ${paletas[publico.cor].texto}`}>{publico.selo}</p>
              <h3 className="mb-4 font-display text-[26px] font-bold text-white">
                {publico.titulo}
              </h3>
              <p className="mb-7 leading-relaxed">{publico.texto}</p>
              <ul className="space-y-3.5">
                {publico.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`mt-0.5 shrink-0 ${paletas[publico.cor].texto}`}
                      size={19}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Revela>
        ))}
      </div>
    </Secao>
  );
}

/* ── Cursos ───────────────────────────────────────────────────────────────── */

const vitrine = [
  {
    curso: courses.pnlPractitioner,
    cor: 'blue' as const,
    icone: <Brain size={22} aria-hidden="true" />,
    selo: 'Mais popular',
    resumo:
      'A base que torna todo o resto mais fácil. Comunicação inconsciente, ancoragem emocional e reformulação de crenças.',
  },
  {
    curso: courses.hipnoterapia,
    cor: 'purple' as const,
    icone: <Sparkles size={22} aria-hidden="true" />,
    selo: 'Requer o nível 01',
    resumo:
      'Induções, profundização de transe, protocolos terapêuticos e regressão — com quatro módulos de ética e limites.',
  },
  {
    curso: courses.masterPnl,
    cor: 'accent' as const,
    icone: <Target size={22} aria-hidden="true" />,
    selo: 'Avançado',
    resumo:
      'Modelagem, metaprogramas, Sleight of Mouth e Modelo Milton. Para quem quer ser referência, não só competente.',
    destaque: true,
  },
  {
    curso: courses.masterCoach,
    cor: 'emerald' as const,
    icone: <Award size={22} aria-hidden="true" />,
    selo: 'Lançamento em breve',
    resumo: 'Coaching executivo, abordagem sistêmica e estruturação de negócio de alto valor.',
  },
];

function Cursos() {
  return (
    <Secao id="cursos" cor="accent" brilho brilhoEm="topo">
      <Cabecalho
        sobretitulo="Nossas formações"
        titulo="Escolha sua ferramenta de transformação"
      >
        Cada formação tem uma cor, e ela te acompanha do card até o certificado. Se você está
        começando, comece pelo Practitioner.
      </Cabecalho>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vitrine.map((item, i) => (
          <Revela key={item.curso.route} atraso={i * 0.07} className="h-full">
            <CardCurso
              curso={item.curso}
              cor={item.cor}
              icone={item.icone}
              selo={item.selo}
              resumo={item.resumo}
              destaque={item.destaque}
            />
          </Revela>
        ))}
      </div>

      {/* A Trilogia */}
      <div className="faixa-accent mt-10 flex flex-col gap-7 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <p className="sobretitulo mb-3 text-brand-accent">Pacote completo</p>
          <h3 className="font-display text-[28px] font-bold text-white md:text-[34px]">
            Trilogia IBSDH
          </h3>
          <p className="mt-3 max-w-xl leading-relaxed">
            Practitioner, Hipnoterapia e Master PNL juntos por{' '}
            <strong className="text-white">{courses.trilogia.price}</strong> — R$ 338 a menos do
            que a soma das três matrículas separadas.
          </p>
        </div>
        <Link to={courses.trilogia.route} className="btn-primary shrink-0">
          Ver a Trilogia <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="cartao mt-6 p-7 text-center md:p-8">
        <p className="leading-relaxed">
          <strong className="text-white">Dúvida de qual escolher?</strong> Comece pelo PNL
          Practitioner. É a base que torna todo o resto mais fácil — e muitos alunos fazem os
          três, usando cada um para uma área da vida.
        </p>
      </div>
    </Secao>
  );
}

/* ── Como funciona ────────────────────────────────────────────────────────── */

const etapas = [
  {
    titulo: 'Escolha sua ferramenta',
    texto: 'PNL, Hipnoterapia ou ambas. Comece pelo que faz sentido para o seu objetivo agora.',
  },
  {
    titulo: 'Aprenda no seu ritmo',
    texto:
      'Aulas gravadas e acesso vitalício. Estude quando e onde quiser, quantas vezes quiser.',
  },
  {
    titulo: 'Pratique no SENA',
    texto: 'Pacientes virtuais, quiz, diálogo imersivo e devolutiva a cada intervenção.',
  },
  {
    titulo: 'Aplique e transforme',
    texto: 'Use para si, para outros ou para construir uma nova carreira. Você decide.',
  },
];

function ComoFunciona() {
  return (
    <Secao elevada cor="blue">
      <Cabecalho
        sobretitulo="Como funciona"
        cor="blue"
        titulo="Sua jornada, do início ao fim"
        centralizado
      />

      <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {etapas.map((etapa, i) => (
          <Revela key={etapa.titulo} atraso={i * 0.07} className="h-full">
            <li className="cartao h-full p-7">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-blue/10 font-display text-lg font-extrabold text-brand-blue">
                {i + 1}
              </span>
              <h3 className="titulo-card mb-2.5">{etapa.titulo}</h3>
              <p className="text-[14px] leading-relaxed">{etapa.texto}</p>
            </li>
          </Revela>
        ))}
      </ol>
    </Secao>
  );
}

/* ── Por que nós ──────────────────────────────────────────────────────────── */

const diferenciais = [
  {
    numero: '01',
    titulo: 'Método A.P.L.I.C.A.R.',
    tese: 'Teoria sem prática é entretenimento. Prática sem método é acidente.',
    texto:
      'Sete etapas progressivas em que você faz, erra, corrige e domina — desde a primeira aula, não no final do curso.',
    largo: true,
  },
  {
    numero: '02',
    titulo: 'Linguagem sem jargão',
    tese: 'Descomplicamos o que é complexo, sem perder profundidade.',
    texto:
      'Não importa se você nunca estudou psicologia ou se já atua na área: o método traduz conceito avançado em passo acionável.',
  },
  {
    numero: '03',
    titulo: 'Avaliação por competência',
    tese: 'O certificado atesta o que você sabe fazer, não onde você esteve.',
    texto:
      'Exame prático com critérios publicados. Quem não demonstra a competência não recebe o certificado — é o que dá valor a quem recebe.',
    largo: true,
  },
];

function PorQueNos() {
  return (
    <Secao cor="purple" brilho brilhoEm="centro">
      <Cabecalho
        sobretitulo="Nosso diferencial"
        cor="purple"
        titulo="O que nos separa de qualquer curso de PNL do mercado"
        centralizado
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {diferenciais.map((item, i) => (
          <Revela key={item.numero} atraso={i * 0.08} className="h-full">
            <div className="cartao h-full p-8 hover:border-brand-purple/40 md:p-10">
              <p className="mb-5 font-display text-[34px] leading-none font-extrabold text-white/12">
                {item.numero}
              </p>
              <h3 className="mb-4 font-display text-[24px] font-bold text-white">
                {item.titulo}
              </h3>
              <p className="mb-4 text-[17px] leading-relaxed text-white/75 italic">
                {item.tese}
              </p>
              <p className="leading-relaxed">{item.texto}</p>
            </div>
          </Revela>
        ))}
      </div>
    </Secao>
  );
}

/* ── Certificados ─────────────────────────────────────────────────────────── */

const certificados = [
  {
    cor: 'blue' as const,
    selo: 'Reconhecimento global',
    titulo: 'Certificação internacional NLPEA',
    texto:
      'Reconhecimento vitalício emitido pela Neuro Linguistic Programming Excellence Assurance, com sede no Reino Unido. Seu passaporte global como profissional qualificado em PNL.',
    itens: ['Válido internacionalmente em qualquer país', 'Registro único e vitalício'],
    imagem: undefined,
    alt: 'Certificado Internacional NLPEA',
    nome: 'Certificado NLPEA',
  },
  {
    cor: 'accent' as const,
    selo: 'Selo de excelência',
    titulo: 'Certificação oficial IBSDH',
    texto:
      'Certificado nacional com chancela do Instituto Bruno Sena de Desenvolvimento Humano, emitido apenas após avaliação de performance prática e aprovação no exame.',
    itens: [
      'Atesta competência clínica, técnica e ética',
      'Permite atuação imediata no Brasil',
    ],
    imagem: '/Certificado-IBSDH.webp',
    alt: 'Certificado IBSDH',
    nome: 'Certificado IBSDH',
  },
];

function Certificados() {
  return (
    <Secao elevada>
      <Cabecalho sobretitulo="Titulação" titulo="Veja seus certificados" centralizado>
        Documentos oficiais, chancelados por instituições reconhecidas, que atestam a sua
        capacidade técnica e prática.
      </Cabecalho>

      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {certificados.map((cert, i) => (
          <Revela key={cert.titulo} atraso={i * 0.08}>
            <div className="h-full">
              <div
                className={`overflow-hidden rounded-[22px] border ${paletas[cert.cor].borda}`}
              >
                <CourseImage
                  src={cert.imagem}
                  alt={cert.alt}
                  title={cert.nome}
                  className="aspect-[4/3]"
                />
              </div>
              <p className={`sobretitulo mt-6 mb-3 ${paletas[cert.cor].texto}`}>{cert.selo}</p>
              <h3 className="mb-4 font-display text-[24px] font-bold text-white">
                {cert.titulo}
              </h3>
              <p className="mb-5 leading-relaxed">{cert.texto}</p>
              <ul className="space-y-3">
                {cert.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`mt-0.5 shrink-0 ${paletas[cert.cor].texto}`}
                      size={19}
                      aria-hidden="true"
                    />
                    <span className="text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Revela>
        ))}
      </div>
    </Secao>
  );
}

/* ── Pagamento seguro ─────────────────────────────────────────────────────── */

function PagamentoSeguro() {
  return (
    <Secao cor="emerald" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald">
          <Lock size={26} aria-hidden="true" />
        </span>
        <h2 className="font-display text-[26px] font-bold text-white md:text-[32px]">
          Pagamento 100% seguro
        </h2>
        <p className="mt-4 leading-relaxed">
          Todos os pagamentos são processados pela{' '}
          <strong className="text-white">{site.paymentPlatform}</strong>, plataforma
          especializada em cursos online. Os dados do seu cartão são tratados no ambiente seguro
          dela — o instituto não os recebe nem armazena.
        </p>

        {/* Antes eram 6 imagens buscadas de cdn.simpleicons.org e do
            Wikimedia — hotlink de terceiro que podia sumir a qualquer
            momento e ainda somava 6 conexões externas ao carregamento. */}
        <ul className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
          {[site.paymentPlatform, 'Pix', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto'].map(
            (meio) => (
              <li
                key={meio}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13.5px] font-medium"
              >
                {meio}
              </li>
            ),
          )}
        </ul>
      </div>
    </Secao>
  );
}

/* ── Depoimentos ──────────────────────────────────────────────────────────── */

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

function Depoimentos() {
  return (
    <Secao id="depoimentos" cor="blue" brilho brilhoEm="esquerda" elevada>
      <Cabecalho
        sobretitulo="Prova social"
        cor="blue"
        titulo="O que acontece quando você aplica o método"
        centralizado
      >
        Resultados de alunos que aplicaram as técnicas de PNL e Hipnoterapia nas suas vidas e
        profissões.
      </Cabecalho>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {depoimentos.map((dep, i) => (
          <Revela key={dep.id} atraso={(i % 3) * 0.07} className="h-full">
            <figure className="cartao flex h-full flex-col p-7 hover:border-brand-blue/35">
              <blockquote className="mb-7 flex-1 text-[15.5px] leading-relaxed text-white/85">
                “{dep.text}”
              </blockquote>
              <figcaption className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-blue/25 bg-brand-blue/10 font-display text-[13px] font-bold text-brand-blue">
                  {dep.initial}
                </span>
                <span>
                  <span className="block font-bold text-white">{dep.name}</span>
                  <span className="block text-[13px] text-brand-quiet">{dep.role}</span>
                </span>
              </figcaption>
            </figure>
          </Revela>
        ))}
      </div>
    </Secao>
  );
}

/* ── Ebooks ───────────────────────────────────────────────────────────────── */

const ebooks = [
  {
    titulo: 'O Despertar da Mente',
    subtitulo: 'Introdução à reprogramação mental',
    preco: 'R$ 27',
    img: '/mockuppnl.webp',
  },
  {
    titulo: 'Hipnose no Dia a Dia',
    subtitulo: 'Técnicas que você pode usar hoje',
    preco: 'R$ 27',
    img: '/mockuphip.webp',
  },
];

function Ebooks() {
  return (
    <Secao id="ebooks" cor="purple">
      <Cabecalho
        sobretitulo="Entrada acessível"
        cor="purple"
        titulo="Conheça a didática antes de se comprometer"
        centralizado
      >
        Se você quer sentir o método antes de entrar numa formação completa, comece por aqui.
      </Cabecalho>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {ebooks.map((ebook, i) => (
          <Revela key={ebook.titulo} atraso={i * 0.08} className="h-full">
            <div className="cartao flex h-full flex-col items-center gap-6 p-7 hover:border-brand-purple/40 sm:flex-row">
              <img
                loading="lazy"
                decoding="async"
                src={ebook.img}
                width={320}
                height={420}
                className="w-36 shrink-0 object-contain drop-shadow-2xl"
                alt={ebook.titulo}
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="titulo-card mb-1.5">{ebook.titulo}</h3>
                <p className="mb-5 text-[14px] leading-snug">{ebook.subtitulo}</p>
                <p className="mb-5 font-display text-[26px] font-extrabold text-brand-purple">
                  {ebook.preco}
                </p>
                <a
                  href={whatsappLink(`Olá! Gostaria de comprar o ebook "${ebook.titulo}".`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 py-3.5 text-[14px] font-bold text-brand-purple transition-colors hover:bg-brand-purple hover:text-brand-dark"
                >
                  <Download size={16} aria-hidden="true" /> Quero este
                </a>
              </div>
            </div>
          </Revela>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-4xl text-center">
        <a
          href={whatsappLink(whatsappMessages.ebooks)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-brand-purple/30 bg-brand-purple/10 px-8 py-4 font-bold text-white transition-colors hover:bg-brand-purple/20"
        >
          Ou leve os dois por <span className="text-brand-purple">R$ 47</span> e economize R$ 10
        </a>
      </div>
    </Secao>
  );
}

/* ── Mentor ───────────────────────────────────────────────────────────────── */

function Mentor() {
  return (
    <Secao id="sobre-mentor" cor="accent" brilho brilhoEm="direita" elevada>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Revela>
          <div className="overflow-hidden rounded-[22px] border border-white/10">
            <img
              loading="lazy"
              decoding="async"
              src="/brunosena.webp"
              width={900}
              height={1206}
              className="w-full object-cover"
              alt="Bruno Sena, fundador do Instituto"
            />
          </div>
        </Revela>

        <div>
          <p className="sobretitulo mb-4 text-brand-accent">O seu mentor</p>
          <h2 className="titulo-secao">
            “O método é o protagonista. Eu sou apenas o arquiteto.”
          </h2>

          <div className="mt-7 space-y-5 leading-relaxed">
            <p>Não sou o terapeuta com 30 anos de clínica. Não sou um guru de palco lotado.</p>
            <p className="font-display text-[22px] font-bold text-white">
              Sou obcecado por método.
            </p>
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
          </div>

          <blockquote className="mt-8 rounded-r-[14px] border-l-2 border-brand-accent bg-white/[0.03] py-5 pr-6 pl-6 text-[15.5px] leading-relaxed text-white/80 italic">
            “Se você quer charlatanismo, existem milhares de gurus por aí. Se quer estrutura que
            gera resultado, você está no lugar certo.”
          </blockquote>

          <div className="faixa-accent mt-8 flex flex-col items-center gap-6 p-6 sm:flex-row">
            <div className="w-28 shrink-0">
              <CourseImage
                src={undefined}
                alt="Membro vitalício NLPEA"
                title="NLPEA"
                className="aspect-square rounded-[16px]"
              />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-white">Membro oficial NLPEA</h3>
              <p className="text-[14px] leading-relaxed">
                Reconhecimento internacional pela Neuro Linguistic Programming Excellence
                Assurance. Certificação vitalícia que atesta conhecimento teórico e capacidade
                prática e ética no ensino de PNL em nível global.
              </p>
            </div>
          </div>

          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-8"
          >
            <Instagram size={18} aria-hidden="true" />
            {site.social.instagramHandle}
          </a>
        </div>
      </div>
    </Secao>
  );
}

/* ── Onde os alunos atuam ─────────────────────────────────────────────────── */

/**
 * Substitui a faixa de "instituições parceiras", que listava quatro nomes
 * genéricos e inventados, repetidos para preencher o carrossel, sob a frase
 * "metodologia aplicada por profissionais em instituições como".
 *
 * Estas são áreas de atuação, não nomes de empresa: é o que dá para afirmar
 * com verdade. Quando houver parceria real com logo, ela entra aqui.
 */
const areas = [
  'Consultórios de psicologia',
  'Clínicas de terapia integrativa',
  'RH e desenvolvimento organizacional',
  'Coaching executivo',
  'Escolas e educação',
  'Vendas e negociação',
  'Consultórios de nutrição',
  'Prática autônoma',
];

function OndeAtuam() {
  return (
    <Secao className="overflow-hidden py-14 md:py-16">
      <p className="mb-9 text-center text-[13px] font-bold tracking-[0.2em] text-brand-quiet uppercase">
        Onde os nossos alunos aplicam o método
      </p>

      <div className="relative flex overflow-x-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-dark to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-dark to-transparent"
        />

        <ul className="animate-marquee flex shrink-0 items-center gap-4 pr-4">
          {[...areas, ...areas].map((area, i) => (
            <li
              key={`${area}-${i}`}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 whitespace-nowrap"
            >
              <Globe size={16} className="shrink-0 text-brand-accent" aria-hidden="true" />
              <span className="font-medium text-white">{area}</span>
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}

/* ── In Company ───────────────────────────────────────────────────────────── */

function InCompany() {
  return (
    <Secao id="in-company" cor="emerald" brilho brilhoEm="esquerda">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="selo mb-6 border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald">
            <Building2 size={15} aria-hidden="true" />
            In Company
          </p>

          <h2 className="titulo-secao">
            Treinamentos corporativos de{' '}
            <span className="text-brand-emerald">alto impacto</span>
          </h2>

          <p className="mt-6 leading-relaxed">
            A mesma metodologia que transforma vidas, formatada para os desafios da sua empresa.
            Aumente o engajamento, desenvolva líderes e crie uma cultura de alta performance com
            inteligência emocional.
          </p>

          <ul className="mt-9 space-y-5">
            {[
              {
                titulo: 'Liderança humanizada',
                texto: 'Ferramentas de Coaching e PNL para gestão de equipes.',
              },
              {
                titulo: 'Comunicação assertiva',
                texto: 'Resolução de conflitos e negociação avançada.',
              },
              {
                titulo: 'Inteligência emocional',
                texto: 'Controle do estresse e produtividade sob pressão.',
              },
            ].map((item) => (
              <li key={item.titulo} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald">
                  <CheckCircle2 size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-bold text-white">{item.titulo}</span>
                  <span className="block text-[14px]">{item.texto}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href={whatsappLink(whatsappMessages.inCompany)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald mt-10"
          >
            Solicitar proposta <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>

        <Revela>
          <div className="overflow-hidden rounded-[22px] border border-brand-emerald/20">
            <CourseImage
              src={undefined}
              alt="Treinamento corporativo in company"
              title="Treinamentos In Company"
              className="aspect-square"
            />
          </div>
        </Revela>
      </div>
    </Secao>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────────── */

const perguntas = [
  {
    q: 'Preciso ser da área da saúde ou ter formação prévia?',
    a: 'Não. Nossos alunos vão desde psicólogos até donos de pequenos negócios, de coaches a pessoas em transição de carreira. O método foi construído para ser acessível a qualquer pessoa com disposição para praticar.',
  },
  {
    q: 'Posso usar para atender outras pessoas profissionalmente?',
    a: 'Sim. Todos os cursos entregam certificado válido para prática profissional. Porém, verifique a legislação específica da sua região — algumas práticas podem exigir regulamentação adicional dependendo do estado.',
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
];

function PerguntasFrequentes() {
  return (
    <Secao elevada>
      <div className="mx-auto max-w-3xl">
        <Cabecalho sobretitulo="Dúvidas frequentes" titulo="Perguntas comuns" centralizado />
        <div className="mt-12">
          <Faq items={perguntas} />
        </div>
      </div>
    </Secao>
  );
}

/* ── Contato e ação final ─────────────────────────────────────────────────── */

function AcaoFinal() {
  return (
    <Secao cor="accent" brilho brilhoEm="centro" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="sobretitulo mb-5 text-brand-accent">Pronto para começar?</p>

        <h2 className="font-display text-[36px] leading-[1.06] font-extrabold tracking-[-0.035em] text-white md:text-[52px]">
          Sua transformação começa <span className="texto-gradiente">hoje.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed md:text-lg">
          Comece pelo PNL Practitioner por {courses.pnlPractitioner.price} à vista, ou 12x de{' '}
          {courses.pnlPractitioner.installment} sem juros. Sete dias de garantia — se não for
          para você, devolvemos tudo.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={courses.pnlPractitioner.checkout}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            Matricular no Practitioner <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a
            href={whatsappLink(whatsappMessages.enrollment)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto"
          >
            Falar com um consultor
          </a>
        </div>

        <p className="mt-8 text-[13.5px] text-brand-quiet">
          Acesso vitalício · Certificação NLPEA e IBSDH · Simulador SENA incluso
        </p>
      </div>
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
          content="Formações em PNL, Hipnoterapia e Coaching com prática clínica supervisionada no simulador SENA. Certificação NLPEA e IBSDH, acesso vitalício."
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
        <Prova />
        <Sena />
        <ParaQuem />
        <Cursos />
        <ComoFunciona />
        <PorQueNos />
        <Certificados />
        <PagamentoSeguro />
        <Depoimentos />
        <Ebooks />
        <Mentor />
        <OndeAtuam />
        <InCompany />
        <PerguntasFrequentes />
        <AcaoFinal />
      </main>
    </>
  );
}
