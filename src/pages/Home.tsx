import {
  Apple,
  ArrowRight,
  Award,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Instagram,
  Leaf,
  Lock,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CardCurso from '../components/CardCurso';
import CourseImage from '../components/CourseImage';
import DepoimentoVideo from '../components/DepoimentoVideo';
import Faq from '../components/Faq';
import Numeros from '../components/Numeros';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import SenaSimulador from '../components/SenaSimulador';
import Seo from '../components/Seo';
import VideoPlayer from '../components/Video';
import { courses, economiaDe, eixosComCurso, listaCursos } from '../config/courses';
import { depoimentos } from '../config/depoimentos';
import { midia } from '../config/midia';
import { meiosPagamento } from '../config/pagamento';
import { routes, site, whatsappLink, whatsappMessages } from '../config/site';
import { paletas } from '../lib/cores';
import { duration, ease } from '../lib/motion';
import {
  fundador,
  listaDeCursos,
  organizacao,
  perguntasFrequentes,
  websiteDoInstituto,
} from '../lib/schema';
import { cn } from '../lib/utils';

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

/**
 * Os fatos da manchete.
 *
 * Foi a diferença mais concreta entre esta home e as cinco referências:
 * todas colocam quatro ou cinco fatos verificáveis logo abaixo da promessa,
 * antes de qualquer argumento. Sem eles a manchete é uma frase bonita e a
 * pessoa precisa rolar meia página para descobrir do que se trata.
 *
 * A carga horária sai da soma real das formações — se um curso mudar de
 * carga em `courses.ts`, a linha acompanha sozinha e nunca passa a mentir.
 */
function fatosDoHero() {
  const cargas = listaCursos
    .map((c) => Number.parseInt(c.carga ?? '', 10))
    .filter((n) => Number.isFinite(n));
  const faixa = cargas.length
    ? `${Math.min(...cargas)}h a ${Math.max(...cargas)}h de formação`
    : 'Formação completa';

  return [
    { icone: Clock, texto: faixa },
    { icone: Award, texto: 'Certificação NLPEA e IBSDH' },
    { icone: Brain, texto: 'Prática no simulador SENA' },
    { icone: ShieldCheck, texto: '7 dias de garantia incondicional' },
  ];
}

function Hero() {
  const fatos = fatosDoHero();

  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24">
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
        {/* ┌───────────────────────────────────────────────────────────────┐
            │  O HERO TEM TRÊS BLOCOS, E A ORDEM MUDA COM A LARGURA         │
            │                                                               │
            │  No desktop são duas colunas: o texto ocupa as duas linhas    │
            │  da esquerda e o vídeo ocupa a coluna da direita inteira,     │
            │  centralizado — exatamente o que havia antes.                 │
            │                                                               │
            │  No celular vira uma coluna só, e aí a ordem do HTML importa: │
            │  promessa, vídeo, fatos, botões. Antes o vídeo era o último   │
            │  item do hero e só aparecia a 930px do topo, depois de tudo.  │
            │  Vídeo do fundador logo abaixo da promessa é onde ele traba-  │
            │  lha; os fatos e os botões continuam logo em seguida, e o     │
            │  "Matricule-se" do cabeçalho fica fixo o tempo todo.          │
            └───────────────────────────────────────────────────────────────┘ */}
        <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out }}
            className="lg:col-start-1 lg:row-start-1"
          >
            {/* O selo "Turmas abertas" que ficava aqui subiu para a barra de
                aviso, que é onde esse tipo de recado é lido. Repetido nos dois
                lugares, ele só empurrava a manchete para baixo.

                As duas frases quebram em blocos, não no fluxo. Deixada a
                cargo do navegador, a linha partia no meio de "Você pratica"
                e a metade dourada aparecia dividida entre duas linhas — o
                destaque só funciona se a frase destacada estiver inteira. */}
            <h1 className="titulo-hero">
              <span className="block">Você não só assiste.</span>
              <span className="texto-gradiente block">Você pratica.</span>
            </h1>

            {/* ┌─────────────────────────────────────────────────────────────┐
                │  A MANCHETE MUDOU DE PROMESSA — E É REVERSÍVEL EM UMA LINHA │
                │                                                             │
                │  Era "Domine as ferramentas que reprogramam vidas". Bonita, │
                │  e não diz nada que o concorrente não possa escrever igual. │
                │  As cinco referências abrem com algo específico e conferí-  │
                │  vel; nenhuma abre com slogan.                              │
                │                                                             │
                │  Esta abre pelo que o instituto tem de próprio: aqui se     │
                │  pratica antes de atender. Serve a PNL e serve a qualquer   │
                │  curso que entrar depois, porque fala do MÉTODO e não de    │
                │  uma área — que é o que um instituto de desenvolvimento     │
                │  humano precisa quando o catálogo cresce.                   │
                │                                                             │
                │  Se preferir a anterior, é trocar o texto do <h1>.          │
                └─────────────────────────────────────────────────────────────┘ */}
            <p className="mt-7 max-w-xl text-[17.5px] leading-relaxed md:text-lg">
              PNL, Hipnoterapia e Coaching com prática supervisionada no SENA — nosso simulador
              clínico. Você treina em pacientes virtuais, com devolutiva a cada intervenção,
              antes do primeiro atendimento real.
            </p>
          </motion.div>

          {/* O espaço do vídeo de boas-vindas.
              Aqui havia três blocos de cor anunciando os eixos — muita área
              nobre para pouca informação ("2 formações"), e no celular eles
              empurravam tudo o mais para baixo da dobra.
              Enquanto não houver vídeo, o retrato ocupa o lugar. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: 0.08 }}
            className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            {midia.boasVindas ? (
              /* A capa é composta (`capa-boas-vindas.webp`), não o retrato
                 solto: o retrato é 3:4 fechado no rosto e, recortado para
                 16:9, corta o Bruno na altura dos olhos. A capa põe o rosto
                 inteiro à direita e deixa o meio escuro, que é onde cai o
                 botão de play. */
              <VideoPlayer
                video={midia.boasVindas}
                titulo="Bruno Sena — boas-vindas ao instituto"
                posterAlternativo="/capa-boas-vindas.webp"
              />
            ) : (
              <img
                src="/brunosena.webp"
                alt="Bruno Sena, fundador do Instituto"
                width={900}
                height={1206}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full rounded-[22px] object-cover"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
                }}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: 0.14 }}
            className="lg:col-start-1 lg:row-start-2"
          >
            {/* Os fatos. Vêm antes dos botões de propósito: quem chega ainda
                está decidindo se o assunto é para ele, e é aqui que descobre. */}
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {fatos.map((fato) => (
                <li key={fato.texto} className="fato">
                  <fato.icone
                    size={17}
                    aria-hidden="true"
                    className="mt-px shrink-0 text-brand-accent"
                  />
                  {fato.texto}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#cursos" className="btn-primary">
                Quero começar agora <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a href="#sena" className="btn-outline">
                Experimentar o SENA
              </a>
            </div>
          </motion.div>
        </div>

        {/* ┌───────────────────────────────────────────────────────────────┐
            │  A CONTAGEM DE CURSOS SAIU DAQUI                              │
            │                                                               │
            │  Esta faixa mostrava, ao lado de cada eixo, quantas formações │
            │  ele tem: "PNL 2 · Hipnoterapia 1 · Coaching 1 · Jornadas 1". │
            │  Era informação correta e péssima de dar: a primeira coisa    │
            │  que a pessoa lia na home era que o catálogo é pequeno.       │
            │                                                               │
            │  Os eixos continuam aqui, porque servem para navegar. O que   │
            │  saiu foi o número. Quando houver vinte cursos, ele volta a   │
            │  ser um argumento e pode voltar — hoje é um argumento contra. │
            └───────────────────────────────────────────────────────────────┘ */}
        <nav aria-label="Eixos de formação" className="mt-14">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <li className="sobretitulo">Eixos</li>
            {eixosComCurso().map((eixo) => (
              <li key={eixo.id}>
                <Link
                  to={`${routes.formacoes}#${eixo.id}`}
                  className="group flex items-center gap-2.5 text-[14.5px] text-brand-platinum transition-colors hover:text-brand-cream"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${paletas[eixo.cor].fundo}`}
                  />
                  {eixo.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
            perfil psicológico definido e devolutiva técnica a cada intervenção.
          </Cabecalho>

          <div className="mt-9 grid grid-cols-2 gap-3">
            {[
              { valor: '8', rotulo: 'Perfis clínicos' },
              { valor: '44', rotulo: 'Cenários por formação' },
              { valor: 'Texto, áudio', rotulo: 'e vídeo' },
              { valor: 'Automático', rotulo: 'Prontuário de sessão' },
            ].map((item) => (
              <div key={item.rotulo} className="cartao-vidro p-4">
                <p className="font-display text-lg font-bold text-brand-cream">{item.valor}</p>
                <p className="mt-1 text-[13px] leading-snug">{item.rotulo}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-md text-[14px] leading-relaxed text-brand-quiet">
            Nenhuma outra formação de PNL no Brasil oferece prática supervisionada antes do
            primeiro atendimento real. É o que separa formação de videoaula.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* O espaço da amostra real: uma gravação de tela de uma sessão de
              verdade. Quando ela existir, é ela que prova — e a demonstração
              logo abaixo passa a ser o convite para experimentar a mecânica.
              Enquanto não existir, o simulador segue sozinho, e nada na
              página anuncia um vídeo que não está lá. */}
          {midia.amostraSena && (
            <Revela>
              <VideoPlayer
                video={midia.amostraSena}
                titulo="Uma sessão real no SENA, do início à devolutiva"
              />
            </Revela>
          )}

          <Revela>
            {midia.amostraSena && (
              <p className="mb-4 text-[14px] text-brand-quiet">
                Ou experimente você mesmo, aqui embaixo:
              </p>
            )}
            <SenaSimulador />
          </Revela>
        </div>
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
              <h3 className="mb-4 font-display text-[26px] font-bold text-brand-cream">
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
                    <span className="text-[15px] text-brand-cream">{item}</span>
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

/**
 * Os ícones de cada curso na vitrine.
 *
 * Ficam aqui, e não em `config/courses.ts`, porque aquele arquivo é de
 * dados e não deve importar JSX. Curso sem ícone cai no card sem ícone,
 * que continua legível.
 */
const icones: Record<string, ReactNode> = {
  pnl: <Brain size={17} aria-hidden="true" />,
  hipno: <Sparkles size={17} aria-hidden="true" />,
  master: <Target size={17} aria-hidden="true" />,
  'master-coach': <Award size={17} aria-hidden="true" />,
  trilogia: <Award size={17} aria-hidden="true" />,
};

/**
 * A home mostra só os cursos marcados como destaque, não o catálogo todo.
 * Com vinte formações, uma vitrine completa aqui vira parede — o resto
 * vive em /formacoes, agrupado por eixo.
 */
const vitrine = listaCursos.filter((curso) => curso.destaque);

function Cursos() {
  const economiaDaTrilogia = economiaDe(courses.trilogia);

  return (
    <Secao id="cursos" cor="accent" brilho brilhoEm="topo">
      <Cabecalho
        sobretitulo="Nossas formações"
        titulo="Escolha sua ferramenta de transformação"
      >
        Cada eixo tem a sua cor, e ela acompanha você do card até a página do curso. Se está
        começando, comece pelo Practitioner — é a base que torna todo o resto mais fácil.
      </Cabecalho>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vitrine.map((curso, i) => (
          <Revela key={curso.route} atraso={i * 0.07} className="h-full">
            <CardCurso curso={curso} icone={icones[curso.id]} />
          </Revela>
        ))}
      </div>

      {/* O caminho para o catálogo completo. Hoje leva a cinco cursos;
          quando forem vinte, é por aqui que eles são encontrados. */}
      <div className="mt-10 text-center">
        <Link to={routes.formacoes} className="btn-outline">
          Ver todas as formações <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      {/* ┌───────────────────────────────────────────────────────────────┐
          │  A TRILOGIA ABRE PELA PARCELA, NÃO PELO TOTAL                 │
          │                                                               │
          │  Antes o bloco dizia "juntos por R$ 1.353,00" no meio de uma  │
          │  frase. Mil e trezentos lidos de uma vez é o número que faz a │
          │  pessoa fechar a aba — mesmo sendo, aqui, o mais barato dos   │
          │  caminhos. A parcela é o que ela consegue comparar com o      │
          │  próprio mês, e o total continua logo abaixo, sem esconder.   │
          │                                                               │
          │  A economia é CALCULADA a partir de `priceFrom` e `price` em  │
          │  `courses.ts`, e não escrita à mão como estava ("R$ 338").    │
          │  Preço escrito à mão em dois lugares é preço que diverge no   │
          │  dia em que um dos dois muda.                                 │
          └───────────────────────────────────────────────────────────────┘ */}
      <div className="faixa-accent mt-10 flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="min-w-0">
          <p className="sobretitulo mb-3">Pacote completo</p>
          <h3 className="font-display text-[28px] font-bold text-brand-cream md:text-[34px]">
            Trilogia IBSDH
          </h3>
          <p className="mt-3 max-w-lg leading-relaxed">
            Practitioner, Hipnoterapia e Master PNL juntos, com os três certificados.
          </p>
        </div>

        <div className="shrink-0 md:text-right">
          {courses.trilogia.priceFrom && (
            <p className="text-[13.5px] text-brand-quiet line-through">
              De {courses.trilogia.priceFrom}
            </p>
          )}
          <p className="mt-1 font-display text-[38px] leading-none font-extrabold text-brand-cream md:text-[44px]">
            12x {courses.trilogia.installment}
          </p>
          <p className="mt-2 text-[14px]">ou {courses.trilogia.price} à vista</p>
          {economiaDaTrilogia && (
            <p className="mt-2 text-[13.5px] font-bold text-brand-accent">
              Economia de {economiaDaTrilogia} sobre as três matrículas separadas
            </p>
          )}
          <Link to={courses.trilogia.route} className="btn-primary mt-6 w-full md:w-auto">
            Ver a Trilogia <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="cartao mt-6 p-7 text-center md:p-8">
        <p className="leading-relaxed">
          <strong className="text-brand-cream">Dúvida de qual escolher?</strong> Comece pelo PNL
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
              <h3 className="mb-4 font-display text-[24px] font-bold text-brand-cream">
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
    imagem: '/nlpea.webp',
    alt: 'Certificado de membro vitalício e Practitioner da NLPEA, NLP Association of Excellence',
    nome: 'Certificado NLPEA',
    // O da NLPEA é um selo em pé com fundo transparente, não uma folha
    // digitalizada. Recortado para preencher, como o outro, perderia as
    // estrelas em cima e a faixa de Practitioner embaixo — que são
    // justamente as duas partes que dizem o que ele certifica.
    ajuste: 'contain' as const,
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
    ajuste: 'cover' as const,
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
                className={cn(
                  'flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[22px] border',
                  paletas[cert.cor].borda,
                  cert.ajuste === 'contain' && 'bg-white/[0.03] p-6',
                )}
              >
                <CourseImage
                  src={cert.imagem}
                  alt={cert.alt}
                  title={cert.nome}
                  imgClassName={cert.ajuste === 'contain' ? 'object-contain' : undefined}
                />
              </div>
              <p className={`sobretitulo mt-6 mb-3 ${paletas[cert.cor].texto}`}>{cert.selo}</p>
              <h3 className="mb-4 font-display text-[24px] font-bold text-brand-cream">
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
        <h2 className="font-display text-[26px] font-bold text-brand-cream md:text-[32px]">
          Pagamento 100% seguro
        </h2>
        <p className="mt-4 leading-relaxed">
          Todos os pagamentos são processados pela{' '}
          <strong className="text-brand-cream">{site.paymentPlatform}</strong>, plataforma
          especializada em cursos online. Os dados do seu cartão são tratados no ambiente seguro
          dela — o instituto não os recebe nem armazena.
        </p>

        {/* ┌─────────────────────────────────────────────────────────────┐
            │  AS MARCAS SÃO DESENHO, NÃO IMAGEM BUSCADA FORA            │
            │                                                             │
            │  Aqui já foram 6 imagens vindas do cdn.simpleicons.org e do │
            │  Wikimedia: hotlink de terceiro que podia sumir a qualquer  │
            │  momento e somava 6 conexões externas ao carregamento.      │
            │  Viraram pílulas de texto, que resolviam o problema técnico │
            │  e não pareciam meio de pagamento nenhum.                   │
            │                                                             │
            │  Agora os contornos oficiais estão embutidos em             │
            │  `config/pagamento.ts` e herdam `currentColor`: zero        │
            │  requisição, e todas no mesmo tom. Em cores originais a     │
            │  fileira viraria um arco-íris no meio de uma página que usa │
            │  um acento só.                                              │
            │                                                             │
            │  Elo e Boleto não têm contorno publicado, então continuam   │
            │  como palavra — na mesma caixa e na mesma altura. Desenhar  │
            │  marca de terceiro à mão seria inventar a identidade visual │
            │  de outra empresa.                                          │
            └─────────────────────────────────────────────────────────────┘ */}
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {meiosPagamento.map((meio) => (
            <li
              key={meio.nome}
              className="flex h-12 min-w-[72px] items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.04] px-4 text-brand-platinum transition-colors hover:border-white/25 hover:text-brand-cream"
            >
              {meio.caminho ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label={meio.nome}
                  className={cn('h-auto', meio.larga ? 'w-12' : 'w-8')}
                >
                  <title>{meio.nome}</title>
                  <path d={meio.caminho} />
                </svg>
              ) : (
                <span className="font-display text-[15px] font-semibold tracking-[0.04em]">
                  {meio.nome}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}

/* ── Depoimentos ──────────────────────────────────────────────────────────── */

function Depoimentos() {
  return (
    <Secao id="depoimentos" cor="blue" brilho brilhoEm="esquerda" elevada>
      <Cabecalho
        sobretitulo="Prova social"
        cor="blue"
        titulo="O que acontece quando você aplica o método"
        centralizado
      >
        Alunos contando, com as próprias palavras, o que mudou depois da formação.
      </Cabecalho>

      {/* ┌───────────────────────────────────────────────────────────────┐
          │  A MOLDURA DE CELULAR APARECE SEMPRE                          │
          │                                                               │
          │  A primeira versão desta seção só trocava de formato quando   │
          │  houvesse vídeo preenchido. Como não há nenhum gravado ainda, │
          │  na prática a página continuava idêntica à de antes — o       │
          │  formato novo existia só no código.                           │
          │                                                               │
          │  Agora o celular aparece sempre. Sem vídeo, ele mostra a      │
          │  citação como um post; com vídeo, mostra o quadro de abertura │
          │  e o play. A troca é por aluno, e acontece sozinha ao         │
          │  preencher `video` em `config/depoimentos.ts`.                │
          └───────────────────────────────────────────────────────────────┘ */}
      <div className="mt-14 grid justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {depoimentos.map((dep, i) => (
          <Revela key={dep.id} atraso={(i % 3) * 0.07} className="w-full">
            <DepoimentoVideo dep={dep} />
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
          className="inline-block rounded-full border border-brand-purple/30 bg-brand-purple/10 px-8 py-4 font-bold text-brand-cream transition-colors hover:bg-brand-purple/20"
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
            <p className="font-display text-[22px] font-bold text-brand-cream">
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
              <strong className="text-brand-cream">ferramentas reproduzíveis</strong>.
            </p>
          </div>

          <blockquote className="mt-8 rounded-r-[14px] border-l-2 border-brand-accent bg-white/[0.03] py-5 pr-6 pl-6 text-[15.5px] leading-relaxed text-white/80 italic">
            “Se você quer charlatanismo, existem milhares de gurus por aí. Se quer estrutura que
            gera resultado, você está no lugar certo.”
          </blockquote>

          <div className="faixa-accent mt-8 flex flex-col items-center gap-6 p-6 sm:flex-row">
            {/* O selo da NLPEA. É um PNG com fundo transparente e formato em
                pé, então entra como <img> direto com `object-contain`, e não
                pelo CourseImage: aquele recorta para preencher, o que cortaria
                as estrelas em cima e o rótulo de Practitioner embaixo. */}
            <img
              src="/nlpea.webp"
              alt="Selo de membro vitalício e Practitioner da NLPEA, NLP Association of Excellence"
              width={460}
              height={662}
              loading="lazy"
              decoding="async"
              className="h-40 w-auto shrink-0 object-contain sm:h-44"
            />
            <div>
              <h3 className="mb-2 font-bold text-brand-cream">Membro oficial NLPEA</h3>
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
/**
 * Onde os alunos aplicam o método.
 *
 * Cada área tem o próprio ícone. Antes eram oito globos idênticos, um por
 * item: ícone repetido não informa nada, só ocupa espaço à esquerda do
 * texto. Com um desenho por área, a lista passa a ser varrida pelo olho
 * antes de ser lida.
 *
 * Esta faixa listava quatro nomes de empresa inventados ("Global Tech",
 * "Institutos Financeiros") sob a frase "metodologia aplicada em
 * instituições como". Nome de parceiro que não existe é risco de
 * credibilidade, então virou a lista das áreas — que é verdade e diz a
 * mesma coisa. Quando houver parceria real com logo, ela entra aqui.
 */
const areas = [
  { icone: Stethoscope, nome: 'Consultórios de psicologia' },
  { icone: Leaf, nome: 'Clínicas de terapia integrativa' },
  { icone: Users, nome: 'RH e desenvolvimento organizacional' },
  { icone: Target, nome: 'Coaching executivo' },
  { icone: GraduationCap, nome: 'Escolas e educação' },
  { icone: TrendingUp, nome: 'Vendas e negociação' },
  { icone: Apple, nome: 'Consultórios de nutrição' },
  { icone: Briefcase, nome: 'Prática autônoma' },
];

function OndeAtuam() {
  return (
    <Secao elevada>
      <Cabecalho
        sobretitulo="Onde o método é aplicado"
        titulo="A formação abre mais de uma porta"
        centralizado
      >
        As mesmas ferramentas atendem em consultório, conduzem equipe e fecham venda. É o que os
        alunos fazem com elas depois de formados.
      </Cabecalho>

      {/* ┌───────────────────────────────────────────────────────────────┐
          │  ERA UM CARROSSEL EM LAÇO INFINITO, E VIROU UMA GRADE PARADA  │
          │                                                               │
          │  O carrossel cortava as palavras nas duas bordas — a primeira │
          │  e a última área apareciam pela metade o tempo todo, o que    │
          │  lia como defeito e não como movimento. E texto que anda não  │
          │  se lê: para saber o que estava escrito era preciso esperar   │
          │  o item passar.                                               │
          │                                                               │
          │  Parada, a lista mostra as oito áreas de uma vez, inteiras, e │
          │  a seção passa a ter cabeçalho como todas as outras em vez de │
          │  um rótulo solto.                                             │
          └───────────────────────────────────────────────────────────────┘ */}
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((area, i) => (
          <Revela key={area.nome} atraso={(i % 4) * 0.06} className="h-full">
            <li className="flex h-full items-center gap-3.5 rounded-[16px] border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-brand-accent/20 bg-brand-accent/8 text-brand-accent">
                <area.icone size={18} aria-hidden="true" />
              </span>
              <span className="text-[14.5px] leading-snug text-brand-cream">{area.nome}</span>
            </li>
          </Revela>
        ))}
      </ul>
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
                  <span className="block font-bold text-brand-cream">{item.titulo}</span>
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
          {/* A foto chegou e substitui a reserva "imagem pendente".
              A proporção deixou de ser quadrada: a original é deitada, e
              recortada para o quadrado perdia metade da mesa — que é
              justamente o que a foto tem para mostrar, uma sala com gente
              dentro. */}
          <div className="overflow-hidden rounded-[22px] border border-brand-emerald/20">
            <CourseImage
              src="/in-company.webp"
              alt="Treinamento corporativo em andamento: uma facilitadora conduz uma equipe reunida em torno da mesa, diante de uma apresentação sobre engajamento, liderança e inteligência emocional"
              title="Treinamentos In Company"
              className="aspect-[16/11]"
              width={1120}
              height={611}
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
      {/* Este bloco escrevia o próprio título à mão, com outro tamanho, outro
          peso e espacejamento negativo — e por isso a última chamada da
          página, que é a mais importante, era a que menos parecia um título.
          Agora usa a mesma escala das outras dezesseis. */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 flex items-center justify-center gap-3.5">
          <span aria-hidden="true" className="regua-secao bg-brand-accent" />
          <p className="sobretitulo">Pronto para começar?</p>
        </div>

        <h2 className="titulo-secao">
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
      <Seo
        rota="/"
        titulo="Instituto Bruno Sena | Formações em PNL, Hipnoterapia e Coaching"
        descricao="Formações em PNL, Hipnoterapia e Coaching com prática clínica supervisionada no simulador SENA. Certificação NLPEA e IBSDH, acesso vitalício."
        imagemAlt="Instituto Bruno Sena — formações em PNL, Hipnoterapia e Coaching"
        dados={[
          organizacao(),
          fundador(),
          websiteDoInstituto(),
          listaDeCursos(listaCursos),
          perguntasFrequentes(perguntas),
        ]}
      />

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
