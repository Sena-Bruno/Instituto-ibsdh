import { describe, expect, it } from 'vitest';
import { emailSubjects, mailtoLink, site, whatsappLink, whatsappMessages } from './site';

describe('whatsappLink', () => {
  it('devolve o link sem parâmetro quando não há mensagem', () => {
    expect(whatsappLink()).toBe(`https://wa.me/${site.whatsapp.number}`);
  });

  /*
    O motivo de a função existir: as mensagens têm acento e pontuação, e
    escrever o percent-encoding à mão no JSX é onde o "ç" virava sequência
    errada e a mensagem chegava quebrada no aplicativo.
  */
  it('codifica acento e espaço', () => {
    const url = whatsappLink('Olá! Informações sobre a formação');
    expect(url).toContain('?text=');
    // `!` fica de fora de propósito: é caractere não reservado, e
    // `encodeURIComponent` não o toca. O que precisa sair da URL crua é
    // acento e espaço.
    expect(url).not.toMatch(/[ áéíóúâêôãõç]/i);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(
      'Olá! Informações sobre a formação',
    );
  });

  it('toda mensagem pré-definida sobrevive à ida e volta', () => {
    for (const [nome, msg] of Object.entries(whatsappMessages)) {
      const texto = url1Param(whatsappLink(msg), 'text');
      expect(texto, `a mensagem ${nome} não volta igual`).toBe(msg);
    }
  });
});

describe('mailtoLink', () => {
  it('devolve mailto simples sem assunto', () => {
    expect(mailtoLink('a@b.com')).toBe('mailto:a@b.com');
  });

  it('codifica o assunto', () => {
    const url = mailtoLink('a@b.com', emailSubjects.inCompany);
    expect(url.startsWith('mailto:a@b.com?subject=')).toBe(true);
    expect(url1Param(url, 'subject')).toBe(emailSubjects.inCompany);
  });
});

/**
 * Coerência dos dados de contato.
 *
 * Estes campos alimentam o rodapé, os dados estruturados, as páginas legais
 * e todos os CTAs. Um erro de digitação aqui não quebra build nem teste de
 * navegador: o link continua sendo um link, só não leva a lugar nenhum útil.
 */
describe('dados de contato', () => {
  it('o WhatsApp está em E.164 sem símbolo, como o wa.me exige', () => {
    expect(site.whatsapp.number).toMatch(/^\d{12,13}$/);
  });

  it('o número exibido tem os mesmos dígitos do número usado no link', () => {
    /*
      Os dois existem porque um vai na URL e o outro na tela. Divergindo,
      a pessoa liga para um número e o botão abre conversa com outro.
    */
    expect(site.whatsapp.display.replace(/\D/g, '')).toBe(site.whatsapp.number);
  });

  it('os e-mails são endereços válidos no domínio do instituto', () => {
    for (const [nome, email] of Object.entries(site.email)) {
      expect(email, `o e-mail ${nome} não parece um endereço`).toMatch(
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      );
      expect(email, `o e-mail ${nome} está fora do domínio do site`).toContain(
        'institutobrunosena.com.br',
      );
    }
  });

  it('a URL do site é https e não termina em barra', () => {
    /*
      A barra final importa: `site.url` é concatenada com a rota para montar
      o canônico de cada página, e `.../` + `/artigos` produziria `//artigos`
      — que o Google trata como outra URL.
    */
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
  });

  it('o Instagram do site e o arroba apontam para o mesmo perfil', () => {
    /*
      Já divergiram: os dados estruturados do index.html citavam
      `institutosena_` enquanto o site inteiro usava `brunosenaoficial`.
    */
    const doLink = site.social.instagram.replace(/\/$/, '').split('/').pop();
    expect(`@${doLink}`).toBe(site.social.instagramHandle);
  });
});

/** Lê um parâmetro de query já decodificado. */
function url1Param(url: string, chave: string): string | null {
  return new URLSearchParams(url.split('?')[1] ?? '').get(chave);
}
