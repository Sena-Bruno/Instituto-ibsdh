import type { Bloco } from './artigos';
import type { IdEixo } from './eixos';

/**
 * Os materiais que o site entrega em troca de nome e e-mail.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  Os artigos são a única porta de entrada de quem ainda não decidiu    │
 * │  comprar — e não captavam ninguém. Quem lia, gostava e ia embora não  │
 * │  deixava contato: o único formulário do site era a lista de espera    │
 * │  do Master Coach, no fim de uma página de venda que essa pessoa nem   │
 * │  chegou a abrir.                                                      │
 * │                                                                       │
 * │  O que resolve isso não é mais um botão "fale conosco". É ter algo    │
 * │  que valha o e-mail: um material que a pessoa levaria mesmo que       │
 * │  nunca comprasse nada. O encanamento já existia — Firestore, /admin,  │
 * │  CSV, aviso por e-mail —, então o que faltava era o material.         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  O QUE ESTÁ AQUI SAI ASSINADO PELO INSTITUTO                       │
 * │                                                                       │
 * │  Vale a mesma regra dos artigos: material que não traz nada que só    │
 * │  este instituto pode dizer é melhor não entregar. Um guia genérico    │
 * │  não custa uma penalidade de busca (a página é `noindex`), mas custa  │
 * │  a coisa mais cara que existe aqui — a impressão da primeira pessoa   │
 * │  que confiou o e-mail dela.                                          │
 * │                                                                       │
 * │  LEIA E CORRIJA O TEXTO ANTES DE DIVULGAR. Ele foi escrito a partir   │
 * │  do que o site já afirma; o que só o Bruno sabe ainda não está lá.    │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE O MATERIAL É UMA PÁGINA, E NÃO UM PDF ENVIADO POR E-MAIL     │
 * │                                                                       │
 * │  Porque o e-mail pode não sair. O aviso de lead depende de uma chave  │
 * │  do Resend e de um domínio verificado; enquanto isso não estiver de   │
 * │  pé, um "enviamos para o seu e-mail" seria uma promessa que o site    │
 * │  não cumpre — e a primeira coisa que a pessoa aprenderia sobre o      │
 * │  instituto é que ele promete o que não entrega.                       │
 * │                                                                       │
 * │  Sendo página, o material abre na hora, no mesmo clique. Ela é        │
 * │  `noindex`, fica fora do sitemap e não é linkada em lugar nenhum:     │
 * │  chega-se a ela pelo formulário. Não é um cofre — quem tiver o        │
 * │  endereço entra —, e não precisa ser: o objetivo é que quem quer o    │
 * │  material deixe o contato, não impedir que alguém o leia.             │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export interface Material {
  /** Vira a URL (/materiais/<id>) e o campo gravado no lead. Não mude. */
  id: string;
  titulo: string;
  /** O <title> da aba. Até ~60 caracteres. */
  tituloSeo?: string;
  /** Uma linha dizendo o que a pessoa leva. Aparece na caixa de captação. */
  promessa: string;
  /** O rótulo miúdo acima do título, na caixa. Ex.: "Guia gratuito". */
  formato: string;
  /** Texto do botão que envia o formulário. */
  chamada: string;
  /** Eixo a que o material pertence; define a cor da caixa e da página. */
  eixo: IdEixo;
  corpo: Bloco[];
}

/* ────────────────────────────────────────────────────────────────────────
   OS MATERIAIS

   Reaproveitam o tipo `Bloco` dos artigos, e portanto o mesmo renderizador
   (`components/CorpoArtigo.tsx`): escrever um material não exige saber
   programar, e a marcação mínima (**negrito** e [rótulo](/rota)) funciona
   igual.
   ──────────────────────────────────────────────────────────────────────── */

