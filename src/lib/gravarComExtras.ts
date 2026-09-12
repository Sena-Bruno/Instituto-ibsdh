/**
 * Grava um cadastro com os campos novos — e, se o Firestore os recusar,
 * grava sem eles em vez de perder o lead.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  A JANELA QUE ISTO FECHA                                              │
 * │                                                                       │
 * │  `firestore.rules` valida por lista fechada: `hasOnlyAllowedFields`   │
 * │  recusa o documento INTEIRO se vier um campo que a regra não conhece. │
 * │                                                                       │
 * │  E publicar regra é um passo à PARTE do deploy do site. O Netlify     │
 * │  sobe o HTML e o JavaScript sozinho, no merge; o Firestore só muda    │
 * │  quando alguém roda `firebase deploy --only firestore:rules`. Entre   │
 * │  um e outro existe uma janela — minutos, se alguém estiver atento;    │
 * │  dias, se ninguém estiver — em que o site já envia `campanha` e as    │
 * │  regras ainda não a aceitam.                                         │
 * │                                                                       │
 * │  Sem esta rede, TODO cadastro feito nessa janela seria recusado. O    │
 * │  site já viveu exatamente isso: a captação de material entrou no ar   │
 * │  com a regra escrita e não publicada, e recusou todo lead até alguém  │
 * │  ler o código para descobrir por quê (ver `erroDeFirestore.ts`).      │
 * │                                                                       │
 * │  A troca é deliberada: perder a etiqueta de campanha de alguns        │
 * │  cadastros custa um dado de análise. Perder o cadastro custa o lead.  │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/** O `code` de um erro do Firestore, sem o prefixo do SDK. */
function codigo(erro: unknown): string | undefined {
  const bruto =
    typeof erro === 'object' && erro !== null && 'code' in erro
      ? String((erro as { code: unknown }).code)
      : undefined;
  return bruto?.replace(/^.*\//, '');
}

/**
 * @param gravar  Recebe os campos extras e grava o documento.
 * @param extras  Campos opcionais. Os vazios são descartados: o SDK do
 *                Firestore não aceita `undefined` dentro de um documento.
 */
export async function gravarComExtras(
  gravar: (extras: Record<string, string>) => Promise<unknown>,
  extras: Record<string, string | undefined>,
): Promise<void> {
  const presentes: Record<string, string> = {};
  for (const [chave, valor] of Object.entries(extras)) {
    if (valor) presentes[chave] = valor;
  }

  try {
    await gravar(presentes);
  } catch (erro) {
    /* Sem extras, não há o que tentar de novo: a recusa é de outra causa e
       precisa subir inteira, para virar a mensagem de falha na tela. */
    if (!Object.keys(presentes).length || codigo(erro) !== 'permission-denied') throw erro;

    console.warn(
      'O Firestore recusou o cadastro com os campos ' +
        `${Object.keys(presentes).join(', ')}. Provável causa: as regras ainda ` +
        'não foram publicadas com esses campos. Gravando sem eles para não ' +
        'perder o lead — publique com: firebase deploy --only firestore:rules',
    );

    await gravar({});
  }
}
