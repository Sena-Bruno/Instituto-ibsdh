import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const raiz = path.resolve(__dirname, '..');
const regras = readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8');

/** Todo arquivo de código de `src/`, menos os testes. */
function fontes(dir = raiz): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const caminho = path.join(dir, e.name);
    if (e.isDirectory()) return fontes(caminho);
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [caminho];
  });
}

/**
 * As coleções do Firestore que o site realmente usa.
 *
 * Duas formas de nomeá-las convivem no código, e as duas contam:
 *
 * · `collection(db, 'leads')` — os formulários e as avaliações;
 * · `colecao: 'leads'` — a tabela `LISTAS` do /admin, que passa o nome por
 *   variável para uma consulta só servir as duas abas.
 */
function colecoesUsadas(): Set<string> {
  const nomes = new Set<string>();
  for (const arquivo of fontes()) {
    const codigo = readFileSync(arquivo, 'utf8');
    for (const m of codigo.matchAll(/collection\(\s*\w+\s*,\s*'([^']+)'/g)) nomes.add(m[1]);
    for (const m of codigo.matchAll(/colecao:\s*'([^']+)'/g)) nomes.add(m[1]);
  }
  return nomes;
}

/**
 * Toda coleção usada pelo site precisa de uma regra escrita.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTE TESTE EXISTE POR CAUSA DE UM BUG REAL, EM PRODUÇÃO              │
 * │                                                                       │
 * │  A captação de material subiu e recusava TODO cadastro. A coleção     │
 * │  `leads` era nova, e o Firestore nega por padrão o que nenhuma regra  │
 * │  autoriza — sem erro no build, sem erro no deploy, sem nada em tela   │
 * │  além de uma mensagem genérica para o visitante.                      │
 * │                                                                       │
 * │  É a pior forma de falhar que existe neste site: o formulário se      │
 * │  comporta como um formulário quebrado, mas só depois que já está no   │
 * │  ar e só para quem tenta usá-lo.                                      │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  O QUE ESTE TESTE **NÃO** PEGA                                     │
 * │                                                                       │
 * │  Ele compara o código com o ARQUIVO `firestore.rules`. Não tem como   │
 * │  saber se esse arquivo foi PUBLICADO — e foi exatamente aí que a      │
 * │  falha real aconteceu: a regra de `leads` estava escrita e no ar      │
 * │  estava a versão anterior das regras.                                 │
 * │                                                                       │
 * │  Publicar é um passo à parte, e continua sendo manual:                │
 * │                                                                       │
 * │      firebase deploy --only firestore:rules                           │
 * │                                                                       │
 * │  O deploy do site (Netlify) sobe HTML e JavaScript e não toca no      │
 * │  Firestore. SEMPRE que este arquivo mudar, rode o comando acima.      │
 * │  Quem avisa que ele foi esquecido é o console do navegador, com o     │
 * │  diagnóstico de `lib/erroDeFirestore.ts`.                             │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('sincronia entre as coleções usadas e firestore.rules', () => {
  it('encontra as coleções do site', () => {
    // Se a varredura parar de achar nada, os testes abaixo passam sem
    // verificar coisa nenhuma — que é o jeito silencioso de este arquivo
    // virar decoração.
    expect(colecoesUsadas().size).toBeGreaterThanOrEqual(3);
  });

  it('toda coleção usada tem um bloco match nas regras', () => {
    for (const colecao of colecoesUsadas()) {
      expect(
        regras,
        `O site usa a coleção "${colecao}" e firestore.rules não tem um "match /${colecao}/". ` +
          'O Firestore nega por padrão o que nenhuma regra autoriza: toda gravação vai ser ' +
          'recusada em produção, sem nada quebrar no build.',
      ).toContain(`match /${colecao}/`);
    }
  });

  it('toda coleção em que o site grava permite criar', () => {
    for (const colecao of ['waitlist', 'leads', 'course_reviews']) {
      const bloco = regras.match(
        new RegExp(`match /${colecao}/\\{[^}]*\\}[\\s\\S]*?\\n    \\}`),
      )?.[0];
      expect(bloco, `firestore.rules não tem o bloco de "${colecao}"`).toBeTruthy();
      expect(
        bloco,
        `O bloco de "${colecao}" não tem "allow create": o formulário grava e o Firestore recusa.`,
      ).toContain('allow create');
    }
  });

  it('as duas listas de dados pessoais continuam fechadas para leitura', () => {
    /* Nome e e-mail são dados pessoais sob a LGPD. `allow read: if true`
       em qualquer uma das duas abriria a lista inteira para a internet, e
       o site continuaria funcionando exatamente igual — não há sintoma. */
    for (const colecao of ['waitlist', 'leads']) {
      const bloco = regras.match(
        new RegExp(`match /${colecao}/\\{[^}]*\\}[\\s\\S]*?\\n    \\}`),
      )?.[0];
      expect(
        bloco,
        `A coleção "${colecao}" guarda nome e e-mail: a leitura precisa passar por isAdmin().`,
      ).toContain('allow read: if isAdmin()');
    }
  });
});
