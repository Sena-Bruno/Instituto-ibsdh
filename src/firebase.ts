import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
