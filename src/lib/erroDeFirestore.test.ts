import { describe, expect, it } from 'vitest';
import { site } from '../config/site';
import { diagnosticoDeGravacao, mensagemDeGravacao } from './erroDeFirestore';

/** Um erro do Firestore tem `code`; um erro de rede cru, não. */
const comCodigo = (code: string) => Object.assign(new Error(code), { code });

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O CASO REAL QUE ESTES TESTES DESCREVEM                                │
 * │                                                                       │
 * │  A captação de material entrou no ar e recusava TODO cadastro com      │
 * │  "Não conseguimos registrar seu e-mail. Verifique sua conexão."        │
 * │  A conexão estava perfeita: a coleção `leads` era nova e as regras     │
 * │  dela nunca haviam sido publicadas — `firebase deploy` é um passo à    │
 * │  parte, que o deploy do site não faz.                                  │
 * │                                                                       │
 * │  A mensagem mandava conferir a única coisa que estava certa. O que se  │
 * │  guarda aqui é que ela pare de fazer isso.                            │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('mensagemDeGravacao', () => {
  it('só manda conferir a conexão quando a conexão é o problema', () => {
    for (const code of ['unavailable', 'deadline-exceeded', 'cancelled']) {
      expect(mensagemDeGravacao(comCodigo(code), 'seu cadastro')).toMatch(/conexão/i);
    }
  });

  it('NÃO culpa a conexão quando o servidor respondeu e recusou', () => {
    /* O bug inteiro numa linha: `permission-denied` significa que o
       servidor foi alcançado e disse não. Mandar conferir a conexão manda
       a pessoa procurar o problema no lugar em que ele não está. */
    const msg = mensagemDeGravacao(comCodigo('permission-denied'), 'seu pedido');
    expect(msg).not.toMatch(/conexão/i);
    expect(msg).toMatch(/do nosso lado/i);
  });

  it('dá uma saída para o cadastro não se perder', () => {
    /* Sem o e-mail do instituto na mensagem, um defeito de configuração
       vira lead perdido em silêncio — que é exatamente o que aconteceu. */
    const msg = mensagemDeGravacao(comCodigo('permission-denied'), 'seu pedido');
    expect(msg).toContain(site.email.contact);
  });

  it('usa o assunto de quem chamou', () => {
    expect(mensagemDeGravacao(comCodigo('internal'), 'seu cadastro')).toContain('seu cadastro');
    expect(mensagemDeGravacao(comCodigo('internal'), 'seu pedido')).toContain('seu pedido');
  });

  it('nunca fala de coleção, regra ou comando com o visitante', () => {
    /* A tela é lida por quem preencheu o formulário. Nome de coleção e
       linha de terminal ali são ruído sobre um problema que não é dele —
       e, no caso de "firestore.rules", contam de que jeito o banco está
       organizado. Isso vive no console. */
    for (const code of ['permission-denied', 'unavailable', 'not-found', 'internal']) {
      const msg = mensagemDeGravacao(comCodigo(code), 'seu cadastro');
      expect(msg).not.toMatch(/firestore|firebase deploy|regras|leads|waitlist/i);
    }
  });

  it('trata um erro sem código, que é o que a rede solta', () => {
    const msg = mensagemDeGravacao(new Error('Failed to fetch'), 'seu cadastro');
    expect(msg.length).toBeGreaterThan(20);
  });
});

describe('diagnosticoDeGravacao', () => {
  it('aponta a regra não publicada como primeira causa de permission-denied', () => {
    const msg = diagnosticoDeGravacao(comCodigo('permission-denied'), 'leads');
    expect(msg).toContain('leads');
    // O comando que conserta, escrito na linha do erro.
    expect(msg).toContain('firebase deploy --only firestore:rules');
    // E o aviso de que publicar não vem junto com o deploy do site.
    expect(msg).toMatch(/à PARTE|Netlify/);
  });

  it('cita a validação como segunda causa, e não só a publicação', () => {
    /* Com as regras publicadas, o mesmo código significa outra coisa: o
       documento não passou no isValid… — campo a mais, campo faltando,
       tamanho fora do limite. Um diagnóstico que só falasse de publicação
       mandaria procurar duas vezes no lugar errado. */
    const msg = diagnosticoDeGravacao(comCodigo('permission-denied'), 'leads');
    expect(msg).toMatch(/validação/i);
    expect(msg).toMatch(/campo/i);
  });

  it('reconhece o banco errado, que falha em silêncio', () => {
    const msg = diagnosticoDeGravacao(comCodigo('not-found'), 'leads');
    expect(msg).toContain('firestoreDatabaseId');
  });

  it('distingue rede de recusa', () => {
    expect(diagnosticoDeGravacao(comCodigo('unavailable'), 'leads')).toMatch(/rede|alcançar/i);
    expect(diagnosticoDeGravacao(comCodigo('unavailable'), 'leads')).not.toContain(
      'firebase deploy',
    );
  });

  it('nomeia a coleção mesmo num código desconhecido', () => {
    /* Log com causa vazia é pior que log sem causa. O mínimo é dizer onde
       procurar. */
    const msg = diagnosticoDeGravacao(comCodigo('algo-novo'), 'course_reviews');
    expect(msg).toContain('course_reviews');
    expect(msg).toContain('algo-novo');
  });

  it('entende o código com prefixo do SDK', () => {
    /* Dependendo de onde o erro é criado, o SDK escreve `permission-denied`
       ou `firestore/permission-denied`. Os dois são o mesmo problema. */
    expect(diagnosticoDeGravacao(comCodigo('firestore/permission-denied'), 'leads')).toContain(
      'firebase deploy --only firestore:rules',
    );
  });
});
