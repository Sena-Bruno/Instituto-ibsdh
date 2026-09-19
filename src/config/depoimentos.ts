import type { Video } from './midia';

/**
 * Os depoimentos de alunos.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  PRINT REAL, NÃO CITAÇÃO DIGITADA                                     │
 * │                                                                       │
 * │  Estes cinco vieram de conversas reais no WhatsApp e no Instagram —   │
 * │  o Bruno recortou e mandou. É por isso que cada um traz `print`: a    │
 * │  captura de tela entra como veio, sem editar o texto dentro dela, e o │
 * │  cartão mostra a imagem como prova, não como citação reescrita.       │
 * │                                                                       │
 * │  `texto` aqui NÃO aparece na tela: ele é a transcrição da mensagem,   │
 * │  usada como `alt` da imagem. Sem isso, quem usa leitor de tela não    │
 * │  recebe nada — o depoimento inteiro é texto dentro de um bitmap.      │
 * │                                                                       │
 * │  `curso` é o selo mostrado sobre o print. Nome e profissão do aluno   │
 * │  não aparecem: a conversa não trouxe isso, e não é para inventar.     │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ── Para adicionar um novo print ─────────────────────────────────────────
 *
 * Salve a captura em `public/`, em WebP, recortada para fora a barra de
 * status, a caixa de mensagem e o teclado — só a conversa importa. Depois
 * é só um item novo aqui embaixo, com `width`/`height` do arquivo salvo
 * (evita o layout pulando enquanto a imagem carrega).
 *
 * ── Se um aluno topar gravar vídeo ──────────────────────────────────────
 *
 * O campo `video` continua existindo para isso — vale mais que qualquer
 * quantidade de prints, porque rosto, nome e voz não dá para fingir. Ao
 * preencher `video` num item, ele troca o print pelo quadro de abertura e
 * o botão de play; nesse caso `nome`, `papel` e `iniciais` passam a valer
 * (é o rodapé do vídeo), e devem vir preenchidos com autorização do aluno.
 */

export interface Depoimento {
  id: string;
  /** A formação ou produto a que a conversa se refere. Vira o selo do cartão. */
  curso: string;
  /** Transcrição da mensagem — não aparece na tela, é o `alt` do print. */
  texto: string;
  /** A captura de tela em si, salva em `public/`. */
  print?: { src: string; width: number; height: number };
  /** Nome do aluno, só usado (e só exigido) quando há `video` preenchido. */
  nome?: string;
  /** Profissão ou área, mostrada embaixo do nome no rodapé do vídeo. */
  papel?: string;
  /** Iniciais do monograma, atrás do vídeo. */
  iniciais?: string;
  /** Preencha para este aluno entrar como vídeo em vez de print. */
  video?: Video;
  /** Imagem do quadro de abertura do vídeo, quando ele não traz uma. */
  poster?: string;
}

export const depoimentos: Depoimento[] = [
  {
    id: 'print-coaching',
    curso: 'Coaching',
    texto:
      'Mano, esse curso de coaching foi life-changing pra mim 🤯 A forma como vc estrutura os módulos faz a gente assimilar de verdade. Tô cobrando já pelas sessões. Valeu mesmo! 💪',
    print: { src: '/depoimento-coaching.webp', width: 700, height: 791 },
  },
  {
    id: 'print-hipnoterapia',
    curso: 'Hipnoterapia',
    texto:
      'Bruno, finalizei o curso ontem e só tenho a agradecer! Conteúdo muito bom, pratico. Pra quem tava com receio de aprender hipnose, vc desmistificou tudo. Já to ansioso pra começar com os primeiros clientes 😊',
    print: { src: '/depoimento-hipnoterapia.webp', width: 700, height: 512 },
  },
  {
    id: 'print-pnl',
    curso: 'PNL',
    texto:
      'Bruno, a apostila é sensacional! Muito bem organizada, letra clara, exemplos práticos. Pra quem tá começando é perfeito. Recomendo demais pra qualquer um que quer aprender PNL de verdade 📚✨',
    print: { src: '/depoimento-pnl.webp', width: 700, height: 512 },
  },
  {
    id: 'print-sena',
    curso: 'Simulador SENA',
    texto:
      'Adorei a plataforma! Muito intuitiva, os casos clínicos são bem realistas. Ajudou bastante na minha prática. Só uma sugestão: poderia ter mais exemplos de atendimento com fobia? Mas no geral 10/10 🎯',
    print: { src: '/depoimento-sena.webp', width: 700, height: 752 },
  },
  {
    id: 'print-geral',
    curso: 'Feedback de aluno',
    texto:
      'Oi! Fiz o curso mês passado e tô amando aplicar tudo que aprendi. Mas acho que faltou um pouco mais de exemplos de como usar em grupos né? Mesmo assim, tá de parabéns! Muito bom mesmo 👏',
    print: { src: '/depoimento-geral.webp', width: 700, height: 509 },
  },
];
