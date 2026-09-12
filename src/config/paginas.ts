import type { ComponentType } from 'react';
import { artigos, artigosPublicados } from './artigos';
import { materiais } from './materiais';
import { routes } from './site';

/**
 * A tabela de rotas do site — fonte única para três consumidores.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  Antes, a lista de rotas estava escrita três vezes: no <Routes> do    │
 * │  App, à mão no `public/sitemap.xml` e de novo no smoke test. As três  │
 * │  divergiam — o sitemap ainda anunciava datas de `lastmod` fixas que   │
 * │  ninguém atualizava desde a criação do arquivo.                       │
 * │                                                                       │
 * │  Agora quem lê esta tabela é:                                         │
 * │                                                                       │
 * │   1. `Rotas.tsx`, que monta o <Routes> do React Router;               │
 * │   2. `scripts/prerender.mjs`, que gera um arquivo HTML por rota;      │
 * │   3. `scripts/sitemap.mjs`, que gera o sitemap.xml do build.          │
 * │                                                                       │
 * │  PARA ADICIONAR UMA PÁGINA: acrescente uma entrada aqui. Ela ganha    │
 * │  rota, HTML estático e linha no sitemap de uma vez só. Esquecer o     │
 * │  sitemap deixou de ser possível.                                      │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export interface Pagina {
  /** O caminho, exatamente como o React Router o entende. */
  rota: string;
  /**
   * O import dinâmico do componente da página.
   *
   * Nunca é chamado no servidor para páginas com `publica: false` — é o
   * que mantém o SDK do Firebase (importado por `/admin`) fora do
   * processo de pré-renderização, que roda em Node.
   */
  carregar: () => Promise<{ default: ComponentType }>;
  /**
   * Se a página deve ser rastreada e indexada.
   *
   * `false` significa duas coisas ao mesmo tempo: fica fora do sitemap e
   * não recebe HTML pré-renderizado próprio — continua existindo como
   * rota do navegador, servida pelo fallback do SPA.
   */
  publica: boolean;
  /** Sinal fraco de agendamento de rastreio. Só entra se a página é pública. */
  frequencia?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  /** Prioridade relativa dentro do próprio domínio, de 0 a 1. */
  prioridade?: number;
  /**
   * Imagem principal da página, anunciada na extensão de imagens do
   * sitemap. Caminho absoluto a partir da raiz do site.
   */
  imagem?: string;
  /**
   * O arquivo-fonte da página, a partir da raiz do repositório.
   *
   * Serve a um único propósito: o `lastmod` do sitemap é a data do
   * último commit que tocou este arquivo. É o que faz o sinal dizer a
   * verdade — antes, as nove URLs anunciavam a mesma data fixa, escrita
   * à mão no dia em que o sitemap foi criado.
   */
  fonte?: string;
  /**
   * Para rotas com parâmetro (`/artigos/:slug`), os caminhos concretos
   * que ela representa.
   *
   * O React Router resolve `:slug` em tempo de execução, mas a
   * pré-renderização e o sitemap precisam de endereços reais: não dá
   * para gravar em disco um arquivo chamado `:slug`, nem anunciá-lo ao
   * Google. Quem tem `expandir` entra na tabela uma vez e sai dela como
   * N páginas.
   */
  expandir?: () => string[];
  /**
   * Os caminhos que entram no sitemap, quando são menos que os de
   * `expandir`. Sem isto, os dois conjuntos são o mesmo.
   *
   * Existe por causa dos rascunhos de artigo. Eles PRECISAM de arquivo
   * próprio — senão o Bruno não consegue abrir o texto para revisar, já
   * que o servidor devolve 404 para endereço sem arquivo. Mas não podem
   * ser anunciados: saem com `noindex`, ficam fora da listagem e ficam
   * fora daqui.
   */
  expandirSitemap?: () => string[];
}

