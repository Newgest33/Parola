// Serveur Parola : fichiers statiques + endpoint du tuteur IA. npm start -> http://localhost:8080
// Le tuteur a besoin de ANTHROPIC_API_KEY (ou PAROLA_TUTOR_MOCK=1 pour une démo sans clé).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { status, tutor, pronounce, failure, tutorReady } from './src/api.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const MODEL = process.env.PAROLA_MODEL || 'claude-opus-5-5';

const json = (res, { status, body }) => res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(body));

async function readJson(req, limit = 64 * 1024) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > limit) throw Object.assign(new Error('Requête trop grande'), { status: 413 }); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function api(req, res, path) {
  if (path === '/api/tutor/status' && req.method === 'GET') return json(res, status());
  if (path === '/api/tutor' && req.method === 'POST') return json(res, await tutor(await readJson(req)));
  if (path === '/api/pronounce' && req.method === 'POST') return json(res, await pronounce(await readJson(req)));
  json(res, { status: 404, body: { error: 'Introuvable' } });
}

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (p.includes('..')) { res.writeHead(400).end(); return; }
  if (p.startsWith('/api/')) {
    try { await api(req, res, p); } catch (e) { json(res, failure(e)); }
    return;
  }
  if (p.endsWith('/')) p += 'index.html';
  try {
    const data = await readFile(join(root, p));
    res.writeHead(200, { 'Content-Type': types[extname(p)] || 'application/octet-stream' }).end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(process.env.PORT || 8080, () => console.log(`Parola sur http://localhost:${process.env.PORT || 8080} — tuteur : ${tutorReady() ? (process.env.PAROLA_TUTOR_MOCK === '1' ? 'simulé' : MODEL) : 'non configuré (ANTHROPIC_API_KEY manquante)'}`));
