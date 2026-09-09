# Instituto Bruno Sena

Site das formações em PNL, Hipnoterapia e Coaching do Instituto Bruno Sena
(IBSDH).

React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Firebase

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção: pacote, pré-renderização das rotas e sitemap |
| `npm run preview` | Serve o build para conferência |
| `npm run lint` | Tipos + Biome (o que o CI roda) |
| `npm run check:fix` | Corrige lint e formatação automaticamente |
| `npm run knip` | Procura código e dependências sem uso |
| `npm run smoke` | Teste de navegador nas rotas públicas (com o preview no ar) |

O `smoke` percorre as rotas públicas e falha se encontrar imagem quebrada,
CTA de compra sem destino, título duplicado ou ausente, erro de console —
ou, com **o JavaScript desligado**, uma página sem título próprio, sem
canônico, sem dados estruturados ou sem texto no corpo. Essa última parte
é o que protege a pré-renderização: tudo o mais passaria igual num site
que só monta o conteúdo no navegador. O Playwright fica fora das
dependências de propósito — ele baixa centenas de MB de navegadores na
instalação, o que só atrasaria o build de produção:

```bash
npm install --no-save playwright
npm run build && npm run preview &
npm run smoke
```

> **Sobre o `react-helmet-async`:** o projeto usa
> `@dr.pogodin/react-helmet`, e não o pacote original. A versão 2.0.5 do
> original não declara suporte a React 19 e trava o `npm install` com
> ERESOLVE; a 3.0.0 instala, mas **injeta um segundo `<title>` em vez de
> substituir o do `index.html`** — e crawlers usam o primeiro, o que faria
> todas as páginas perderem o título próprio. Isso foi verificado com o
> `npm run smoke`. Não troque o pacote sem rodar esse teste.

## Linguagem visual

A referência foram cinco sites de institutos e infoprodutos brasileiros
apontados pelo Bruno. Comparando com o nosso, três diferenças explicavam
quase toda a distância — e nenhuma delas era "mais cor" ou "mais efeito".

**1. Tipografia com voz.** Os cinco usam um display estreito e pesado em
caixa alta; a maioria usa Oswald. O título ocupa a largura inteira sem
encolher de corpo e lê como algo gravado. Nós usávamos Outfit e Inter, as
duas fontes padrão de produto de software: geométricas, de largura uniforme,
e fazem qualquer página parecer painel de aplicativo. Hoje é **Oswald** no
display e **Lato** no texto, servidas do próprio domínio.

**2. Tinta quente sobre fundo frio.** As referências escrevem em branco
amarelado sobre um fundo quase preto e levemente frio, e é esse contraste de
temperatura que faz o dourado cantar. Nós escrevíamos em cinza azulado sobre
fundo azulado: tudo na mesma temperatura, e o dourado sumia. Os fundos
ficaram como estavam; a tinta esquentou.

**3. Menos cor, não mais.** A referência mais bem resolvida usa um acento só.
A nossa usava dourado no sobretítulo, no destaque do título, no número, no
selo e no botão — cinco papéis para a mesma cor, então o botão não se
destacava de nada.

**A cor por eixo continua sendo orientação.** Azul é PNL, roxo é
Hipnoterapia, verde é Coaching, dourado são as Jornadas. Ela identifica: a
régua do card, o ponto do menu, a régua do cabeçalho de seção, o brilho e a
borda da página do curso.

### As regras

1. **Dourado é ação.** Quem vê um bloco dourado sabe que clica ali. Enfeite
   dourado ficou restrito a uma palavra por título (`texto-gradiente`).
2. **Botão de eixo só onde a cor governa o bloco inteiro** — a página de uma
   formação, ou uma seção com assunto próprio, como a de In Company. Nunca
   ao lado de uma ação de compra na home: dois botões coloridos obrigam a
   pessoa a decidir qual é o principal.
3. **Toda seção começa igual:** régua colorida, sobretítulo em cinza,
   título em caixa alta. É o que faz dezesseis seções lerem como uma
   sequência em vez de dezesseis páginas empilhadas.
4. **Seções vizinhas alternam o fundo** (`elevada` no `Secao`, que aplica
   `brand-band`). Sem isso a home é um retângulo escuro de treze mil pixels.
5. **Entrelinha de título não desce de 1,08.** Em português a caixa alta
   carrega Ê, Ã, Á e Ô, e o acento precisa do espaço acima das maiúsculas.
   Com 0,96 o circunflexo de "VOCÊ" batia na linha de cima.
6. **Brilho tem dono.** A classe `.brilho` herda a cor da seção pela variável
   `--brilho`, e só entra onde a seção tem cor. O site já teve 33 orbes
   idênticos, um por seção — como tudo brilhava igual, nada se destacava.
7. **Cor vem de `lib/cores.ts`.** As classes ficam escritas por extenso, não
   montadas por template: o Tailwind varre o código em busca de nomes
   literais, e uma string como `` `text-brand-${cor}` `` some do CSS final.
8. **Para apagar um texto, troque o token.** `brand-cream` (17,4:1),
   `brand-platinum` (10,6:1) e `brand-quiet` (6,3:1) passam folgado o mínimo
   4,5:1 do WCAG AA. Opacidade não — foi assim que o site chegou a ter 37
   usos de um tom a 3,4:1.

