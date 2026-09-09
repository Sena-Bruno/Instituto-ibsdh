import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import notificarLead, { diagnostico } from '../functions/notificar-lead.mjs';

const pastaDeFuncoes = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../functions',
);

/**
 * Guarda a regra de nome do Netlify.
 *
 * O deploy do PR #18 falhou inteiro — não o teste, o DEPLOY — porque este
 * arquivo de teste nasceu dentro de `netlify/functions/`. O Netlify trata
 * todo .mjs de lá como função serverless, e nome de função aceita apenas
 * letras, números, hífen e sublinhado. O ponto de `.test.mjs` bastou:
 *
 *   Incorrect function names. Name should consist of only alphanumeric
 *   characters, hyphen & underscores
 *
 * Nada no repositório dizia isso, e todos os verificadores locais passavam:
 * tipos, lint, Knip, arquitetura, 72 testes e o build. A restrição só existia
 * no Netlify, e só apareceu depois do push.
 *
 * Agora existe aqui.
 */
describe('nomes dos arquivos em netlify/functions', () => {
  it('só usam letras, números, hífen e sublinhado', () => {
    for (const arquivo of readdirSync(pastaDeFuncoes)) {
      const semExtensao = arquivo.replace(/\.(mjs|js|ts)$/, '');
      expect(
        semExtensao,
        `"${arquivo}" viraria uma função de nome inválido e o Netlify recusaria o deploy inteiro. ` +
          'Se for teste ou utilitário, mova para netlify/testes/.',
      ).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });
});

/**
 * Testes do diagnóstico de falha no aviso de lead.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  ESTE ARQUIVO NÃO PODE MORAR EM netlify/functions/                 │
 * │                                                                       │
 * │  O Netlify trata TODO arquivo .mjs dentro da pasta declarada em        │
 * │  `functions` (netlify.toml) como uma função serverless, e o nome de    │
 * │  função só aceita letras, números, hífen e sublinhado. O ponto de      │
 * │  `notificar-lead.test.mjs` faz o deploy inteiro falhar com            │
 * │  "Incorrect function names" — não é um aviso: o site não publica.      │
 * │                                                                       │
 * │  Descoberto do jeito difícil, com o deploy de preview do PR #18        │
 * │  quebrado enquanto os testes passavam em toda parte. Por isso os       │
 * │  testes das funções ficam nesta pasta vizinha, fora do alcance do      │
 * │  scanner.                                                             │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O CASO REAL QUE ESTES TESTES DESCREVEM                                │
 * │                                                                       │
 * │  A função respondia 502 sem explicação, e o aviso de novo cadastro     │
 * │  simplesmente não chegava. O motivo, encontrado nas variáveis de       │
 * │  ambiente do Netlify: `NOTIFY_FROM` estava como                        │
 * │  `onboarding@resend.dev`, que é o remetente de teste do Resend e só    │
 * │  entrega para o e-mail dono da conta — enquanto o destinatário era o   │
 * │  contato do instituto. O Resend recusa isso com 403.                   │
 * │                                                                       │
 * │  Levou uma inspeção manual da configuração para descobrir. O objetivo  │
 * │  daqui em diante é que a própria linha de log diga a causa e a saída.  │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('diagnostico', () => {
  const contato = 'contato@institutobrunosena.com.br';

  it('reconhece o remetente de teste do Resend e diz as duas saídas', () => {
    const msg = diagnostico(
      403,
      'You can only send testing emails to your own email address',
      'onboarding@resend.dev',
      contato,
    );
    expect(msg).toContain('endereço de teste do Resend');
    expect(msg).toContain('NOTIFY_FROM');
    expect(msg).toContain('NOTIFY_EMAIL');
    // Diz para onde estava tentando entregar: sem isso, quem lê o log não
    // sabe qual dos dois lados precisa mudar.
    expect(msg).toContain(contato);
  });

  it('reconhece o remetente de teste mesmo sem a mensagem do Resend', () => {
    /*
      O texto do erro é do Resend e pode mudar sem aviso. O sufixo
      `@resend.dev` no remetente é evidência suficiente e não depende de
      redação de terceiro.
    */
    const msg = diagnostico(403, 'Forbidden', 'onboarding@resend.dev', contato);
    expect(msg).toContain('endereço de teste do Resend');
  });

  it('aponta a chave quando é 401 com remetente próprio', () => {
    const msg = diagnostico(
      401,
      'Invalid API key',
      'avisos@institutobrunosena.com.br',
      contato,
    );
    expect(msg).toContain('RESEND_API_KEY');
    expect(msg).toContain('Resend → API Keys');
  });

  it('aponta o domínio quando é 403 com remetente próprio não verificado', () => {
    const msg = diagnostico(
      403,
      'Domain not found',
      'avisos@institutobrunosena.com.br',
      contato,
    );
    expect(msg).toContain('Domains');
    expect(msg).not.toContain('RESEND_API_KEY');
  });

  it('distingue dados inválidos, limite e falha do próprio Resend', () => {
    expect(diagnostico(422, '', 'a@b.com', contato)).toContain('NOTIFY_FROM');
    expect(diagnostico(429, '', 'a@b.com', contato)).toContain('Limite');
    expect(diagnostico(500, '', 'a@b.com', contato)).toContain('do lado do Resend');
    expect(diagnostico(503, '', 'a@b.com', contato)).toContain('do lado do Resend');
  });

  it('não deixa status desconhecido sem mensagem', () => {
    /* Log com causa vazia é pior que log sem causa: parece que o campo foi
       preenchido e não foi. */
    const msg = diagnostico(418, '', 'a@b.com', contato);
    expect(msg.length).toBeGreaterThan(10);
  });

  it('nunca inclui a chave da API na mensagem', () => {
    /*
      A mensagem vai para o log do Netlify, que é lido por quem tem acesso ao
      painel — mas log é copiado, colado em chamado e anexado a print. A causa
      cita o NOME da variável, nunca o valor.
    */
    for (const status of [401, 403, 422, 429, 500, 418]) {
      const msg = diagnostico(status, 're_chave_secreta_zyA7', 'a@b.com', contato);
      expect(msg).not.toContain('re_chave_secreta');
      expect(msg).not.toContain('zyA7');
    }
  });
});

