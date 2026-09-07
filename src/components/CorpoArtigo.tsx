import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Bloco } from '../config/artigos';
import type { NomeCor } from '../lib/cores';
import { paletas } from '../lib/cores';

/**
 * Renderiza o corpo de um artigo a partir dos blocos de `artigos.ts`.
 *
 * O conteúdo é texto puro, não JSX, para que escrever um artigo não exija
 * saber programar. O preço disso é uma marcação mínima embutida no texto,
 * tratada aqui:
 *
 *   **negrito**            → <strong>
 *   [texto](/rota)         → link interno, com navegação do React Router
 *   [texto](https://…)     → link externo, com rel="noopener noreferrer"
 *
 * Deliberadamente não há suporte a HTML no texto. Um artigo é conteúdo, e
 * conteúdo que vira marcação é conteúdo que pode quebrar a página — ou
 * injetar o que não devia.
 */

/** Divide o texto na marcação mínima e devolve os nós já montados. */
function comMarcacao(texto: string): ReactNode[] {
  const partes: ReactNode[] = [];
  // Um passe só, alternando entre **negrito** e [rótulo](destino).
  const padrao = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let ultimo = 0;
  let achado: RegExpExecArray | null = padrao.exec(texto);
  let chave = 0;

  while (achado !== null) {
    if (achado.index > ultimo) partes.push(texto.slice(ultimo, achado.index));

    const [, negrito, rotulo, destino] = achado;
    if (negrito !== undefined) {
      partes.push(
        <strong key={chave} className="font-semibold text-brand-cream">
          {negrito}
        </strong>,
      );
    } else if (rotulo !== undefined && destino !== undefined) {
      const externo = /^https?:\/\//.test(destino);
      partes.push(
        externo ? (
          <a
            key={chave}
            href={destino}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-accent underline underline-offset-4 hover:no-underline"
          >
            {rotulo}
          </a>
        ) : (
          <Link
            key={chave}
            to={destino}
            className="text-brand-accent underline underline-offset-4 hover:no-underline"
          >
            {rotulo}
          </Link>
        ),
      );
    }

    chave += 1;
    ultimo = achado.index + achado[0].length;
    achado = padrao.exec(texto);
  }

  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}

export default function CorpoArtigo({ blocos, cor }: { blocos: Bloco[]; cor: NomeCor }) {
  const p = paletas[cor];

  return (
    <div className="flex flex-col gap-6">
      {blocos.map((bloco, i) => {
        // O índice serve de chave porque a ordem dos blocos é o conteúdo:
        // um artigo não reordena nem remove blocos em tempo de execução.
        const chave = `${bloco.tipo}-${i}`;

        switch (bloco.tipo) {
          case 'subtitulo':
            return (
              <h2
                key={chave}
                className="mt-6 font-display text-[26px] leading-tight font-bold text-brand-cream md:text-[30px]"
              >
                {bloco.texto}
              </h2>
            );

          case 'lista':
            return (
              <ul key={chave} className="flex flex-col gap-3 pl-1">
                {bloco.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.fundo}`}
                    />
                    <span>{comMarcacao(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'citacao':
            return (
              <blockquote
                key={chave}
                className={`border-l-2 ${p.borda} bg-white/[0.03] py-5 pr-6 pl-6 text-[17px] leading-relaxed text-white/80 italic`}
              >
                {comMarcacao(bloco.texto)}
                {bloco.autor ? (
                  <footer className="mt-3 text-[14px] not-italic text-brand-quiet">
                    — {bloco.autor}
                  </footer>
                ) : null}
              </blockquote>
            );

          case 'destaque':
            return (
              <aside key={chave} className="cartao p-6">
                {bloco.titulo ? (
                  <p className={`sobretitulo mb-3 ${p.texto}`}>{bloco.titulo}</p>
                ) : null}
                <p className="text-[16.5px] leading-relaxed">{comMarcacao(bloco.texto)}</p>
              </aside>
            );

          default:
            return (
              <p key={chave} className="text-[17px] leading-relaxed">
                {comMarcacao(bloco.texto)}
              </p>
            );
        }
      })}
    </div>
  );
}
