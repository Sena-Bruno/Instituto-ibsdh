import { describe, expect, it } from 'vitest';
import { artigoPorSlug, artigos, artigosPublicados, artigosRelacionados } from './artigos';
import { TETO_DO_TITULO, tituloComMarca } from './site';

/**
 * Testes da malha entre os artigos.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTES TESTES PROTEGEM                                          │
 * │                                                                       │
 * │  A sugestão é DERIVADA, e derivação errada não parece errada: o bloco │
 * │  continua na tela, com três cartões bonitos, apontando para os textos │
 * │  errados — ou, pior, para um rascunho que o próprio site pediu ao     │
 * │  Google para ignorar.                                                 │
 * │                                                                       │
 * │  É a mesma classe de falha do resto deste projeto: silenciosa, com    │
 * │  aparência de sucesso, no caminho que segura o leitor no site.        │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('artigosRelacionados', () => {
  const primeiro = artigosPublicados[0];

  it('nunca sugere o próprio artigo', () => {
    for (const artigo of artigosPublicados) {
      const sugeridos = artigosRelacionados(artigo).map((a) => a.slug);
      expect(sugeridos).not.toContain(artigo.slug);
    }
  });

  it('nunca sugere rascunho', () => {
    /* Rascunho sai com `noindex` e fora da listagem. Linká-lo aqui mandaria
       o leitor — e o rastreador — a uma página que o site declarou que não
       está pronta. */
    const publicados = new Set(artigosPublicados.map((a) => a.slug));
    for (const artigo of artigosPublicados) {
      for (const sugerido of artigosRelacionados(artigo)) {
        expect(publicados.has(sugerido.slug)).toBe(true);
      }
    }
  });

  it('põe o mesmo eixo na frente', () => {
    /* Quem leu sobre transe quer ler sobre regressão, não sobre metas. Se
       a ordenação inverter, a sugestão continua funcionando e passa a
       sugerir o assunto errado — que é exatamente o que não se vê. */
    for (const artigo of artigosPublicados) {
      const doMesmoEixo = artigosPublicados.filter(
        (a) => a.eixo === artigo.eixo && a.slug !== artigo.slug,
      ).length;

      const sugeridos = artigosRelacionados(artigo);
      for (let i = 0; i < Math.min(doMesmoEixo, sugeridos.length); i++) {
        expect(sugeridos[i].eixo).toBe(artigo.eixo);
      }
    }
  });

  it('completa com outros eixos quando o próprio não tem o bastante', () => {
    /* Hipnoterapia e coaching têm dois artigos cada: sem o complemento, o
       bloco apareceria com um cartão só. */
    for (const artigo of artigosPublicados) {
      const esperado = Math.min(3, artigosPublicados.length - 1);
      expect(artigosRelacionados(artigo)).toHaveLength(esperado);
    }
  });

  it('ordena do mais recente para o mais antigo dentro de cada grupo', () => {
    const sugeridos = artigosRelacionados(primeiro);
    const doMesmoEixo = sugeridos.filter((a) => a.eixo === primeiro.eixo);

    for (let i = 1; i < doMesmoEixo.length; i++) {
      expect(doMesmoEixo[i - 1].publicadoEm >= doMesmoEixo[i].publicadoEm).toBe(true);
    }
  });

  it('respeita o limite pedido', () => {
    expect(artigosRelacionados(primeiro, 1)).toHaveLength(1);
    expect(artigosRelacionados(primeiro, 0)).toHaveLength(0);
  });

  it('todo artigo publicado é alcançável a partir de outro', () => {
    /*
      O teste que justifica o recurso inteiro. Antes, cada um dos sete
      textos era uma ilha: ligava ao curso e ao material, e a nenhum outro
      artigo. Link interno é como o Google mede profundidade de tema, e
      sete páginas sem ligação parecem sete assuntos avulsos em vez de um
      instituto que domina três.
    */
    const alcancados = new Set<string>();
    for (const artigo of artigosPublicados) {
      for (const sugerido of artigosRelacionados(artigo)) alcancados.add(sugerido.slug);
    }

    for (const artigo of artigosPublicados) {
      expect(alcancados.has(artigo.slug)).toBe(true);
    }
  });

  it('cada slug sugerido existe de verdade', () => {
    for (const artigo of artigosPublicados) {
      for (const sugerido of artigosRelacionados(artigo)) {
        expect(artigoPorSlug(sugerido.slug)).toBeDefined();
      }
    }
  });
});

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  OS DOIS LIMITES QUE A BUSCA IMPÕE, E QUE NINGUÉM VÊ AO EDITAR          │
  │                                                                        │
  │  Título e descrição são cortados no resultado de busca, e o corte não   │
  │  aparece em lugar nenhum durante a escrita: o texto fica bonito no      │
  │  editor, passa em lint, em tipo e em build, e a conta chega semanas     │
  │  depois — em CTR, que é o número que ninguém liga ao commit que o       │
  │  causou.                                                               │
  │                                                                        │
  │  O contrato já estava escrito nos comentários da interface `Artigo`.    │
  │  Aqui ele passa a ser executável.                                      │
  └─────────────────────────────────────────────────────────────────────────┘
*/
describe('os artigos cabem no resultado de busca', () => {
  it('nenhum título passa da largura que o Google mostra', () => {
    for (const artigo of artigos) {
      const titulo = tituloComMarca(artigo.tituloSeo ?? artigo.titulo);
      expect(titulo.length, `${artigo.slug}: "${titulo}"`).toBeLessThanOrEqual(TETO_DO_TITULO);
    }
  });

  it('nenhuma descrição é cortada, nem é curta demais para ocupar a linha', () => {
    for (const artigo of artigos) {
      const descricao = artigo.descricaoSeo ?? artigo.resumo;
      const onde = `${artigo.slug}: ${descricao.length} caracteres`;
      expect(descricao.length, onde).toBeLessThanOrEqual(158);
      expect(descricao.length, onde).toBeGreaterThanOrEqual(110);
    }
  });

  it('descricaoSeo só existe onde o resumo não cabia', () => {
    /*
      Um `descricaoSeo` ao lado de um `resumo` que já cabia é duplicação
      sem motivo: dois textos para manter, e no dia em que divergirem a
      página mostra um e a busca mostra outro.
    */
    for (const artigo of artigos) {
      if (artigo.descricaoSeo) {
        expect(
          artigo.resumo.length,
          `${artigo.slug} não precisava de descricaoSeo`,
        ).toBeGreaterThan(158);
      }
    }
  });
});
