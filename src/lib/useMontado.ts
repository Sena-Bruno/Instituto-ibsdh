import { useEffect, useState } from 'react';

/**
 * `false` no servidor e na primeira pintura do cliente; `true` depois.
 *
 * É o interruptor que separa o que o Googlebot lê do que só existe com
 * navegador. O site é pré-renderizado em HTML estático no build, e a
 * primeira renderização do cliente precisa produzir exatamente a mesma
 * árvore, senão a hidratação descarta o HTML que veio do servidor — que
 * é justamente o HTML que o robô indexou.
 *
 * Serve, portanto, para adiar blocos que dependem de SDK de navegador
 * (Firebase) sem quebrar essa igualdade: servidor e primeira pintura
 * mostram a reserva, e o bloco real entra no segundo passe.
 */
export function useMontado(): boolean {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  return montado;
}
