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
  config/         site.ts (contatos) e courses.ts (preços e checkouts)
  pages/          Uma página por rota
```

**Antes de editar preço, link de checkout, telefone ou e-mail, olhe em
`src/config/`.** Esses dados ficavam repetidos pelo JSX — o WhatsApp
aparecia 11 vezes, cada e-mail 6 — e já haviam divergido entre páginas.
Agora existe um lugar só.

Cabeçalho e rodapé vêm de `components/Layout.tsx`, aplicado como rota-pai
em `App.tsx`. Páginas novas entram como `<Route>` filha e herdam tudo.

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

## Pendências conhecidas

- **Capas dos cursos.** Seis imagens se perderam na exportação original do
  projeto: os binários passaram por uma decodificação UTF-8 que destruiu
  cerca de um quinto de cada arquivo, sem recuperação possível. Enquanto os
  originais não voltam, `components/CourseImage.tsx` exibe uma reserva em
  gradiente da marca. Para restaurar, basta colocar o arquivo em `public/`
  e apontar `img` em `courses.ts` / `Home.tsx`.
- **Projeto do Firebase.** O projeto (`gen-lang-client-…`) e o banco
  (`ai-studio-…`) foram criados automaticamente pela ferramenta que gerou o
  projeto. Funcionam e contêm dados reais, mas o domínio de autenticação
  que aparece no login com Google é `gen-lang-client-….firebaseapp.com`, e
  não o domínio do instituto. Migrar exige criar um projeto novo e mover os
  documentos.
- **Chave de API do Firebase.** É pública por natureza (vai no bundle), mas
  convém restringi-la por referenciador HTTP no Google Cloud Console.
