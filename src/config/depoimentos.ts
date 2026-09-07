import type { Video } from './midia';

/**
 * Os depoimentos de alunos.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  COMO A SEÇÃO SE COMPORTA                                             │
 * │                                                                       │
 * │  Assim que QUALQUER depoimento tiver `video` preenchido, a seção      │
 * │  inteira troca de formato: sai a grade de citações e entram os        │
 * │  celulares com o vídeo, no formato da referência do Instituto Mix     │
 * │  que o Bruno apontou. Só entram os que têm vídeo.                     │
 * │                                                                       │
 * │  Enquanto nenhum tiver, a seção continua mostrando as citações, como  │
 * │  hoje. Não existe estado intermediário com meia moldura de celular    │
 * │  vazia esperando arquivo.                                             │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ── Por que vídeo, e não mais citações ──────────────────────────────────
 *
 * Citação em texto é a forma de prova social mais fácil de escrever e a
 * mais fácil de duvidar: não custa nada digitar um nome e uma frase entre
 * aspas, e o visitante sabe disso. Vídeo com rosto, nome e profissão custa
 * a disposição de uma pessoa real em aparecer, e é por isso que convence.
 *
 * ── Como gravar, se for pedir a um aluno ────────────────────────────────
 *
 * Vertical, filmado no celular mesmo, de 30 a 60 segundos. Três perguntas
 * dão a estrutura toda: como você estava antes, o que mudou, e o que você
 * faz hoje com isso. Sem roteiro decorado — hesitação lida como verdade,
 * e depoimento decorado lida como anúncio.
 *
 * O `poster` é o quadro que aparece antes do play. Se não vier, o vídeo do
 * YouTube ou do Vimeo usa a miniatura dele; um arquivo próprio sem poster
 * mostra o primeiro quadro.
 */

export interface Depoimento {
  id: string;
  nome: string;
  /** Profissão ou área, como aparece embaixo do nome */
  papel: string;
  /** Iniciais, usadas na versão em texto */
  iniciais: string;
  /** A citação. Continua servindo de legenda embaixo do vídeo. */
  texto: string;
  /** Preencha para esta pessoa entrar como vídeo. Formato em `midia.ts`. */
  video?: Video;
  /** Imagem do quadro de abertura, quando o vídeo não traz uma */
  poster?: string;
}

export const depoimentos: Depoimento[] = [
  {
    id: 'ana-silva',
    nome: 'Ana Silva',
    papel: 'Psicóloga Clínica',
    iniciais: 'AS',
    texto:
      'A formação em Master PNL transformou completamente a minha abordagem clínica. Hoje consigo acessar a raiz dos problemas dos meus pacientes de forma muito mais rápida e profunda.',
  },
  {
    id: 'carlos-mendes',
    nome: 'Carlos Mendes',
    papel: 'Empresário',
    iniciais: 'CM',
    texto:
      'O curso me deu ferramentas práticas para liderar minha equipe com mais empatia e assertividade. Os resultados na empresa foram imediatos após aplicar as técnicas de ancoragem.',
  },
  {
    id: 'juliana-costa',
    nome: 'Juliana Costa',
    papel: 'Coach de Carreira',
    iniciais: 'JC',
    texto:
      'Fiz a formação em Hipnoterapia e foi um divisor de águas. A didática do Instituto Bruno Sena é excepcional, e o suporte pós-curso faz toda a diferença na nossa segurança profissional.',
  },
  {
    id: 'roberto-almeida',
    nome: 'Roberto Almeida',
    papel: 'Terapeuta Holístico',
    iniciais: 'RA',
    texto:
      'A Jornada do Herói me ajudou a ressignificar traumas que eu nem sabia que estavam me travando. É uma experiência intensa e profundamente curadora.',
  },
  {
    id: 'mariana-souza',
    nome: 'Mariana Souza',
    papel: 'Professora',
    iniciais: 'MS',
    texto:
      'Sempre tive muito medo de falar em público. Com as técnicas de PNL Practitioner, consegui superar esse bloqueio e hoje dou palestras para centenas de pessoas com tranquilidade.',
  },
  {
    id: 'fernando-dias',
    nome: 'Fernando Dias',
    papel: 'Gestor Comercial',
    iniciais: 'FD',
    texto:
      'O método A.P.L.I.C.A.R mudou o jogo para mim. Não é só teoria vazia. Consegui dobrar os resultados do meu time de vendas usando as estratégias de comunicação e rapport avançado que aprendi aqui.',
  },
];

/** Os que já têm vídeo. Vazio enquanto ninguém tiver. */
export const depoimentosComVideo = depoimentos.filter((d) => d.video);
