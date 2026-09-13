import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { courses, listaCursos } from '../config/courses';
import { classificarDestino } from './medir';

/**
 * Testes da classificação de destino.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTES TESTES GUARDAM                                           │
 * │                                                                       │
 * │  A medição de conversão do site inteiro depende de reconhecer três    │
 * │  endereços: o checkout da Kiwify, o WhatsApp e o `mailto:`. Não há    │
 * │  nenhum código de rastreio colado nos botões — eles são quinze, e     │
 * │  marcá-los um a um garantiria esquecer o décimo sexto.                │
 * │                                                                       │
 * │  O preço dessa escolha é que a medição passa a depender de uma        │
 * │  função pura, e uma quebra nela é silenciosa: os botões continuam     │
 * │  funcionando, as vendas continuam acontecendo, e o relatório          │
 * │  simplesmente mostra zero. É exatamente o tipo de falha que só um     │
 * │  teste pega.                                                          │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('classificarDestino', () => {
  it('reconhece o checkout e devolve o curso, o valor e a moeda', () => {
    const r = classificarDestino(courses.pnlPractitioner.checkout);

    expect(r?.nome).toBe('begin_checkout');
    expect(r?.parametros).toMatchObject({
      curso: 'pnl',
      item_name: 'PNL Practitioner',
      currency: 'BRL',
    });
    /* O valor sai do catálogo, não do botão: é o mesmo preço que o JSON-LD
       anuncia ao Google, lido pela mesma função. */
    expect(r?.parametros.value).toBe(297);
  });

  it('reconhece todo checkout do catálogo, e não só o primeiro', () => {
    /* O dia em que um combo ganhar link de pagamento, ele precisa ser
       medido sem que ninguém se lembre de vir aqui. */
    const comCheckout = listaCursos.filter((c) => c.checkout);
    expect(comCheckout.length).toBeGreaterThan(1);

    for (const curso of comCheckout) {
      expect(classificarDestino(curso.checkout as string)?.parametros.curso).toBe(curso.id);
    }
  });

  it('reconhece o WhatsApp com a mensagem já preenchida', () => {
    const r = classificarDestino('https://wa.me/5511987355750?text=Ol%C3%A1');
    expect(r?.nome).toBe('clique_whatsapp');
  });

  it('reconhece o mailto e guarda o endereço sem o assunto', () => {
    const r = classificarDestino('mailto:contato@institutobrunosena.com.br?subject=Proposta');
    expect(r?.nome).toBe('clique_email');
    expect(r?.parametros.destino).toBe('contato@institutobrunosena.com.br');
  });

  it('ignora link interno: navegar não é conversão', () => {
    /* A troca de rota já é contada como página vista, em Medicao.tsx.
       Classificá-la aqui também contaria cada navegação duas vezes. */
    expect(classificarDestino('/pnl-practitioner')).toBeUndefined();
    expect(classificarDestino('#cursos')).toBeUndefined();
    expect(classificarDestino('')).toBeUndefined();
  });

  it('registra saída para domínio de terceiro sem fingir que é venda', () => {
    const r = classificarDestino('https://www.instagram.com/brunosenaoficial/');
    expect(r?.nome).toBe('clique_externo');
    expect(r?.parametros.destino).toBe('www.instagram.com');
  });

  it('não estoura com endereço malformado', () => {
    // Um href inválido no HTML não pode derrubar o ouvinte de cliques do
    // site inteiro — que é o que um throw aqui faria.
    expect(() => classificarDestino('http://[inválido')).not.toThrow();
  });
});

