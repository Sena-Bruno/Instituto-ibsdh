import { Helmet } from '@dr.pogodin/react-helmet';
import { routes, site } from '../config/site';
import { fundador, grafo, organizacao, websiteDoInstituto } from '../lib/schema';

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
  artigo,
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
  /**
   * Os nós de dados estruturados DESTA página.
   *
   * A organização, o fundador e o site não entram aqui: são emitidos
   * sempre, mais abaixo. Ver o comentário do bloco JSON-LD.
   */
  dados?: object[];
  /**
   * Os metadados que o `og:type: article` carrega, quando a página é um
   * artigo. Existem porque o Open Graph é o que os agregadores, os
   * leitores de feed e os rastreadores que não executam JavaScript leem —
   * e para eles, `og:type="article"` sem data nem autor é um artigo sem
   * procedência. O Google usa o JSON-LD e não depende disto.
   */
  artigo?: { publicadoEm: string; revisadoEm?: string; secao: string };
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
      {/*
        Largura e altura declaradas, sempre.

        Sem elas o WhatsApp e o Facebook só desenham o cartão depois de
        baixar a imagem inteira, e o link fica alguns segundos sem prévia —
        que é justamente quando a pessoa já rolou a conversa.

        Os números são fixos porque TODA imagem passada em `imagem` é uma
        peça 1200×630. Não é convenção frouxa: uma arte em retrato é
        cortada no centro pelo WhatsApp e pelo LinkedIn, e nas capas deste
        site o centro é a ilustração — o título fica de fora. Cartão social
        é peça própria, gerada por `scripts/cartoes-sociais.mjs`, e não a
        capa da página.
      */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {imagemAlt ? <meta property="og:image:alt" content={imagemAlt} /> : null}

      {artigo ? (
        <>
          <meta property="article:published_time" content={artigo.publicadoEm} />
          <meta
            property="article:modified_time"
            content={artigo.revisadoEm ?? artigo.publicadoEm}
          />
          <meta property="article:author" content={`${site.url}${routes.sobre}`} />
          <meta property="article:section" content={artigo.secao} />
        </>
      ) : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={urlImagem} />

      {/*
        Um bloco só, com os nós amarrados por `@id`. Vários blocos
        separados fariam a mesma organização ser descrita quatro vezes na
        mesma página, e bastaria um deles ficar para trás numa edição para
        a página passar a se contradizer.

        ┌───────────────────────────────────────────────────────────────────┐
        │  OS TRÊS NÓS DE IDENTIDADE SAEM DAQUI, E NÃO DAS PÁGINAS          │
        │                                                                   │
        │  `organizacao()` referencia o fundador por `@id`, e                │
        │  `paginaDeContato()` referencia o site. Enquanto cada página       │
        │  montava a própria lista, dezessete das dezenove emitiam uma       │
        │  referência a um nó que NÃO estava no grafo — inclusive os sete    │
        │  artigos, cujo `author` é justamente esse nó.                      │
        │                                                                   │
        │  Isso não quebra validador nenhum: o JSON continua válido, o       │
        │  teste de resultados enriquecidos não reprova a página, e o autor  │
        │  do artigo simplesmente resolve para um nó sem nome. O site fazia  │
        │  o trabalho caro — escrever os textos, criar a /sobre como página  │
        │  de autoria, apontar o `url` do fundador para lá — e perdia o      │
        │  sinal num detalhe de montagem que ninguém tinha como ver.         │
        │                                                                   │
        │  Emitidos daqui, os três existem em toda página que tem JSON-LD, e │
        │  uma página não tem como esquecer. `dados` passa a ser só o que é  │
        │  DESTA página. O `prerender.mjs` confere, a cada rota, que não     │
        │  sobrou referência pendente.                                       │
        └───────────────────────────────────────────────────────────────────┘
      */}
      {/*
        O portão é `indexar`, e não "a página trouxe nós próprios".

        Era `dados.length > 0`, o que amarrava a identidade do site a um
        detalhe de cada página: a /termos e a /privacidade só emitiam
        JSON-LD porque alguém lembrou de passar `organizacao()` à mão, e
        no dia em que esse nó saísse das listas — que é exatamente o que
        esta mudança faz — as duas ficariam sem dados estruturados nenhum,
        em silêncio.

        Página fora do índice não tem resultado de busca para enriquecer,
        e por isso continua sem bloco nenhum: o material entregue em troca
        de contato, o /admin, o 404 e o rascunho de artigo.
      */}
      {indexar ? (
        <script type="application/ld+json">
          {JSON.stringify(grafo(organizacao(), fundador(), websiteDoInstituto(), ...dados))}
        </script>
      ) : null}
    </Helmet>
  );
}
