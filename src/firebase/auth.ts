import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { app } from './app';
import { esquecerEntrada, marcarEntrada } from './sessao';

/**
 * O login com Google, num módulo separado do banco.
 *
 * A separação é o que impede o Auth de viajar de carona. Ele só é
 * necessário para ESCREVER uma avaliação — as regras do Firestore exigem
 * um usuário autenticado ali — e para entrar no /admin. Ler a lista de
 * avaliações, entrar na lista de espera e baixar um material não passam
 * por autenticação nenhuma.
 *
 * Antes de existir este arquivo, `getAuth(app)` rodava no mesmo módulo do
 * banco, e como a chamada tem efeito colateral o empacotador não podia
 * descartá-la: todo mundo que tocava no Firestore levava o Auth junto.
 *
 * O arquivo é carregado por `import()` dinâmico em toda tela pública —
 * ver `lib/useAutenticacao.ts`. O /admin é a única que o importa direto,
 * porque ali a autenticação É a tela.
 */
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

/**
 * Entra com a conta Google.
 *
 * O erro sobe para quem chamou, de propósito. Antes ele era engolido num
 * `console.error` daqui, e o efeito prático era o pior possível: num
 * domínio ainda não autorizado no Firebase, clicar em "Entrar com Google"
 * não fazia absolutamente nada — nem janela, nem mensagem, nem pista. Só
 * abrindo o console do navegador dava para descobrir o motivo.
 *
 * Quem chama traduz o código do erro para uma frase que diz o que fazer.
 */
export const loginWithGoogle = async () => {
  const credencial = await signInWithPopup(auth, googleProvider);
  /* Só depois de dar certo. A marca serve para decidir, na próxima
     visita, se vale baixar este SDK antes de alguém pedir — gravá-la numa
     tentativa que falhou faria o site baixar 156 kB à toa para sempre. */
  marcarEntrada();
  return credencial;
};

export const logout = async () => {
  try {
    await signOut(auth);
    esquecerEntrada();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

/**
 * Avisa quando a sessão muda, e devolve a função que cancela o aviso.
 *
 * Existe para que quem carrega este módulo sob demanda não precise
 * importar `onAuthStateChanged` de `firebase/auth` por fora — o que
 * traria o SDK de volta para dentro do pacote do site, desfazendo em
 * silêncio a separação que este arquivo existe para manter.
 */
export const observarSessao = (aoMudar: (usuario: User | null) => void) =>
  onAuthStateChanged(auth, aoMudar);