/**
 * O caminho completo, com a medição LIGADA.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO PRECISA DE TESTE PRÓPRIO                                │
 * │                                                                       │
 * │  `classificarDestino` ser correta não garante nada sozinha: entre     │
 * │  ela e o relatório estão o ouvinte no documento, a fila do Google e   │
 * │  o adiamento do gtag.js. Qualquer um dos três quebrado produz o mesmo │
 * │  sintoma — um site que funciona perfeitamente e não mede nada.        │
 * │                                                                       │
 * │  `VITE_GA4_ID` é lido no topo do módulo, então ligar a medição exige  │
 * │  reimportá-lo com a variável já definida.                             │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('medição ligada', () => {
  /** Os argumentos de cada chamada empilhada na fila do Google. */
  const fila = () => (window.dataLayer ?? []).map((a) => Array.from(a as ArrayLike<unknown>));

  /** As chamadas `gtag('event', nome, parâmetros)` com este nome. */
  const eventos = (nome: string) =>
    fila().filter((c) => c[0] === 'event' && c[1] === nome) as [string, string, ...unknown[]][];

  async function ligar() {
    vi.stubEnv('VITE_GA4_ID', 'G-TESTE');
    vi.resetModules();
    window.dataLayer = undefined;
    const modulo = await import('./medir');
    modulo.iniciarMedicao();
    return modulo;
  }

  /* O jsdom não navega, e reclama em toda tentativa. O `preventDefault` é
     de BOLHA: o ouvinte do site é de captura e já rodou quando este corre,
     então o que se testa continua sendo o caminho real. */
  const segurar = (e: Event) => e.preventDefault();
  beforeEach(() => document.addEventListener('click', segurar));

  afterEach(() => {
    document.removeEventListener('click', segurar);
    vi.unstubAllEnvs();
    for (const s of document.querySelectorAll('script[src*="googletagmanager"]')) s.remove();
    window.dataLayer = undefined;
  });

  it('abre a fila com js e config antes de qualquer evento', async () => {
    await ligar();

    expect(fila()[0][0]).toBe('js');
    expect(fila()[1].slice(0, 2)).toEqual(['config', 'G-TESTE']);
    /* Sem `anonymize_ip`, o IP do visitante acompanharia cada evento até o
       Google — num site que também guarda nome e e-mail, é a linha que o
       `sentry.ts` já traça com `sendDefaultPii: false`. */
    expect(fila()[1][2]).toMatchObject({ anonymize_ip: true });
  });

  it('NÃO baixa o gtag.js só por ter sido iniciado', async () => {
    /* O script pesa mais de 100 kB. Baixá-lo junto com a página cobraria
       isso de toda visita, inclusive da que abandona em dois segundos. */
    await ligar();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('baixa o gtag.js na primeira interação de verdade', async () => {
    await ligar();
    window.dispatchEvent(new Event('pointerdown'));

    const script = document.querySelector('script[src*="googletagmanager"]');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toContain('id=G-TESTE');
    expect((script as HTMLScriptElement).async).toBe(true);
  });

  it('busca o script uma vez só, por mais que a pessoa interaja', async () => {
    await ligar();
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('keydown'));

    expect(document.querySelectorAll('script[src*="googletagmanager"]')).toHaveLength(1);
  });

  it('enfileira o evento mesmo com o gtag.js ainda a caminho', async () => {
    /* É a razão de a fila existir: o Google processa o acumulado quando o
       script chega. Sem ela, tudo o que acontecesse nos primeiros segundos
       — que é quando as decisões acontecem — se perderia. */
    const { evento } = await ligar();
    evento('generate_lead', { formulario: 'material', referencia: 'sete-perguntas' });

    expect(eventos('generate_lead')[0][2]).toEqual({
      formulario: 'material',
      referencia: 'sete-perguntas',
    });
  });

  it('não manda parâmetro vazio, que vira "(not set)" no relatório', async () => {
    const { evento } = await ligar();
    evento('generate_lead', { formulario: 'material', campanha: undefined, origem: '' });

    expect(eventos('generate_lead')[0][2]).toEqual({ formulario: 'material' });
  });

  it('mede o clique no checkout sem nenhuma marca no botão', async () => {
    /*
      O teste que guarda a decisão de arquitetura: os botões de compra
      estão em quinze pontos do site e NENHUM tem código de medição. Quem
      acrescentar o décimo sexto amanhã é medido sem saber que isto
      existe — e este é o teste que garante que continua assim.
    */
    await ligar();

    const link = document.createElement('a');
    link.href = courses.pnlPractitioner.checkout as string;
    link.textContent = 'Garantir minha vaga';
    document.body.appendChild(link);
    window.dataLayer = [];
    link.click();

    const compra = eventos('begin_checkout');
    expect(compra.length).toBeGreaterThan(0);
    expect(compra[0][2]).toMatchObject({
      curso: 'pnl',
      value: 297,
      currency: 'BRL',
      // De onde o clique partiu: é o que diz qual página vende.
      origem: '/',
    });

    link.remove();
  });

  it('mede o clique que parte de dentro do botão, e não só no <a>', async () => {
    /* Os botões do site têm ícone e texto dentro do link. O clique nasce
       no <span>, não no <a> — sem o `closest`, a conversão mais comum do
       site não seria contada. */
    await ligar();

    const link = document.createElement('a');
    link.href = 'https://wa.me/5511987355750?text=Ol%C3%A1';
    link.innerHTML = '<span>Falar no WhatsApp</span>';
    document.body.appendChild(link);
    window.dataLayer = [];
    (link.querySelector('span') as HTMLElement).click();

    expect(eventos('clique_whatsapp').length).toBeGreaterThan(0);

    link.remove();
  });

  it('ignora o clique que não vai a lugar nenhum', async () => {
    await ligar();

    const link = document.createElement('a');
    link.href = '#cursos';
    document.body.appendChild(link);
    window.dataLayer = [];
    link.click();

    expect(fila().filter((c) => c[0] === 'event')).toHaveLength(0);

    link.remove();
  });
});
