import { describe, expect, it } from 'vitest';
import { combos, corDoCurso, courses, cursosDoEixo, economiaDe, listaCursos } from './courses';
import { eixos } from './eixos';

/**
 * Testes do catálogo.
 *
 * O que se protege aqui não é o código, é a receita. O site já vendeu com
 * três defeitos deste tipo ao mesmo tempo, e nenhum deles quebrava nada
 * visível: dois botões de compra sem destino, um apontando para uma URL de
 * exemplo, e a página do Master PNL anunciando R$ 997 no topo e R$ 397 no
 * checkout, 330 linhas abaixo. Tudo renderizava; tudo parecia certo.
 *
 * É por isso que estas verificações são sobre coerência dos dados, e não
 * sobre valores fixos: um teste que afirma "o Master custa R$ 997" só
 * repetiria a configuração num segundo lugar — e passaria a dar falso
 * negativo no dia legítimo em que o preço mudasse.
 */

const emCentavos = (v: string) =>
  Math.round(Number.parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) * 100);

/**
 * Troca espaço não separável por espaço comum.
 *
 * `toLocaleString('pt-BR', { style: 'currency' })` separa o "R$" do número
 * com U+00A0, e não com o espaço do teclado. As duas strings são idênticas
 * na tela e diferentes para o `===`, então a comparação crua falha exibindo
 * "expected 'R$ 700,00' to be 'R$ 700,00'" — que não ajuda ninguém.
 */
const semNbsp = (v: string | undefined) => v?.replace(/ /g, ' ');

describe('economiaDe', () => {
  it('calcula a diferença entre o preço de e o à vista', () => {
    expect(semNbsp(economiaDe({ price: 'R$ 297,00', priceFrom: 'R$ 997,00' }))).toBe(
      'R$ 700,00',
    );
  });

  it('devolve undefined sem preço de', () => {
    expect(economiaDe({ price: 'R$ 297,00' })).toBeUndefined();
  });

  /*
    Sem esta guarda a home anunciaria "economia de R$ 0,00" — pior do que não
    anunciar nada, porque chama atenção para a ausência do desconto.
  */
  it('devolve undefined quando não há desconto', () => {
    expect(economiaDe({ price: 'R$ 997,00', priceFrom: 'R$ 997,00' })).toBeUndefined();
    expect(economiaDe({ price: 'R$ 997,00', priceFrom: 'R$ 500,00' })).toBeUndefined();
  });

  it('devolve undefined quando o preço não é um valor', () => {
    expect(economiaDe({ price: 'Em breve', priceFrom: 'R$ 997,00' })).toBeUndefined();
  });
});

