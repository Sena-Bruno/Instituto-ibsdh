import type { User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { jaEntrouNesteNavegador } from '../firebase/sessao';
import { codigoDoErro, mensagemDoErroDeLogin } from './erroDeLogin';

/**
 * O login com Google, carregado só quando alguém precisa dele.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE O SDK NÃO VEM JUNTO COM A PÁGINA                             │
 * │                                                                       │
 * │  As avaliações de um curso são de leitura pública: a consulta ao      │
 * │  Firestore não passa por autenticação nenhuma. O Auth só é            │
 * │  necessário para ESCREVER uma avaliação — e escrever é o que quase    │
 * │  ninguém faz.                                                         │
 * │                                                                       │
 * │  Mesmo assim, o SDK inteiro (156 kB, 32 kB comprimido) descia para    │
 * │  todo visitante que rolasse até a seção. Aqui ele desce em dois       │
 * │  casos, e só neles:                                                   │
 * │                                                                       │
 * │   · a pessoa já entrou alguma vez neste navegador (a marca em         │
 * │     `firebase/sessao.ts` diz isso sem custo), e então a sessão é      │
 * │     restaurada sozinha, como sempre foi;                              │
 * │   · a pessoa clicou em "Entrar com Google".                           │
 * │                                                                       │
 * │  O `import type { User }` acima não conta: tipo é apagado na          │
 * │  compilação e não gera import nenhum no pacote.                       │
 * └───────────────────────────────────────────────────────────────────────┘
 */

type ModuloDeAuth = typeof import('../firebase/auth');

/* Uma promessa só para o módulo inteiro. Sem isto, dois componentes na
   mesma página (as avaliações e um formulário, por exemplo) pediriam o
   carregamento duas vezes — o navegador dedupe a rede, mas cada um
   registraria seu próprio observador de sessão. */
let carregamento: Promise<ModuloDeAuth> | null = null;
const carregarAuth = (): Promise<ModuloDeAuth> => {
  carregamento ??= import('../firebase/auth');
  return carregamento;
};

export interface Autenticacao {
  /** Quem está logado, ou `null` — inclusive enquanto o SDK não desceu. */
  usuario: User | null;
  /** `true` entre o clique em entrar e a resposta do Google. */
  entrando: boolean;
  /** Frase pronta para a tela quando o login falha. Vazia se não falhou. */
  erro: string;
  entrar: () => Promise<void>;
  sair: () => Promise<void>;
}

export function useAutenticacao(): Autenticacao {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');
  /* Começa ligado só para quem já entrou aqui antes; o clique em entrar
     liga para os demais. É o interruptor do download. */
  const [observando, setObservando] = useState(jaEntrouNesteNavegador);

  useEffect(() => {
    if (!observando) return;

    let cancelado = false;
    let desinscrever: (() => void) | undefined;

    carregarAuth()
      .then(({ observarSessao }) => {
        /* O componente pode ter saído da tela enquanto o módulo descia.
           Sem esta guarda, o observador ficaria registrado para sempre. */
        if (cancelado) return;
        desinscrever = observarSessao(setUsuario);
      })
      .catch((err) => console.error('Não foi possível carregar o login:', err));

    return () => {
      cancelado = true;
      desinscrever?.();
    };
  }, [observando]);

  const entrar = useCallback(async () => {
    setErro('');
    setEntrando(true);
    try {
      const { loginWithGoogle } = await carregarAuth();
      /* Ligar o observador ANTES de abrir a janela: é ele que põe o
         usuário na tela quando o Google responde. Sem isto, o login daria
         certo e a página continuaria mostrando o botão de entrar. */
      setObservando(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('Erro ao entrar com o Google:', err);
      setErro(mensagemDoErroDeLogin(codigoDoErro(err)));
    } finally {
      setEntrando(false);
    }
  }, []);

  const sair = useCallback(async () => {
    const { logout } = await carregarAuth();
    await logout();
  }, []);

  return { usuario, entrando, erro, entrar, sair };
}