### As fontes

Ficam em `public/fontes/`, declaradas em `src/fontes.css`. Vinham do
`fonts.googleapis.com`, que custa duas conexões novas antes de qualquer
texto aparecer e coloca a tipografia na dependência de um terceiro. Só as
faixas latin e latin-ext foram baixadas — 202 KB no total.

Para atualizar, refaça a busca no Google Fonts e substitua `src/fontes.css`
inteiro. Não edite à mão.

### As artes das formações

Cada formação tem **dois** arquivos em `public/`, apontados por `capa` e
`capaFaixa` em `courses.ts`:

| Arquivo | Onde aparece | Formato |
|---|---|---|
| `capa-<curso>.webp` | Página do curso, ao lado do título | Pôster inteiro, em pé, 760px de largura |
| `capa-<curso>-faixa.webp` | Card na home e no catálogo | Recorte deitado, 860×573 |

São dois porque servem a coisas diferentes. O pôster em pé cabe na página do
curso, onde há altura para ele e onde o nome impresso na arte é bem-vindo. No
card ele não serve: deixaria a grade altíssima, e o nome impresso apareceria
logo acima do nome que o card já escreve — a mesma palavra duas vezes, com
dois desenhos diferentes. Por isso a faixa mostra só o grafismo.

**Para acrescentar a arte de uma formação nova:**

1. Ponha o pôster original em `public/` como `capa-<curso>.webp`, com 760px
   de largura. Os originais chegam com 1728px e mais de 1,5 MB cada.
2. Gere a faixa: recorte 3:2, com 6% de margem lateral, centrado onde está o
   grafismo — entre o nome do instituto, em cima, e o nome da formação,
   embaixo. A fração exata da altura varia por pôster, então confira o
   resultado antes de publicar: sobra de texto no topo ou no rodapé do
   recorte é o erro comum.
3. Preencha `capa` e `capaFaixa` na entrada do curso em `courses.ts`.

**Sobre marca-d'água.** As artes vêm de gerador de imagem, e algumas chegam
com a marca do gerador num canto. Ela sai antes de subir: como o fundo dessas
capas é liso, o jeito limpo é reconstruir a área por interpolação horizontal
linha a linha, ligando o pixel à esquerda da marca ao pixel à direita. Cor
chapada deixaria um retângulo visível, porque o degradê muda de valor ao
longo da altura.

**Curso sem arte não quebra nada.** O card cai na reserva do `CourseImage`,
que ocupa exatamente a mesma altura e escreve "imagem pendente" — a grade não
desalinha e fica claro que falta um arquivo. Hoje todas as formações têm
arte, então essa reserva não aparece em lugar nenhum.

### Componentes que carregam a linguagem

| Componente | Para quê |
|---|---|
| `BarraAviso` | A faixa dourada no topo — conteúdo em `site.ts`, chave `aviso` |
| `Secao` + `Cabecalho` | Seção com régua, sobretítulo, título grande e brilho opcional |
| `CardCurso` | O card de formação, dono de uma cor |
| `Numeros` | A faixa de números grandes |
| `PaginaCurso` / `SecaoCurso` | Página de formação, com a coluna de compra fixa |
| `Comparativo` | Tabela de duas colunas |
| `ListaItens` | O que era grid de card com ícone |
| `Ementa` | Currículo vindo de `config/curriculos.ts` |
| `SenaSimulador` | A demonstração interativa do simulador |

### Classes utilitárias

`titulo-hero` e `titulo-secao` para os títulos em caixa alta; `titulo-card`
para nome de card, que fica em caixa normal de propósito (caixa alta se lê
pelo desenho da palavra inteira, o que atrapalha numa lista onde a pessoa
está comparando nomes); `sobretitulo` para o rótulo cinza; `regua-secao`
para o traço colorido que abre a seção; `texto-gradiente` para a palavra em
dourado (uma por título, no máximo — se aparecer em todos, deixa de
destacar); `fato` para o par ícone/texto das linhas de fatos; `cartao`,
`cartao-vidro`, `faixa-accent`, `selo` para as superfícies.

## Movimento

`src/lib/motion.ts` guarda durações, curvas e variantes — pelo mesmo motivo
de preços e contatos: valor repetido no JSX diverge com o tempo.