export const materiais: Material[] = [
  {
    id: 'sete-perguntas',
    titulo: '7 perguntas antes de escolher uma formação',
    tituloSeo: '7 perguntas antes de escolher uma formação',
    formato: 'Guia gratuito',
    promessa:
      'O roteiro que separa uma formação séria de um certificado caro — para usar com qualquer escola, inclusive com a nossa.',
    chamada: 'Quero o guia',
    eixo: 'jornadas',
    corpo: [
      {
        tipo: 'paragrafo',
        texto:
          'PNL, hipnoterapia e coaching não são profissões regulamentadas no Brasil. Não há conselho, não há registro obrigatório e não há currículo mínimo — o que significa que qualquer pessoa pode abrir uma escola amanhã e emitir certificados na semana seguinte. Boa parte das formações no mercado é séria. Distinguir uma da outra, de fora, é difícil, porque todas usam as mesmas palavras.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Estas sete perguntas existem para resolver isso. Não são sobre gosto pessoal: cada uma tem uma resposta verificável antes de você pagar, e a recusa em responder já é a resposta.',
      },
      {
        tipo: 'destaque',
        titulo: 'Use isto com a gente também',
        texto:
          'Um guia de escolha escrito por quem quer ser escolhido só vale se servir contra quem o escreveu. Faça estas perguntas ao Instituto Bruno Sena antes de fazê-las a qualquer outro — as respostas do que fazemos hoje estão nas [ementas publicadas](/formacoes), aula por aula.',
      },

      { tipo: 'subtitulo', texto: '1. A ementa está publicada, aula por aula?' },
      {
        tipo: 'paragrafo',
        texto:
          'Não a lista de temas — a ementa. Quantos módulos, o que se faz em cada um, quantas horas, em que ordem. Uma escola que sabe o que ensina consegue escrever isso antes de você comprar.',
      },
      {
        tipo: 'paragrafo',
        texto:
          '**Sinal ruim:** a grade só aparece depois da inscrição, ou "é personalizada para cada turma". Currículo que muda conforme quem pergunta é currículo que não existe.',
      },

      { tipo: 'subtitulo', texto: '2. Quantas horas você vai praticar — e com quem?' },
      {
        tipo: 'paragrafo',
        texto:
          'Assistir a uma técnica e conduzi-la são duas habilidades diferentes, e só a segunda é a que você vai precisar no primeiro atendimento. Pergunte quantas horas do curso você passa conduzindo, quem observa e como a devolutiva chega até você.',
      },
      {
        tipo: 'lista',
        itens: [
          'Quantas horas de prática conduzida por você, e não assistida?',
          'A prática é supervisionada, ou vocês se dividem em duplas e se viram?',
          'Alguém corrige o que você fez errado — e como você fica sabendo?',
          'Existe prática antes do primeiro atendimento em pessoa de verdade?',
        ],
      },

      { tipo: 'subtitulo', texto: '3. Quem assina o certificado, e o que ele vale?' },
      {
        tipo: 'paragrafo',
        texto:
          'Certificado de instituição não regulamentada vale exatamente a reputação de quem assina — nem mais, nem menos. Isso não o torna inútil: torna verificável. Pergunte o nome da entidade certificadora, procure-a fora do site da escola e veja se ela existe independentemente dela.',
      },
      {
        tipo: 'paragrafo',
        texto:
          '**Sinal ruim:** "certificado internacional" sem dizer de qual entidade, ou uma sigla que só aparece em materiais da própria escola.',
      },

      { tipo: 'subtitulo', texto: '4. O que a formação diz que NÃO faz?' },
      {
        tipo: 'paragrafo',
        texto:
          'Esta é a pergunta que mais separa. Toda abordagem séria tem limite, e uma escola que conhece o próprio ofício sabe dizer onde ele termina: o que a técnica não trata, quando o caso precisa de médico ou psicólogo, o que não se promete a ninguém.',
      },
      {
        tipo: 'citacao',
        texto:
          'Quem não consegue nomear o próprio limite não descobriu o limite ainda — vai descobri-lo com um cliente.',
      },
      {
        tipo: 'paragrafo',
        texto:
          '**Sinal ruim:** promessa de cura, "funciona para qualquer caso", depoimento de recuperação de doença. PNL, coaching e hipnoterapia são abordagens educacionais e de desenvolvimento; não substituem tratamento médico ou psiquiátrico, e uma escola honesta escreve isso sem que você pergunte.',
      },

      { tipo: 'subtitulo', texto: '5. Existe módulo de ética, e ele é obrigatório?' },
      {
        tipo: 'paragrafo',
        texto:
          'Numa área sem conselho profissional, a ética não vem de fora: ou está no currículo, ou não está em lugar nenhum. Pergunte se há um módulo dedicado, se ele é obrigatório para certificar e o que ele cobre — consentimento, sigilo, encaminhamento, o que fazer quando o cliente relata risco.',
      },
      {
        tipo: 'paragrafo',
        texto:
          '**Sinal ruim:** "a ética permeia todo o curso". Costuma significar que ela não é aula de ninguém.',
      },

      { tipo: 'subtitulo', texto: '6. Quem dá aula, e onde essa pessoa atende?' },
      {
        tipo: 'paragrafo',
        texto:
          'Não o nome que estampa a propaganda: quem está na sala no dia a dia. E, do professor, uma coisa só — ele atende clientes hoje? Quem parou de atender ensina o que funcionava no mercado de dez anos atrás.',
      },
      {
        tipo: 'lista',
        itens: [
          'Quem conduz as aulas, e qual a formação dessa pessoa?',
          'Ela atende no consultório hoje, ou só dá aula?',
          'Dá para falar com um aluno da turma anterior? (Uma escola confiante apresenta.)',
        ],
      },

      { tipo: 'subtitulo', texto: '7. O que está escrito sobre acesso, reembolso e suporte?' },
      {
        tipo: 'paragrafo',
        texto:
          'Por escrito, antes do pagamento: por quanto tempo você acessa o material, o que acontece se a turma for adiada, qual é o prazo de arrependimento e como se pede reembolso. O Código de Defesa do Consumidor garante sete dias para compra a distância; uma escola que oferece mais está dizendo algo sobre a própria confiança no curso.',
      },
      {
        tipo: 'paragrafo',
        texto: '**Sinal ruim:** a resposta chega por áudio no WhatsApp e nunca por escrito.',
      },

      { tipo: 'subtitulo', texto: 'Como usar isto na prática' },
      {
        tipo: 'paragrafo',
        texto:
          'Mande as sete perguntas, em texto, para as duas ou três escolas que você está considerando. O que você está medindo não é só o conteúdo da resposta: é quanto tempo ela leva, se vem por escrito e se responde o que foi perguntado. Uma escola que trata mal quem ainda não pagou não vai tratar melhor quem já pagou.',
      },
      {
        tipo: 'destaque',
        titulo: 'E se a resposta for a nossa',
        texto:
          'As ementas das nossas formações estão publicadas aula por aula, com carga horária e conteúdo — [veja em formações](/formacoes). Se ficar faltando alguma das sete respostas, escreva e cobre: material que ensina a perguntar e foge da pergunta não serviria para nada.',
      },
    ],
  },
];

/** O material pedido pela URL. `undefined` se o endereço não existe. */
export function materialPorId(id?: string): Material | undefined {
  return materiais.find((m) => m.id === id);
}

/**
 * O material que a caixa de captação de um artigo oferece.
 *
 * Hoje há um material só, e ele serve os três eixos: a dúvida "qual
 * formação escolher" é a mesma para quem chegou por PNL, por hipnose ou
 * por coaching. Quando houver um material por eixo, esta função passa a
 * escolher por `eixo` — e nenhum artigo precisa mudar.
 */
export function materialParaOEixo(_eixo: IdEixo): Material | undefined {
  return materiais[0];
}