/**
 * Testes da validação do pedido.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTA FUNÇÃO PRECISA GARANTIR                                   │
 * │                                                                       │
 * │  Ela é um endereço público que manda e-mail. Duas coisas, portanto,    │
 * │  não podem depender de quem chama:                                     │
 * │                                                                       │
 * │   · PARA QUEM vai — é sempre NOTIFY_EMAIL, nunca um campo do pedido,   │
 * │     senão o site vira relé de spam de terceiros;                       │
 * │   · O QUE ESTÁ ESCRITO no assunto — sai em nome do instituto, então    │
 * │     vem de uma tabela fechada aqui dentro.                            │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('notificar-lead', () => {
  const pedido = (corpo) =>
    new Request('https://exemplo/.netlify/functions/notificar-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });

  const leadValido = {
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    tipo: 'material',
    referencia: 'sete-perguntas',
    origem: '/artigos/o-que-e-pnl',
  };

  /** O corpo JSON que a função mandou para o Resend na última chamada. */
  const enviado = () => JSON.parse(globalThis.fetch.mock.calls[0][1].body);

  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_chave_de_teste';
    process.env.NOTIFY_FROM = 'avisos@institutobrunosena.com.br';
    process.env.NOTIFY_EMAIL = 'bruno@exemplo.com';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));
  });

  afterEach(() => {
    process.env.RESEND_API_KEY = undefined;
    process.env.NOTIFY_FROM = undefined;
    process.env.NOTIFY_EMAIL = undefined;
    vi.unstubAllGlobals();
  });

  it('manda o aviso do material com a origem no corpo', async () => {
    const res = await notificarLead(pedido(leadValido));

    expect(res.status).toBe(204);
    const email = enviado();
    expect(email.to).toBe('bruno@exemplo.com');
    expect(email.subject).toContain('material');
    expect(email.subject).toContain('sete-perguntas');
    // A origem é o dado que diz QUAL artigo trouxe o lead.
    expect(email.html).toContain('/artigos/o-que-e-pnl');
    // `reply_to` no lead: responder ao aviso responde à pessoa.
    expect(email.reply_to).toBe('maria@exemplo.com');
  });

  it('não escreve a linha de origem quando não há origem', async () => {
    await notificarLead(
      pedido({
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        tipo: 'lista-de-espera',
        referencia: 'master-coach',
      }),
    );

    const email = enviado();
    expect(email.subject).toContain('lista de espera');
    expect(email.html).not.toContain('Veio de');
    expect(email.html).toContain('Curso');
  });

  it('recusa um tipo que não está na tabela', async () => {
    const res = await notificarLead(pedido({ ...leadValido, tipo: 'promocao' }));

    expect(res.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('recusa "constructor" como tipo', async () => {
    /*
      A guarda era `ASSUNTOS[tipo] ? tipo : ''`, e `ASSUNTOS['constructor']`
      é verdadeiro em qualquer objeto — a propriedade vem herdada de
      Object.prototype. O pedido passava, e o e-mail saía com "undefined"
      no assunto e no corpo. Agora a checagem é `Object.hasOwn`.
    */
    const res = await notificarLead(pedido({ ...leadValido, tipo: 'constructor' }));

    expect(res.status).toBe(400);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('recusa e-mail malformado e campos vazios', async () => {
    for (const invalido of [
      { ...leadValido, email: 'maria@exemplo' },
      { ...leadValido, name: '   ' },
      { ...leadValido, referencia: '' },
    ]) {
      expect((await notificarLead(pedido(invalido))).status).toBe(400);
    }
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('nunca manda para um destinatário vindo do pedido', async () => {
    /* Sem isto, o endpoint seria um relé aberto: qualquer pessoa poderia
       mandar e-mail em nome do instituto para quem quisesse. */
    await notificarLead(pedido({ ...leadValido, to: 'vitima@exemplo.com' }));

    const email = enviado();
    expect(email.to).toBe('bruno@exemplo.com');
    expect(JSON.stringify(email)).not.toContain('vitima@exemplo.com');
  });

  it('responde 204 sem fazer nada quando o Resend não está configurado', async () => {
    process.env.RESEND_API_KEY = '';
    const res = await notificarLead(pedido(leadValido));

    expect(res.status).toBe(204);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('recusa método que não seja POST', async () => {
    const res = await notificarLead(
      new Request('https://exemplo/.netlify/functions/notificar-lead'),
    );
    expect(res.status).toBe(405);
  });
});
