import { describe, expect, it } from 'vitest';
import { courses, listaCursos } from '../config/courses';
import { site } from '../config/site';
import { cursoComoSchema, grafo, organizacao, perguntasFrequentes } from './schema';

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
