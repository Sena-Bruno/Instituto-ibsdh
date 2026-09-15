import { routes, site } from './site';

/**
 * A pessoa por trás do instituto, como dado — e não como parágrafo de JSX.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UMA PESSOA VIROU ARQUIVO DE CONFIGURAÇÃO                     │
 * │                                                                       │
 * │  O buscador não entende "Bruno Sena" como nome próprio de alguém: ele │
 * │  vê duas palavras que aparecem no domínio, no título e em algumas     │
 * │  páginas. Para ele passar a tratá-lo como ENTIDADE — a coisa que      │
 * │  rende retrato, uma linha de descrição e os perfis ao lado do         │
 * │  resultado — três coisas precisam bater exatamente:                   │
 * │                                                                       │
 * │   1. uma página cujo assunto é a pessoa (a `/sobre`);                 │
 * │   2. dados estruturados que digam quem ela é, com retrato e resumo;   │
 * │   3. os MESMOS fatos visíveis nessa página, palavra por palavra.      │
 * │                                                                       │
 * │  Enquanto o resumo morasse escrito à mão no JSX e outra versão dele   │
 * │  no `schema.ts`, o item 3 dependia de alguém lembrar de editar os     │
 * │  dois. É a mesma armadilha do preço de curso — e a sanção do Google   │
 * │  para marcação que não corresponde ao conteúdo é de domínio, não de   │
 * │  página. Aqui é um dado só, lido pelos dois lados.                    │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const bruno = {
  nome: 'Bruno Sena',

  /** O cargo, como o `jobTitle` do schema e a própria página o dizem. */
  cargo: `Fundador e mentor do ${site.name}`,

  /**
   * O resumo de uma frase — o texto que o buscador tem chance de mostrar
   * ao lado do retrato, e o mesmo que a `/sobre` imprime sob o `<h1>`.
   *
   * ┌───────────────────────────────────────────────────────────────────┐
   * │  AO EDITAR, CONFIRA CADA AFIRMAÇÃO NA PRÓPRIA /sobre               │
   * │                                                                   │
   * │  Tudo o que esta frase diz está na tela daquela página: a          │
   * │  fundação do instituto (primeiro parágrafo), as três formações     │
   * │  (a lista do fim), a credencial da NLPEA (a faixa com o selo) e    │
   * │  os textos assinados (a seção "O que ele já escreveu").            │
   * │                                                                   │
   * │  Acrescentar aqui um fato que a página não mostra — um número de   │
   * │  alunos, um ano de início, uma formação que não está no catálogo — │
   * │  é declarar ao Google algo que a primeira conferência derruba.     │
   * │  Se o fato for verdadeiro, escreva-o na página primeiro.           │
   * └───────────────────────────────────────────────────────────────────┘
   */
  resumo:
    'Bruno Sena é o fundador do Instituto Bruno Sena de Desenvolvimento Humano, onde assina o método das formações em PNL, Hipnoterapia e Coaching. É membro vitalício e Practitioner reconhecido pela NLPEA, e escreve sobre o que cada uma dessas abordagens faz, o que ela não faz e onde não deve ser usada.',

  /** O retrato. É o arquivo que a `/sobre` abre e o que o sitemap anuncia. */
  retrato: {
    arquivo: '/brunosena.webp',
    largura: 900,
    altura: 1206,
    /** Vira a legenda do retrato nos dados estruturados e o `alt` na tela. */
    descricao: `Bruno Sena, fundador do ${site.name}`,
  },

  /** A página que é a casa da entidade. Tudo aponta para cá. */
  pagina: `${site.url}${routes.sobre}`,

  /**
   * Os perfis públicos que são comprovadamente dele.
   *
   * ┌───────────────────────────────────────────────────────────────────┐
   * │  ⚠  ESTA LISTA É O QUE FALTA PARA O RETRATO APARECER NA BUSCA      │
   * │                                                                   │
   * │  Um site que afirma "esta pessoa existe e é assim" é uma           │
   * │  afirmação sobre si mesmo — qualquer site faz isso. O que          │
   * │  transforma a afirmação em entidade reconhecida é ela se repetir   │
   * │  em lugares que o buscador já conhece e que não são seus: é para   │
   * │  isso que serve o `sameAs`, e hoje ele tem UM item.               │
   * │                                                                   │
   * │  PARA AMPLIAR, acrescente aqui a URL de cada perfil que seja       │
   * │  mesmo dele e que abra sem login:                                  │
   * │                                                                   │
   * │    • YouTube (a URL do canal, não a de um vídeo)                   │
   * │    • LinkedIn (o perfil pessoal, público)                          │
   * │    • Facebook, TikTok, Spotify — os que existirem de fato          │
   * │    • a ficha dele no diretório da própria NLPEA                    │
   * │    • a página da entidade no Wikidata, se um dia houver uma        │
   * │                                                                   │
   * │  Duas regras, e as duas importam mais do que o tamanho da lista:   │
   * │                                                                   │
   * │  1. Só perfil que uma pessoa consiga abrir e conferir. Link que    │
   * │     não abre, ou que exige conta, é pior do que link ausente —     │
   * │     ele afirma uma correspondência que ninguém pode verificar.     │
   * │  2. O nome, o retrato e a descrição desses perfis devem bater com  │
   * │     o que está aqui. É a repetição do MESMO conjunto de fatos em   │
   * │     lugares diferentes que faz o buscador concluir que se trata    │
   * │     de uma pessoa só — foto diferente e nome escrito de outro      │
   * │     jeito em cada lugar produzem o efeito contrário.               │
   * │                                                                   │
   * │  E de lá para cá também: cada um desses perfis deve ter o link do  │
   * │  site na bio. A ligação vale nos dois sentidos.                    │
   * └───────────────────────────────────────────────────────────────────┘
   */
  perfis: [site.social.instagram] as readonly string[],
} as const;
