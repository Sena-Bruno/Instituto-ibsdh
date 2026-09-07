import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` no navegador, `useEffect` no servidor.
 *
 * `useLayoutEffect` roda depois de o React montar o DOM e ANTES de o
 * navegador pintar — é a única janela em que dá para mexer no estilo de
 * um elemento sem que o visitante veja o estado anterior por um quadro.
 * É o que permite ao `Revela` entregar HTML visível ao robô e ainda assim
 * esconder o bloco a tempo de animá-lo, sem lampejo.
 *
 * No servidor não existe pintura, e o React avisa em console que
 * `useLayoutEffect` não faz nada ali. Como a pré-renderização executa os
 * mesmos componentes em Node, trocar por `useEffect` naquele lado silencia
 * um aviso que não descreve defeito nenhum.
 */
export const useAntesDaPintura = typeof window === 'undefined' ? useEffect : useLayoutEffect;
