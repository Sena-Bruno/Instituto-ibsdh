/**
 * Um bit em `localStorage`: esta pessoa já entrou com o Google aqui.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UM ARQUIVO SÓ PARA ISTO                                      │
 * │                                                                       │
 * │  O SDK de autenticação do Firebase pesa 156 kB (32 kB comprimido) e   │
 * │  guarda a sessão no IndexedDB — que só se lê de forma assíncrona, e   │
 * │  só depois de carregar o próprio SDK. Ou seja: para descobrir se vale │
 * │  a pena baixar o Auth, era preciso baixar o Auth.                     │
 * │                                                                       │
 * │  Quem lê as avaliações de um curso não precisa de nada disso: a       │
 * │  lista é pública. O Auth só entra em cena para ESCREVER uma           │
 * │  avaliação — e escrever é o que quase ninguém faz.                    │
 * │                                                                       │
 * │  Esta marca resolve o impasse com uma leitura síncrona e barata:      │
 * │  quem nunca entrou não baixa o SDK até clicar em "Entrar com Google"; │
 * │  quem já entrou tem a sessão restaurada sozinha, como antes.          │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A marca é uma DICA, não a verdade. Quem manda na sessão continua sendo o
 * Firebase: a marca pode sobrar (a pessoa limpou os cookies e o Firebase
 * responde "não há ninguém") ou faltar (navegador anônimo). Nos dois casos
 * o pior que acontece é a tela mostrar o botão de entrar, que funciona.
 */
const CHAVE = 'ibsdh:sessao-google';

/* `localStorage` lança exceção, e não devolve null, quando o navegador
   bloqueia armazenamento de site — o modo restrito do Safari e algumas
   extensões de privacidade fazem isso. Sem o try, a página inteira
   quebraria por causa de uma otimização de download. */
export function jaEntrouNesteNavegador(): boolean {
  try {
    return localStorage.getItem(CHAVE) === '1';
  } catch {
    return false;
  }
}

export function marcarEntrada(): void {
  try {
    localStorage.setItem(CHAVE, '1');
  } catch {
    // Sem armazenamento, a pessoa só terá de clicar em entrar de novo.
  }
}

export function esquecerEntrada(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // Idem.
  }
}
