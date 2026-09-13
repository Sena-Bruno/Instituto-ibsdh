import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WaitlistForm from './WaitlistForm';

/*
  O Firestore (a variante `lite`, que é a que o site público usa) é
  substituído inteiro: o objetivo é verificar o que o
  componente FAZ com o resultado, não falar com o banco de verdade. Um teste
  que escrevesse na coleção real encheria a lista de espera de lixo a cada
  execução — e a lista é o produto deste formulário.
*/
const addDoc = vi.hoisted(() => vi.fn());
vi.mock('firebase/firestore/lite', () => ({
  addDoc,
  collection: vi.fn((_db, nome: string) => ({ nome })),
  serverTimestamp: vi.fn(() => 'HORA-DO-SERVIDOR'),
}));
vi.mock('../firebase/banco', () => ({ db: {} }));

/**
 * Testes do formulário da lista de espera.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTE COMPONENTE, ENTRE TODOS                                 │
 * │                                                                       │
 * │  É o único ponto de captação do site, e a versão original dele        │
 * │  descartava todos os leads: chamava `alert('Você foi adicionado…')` e │
 * │  `reset()` sem gravar em lugar nenhum. O visitante lia a confirmação, │
 * │  o instituto nunca recebia o contato, e nada em tela nenhuma indicava │
 * │  o problema — o formulário se comportava exatamente como um           │
 * │  formulário que funciona.                                            │
 * │                                                                       │
 * │  É a classe de falha que só um teste pega: silenciosa, com aparência  │
 * │  de sucesso, e no caminho que gera receita.                          │
 * └───────────────────────────────────────────────────────────────────────┘
 */
