/**
 * Fonte única de verdade para os dados de contato e identidade do instituto.
 *
 * Antes desta configuração, o número de WhatsApp aparecia 11 vezes no código,
 * o Instagram 7 vezes (com dois perfis diferentes) e cada e-mail 6 vezes.
 * Trocar um contato exigia caçar ocorrências em 7 arquivos.
 */

export const site = {
  name: 'Instituto Bruno Sena',
  shortName: 'IBSDH',
  legalName: 'Instituto Bruno Sena de Desenvolvimento Humano',
  url: 'https://institutobrunosena.com.br',
  description:
    'Formações em PNL, Hipnoterapia e Coaching. Transforme sua vida e a de outras pessoas com métodos comprovados.',

  whatsapp: {
    /** Formato E.164 sem símbolos, exigido pela API do wa.me */
    number: '5511987355750',
    display: '+55 (11) 98735-5750',
  },

  email: {
    contact: 'contato@institutobrunosena.com.br',
    partnerships: 'parcerias@institutobrunosena.com.br',
  },

  social: {
    instagram: 'https://www.instagram.com/brunosenaoficial/',
    instagramHandle: '@brunosenaoficial',
  },

  legalDisclaimer:
    'A Programação Neurolinguística (PNL), o Coaching e a Hipnoterapia são abordagens educacionais e de desenvolvimento pessoal. Não substituem tratamento médico ou psiquiátrico.',
} as const;

/**
 * Monta um link do WhatsApp com mensagem pré-preenchida.
 * Centraliza a codificação para que nenhuma mensagem volte a ser
 * escrita já percent-encoded na mão dentro do JSX.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Mensagens usadas nos CTAs do site. */
export const whatsappMessages = {
  general: 'Olá! Gostaria de saber mais sobre as formações do Instituto Bruno Sena.',
  enrollment:
    'Olá! Gostaria de saber mais sobre as formações e como posso garantir minha vaga.',
  inCompany:
    'Olá! Gostaria de saber mais sobre os Treinamentos Corporativos (In Company).',
} as const;

/** Rotas internas, para evitar strings soltas nos links de navegação. */
export const routes = {
  home: '/',
  pnlPractitioner: '/pnl-practitioner',
  masterPnl: '/master-pnl',
  hipnoterapia: '/hipnoterapia',
  jornada: '/jornada',
  masterCoach: '/master-coach',
  privacidade: '/privacidade',
  termos: '/termos',
} as const;
