// Handlers de l'API partagés par server.js (local) et api/*.js (Vercel). Chaque handler reçoit le corps JSON et renvoie { status, body }.
import { askTutor, coachPronunciation, MODEL } from './tutor.js';

const MOCK = process.env.PAROLA_TUTOR_MOCK === '1';
export const tutorReady = () => MOCK || !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const NOT_READY = { status: 503, body: { error: 'Tuteur non configuré : définis ANTHROPIC_API_KEY sur le serveur.' } };

export const status = () => ({ status: 200, body: { ready: tutorReady(), mock: MOCK, model: MODEL } });

export async function tutor(b) {
  if (!tutorReady()) return NOT_READY;
  if (!b || typeof b.lang !== 'string' || !b.scenario || !Array.isArray(b.messages)) return { status: 400, body: { error: 'Requête invalide' } };
  return { status: 200, body: await askTutor(b) };
}

export async function pronounce(b) {
  if (!tutorReady()) return NOT_READY;
  if (!b || typeof b.lang !== 'string' || typeof b.target !== 'string' || typeof b.heard !== 'string' || !Array.isArray(b.missed)) return { status: 400, body: { error: 'Requête invalide' } };
  return { status: 200, body: await coachPronunciation({ lang: b.lang, target: b.target.slice(0, 200), heard: b.heard.slice(0, 300), missed: b.missed.slice(0, 10).map(String) }) };
}

/** Transforme une erreur en réponse HTTP sans fuite de détails internes. */
export const failure = (e) => { console.error('[api]', e.message); return { status: e.status || 502, body: { error: e.status ? e.message : 'Le tuteur est indisponible pour le moment.' } }; };

/** Adaptateur pour les fonctions serverless Vercel (req.body déjà parsé). */
export const vercel = (fn) => async (req, res) => {
  if (fn !== status && req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  let r;
  try { r = await fn(req.body); } catch (e) { r = failure(e); }
  res.status(r.status).json(r.body);
};
