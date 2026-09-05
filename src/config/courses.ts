/**
 * O catálogo de formações.
 *
 * Fonte única de verdade para preço, checkout, eixo e situação de cada
 * curso. Antes desta configuração os preços estavam espalhados pelo JSX e
 * já se contradiziam: a página do Master PNL anunciava R$ 997 no topo e
 * R$ 397 no checkout (bloco copiado da Hipnoterapia). Os links de checkout
 * apareciam três vezes cada, e o do Practitioner ainda apontava para uma
 * URL de exemplo que nunca foi trocada pelo link real.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESCRITO PARA CRESCER                                                 │
 * │                                                                       │
 * │  O instituto é de desenvolvimento humano: o catálogo não para em PNL, │
 * │  hipnoterapia e coaching. Por isso cada curso declara `eixo`, `ordem` │
 * │  e `situacao`, e TODAS as superfícies que listam cursos derivam daqui:│
 * │  o catálogo em /formacoes, o menu do cabeçalho, o rodapé, a vitrine   │
 * │  da home e a página 404.                                              │
 * │                                                                       │
 * │  PARA ADICIONAR UM CURSO: acrescente uma entrada aqui com o eixo dele │
 * │  e a rota. Ele aparece sozinho em todas essas superfícies. Só a       │
 * │  página do curso em si precisa ser criada à mão — e só porque o texto │
 * │  de venda de cada formação é diferente.                               │
 * │                                                                       │
 * │  A home mostra os cursos com `destaque: true`, não todos: com vinte   │
 * │  cursos, uma vitrine completa na home vira parede. O resto vive no    │
 * │  catálogo, agrupado por eixo.                                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Sobre os dois valores de parcela: `installment` é o 12x sem juros
 * (preço à vista dividido por 12), exibido nas páginas de curso.
 * `installmentWithFees` é o 12x com juros do cartão. Os dois estão
 * corretos — descrevem condições diferentes — por isso ambos ficam aqui.
 */

import type { NomeCor } from '../lib/cores';
import { type Eixo, eixos, type IdEixo } from './eixos';

/**
 * Em que ponto do ciclo de vida o curso está.
 *
 * Existe para que a interface sempre diga em que pé as coisas estão, em vez
 * de deixar o visitante descobrir clicando: um curso `emBreve` mostra lista
 * de espera, um `encerrado` sai da vitrine mas mantém a página no ar para
 * quem já comprou e para o histórico de busca.
 */
type SituacaoCurso = 'aberto' | 'emBreve' | 'encerrado';

export interface Course {
  id: string;
  /** courseId usado nas avaliações do Firestore e na lista de espera */
  slug: string;
  title: string;
  route: string;
  /** A que eixo de formação pertence — define a cor da página inteira */
  eixo: IdEixo;
  /** Ordem dentro do eixo. Também é a ordem de pré-requisito, quando há. */
  ordem: number;
  situacao: SituacaoCurso;
  /** Uma linha, usada no card e no catálogo */
  resumo: string;
  /** Aparece na vitrine da home. Sem isto, o curso vive só no catálogo. */
  destaque?: boolean;
  /** Selo curto no card: "Mais popular", "Requer o nível 01"… */
  selo?: string;
  /** Preço à vista */
  price: string;
  /** Preço "de" riscado, quando há oferta */
  priceFrom?: string;
  /** 12x sem juros — usado nas páginas de curso */
  installment?: string;
  /** 12x com juros do cartão */
  installmentWithFees?: string;
  /** URL de checkout da plataforma de pagamento */
  checkout?: string;
}

