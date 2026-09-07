import { Helmet } from '@dr.pogodin/react-helmet';
import { site } from '../config/site';
import { grafo } from '../lib/schema';

/**
 * O `<head>` de uma página, num lugar só.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO SUBSTITUIU OS <Helmet> SOLTOS                           │
 * │                                                                       │
 * │  Cada página escrevia o próprio bloco de meta tags à mão, e as nove   │
 * │  divergiam: só algumas declaravam `og:type`, nenhuma declarava        │
 * │  `og:locale` nem `og:site_name` (que viviam no index.html e sumiam    │
 * │  assim que o Helmet assumia o <head>), o Twitter recebia só o         │
 * │  `card` sem título nem imagem, e três páginas de curso anunciavam     │
 * │  `og:type: article` — que descreve um texto assinado com data, não    │
 * │  uma página de formação.                                              │
 * │                                                                       │
 * │  Agora existe um caminho só. Uma tag que falta aqui falta em todas as │
 * │  páginas de uma vez, o que é um erro que se vê; uma tag que faltava   │
 * │  numa página só era um erro que ninguém via.                          │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function Seo({
  titulo,
  descricao,
  rota,
  imagem = '/og-image.png',
  imagemAlt,
  tipo = 'website',
  indexar = true,
  dados = [],
}: {
  titulo: string;
  descricao: string;
  /** O caminho da página, começando com `/`. Vira o canônico absoluto. */
  rota: string;
  /** Caminho da imagem de compartilhamento, a partir da raiz do site. */
  imagem?: string;
  imagemAlt?: string;
  tipo?: 'website' | 'article' | 'profile';
  /** `false` põe a página fora do índice. Use para telas internas. */
  indexar?: boolean;
  /** Os nós de dados estruturados desta página. */
  dados?: object[];
}) {
  /*
    O canônico precisa ser absoluto, com protocolo e domínio. Um caminho
    relativo (`/hipnoterapia`) é resolvido de formas diferentes conforme o
    endereço em que o rastreador entrou — e uma das resoluções possíveis é
    a variante com `www`, que é exatamente a duplicata que a etiqueta
    existe para eliminar.
  */
  const url = `${site.url}${rota === '/' ? '/' : rota}`;
  const urlImagem = `${site.url}${imagem}`;

  return (
    <Helmet>
      <title>{titulo}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={descricao} />

      {/*
        `max-image-preview:large` e `max-snippet:-1` autorizam o Google a
        mostrar a imagem grande e o trecho inteiro — inclusive nas
        respostas geradas por IA, que herdam esses limites. Sem a
        diretiva, o padrão é conservador e o resultado sai menor do que
        poderia, sem que nada no site indique o motivo.
      */}
      <meta
        name="robots"
        content={
          indexar
            ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
            : 'noindex, nofollow'
        }
      />

      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content={tipo} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descricao} />
      <meta property="og:image" content={urlImagem} />
      {imagemAlt ? <meta property="og:image:alt" content={imagemAlt} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={urlImagem} />

      {/*
        Um bloco só, com os nós amarrados por `@id`. Vários blocos
        separados fariam a mesma organização ser descrita quatro vezes na
        mesma página, e bastaria um deles ficar para trás numa edição para
        a página passar a se contradizer.
      */}
      {dados.length > 0 ? (
        <script type="application/ld+json">{JSON.stringify(grafo(...dados))}</script>
      ) : null}
    </Helmet>
  );
}
