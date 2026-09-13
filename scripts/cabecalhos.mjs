/**
 * Confere os cabeçalhos de segurança contra o build, num navegador real.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO NÃO CABE NO SMOKE                                       │
 * │                                                                       │
 * │  O `npm run smoke` roda contra o `vite preview`, e o Vite não conhece │
 * │  o `netlify.toml`: nenhum cabeçalho de lá existe na resposta. Um erro │
 * │  na política de conteúdo passaria por todo verificador local e só     │
 * │  apareceria depois do deploy — quebrando em produção justamente a     │
 * │  parte que o CSP toca, que é script de terceiro: medição, login,      │
 * │  vídeo.                                                               │
 * │                                                                       │
 * │  Este script serve o `dist` com os cabeçalhos LIDOS do netlify.toml,  │
 * │  abre as páginas que usam terceiros e falha se o navegador recusar    │
 * │  qualquer recurso. Ler do arquivo, em vez de repetir a política aqui, │
 * │  é o que impede o teste de aprovar uma política que não é a que vai   │
 * │  ao ar.                                                               │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * O Playwright não é dependência do projeto — mesmo motivo do smoke. Rode:
 *
 *   npm install --no-save playwright
 *   npm run build && npm run cabecalhos
 */

import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const dist = path.resolve('dist');

/** Os cabeçalhos que o netlify.toml aplica a `/*`. */
async function cabecalhosDoNetlify() {
  const toml = await readFile('netlify.toml', 'utf8');
  const cabecalhos = {};
  for (const linha of toml.split('\n')) {
    /* As quatro casas de indentação são as do bloco `[headers.values]`;
       linha comentada começa com `#` e não casa. */
    const m = linha.match(/^ {4}([A-Za-z-]+) *= *"(.*)" *$/);
    if (m && m[1] !== 'Cache-Control') cabecalhos[m[1]] = m[2];
  }
  return cabecalhos;
}

/** Os cabeçalhos sem os quais este teste não tem o que verificar. */
const OBRIGATORIOS = [
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
];

/*
  As rotas que exercitam terceiro de verdade: a home tem o vídeo, a página
  de curso carrega o SDK do Firebase para as avaliações, o artigo tem o
  formulário de captação e o /admin sobe o Auth inteiro.
*/
const ROTAS = ['/', '/hipnoterapia', '/artigos/o-que-e-pnl', '/admin'];

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

const cabecalhos = await cabecalhosDoNetlify();

let falhas = 0;
for (const nome of OBRIGATORIOS) {
  if (!cabecalhos[nome]) {
    console.log(`  ✗ ${nome} sumiu do netlify.toml`);
    falhas++;
  }
}

const servidor = createServer(async (req, res) => {
  const rota = decodeURIComponent(req.url.split('?')[0]);
  for (const arquivo of [path.join(dist, rota), path.join(dist, rota, 'index.html')]) {
    if (!arquivo.startsWith(dist)) break;
    try {
      const corpo = await readFile(arquivo);
      const tipo = TIPOS[path.extname(arquivo)] ?? 'application/octet-stream';
      res.writeHead(200, { ...cabecalhos, 'Content-Type': tipo });
      return res.end(corpo);
    } catch {
      /* Tenta o próximo candidato. */
    }
  }
  res.writeHead(404, cabecalhos).end('não encontrado');
});
await new Promise((pronto) => servidor.listen(4180, '127.0.0.1', pronto));

/* `CHROMIUM_PATH` existe para a máquina que já tem um Chromium instalado
   e não quer baixar outro. No CI a variável não é definida e o Playwright
   usa o navegador que ele mesmo instalou. */
const navegador = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const pagina = await navegador.newPage();

/** Toda recusa do navegador: a política que VALE e a de relatório. */
const recusas = [];
pagina.on('console', (msg) => {
  const texto = msg.text();
  if (/Content Security Policy|Refused to|Permissions policy/i.test(texto)) recusas.push(texto);
});
const errosDePagina = [];
pagina.on('pageerror', (erro) => errosDePagina.push(String(erro)));

console.log('=== páginas ===');
for (const rota of ROTAS) {
  await pagina.goto(`http://127.0.0.1:4180${rota}`, { waitUntil: 'networkidle' });
  const texto = await pagina.locator('body').innerText();
  console.log(`  ${rota.padEnd(22)} ${texto.length} caracteres`);
  /* Página em branco é o sintoma de uma política que bloqueou o próprio
     JavaScript do site — e ela não gera erro de console em toda versão. */
  if (texto.length < 300) {
    console.log('      ✗ renderizou vazia');
    falhas++;
  }
}

const unicas = [...new Set(recusas)];
console.log(`\n=== recusas do navegador: ${unicas.length} ===`);
for (const r of unicas) console.log(`  ${r}`);
falhas += unicas.length;

const errosUnicos = [...new Set(errosDePagina)];
console.log(`\n=== erros de página: ${errosUnicos.length} ===`);
for (const e of errosUnicos) console.log(`  ${e}`);
falhas += errosUnicos.length;

await navegador.close();
servidor.close();

console.log(`\n${falhas === 0 ? '✓ cabeçalhos sem quebrar nada' : `✗ ${falhas} problema(s)`}`);
process.exit(falhas === 0 ? 0 : 1);
