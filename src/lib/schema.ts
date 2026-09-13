import type { Artigo } from '../config/artigos';
import type { Course } from '../config/courses';
import { routes, site } from '../config/site';

/**
 * Os dados estruturados do site, em JSON-LD.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  A REGRA QUE NÃO PODE SER QUEBRADA AQUI                               │
 * │                                                                       │
 * │  Tudo o que este arquivo declara TEM de estar visível na página que o │
 * │  declara. Preço no schema e outro preço na tela, nota de avaliação    │
 * │  que a página não mostra, curso descrito com palavras que não estão   │
 * │  no texto — qualquer um desses casos é violação direta da política de │
 * │  dados estruturados do Google, e a sanção não é perder o resultado    │
 * │  enriquecido daquela página: é o domínio inteiro perder elegibilidade │
 * │  a resultados enriquecidos.                                           │
 * │                                                                       │
 * │  É por isso que nada aqui é escrito à mão. Preço, carga horária,      │
 * │  certificado e link de checkout vêm de `config/courses.ts`, que é a   │
 * │  mesma fonte que a página lê para desenhar o card e a coluna de       │
 * │  compra. Os dois não podem divergir porque são o mesmo dado.          │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * O formato é JSON-LD, e não Microdata ou RDFa, porque é o único que o
 * Google declara preferir: fica num bloco só, separado do HTML, e por
 * isso não se perde quando o layout muda.
 */

/** Identificadores estáveis. Um `@id` permite que um nó referencie o outro
 *  em vez de repetir a organização inteira dentro de cada curso. */
const ids = {
  organizacao: `${site.url}/#organizacao`,
  site: `${site.url}/#site`,
  fundador: `${site.url}/#bruno-sena`,
} as const;

/**
 * `R$ 1.353,00` → `1353.00`. Devolve `undefined` para "Em breve".
 *
 * Exportada porque `lib/medir.ts` precisa exatamente do mesmo parse: o
 * preço que o JSON-LD anuncia ao Google e o valor que o GA4 registra como
 * intenção de compra saem da mesma string do catálogo, e duas leituras
 * diferentes da mesma string acabam divergindo no dia em que um preço
 * ganhar um centavo.
 */
export function precoEmNumero(valor: string): string | undefined {
  const limpo = valor
    .replace(/[^\d,.]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = Number.parseFloat(limpo);
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : undefined;
}

/** `100h` → `PT100H`, o formato de duração ISO 8601 que o schema exige. */
function cargaEmDuracao(carga?: string): string | undefined {
  const horas = carga?.match(/(\d+)\s*h/i)?.[1];
  return horas ? `PT${horas}H` : undefined;
}

/**
 * O instituto.
 *
 * `EducationalOrganization` em vez de `Organization` genérica porque é o
 * que a entidade é — e é o tipo que o Painel do Conhecimento usa para
 * separar uma escola de uma empresa com nome parecido.
 */
export function organizacao() {
  return {
    '@type': 'EducationalOrganization',
    '@id': ids.organizacao,
    name: site.name,
    alternateName: site.shortName,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: `${site.url}/logo-do-instituto.svg`,
    },
    image: `${site.url}/og-image.png`,
    email: site.email.contact,
    telephone: `+${site.whatsapp.number}`,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    inLanguage: 'pt-BR',
    founder: { '@id': ids.fundador },
    sameAs: [site.social.instagram],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Atendimento e matrículas',
        email: site.email.contact,
        telephone: `+${site.whatsapp.number}`,
        availableLanguage: 'Portuguese',
        areaServed: 'BR',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Parcerias',
        email: site.email.partnerships,
        availableLanguage: 'Portuguese',
        areaServed: 'BR',
      },
    ],
  };
}

/**
 * O fundador.
 *
 * Existe por causa do "Quem" das diretrizes de conteúdo útil: uma escola
 * cujo site não diz quem assina o método é uma escola sem autoria
 * verificável, e é isso que o E-E-A-T mede. Os dois fatos declarados —
 * fundador e credencial da NLPEA — são os mesmos que a seção "O seu
 * mentor" mostra na home, com o selo ao lado.
 */
export function fundador() {
  return {
    '@type': 'Person',
    '@id': ids.fundador,
    name: 'Bruno Sena',
    jobTitle: 'Fundador e mentor do Instituto Bruno Sena',
    image: `${site.url}/brunosena.webp`,
    /*
      Aponta para a /sobre, e não mais para a âncora `/#sobre-mentor` da
      home.

      A diferença importa para o E-E-A-T: os sete artigos declaram este
      nó como `author`, e até aqui o rastreador que seguisse a autoria
      caía no meio da home — uma página de vendas, com preço e botão de
      compra, em que a seção do Bruno é um bloco entre dezesseis. Agora
      cai numa página cujo assunto É a pessoa que assina os textos, que é
      o que "autoria verificável" quer dizer.
    */
    url: `${site.url}${routes.sobre}`,
    worksFor: { '@id': ids.organizacao },
    sameAs: [site.social.instagram],
    memberOf: {
      '@type': 'Organization',
      name: 'NLPEA — NLP Association of Excellence',
    },
  };
}

/**
 * A página de contato.
 *
 * `ContactPage` não é decoração: é o tipo que diz ao rastreador que esta
 * página responde "como falo com eles", e é o que permite ao Google
 * mostrar o contato sem que a pessoa precise entrar no site. Os meios
 * declarados aqui são os mesmos de `organizacao()`, por `@id`, então não
 * há como um dizer um telefone e o outro dizer outro.
 */
