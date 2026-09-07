import type { Course } from '../config/courses';
import { site } from '../config/site';

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

/** `R$ 1.353,00` → `1353.00`. Devolve `undefined` para "Em breve". */
function precoEmNumero(valor: string): string | undefined {
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
    url: `${site.url}/#sobre-mentor`,
    worksFor: { '@id': ids.organizacao },
    sameAs: [site.social.instagram],
    memberOf: {
      '@type': 'Organization',
      name: 'NLPEA — NLP Association of Excellence',
    },
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
