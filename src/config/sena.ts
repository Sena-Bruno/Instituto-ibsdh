/**
 * Conteúdo clínico da demonstração do SENA na home.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  RASCUNHO — PENDENTE DE REVISÃO TÉCNICA DO BRUNO                   │
 * │                                                                       │
 * │  As três respostas e, principalmente, as três devolutivas abaixo      │
 * │  foram redigidas como proposta de estrutura, não como material        │
 * │  didático aprovado. É a única parte do site que afirma um julgamento  │
 * │  clínico ("isto rompe o rapport", "isto está fora de hora") — e ela   │
 * │  sai assinada pelo instituto.                                        │
 * │                                                                       │
 * │  Revise antes de divulgar. O texto vive aqui, separado da marcação,   │
 * │  exatamente para que a revisão seja editar prosa e não mexer em JSX.  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Por que a demonstração existe: a home mostrava esta mesma cena como
 * imagem congelada, com um selo de "Rapport Estabelecido" que não respondia
 * a nada. O simulador é o único argumento do site que a concorrência não
 * consegue copiar, e estava sendo *afirmado* numa captura de tela em vez de
 * demonstrado. Aqui o visitante escolhe uma intervenção e recebe a
 * devolutiva — a mesma mecânica que o aluno usa na formação.
 */

/** Como o SENA classifica a intervenção. Governa a cor do veredito. */
export type Veredito = 'estabelecido' | 'perdido' | 'ruptura';

export interface RespostaSena {
  id: string;
  /** A intervenção que o visitante escolhe, na primeira pessoa. */
  texto: string;
  /** Como o paciente reage a ela. */
  reacao: string;
  veredito: Veredito;
  /** O rótulo do veredito, como aparece na tela. */
  vereditoRotulo: string;
  /** A devolutiva: por que funcionou ou não, em termos técnicos. */
  analise: string;
}

export const sena = {
  /** O perfil do paciente virtual desta demonstração. */
  perfil: 'Cético',

  /** A fala de abertura do paciente. */
  falaInicial:
    'Sinceramente, não sei se isso vai funcionar. Já tentei de tudo e essas técnicas parecem muito teóricas.',

  respostas: [
    {
      id: 'autoridade',
      texto:
        'A PNL tem comprovação em diversos estudos e é usada por profissionais no mundo todo.',
      reacao: 'Então é mais uma coisa em que eu deveria simplesmente acreditar.',
      veredito: 'perdido',
      vereditoRotulo: 'Rapport perdido',
      analise:
        'Você defendeu o método em vez de acolher a objeção. Com perfil cético, argumento de autoridade aumenta a resistência: ele não questionou a literatura, questionou a própria capacidade de mudar.',
    },
    {
      id: 'pacing',
      texto:
        'Entendo o ceticismo. Faz sentido, depois de tentar tanta coisa. Que tal testarmos algo pequeno agora, e você julga pelo resultado?',
      reacao: 'Tudo bem... o que seria?',
      veredito: 'estabelecido',
      vereditoRotulo: 'Rapport estabelecido',
      analise:
        'Você fez pacing da experiência dele antes de propor qualquer coisa, e transferiu o critério de julgamento para ele. Devolver o controle é exatamente o que o perfil cético precisa para baixar a guarda.',
    },
    {
      id: 'confronto',
      texto:
        'Se você já tentou de tudo e nada funcionou, talvez o problema não esteja na técnica.',
      reacao: 'Ou seja, a culpa é minha.',
      veredito: 'ruptura',
      vereditoRotulo: 'Ruptura',
      analise:
        'Confronto sem aliança prévia é lido como julgamento. A intervenção não está errada em si — está fora de hora. Ela funciona depois do rapport estabelecido, nunca na abertura.',
    },
  ] satisfies RespostaSena[],

  /** Números da plataforma, exibidos ao lado da demonstração. */
  numeros: [
    { rotulo: 'Perfis clínicos', valor: '8' },
    { rotulo: 'Devolutiva', valor: 'por intervenção' },
    { rotulo: 'Prontuário', valor: 'automático' },
  ],

  /** Quantos cenários o aluno encontra na formação completa. */
  totalCenarios: 44,
} as const;
