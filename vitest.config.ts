import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Configuração dos testes, separada do `vite.config.ts` de propósito.
 *
 * O arquivo de build carrega o plugin do Tailwind e o middleware que faz o
 * `preview` servir o `dist` como o Netlify serve — nenhum dos dois tem
 * sentido dentro de um teste, e o de preview chega a ler o disco. Aqui fica
 * só o que os testes precisam: o plugin do React, para o JSX.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTES TESTES CUIDAM, E O QUE FICA COM O SMOKE                  │
 * │                                                                       │
 * │  Aqui: a lógica que decide dinheiro e acesso — preço, economia,        │
 * │  quem é administrador, o que o formulário faz com um envio que falha. │
 * │  São as regras que ninguém vê quebrar olhando a tela, porque          │
 * │  continuam produzindo texto plausível quando estão erradas: um preço  │
 * │  divergente é um preço, e um `isAdmin` frouxo abre a lista de leads   │
 * │  sem nenhum aviso visual.                                            │
 * │                                                                       │
 * │  No `npm run smoke`: o site montado de verdade num navegador —        │
 * │  rotas, CTA com destino, imagem que carrega, movimento, e o HTML que  │
 * │  chega a quem não executa JavaScript. São coisas que um teste de      │
 * │  unidade com DOM simulado não alcança.                               │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/teste/setup.ts'],
    /* `netlify/testes/` entra porque a função de aviso de lead tem lógica de
       diagnóstico que vale testar — ela é o que transforma um 502 mudo em
       causa escrita no log.

       O teste mora numa pasta VIZINHA à da função, e não junto dela: o
       Netlify trata todo .mjs dentro de `netlify/functions/` como função
       serverless, e recusa nome com ponto. Um `notificar-lead.test.mjs` ali
       derruba o deploy inteiro com "Incorrect function names". */
    include: ['src/**/*.test.{ts,tsx}', 'netlify/testes/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      /*
        Só o que os testes de unidade têm como cobrir, e só o que tem lógica.

        Deixar tudo no alvo transformaria a cobertura num número decorativo
        em duas frentes. As sete páginas de venda são texto e JSX, cobertos
        pelo smoke num navegador real — no denominador, elas fariam a métrica
        medir o tamanho do site em vez da parte testada dele. E os arquivos
        de dados puros (depoimentos, mídia, meios de pagamento, paleta) são
        objetos literais: "cobri-los" seria escrever um teste que afirma que
        uma constante tem o valor que está escrito na linha acima.

        O que fica é o que decide algo: preço e catálogo, contato, quem é
        administrador, os dados estruturados, e o formulário que capta lead.
      */
      include: [
        'src/config/courses.ts',
        'src/config/site.ts',
        'src/config/admin.ts',
        'src/config/eixos.ts',
        /* A derivação dos artigos relacionados: erro aqui não aparece na
           tela — o bloco continua com três cartões, apontando para o texto
           errado ou para um rascunho `noindex`. */
        'src/config/artigos.ts',
        'src/lib/schema.ts',
        'src/lib/useDelayedFlag.ts',
        'src/lib/motion.ts',
        'src/components/WaitlistForm.tsx',
        'src/components/FormularioDeCaptacao.tsx',
        'src/components/FormularioDeMaterial.tsx',
        'src/lib/erroDeLogin.ts',
        'src/lib/erroDeFirestore.ts',
        'src/lib/useConvite.ts',
        /* A medição entra pelo mesmo critério: são três arquivos que
           decidem algo e cuja falha é silenciosa. Uma etiqueta de campanha
           que se perde, um checkout que deixa de ser reconhecido e um lead
           recusado por campo novo não mudam nada na tela — o site segue
           funcionando e só o relatório fica errado. */
        'src/lib/campanha.ts',
        'src/lib/medir.ts',
        'src/lib/gravarComExtras.ts',
        /* O consentimento entra por um motivo à parte: a falha dele não é
           um relatório errado, é medir quem recusou. Não há sintoma na
           tela que denuncie, e o custo de descobrir tarde não é um defeito
           — é uma infração à LGPD. */
        'src/lib/consentimento.ts',
        'src/components/AvisoDeCookies.tsx',
      ],
    },
  },
});
