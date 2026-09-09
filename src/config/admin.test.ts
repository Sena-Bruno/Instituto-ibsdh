import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isAdmin } from './admin';

describe('isAdmin', () => {
  it('recusa quem não está na lista', () => {
    expect(isAdmin('uid-que-nao-existe')).toBe(false);
  });

  /*
    Estes três casos são o que separa "recusa quem não é admin" de "recusa
    tudo o que for falsy". Um `ADMIN_UIDS.includes(uid)` sem a guarda do
    `!!uid` devolveria `undefined` em vez de `false` para entrada vazia — e
    `undefined` num `if` se comporta igual a `false`, então o bug passaria
    despercebido até alguém serializar o resultado ou compará-lo com `===`.
  */
  it.each([
    ['vazio', ''],
    ['undefined', undefined],
    ['null', null],
  ])('recusa uid %s devolvendo false, não undefined', (_nome, uid) => {
    expect(isAdmin(uid)).toBe(false);
  });

  it('aceita um uid da lista', () => {
    const uids = uidsDeclaradosNasRegras();
    expect(uids.length).toBeGreaterThan(0);
    for (const uid of uids) expect(isAdmin(uid)).toBe(true);
  });
});

/** Os UID que a função `isAdmin()` de `firestore.rules` autoriza. */
function uidsDeclaradosNasRegras(): string[] {
  const regras = readFileSync(path.resolve(__dirname, '../../firestore.rules'), 'utf8');
  const bloco = regras.match(/function isAdmin\(\)[\s\S]*?\}/)?.[0];
  if (!bloco) throw new Error('firestore.rules não tem mais a função isAdmin()');
  return [...bloco.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/**
 * As duas listas de administrador têm de bater.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTE TESTE EXISTE POR CAUSA DE UM BUG REAL                           │
 * │                                                                       │
 * │  Quem pode ler a lista de espera está escrito em DOIS lugares:        │
 * │  `ADMIN_UIDS` aqui, que controla o que a interface mostra, e a função │
 * │  `isAdmin()` em `firestore.rules`, que é o que realmente protege os   │
 * │  dados. Os dois arquivos não se importam, então nada além de          │
 * │  disciplina os mantinha iguais.                                      │
 * │                                                                       │
 * │  E a disciplina falhou: o UID foi acrescentado num e não no outro. Os │
 * │  dois modos de errar têm sintomas opostos, e nenhum é óbvio:          │
 * │                                                                       │
 * │  · só no código  → o /admin abre, mostra a tabela, e o Firestore      │
 * │                    recusa a leitura. Uma mensagem de erro genérica    │
 * │                    onde deveria estar a lista.                        │
 * │  · só nas regras → o Firestore libera, mas a interface diz "esta      │
 * │                    conta não tem acesso". Parece falta de permissão   │
 * │                    quando a permissão está lá.                       │
 * │                                                                       │
 * │  Nenhum teste de navegador pega isso sem uma conta Google de          │
 * │  verdade. Comparar os dois arquivos, pega.                            │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('sincronia entre config/admin.ts e firestore.rules', () => {
  it('todo uid das regras é reconhecido pela interface', () => {
    for (const uid of uidsDeclaradosNasRegras()) {
      expect(
        isAdmin(uid),
        `O uid ${uid} está em firestore.rules mas não em ADMIN_UIDS: o Firestore libera a leitura e a interface diz que a conta não tem acesso.`,
      ).toBe(true);
    }
  });

  it('nenhum uid da interface falta nas regras', () => {
    /*
      O caminho inverso. Não há como listar ADMIN_UIDS de fora do módulo — é
      privado de propósito —, então a verificação é por amostragem do próprio
      arquivo: todo literal de UID em admin.ts precisa estar nas regras.
    */
    const fonte = readFileSync(path.resolve(__dirname, 'admin.ts'), 'utf8');
    const lista = fonte.match(/ADMIN_UIDS[^=]*=\s*\[([\s\S]*?)\]/)?.[1] ?? '';
    const noCodigo = [...lista.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    const nasRegras = uidsDeclaradosNasRegras();

    expect(noCodigo.length).toBeGreaterThan(0);
    for (const uid of noCodigo) {
      expect(
        nasRegras,
        `O uid ${uid} está em ADMIN_UIDS mas não em firestore.rules: o painel abre e o Firestore recusa a leitura.`,
      ).toContain(uid);
    }
  });
});
