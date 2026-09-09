import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDelayedFlag } from './useDelayedFlag';

/**
 * O atraso é o ponto todo deste hook: ele existe para que um indicador de
 * carregamento não pisque numa conexão boa, onde a resposta chega antes de
 * a espera ser percebida como demora. Um teste que só verificasse "devolve
 * true quando ativo" passaria com o atraso removido — e removê-lo é
 * justamente a regressão que apaga o motivo do hook existir.
 */
describe('useDelayedFlag', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('começa falso mesmo com a condição verdadeira', () => {
    const { result } = renderHook(() => useDelayedFlag(true));
    expect(result.current).toBe(false);
  });

  it('vira verdadeiro depois do atraso', () => {
    const { result } = renderHook(() => useDelayedFlag(true));
    act(() => vi.advanceTimersByTime(219));
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(true);
  });

  it('não vira verdadeiro se a condição cair antes do atraso', () => {
    const { result, rerender } = renderHook(({ ativo }) => useDelayedFlag(ativo), {
      initialProps: { ativo: true },
    });
    act(() => vi.advanceTimersByTime(150));
    rerender({ ativo: false });
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(false);
  });

  it('volta a falso quando a condição cai depois de já estar visível', () => {
    const { result, rerender } = renderHook(({ ativo }) => useDelayedFlag(ativo), {
      initialProps: { ativo: true },
    });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe(true);
    rerender({ ativo: false });
    expect(result.current).toBe(false);
  });

  it('aceita outro atraso', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 50));
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe(true);
  });

  /*
    Sem o `clearTimeout` no cleanup, um componente desmontado durante a
    espera dispara `setShow` sobre estado que não existe mais. O React 19
    não avisa mais em console, então isso passaria calado.

    ⚠ A ORDEM DAS DUAS LINHAS É O TESTE. A primeira versão avançava 500ms
    antes de contar os timers — e aí o timer de 220ms já havia disparado e
    saído da fila sozinho, então a contagem dava zero com ou sem
    `clearTimeout`. O teste passava com o cleanup removido, o que o
    `npm run mutation` mostrou: o mutante que troca o cleanup por
    `() => undefined` sobrevivia. Contar ANTES de avançar é o que pega.
  */
  it('cancela o timer ao desmontar', () => {
    const { unmount } = renderHook(() => useDelayedFlag(true));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  /*
    A lista de dependências do efeito. Com `[]` no lugar de
    `[active, delayMs]`, o efeito não roda de novo quando a condição muda: o
    indicador que apareceu uma vez nunca mais some, e o atraso passa a valer
    só para a primeira vez. Trocar o `delayMs` no meio do caminho é o que
    distingue as duas listas.
  */
  it('refaz a espera quando o atraso muda', () => {
    const { result, rerender } = renderHook(({ ms }) => useDelayedFlag(true, ms), {
      initialProps: { ms: 1000 },
    });
    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe(false);

    rerender({ ms: 100 });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(true);
  });
});
