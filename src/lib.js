// Logique pure (testable sans navigateur) : normalisation, tolérance aux fautes, répétition espacée.

export const DAY = 86400000;

export function strip(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** minuscules, sans ponctuation, espaces compactés ; accents conservés */
export function clean(s) {
  return s.toLowerCase().replace(/[.,!?;:¿¡"«»()]/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
}

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export function similarity(a, b) {
  a = strip(clean(a)); b = strip(clean(b));
  const len = Math.max(a.length, b.length);
  return len ? 1 - levenshtein(a, b) / len : 1;
}

/**
 * Vérifie une réponse tapée. Indulgent sur la casse/ponctuation, signale (sans punir)
 * les accents oubliés et accepte une seule petite faute de frappe sur les phrases ≥ 5 lettres.
 * -> { ok, kind: 'exact'|'accent'|'typo'|'wrong' }
 */
export function checkTyped(answer, target) {
  const a = clean(answer), t = clean(target);
  if (!a) return { ok: false, kind: 'wrong' };
  if (a === t) return { ok: true, kind: 'exact' };
  if (strip(a) === strip(t)) return { ok: true, kind: 'accent' };
  if (t.length >= 5 && levenshtein(strip(a), strip(t)) <= 1) return { ok: true, kind: 'typo' };
  return { ok: false, kind: 'wrong' };
}

export function shuffle(arr, rnd = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const newCard = () => ({ reps: 0, interval: 0, ease: 2.3, due: 0, lapses: 0, seen: 0 });

/** Répétition espacée (famille SM-2) : bonne réponse -> intervalle x ease ; erreur -> retour dans 10 min. */
export function review(card, correct, now = Date.now()) {
  const c = { ...card, seen: card.seen + 1 };
  if (correct) {
    c.reps = card.reps + 1;
    c.interval = c.reps === 1 ? 1 : c.reps === 2 ? 3 : Math.round(card.interval * card.ease);
    c.ease = Math.min(2.8, card.ease + 0.05);
    c.due = now + c.interval * DAY;
  } else {
    c.reps = 0; c.interval = 0; c.lapses = card.lapses + 1;
    c.ease = Math.max(1.3, card.ease - 0.2);
    c.due = now + 10 * 60000;
  }
  return c;
}

/** Niveau de maîtrise 0..5 pour l'affichage */
export const mastery = (card) => (card ? Math.min(5, card.reps) : 0);

/** Probabilité estimée de se souvenir maintenant (courbe d'oubli exponentielle simplifiée) */
export function retention(card, now = Date.now()) {
  if (!card || !card.seen) return 0;
  const stability = Math.max(0.2, card.interval || 0.2);
  const elapsed = Math.max(0, (now - (card.due - (card.interval || 0) * DAY)) / DAY);
  return Math.exp(Math.log(0.9) * elapsed / stability);
}

const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export { dayKey };

/** Série : un jour d'absence est pardonné automatiquement (pas de culpabilisation). */
export function streak(days, now = Date.now()) {
  const set = new Set(Object.keys(days).filter((k) => days[k] > 0));
  let n = 0, grace = 1, t = now;
  if (!set.has(dayKey(t))) t -= DAY; // aujourd'hui pas encore pratiqué : ne casse pas la série
  for (let i = 0; i < 3650; i++, t -= DAY) {
    if (set.has(dayKey(t))) n++;
    else if (grace > 0 && set.has(dayKey(t - DAY))) grace--;
    else break;
  }
  return n;
}

/**
 * Évalue une phrase prononcée à partir des transcriptions du micro (plusieurs hypothèses possibles).
 * Alignement mot à mot (programmation dynamique) pour dire quels mots ont été reconnus.
 * -> { score 0..1, heard, words: [{ w, ok }] }
 */
export function scoreSpeech(transcripts, target) {
  const tWords = clean(target).split(' ').filter(Boolean);
  let best = { score: 0, heard: '', words: tWords.map((w) => ({ w, ok: false })) };
  for (const raw of transcripts || []) {
    const hWords = clean(raw).split(' ').filter(Boolean);
    const words = alignWords(tWords, hWords);
    const okCount = words.filter((x) => x.ok).length;
    // mélange : proportion de mots justes + similarité globale (tolère les découpages différents, ex. "buon giorno")
    const score = 0.6 * (okCount / tWords.length) + 0.4 * similarity(raw, target);
    if (score > best.score) best = { score, heard: raw, words };
  }
  return best;
}

function alignWords(t, h) {
  const m = t.length, n = h.length;
  const same = (a, b) => a === b || strip(a) === strip(b) || (a.length >= 4 && levenshtein(strip(a), strip(b)) <= 1);
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = same(t[i - 1], h[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const ok = Array(m).fill(false);
  for (let i = m, j = n; i > 0 && j > 0;) {
    if (same(t[i - 1], h[j - 1])) { ok[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return t.map((w, i) => ({ w, ok: ok[i] }));
}
