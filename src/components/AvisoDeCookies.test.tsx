import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { decisaoDeCookies, registrarDecisao } from '../lib/consentimento';
import AvisoDeCookies from './AvisoDeCookies';

const iniciarMedicao = vi.hoisted(() => vi.fn());
vi.mock('../lib/medir', () => ({ iniciarMedicao }));

const desenhar = () =>
  render(
    <MemoryRouter>
      <AvisoDeCookies />
    </MemoryRouter>,
  );

/**
 * Testes do aviso de cookies.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTES TESTES PROTEGEM                                          │
 * │                                                                       │
 * │  Um aviso de cookies quebrado não parece quebrado. Ele continua       │
 * │  aparecendo, continua tendo dois botões, e a única coisa errada —     │
 * │  medir quem recusou — acontece num serviço de terceiro, fora da tela. │
 * │                                                                       │
 * │  É uma falha silenciosa com consequência legal, que é a pior          │
 * │  combinação: não há sintoma que denuncie, e o custo de descobrir      │
 * │  tarde não é um bug, é uma infração.                                  │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('AvisoDeCookies', () => {
  beforeEach(() => {
    localStorage.clear();
    iniciarMedicao.mockClear();
  });

  it('aparece para quem ainda não respondeu', async () => {
    desenhar();
    expect(await screen.findByRole('region', { name: /cookies/i })).toBeInTheDocument();
  });

  it('oferece recusar com o mesmo peso de aceitar', async () => {
    /*
      A regra que o desenho inteiro serve: consentimento só é válido se for
      livre. Um aviso com "Aceitar" em destaque e a recusa escondida num X
      não coleta autorização — coleta cansaço. Se alguém trocar o botão de
      recusa por um ícone, este teste cai.
    */
    desenhar();
    const aceitar = await screen.findByRole('button', { name: /^aceitar$/i });
    const recusar = screen.getByRole('button', { name: /^recusar$/i });

    expect(aceitar).toBeInTheDocument();
    expect(recusar).toBeInTheDocument();
    // Não existe um fechar que se comporte como aceite silencioso.
    expect(screen.queryByRole('button', { name: /fechar/i })).not.toBeInTheDocument();
  });

  it('NÃO inicia a medição só por ter sido mostrado', async () => {
    /* O padrão do mercado — carregar o rastreio e desligar depois da
       recusa — mede todo mundo ao menos uma vez, inclusive quem ia dizer
       não. Aqui nada roda antes da resposta. */
    desenhar();
    await screen.findByRole('region', { name: /cookies/i });
    expect(iniciarMedicao).not.toHaveBeenCalled();
  });

  it('aceitar grava a escolha e começa a medir na hora', async () => {
    const user = userEvent.setup();
    desenhar();
    await user.click(await screen.findByRole('button', { name: /^aceitar$/i }));

    expect(decisaoDeCookies()).toBe('aceito');
    expect(iniciarMedicao).toHaveBeenCalledTimes(1);
    // E o aviso sai da tela: a pergunta foi respondida.
    expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument();
  });

  it('recusar grava a escolha e não mede nada', async () => {
    const user = userEvent.setup();
    desenhar();
    await user.click(await screen.findByRole('button', { name: /^recusar$/i }));

    expect(decisaoDeCookies()).toBe('recusado');
    expect(iniciarMedicao).not.toHaveBeenCalled();
    expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument();
  });

  it('não volta a perguntar para quem já respondeu', async () => {
    /* Um aviso que reaparece a cada visita transforma a recusa em pergunta
       repetida até a pessoa ceder — e consentimento assim não é livre. */
    registrarDecisao('recusado');
    desenhar();

    // Espera o ciclo de montagem: se fosse aparecer, apareceria aqui.
    await Promise.resolve();
    expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument();
  });

  it('volta a perguntar depois de a escolha ser revista', async () => {
    // É o caminho do botão "Rever minha escolha", na /privacidade.
    registrarDecisao('aceito');
    desenhar();
    registrarDecisao(null);

    expect(await screen.findByRole('region', { name: /cookies/i })).toBeInTheDocument();
  });
});
