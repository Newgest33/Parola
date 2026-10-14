// Prononciation : simule la reconnaissance vocale du navigateur (absente en headless) et vérifie score + conseils.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH || 'playwright');
const url = process.argv[2] || 'http://localhost:8080';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 400, height: 800 } });
await ctx.addInitScript(() => {
  window.SpeechRecognition = class { start() { setTimeout(() => { const t = window.__fake || ''; this.onresult?.({ results: [[{ transcript: t }]] }); this.onend?.(); }, 50); } };
});
const p = await ctx.newPage(); const errors = []; p.on('pageerror', (e) => errors.push(e.message));
await p.goto(url);
await p.click('text=1. Premiers mots');
await p.waitForSelector('.pron .mic');
const target = (await p.locator('.card .big').first().textContent()).trim();
const words = target.split(' ');
await p.evaluate((w) => { window.__fake = w.slice(0, -1).concat('zzz').join(' '); }, words);
await p.click('.pron .mic');
await p.waitForSelector('.pron-words .ko');
await p.waitForSelector('.pron-tips b');
const verdict1 = await p.locator('.pron-out .pill').textContent();
const tip = await p.locator('.pron-tips').textContent();
await p.evaluate((t) => { window.__fake = t; }, target);
await p.click('.pron .mic');
await p.waitForFunction(() => /Parfait/.test(document.querySelector('.pron-out .pill')?.textContent || ''));
await p.screenshot({ path: '/tmp/claude-0/pron.png' });
console.log('cible:', target, '| essai 1:', verdict1, '| conseil:', tip.slice(0, 60), '| essai 2: Parfait ✓', '| erreurs:', errors.length ? errors : 'aucune');
await b.close();
process.exit(!errors.length && /retravailler|Presque/.test(verdict1) ? 0 : 1);
