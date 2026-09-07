import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Faz o `vite preview` servir o `dist` como o Netlify serve.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO É NECESSÁRIO                                            │
 * │                                                                       │
 * │  O `preview` do Vite é um servidor de SPA: para qualquer endereço sem │
 * │  arquivo correspondente ele devolve o `index.html` da raiz, com       │
 * │  status 200. Isso é o certo para o site que era; para o site que      │
 * │  passou a ser, apaga exatamente o que precisa ser testado.            │
 * │                                                                       │
 * │  Com o fallback ligado, abrir `/hipnoterapia` no preview devolvia a   │
 * │  home pré-renderizada. O React então hidratava a página do curso em   │
 * │  cima do HTML da home, a árvore não batia, e a hidratação era         │
 * │  descartada — um erro que só existia no preview e que teria feito o   │
 * │  smoke test acusar problema numa build correta.                       │
 * │                                                                       │
 * │  Aqui a resolução é a de um servidor estático de verdade:             │
 * │  `/hipnoterapia` → `dist/hipnoterapia/index.html`; endereço sem       │
 * │  arquivo → `dist/404.html`, com status 404 de verdade, que é como o   │
 * │  Netlify responde depois que o fallback `/*` saiu do netlify.toml.    │
 * └───────────────────────────────────────────────────────────────────────┘
 */
function servirComoEmProducao(dist: string): Plugin {
  return {
    name: 'servir-como-em-producao',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const caminho = (req.url ?? '/').split('?')[0].split('#')[0];

        // Tem extensão: é recurso (js, css, webp). Deixa o Vite servir.
        if (path.extname(caminho)) return next();

        const responder = (arquivo: string, status: number) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(arquivo));
        };

        const pagina = path.join(dist, caminho, 'index.html');
        if (fs.existsSync(pagina)) return responder(pagina, 200);

        const naoEncontrada = path.join(dist, '404.html');
        if (fs.existsSync(naoEncontrada)) return responder(naoEncontrada, 404);

        next();
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), servirComoEmProducao(path.resolve(__dirname, 'dist'))],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /*
          Só o pacote do navegador é fatiado à mão. O build de servidor
          (`--ssr`, usado pela pré-renderização) deixa as dependências
          como externas e resolve tudo pelo Node: nomear um pacote em
          `manualChunks` ali faz o Rollup falhar, porque ele não pode pôr
          num chunk um módulo que decidiu não empacotar.
        */
        manualChunks: isSsrBuild
          ? undefined
          : {
              // Firebase só é usado pelas avaliações de curso. Isolá-lo impede que
              // o SDK inteiro (Auth + Firestore) entre no chunk inicial da home,
              // que nunca renderiza avaliação nenhuma.
              firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
              vendor: ['react', 'react-dom', 'react-router-dom'],
              // O Sentry NÃO entra aqui de propósito: nomeá-lo em manualChunks
              // força o pacote inteiro para dentro do chunk e anula o
              // tree-shaking. Deixando o Rollup criar o chunk a partir do
              // import dinâmico, só o que é usado entra.
            },
      },
    },
  },
}));
