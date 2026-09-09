/**
 * Traduz o código de erro do Firebase para uma frase que diz o que fazer.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O CASO QUE MOTIVOU ISTO                                              │
 * │                                                                       │
 * │  O Firebase só permite login nos domínios listados em Authentication  │
 * │  → Settings → Authorized domains, e um projeto novo traz ali apenas   │
 * │  `localhost` e os endereços `*.firebaseapp.com` / `*.web.app`.        │
 * │  Publicar o site no domínio próprio, portanto, quebra o login — e a   │
 * │  mensagem crua do SDK (`auth/unauthorized-domain`) não diz onde se    │
 * │  conserta.                                                            │
 * │                                                                       │
 * │  Isto vivia dentro de `pages/Admin.tsx`. Saiu de lá porque as         │
 * │  avaliações de curso têm o MESMO botão de entrar com o Google e não   │
 * │  tratavam erro nenhum: `onClick={loginWithGoogle}` com a promessa     │
 * │  solta. Num domínio não autorizado, clicar não fazia absolutamente    │
 * │  nada — nem janela, nem mensagem, nem pista.                          │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export function mensagemDoErroDeLogin(codigo: string | undefined): string {
  switch (codigo) {
    case 'auth/unauthorized-domain':
      return `Este endereço (${window.location.hostname}) não está autorizado no Firebase. No console do Firebase, em Authentication → Settings → Authorized domains, acrescente este domínio e tente de novo.`;
    case 'auth/operation-not-allowed':
      return 'O login com Google não está habilitado neste projeto do Firebase. Ative-o em Authentication → Sign-in method.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela de login. Libere os pop-ups para este site e tente de novo.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'A janela de login foi fechada antes de concluir.';
    case 'auth/network-request-failed':
      return 'Não foi possível falar com o Firebase. Verifique a conexão e tente de novo.';
    default:
      return codigo
        ? `Não foi possível entrar (${codigo}).`
        : 'Não foi possível entrar. Tente de novo.';
  }
}

/** O `code` de um erro do Firebase, quando o objeto tem um. */
export function codigoDoErro(erro: unknown): string | undefined {
  return typeof erro === 'object' && erro !== null && 'code' in erro
    ? String((erro as { code: unknown }).code)
    : undefined;
}
