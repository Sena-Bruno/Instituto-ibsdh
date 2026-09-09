import { site } from '../config/site';

/**
 * Traduz a recusa do Firestore — para o visitante e para quem mantém o site.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTE ARQUIVO EXISTE POR CAUSA DE UMA FALHA REAL, EM PRODUÇÃO         │
 * │                                                                       │
 * │  A captação de material entrou no ar e recusava TODO cadastro com     │
 * │  "Não conseguimos registrar seu e-mail. Verifique sua conexão."       │
 * │                                                                       │
 * │  A conexão estava perfeita. A causa era outra: a coleção `leads` é    │
 * │  nova, e a regra dela estava escrita em `firestore.rules` mas nunca   │
 * │  havia sido PUBLICADA. Publicar regras é um passo à parte do deploy   │
 * │  do site — o Netlify sobe o HTML e o JavaScript, e não toca no        │
 * │  Firestore. Sem a regra publicada, o Firestore nega por padrão.       │
 * │                                                                       │
 * │  A mensagem mandava conferir exatamente a única coisa que estava      │
 * │  certa. Foi preciso ler o código para descobrir onde olhar.           │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Daqui em diante são duas mensagens diferentes, para duas pessoas
 * diferentes — a mesma divisão que a função de aviso de lead já faz:
 *
 * · `mensagemDeGravacao` é o que o VISITANTE lê. Não cita coleção, regra
 *   nem nome de comando: para ele, isso é ruído sobre um problema que não
 *   é dele. O que ele precisa é de uma saída, e ela está lá — o e-mail do
 *   instituto, para o cadastro não se perder por causa de um defeito nosso.
 *
 * · `diagnosticoDeGravacao` vai para o console, e diz a causa e o comando
 *   que a conserta.
 */

/** O `code` de um erro do Firestore, quando o objeto tem um. */
function codigoDoFirestore(erro: unknown): string | undefined {
  return typeof erro === 'object' && erro !== null && 'code' in erro
    ? String((erro as { code: unknown }).code)
    : undefined;
}

/*
  Os códigos que significam "não chegou lá", e só eles.

  A separação importa porque é a diferença entre um conselho útil e um
  conselho errado: mandar conferir a conexão quando o servidor respondeu
  (e recusou) manda a pessoa procurar o problema no lugar em que ele não
  está. Foi o que a mensagem antiga fazia com toda falha.
*/
const SEM_RESPOSTA = new Set(['unavailable', 'deadline-exceeded', 'cancelled']);

/** Reconhece tanto `unavailable` quanto `firestore/unavailable`. */
const ehSemResposta = (codigo: string | undefined) =>
  !!codigo && SEM_RESPOSTA.has(codigo.replace(/^.*\//, ''));

/**
 * O que aparece na tela para quem preencheu o formulário.
 *
 * @param assunto O que não foi registrado, do ponto de vista dele —
 *                "seu cadastro", "seu pedido".
 */
export function mensagemDeGravacao(erro: unknown, assunto: string): string {
  if (ehSemResposta(codigoDoFirestore(erro))) {
    return `Não conseguimos falar com o servidor. Verifique sua conexão e tente novamente.`;
  }

  /*
    Para todo o resto, a verdade é que a falha é nossa e a pessoa não tem
    o que consertar. Então a mensagem não pede nada que ela não possa
    fazer — oferece o caminho que funciona mesmo com o site quebrado.

    Isto não é gentileza: sem a saída, um defeito de configuração vira
    lead perdido em silêncio, que é exatamente o que aconteceu.
  */
  return `Não conseguimos registrar ${assunto} agora — o problema é do nosso lado. Tente de novo em instantes; se continuar, escreva para ${site.email.contact} que a gente cadastra na mão.`;
}

/**
 * O que vai para o console: a causa provável e o que fazer a respeito.
 *
 * @param colecao A coleção em que a gravação foi recusada.
 */
export function diagnosticoDeGravacao(erro: unknown, colecao: string): string {
  const codigo = codigoDoFirestore(erro)?.replace(/^.*\//, '');

  switch (codigo) {
    case 'permission-denied':
      return (
        `O Firestore recusou a gravação em "${colecao}". Duas causas possíveis, nesta ordem:\n` +
        `1) As regras não estão publicadas. Publicar é um passo à PARTE do deploy do site — ` +
        `o Netlify sobe o HTML e o JavaScript e não toca no Firestore. Rode: ` +
        `firebase deploy --only firestore:rules\n` +
        `2) As regras estão publicadas, e o documento não passou na validação de ` +
        `"${colecao}" em firestore.rules: campo a mais, campo faltando ou tamanho fora do limite.`
      );
    case 'unauthenticated':
      return `A gravação em "${colecao}" exige um usuário autenticado, e não há sessão. Confira se a regra dessa coleção pede isAuthenticated().`;
    case 'not-found':
      return `O Firestore não encontrou o banco. Confira "firestoreDatabaseId" em firebase-config.json: este projeto NÃO usa o banco "(default)", e apontar para o errado faz gravação sumir sem erro visível.`;
    case 'invalid-argument':
      return `O Firestore recusou os dados enviados para "${colecao}". Costuma ser um campo undefined — o SDK não aceita undefined em documento, só a ausência do campo.`;
    case 'resource-exhausted':
      return `A cota do Firestore acabou. Confira o plano e o uso no console do Firebase.`;
    default:
      if (ehSemResposta(codigo)) {
        return `Não foi possível alcançar o Firestore para gravar em "${colecao}": rede, DNS ou o servidor fora do ar. O cadastro não foi salvo.`;
      }
      return `Falha ao gravar em "${colecao}"${codigo ? ` (${codigo})` : ''}.`;
  }
}
