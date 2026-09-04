/**
 * Quem pode ver a lista de espera em /admin.
 *
 * São os UID do Firebase das contas Google autorizadas — não e-mails: o
 * UID é o identificador estável, e é ele que as regras do Firestore
 * conseguem verificar.
 *
 * Como descobrir o seu: acesse /admin, entre com o Google e a página
 * mostra o UID na tela para você copiar.
 *
 * ATENÇÃO: adicionar aqui não basta. Esta lista só controla o que a
 * interface mostra; quem realmente protege os dados é a mesma lista em
 * `firestore.rules`. Os dois precisam ser atualizados juntos, e depois
 * é preciso publicar as regras:
 *
 *   firebase deploy --only firestore:rules
 */
const ADMIN_UIDS: readonly string[] = [
  // 'cole-aqui-o-uid-mostrado-na-tela',
];

export function isAdmin(uid: string | undefined | null): boolean {
  return !!uid && ADMIN_UIDS.includes(uid);
}
