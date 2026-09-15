import { describe, expect, it } from 'vitest';
import { bruno } from '../config/bruno';
import { courses, listaCursos } from '../config/courses';
import { routes, site } from '../config/site';
import {
  cursoComoSchema,
  fundador,
  grafo,
  organizacao,
  paginaDoFundador,
  perguntasFrequentes,
} from './schema';

/**
 * Testes dos dados estruturados.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O RISCO AQUI É DE DOMÍNIO, NÃO DE PÁGINA                             │
 * │                                                                       │
 * │  Preço no JSON-LD diferente do preço na tela, ou oferta declarada num  │
 * │  curso que não vende, não custa o resultado enriquecido daquela        │
 * │  página: custa a elegibilidade do site inteiro. É a penalidade que o   │
 * │  Google aplica a marcação que não corresponde ao conteúdo.             │
 * │                                                                       │
 * │  E é invisível de ponta a ponta: o JSON-LD não aparece na tela, não    │
 * │  quebra layout, não gera erro de console. Um preço errado ali fica no  │
 * │  ar até alguém abrir o teste de resultados aprimorados — ou até as     │
 * │  posições caírem, meses depois.                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('cursoComoSchema', () => {
  it('o preço declarado é o mesmo preço à vista do catálogo', () => {
    for (const curso of listaCursos) {
      const schema = cursoComoSchema(curso) as { offers?: { price: string } };
      if (!curso.price.includes('R$')) continue;

      /* O ponto de milhar sai antes da vírgula decimal: "R$ 1.353,00" tem de
         virar 1353, e não 1.353 — a conversão ingênua transformaria a Trilogia
         numa oferta de um real e trinta e cinco. */
      const doCatalogo = Number.parseFloat(
        curso.price
          .replace(/[^\d,.]/g, '')
          .replace(/\./g, '')
          .replace(',', '.'),
      );

      // O schema declara o preço como string de duas decimais ("297.00"), que
      // é a forma que a documentação do Google recomenda para Offer. A
      // comparação é do valor, não do formato.
      expect(
        Number(schema.offers?.price),
        `${curso.title}: o schema anuncia ao Google um preço diferente do que a página mostra`,
      ).toBe(doCatalogo);
      expect(schema.offers?.price).toMatch(/^\d+\.\d{2}$/);
    }
  });

  it('a oferta aponta para o checkout do próprio curso', () => {
    for (const curso of listaCursos) {
      const schema = cursoComoSchema(curso) as { offers?: { url: string } };
      if (!curso.checkout) continue;
      expect(schema.offers?.url).toBe(curso.checkout);
    }
  });

  /*
    O Master Coach não abriu matrícula. Declarar `price: 0` ou uma
    disponibilidade qualquer seria anunciar ao Google uma condição comercial
    que a página não oferece a ninguém — e é o tipo de divergência que a
    penalidade alcança.
  */
  it('curso sem preço não declara oferta nenhuma', () => {
    const schema = cursoComoSchema(courses.masterCoach) as { offers?: unknown };
    expect(schema.offers).toBeUndefined();
  });

  it('declara hasCourseInstance, sem o qual a marcação é ignorada', () => {
    for (const curso of listaCursos) {
      const schema = cursoComoSchema(curso) as { hasCourseInstance?: unknown[] };
      expect(schema.hasCourseInstance?.length, `${curso.title} sem CourseInstance`).toBe(1);
    }
  });

  it('as URLs são absolutas e no domínio do site', () => {
    for (const curso of listaCursos) {
      const schema = cursoComoSchema(curso) as { url: string; '@id': string; image?: string };
      expect(schema.url).toBe(`${site.url}${curso.route}`);
      expect(schema['@id'].startsWith(site.url)).toBe(true);
      if (schema.image) expect(schema.image.startsWith(site.url)).toBe(true);
    }
  });

  it('o nome e a descrição vêm do catálogo, não estão escritos à mão', () => {
    for (const curso of listaCursos) {
      const schema = cursoComoSchema(curso) as { name: string; description: string };
      expect(schema.name).toBe(curso.title);
      expect(schema.description).toBe(curso.resumo);
    }
  });
});

describe('perguntasFrequentes', () => {
  it('cada pergunta vira um par pergunta/resposta', () => {
    const schema = perguntasFrequentes([{ q: 'Tem certificado?', a: 'Sim.' }]) as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0].name).toBe('Tem certificado?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Sim.');
  });
});

describe('organizacao', () => {
  it('usa a razão social e o contato da configuração', () => {
    const schema = JSON.stringify(organizacao());
    expect(schema).toContain(site.legalName);
    expect(schema).toContain(site.email.contact);
  });
});

