/**
 * Contrato de arquitetura.
 *
 * O que o Biome e o Knip não veem: eles olham arquivo por arquivo, e as
 * regras abaixo são sobre a DIREÇÃO das dependências entre pastas. Um
 * import que quebra a arquitetura é sintaticamente perfeito, passa no lint,
 * não é código morto — e só cobra a conta depois, num ciclo que trava a
 * compilação ou num chunk que dobrou de tamanho sem ninguém notar.
 *
 * Roda com `npm run arch`.
 */
module.exports = {
  forbidden: [
    {
      name: 'sem-ciclo',
      comment:
        'Dependência circular. Além de dificultar a leitura, ela produz `undefined` em tempo de execução quando um dos módulos é avaliado antes do outro terminar — e o erro aparece longe da causa.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },

    {
      name: 'config-nao-importa-componente',
      comment:
        'A pasta config/ é a fonte de dados do site: preço, contato, catálogo, rotas. Importando componente ela inverte a direção — os dados passariam a depender de quem os exibe — e é o primeiro passo para um ciclo. Se um dado precisa de JSX, o JSX é que deve ficar no componente.',
      severity: 'error',
      from: { path: '^src/config' },
      to: {
        path: '^src/(components|pages)',
        /*
          `dynamic: false` é o que separa a violação do mecanismo. A tabela de
          rotas em `config/paginas.ts` referencia toda página por
          `carregar: () => import('../pages/Home')` — importação dinâmica, que
          é justamente o que faz cada rota virar um chunk próprio. Contá-la
          como violação reprovaria o code splitting do projeto; o que esta
          regra tem de pegar é o `import Componente from` estático, que amarra
          os dados ao JSX de verdade.
        */
        dynamic: false,
      },
    },

    {
      name: 'lib-e-folha',
      comment:
        'A pasta lib/ é utilitário puro, e é importada por quase tudo. Se ela importar componente ou página, todo mundo que usa um utilitário passa a arrastar componente atrás — e o code splitting por rota deixa de significar algo.',
      severity: 'error',
      from: { path: '^src/lib' },
      to: { path: '^src/(components|pages)' },
    },

    {
      name: 'pagina-nao-importa-pagina',
      comment:
        'Cada página é carregada por `lazy()` e vira um chunk próprio. Uma página importando outra junta os dois chunks: quem abre /hipnoterapia baixa também a página que ela importou, e o trabalho de dividir por rota se desfaz sem aviso — o build continua passando, só fica maior.',
      severity: 'error',
      from: { path: '^src/pages/([^/]+)\\.tsx$' },
      to: {
        path: '^src/pages/([^/]+)\\.tsx$',
        /*
          O NotFound fica de fora, e não por conveniência: `Artigo.tsx` faz
          `if (!artigo) return <NotFound />` para um slug que não existe, e
          renderizar a própria página 404 é a resposta certa ali — a
          alternativa seria duplicar o conteúdo dela. É a página de fallback
          do site, então é a única que faz sentido uma outra importar.

          O que a regra existe para pegar é uma página de curso importando
          outra página de curso, que é como dois chunks de 10 kB viram um de
          20 kB sem que nada acuse.
        */
        pathNot: '^src/pages/(\\1|NotFound)\\.tsx$',
      },
    },

    {
      name: 'producao-nao-importa-teste',
      comment:
        'Código de produção importando arquivo de teste ou o setup dos testes. Levaria o Testing Library e o jsdom para dentro do pacote que o visitante baixa.',
      severity: 'error',
      from: { pathNot: '\\.test\\.(ts|tsx)$|^src/teste/' },
      to: { path: '\\.test\\.(ts|tsx)$|^src/teste/' },
    },

    {
      name: 'sem-dependencia-de-desenvolvimento-em-producao',
      comment:
        'Módulo de src/ dependendo de um pacote que está em devDependencies. Funciona no desenvolvimento e quebra no build de produção, onde essas dependências podem não ser instaladas.',
      severity: 'error',
      from: { path: '^src', pathNot: '\\.test\\.(ts|tsx)$|^src/teste/' },
      to: { dependencyTypes: ['npm-dev'], pathNot: 'node_modules/(vite|@vitejs)' },
    },

    {
      name: 'sem-modulo-inexistente',
      comment: 'Import que não resolve para arquivo nenhum.',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
  ],

  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    /* Os arquivos gerados e os scripts de build ficam de fora: o contrato é
       sobre a arquitetura de src/, e o dist é resultado, não fonte. */
    exclude: { path: '^(dist|dist-ssr|node_modules|scripts)' },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
