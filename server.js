// Serveur Parola : fichiers statiques + endpoint du tuteur IA. npm start -> http://localhost:8080
// Le tuteur a besoin de ANTHROPIC_API_KEY (ou PAROLA_TUTOR_MOCK=1 pour une démo sans clé).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { askTutor, coachPronunciation, MODEL } from './src/tutor.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' };
const MOCK = process.env.PAROLA_TUTOR_MOCK === '1';
const tutorReady = MOCK || !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

const json = (res, status, body) => res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(body));

async function readJson(req, limit = 64 * 1024) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > limit) throw Object.assign(new Error('Requête trop grande'), { status: 413 }); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function api(req, res, path) {
  if (path === '/api/tutor/status' && req.method === 'GET') return json(res, 200, { ready: tutorReady, mock: MOCK, model: MODEL });
  if (path === '/api/tutor' && req.method === 'POST') {
    if (!tutorReady) return json(res, 503, { error: 'Tuteur non configuré : définis ANTHROPIC_API_KEY sur le serveur.' });
    const body = await readJson(req);
    if (!body || typeof body.lang !== 'string' || !body.scenario || !Array.isArray(body.messages)) return json(res, 400, { error: 'Requête invalide' });
    return json(res, 200, await askTutor(body));
  }
  if (path === '/api/pronounce' && req.method === 'POST') {
    if (!tutorReady) return json(res, 503, { error: 'Tuteur non configuré : définis ANTHROPIC_API_KEY sur le serveur.' });
    const b = await readJson(req);
    if (!b || typeof b.lang !== 'string' || typeof b.target !== 'string' || typeof b.heard !== 'string' || !Array.isArray(b.missed)) return json(res, 400, { error: 'Requête invalide' });
    return json(res, 200, await coachPronunciation({ lang: b.lang, target: b.target.slice(0, 200), heard: b.heard.slice(0, 300), missed: b.missed.slice(0, 10).map(String) }));
  }
  json(res, 404, { error: 'Introuvable' });
}

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (p.includes('..')) { res.writeHead(400).end(); return; }
  if (p.startsWith('/api/')) {
    try { await api(req, res, p); }
    catch (e) { console.error('[tutor]', e.message); json(res, e.status || 502, { error: e.status ? e.message : 'Le tuteur est indisponible pour le moment.' }); }
    return;
  }
  if (p.endsWith('/')) p += 'index.html';
  try {
    const data = await readFile(join(root, p));
    res.writeHead(200, { 'Content-Type': types[extname(p)] || 'application/octet-stream' }).end(data);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(process.env.PORT || 8080, () => console.log(`Parola sur http://localhost:${process.env.PORT || 8080} — tuteur : ${tutorReady ? (MOCK ? 'simulé' : MODEL) : 'non configuré (ANTHROPIC_API_KEY manquante)'}`));
