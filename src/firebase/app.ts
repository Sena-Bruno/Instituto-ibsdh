import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase-config.json';

/**
 * A instância do Firebase, e só ela.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO FOI SEPARADO EM QUATRO ARQUIVOS                         │
 * │                                                                       │
 * │  Havia um `src/firebase.ts` que inicializava o app, o Firestore       │
 * │  completo e o Auth nas três primeiras linhas. Como as três chamadas   │
 * │  têm efeito colateral, o empacotador não consegue descartar nenhuma:  │
 * │  quem importasse `db` para gravar um nome e um e-mail levava junto o  │
 * │  Auth inteiro e o cliente de tempo real do Firestore.                 │
 * │                                                                       │
 * │  Medido no build: o pedaço `firebase` do site pesava 652 kB (166 kB   │
 * │  comprimido) — mais do que todas as imagens do site somadas — e caía  │
 * │  sobre quem apenas rolava até as avaliações de uma página de curso,   │
 * │  onde tudo o que acontece é ler uma lista.                            │
 * │                                                                       │
 * │  Agora cada peça é um módulo, e cada tela carrega só a sua:           │
 * │                                                                       │
 * │    app.ts            a instância — não faz nada sozinha;              │
 * │    banco.ts          Firestore `lite`: ler e gravar, sem tempo real;  │
 * │    banco-ao-vivo.ts  Firestore completo — só o /admin usa;            │
 * │    auth.ts           login com Google — só quem escreve precisa.      │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export const app = initializeApp(firebaseConfig);

/**
 * O banco não é o `(default)`: o projeto foi criado pelo AI Studio, que
 * nomeia a base com um identificador próprio. Sem passá-lo em
 * `getFirestore`, o SDK fala com um banco vazio que existe em paralelo —
 * e a falha é silenciosa: consultas retornam zero documentos, gravações
 * somem, e o console do Firebase mostra a coleção certa intocada.
 */
export const idDoBanco = firebaseConfig.firestoreDatabaseId;
