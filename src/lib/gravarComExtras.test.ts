import { describe, expect, it, vi } from 'vitest';
import { gravarComExtras } from './gravarComExtras';

const recusa = (codigo: string) => Object.assign(new Error('recusado'), { code: codigo });

/**
 * Testes da rede que impede a janela de deploy de derrubar a captação.
 *
 * O caso que isto previne é real e já aconteceu neste site: regra escrita,
 * regra não publicada, e todo lead recusado até alguém ler o código para
 * entender por quê. Ver `erroDeFirestore.ts`.
 */
describe('gravarComExtras', () => {
  it('grava com os campos extras quando o Firestore aceita', async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    await gravarComExtras(gravar, { origem: '/artigos/x', campanha: 'instagram / cpc / -' });

    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar).toHaveBeenCalledWith({
      origem: '/artigos/x',
      campanha: 'instagram / cpc / -',
    });
  });

  it('descarta o extra vazio em vez de mandar undefined', async () => {
    /* O SDK do Firestore recusa `undefined` dentro de um documento: o
       campo precisa simplesmente não existir. */
    const gravar = vi.fn().mockResolvedValue(undefined);
    await gravarComExtras(gravar, { origem: '/', campanha: undefined });

    expect(gravar).toHaveBeenCalledWith({ origem: '/' });
  });

  it('grava sem os extras quando as regras ainda não os conhecem', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const gravar = vi
      .fn()
      .mockRejectedValueOnce(recusa('permission-denied'))
      .mockResolvedValueOnce(undefined);

    await expect(
      gravarComExtras(gravar, { campanha: 'instagram / cpc / -' }),
    ).resolves.toBeUndefined();

    // A segunda tentativa vai sem nada a mais — o lead entra, sem etiqueta.
    expect(gravar).toHaveBeenCalledTimes(2);
    expect(gravar).toHaveBeenLastCalledWith({});
  });

  it('diz no console o comando que resolve de verdade', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const gravar = vi
      .fn()
      .mockRejectedValueOnce(recusa('permission-denied'))
      .mockResolvedValueOnce(undefined);

    await gravarComExtras(gravar, { campanha: 'x / y / z' });

    expect(warn.mock.calls[0][0]).toContain('firebase deploy --only firestore:rules');
  });

  it('não engole uma recusa que não é de campo desconhecido', async () => {
    /* Sem esta linha, uma coleção fechada por engano viraria "gravou" e o
       visitante leria a confirmação de um cadastro que não existe — que é
       precisamente a falha que a versão original deste formulário tinha. */
    const gravar = vi.fn().mockRejectedValue(recusa('unavailable'));

    await expect(gravarComExtras(gravar, { campanha: 'x / y / z' })).rejects.toThrow();
    expect(gravar).toHaveBeenCalledTimes(1);
  });

  it('não tenta duas vezes quando não havia extra nenhum', async () => {
    const gravar = vi.fn().mockRejectedValue(recusa('permission-denied'));

    await expect(gravarComExtras(gravar, { campanha: undefined })).rejects.toThrow();
    expect(gravar).toHaveBeenCalledTimes(1);
  });
});
