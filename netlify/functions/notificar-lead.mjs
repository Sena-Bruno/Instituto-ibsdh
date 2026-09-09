/**
 * Avisa o instituto por e-mail quando alguém entra na lista de espera.
 *
 * Chamada pelo formulário depois que o cadastro já foi gravado no
 * Firestore — o e-mail é só a notificação. Se este envio falhar, o lead
 * continua salvo: o Firestore é a fonte da verdade, não o e-mail.
 *
 * Configuração (Netlify → Site settings → Environment variables):
 *   RESEND_API_KEY   chave da API do Resend (resend.com, plano gratuito
 *                    cobre bem o volume de uma lista de espera)
 *   NOTIFY_FROM      remetente verificado no Resend
 *   NOTIFY_EMAIL     opcional — quem recebe o aviso. Sem ela, vai para o
 *                    contato do instituto, logo abaixo.
 *
 * Sem RESEND_API_KEY ou sem NOTIFY_FROM a função responde 204 e não faz
 * nada: o site continua funcionando normalmente, apenas sem o aviso.
 */

/**
 * Para onde o aviso vai quando NOTIFY_EMAIL não está definida.
 *
 * É o mesmo endereço de `site.email.contact`, repetido aqui porque esta
 * função roda fora do bundle do site e não importa nada de `src/`. Ele já
 * é público — aparece no rodapé, nas páginas legais e nos dados
 * estruturados —, então repetir não expõe nada de novo. Se o contato do
 * instituto mudar, mude nos dois lugares.
 *
 * O motivo de existir um padrão: com as três variáveis obrigatórias, quem
 * configurasse a chave e o remetente e esquecesse o destinatário ficaria
 * com a função respondendo 204 em silêncio — cadastro salvo, aviso nunca
 * enviado, e nada na tela dizendo isso.
 */
const CONTATO_PADRAO = 'contato@institutobrunosena.com.br';

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ESCAPE[c]);

/**
 * Traduz a recusa do Resend para o que fazer a respeito.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO EXISTE                                                  │
 * │                                                                       │
 * │  A função registrava `console.error('Resend respondeu', status, texto)`│
 * │  e devolvia 502. O texto cru do Resend diz o que houve, mas não o que  │
 * │  fazer — e para ler esse log é preciso saber que ele existe, achar a   │
 * │  função certa no painel do Netlify e interpretar o corpo do erro.     │
 * │                                                                       │
 * │  O caso real: com `NOTIFY_FROM=onboarding@resend.dev`, que é o         │
 * │  remetente de teste, o Resend só entrega para o e-mail dono da conta.  │
 * │  Enviando para o contato do instituto ele recusa com 403, e o efeito   │
 * │  visível era um 502 sem explicação — o cadastro salvo, o aviso nunca   │
 * │  enviado, e nada em lugar nenhum dizendo por quê.                     │
 * │                                                                       │
 * │  Agora o log diz a causa e a correção, em português, na linha do erro. │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export function diagnostico(status, corpo, remetente, destinatario) {
  const deTeste = remetente.endsWith('@resend.dev');

  if (status === 401 || status === 403) {
    if (/testing emails|own email|verify a domain/i.test(corpo) || deTeste) {
      return (
        `O remetente ${remetente} é o endereço de teste do Resend, que só entrega ` +
        `para o e-mail dono da conta — e está tentando entregar para ${destinatario}. ` +
        'Duas saídas: verifique o domínio institutobrunosena.com.br em Resend → Domains ' +
        'e use avisos@institutobrunosena.com.br em NOTIFY_FROM (definitivo), ou defina ' +
        'NOTIFY_EMAIL com o e-mail da conta do Resend (funciona hoje, só para teste).'
      );
    }
    if (status === 401) {
      return 'A RESEND_API_KEY foi recusada: chave inválida, revogada ou de outra conta. Gere outra em Resend → API Keys e atualize a variável no Netlify.';
    }
    return `O Resend recusou o envio de ${remetente}. Confirme que esse domínio está verificado em Resend → Domains.`;
  }

  if (status === 422) {
    return 'O Resend recusou os dados do e-mail. Confira o formato de NOTIFY_FROM: ele precisa ser um endereço, opcionalmente como "Nome <endereco@dominio>".';
  }
  if (status === 429) {
    return 'Limite de envio do Resend atingido. O plano gratuito cobre o volume de uma lista de espera, então isto costuma indicar laço de reenvio.';
  }
  if (status >= 500) {
    return 'A falha é do lado do Resend. O cadastro está salvo; só o aviso não saiu.';
  }
  return 'Resposta inesperada do Resend.';
}

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM;
  const to = process.env.NOTIFY_EMAIL?.trim() || CONTATO_PADRAO;
  if (!apiKey || !from) return new Response(null, { status: 204 });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  // Só os três campos esperados, com limite de tamanho. O destinatário
  // nunca vem do pedido: é sempre NOTIFY_EMAIL, então este endpoint não
  // pode ser usado para enviar e-mail a terceiros.
  const name = String(payload?.name ?? '')
    .trim()
    .slice(0, 100);
  const email = String(payload?.email ?? '')
    .trim()
    .slice(0, 200);
  const courseId = String(payload?.courseId ?? '')
    .trim()
    .slice(0, 100);

  if (!name || !email || !courseId || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return new Response('Dados inválidos', { status: 400 });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Novo cadastro na lista de espera — ${courseId}`,
        html:
          `<h2>Novo cadastro na lista de espera</h2>` +
          `<p><strong>Nome:</strong> ${escapeHtml(name)}</p>` +
          `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>` +
          `<p><strong>Curso:</strong> ${escapeHtml(courseId)}</p>` +
          `<p style="color:#666;font-size:13px">A lista completa fica em /admin.</p>`,
      }),
    });

    if (!res.ok) {
      const corpo = await res.text();

      /* Log estruturado: o painel do Netlify permite buscar por texto, e
         `evento` dá um termo único para filtrar todas as falhas de aviso sem
         esbarrar no resto do log da função. */
      console.error(
        JSON.stringify({
          evento: 'aviso-de-lead-recusado',
          status: res.status,
          remetente: from,
          destinatario: to,
          causa: diagnostico(res.status, corpo, from, to),
          respostaDoResend: corpo.slice(0, 500),
        }),
      );

      /* 502 continua sendo a resposta, e de propósito: quem chama é o
         formulário, que ignora esta falha porque o cadastro já está no
         Firestore. O diagnóstico é para o log, não para o visitante — a
         causa cita configuração e nomes de variável, que não devem sair
         numa resposta HTTP pública. */
      return new Response('Falha ao enviar', { status: 502 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(
      JSON.stringify({
        evento: 'aviso-de-lead-recusado',
        causa: 'A requisição ao Resend não completou: rede, DNS ou tempo esgotado.',
        erro: err instanceof Error ? err.message : String(err),
      }),
    );
    return new Response('Falha ao enviar', { status: 502 });
  }
};
