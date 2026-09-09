import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Material } from '../config/materiais';
import FormularioDeMaterial from './FormularioDeMaterial';

/*
  O Firestore é substituído inteiro: o objetivo é verificar o que o
  componente FAZ com o resultado, não falar com o banco de verdade. Um
  teste que escrevesse na coleção real encheria a lista de leads de lixo a
  cada execução — e a lista é o produto deste formulário.
*/
const addDoc = vi.hoisted(() => vi.fn());
vi.mock('firebase/firestore/lite', () => ({
  addDoc,
  collection: vi.fn((_db, nome: string) => ({ nome })),
  serverTimestamp: vi.fn(() => 'HORA-DO-SERVIDOR'),
}));
vi.mock('../firebase/banco', () => ({ db: {} }));

const material: Material = {
  id: 'sete-perguntas',
  titulo: '7 perguntas antes de escolher uma formação',
  formato: 'Guia gratuito',
  promessa: 'O roteiro que separa uma formação séria de um certificado caro.',
  chamada: 'Quero o guia',
  eixo: 'jornadas',
  corpo: [{ tipo: 'paragrafo', texto: 'Conteúdo.' }],
};

/**
 * Testes da captação de leads dos artigos.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTE COMPONENTE MERECE TESTE                                 │
 * │                                                                       │
 * │  É a única superfície do site que capta contato de quem AINDA NÃO     │
 * │  decidiu comprar — a lista de espera fica no fim de uma página de     │
 * │  venda, que essa pessoa não abre. Se ele falhar em silêncio, o site   │
 * │  volta ao estado em que estava: os artigos fazem o trabalho todo e a  │
 * │  pessoa vai embora sem deixar como falar com ela de novo.             │
 * │                                                                       │
 * │  É exatamente a classe de falha que já aconteceu aqui uma vez: a      │
 * │  primeira versão do formulário da lista de espera mostrava            │
 * │  "cadastrado!" e não gravava em lugar nenhum.                         │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('FormularioDeMaterial', () => {
  beforeEach(() => {
    addDoc.mockReset();
    addDoc.mockResolvedValue({ id: 'doc-novo' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }));
  });

  const montar = (origem = '/artigos/o-que-e-pnl') =>
    render(
      <MemoryRouter>
        <FormularioDeMaterial material={material} origem={origem} />
      </MemoryRouter>,
    );

  const preencherEEnviar = async (nome = 'Maria Silva', email = 'maria@exemplo.com') => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/seu nome/i), nome);
    await user.type(screen.getByLabelText(/seu melhor e-mail/i), email);
    await user.click(screen.getByRole('button', { name: /quero o guia/i }));
    return user;
  };

  it('grava o lead na coleção leads, com o material e a origem', async () => {
    const { collection } = await import('firebase/firestore/lite');
    montar();
    await preencherEEnviar();

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'leads');
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      materialId: 'sete-perguntas',
      /* Sem `origem`, a lista responde "quantos leads chegaram" e não
         "qual artigo os trouxe" — que é a única pergunta cuja resposta
         muda o que se escreve depois. */
      origem: '/artigos/o-que-e-pnl',
      createdAt: 'HORA-DO-SERVIDOR',
    });
  });

  it('normaliza o que foi digitado', async () => {
    montar();
    await preencherEEnviar('  Maria Silva  ', '  MARIA@Exemplo.COM  ');

    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
    });
  });

  it('entrega o material na hora, com link para a página dele', async () => {
    /* O material abre no mesmo clique, e não "chega no seu e-mail": o
       aviso por e-mail depende de configuração externa, e prometer o que
       ela pode não cumprir seria a primeira coisa que a pessoa aprende
       sobre o instituto. */
    montar();
    await preencherEEnviar();

    const link = await screen.findByRole('link', { name: new RegExp(material.titulo, 'i') });
    expect(link).toHaveAttribute('href', '/materiais/sete-perguntas');
    expect(screen.queryByLabelText(/seu nome/i)).not.toBeInTheDocument();
  });

  it('avisa que falhou quando o Firestore recusa, sem dizer que deu certo', async () => {
    addDoc.mockRejectedValue(new Error('permission-denied'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    montar();
    await preencherEEnviar();

    expect(await screen.findByRole('alert')).toHaveTextContent(/não conseguimos registrar/i);
    expect(screen.queryByRole('link', { name: /7 perguntas/i })).not.toBeInTheDocument();
    // O formulário continua na tela para tentar de novo.
    expect(screen.getByLabelText(/seu nome/i)).toBeInTheDocument();
  });

  it('chama a função de notificação com o tipo e a origem', async () => {
    montar();
    await preencherEEnviar();

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [url, opcoes] = (fetch as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0] as [string, { body: string }];
    expect(url).toBe('/.netlify/functions/notificar-lead');
    expect(JSON.parse(opcoes.body)).toEqual({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      tipo: 'material',
      referencia: 'sete-perguntas',
      origem: '/artigos/o-que-e-pnl',
    });
  });

  it('não mostra erro quando só a notificação por e-mail falha', async () => {
    /* O lead já está gravado quando o aviso roda. Se uma falha ali virasse
       erro na tela, a pessoa tentaria de novo e criaria um lead duplicado
       — perdendo-se um contato bom por causa de um e-mail que não saiu. */
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('502')));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    montar();
    await preencherEEnviar();

    expect(
      await screen.findByRole('link', { name: new RegExp(material.titulo, 'i') }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('não grava duas vezes com dois cliques seguidos', async () => {
    addDoc.mockReturnValue(new Promise(() => {}));
    montar();
    const user = await preencherEEnviar();

    const botao = screen.getByRole('button', { name: /enviando/i });
    expect(botao).toBeDisabled();
    await user.click(botao);
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it('exige nome e e-mail antes de enviar', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('button', { name: /quero o guia/i }));
    expect(addDoc).not.toHaveBeenCalled();
  });
});
