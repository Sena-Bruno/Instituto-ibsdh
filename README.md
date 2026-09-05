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
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build para conferência |
| `npm run lint` | Tipos + Biome (o que o CI roda) |
| `npm run check:fix` | Corrige lint e formatação automaticamente |
| `npm run knip` | Procura código e dependências sem uso |
| `npm run smoke` | Teste de navegador nas rotas públicas (com o preview no ar) |

O `smoke` percorre as 6 rotas públicas e falha se encontrar imagem
quebrada, CTA de compra sem destino, título duplicado ou ausente, ou erro
de console. O Playwright fica fora das dependências de propósito — ele
baixa centenas de MB de navegadores na instalação, o que só atrasaria o
build de produção:

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

**CI** (`.github/workflows/ci.yml`) roda em todo PR: tipos, Biome, Knip,
build e o teste de navegador sobre o build real. Usa `npm ci`, que falha se
o `package-lock.json` sair de sincronia com o `package.json` — o tipo exato
de problema que já quebrou um deploy aqui.

**Biome** cobre lint e formatação num binário só. As decisões de regra
estão em [BIOME.md](./BIOME.md), com o motivo de cada uma.

**Knip** encontra código e dependências sem uso. O `playwright` fica em
`ignoreDependencies` de propósito: é instalado sob demanda para o teste de
fumaça e não pode entrar no `package.json`, senão todo build de produção
baixaria centenas de MB de navegadores.

**Sentry** reporta erros de produção — antes, um erro só chegava até o
instituto se algum visitante avisasse. É opcional: sem `VITE_SENTRY_DSN`
definido, o Vite elimina o SDK inteiro no build e o custo é zero. Quando
ativo, o SDK (490 kB) **só é baixado se um erro acontecer** — quem navega
sem problema nunca paga por ele. Configure `VITE_SENTRY_DSN` em
*Netlify → Site settings → Environment variables*.

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
| `sena.ts` | O conteúdo clínico da demonstração do SENA na home |
| `midia.ts` | Os vídeos do site: boas-vindas no hero e amostra do SENA |
| `admin.ts` | Quem enxerga o painel de cadastros |

**Antes de editar preço, link de checkout, telefone ou e-mail, olhe em
`src/config/`.** Esses dados ficavam repetidos pelo JSX — o WhatsApp
aparecia 11 vezes, cada e-mail 6 — e já haviam divergido entre páginas.
Agora existe um lugar só.

Cabeçalho e rodapé vêm de `components/Layout.tsx`, aplicado como rota-pai
em `App.tsx`. Páginas novas entram como `<Route>` filha e herdam tudo.

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

O build é estático (`dist/`). Como é uma SPA, **o host precisa redirecionar
todas as rotas para `index.html`**, senão acessar `/hipnoterapia` direto
devolve 404. Já vão configurados:

- Netlify: `netlify.toml` e `public/_redirects`
- Vercel: `vercel.json`
- Firebase Hosting: `firebase.json`

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

Para ativar, crie uma conta no [Resend](https://resend.com) e defina três
variáveis em *Netlify → Site settings → Environment variables*:

| Variável | Valor |
| --- | --- |
| `RESEND_API_KEY` | a chave da API |
| `NOTIFY_EMAIL` | endereço que recebe o aviso |
| `NOTIFY_FROM` | remetente verificado no Resend |

O destinatário nunca vem do formulário — é sempre `NOTIFY_EMAIL` —, então
o endereço não pode ser usado para disparar e-mail a terceiros.

### Migrar a plataforma de pagamento

Hoje as vendas passam pela Kiwify; a migração para a Hotmart está prevista.
São dois pontos, e os dois precisam mudar juntos:

1. `paymentPlatform` em `src/config/site.ts` — o nome citado no texto de
   compra segura, na Política de Privacidade e nos Termos.
2. `checkout` de cada curso em `src/config/courses.ts` — o destino real dos
   botões.

Se só um dos dois mudar, o site anuncia uma plataforma e leva o comprador
para outra.

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
  sessão real — hoje a seção mostra a demonstração que eu construí, útil
  para experimentar a mecânica, mas que não é o produto. Com a gravação, a
  demonstração passa a ser o convite e o vídeo passa a ser a prova.
- **Revisar o conteúdo clínico do simulador** (`src/config/sena.ts`). As
  três respostas ao paciente cético, e principalmente as três devolutivas,
  são rascunho meu. É a única parte do site que emite julgamento clínico
  ("isto rompe o rapport", "isto está fora de hora") e sai assinada pelo
  instituto. O texto está separado da marcação justamente para que revisar
  seja editar prosa.
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

- **Capas dos cursos.** Seis imagens se perderam na exportação original do
  projeto: os binários passaram por uma decodificação UTF-8 que destruiu
  cerca de um quinto de cada arquivo, sem recuperação possível. Enquanto os
  originais não voltam, `components/CourseImage.tsx` exibe uma placa
  técnica com o nome no lugar. Para restaurar, basta colocar o arquivo em
  `public/` e apontar o `src` correspondente.
- **Projeto do Firebase.** O projeto (`gen-lang-client-…`) e o banco
  (`ai-studio-…`) foram criados automaticamente pela ferramenta que gerou o
  projeto. Funcionam e contêm dados reais, mas o domínio de autenticação
  que aparece no login com Google é `gen-lang-client-….firebaseapp.com`, e
  não o domínio do instituto. Migrar exige criar um projeto novo e mover os
  documentos.
- **Chave de API do Firebase.** É pública por natureza (vai no bundle), mas
  convém restringi-la por referenciador HTTP no Google Cloud Console.
