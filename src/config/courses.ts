/**
 * Fonte única de verdade para preços e links de checkout.
 *
 * Antes desta configuração os preços estavam espalhados pelo JSX e já se
 * contradiziam: a página do Master PNL anunciava R$ 997 no topo e R$ 397 no
 * checkout (bloco copiado da Hipnoterapia). Os links da Kiwify apareciam
 * três vezes cada, e o do Practitioner ainda apontava para uma URL de
 * exemplo que nunca foi trocada pelo link real.
 *
 * Sobre os dois valores de parcela: `installment` é o 12x sem juros
 * (preço à vista dividido por 12), exibido nas páginas de curso.
 * `installmentWithFees` é o 12x com juros do cartão, exibido nos cards da
 * home. Os dois estão corretos — descrevem condições de pagamento
 * diferentes — por isso ambos ficam registrados aqui.
 */

export interface Course {
  id: string;
  /** courseId usado nas avaliações do Firestore e na lista de espera */
  slug: string;
  title: string;
  route: string;
  /** Preço à vista */
  price: string;
  /** Preço "de" riscado, quando há oferta */
  priceFrom?: string;
  /** 12x sem juros — usado nas páginas de curso */
  installment?: string;
  /** 12x com juros do cartão — usado nos cards da home */
  installmentWithFees?: string;
  /** URL de checkout da Kiwify */
  checkout?: string;
  /** Curso ainda não lançado: capta lista de espera em vez de vender */
  comingSoon?: boolean;
}

export const courses = {
  pnlPractitioner: {
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
    id: 'master-coach',
    slug: 'master-coach',
    title: 'Master Coach',
    route: '/master-coach',
    price: 'Em breve',
    comingSoon: true,
  },
  trilogia: {
    id: 'trilogia',
    slug: 'jornada',
    title: 'Jornada do Herói',
    route: '/jornada',
    price: 'R$ 1.353,00',
    checkout: 'https://pay.kiwify.com.br/9y9r0kY',
  },
} satisfies Record<string, Course>;

export type CourseKey = keyof typeof courses;
