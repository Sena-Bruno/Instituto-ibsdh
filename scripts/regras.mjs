/**
 * Testa `firestore.rules` contra o emulador do Firestore.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTE É O TESTE MAIS IMPORTANTE DO REPOSITÓRIO                │
 * │                                                                       │
 * │  As regras são a ÚNICA coisa que separa a lista de leads do resto da  │
 * │  internet. O /admin checa o UID em `config/admin.ts`, mas isso é      │
 * │  interface: quem souber o endereço do projeto fala com o Firestore    │
 * │  direto, sem passar pelo site. Se a regra de leitura afrouxar, nome e │
 * │  e-mail de todo mundo que preencheu um formulário ficam públicos — e  │
 * │  não há sintoma na tela que denuncie, porque o site continua igual.   │
 * │                                                                       │
 * │  Nenhum verificador local via essas regras: tipos, lint, Knip e os    │
 * │  testes de unidade leem `src/`, e o arquivo de regras é uma linguagem │
 * │  à parte, avaliada pelo servidor do Google. Até aqui, a única prova   │
 * │  de que elas funcionavam era o site não ter vazado ainda.             │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * O teste tem dois lados, e os dois importam:
 *
 *  · o que o SITE FAZ tem de continuar passando — uma regra apertada
 *    demais recusa cadastro, e um lead recusado não volta;
 *  · o que a regra existe para RECUSAR tem de ser recusado.
 *
 * As dependências não entram no package.json (o emulador baixa um .jar de
 * dezenas de MB, e o build de produção não tem o que fazer com ele):
 *
 *   npm install --no-save firebase-tools @firebase/rules-unit-testing
 *   npm run regras
 */

import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { addDoc, collection, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';

/** O UID de administrador, que precisa ser o mesmo de `firestore.rules`. */
const UID_ADMIN = 'kKJkk1MFh9Rw5xm51BwZIYD5Tin2';

const env = await initializeTestEnvironment({
  projectId: 'regras-teste',
  firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
});

/** Os três tipos de quem fala com o banco. */
const anonimo = env.unauthenticatedContext().firestore();
const aluno = env.authenticatedContext('aluno-1').firestore();
const admin = env.authenticatedContext(UID_ADMIN).firestore();

let falhas = 0;
async function checar(nome, promessa) {
  try {
    await promessa;
    console.log(`  ✓ ${nome}`);
  } catch (erro) {
    console.log(`  ✗ ${nome} — ${erro.message?.slice(0, 140)}`);
    falhas++;
  }
}

/** Uma avaliação válida, com o campo que o caso do teste quiser trocar. */
const avaliacao = (extra = {}) => ({
  courseId: 'hipnoterapia',
  userId: 'aluno-1',
  userName: 'Aluno Um',
  rating: 5,
  comment: 'Excelente formação.',
  createdAt: serverTimestamp(),
  ...extra,
});

const lead = (extra = {}) => ({
  name: 'Maria Silva',
  email: 'maria@exemplo.com',
  materialId: 'sete-perguntas',
  origem: '/artigos/o-que-e-pnl',
  createdAt: serverTimestamp(),
  ...extra,
});

console.log('=== o que o site faz tem de continuar passando ===');

await checar(
  'visitante sem login grava um lead de material',
  assertSucceeds(addDoc(collection(anonimo, 'leads'), lead())),
);
await checar(
  'visitante sem login entra na lista de espera, com campanha',
  assertSucceeds(
    addDoc(collection(anonimo, 'waitlist'), {
      name: 'João',
      email: 'joao@exemplo.com',
      courseId: 'hipnoterapia',
      origem: '/hipnoterapia',
      campanha: 'instagram / cpc / setembro',
      createdAt: serverTimestamp(),
    }),
  ),
);
await checar(
  'aluno logado publica avaliação com a foto da conta Google',
  assertSucceeds(
    addDoc(
      collection(aluno, 'course_reviews'),
      avaliacao({ userPhoto: 'https://lh3.googleusercontent.com/a/foto' }),
    ),
  ),
);
await checar(
  'qualquer visitante lê as avaliações de um curso',
  assertSucceeds(getDocs(collection(anonimo, 'course_reviews'))),
);
await checar(
  'o administrador lê a lista de leads',
  assertSucceeds(getDocs(collection(admin, 'leads'))),
);

console.log('\n=== o que as regras existem para recusar ===');

await checar(
  'visitante sem login NÃO lê os leads',
  assertFails(getDocs(collection(anonimo, 'leads'))),
);
await checar(
  'conta Google qualquer NÃO lê a lista de espera',
  /* O login é de qualquer pessoa com conta Google; o acesso à lista é de
     quem está no UID. Se este teste passar a falhar, a lista virou pública
     para todo mundo que clicar em "Entrar com Google" numa página de curso. */
  assertFails(getDocs(collection(aluno, 'waitlist'))),
);
await checar(
  'lead com data forjada no futuro é recusado',
  /* Sem `createdAt == request.time`, este documento fica no topo do /admin
     para sempre — a lista é ordenada por ele. */
  assertFails(
    addDoc(
      collection(anonimo, 'leads'),
      lead({ createdAt: Timestamp.fromDate(new Date('3000-01-01')) }),
    ),
  ),
);
await checar(
  'avaliação com data forjada é recusada',
  assertFails(
    addDoc(
      collection(aluno, 'course_reviews'),
      avaliacao({ createdAt: Timestamp.fromDate(new Date('3000-01-01')) }),
    ),
  ),
);
await checar(
  'foto de avaliação que não seja https é recusada',
  /* O campo sai no `src` de um <img> que todo visitante do curso carrega:
     um endereço de terceiro ali vira um rastreador de quem leu a página. */
  assertFails(
    addDoc(
      collection(aluno, 'course_reviews'),
      avaliacao({ userPhoto: 'http://coletor.exemplo/pixel.gif' }),
    ),
  ),
);
await checar(
  'avaliação publicada em nome de outro usuário é recusada',
  assertFails(
    addDoc(collection(aluno, 'course_reviews'), avaliacao({ userId: 'outro-aluno' })),
  ),
);
await checar(
  'campo fora da lista conhecida derruba a gravação inteira',
  /* `hasOnlyAllowedFields` é o que impede alguém de pendurar dados
     arbitrários — e volume arbitrário — dentro de um cadastro. */
  assertFails(addDoc(collection(anonimo, 'leads'), lead({ observacao: 'x'.repeat(500) }))),
);

await env.cleanup();

console.log(`\n${falhas === 0 ? '✓ as regras fazem o que dizem' : `✗ ${falhas} problema(s)`}`);
process.exit(falhas === 0 ? 0 : 1);
