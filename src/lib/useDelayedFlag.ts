import { useEffect, useState } from 'react';

/**
 * Só devolve `true` se a condição continuar verdadeira depois do atraso.
 *
 * Serve para não piscar indicador de carregamento: numa conexão boa a
 * resposta chega em 150ms, e mostrar um skeleton que aparece e some
 * nesse intervalo incomoda mais do que esperar. Abaixo do atraso, a
 * interface simplesmente não muda.
 *
 * 220ms é o limiar em que a espera começa a ser percebida como demora.
 */
export function useDelayedFlag(active: boolean, delayMs = 220): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const id = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(id);
  }, [active, delayMs]);

  return show;
}
