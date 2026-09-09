import { getFirestore } from 'firebase/firestore';
import { app, idDoBanco } from './app';

/**
 * O Firestore completo, com `onSnapshot`. Só o /admin importa este arquivo.
 *
 * O painel é a única tela em que o tempo real vale o peso: ele fica aberto
 * enquanto o Bruno trabalha, e um cadastro que chega precisa aparecer na
 * lista sem que ninguém recarregue nada. O custo em bytes não conta —
 * a rota é privada, tem um único visitante e não é medida por buscador.
 *
 * ⚠ NÃO IMPORTE ISTO DE UM COMPONENTE PÚBLICO. Um import daqui numa tela
 * que o visitante alcança traz o cliente de tempo real de volta ao pacote
 * do site e desfaz, em silêncio, a separação que `banco.ts` explica.
 * Os tipos ajudam a perceber: o `Firestore` completo e o `lite` são tipos
 * distintos, então trocar um pelo outro não compila.
 */
export const bancoAoVivo = getFirestore(app, idDoBanco);
