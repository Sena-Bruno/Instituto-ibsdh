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

  /**
   * Plataforma que processa os pagamentos, citada no texto de compra
   * segura, na Política de Privacidade e nos Termos de Uso.
   *
   * Hoje é a Kiwify — é para lá que apontam todos os links de checkout em
   * `courses.ts`. Há intenção de migrar para a Hotmart. Quando isso
   * acontecer, troque este nome E os `checkout` de cada curso: o nome
   * citado no texto e o destino dos botões precisam contar a mesma
   * história, senão quem compra lê uma plataforma e cai em outra.
   */
  paymentPlatform: 'Kiwify',

  legalDisclaimer:
    'A Programação Neurolinguística (PNL), o Coaching e a Hipnoterapia são abordagens educacionais e de desenvolvimento pessoal. Não substituem tratamento médico ou psiquiátrico.',
} as const;

/**
 * A barra de aviso no topo de todas as páginas.
 *
 * Os cinco sites que serviram de referência têm uma, e é o primeiro pixel
 * que a pessoa lê. Ela existe para dizer o que muda AGORA — turma abrindo,
 * condição por tempo limitado, um evento — e não para repetir o que a página
 * já diz.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  COMO DESLIGAR                                                        │
 * │                                                                       │
 * │  Ponha `ativa: false`. A barra some e o cabeçalho volta a encostar no │
 * │  topo, sem sobra nenhuma.                                             │
 * │                                                                       │
 * │  Duas regras para ela continuar funcionando:                          │
 * │                                                                       │
 * │  1. Se estiver sempre ligada com o mesmo texto, ela vira moldura e    │
 * │     ninguém mais lê. Troque quando o que ela anuncia mudar.           │
 * │  2. Nada de urgência que não seja verdade. "Últimas vagas" numa       │
 * │     turma que nunca lota é o tipo de coisa que o comprador percebe    │
 * │     na segunda visita, e aí ele desconta a credibilidade do resto.    │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const aviso = {
  ativa: true,
  texto: 'Turmas abertas nas três formações',
  /** O trecho depois do separador, mais leve. Opcional. */
  complemento: '7 dias de garantia incondicional',
  /** Para onde a barra leva. Deixe `undefined` para uma barra que não é link. */
  href: '#cursos',
  chamada: 'Ver formações',
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

/**
 * Monta um `mailto:` com assunto preenchido.
 *
 * Existe pela mesma razão que `whatsappLink`: o assunto precisa ser
 * percent-encoded, e escrever isso à mão dentro do JSX é exatamente onde o
 * acento vira `%E7` errado e o assunto chega quebrado.
 */
export function mailtoLink(email: string, subject?: string): string {
  const base = `mailto:${email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Assuntos dos contatos por e-mail, para o pedido já chegar identificado. */
export const emailSubjects = {
  inCompany: 'Proposta para treinamento In Company',
} as const;

/** Mensagens usadas nos CTAs do site. */
export const whatsappMessages = {
  general: 'Olá! Gostaria de saber mais sobre as formações do Instituto Bruno Sena.',
  enrollment:
    'Olá! Gostaria de saber mais sobre as formações e como posso garantir minha vaga.',
  inCompany: 'Olá! Gostaria de saber mais sobre os Treinamentos Corporativos (In Company).',
  /**
   * Os ebooks não têm link de checkout: os três botões daquela seção eram
   * <button> sem destino nenhum. Enquanto os produtos não existirem na
   * plataforma de pagamento, o pedido chega pela coordenação — melhor do
   * que um botão que não faz nada.
   */
  ebooks: 'Olá! Gostaria de comprar os ebooks do Instituto Bruno Sena.',
} as const;

/** Rotas internas, para evitar strings soltas nos links de navegação. */
export const routes = {
  home: '/',
  /** O catálogo completo. Toda superfície que lista cursos aponta para cá. */
  formacoes: '/formacoes',
  /** A lista de artigos. Cada artigo mora em `/artigos/<slug>`. */
  artigos: '/artigos',
  /**
   * Os materiais entregues em troca de contato. Cada um mora em
   * `/materiais/<id>`; não existe índice em `/materiais`, e é de
   * propósito: a página é `noindex`, fica fora do sitemap e se chega a
   * ela pelo formulário do artigo. Ver `config/materiais.ts`.
   */
  materiais: '/materiais',
  pnlPractitioner: '/pnl-practitioner',
  masterPnl: '/master-pnl',
  hipnoterapia: '/hipnoterapia',
  jornada: '/jornada',
  masterCoach: '/master-coach',
  sobre: '/sobre',
  contato: '/contato',
  privacidade: '/privacidade',
  termos: '/termos',
  admin: '/admin',
} as const;