describe('fundador', () => {
  /*
    ┌───────────────────────────────────────────────────────────────────────┐
    │  ESTE NÓ É O QUE PODE VIRAR RETRATO E DESCRIÇÃO NA BUSCA              │
    │                                                                       │
    │  É a declaração de que "Bruno Sena" é uma pessoa, e não duas palavras │
    │  que calham de estar no domínio. O que ele precisa ter para o         │
    │  buscador conseguir montar uma ficha: nome, resumo, retrato com       │
    │  dimensões, uma página que é a casa da entidade e pelo menos um       │
    │  perfil externo que corrobore tudo isso.                              │
    │                                                                       │
    │  Cada teste aqui guarda um desses campos contra o sumiço silencioso:  │
    │  nenhum deles aparece na tela, nenhum quebra layout, e a falta de     │
    │  qualquer um só se notaria meses depois — na ficha que não aparece.   │
    └───────────────────────────────────────────────────────────────────────┘
  */
  const pessoa = fundador() as {
    name: string;
    description: string;
    url: string;
    mainEntityOfPage: string;
    sameAs: string[];
    image: { url: string; width: number; height: number; caption: string };
  };

  it('declara o mesmo resumo que a /sobre imprime na tela', () => {
    /* Se estes dois deixarem de ser o mesmo dado, o site passa a afirmar
       ao Google uma descrição que a página não mostra — que é a regra do
       topo de `schema.ts`, e a que custa o domínio inteiro. */
    expect(pessoa.description).toBe(bruno.resumo);
    expect(pessoa.name).toBe(bruno.nome);
  });

  it('aponta a /sobre como a página da pessoa', () => {
    expect(pessoa.url).toBe(`${site.url}${routes.sobre}`);
    expect(pessoa.mainEntityOfPage).toBe(`${site.url}${routes.sobre}`);
  });

  it('o retrato é absoluto e traz as dimensões', () => {
    /* URL relativa num nó de imagem é URL que o rastreador de imagens
       resolve contra a página em que encontrou o bloco — e o bloco é
       emitido em todas. Sem largura e altura, o buscador não sabe se a
       foto serve para o recorte que ele precisa desenhar. */
    expect(pessoa.image.url).toBe(`${site.url}${bruno.retrato.arquivo}`);
    expect(pessoa.image.url).toMatch(/^https:\/\//);
    expect(pessoa.image.width).toBeGreaterThan(0);
    expect(pessoa.image.height).toBeGreaterThan(0);
  });

  it('tem ao menos um perfil externo, e todos abertos em https', () => {
    /*
      O `sameAs` é o único campo desta ficha que não se resolve mexendo em
      código: ele depende de existirem perfis públicos do Bruno para
      apontar. Com a lista vazia, o site afirma quem ele é sem nada fora
      do próprio domínio corroborando — e é exatamente aí que o buscador
      não promove a afirmação a entidade. Ver `config/bruno.ts`.
    */
    expect(pessoa.sameAs.length).toBeGreaterThan(0);
    for (const perfil of pessoa.sameAs) {
      expect(perfil, `${perfil} não é uma URL pública em https`).toMatch(/^https:\/\/\S+$/);
    }
  });
});

describe('paginaDoFundador', () => {
  it('declara a /sobre como página CUJO assunto é a pessoa', () => {
    const pagina = paginaDoFundador() as {
      '@type': string;
      mainEntity: { '@id': string };
      url: string;
    };
    expect(pagina['@type']).toBe('ProfilePage');
    expect(pagina.url).toBe(`${site.url}${routes.sobre}`);
    /* `mainEntity` é o que separa "página que menciona o Bruno" de
       "página que é sobre o Bruno". Sem isto, a /sobre é só mais uma das
       dezenove que o citam. */
    expect(pagina.mainEntity['@id']).toBe((fundador() as { '@id': string })['@id']);
  });

  it('a referência à pessoa resolve dentro do próprio grafo', () => {
    /*
      A mesma checagem que o `scripts/prerender.mjs` faz em cada rota, feita
      aqui na unidade: um `{ "@id": … }` sozinho é REFERÊNCIA, e só
      significa alguma coisa se o nó completo estiver no mesmo `@graph`.
      Quando não está, nada acusa — o JSON continua válido e a entidade
      resolve para um nó sem nome.
    */
    const g = grafo(organizacao(), fundador(), paginaDoFundador()) as {
      '@graph': { '@id': string; '@type': string }[];
    };
    const declarados = new Set(g['@graph'].map((no) => no['@id']));
    const pagina = paginaDoFundador() as { mainEntity: { '@id': string } };
    expect(declarados.has(pagina.mainEntity['@id'])).toBe(true);
  });
});

describe('grafo', () => {
  it('monta um @graph com o contexto do schema.org', () => {
    const g = grafo({ '@type': 'A' }, { '@type': 'B' }) as {
      '@context': string;
      '@graph': unknown[];
    };
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(2);
  });

  it('o resultado é serializável para dentro de um <script>', () => {
    /*
      O JSON-LD é injetado como texto num <script type="application/ld+json">.
      Um valor não serializável (undefined em array, função, ciclo) quebraria
      a marcação inteira da página, e o erro só apareceria num validador.
    */
    const g = grafo(organizacao(), cursoComoSchema(courses.pnlPractitioner));
    expect(() => JSON.stringify(g)).not.toThrow();
    expect(JSON.stringify(g)).not.toContain('undefined');
  });
});
