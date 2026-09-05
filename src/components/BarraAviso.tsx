import { ArrowRight } from 'lucide-react';
import { aviso } from '../config/site';

/**
 * A faixa de aviso no topo da página.
 *
 * É o padrão comum às cinco referências que o Bruno apontou: uma linha fina,
 * em cor cheia, acima de tudo. Funciona porque é o único elemento da página
 * que a pessoa lê antes de decidir se rola — e porque é curta.
 *
 * ── Duas decisões que parecem detalhe e não são ─────────────────────────
 *
 * NÃO É FIXA. Ela rola junto e sai da tela. Barra de aviso grudada no topo
 * come altura útil em toda página, e no celular a soma dela com o cabeçalho
 * fixo já passava de um sétimo da tela. Ela cumpre o papel no primeiro
 * segundo e depois sai do caminho.
 *
 * NÃO TEM BOTÃO DE FECHAR. Um "×" pede um estado guardado por visitante e
 * uma decisão sobre quando o aviso volta, e do lado de fora rende um clique
 * a mais para quem só queria ler a página. Como ela some ao rolar, fechar
 * não resolve nada que rolar já não resolva.
 *
 * O conteúdo e o liga-desliga estão em `config/site.ts`, na chave `aviso`.
 */
export default function BarraAviso() {
  if (!aviso.ativa) return null;

  const conteudo = (
    <>
      <span className="font-semibold">{aviso.texto}</span>
      {/* O complemento sai no celular. Com ele a barra quebrava em duas
          linhas e passava a ocupar um oitavo da tela antes de qualquer
          conteúdo — numa faixa cuja graça é ser fina. */}
      {aviso.complemento && (
        <>
          <span aria-hidden="true" className="hidden text-brand-dark/35 sm:inline">
            ·
          </span>
          <span className="hidden text-brand-dark/75 sm:inline">{aviso.complemento}</span>
        </>
      )}
      {aviso.href && (
        <span className="ml-1 hidden items-center gap-1.5 font-semibold underline decoration-brand-dark/30 underline-offset-4 group-hover:decoration-brand-dark sm:inline-flex">
          {aviso.chamada}
          <ArrowRight size={13} aria-hidden="true" />
        </span>
      )}
    </>
  );

  const classes =
    'group flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 bg-brand-accent px-5 py-2.5 text-center font-display text-[12.5px] tracking-[0.08em] text-brand-dark uppercase';

  return aviso.href ? (
    <a href={aviso.href} className={classes}>
      {conteudo}
    </a>
  ) : (
    <div className={classes}>{conteudo}</div>
  );
}
