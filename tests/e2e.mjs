// Parcours bout en bout (nécessite playwright + serveur lancé) : node tests/e2e.mjs http://localhost:8080
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH || 'playwright');
const url = process.argv[2] || 'http://localhost:8080';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 400, height: 800 } });
const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await p.goto(url);
await p.click('text=1. Premiers mots');
let n = 0, wrongDone = false;
for (let guard = 0; guard < 60; guard++) {
  if (await p.locator('text=Séance terminée').count()) break;
  if (await p.locator('button:has-text("Compris")').count()) { await p.click('button:has-text("Compris")'); continue; }
  if (await p.locator('button:has-text("Continuer")').count()) { await p.click('button:has-text("Continuer")'); n++; continue; }
  // lit la solution via le contenu de la page selon le type d'exercice
  const h2 = (await p.locator('h2').first().textContent()) || '';
  const item = await p.evaluate(async () => { const m = await import('./src/content.js'); return m.LANGS.it.items.map((i) => [i.t, i.f]); });
  const bigs = await p.locator('.big').allTextContents();
  const find = (s) => item.find(([t, f]) => t === s || f === s);
  if (await p.locator('.options').count()) {
    const opts = await p.locator('.options button').allTextContents();
    const want = find(bigs[0]) ; const ans = want ? (want[0] === bigs[0] ? want[1] : want[0]) : null;
    const target = h2.includes('Comment dit-on') ? find(h2.match(/«\s*(.*?)\s*»/)[1]).at(0) : ans;
    let idx = opts.findIndex((o) => o.slice(3) === target);
    if (!wrongDone) { idx = (idx + 1) % opts.length; wrongDone = true; }
    await p.locator('.options button').nth(idx).click(); await p.click('button:has-text("Vérifier")');
  } else if (await p.locator('.bank').count()) {
    const sol = find(bigs[0])[0].split(' ');
    for (const w of sol) await p.locator('.bank button:not(:disabled)', { hasText: new RegExp('^' + w.replace(/[?]/g, '\\?') + '$') }).first().click();
    await p.click('button:has-text("Vérifier")');
  } else if (await p.locator('input[type=text]').count()) {
    const sol = bigs.length ? find(bigs[0])?.[0] : null;
    if (sol) { await p.fill('input', sol.toLowerCase()); await p.click('button:has-text("Vérifier")'); }
    else { await p.click('button:has-text("Je ne peux pas écouter")'); }
  } else { console.log('inconnu:', h2); break; }
}
const done = await p.locator('text=Séance terminée').count();
console.log('exercices:', n, 'terminée:', done, 'erreurs JS:', errors.length ? errors : 'aucune');
await p.screenshot({ path: process.env.SHOT || '/tmp/claude-0/end.png' });
await p.click('text=Terminer');
console.log('accueil après séance:', (await p.locator('.ring').textContent()).trim());
await p.click('button:has-text("Progrès")'); console.log('stats ok:', await p.locator('.heat').count());
await p.screenshot({ path: '/tmp/claude-0/stats.png' });
// --- tuteur (serveur en PAROLA_TUTOR_MOCK=1) ---
await p.click('button:has-text("Tuteur")');
await p.waitForSelector('text=/simulé|Claude|non configuré/');
await p.click('text=Au café');
await p.waitForSelector('.msg.bot:not(.typing)', { timeout: 10000 });
await p.fill('.chat input', 'grazi'); await p.press('.chat input', 'Enter');
await p.waitForFunction(() => document.querySelectorAll('.msg.bot:not(.typing)').length >= 2, null, { timeout: 10000 });
const corr = await p.locator('.corr b').first().textContent();
console.log('tuteur: messages', await p.locator('.msg').count(), '| correction:', corr);
await p.reload(); await p.click('button:has-text("Tuteur")');
console.log('conversation restaurée après rechargement:', await p.locator('.msg').count() >= 3);
await p.screenshot({ path: '/tmp/claude-0/tutor.png' });
await b.close();
process.exit(done && !errors.length && corr === 'grazie' ? 0 : 1);
