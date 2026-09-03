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
| `npm run lint` | Checagem de tipos do app e da configuração de build |
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
