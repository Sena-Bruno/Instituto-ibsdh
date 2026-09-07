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
      console.error('Resend respondeu', res.status, await res.text());
      return new Response('Falha ao enviar', { status: 502 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Erro ao notificar lead:', err);
    return new Response('Falha ao enviar', { status: 502 });
  }
};
