/**
 * Smoke test de navegador para as rotas públicas.
 *
 * Verifica o que quebrou de verdade neste site no passado: CTA de compra
 * sem destino, imagem que não carrega, título de página duplicado ou
 * ausente, e erro de console.
 *
 * O Playwright NÃO é dependência do projeto: ele baixa centenas de MB de
 * navegadores na instalação, o que só atrasaria o build de produção de um
 * site estático. Instale sob demanda:
 *
 *   npm install --no-save playwright
 *   npm run build && npm run preview &
 *   npm run smoke
 */

import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.SMOKE_URL || 'http://localhost:4173';
const routes = [
  '/',
  '/formacoes',
  '/pnl-practitioner',
  '/master-pnl',
  '/hipnoterapia',
  '/jornada',
  '/master-coach',
];

// O ambiente traz um Chromium pré-instalado que pode não bater com a build
// esperada pela versão do Playwright; apontar direto evita baixar outro.
const executablePath =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message}`));

let failures = 0;

for (const route of routes) {
  // 'networkidle' não serve aqui: a página ainda busca recursos de
  // terceiros (fontes, ícones, fotos de stock) que podem nunca responder.
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, null, {
    timeout: 20000,
  });
  await page.waitForTimeout(2500);

  const title = await page.title();
  const titleCount = await page.locator('head title').count();
  // Só imagens servidas pelo próprio site: recursos externos podem falhar
  // por bloqueio de rede do ambiente, o que não é defeito do site.
  const brokenImages = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((i) => {
        const src = i.getAttribute('src') || '';
        const local = src.startsWith('/') && !src.startsWith('//');
        return local && i.complete && i.naturalWidth === 0;
      })
      .map((i) => i.getAttribute('src')),
  );
  const deadCtas = await page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((b) => {
        // Acordeões e alternadores têm aria-expanded/aria-controls: são
        // controles legítimos sem href, não CTAs de compra quebrados.
        if (b.hasAttribute('aria-expanded') || b.hasAttribute('aria-controls')) return false;
        if (b.closest('form')) return false;
        const t = (b.textContent || '').toLowerCase();
        return /comprar|garantir|matricular|quero (me |acessar|dominar)|minha vaga|inscrever/.test(
          t,
        );
      })
      .map((b) => b.textContent.trim().slice(0, 50)),
  );

  console.log(`\n${route}`);
  console.log(`  título (${titleCount}): ${title}`);
  console.log(`  imagens quebradas: ${brokenImages.length}`);
  for (const s of brokenImages) console.log(`      ✗ ${s}`);
  console.log(`  CTAs sem destino: ${deadCtas.length}`);
  for (const t of deadCtas) console.log(`      ✗ "${t}"`);

  if (!title || titleCount !== 1) {
    console.log(`      ✗ esperado exatamente 1 <title>, veio ${titleCount}`);
    failures++;
  }
  failures += brokenImages.length + deadCtas.length;
}

// Ruído de ambiente, não defeito do site: rede restrita bloqueia recursos
// de terceiros e o backend do Firestore.
const environmental =
  /ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|Could not reach Cloud Firestore|offline mode|net::ERR_/i;

// --- Movimento ---
// Verifica o que é fácil regredir sem ninguém notar: o painel que volta a
// abrir num corte seco, e a preferência de menos movimento sendo ignorada
// pelas animações em JavaScript (que a regra de CSS não alcança).
{
  const p2 = await browser.newPage();
  await p2.goto(`${base}/hipnoterapia`, { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('h1', { timeout: 20000 });
  await p2.waitForTimeout(700);

  const faq = p2.locator('button[aria-controls^="faq-painel"]').first();
  await faq.click();
  await p2.waitForTimeout(120);
  const meio = await p2.locator('#faq-painel-0').boundingBox();
  await p2.waitForTimeout(500);
  const fim = await p2.locator('#faq-painel-0').boundingBox();
  const abriuAnimado = !!(meio && fim && meio.height < fim.height);

  await faq.click();
  await p2.waitForTimeout(450);
  const saiuDoDom = (await p2.locator('#faq-painel-0').count()) === 0;

  console.log('\n=== movimento ===');
  console.log(`  FAQ abre com altura animada: ${abriuAnimado ? 'sim' : 'NÃO'}`);
  console.log(`  FAQ sai do DOM ao fechar: ${saiuDoDom ? 'sim' : 'NÃO'}`);
  if (!abriuAnimado) failures++;
  if (!saiuDoDom) failures++;
  await p2.close();

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const p3 = await ctx.newPage();
  await p3.goto(`${base}/hipnoterapia`, { waitUntil: 'domcontentloaded' });
  await p3.waitForSelector('h1', { timeout: 20000 });
  await p3.waitForTimeout(700);
  await p3.locator('button[aria-controls^="faq-painel"]').first().click();
  await p3.waitForTimeout(60);
  const bx = await p3.locator('#faq-painel-0').boundingBox();
  const instantaneo = !!(bx && bx.height > 20);
  console.log(`  reduced-motion abre sem animação: ${instantaneo ? 'sim' : 'NÃO'}`);
  if (!instantaneo) failures++;
  await ctx.close();
}

const unique = [...new Set(consoleErrors)].filter((e) => !environmental.test(e));
console.log(`\n=== erros de console: ${unique.length} ===`);
for (const e of unique.slice(0, 10)) console.log(`  ${e}`);
failures += unique.length;

await browser.close();
console.log(`\n${failures === 0 ? '✓ tudo certo' : `✗ ${failures} problema(s)`}`);
process.exit(failures === 0 ? 0 : 1);