describe('integridade do catálogo', () => {
  const abertos = listaCursos.filter((c) => c.situacao === 'aberto');

  it('há curso aberto para vender', () => {
    expect(abertos.length).toBeGreaterThan(0);
  });

  /*
    O defeito que motivou a auditoria inteira: `<button>` sem onClick nem
    href em duas páginas de curso, e o CTA do hero apontando para o
    `#checkout` que rolava até esse botão morto. O funil terminava em nada.
  */
  it('todo curso aberto tem checkout', () => {
    for (const curso of abertos) {
      expect(curso.checkout, `${curso.title} está aberto e não tem checkout`).toBeTruthy();
    }
  });

  it('nenhum checkout aponta para URL de exemplo ou placeholder', () => {
    for (const curso of listaCursos) {
      if (!curso.checkout) continue;
      expect(curso.checkout, `${curso.title} aponta para um link que não vende`).not.toMatch(
        /example|placeholder|test|seu-link|#$/i,
      );
      expect(curso.checkout).toMatch(/^https:\/\//);
    }
  });

  it('cada checkout é usado por um único curso', () => {
    /*
      Dois cursos com o mesmo link significa que alguém copiou o bloco de
      checkout junto com o resto da página — exatamente o que aconteceu com
      o Master PNL, que herdou o checkout da Hipnoterapia. O comprador paga
      pelo curso errado, e cobrar a diferença depois é briga garantida.
    */
    const usados = listaCursos.filter((c) => c.checkout).map((c) => c.checkout);
    expect(new Set(usados).size).toBe(usados.length);
  });

  it('curso em breve não tem checkout', () => {
    for (const curso of listaCursos.filter((c) => c.situacao === 'emBreve')) {
      expect(curso.checkout, `${curso.title} não lançou e já tem checkout`).toBeFalsy();
    }
  });

  it('a parcela sem juros bate com o preço dividido por 12', () => {
    /*
      A tolerância de um real absorve o arredondamento que se usa em anúncio
      (87,50 em vez de 83,08). O que o teste pega é a ordem de grandeza
      errada — a parcela de outro curso, copiada junto com o bloco.
    */
    for (const curso of listaCursos) {
      if (!curso.installment || !curso.price.includes('R$')) continue;
      const esperado = emCentavos(curso.price) / 12;
      const declarado = emCentavos(curso.installment);
      expect(
        Math.abs(declarado - esperado),
        `${curso.title}: 12x de ${curso.installment} não fecha com ${curso.price}`,
      ).toBeLessThan(600);
    }
  });

  it('a parcela com juros é maior que a sem juros', () => {
    for (const curso of listaCursos) {
      if (!curso.installment || !curso.installmentWithFees) continue;
      expect(
        emCentavos(curso.installmentWithFees),
        `${curso.title}: a parcela com juros não é maior que a sem`,
      ).toBeGreaterThan(emCentavos(curso.installment));
    }
  });

  it('o preço de é maior que o à vista', () => {
    for (const curso of listaCursos) {
      if (!curso.priceFrom || !curso.price.includes('R$')) continue;
      expect(
        emCentavos(curso.priceFrom),
        `${curso.title}: o preço "de" não é maior que o à vista`,
      ).toBeGreaterThan(emCentavos(curso.price));
    }
  });

  it('rota e slug são únicos', () => {
    const rotas = listaCursos.map((c) => c.route);
    const slugs = listaCursos.map((c) => c.slug);
    expect(new Set(rotas).size, 'duas formações na mesma rota').toBe(rotas.length);
    expect(new Set(slugs).size, 'dois slugs iguais: as avaliações se misturam').toBe(
      slugs.length,
    );
  });

  it('todo curso aponta para um eixo que existe', () => {
    for (const curso of listaCursos) {
      expect(
        eixos[curso.eixo],
        `${curso.title} aponta para o eixo ${curso.eixo}`,
      ).toBeDefined();
      expect(corDoCurso(curso)).toBe(eixos[curso.eixo].cor);
    }
  });

  it('a ordem dentro de cada eixo não repete', () => {
    for (const eixo of Object.values(eixos)) {
      const ordens = cursosDoEixo(eixo.id).map((c) => c.ordem);
      expect(new Set(ordens).size, `o eixo ${eixo.id} tem duas formações na mesma ordem`).toBe(
        ordens.length,
      );
    }
  });

  it('a rota começa com barra', () => {
    for (const curso of listaCursos) {
      expect(curso.route).toMatch(/^\//);
    }
  });
});

describe('combos', () => {
  /*
    Enquanto os produtos não existirem na plataforma de pagamento, o campo
    fica `undefined` e o botão leva ao WhatsApp da coordenação. O que não
    pode voltar a acontecer é o estado anterior: o combo anunciava R$ 597 e
    mandava para o checkout da Hipnoterapia sozinha, a R$ 397.
  */
  it('nenhum combo aponta para o checkout de um curso avulso', () => {
    const avulsos = new Set(listaCursos.map((c) => c.checkout).filter(Boolean));
    for (const combo of Object.values(combos)) {
      if (!combo.checkout) continue;
      expect(
        avulsos.has(combo.checkout),
        `${combo.title} manda para o checkout de um curso avulso, por outro valor`,
      ).toBe(false);
    }
  });

  it('o combo custa menos que a soma dos cursos que o formam', () => {
    for (const combo of Object.values(combos)) {
      expect(emCentavos(combo.price)).toBeLessThan(emCentavos(combo.priceFrom));
    }
  });

  it('a economia anunciada bate com a diferença', () => {
    for (const combo of Object.values(combos)) {
      const real = emCentavos(combo.priceFrom) - emCentavos(combo.price);
      expect(
        emCentavos(combo.economia),
        `${combo.title}: anuncia economia de ${combo.economia} e a conta dá outro valor`,
      ).toBe(real);
    }
  });
});

describe('vitrine da home', () => {
  it('só destaca curso que não está encerrado', () => {
    for (const curso of listaCursos.filter((c) => c.destaque)) {
      expect(curso.situacao, `${curso.title} está encerrado e ainda aparece na home`).not.toBe(
        'encerrado',
      );
    }
  });

  it('o objeto courses e a lista ordenada têm os mesmos cursos', () => {
    expect(listaCursos).toHaveLength(Object.keys(courses).length);
  });
});
