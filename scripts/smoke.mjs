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
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const base = process.env.SMOKE_URL || 'http://localhost:4173';
const routes = [
  '/',
  '/pnl-practitioner',
  '/master-pnl',
  '/hipnoterapia',
  '/jornada',
  '/master-coach',
];

// O ambiente traz um Chromium pré-instalado que pode não bater com a build
// esperada pela versão do Playwright; apontar direto evita baixar outro.
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(
  existsSync(executablePath) ? { executablePath } : {},
);
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message}`));

let failures = 0;

for (const route of routes) {
  // 'networkidle' não serve aqui: a página ainda busca recursos de
  // terceiros (fontes, ícones, fotos de stock) que podem nunca responder.
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, null, { timeout: 20000 });
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
        return /comprar|garantir|matricular|quero (me |acessar|dominar)|minha vaga|inscrever/.test(t);
      })
      .map((b) => b.textContent.trim().slice(0, 50)),
  );

  console.log(`\n${route}`);
  console.log(`  título (${titleCount}): ${title}`);
  console.log(`  imagens quebradas: ${brokenImages.length}`);
  brokenImages.forEach((s) => console.log(`      ✗ ${s}`));
  console.log(`  CTAs sem destino: ${deadCtas.length}`);
  deadCtas.forEach((t) => console.log(`      ✗ "${t}"`));

  if (!title || titleCount !== 1) {
    console.log(`      ✗ esperado exatamente 1 <title>, veio ${titleCount}`);
    failures++;
  }
  failures += brokenImages.length + deadCtas.length;
}

// Ruído de ambiente, não defeito do site: rede restrita bloqueia recursos
// de terceiros e o backend do Firestore.
const environmental = /ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|Could not reach Cloud Firestore|offline mode|net::ERR_/i;
const unique = [...new Set(consoleErrors)].filter((e) => !environmental.test(e));
console.log(`\n=== erros de console: ${unique.length} ===`);
unique.slice(0, 10).forEach((e) => console.log(`  ${e}`));
failures += unique.length;

await browser.close();
console.log(`\n${failures === 0 ? '✓ tudo certo' : `✗ ${failures} problema(s)`}`);
process.exit(failures === 0 ? 0 : 1);