export const paginas: Pagina[] = [
  {
    rota: routes.home,
    carregar: () => import('../pages/Home'),
    fonte: 'src/pages/Home.tsx',
    publica: true,
    frequencia: 'weekly',
    prioridade: 1.0,
    imagem: '/og-image.png',
  },
  {
    rota: routes.formacoes,
    carregar: () => import('../pages/Formacoes'),
    fonte: 'src/pages/Formacoes.tsx',
    publica: true,
    frequencia: 'weekly',
    prioridade: 0.9,
    imagem: '/og-image.png',
  },
  {
    rota: routes.pnlPractitioner,
    carregar: () => import('../pages/PNLPractitioner'),
    fonte: 'src/pages/PNLPractitioner.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.9,
    imagem: '/capa-practitioner.webp',
  },
  {
    rota: routes.masterPnl,
    carregar: () => import('../pages/MasterPNL'),
    fonte: 'src/pages/MasterPNL.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.9,
    imagem: '/capa-master-pnl.webp',
  },
  {
    rota: routes.hipnoterapia,
    carregar: () => import('../pages/Hipnoterapia'),
    fonte: 'src/pages/Hipnoterapia.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.9,
    imagem: '/capa-hipnoterapia.webp',
  },
  {
    rota: routes.jornada,
    carregar: () => import('../pages/Jornada'),
    fonte: 'src/pages/Jornada.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.9,
    imagem: '/og-image.png',
  },
  {
    rota: routes.masterCoach,
    carregar: () => import('../pages/MasterCoach'),
    fonte: 'src/pages/MasterCoach.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.7,
    imagem: '/capa-coaching.webp',
  },
  /*
    Os artigos. A listagem é uma rota fixa; cada artigo é uma expansão de
    `/artigos/:slug`, e só entram os que o Bruno já revisou — rascunho não
    ganha arquivo próprio nem linha no sitemap. Ver `config/artigos.ts`.
  */
  {
    rota: routes.artigos,
    carregar: () => import('../pages/Artigos'),
    fonte: 'src/config/artigos.ts',
    publica: true,
    frequencia: 'weekly',
    prioridade: 0.8,
    imagem: '/og-image.png',
  },
  {
    rota: `${routes.artigos}/:slug`,
    carregar: () => import('../pages/Artigo'),
    fonte: 'src/config/artigos.ts',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.7,
    /* Todo artigo ganha arquivo, inclusive o rascunho: é como o Bruno o
       lê para revisar. O que separa um do outro é o `noindex` da página e
       a ausência dele no sitemap, logo abaixo. */
    expandir: () => artigos.map((a) => `${routes.artigos}/${a.slug}`),
    expandirSitemap: () => artigosPublicados.map((a) => `${routes.artigos}/${a.slug}`),
  },
  /*
    Os materiais entregues em troca de contato.

    ┌─────────────────────────────────────────────────────────────────────┐
    │  `expandirSitemap: () => []` NÃO É ESQUECIMENTO                     │
    │                                                                     │
    │  Cada material PRECISA de arquivo HTML próprio: o formulário do      │
    │  artigo entrega o link na hora, e sem arquivo em disco o servidor    │
    │  devolveria 404 para o endereço que o site acabou de prometer.       │
    │                                                                     │
    │  E nenhum deles pode ser anunciado. Se o material aparecesse na      │
    │  busca, ele chegaria a todo mundo sem passar pelo formulário — e o   │
    │  formulário é a razão de ele existir. A página sai com `noindex`     │
    │  (ver `pages/Material.tsx`) e a lista vazia aqui a mantém fora do    │
    │  sitemap. É a mesma mecânica dos rascunhos de artigo, logo acima.    │
    └─────────────────────────────────────────────────────────────────────┘
  */
  {
    rota: `${routes.materiais}/:id`,
    carregar: () => import('../pages/Material'),
    fonte: 'src/config/materiais.ts',
    publica: true,
    expandir: () => materiais.map((m) => `${routes.materiais}/${m.id}`),
    expandirSitemap: () => [],
  },
  {
    /*
      A /sobre entra com prioridade alta para o que ela é: os sete artigos
      declaram o Bruno como autor e apontam para cá, então esta é a página
      que sustenta a autoria do conteúdo inteiro do site.
    */
    rota: routes.sobre,
    carregar: () => import('../pages/Sobre'),
    fonte: 'src/pages/Sobre.tsx',
    publica: true,
    frequencia: 'monthly',
    prioridade: 0.7,
    imagem: '/brunosena.webp',
  },
  {
    rota: routes.contato,
    carregar: () => import('../pages/Contato'),
    fonte: 'src/pages/Contato.tsx',
    publica: true,
    frequencia: 'yearly',
    prioridade: 0.6,
  },
  {
    rota: routes.privacidade,
    carregar: () => import('../pages/Privacidade'),
    fonte: 'src/pages/Privacidade.tsx',
    publica: true,
    frequencia: 'yearly',
    prioridade: 0.3,
  },
  {
    rota: routes.termos,
    carregar: () => import('../pages/Termos'),
    fonte: 'src/pages/Termos.tsx',
    publica: true,
    frequencia: 'yearly',
    prioridade: 0.3,
  },
  /*
    O painel da lista de espera mostra dados pessoais de quem se cadastrou.
    Fora do índice, fora do sitemap e fora da pré-renderização — o Admin
    importa o SDK do Firebase, que não sobrevive a um render em Node.
  */
  {
    rota: routes.admin,
    carregar: () => import('../pages/Admin'),
    publica: false,
  },
];
