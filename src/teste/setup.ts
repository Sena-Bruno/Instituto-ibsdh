import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Preparação comum a todos os testes.
 *
 * `cleanup` desmonta o que ficou renderizado depois de cada teste. Sem ele
 * os componentes acumulam no mesmo documento e uma busca por texto passa a
 * encontrar dois resultados — o teste falha por motivo que não é o dele.
 */
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * `matchMedia` não existe no jsdom, e o Motion consulta
 * `prefers-reduced-motion` ao montar. Sem esta reserva, todo componente com
 * animação estoura antes de renderizar — o que aqui seria a maior parte
 * deles.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