export const courses = {
  pnlPractitioner: {
    eixo: 'pnl',
    ordem: 1,
    situacao: 'aberto',
    destaque: true,
    selo: 'Mais popular',
    resumo:
      'A base que torna todo o resto mais fácil. Comunicação inconsciente, ancoragem emocional e reformulação de crenças.',
    id: 'pnl',
    slug: 'pnl-practitioner',
    title: 'PNL Practitioner',
    route: '/pnl-practitioner',
    price: 'R$ 297,00',
    priceFrom: 'R$ 997,00',
    installment: 'R$ 24,75',
    installmentWithFees: 'R$ 29,82',
    checkout: 'https://pay.kiwify.com.br/DkL4e3J',
  },
  masterPnl: {
    eixo: 'pnl',
    ordem: 2,
    situacao: 'aberto',
    destaque: true,
    selo: 'Avançado',
    resumo:
      'Modelagem, metaprogramas, Sleight of Mouth e Modelo Milton. Para quem quer ser referência, não só competente.',
    id: 'master',
    slug: 'master-pnl',
    title: 'Master PNL',
    route: '/master-pnl',
    price: 'R$ 997,00',
    priceFrom: 'R$ 1.997,00',
    installment: 'R$ 87,50',
    installmentWithFees: 'R$ 100,10',
    checkout: 'https://pay.kiwify.com.br/T8wW0tA',
  },
  hipnoterapia: {
    eixo: 'hipnoterapia',
    ordem: 1,
    situacao: 'aberto',
    destaque: true,
    selo: 'Requer o Practitioner',
    resumo:
      'Induções, profundização de transe, protocolos terapêuticos e regressão — com quatro módulos de ética e limites.',
    id: 'hipno',
    slug: 'hipnoterapia',
    title: 'Hipnoterapia Clínica',
    route: '/hipnoterapia',
    price: 'R$ 397,00',
    priceFrom: 'R$ 1.497,00',
    installment: 'R$ 32,50',
    installmentWithFees: 'R$ 39,86',
    checkout: 'https://pay.kiwify.com.br/A5i1o7D',
  },
  masterCoach: {
    eixo: 'coaching',
    ordem: 1,
    situacao: 'emBreve',
    destaque: true,
    selo: 'Lançamento em breve',
    resumo: 'Coaching executivo, abordagem sistêmica e estruturação de negócio de alto valor.',
    id: 'master-coach',
    slug: 'master-coach',
    title: 'Master Coach',
    route: '/master-coach',
    price: 'Em breve',
  },
  trilogia: {
    eixo: 'jornadas',
    ordem: 1,
    situacao: 'aberto',
    selo: 'Pacote completo',
    resumo:
      'Practitioner, Hipnoterapia e Master PNL juntos, por menos do que a soma das três matrículas.',
    id: 'trilogia',
    slug: 'jornada',
    title: 'Jornada do Herói',
    route: '/jornada',
    price: 'R$ 1.353,00',
    priceFrom: 'R$ 1.691,00',
    installment: 'R$ 112,75',
    checkout: 'https://pay.kiwify.com.br/9y9r0kY',
  },
} satisfies Record<string, Course>;

/** Todos os cursos, na ordem em que devem aparecer no catálogo. */
export const listaCursos: Course[] = Object.values(courses).sort(
  (a, b) => eixos[a.eixo].ordem - eixos[b.eixo].ordem || a.ordem - b.ordem,
);

/** Os cursos de um eixo, em ordem. */
export function cursosDoEixo(idEixo: string): Course[] {
  return listaCursos.filter((curso) => curso.eixo === idEixo);
}

/** Os eixos que hoje têm ao menos um curso — o que o catálogo exibe. */
export function eixosComCurso(): Eixo[] {
  return Object.values(eixos)
    .filter((eixo) => cursosDoEixo(eixo.id).length > 0)
    .sort((a, b) => a.ordem - b.ordem);
}

/** A cor de um curso vem do eixo dele, nunca dele próprio. */
export function corDoCurso(curso: Course): NomeCor {
  return eixos[curso.eixo].cor;
}

/**
 * Os pacotes com dois cursos, oferecidos na página da Jornada.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  OS DOIS COMBOS NÃO TÊM CHECKOUT PRÓPRIO — PARA O BRUNO CRIAR      │
 * │                                                                       │
 * │  A página anunciava "Combo B (P+H) — R$ 597" e mandava para o link    │
 * │  A5i1o7D, que é o checkout da Hipnoterapia sozinha, a R$ 397. E       │
 * │  anunciava "Combo A (P+M) — R$ 1.097" mandando para T8wW0tA, o        │
 * │  checkout do Master sozinho, a R$ 997.                                │
 * │                                                                       │
 * │  Ou seja: o visitante lia o preço do pacote, clicava, e caía numa     │
 * │  página de pagamento de outro produto por outro valor. Quem                │
 * │  completasse a compra pagaria por um curso só, achando que levava     │
 * │  dois — e cobrar a diferença depois é briga garantida.                │
 * │                                                                       │
 * │  Enquanto os dois produtos não existirem na Kiwify, o botão dos       │
 * │  combos leva ao WhatsApp da coordenação em vez de a um checkout       │
 * │  errado. Assim a oferta continua de pé e ninguém paga o valor         │
 * │  trocado. Quando você criar os links, basta preencher o `checkout`    │
 * │  aqui embaixo: a página passa a vender sozinha de novo.               │
 * │                                                                       │
 * │  (Practitioner e Trilogia estão corretos e seguem vendendo direto.)   │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const combos = {
  terapiaBreve: {
    id: 'combo-ph',
    title: 'Combo Terapia Breve',
    composicao: 'Practitioner + Hipnoterapia',
    price: 'R$ 597,00',
    priceFrom: 'R$ 694,00',
    economia: 'R$ 97,00',
    installment: 'R$ 49,75',
    /** Sem checkout próprio: ver o aviso acima. */
    checkout: undefined as string | undefined,
  },
  pnlCompleto: {
    id: 'combo-pm',
    title: 'Combo PNL Completo',
    composicao: 'Practitioner + Master PNL',
    price: 'R$ 1.097,00',
    priceFrom: 'R$ 1.294,00',
    economia: 'R$ 197,00',
    installment: 'R$ 91,42',
    checkout: undefined as string | undefined,
  },
} as const;
