import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Firebase só é usado pelas avaliações de curso. Isolá-lo impede que
        // o SDK inteiro (Auth + Firestore) entre no chunk inicial da home,
        // que nunca renderiza avaliação nenhuma.
        manualChunks: {
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
});
