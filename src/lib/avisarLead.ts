/**
 * Avisa o instituto, por e-mail, que um lead acabou de entrar.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ESTA CHAMADA É ACESSÓRIA, E É DE PROPÓSITO QUE ELA NÃO ESPERA        │
 * │                                                                       │
 * │  Quando ela roda, o lead JÁ ESTÁ no Firestore — que é a fonte da      │
 * │  verdade, e de onde saem o /admin e o CSV. O e-mail é só o toque no   │
 * │  ombro para o Bruno não precisar abrir o painel para saber que        │
 * │  alguém chegou.                                                       │
 * │                                                                       │
 * │  Por isso a promessa não é aguardada e a falha não sobe: se um erro   │
 * │  daqui virasse mensagem na tela, o visitante leria "não deu certo",   │
 * │  tentaria de novo e criaria um cadastro duplicado — perdendo-se um    │
 * │  lead bom por causa de um e-mail que não saiu.                        │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export interface AvisoDeLead {
  name: string;
  email: string;
  /** Decide o assunto do e-mail e o texto do corpo. */
  tipo: 'lista-de-espera' | 'material';
  /** O curso, na lista de espera; o material, na captação por artigo. */
  referencia: string;
  /** De qual página do site o cadastro veio. Só a captação por artigo tem. */
  origem?: string;
}

export function avisarLead(aviso: AvisoDeLead): void {
  fetch('/.netlify/functions/notificar-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aviso),
  }).catch((err) => console.error('Falha ao notificar por e-mail:', err));
}
