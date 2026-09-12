import { beforeEach, describe, expect, it } from 'vitest';
import { campanhaDaVisita, montarCampanha, registrarCampanha } from './campanha';

/**
 * Testes da etiqueta de campanha.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTE ARQUIVO, ENTRE TODOS                                    │
 * │                                                                       │
 * │  Porque a falha aqui é INVISÍVEL. Um formulário quebrado dá erro na   │
 * │  tela; uma etiqueta que se perde não dá sinal nenhum — o cadastro     │
 * │  entra normalmente, só que sem dizer de onde veio. Ninguém descobre   │
 * │  isso olhando o site: descobre-se meses depois, ao tentar comparar    │
 * │  duas campanhas e achar a coluna vazia.                               │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('montarCampanha', () => {
  it('monta a forma legível com as três etiquetas principais', () => {
    expect(montarCampanha('?utm_source=instagram&utm_medium=cpc&utm_campaign=setembro')).toBe(
      'instagram / cpc / setembro',
    );
  });

  it('acrescenta a arte quando ela vem', () => {
    expect(
      montarCampanha(
        '?utm_source=instagram&utm_medium=cpc&utm_campaign=setembro&utm_content=v2',
      ),
    ).toBe('instagram / cpc / setembro / v2');
  });

  it('reserva a posição do que faltou, para as colunas não escorregarem', () => {
    /* Sem o traço, `instagram / setembro` seria lido como origem e MEIO —
       e a campanha inteira apareceria no relatório como um tipo de mídia. */
    expect(montarCampanha('?utm_source=instagram&utm_campaign=setembro')).toBe(
      'instagram / - / setembro',
    );
  });

  it('devolve undefined para quem chegou sem campanha', () => {
    // Acesso direto, busca do Google, link sem etiqueta.
    expect(montarCampanha('')).toBeUndefined();
    expect(montarCampanha('?fbclid=abc123')).toBeUndefined();
  });

  it('não deixa um valor partir a string em pedaços a mais', () => {
    /* Uma barra dentro do próprio valor desalinharia tudo o que vem
       depois, e a coluna "campanha" do CSV passaria a mentir. */
    expect(montarCampanha('?utm_source=insta/stories&utm_medium=cpc&utm_campaign=x')).toBe(
      'insta stories / cpc / x',
    );
  });

  it('corta no limite que as regras do Firestore aceitam', () => {
    /* Acima de 200 caracteres o Firestore recusa o DOCUMENTO INTEIRO, e o
       lead se perderia por causa de uma etiqueta comprida. O corte tem de
       acontecer antes da gravação. */
    const gigante = montarCampanha(`?utm_source=${'a'.repeat(500)}&utm_medium=cpc`);
    expect(gigante?.length).toBeLessThanOrEqual(200);
  });
});

describe('registrarCampanha', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('guarda a etiqueta da URL de entrada e a devolve depois da navegação', () => {
    window.history.replaceState(
      {},
      '',
      '/artigos/o-que-e-pnl?utm_source=instagram&utm_medium=bio',
    );
    registrarCampanha();

    // A pessoa navega, e a URL com etiqueta deixa de existir.
    window.history.replaceState({}, '', '/pnl-practitioner');

    expect(campanhaDaVisita()).toBe('instagram / bio / -');
  });

  it('o primeiro toque vence', () => {
    /* Quem chegou pelo anúncio chegou pelo anúncio, mesmo que depois passe
       por um link com outra etiqueta — senão a última página visitada
       levaria o crédito da campanha que pagou pela visita. */
    window.history.replaceState({}, '', '/?utm_source=instagram&utm_medium=cpc');
    registrarCampanha();

    window.history.replaceState({}, '', '/?utm_source=newsletter&utm_medium=email');
    registrarCampanha();

    expect(campanhaDaVisita()).toBe('instagram / cpc / -');
  });

  it('não inventa campanha para quem entrou direto', () => {
    registrarCampanha();
    expect(campanhaDaVisita()).toBeUndefined();
  });

  it('lê da URL mesmo sem ter passado pelo registro', () => {
    // Quem preenche o formulário antes de o arranque terminar continua
    // atribuído à campanha que o trouxe.
    window.history.replaceState({}, '', '/?utm_source=whatsapp&utm_medium=lista');
    expect(campanhaDaVisita()).toBe('whatsapp / lista / -');
  });
});
