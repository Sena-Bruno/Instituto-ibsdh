import type { NomeCor } from '../lib/cores';

/**
 * Os eixos de formação do instituto.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  O IBSDH é um instituto de desenvolvimento humano, não uma escola de  │
 * │  PNL: o catálogo vai crescer para muito além de PNL, hipnoterapia e   │
 * │  coaching. A primeira versão deste site dava uma cor a cada CURSO —   │
 * │  o que funciona com quatro e quebra com vinte:                        │
 * │                                                                       │
 * │   · acabam as cores distinguíveis entre si;                           │
 * │   · a cor deixa de ser uma pista de reconhecimento e vira uma tabela  │
 * │     que o visitante teria de decorar — o oposto do que uma dica       │
 * │     visual deve fazer.                                                │
 * │                                                                       │
 * │  Aqui a cor pertence ao EIXO, e o curso herda a do seu eixo. O número │
 * │  de eixos é pequeno e cresce devagar; o de cursos, não. Dois cursos   │
 * │  da mesma cor passam a dizer "somos da mesma família", que é          │
 * │  informação útil, e não uma colisão a resolver.                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * PARA ADICIONAR UM EIXO NOVO: acrescente uma entrada aqui, escolha uma
 * cor da paleta em `lib/cores.ts` e pronto — catálogo, cabeçalho, rodapé e
 * home passam a exibi-lo sozinhos. Se a paleta acabar, prefira agrupar
 * cursos em menos eixos a inventar uma sétima cor: acima de seis campos de
 * cor o olho já não distingue com confiança.
 */

export interface Eixo {
  id: string;
  /** Nome curto, usado em menu e rótulo */
  nome: string;
  /** Uma linha explicando o que o eixo cobre. Aparece no catálogo. */
  descricao: string;
  cor: NomeCor;
  /** Ordem de exibição no catálogo e no menu */
  ordem: number;
}

export const eixos = {
  pnl: {
    id: 'pnl',
    nome: 'PNL',
    descricao:
      'Programação Neurolinguística: como a linguagem estrutura o pensamento, e como reprogramar padrões.',
    cor: 'blue',
    ordem: 1,
  },
  hipnoterapia: {
    id: 'hipnoterapia',
    nome: 'Hipnoterapia',
    descricao: 'Acesso ao inconsciente com método, protocolo e limite ético definido.',
    cor: 'purple',
    ordem: 2,
  },
  coaching: {
    id: 'coaching',
    nome: 'Coaching e liderança',
    descricao:
      'Condução de processos de desenvolvimento, no consultório e dentro das organizações.',
    cor: 'emerald',
    ordem: 3,
  },
  jornadas: {
    id: 'jornadas',
    nome: 'Jornadas e pacotes',
    descricao: 'Combinações de formações, com preço menor do que a soma das partes.',
    cor: 'accent',
    ordem: 4,
  },
} satisfies Record<string, Eixo>;

export type IdEixo = keyof typeof eixos;
