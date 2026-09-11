import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConvite } from './useConvite';

/**
 * Testes do gatilho do convite.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTE ARQUIVO PROTEGE                                           │
 * │                                                                       │
 * │  A regra de interstício intrusivo do Google rebaixa página cujo        │
 * │  conteúdo é coberto assim que a pessoa chega da busca. Os sete artigos │
 * │  do site existem justamente para trazer gente da busca orgânica.       │
 * │                                                                       │
 * │  "O convite não abre na chegada" é a linha que separa uma captação     │
 * │  boa de uma perda de posição. E é uma linha invisível no código: um    │
 * │  `setAberto(true)` no corpo do efeito passa em qualquer revisão e      │
 * │  cobra a conta semanas depois, em ranking, sem nada na tela ligando    │
 * │  uma coisa à outra.                                                   │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('useConvite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    // Uma página alta o bastante para haver rolagem de verdade.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    });
    window.innerWidth = 1280;
    window.innerHeight = 800;
    window.scrollY = 0;
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('NÃO abre na chegada', () => {
    const { result } = renderHook(() => useConvite(true));
    expect(result.current.aberto).toBe(false);

    // Nem depois de um instante: o robô do Google não espera 40 segundos.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.aberto).toBe(false);
  });

  it('abre depois de rolar metade da página', () => {
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      window.scrollY = 1200; // 1200 / (3000 - 800) = 54%
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.aberto).toBe(true);
  });

  it('não abre com uma rolagem curta', () => {
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      window.scrollY = 300; // 14%
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.aberto).toBe(false);
  });

  it('abre depois de 40 segundos, para quem não rola', () => {
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      vi.advanceTimersByTime(39_000);
    });
    expect(result.current.aberto).toBe(false);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.aberto).toBe(true);
  });

  it('abre quando o cursor sai pelo topo, no desktop', () => {
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      const evento = new MouseEvent('mouseout', { clientY: 0, bubbles: true });
      document.dispatchEvent(evento);
    });
    expect(result.current.aberto).toBe(true);
  });

  it('não arma a intenção de sair em tela de toque', () => {
    /* Em touch o mouseout dispara ao rolar com o dedo, e o convite abriria
       na primeira rolagem — exatamente o comportamento que o gatilho existe
       para evitar, e no aparelho em que o Google mede. */
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseout', { clientY: 0, bubbles: true }));
    });
    expect(result.current.aberto).toBe(false);
  });

  it('não abre onde está desabilitado', () => {
    const { result } = renderHook(() => useConvite(false));

    act(() => {
      window.scrollY = 2000;
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.aberto).toBe(false);
  });

  it('abre uma vez só por carregamento', () => {
    const { result } = renderHook(() => useConvite(true));

    act(() => {
      vi.advanceTimersByTime(41_000);
    });
    expect(result.current.aberto).toBe(true);

    act(() => result.current.fechar());
    expect(result.current.aberto).toBe(false);

    // Voltar a rolar não reabre. Insistir é o que faz fechar a aba.
    act(() => {
      window.scrollY = 2000;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.aberto).toBe(false);
  });

  it('fica 30 dias calado depois de dispensado', () => {
    const primeiro = renderHook(() => useConvite(true));
    act(() => {
      vi.advanceTimersByTime(41_000);
    });
    act(() => primeiro.result.current.fechar());

    // Uma visita nova, logo depois.
    const segundo = renderHook(() => useConvite(true));
    act(() => {
      vi.advanceTimersByTime(41_000);
    });
    expect(segundo.result.current.aberto).toBe(false);

    // E outra, passados os 30 dias.
    vi.setSystemTime(Date.now() + 31 * 24 * 60 * 60 * 1000);
    const terceiro = renderHook(() => useConvite(true));
    act(() => {
      vi.advanceTimersByTime(41_000);
    });
    expect(terceiro.result.current.aberto).toBe(true);
  });

  it('nunca mais volta para quem já deixou o contato', () => {
    const primeiro = renderHook(() => useConvite(true));
    act(() => primeiro.result.current.aoConverter());

    vi.setSystemTime(Date.now() + 400 * 24 * 60 * 60 * 1000);
    const depois = renderHook(() => useConvite(true));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(depois.result.current.aberto).toBe(false);
  });

  it('sobrevive a um localStorage que lança exceção', () => {
    /* Modo restrito do Safari e algumas extensões de privacidade não
       devolvem null: elas lançam. Sem o try, o convite derrubaria a página
       inteira, que é um preço absurdo por uma caixa de captação. */
    const quebrado = () => {
      throw new Error('bloqueado');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(quebrado);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quebrado);

    const { result } = renderHook(() => useConvite(true));
    act(() => {
      vi.advanceTimersByTime(41_000);
    });
    expect(result.current.aberto).toBe(true);
    expect(() => act(() => result.current.fechar())).not.toThrow();
  });
});
