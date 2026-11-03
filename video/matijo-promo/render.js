// Frame-by-frame deterministic render: Playwright seeks the page, pipes PNGs to ffmpeg.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const FPS = 30;
const DUR = +(process.argv[2] || 30); // seconds; pass 0 to use timeline.json duration
const OUT = process.argv[3] || 'video-silent.mp4';
const ONLY = process.argv[4] ? process.argv[4].split(',').map(Number) : null; // preview stills

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  const tl = JSON.parse(require('fs').readFileSync(path.resolve(__dirname, 'timeline.json'), 'utf8'));
  await page.evaluate(() => window.ready);
  await page.evaluate(tl => window.applyTimeline(tl), tl);
  await page.evaluate(() => window.seek(0));
  await page.waitForTimeout(300);

  if (ONLY) {
    for (const t of ONLY) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: `preview-${t}.png` });
    }
    await browser.close();
    return;
  }

  const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', OUT]);
  ff.stderr.on('data', d => process.stderr.write(d));

  const total = Math.round((DUR || tl.duration) * FPS);
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const t = i / FPS;
    await page.evaluate(t => window.seek(t), t);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${total} t=${t.toFixed(1)}s elapsed=${((Date.now()-t0)/1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('done', OUT);
})();
