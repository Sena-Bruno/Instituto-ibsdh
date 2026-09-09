import { getFirestore } from 'firebase/firestore/lite';
import { app, idDoBanco } from './app';

/**
 * O Firestore do site público, na variante `lite`.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE A VERSÃO `lite` NÃO TEM — E POR QUE NÃO FAZ FALTA AQUI         │
 * │                                                                       │
 * │  Ela não tem `onSnapshot`, cache offline nem o canal aberto que       │
 * │  mantém a tela em sincronia com o banco. É por isso que ela cabe em   │
 * │  uma fração do tamanho: a consulta vira uma requisição REST comum,    │
 * │  em vez de arrastar a máquina de estado que reconcilia escrita local, │
 * │  cache e servidor.                                                    │
 * │                                                                       │
 * │  Nenhuma tela pública precisa daquilo. As avaliações de um curso são  │
 * │  lidas uma vez quando a seção aparece; a lista de espera e a captação │
 * │  de material só gravam. Ninguém fica olhando para a página esperando  │
 * │  a avaliação de outra pessoa surgir sozinha.                          │
 * │                                                                       │
 * │  O /admin é a exceção real, e usa `banco-ao-vivo.ts`.                 │
 * │                                                                       │
 * │  As duas variantes convivem: o SDK as registra sob nomes diferentes   │
 * │  (`firestore` e `firestore/lite`), então o painel pode carregar a     │
 * │  completa sem que isso volte para o pacote do site.                   │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const db = getFirestore(app, idDoBanco);