As escolhas seguem
[design-motion-principles](https://github.com/kylezantos/design-motion-principles),
com a lente indicada para site de marketing: polimento sutil na faixa de
200–500ms, e movimento rápido ou nenhum em navegação e formulários, que
são de uso frequente. A regra que decide caso a caso: **a melhor animação
é a que passa despercebida** — se o visitante repara na animação em vez do
conteúdo, ela está grande demais para uma página que precisa vender.

Dois pontos que é fácil quebrar sem perceber, e por isso o `npm run smoke`
verifica:

- **Saída também anima.** Um painel que entra suave e some num corte seco
  passa impressão de falha. Todo bloco condicional fica dentro de
  `AnimatePresence`.
- **`prefers-reduced-motion` vale para o site inteiro.** A regra em
  `index.css` cobre transições de CSS, mas o Motion anima por JavaScript e
  passaria por cima dela — quem garante o resto é o `MotionConfig
  reducedMotion="user"` em `App.tsx`.

Indicadores de carregamento usam `useDelayedFlag`, que só os exibe depois
de 220ms: numa conexão boa a resposta chega antes disso, e um skeleton que
aparece e some incomoda mais do que a espera.

## Qualidade e monitoramento

**CI** (`.github/workflows/ci.yml`) roda em todo PR: mensagens de commit,
tipos, Biome, Knip, contrato de arquitetura, testes com cobertura, build e o
teste de navegador sobre o build real. Usa `npm ci`, que falha se o
`package-lock.json` sair de sincronia com o `package.json` — o tipo exato de
problema que já quebrou um deploy aqui.

### Os testes

| Comando | O que cobre |
| --- | --- |
| `npm test` | Vitest: 72 testes de unidade e integração |
| `npm run test:watch` | O mesmo, reexecutando ao salvar |
| `npm run test:coverage` | Com cobertura (85% de comandos no alvo) |
| `npm run smoke` | Navegador real, nas rotas públicas |
| `npm run arch` | Direção das dependências entre pastas |
| `npm run mutation` | Teste de mutação (lento, sob demanda) |

**O que os testes de unidade cuidam** é a lógica que decide dinheiro e
acesso: preço, checkout, quem é administrador, dados estruturados e o
formulário de captação. São as falhas que ninguém vê acontecer, porque
continuam produzindo tela plausível quando estão erradas — e as três que
este site já teve eram exatamente assim: o formulário que descartava todo
lead com um `alert()` de confirmação, a página que anunciava R$ 997 no topo
e R$ 397 no checkout, e os botões de compra sem destino.

Um deles merece nota: `src/config/admin.test.ts` compara a lista de UID em
`config/admin.ts` com a função `isAdmin()` de `firestore.rules`. As duas
precisam bater, nada além de disciplina as mantinha iguais, e a disciplina
já falhou. Os dois modos de errar têm sintomas opostos e nenhum é óbvio.

**O que o smoke cuida** é o site montado num navegador: rota, CTA com
destino, imagem que carrega, movimento, e o HTML que chega a quem não
executa JavaScript. Coisas que DOM simulado não alcança.

### Ferramentas

**Biome** cobre lint e formatação num binário só. As decisões de regra
estão em [BIOME.md](./BIOME.md), com o motivo de cada uma.

**Knip** encontra código e dependências sem uso. O `playwright` fica em
`ignoreDependencies` de propósito: é instalado sob demanda para o teste de
fumaça e não pode entrar no `package.json`, senão todo build de produção
baixaria centenas de MB de navegadores.

**dependency-cruiser** (`npm run arch`) guarda a direção das dependências,
que é o que o lint não vê por olhar arquivo por arquivo: proíbe ciclo,
`config/` importando componente, `lib/` deixando de ser folha e — o mais
fácil de fazer sem perceber — uma página importando outra, o que junta os
dois chunks e desfaz o code splitting por rota sem que o build acuse nada.

**Commitlint** verifica a mensagem de commit. As regras são de higiene, não
de padrão: o histórico usa dois estilos em partes quase iguais, metade com
prefixo (`feat:`) e metade em frase imperativa, e exigir o prefixo hoje
reprovaria metade dos commits que já estão aqui. O arquivo
`commitlint.config.mjs` explica como ligar Conventional Commits se um dia
você quiser gerar changelog a partir das mensagens.

**Stryker** (`npm run mutation`) mede se os testes PEGAM defeito, e não
quanto código eles visitam: altera o código de propósito e vê se algum teste
reclama. Fica fora do CI porque leva minutos.

Ele já se pagou. O teste "cancela o timer ao desmontar" de `useDelayedFlag`
**passava com o cleanup do hook removido**: avançava 500ms antes de contar os
timers, e nesse avanço o timer disparava sozinho e saía da fila — a contagem
dava zero com ou sem `clearTimeout`. Cobertura de 100% na linha, verificação
nenhuma. Depois da correção, o arquivo mata 12 de 12 mutantes.

O score total é 27%, e o `stryker.config.json` explica por quê em detalhe: o
`schema.ts` tem metade das funções sem teste (parte legítima, é por onde
subir) e outra metade dos mutantes em literais do vocabulário do schema.org,
que só morreriam com um teste que copiasse o arquivo. O limite de reprovação
está logo abaixo do medido, para pegar piora — um verificador que nasce
vermelho é um verificador que todos aprendem a ignorar.

**Sentry** reporta erros de produção — antes, um erro só chegava até o
instituto se algum visitante avisasse. É opcional: sem `VITE_SENTRY_DSN`
definido, o Vite elimina o SDK inteiro no build e o custo é zero. Quando
ativo, o SDK (490 kB) **só é baixado se um erro acontecer** — quem navega
sem problema nunca paga por ele. Configure `VITE_SENTRY_DSN` em
*Netlify → Site settings → Environment variables*.

O rastreamento de desempenho fica desligado de propósito, e vale registrar
por quê: ligá-lo obriga o SDK a carregar em **toda** visita, e o que ele
mediria — Core Web Vitals — o Search Console já entrega de graça, com dados
de campo de visitantes reais. Seria 490 kB cobrados de todo mundo para
duplicar um relatório que já existe.

Datadog, New Relic e OpenTelemetry não entram por um motivo de forma: são
feitos para rastrear requisição atravessando vários serviços. Este site é
estático, com uma função serverless — não há trecho distribuído para
rastrear, e o custo de instrumentação não compraria informação nenhuma que
o log da função e o Sentry já não deem.

## Busca e indexação

O site é pré-renderizado: `npm run build` gera **um arquivo HTML por
rota**, com o texto, os links, o `<title>`, a descrição, o canônico e os
dados estruturados já dentro da primeira resposta HTTP 200.

### Por que isso importa

Antes, o site era uma SPA pura. O servidor devolvia sempre o mesmo
`index.html`, com o `<div id="root">` vazio e sempre o mesmo `<title>`;
tudo o mais aparecia quando o React montava no navegador.

O Google até executa JavaScript, mas em duas etapas separadas: primeiro lê
o HTML cru, depois enfileira a página para um Chromium sem cabeça
renderizar. Essa fila é o gargalo — e nela vale um teto rígido de **2 MB
por recurso**, acima do qual nada é sequer transferido. Pior: robôs de rede
social (WhatsApp, LinkedIn) e boa parte dos rastreadores de IA não têm
segunda etapa nenhuma. Para todos eles, as sete páginas do site eram
literalmente o mesmo documento, com o mesmo título.

O JavaScript continua no lugar: ele hidrata o HTML e devolve a
interatividade. Só deixou de ser condição para o conteúdo existir.

### Como funciona

```
vite build                              → o pacote do navegador
vite build --ssr src/entry-server.tsx   → o mesmo site, para rodar em Node
node scripts/prerender.mjs              → um HTML por rota + o sitemap
```

| Arquivo | Papel |
|---|---|
| `src/config/paginas.ts` | A tabela de rotas: fonte única do roteador, do HTML gerado e do sitemap |
| `src/Rotas.tsx` | A árvore de rotas, compartilhada pelo navegador e pelo servidor |
| `src/entry-server.tsx` | Renderiza uma rota em texto, com o `<head>` que o Helmet produziu |
| `scripts/prerender.mjs` | Injeta corpo e `<head>` no modelo e grava os arquivos |
| `src/components/Seo.tsx` | O `<head>` de cada página, num lugar só |
| `src/lib/schema.ts` | Os dados estruturados JSON-LD |

**Para adicionar uma página:** acrescente uma entrada em
`src/config/paginas.ts`. Ela ganha rota, HTML estático e linha no sitemap
de uma vez — esquecer o sitemap deixou de ser possível.

### Animação e conteúdo legível

As animações de entrada eram `motion` com `initial="hidden"`, o que
gravava `opacity:0` no HTML. Enquanto tudo era montado no navegador isso
não custava nada; com o HTML pré-renderizado, passou a custar o site
inteiro: medido em navegador sem cabeça e **sem JavaScript**, a home
entregava **5%** do texto legível — o envelope de transição de página
envolvia tudo e saía invisível.

A regra agora é uma só: **o HTML sai visível; quem esconde é o
navegador**, dentro da janela entre montar o DOM e pintar a tela
(`useLayoutEffect`). O visitante vê a animação inteira, sem lampejo; quem
não executa JavaScript lê o texto. Vale para `Revela` (entra ao rolar,
`components/Secao.tsx`) e `Entrada` (entra ao abrir, `components/Entrada.tsx`);
os estados vivem em `index.css`, em `[data-revela]` e `[data-entrada]`.

**Ao criar uma animação de entrada, siga esse padrão** — não use
`initial="hidden"` em bloco que contenha texto. O `npm run smoke` falha se
menos de 95% do texto de uma página estiver visível sem JavaScript.

### O que o build recusa publicar

`scripts/prerender.mjs` quebra o build se alguma rota sair sem `<title>`,
sem canônico, com o corpo vazio ou com o skeleton de carregamento no lugar
do conteúdo. São falhas que ninguém veria a olho nu no navegador, porque o
JavaScript conserta a tela — e que só apareceriam meses depois, na queda
das posições.

`npm run smoke` fecha o cerco pelo outro lado: abre cada rota **com o
JavaScript desligado** e confere título, canônico, descrição, JSON-LD, um
único `<h1>`, volume de texto e links internos, além de exigir 404 de
verdade num endereço inventado.

### Dados estruturados

Em JSON-LD, num bloco só por página, com os nós amarrados por `@id`:
`EducationalOrganization` e `Person` (o fundador) em todas; `Course` com
oferta, carga e certificado nas páginas de formação; `BreadcrumbList`,
`FAQPage` e `ItemList` onde há o conteúdo correspondente **visível**.

⚠ **Tudo o que o schema declara tem de estar na tela.** Preço no schema
diferente do preço exibido, ou nota de avaliação que a página não mostra,
não custa o resultado enriquecido daquela página: custa a elegibilidade do
**domínio inteiro**. É por isso que nada em `schema.ts` é escrito à mão —
preço, carga, certificado e checkout vêm de `config/courses.ts`, a mesma
fonte que desenha o card e a coluna de compra.

## Artigos

O site tinha sete páginas, todas de venda. Isso responde a quem já decidiu
comprar e procura qual formação — uma fração minúscula das buscas. A
maioria das pessoas chega antes: *"o que é PNL"*, *"hipnose funciona"*,
*"metamodelo da linguagem"*. Para essas buscas o site não tinha página
nenhuma, e quem responde hoje são os concorrentes que estão no ar há anos.

| | |
|---|---|
| Registro e conteúdo | `src/config/artigos.ts` |
| Listagem | `/artigos` |
| Artigo | `/artigos/<slug>` |
| Renderização dos blocos | `src/components/CorpoArtigo.tsx` |

### Como escrever um artigo

Acrescente uma entrada em `src/config/artigos.ts`. O corpo é uma lista de
blocos (`paragrafo`, `subtitulo`, `lista`, `citacao`, `destaque`) em texto
puro — escrever um artigo não exige mexer em JSX. Dentro do texto valem
três marcações e mais nenhuma:

```
**negrito**              → negrito
[texto](/hipnoterapia)   → link interno
[texto](https://…)       → link externo
```

### ⚠ O campo `revisado`

**Artigo com `revisado: false` é rascunho, não publicação.** Ele ganha um
arquivo HTML — sem isso você não conseguiria abrir a URL para ler — mas
sai com `noindex`, fica fora da listagem e fora do sitemap, e mostra uma
tarja dizendo que está em revisão.

Ponha `revisado: true` e preencha `revisadoEm` só depois de ler o texto,
corrigir o que estiver errado **e acrescentar o que só você sabe**. Cada
rascunho traz, num comentário, o que especificamente falta nele.

Isso não é zelo editorial, é sobrevivência: desde março de 2024 a Google
pune "abuso de conteúdo em escala" — páginas que apenas reescrevem o que
já existe indexado — e a punição atinge o domínio inteiro, não a página.
O que separa um artigo útil de enchimento não é o tamanho nem a
palavra-chave: é ter algo que só este instituto pode dizer. As ementas, o
simulador SENA, os módulos de ética obrigatória e a sua experiência
clínica são esse algo. Artigo que não traz nada disso é melhor não
publicar.

### Depois de publicar

1. **Search Console** → *Inspeção de URL* em cada rota. O "HTML renderizado"
   e o "HTML de origem" agora devem trazer o mesmo conteúdo.
2. **Enviar o sitemap** (`/sitemap.xml`) uma vez. O `lastmod` sai do último
   commit que tocou o arquivo da página, então passa a se atualizar sozinho.
3. **Teste de resultados aprimorados** do Google em uma página de formação,
   para validar o `Course`.
4. **HSTS preload:** o cabeçalho já declara `preload`, mas só vale depois de
   submeter o domínio em [hstspreload.org](https://hstspreload.org).
   Confirme antes que **todos** os subdomínios servem HTTPS — a lista é
   embutida nos navegadores e sair dela leva meses.

## Estrutura

```
src/
  components/     Layout, cabeçalho, rodapé e componentes reutilizados
  config/         Os dados que o site exibe (ver abaixo)
  pages/          Uma página por rota
```

### O que fica em `src/config/`

| Arquivo | O que guarda |
|---|---|
| `site.ts` | Contatos, redes, plataforma de pagamento, aviso legal, rotas |
| `eixos.ts` | Os eixos de formação e a cor de cada um |
| `courses.ts` | O catálogo: preço, checkout, eixo, situação e os pacotes |
| `curriculos.ts` | As ementas das três formações, módulo e aula |
| `sena.ts` | O paciente e a devolutiva da amostra do SENA na home |
| `depoimentos.ts` | Os depoimentos de alunos, com espaço para vídeo |
| `midia.ts` | Os vídeos do site: boas-vindas no hero e amostra do SENA |
| `pagamento.ts` | Os meios de pagamento aceitos e as marcas deles |
| `admin.ts` | Quem enxerga o painel de cadastros |

**Antes de editar preço, link de checkout, telefone ou e-mail, olhe em
`src/config/`.** Esses dados ficavam repetidos pelo JSX — o WhatsApp
aparecia 11 vezes, cada e-mail 6 — e já haviam divergido entre páginas.
Agora existe um lugar só.

Cabeçalho e rodapé vêm de `components/Layout.tsx`, aplicado como rota-pai
em `Rotas.tsx`. Página nova é uma entrada em `config/paginas.ts` — ela
herda a moldura e ganha HTML estático e linha no sitemap sozinha.

## Como o catálogo cresce

O IBSDH é um instituto de desenvolvimento humano: o catálogo não para em
PNL, hipnoterapia e coaching. O site foi montado para absorver isso sem
refatoração.

### Adicionar um curso

Acrescente uma entrada em `src/config/courses.ts` com o eixo e a rota. Ele
passa a aparecer **sozinho** em todas estas superfícies:

- o catálogo em `/formacoes`, dentro do eixo dele;
- o painel "Formações" do cabeçalho, no desktop e no celular;
- o rodapé, agrupado por eixo;
- a página 404, que lista as formações para quem errou o endereço;
- a vitrine da home, **se** você marcar `destaque: true`.

Só a página do curso em si precisa ser criada à mão — e só porque o texto de
venda de cada formação é diferente. Copie uma das existentes: elas usam o
mesmo `PaginaCurso` e derivam a cor do eixo com `corDoCurso(curso)`.

Lembre de acrescentar a rota em `src/App.tsx`, em `routes` (`site.ts`) e no
`public/sitemap.xml`.

### Adicionar um eixo

Acrescente uma entrada em `src/config/eixos.ts` com nome, descrição, cor e
ordem. Catálogo, cabeçalho, rodapé e home passam a exibi-lo assim que o
primeiro curso apontar para ele — um eixo sem curso não aparece, porque eixo
anunciado e vazio é promessa que a página não cumpre.

**Se a paleta acabar, agrupe eixos em vez de inventar uma sexta cor.** Acima
de seis campos de cor o olho deixa de distinguir com confiança, e a cor
passa de pista de reconhecimento a tabela para decorar.

### Os princípios que sustentam essas escolhas

| Princípio | Onde aparece |
|---|---|
| **Lei de Hick** — o tempo de decisão cresce com o número de opções visíveis | A barra tem um item "Formações", não vinte links soltos. Agrupar troca "escolha entre 20" por "escolha entre 4, depois entre 5". |
| **Reconhecimento em vez de memorização** | A cor pertence ao eixo, não ao curso: quatro cores são pista, vinte são decoreba. |
| **Divulgação progressiva** | Home mostra destaques → catálogo mostra tudo, agrupado → página do curso mostra o detalhe. |
| **Visibilidade do estado do sistema** | Cada curso declara `situacao`: aberto, em breve ou encerrado. A interface diz em que pé está, em vez de deixar descobrir clicando. |
| **Consistência** | Um `CardCurso` só, alimentado por dados. Home, catálogo e 404 não têm como discordar entre si. |

O menu abre no clique, não no passar do mouse: menu por hover dispara sem
intenção e é inoperável em tela de toque.

## Deploy

O build é estático (`dist/`) e **cada rota tem arquivo próprio**:
`/hipnoterapia` é servido por `dist/hipnoterapia/index.html`. Não existe
mais o redirecionamento `/*  →  /index.html` que uma SPA exige — ele foi
removido de propósito (ver [Busca e indexação](#busca-e-indexação)).

O que o host precisa fazer, e já vai configurado nos três:

| | Netlify | Vercel | Firebase |
|---|---|---|---|
| arquivo | `netlify.toml` | `vercel.json` | `firebase.json` |
| URL sem `.html` | padrão | `cleanUrls` | `cleanUrls` |
| endereço inexistente | `404.html`, status 404 | idem | idem |
| `/admin` | rewrite explícito | padrão | rewrite explícito |
| HSTS, cache, cabeçalhos | sim | sim | sim |

**Ao trocar de host, confira duas coisas:** que `/formacoes` responde com o
conteúdo de `formacoes/index.html` (e não com a home), e que um endereço
inventado responde **404**, não 200. `npm run smoke` verifica as duas.

### Firestore

Duas coleções: `course_reviews` (avaliações, leitura pública, escrita só
autenticada pelo autor) e `waitlist` (lista de espera — criação livre,
**leitura bloqueada**, por serem dados pessoais sob a LGPD).

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

O índice composto em `firestore.indexes.json` é obrigatório: sem ele a
consulta de avaliações falha e a lista fica vazia para sempre.

## Lista de espera e avaliações

### Ver os cadastros

A página `/admin` mostra quem entrou na lista de espera, com exportação em
CSV. A coleção `waitlist` é **fechada para leitura pública** — são dados
pessoais sob a LGPD — então o acesso precisa ser liberado para a sua conta:

1. Acesse `/admin` e entre com a conta Google que vai administrar.
2. A página informa que a conta não tem acesso e mostra o seu **UID**.
3. Cole esse UID em **dois lugares**:
   - `ADMIN_UIDS` em `src/config/admin.ts` (controla a interface)
   - a função `isAdmin()` em `firestore.rules` (é o que realmente protege
     os dados)
4. Publique as regras:

```bash
firebase deploy --only firestore:rules
```

Só o passo 3 na interface não libera nada: sem a regra, o Firestore recusa
a leitura — que é justamente o comportamento desejado.

### Destravar as avaliações de curso

As avaliações consultam `where('courseId') + orderBy('createdAt')`, o que
exige um índice composto. Sem ele a consulta falha e a lista fica presa em
"Ainda não há avaliações" para sempre — sem erro visível para quem acessa.

O índice já está declarado em `firestore.indexes.json`. Publique com:

```bash
firebase deploy --only firestore:indexes
```

A criação leva alguns minutos. O andamento aparece no console do Firebase,
em Firestore → Índices.

### Aviso por e-mail de novo cadastro

`netlify/functions/notificar-lead.mjs` envia um e-mail quando alguém entra
na lista. É opcional: **sem configurar, o site funciona normalmente e o
cadastro continua sendo salvo** — apenas o aviso não é enviado.

Para ativar, crie uma conta no [Resend](https://resend.com) e defina em
*Netlify → Site settings → Environment variables*:

| Variável | Obrigatória | Valor |
| --- | --- | --- |
| `RESEND_API_KEY` | sim | a chave da API |
| `NOTIFY_FROM` | sim | remetente verificado no Resend |
| `NOTIFY_EMAIL` | não | quem recebe o aviso. Em branco, vai para `contato@institutobrunosena.com.br` |

O remetente não pode ser um endereço qualquer: o Resend só envia de um
domínio verificado por você. São dois caminhos:

- **Definitivo** — em *Resend → Domains*, acrescente
  `institutobrunosena.com.br` e publique os registros DNS que ele indicar
  (onde o domínio está registrado). Depois use algo como
  `avisos@institutobrunosena.com.br` em `NOTIFY_FROM`.
- **Para testar hoje** — o Resend aceita `onboarding@resend.dev` como
  remetente sem nenhuma configuração, mas só entrega para o e-mail dono da
  conta do Resend. Serve para confirmar que o caminho funciona; não serve
  em produção.

O destinatário nunca vem do formulário — é sempre `NOTIFY_EMAIL`, ou o
contato do instituto —, então o endereço não pode ser usado para disparar
e-mail a terceiros.

#### ⚠ Estado atual: o aviso não está sendo entregue

Diagnosticado nas variáveis de ambiente do Netlify. Hoje está assim:

| Variável | Valor em produção |
| --- | --- |
| `RESEND_API_KEY` | definida |
| `NOTIFY_FROM` | `onboarding@resend.dev` |
| `NOTIFY_EMAIL` | não definida → cai em `contato@institutobrunosena.com.br` |

`onboarding@resend.dev` é o remetente de teste do Resend, e ele **só entrega
para o e-mail dono da conta do Resend**. Como o destinatário é o contato do
instituto, o Resend recusa o envio e a função responde 502. O cadastro
continua sendo salvo no Firestore e aparece em `/admin` — só o aviso não sai.

**Para resolver, escolha um caminho:**

1. **Definitivo.** Em *Resend → Domains*, acrescente
   `institutobrunosena.com.br` e publique os registros DNS que ele indicar.
   Depois troque `NOTIFY_FROM` para `avisos@institutobrunosena.com.br`. A
   partir daí o aviso entrega para qualquer destinatário.
2. **Para funcionar hoje.** Defina `NOTIFY_EMAIL` com o e-mail que é dono da
   conta do Resend. O remetente de teste consegue entregar para ele. Serve
   para confirmar que o caminho funciona; não serve em produção, porque o
   aviso passa a ir para uma caixa pessoal em vez da do instituto.

**Independente disso: troque a `RESEND_API_KEY`.** A chave atual apareceu
numa captura de tela durante a configuração. Gere outra em *Resend → API
Keys*, atualize a variável no Netlify e revogue a antiga.

A partir desta versão a função **explica a própria falha**: o log registra
uma linha JSON com `evento: "aviso-de-lead-recusado"`, o status do Resend e
um campo `causa` em português dizendo o que corrigir. Antes era um 502 mudo,
e descobrir o motivo exigiu inspecionar a configuração à mão.

O aviso é uma conveniência, não o registro: quem guarda os cadastros é o
Firestore, e a lista completa fica em `/admin`. Se o e-mail falhar, nenhum
lead se perde.

### Migrar a plataforma de pagamento

Hoje as vendas passam pela Kiwify; a migração para a Hotmart está prevista.
São dois pontos, e os dois precisam mudar juntos:

1. `paymentPlatform` em `src/config/site.ts` — o nome citado no texto de
   compra segura, na Política de Privacidade e nos Termos.
2. `checkout` de cada curso em `src/config/courses.ts` — o destino real dos
   botões.

Se só um dos dois mudar, o site anuncia uma plataforma e leva o comprador
para outra.

### A amostra do SENA na home

A home tem uma cópia do simulador (`components/SenaSimulador.tsx`), e ela
segue o produto real de perto porque uma amostra que ensina a mecânica
errada é pior do que não ter amostra. A versão anterior era múltipla
escolha; o SENA não é.

O que a amostra faz igual ao produto: mostra o paciente virtual com perfil,
resistências e abordagem recomendada; recebe a intervenção **escrita** pelo
visitante, com o mesmo mínimo de 50 caracteres; e pede a autoavaliação de
seis itens que no SENA vem antes da IA.

**Onde ela para, e por quê.** No lugar de avaliar o texto do visitante, ela
mostra uma resposta de *referência* já avaliada, no formato exato da
devolutiva do simulador — nota, rótulo e blocos de análise. A tela diz, em
cima da nota, que a nota é da resposta de referência e não da dele.

Avaliar de verdade exige a IA do simulador. Inventar uma nota para o texto
de quem está de fora seria mentir sobre o produto logo na demonstração dele,
e é o tipo de coisa que o comprador descobre na primeira aula.

O link para o simulador de verdade aparece ao final, para quem já é aluno.

### Publicar os dois vídeos

Os espaços já existem; falta o conteúdo. Tudo se resolve em
`src/config/midia.ts`, uma linha por vídeo — nenhum componente precisa ser
tocado:

```ts
boasVindas: { tipo: 'youtube', id: 'ABC123xyz' },
amostraSena: { tipo: 'arquivo', src: '/amostra-sena.mp4' },
```

Do YouTube, copie só o identificador (o que vem depois de `watch?v=`), não a
URL inteira. Do Vimeo, o número no fim do endereço. Arquivo próprio vai em
`public/` e é apontado pela rota.

Enquanto os dois estiverem `null`, nada quebra e nada fica com cara de
buraco: o hero mostra o seu retrato e a seção do SENA mostra só o simulador.
O espaço não é anunciado antes de existir.

O reprodutor carrega por fachada: a página mostra a imagem e o botão de
play, e o player de verdade só é montado no clique. Um iframe do YouTube
custa perto de um megabyte antes de alguém decidir assistir, e esse peso
cairia justamente no primeiro carregamento — o que decide se a pessoa fica.

## Pendências conhecidas

### Precisam de decisão sua

- **Gravar os dois vídeos.** O de boas-vindas é o espaço mais valioso da
  home: em 60 a 90 segundos, quem você é, por que o instituto existe e o que
  a pessoa leva ao final. A amostra do SENA é uma gravação de tela de uma
  sessão real: a amostra da home reproduz a mecânica até onde pode, mas a
  IA avaliando um texto de verdade só se vê em vídeo.
- **Revisar o conteúdo clínico da amostra do SENA** (`src/config/sena.ts`).
  A resposta de referência e, principalmente, a devolutiva com nota são
  rascunho meu. É a única parte do site que emite julgamento clínico, e sai
  assinada pelo instituto. O texto está separado da marcação justamente
  para que revisar seja editar prosa.
- **Gravar três depoimentos em vídeo** (`src/config/depoimentos.ts`). A
  moldura de celular já está na página; hoje ela mostra a citação como um
  post. Preencher `video` num aluno troca aquele card para o vídeo, com
  quadro de abertura e play. Grave vertical,
  filmado no celular, de 30 a 60 segundos, com três perguntas: como você
  estava antes, o que mudou, e o que faz hoje com isso. Passe também um
  `poster`, porque a miniatura que o YouTube gera é 16:9 e fica quase só
  tarja preta dentro da moldura vertical.
- **Duas ementas incompletas** (`src/config/curriculos.ts`). O Master PNL
  anunciava 48 aulas e publica 31, numeradas de 1 a 31 sem intervalos. A
  Hipnoterapia anuncia 44 e publica 40 — o módulo 6 tem descrição mas
  nenhuma aula listada. As páginas agora contam a partir dos dados, então
  passaram a anunciar o número menor: publicar a menos é melhor do que
  prometer aula que a página não mostra. O Practitioner fecha certo.
- **Dois combos sem checkout** (`src/config/courses.ts`). A Jornada vendia
  "Combo P+H por R$ 597" e "Combo P+M por R$ 1.097" mandando para o
  checkout dos cursos avulsos, a R$ 397 e R$ 997. Enquanto os produtos não
  existirem na Kiwify, o botão dos dois leva ao WhatsApp da coordenação.
  Criando os links, basta preencher o campo `checkout` de cada combo.
- **Ebooks sem checkout.** Os três botões da seção de ebooks eram `<button>`
  sem destino nenhum. Hoje levam ao WhatsApp com a mensagem preenchida.
  Mesma correção dos combos: crie o produto e preencha o link.
- **Faixa de instituições.** A home listava quatro nomes genéricos e
  inventados ("Global Tech", "Institutos Financeiros"), repetidos para
  preencher o carrossel, sob a frase "metodologia aplicada em instituições
  como". Nome de parceiro que não existe é risco de credibilidade, então a
  faixa passou a listar as **áreas** em que os alunos atuam — que é verdade
  e diz a mesma coisa. Quando houver parceria real com logo, ela entra em
  `OndeAtuam`, na home.
- **"+50 empresas transformadas".** O selo vinha com quatro avatares
  inventados. O número ficou; os rostos falsos saíram. Se o número puder ser
  comprovado, vale mantê-lo — senão, convém revisá-lo também.

### Herdadas do projeto original

- **Capas dos cursos — resolvido.** Seis imagens se perderam na exportação
  original do projeto: os binários passaram por uma decodificação UTF-8 que
  destruiu cerca de um quinto de cada arquivo, sem recuperação possível.

  O Bruno reenviou todas as seis, e não há mais nenhuma reserva de "imagem
  pendente" no site. `components/CourseImage.tsx` continua no lugar como
  proteção: se um arquivo sumir do servidor, o layout segue íntegro em vez
  de mostrar ícone de imagem quebrada.
- **Projeto do Firebase.** O projeto (`gen-lang-client-…`) e o banco
  (`ai-studio-…`) foram criados automaticamente pela ferramenta que gerou o
  projeto. Funcionam e contêm dados reais, mas o domínio de autenticação
  que aparece no login com Google é `gen-lang-client-….firebaseapp.com`, e
  não o domínio do instituto. Migrar exige criar um projeto novo e mover os
  documentos.
- **Chave de API do Firebase.** É pública por natureza (vai no bundle), mas
  convém restringi-la por referenciador HTTP no Google Cloud Console.