export function paginaDeContato() {
  return {
    '@type': 'ContactPage',
    '@id': `${site.url}${routes.contato}#pagina`,
    url: `${site.url}${routes.contato}`,
    name: `Contato | ${site.name}`,
    inLanguage: 'pt-BR',
    about: { '@id': ids.organizacao },
    isPartOf: { '@id': ids.site },
  };
}

/** O site como entidade, para amarrar as páginas a um publicador só. */
export function websiteDoInstituto() {
  return {
    '@type': 'WebSite',
    '@id': ids.site,
    name: site.name,
    url: site.url,
    inLanguage: 'pt-BR',
    publisher: { '@id': ids.organizacao },
  };
}

/**
 * Uma formação.
 *
 * O `hasCourseInstance` não é enfeite: sem ele — ou sem uma agenda de
 * turmas, que estas formações não têm por serem assíncronas — o Google
 * classifica a marcação como incompleta e não considera a página para o
 * resultado enriquecido de curso.
 */
export function cursoComoSchema(curso: Course) {
  const preco = precoEmNumero(curso.price);
  const duracao = cargaEmDuracao(curso.carga);

  return {
    '@type': 'Course',
    '@id': `${site.url}${curso.route}#curso`,
    name: curso.title,
    description: curso.resumo,
    url: `${site.url}${curso.route}`,
    ...(curso.capa ? { image: `${site.url}${curso.capa}` } : {}),
    inLanguage: 'pt-BR',
    isAccessibleForFree: false,
    provider: { '@id': ids.organizacao },
    ...(curso.certificado ? { educationalCredentialAwarded: curso.certificado } : {}),
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        /* Gravado e assíncrono: não há data de turma para declarar, e
           inventar uma seria descrever algo que a página não vende. */
        courseMode: 'Online',
        inLanguage: 'pt-BR',
        ...(duracao ? { courseWorkload: duracao } : {}),
        ...(curso.aulas ? { name: `${curso.title} — ${curso.aulas}` } : {}),
      },
    ],
    /*
      Sem preço definido não existe oferta. O Master Coach ainda não abriu
      matrícula: declarar `price: 0` ou uma disponibilidade qualquer aqui
      seria anunciar ao Google uma condição comercial que a página não
      oferece a ninguém.
    */
    ...(preco
      ? {
          offers: {
            '@type': 'Offer',
            category: 'Paid',
            price: preco,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            url: curso.checkout ?? `${site.url}${curso.route}`,
          },
        }
      : {}),
  };
}

/** A trilha de navegação, do início até a página atual. */
export function trilhaDeNavegacao(passos: { nome: string; rota: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: passos.map((passo, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: passo.nome,
      /* Com a barra final na raiz, para casar exatamente com o canônico
         da home. Um `item` que difere do canônico por um caractere é uma
         URL diferente aos olhos do rastreador. */
      item: `${site.url}${passo.rota}`,
    })),
  };
}

/** As perguntas frequentes, com as mesmas palavras que estão na tela. */
export function perguntasFrequentes(itens: readonly { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * Um artigo.
 *
 * `author` e `publisher` não são formalidade: o sistema de conteúdo útil
 * do Google avalia se dá para saber quem escreveu e sob que
 * responsabilidade, e uma peça sem autoria declarada é uma peça sem
 * responsável. Os dois apontam para os nós que a página já declara, por
 * `@id`, então não há como o schema dizer um nome e a página outro.
 *
 * `dateModified` sai da revisão quando houve uma; sem revisão, repete a
 * publicação. Nunca é a data de hoje — data que avança sozinha é sinal
 * falso de frescor, e o Google desconta o site que o emite.
 */
export function artigoComoSchema(artigo: Artigo) {
  const url = `${site.url}${routes.artigos}/${artigo.slug}`;
  return {
    '@type': 'Article',
    '@id': `${url}#artigo`,
    headline: artigo.tituloSeo ?? artigo.titulo,
    name: artigo.titulo,
    description: artigo.resumo,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'pt-BR',
    datePublished: artigo.publicadoEm,
    dateModified: artigo.revisadoEm ?? artigo.publicadoEm,
    /* Sem título honorífico nem "Escrito por" grudado no nome: o campo é
       o identificador da pessoa, e adorno ali quebra a correspondência
       com a entidade declarada no resto do site. */
    author: { '@id': ids.fundador },
    publisher: { '@id': ids.organizacao },
    image: `${site.url}/og-image.png`,
    isAccessibleForFree: true,
  };
}

/** A lista de artigos publicados — o que a página `/artigos` mostra. */
export function listaDeArtigos(lista: Artigo[]) {
  return {
    '@type': 'ItemList',
    itemListElement: lista.map((artigo, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: artigo.titulo,
      url: `${site.url}${routes.artigos}/${artigo.slug}`,
    })),
  };
}

/** Uma lista ordenada de cursos — o que o catálogo mostra. */
export function listaDeCursos(cursos: Course[]) {
  return {
    '@type': 'ItemList',
    itemListElement: cursos.map((curso, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: curso.title,
      url: `${site.url}${curso.route}`,
    })),
  };
}

/**
 * Embrulha os nós num único `@graph`.
 *
 * Um bloco só, com os nós referenciados por `@id`, em vez de vários
 * blocos repetindo a organização inteira dentro de cada um. Menos bytes
 * no `<head>` e nenhuma chance de duas cópias da mesma entidade
 * divergirem entre si.
 */
export function grafo(...nos: object[]) {
  return { '@context': 'https://schema.org', '@graph': nos };
}