describe('WaitlistForm', () => {
  beforeEach(() => {
    addDoc.mockReset();
    addDoc.mockResolvedValue({ id: 'doc-novo' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }));
  });

  const preencherEEnviar = async (nome = 'Maria Silva', email = 'maria@exemplo.com') => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/seu nome/i), nome);
    await user.type(screen.getByLabelText(/seu melhor e-mail/i), email);
    await user.click(screen.getByRole('button', { name: /notificação prioritária/i }));
    return user;
  };

  it('grava o cadastro no Firestore', async () => {
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      courseId: 'master-coach',
      createdAt: 'HORA-DO-SERVIDOR',
    });
  });

  it('normaliza o que foi digitado', async () => {
    /*
      O e-mail vira minúsculo e os dois campos perdem o espaço das pontas.
      Sem isso, "Maria@Exemplo.com " e "maria@exemplo.com" entram na lista
      como duas pessoas, e o mesmo lead é contado duas vezes.
    */
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar('  Maria Silva  ', '  MARIA@Exemplo.COM  ');

    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
    });
  });

  it('mostra a confirmação e esconde o formulário no sucesso', async () => {
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    expect(await screen.findByText(/cadastro confirmado/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/seu nome/i)).not.toBeInTheDocument();
  });

  it('avisa que falhou quando o Firestore recusa, sem dizer que deu certo', async () => {
    addDoc.mockRejectedValue(
      Object.assign(new Error('recusado'), { code: 'permission-denied' }),
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    const aviso = await screen.findByRole('alert');
    expect(aviso).toHaveTextContent(/não conseguimos registrar seu cadastro/i);
    /* Uma recusa do servidor NÃO é problema de conexão. A mensagem antiga
       dizia "verifique sua conexão" para toda falha, e mandava a pessoa
       procurar o problema no lugar em que ele não estava. */
    expect(aviso).not.toHaveTextContent(/conexão/i);
    // E dá a saída, para o cadastro não se perder num defeito nosso.
    expect(aviso).toHaveTextContent(/contato@institutobrunosena\.com\.br/);
    expect(screen.queryByText(/cadastro confirmado/i)).not.toBeInTheDocument();
    // O formulário continua na tela, com o que foi digitado, para tentar de novo.
    expect(screen.getByLabelText(/seu nome/i)).toBeInTheDocument();
  });

  /**
   * O aviso por e-mail é acessório e o cadastro já está salvo quando ele
   * roda. Se uma falha ali virasse erro na tela, o visitante tentaria de
   * novo e criaria um cadastro duplicado — perdendo-se um lead bom por
   * causa de um e-mail que não saiu.
   *
   * Este é o teste que guarda essa decisão. Ela é invisível no código: um
   * `.catch(console.error)` a mais ou a menos não muda nada visível até o
   * dia em que o Resend responde 502 — que é o estado atual da função.
   */
  it('não mostra erro quando só a notificação por e-mail falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('502')));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    expect(await screen.findByText(/cadastro confirmado/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('chama a função de notificação com os dados do lead', async () => {
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [url, opcoes] = (fetch as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0] as [string, { body: string }];
    expect(url).toBe('/.netlify/functions/notificar-lead');
    expect(JSON.parse(opcoes.body)).toEqual({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      /* `tipo` e `referencia` no lugar de `courseId`: a mesma função avisa
         a lista de espera e a captação de material dos artigos, e é o
         `tipo` que decide o assunto do e-mail. */
      tipo: 'lista-de-espera',
      referencia: 'master-coach',
      /* A página em que o formulário foi preenchido. Sem campanha na URL
         do teste, `campanha` não existe no corpo — e é assim que ela sai
         para quem chega ao site sem etiqueta, que é a maioria. */
      origem: '/',
    });
  });

  /**
   * ┌───────────────────────────────────────────────────────────────────────┐
   * │  ESTA LISTA CHEGAVA ANÔNIMA QUANTO À PROCEDÊNCIA                      │
   * │                                                                       │
   * │  Gravava nome, e-mail e curso. Quem anunciasse no Instagram recebia   │
   * │  o cadastro sem nenhuma forma de saber que ele veio do anúncio — e a  │
   * │  lista de espera é justamente a de quem está mais perto de comprar.   │
   * │                                                                       │
   * │  A falha era invisível: o formulário funcionava, o lead entrava, e a  │
   * │  informação que faltava só se percebia meses depois, ao tentar        │
   * │  comparar duas campanhas.                                             │
   * └───────────────────────────────────────────────────────────────────────┘
   */
  it('grava a origem e a campanha junto com o cadastro', async () => {
    window.history.replaceState({}, '', '/master-coach?utm_source=instagram&utm_medium=cpc');

    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(addDoc.mock.calls[0][1]).toMatchObject({
      courseId: 'master-coach',
      origem: '/master-coach',
      campanha: 'instagram / cpc / -',
    });

    window.history.replaceState({}, '', '/');
  });

  /**
   * A rede contra a janela entre o deploy do site e a publicação das
   * regras do Firestore. Publicar regra é um passo à parte, e entre um e
   * outro o site já envia campos que as regras ainda não aceitam.
   *
   * Sem esta rede, TODO cadastro feito nessa janela seria recusado — que é
   * exatamente o que já aconteceu neste site quando a coleção `leads`
   * entrou no ar com a regra escrita e não publicada.
   */
  it('grava sem os campos novos se as regras ainda não os aceitam', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    addDoc
      .mockRejectedValueOnce(
        Object.assign(new Error('recusado'), { code: 'permission-denied' }),
      )
      .mockResolvedValueOnce({ id: 'doc-novo' });

    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    // O lead entra na segunda tentativa, sem etiqueta — e o visitante vê
    // a confirmação, não um erro.
    expect(await screen.findByText(/cadastro confirmado/i)).toBeInTheDocument();
    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(addDoc.mock.calls[1][1]).not.toHaveProperty('campanha');
  });

  it('não grava duas vezes com dois cliques seguidos', async () => {
    /*
      `addDoc` que nunca resolve mantém o componente em 'submitting', que é
      o estado em que o segundo clique tem de ser ignorado. Sem a guarda, um
      duplo clique num toque lento grava o mesmo lead duas vezes.
    */
    addDoc.mockReturnValue(new Promise(() => {}));
    render(<WaitlistForm courseId="master-coach" />);
    const user = await preencherEEnviar();

    const botao = screen.getByRole('button', { name: /enviando/i });
    expect(botao).toBeDisabled();
    await user.click(botao);
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it('desabilita os campos durante o envio', async () => {
    addDoc.mockReturnValue(new Promise(() => {}));
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    await waitFor(() => expect(screen.getByLabelText(/seu nome/i)).toBeDisabled());
    expect(screen.getByLabelText(/seu melhor e-mail/i)).toBeDisabled();
  });

  it('exige nome e e-mail antes de enviar', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm courseId="master-coach" />);
    await user.click(screen.getByRole('button', { name: /notificação prioritária/i }));
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('grava na coleção waitlist, e não em outra', async () => {
    const { collection } = await import('firebase/firestore/lite');
    render(<WaitlistForm courseId="master-coach" />);
    await preencherEEnviar();

    await waitFor(() => expect(addDoc).toHaveBeenCalled());
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'waitlist');
  });
});
