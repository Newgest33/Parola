import { LANGS } from './content.js';
import { tutorView } from './chat.js';
import { mascot, react } from './mascot.js';
import { confetti, floatText, sfx, bounce, fx } from './fx.js';
import { checkTyped, review, newCard, mastery, shuffle, similarity, streak, dayKey, DAY, retention, scoreSpeech } from './lib.js';

/* ---------- état persistant (100 % local, exportable) ---------- */
const KEY = 'parola.v1';
const defaults = () => ({ lang: 'it', cards: {}, days: {}, xp: 0, goal: 15, tab: 'learn', sound: true });
let save;
try { save = { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { save = defaults(); }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* stockage indisponible */ } };

fx.sound = save.sound !== false;
const root = document.getElementById('app');
const L = () => LANGS[save.lang];
const card = (id) => save.cards[id] || newCard();
const today = () => save.days[dayKey(Date.now())] || 0;

/* ---------- mini DOM helper (pas d'innerHTML : zéro XSS) ---------- */
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
const kids = (...a) => a.filter((x) => x != null && x !== false); // replaceChildren(null) afficherait « null »
const mount = (...nodes) => { root.replaceChildren(...kids(...nodes)); window.scrollTo(0, 0); };

/* ---------- voix : synthèse + reconnaissance (si le navigateur le permet) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasTTS = 'speechSynthesis' in window;
// Voix réellement disponible pour la langue courante (sinon exercices audio/parole désactivés)
const canSpeak = () => hasTTS && !L().noVoice && (() => { const vs = speechSynthesis.getVoices(); return !vs.length || vs.some((v) => v.lang.replace('_', '-').startsWith(L().voice.slice(0, 2))); })();
const canListen = () => !!SR && !L().noVoice;
function say(text, rate = 0.9) {
  if (!canSpeak()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = L().voice; u.rate = rate;
  const v = speechSynthesis.getVoices().find((x) => x.lang.replace('_', '-').startsWith(L().voice.slice(0, 2)));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
/** Léo parle en français (verdicts, consignes). Enchaîne après la synthèse en cours. */
function sayFr(text, then) {
  if (!hasTTS) { then?.(); return; }
  const u = new SpeechSynthesisUtterance(text); u.lang = 'fr-FR'; u.rate = 1;
  const v = speechSynthesis.getVoices().find((x) => x.lang.replace('_', '-').startsWith('fr'));
  if (v) u.voice = v;
  if (then) u.onend = then;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
const micBlocked = () => location.hostname.endsWith('claude.ai'); // page de démo : le visualiseur refuse le micro
function listen(onText, onEnd) {
  const r = new SR(); r.lang = L().voice; r.maxAlternatives = 3;
  r.onresult = (e) => onText([...e.results[0]].map((a) => a.transcript));
  r.onerror = (e) => onText([], e.error); r.onend = onEnd; r.start();
  return r;
}

/* ---------- prononciation : écouter, dire, score mot à mot, conseils de Léo ---------- */
let tutorStatus;
const tutorInfo = () => (tutorStatus ??= fetch('api/tutor/status').then((r) => r.json()).catch(() => ({ ready: false })));

/** Widget réutilisable : 🔊 écouter, 🐢 lentement, 🎤 dire la phrase -> verdict, mots reconnus / ratés, conseils. */
function pronounce(text, { onResult, intro = true } = {}) {
  const box = h('div', { class: 'pron' });
  const noMic = !canListen() || micBlocked();
  const mic = h('button', { class: 'speak mic', 'aria-label': 'Dire la phrase', disabled: noMic,
    title: noMic ? (micBlocked() ? 'Le micro est bloqué dans cette page de démonstration : ouvre Parola sur son site pour parler.' : L().noVoice ? `La reconnaissance vocale ne couvre pas encore le ${L().name.toLowerCase()}.` : 'Reconnaissance vocale indisponible ici : utilise Chrome, Edge ou Safari.') : 'Dis la phrase' }, '🎤');
  const out = h('div', { class: 'pron-out', 'aria-live': 'polite' },
    intro ? h('span', { class: 'mute' }, noMic ? mic.title : 'Écoute, puis appuie sur le micro et répète.') : null);
  let errKind = null;
  mic.onclick = () => {
    mic.classList.add('rec'); let got = [];
    out.replaceChildren(h('span', { class: 'mute' }, 'Je t’écoute… dis : ', h('b', {}, text)));
    listen((alts, err) => { got = alts; errKind = err; }, () => {
      mic.classList.remove('rec');
      if (!got.length) {
        const why = errKind === 'not-allowed' || errKind === 'service-not-allowed' ? 'Le navigateur bloque le micro ici. Autorise-le (icône 🔒 dans la barre d’adresse) ou ouvre Parola sur son site.' : errKind === 'language-not-supported' ? 'Cette langue n’est pas reconnue par ton navigateur.' : errKind === 'network' ? 'La reconnaissance vocale a besoin d’Internet.' : 'Rien entendu. Réessaie, plus près du micro.';
        out.replaceChildren(h('span', { class: 'ko' }, why)); sayFr(errKind ? 'Je n’ai pas accès au micro.' : 'Je n’ai rien entendu, réessaie.'); return;
      }
      const r = scoreSpeech(got, text); render(r); onResult?.(r);
    });
  };
  function render(r) {
    const pct = Math.round(r.score * 100);
    const [label, cls] = pct >= 85 ? ['Parfait !', 'good'] : pct >= 65 ? ['Presque !', 'mid'] : ['À retravailler', 'bad'];
    const missed = r.words.filter((w) => !w.ok).map((w) => w.w);
    const tips = h('div', { class: 'pron-tips' });
    // Léo répond à voix haute, puis redit la phrase si besoin
    if (pct >= 85) sayFr(pick(['Exact !', 'Parfait, c’est ça !', 'Oui, exactement !']));
    else if (pct >= 65) sayFr(`Presque ! Attention à ${missed.join(' et ')}. Écoute :`, () => say(text));
    else sayFr('Pas tout à fait. Écoute bien et répète :', () => say(text));
    out.replaceChildren(...kids(
      h('div', { class: 'row wrap' }, h('span', { class: 'pill ' + cls }, `${label} ${pct} %`), h('span', { class: 'mute' }, `Compris : « ${r.heard} »`)),
      h('div', { class: 'pron-words' }, ...r.words.map((w) => h('span', { class: w.ok ? 'ok' : 'ko' }, w.w))),
      missed.length ? h('div', { class: 'mute' }, 'Réécoute 🔊 et réessaie les mots en rouge.') : null, tips));
    if (pct < 85) coach(text, r, missed, tips);
  }
  box.append(h('div', { class: 'row' },
    canSpeak() ? h('button', { class: 'speak', 'aria-label': 'Écouter', onclick: () => say(text) }, '🔊') : null,
    canSpeak() ? h('button', { class: 'speak', 'aria-label': 'Écouter lentement', onclick: () => say(text, 0.55) }, '🐢') : null,
    mic), out);
  return box;
}

/** Conseils de prononciation par le tuteur (si le serveur est là), à partir de ce que le micro a compris. */
async function coach(target, r, missed, el) {
  const st = await tutorInfo(); if (!st.ready) return;
  el.replaceChildren(h('span', { class: 'mute' }, 'Léo prépare un conseil…'));
  try {
    const res = await fetch('api/pronounce', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: save.lang, target, heard: r.heard, missed }) });
    const d = await res.json(); if (!res.ok) throw new Error(d.error);
    el.replaceChildren(h('div', { class: 'row' }, mascot(36), h('div', { class: 'grow' },
      d.phonetic ? h('div', {}, 'Ça se dit à peu près : ', h('b', {}, d.phonetic)) : null,
      ...d.tips.map((t) => h('div', {}, '• ', t)))));
  } catch { el.replaceChildren(); }
}

/* ---------- accueil ---------- */
function unitStats(u) {
  const known = u.items.filter((i) => card(i.id).reps > 0).length;
  const sum = u.items.reduce((s, i) => s + mastery(save.cards[i.id]), 0);
  return { known, pct: Math.round((sum / (u.items.length * 5)) * 100) };
}
const dueItems = () => L().items.filter((i) => save.cards[i.id] && save.cards[i.id].due <= Date.now());
const weakItems = () => L().items.filter((i) => card(i.id).lapses > 0);

function home() {
  const due = dueItems().length, weak = weakItems().length;
  const pct = Math.min(100, Math.round((today() / save.goal) * 100));
  const langBtns = Object.values(LANGS).map((l) =>
    h('button', { class: l.code === save.lang ? 'pill on' : 'pill', 'aria-pressed': String(l.code === save.lang),
      onclick: () => { save.lang = l.code; persist(); home(); } }, `${l.flag} ${l.name}`));
  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    ...[['learn', 'Apprendre'], ['tutor', 'Tuteur'], ['stats', 'Progrès'], ['settings', 'Réglages']].map(([k, t]) =>
      h('button', { class: save.tab === k ? 'on' : '', role: 'tab', 'aria-selected': String(save.tab === k),
        onclick: () => { save.tab = k; persist(); home(); } }, t)));
  const head = h('div', { class: 'row between' },
    h('div', {}, h('div', { class: 'row' }, h('h1', {}, 'Parola'), mascotBtn()), h('div', { class: 'row wrap' }, ...langBtns)),
    h('div', { class: 'ring', style: `--p:${pct}`, title: 'Objectif du jour' }, h('span', {}, `${Math.min(today(), save.goal)}/${save.goal}`)));
  mount(head, tabs, save.tab === 'stats' ? statsView() : save.tab === 'settings' ? settingsView() : save.tab === 'tutor' ? tutorView(tutorDeps()) : learnView(due, weak));
}

const CHEERS = ['Magnifique !', 'Roooar ! Parfait !', 'Tu gères !', 'Du premier coup !', 'Léo est fier de toi !', 'Ça, c’est du beau travail !', 'Incroyable !'];
const OOPS = ['Aïe… mais on apprend !', 'Même Léo se trompe de gamelle parfois.', 'Pas grave, on y revient !', 'Ouille ! Je le note pour plus tard.'];
const pick = (a) => a[(Math.random() * a.length) | 0];
function mascotBtn() {
  const dog = mascot(96);
  const b = h('button', { class: 'mascot', 'aria-label': 'Léo le spitz : touche-moi !', onclick: () => {
    const it = pick(L().items); react(dog, Math.random() < 0.25 ? 'dance' : 'happy', 1200); sfx('ok'); say(it.t);
    const r = b.getBoundingClientRect(); floatText(Math.random() < 0.3 ? 'Wouf !' : it.t, r.left + r.width / 2, r.bottom + 10, 'var(--brand)');
  } }, dog);
  return b;
}

const tutorDeps = () => ({ h, L, mascot, react, twoStep, pronounce, get save() { return save; }, persist, say, listen, canSpeak, canListen, sfx, confetti });

function learnView(due, weak) {
  const n = streak(save.days);
  const actions = h('div', { class: 'card' },
    h('div', { class: 'row between' },
      h('div', {}, h('b', {}, `🔥 ${n} jour${n > 1 ? 's' : ''}`), h('div', { class: 'mute' }, 'Un jour manqué est pardonné automatiquement.')),
      h('span', { class: 'pill' }, `${save.xp} XP`)),
    h('div', { class: 'row', style: 'margin-top:12px' },
      h('button', { class: 'primary grow', disabled: !due, onclick: () => startSession('review') },
        due ? `Réviser maintenant (${due})` : 'Rien à réviser 🎉'),
      weak ? h('button', { onclick: () => startSession('weak') }, `Points faibles (${weak})`) : null));
  const units = L().units.map((u, idx) => {
    const s = unitStats(u);
    return h('button', { class: 'unit', onclick: () => startSession(u.id), 'aria-label': `${u.title}, ${s.pct} % maîtrisé` },
      h('span', { class: 'emoji' }, u.emoji),
      h('span', { class: 'grow' }, h('b', {}, `${idx + 1}. ${u.title}`),
        h('div', { class: 'bar' }, h('i', { style: `width:${s.pct}%` })),
        h('div', { class: 'mute' }, `${s.known}/${u.items.length} appris`)));
  });
  const tutor = h('button', { class: 'unit tutorcta', onclick: () => { save.tab = 'tutor'; persist(); home(); } },
    h('span', { class: 'emoji' }, mascot(56)), h('span', { class: 'grow' }, h('b', {}, 'Parler avec Léo'), h('div', { class: 'mute' }, 'Jeu de rôle avec un tuteur IA qui te corrige en douceur.')));
  return h('div', {}, actions, tutor, h('p', { class: 'mute' }, 'Toutes les unités sont libres d’accès : aucun verrou, aucune vie à perdre.'), ...units);
}

function statsView() {
  const items = L().items, cs = items.map((i) => save.cards[i.id]).filter(Boolean);
  const known = cs.filter((c) => c.reps > 0).length, solid = cs.filter((c) => c.reps >= 4).length;
  const avgRet = cs.length ? Math.round((cs.reduce((s, c) => s + retention(c), 0) / cs.length) * 100) : 0;
  const cells = Array.from({ length: 14 }, (_, k) => {
    const v = save.days[dayKey(Date.now() - (13 - k) * DAY)] || 0;
    return h('i', { class: v >= save.goal ? 'l3' : v >= save.goal / 2 ? 'l2' : v > 0 ? 'l1' : '', title: `${v} exercices` });
  });
  const stat = (v, t) => h('div', { class: 'card center grow' }, h('div', { class: 'big' }, String(v)), h('div', { class: 'mute' }, t));
  return h('div', {},
    h('div', { class: 'row' }, stat(known, 'phrases apprises'), stat(solid, 'bien ancrées')),
    h('div', { class: 'row' }, stat(`${avgRet} %`, 'mémoire estimée'), stat(save.xp, 'XP')),
    h('div', { class: 'card' }, h('b', {}, '14 derniers jours'), h('div', { class: 'heat', style: 'margin-top:8px' }, ...cells)),
    h('p', { class: 'mute' }, 'La « mémoire estimée » modélise l’oubli : réviser au bon moment, c’est retenir plus avec moins d’efforts.'));
}

/** Bouton de confirmation en deux temps (les boîtes de dialogue natives ne sont pas fiables partout). */
function twoStep(label, confirmLabel, action) {
  let armed = false, timer;
  const b = h('button', { onclick: () => {
    if (!armed) { armed = true; b.textContent = confirmLabel; b.classList.add('danger'); timer = setTimeout(() => { armed = false; b.textContent = label; b.classList.remove('danger'); }, 4000); return; }
    clearTimeout(timer); action();
  } }, label);
  return b;
}
export { twoStep };

function settingsView() {
  const goal = h('input', { type: 'number', min: 5, max: 100, value: save.goal, style: 'width:90px', 'aria-label': 'Objectif quotidien',
    onchange: (e) => { save.goal = Math.max(5, Math.min(100, +e.target.value || 15)); persist(); } });
  const file = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async (e) => {
    try { const d = JSON.parse(await e.target.files[0].text()); if (!d.cards) throw 0; save = { ...defaults(), ...d }; persist(); home(); }
    catch { floatText('Fichier invalide', innerWidth / 2, innerHeight / 2, 'var(--ko)'); } } });
  return h('div', {},
    h('div', { class: 'card row between' }, h('span', {}, 'Objectif quotidien (exercices)'), goal),
    h('div', { class: 'card' }, h('b', {}, 'Tes données t’appartiennent'),
      h('p', { class: 'mute' }, 'Tout reste dans ton navigateur : pas de compte, pas de pub, pas de pistage. Sauvegarde ou transfère ta progression :'),
      h('div', { class: 'row' },
        h('button', { onclick: () => {
          const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(save)], { type: 'application/json' })), download: 'parola-progression.json' });
          a.click(); } }, 'Exporter'),
        h('button', { onclick: () => file.click() }, 'Importer'), file,
        h('button', { onclick: () => navigator.clipboard?.writeText(JSON.stringify(save)).then(() => floatText('Copié !', innerWidth / 2, innerHeight / 2, 'var(--ok)')).catch(() => {}) }, 'Copier'),
        twoStep('Réinitialiser', 'Tout effacer, vraiment ?', () => { save = defaults(); persist(); home(); }))),
    h('div', { class: 'card row between' }, h('span', {}, '🔊 Effets sonores'),
      h('button', { 'aria-pressed': String(save.sound), onclick: (e) => { save.sound = !save.sound; fx.sound = save.sound; persist(); e.target.textContent = save.sound ? 'Activés' : 'Coupés'; e.target.setAttribute('aria-pressed', String(save.sound)); if (save.sound) sfx('ok'); } }, save.sound ? 'Activés' : 'Coupés')),
    h('p', { class: 'mute' }, canSpeak() ? '🔊 Synthèse vocale disponible.' : `🔇 Pas de voix pour ${L().name} sur cet appareil : l’écoute et la parole sont remplacées par l’écrit.`,
      canListen() ? ' 🎤 Reconnaissance vocale disponible.' : ' 🎤 Reconnaissance vocale indisponible.'));
}

/* ---------- construction d'une séance ---------- */
const SESSION_SIZE = 12;
function buildQueue(scope) {
  let pool, fresh = [];
  if (scope === 'review') pool = dueItems();
  else if (scope === 'weak') pool = weakItems();
  else {
    const u = L().units.find((x) => x.id === scope);
    pool = u.items.filter((i) => save.cards[i.id] && save.cards[i.id].due <= Date.now());
    fresh = u.items.filter((i) => !save.cards[i.id]).slice(0, 4);
    // unité entièrement à jour : on pratique les plus fragiles plutôt que de bloquer
    if (!pool.length && !fresh.length) pool = u.items.slice().sort((a, b) => retention(save.cards[a.id]) - retention(save.cards[b.id])).slice(0, 6);
  }
  pool = pool.slice().sort((a, b) => card(a.id).due - card(b.id).due).slice(0, SESSION_SIZE - fresh.length * 2);
  const q = [];
  for (const it of pool) q.push({ it, step: stepFor(card(it.id).reps) });
  for (const it of fresh) q.push({ it, step: 0, intro: true });
  const later = shuffle(q);
  for (const it of fresh) later.push({ it, step: 1 }); // 2e passage plus difficile en fin de séance
  return later.slice(0, SESSION_SIZE);
}
const stepFor = (reps) => Math.min(3, reps);

let S; // séance courante
function startSession(scope) {
  const queue = buildQueue(scope);
  if (!queue.length) return home();
  S = { queue, i: 0, scope, total: queue.length, firstTry: new Set(), wrong: [], good: 0, xp: 0, combo: 0 };
  next();
}

function next() {
  if (S.i >= S.queue.length) return summary();
  const e = S.queue[S.i];
  const bar = h('div', { class: 'topbar' },
    h('button', { class: 'x', 'aria-label': 'Quitter', onclick: () => { window.speechSynthesis?.cancel(); home(); } }, '✕'),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': S.i, 'aria-valuemax': S.total }, h('i', { style: `width:${(S.i / S.total) * 100}%` })),
    S.combo >= 2 ? h('span', { class: 'combo', 'aria-label': `${S.combo} bonnes réponses d’affilée` }, `🔥 x${S.combo}`) : null);
  const body = h('div', { class: 'grow', style: 'display:flex;flex-direction:column' });
  mount(bar, body);
  const run = () => exercise(e, body);
  if (e.intro) introCard(e.it, body, () => { body.replaceChildren(); run(); }); else run();
}

function introCard(it, body, go) {
  say(it.t);
  body.append(h('p', { class: 'mute' }, 'Nouvelle phrase'),
    h('div', { class: 'card center' }, h('div', { class: 'big' }, it.t), h('div', {}, it.f)),
    h('div', { class: 'card' }, h('b', {}, 'À toi de la dire'), pronounce(it.t, { onResult: (r) => { if (r.score >= 0.85) { sfx('ok'); save.xp += 2; persist(); } } })),
    h('div', { class: 'footer' }, h('button', { class: 'primary', onclick: go }, 'Compris')));
}

/* ---------- exercices ---------- */
function exercise(e, body) {
  const { it, step } = e;
  const words = it.t.split(' ').length;
  let type;
  if (step === 0) type = 'mc-recognise';
  else if (step === 1) type = words >= 2 ? 'build' : 'mc-produce';
  else if (step === 2) type = canSpeak() ? 'listen' : 'type';
  else type = canListen() && Math.random() < 0.3 ? 'speak' : 'type';
  ({ 'mc-recognise': mcRecognise, 'mc-produce': mcProduce, build, listen: listenEx, type: typeEx, speak: speakEx })[type](it, body, finish(e, it, body));
}

function distractors(it, n, key) {
  const others = L().items.filter((x) => x.id !== it.id && x[key] !== it[key]);
  return shuffle(others).slice(0, n).map((x) => x[key]);
}

function mcRecognise(it, body, done) {
  say(it.t);
  choices(body, 'Que signifie cette phrase ?', it.t, it.f, shuffle([it.f, ...distractors(it, 3, 'f')]), done, true);
}
function mcProduce(it, body, done) {
  choices(body, `Comment dit-on « ${it.f} » ?`, null, it.t, shuffle([it.t, ...distractors(it, 3, 't')]), done);
}
function choices(body, prompt, hear, answer, opts, done, audio) {
  let picked = null, locked = false;
  const btns = opts.map((o, k) => h('button', { onclick: () => pick(k) }, `${k + 1}. ${o}`));
  const check = h('button', { class: 'primary', disabled: true, onclick: () => {
    locked = true; btns.forEach((b, k) => { if (opts[k] === answer) b.classList.add('good'); else if (k === picked) b.classList.add('bad'); b.disabled = true; });
    check.remove(); done(opts[picked] === answer, answer);
  } }, 'Vérifier');
  function pick(k) { if (locked) return; picked = k; btns.forEach((b, j) => b.classList.toggle('sel', j === k)); check.disabled = false; }
  body.append(h('h2', {}, prompt),
    hear ? h('div', { class: 'row' }, h('div', { class: 'big grow' }, hear), audio && canSpeak() ? h('button', { class: 'speak', 'aria-label': 'Écouter', onclick: () => say(hear) }, '🔊') : null) : null,
    h('div', { class: 'options' }, ...btns), h('div', { class: 'footer', id: 'foot' }, check));
  keys((n) => n < opts.length && pick(n), () => !check.disabled && check.click());
}

function build(it, body, done) {
  const toks = it.t.split(' ');
  const bankWords = shuffle([...toks, ...distractors(it, 2, 't').map((t) => t.split(' ')[0]).filter((w) => !toks.includes(w))]);
  const chosen = [];
  const answer = h('div', { class: 'answer', 'aria-label': 'Ta phrase' }), bank = h('div', { class: 'bank' });
  const check = h('button', { class: 'primary', disabled: true, onclick: () => {
    check.remove(); bank.querySelectorAll('button').forEach((b) => (b.disabled = true));
    done(chosen.map((c) => c.w).join(' ') === toks.join(' '), it.t);
  } }, 'Vérifier');
  const btns = bankWords.map((w, k) => {
    const b = h('button', { class: 'chip', onclick: () => {
      if (b.parentNode === bank) { chosen.push({ w, b }); answer.append(b); } else { chosen.splice(chosen.findIndex((c) => c.b === b), 1); bank.append(b); }
      check.disabled = !chosen.length;
    } }, w);
    return b;
  });
  bank.append(...btns);
  body.append(h('h2', {}, 'Traduis cette phrase'), h('div', { class: 'big' }, it.f), answer, bank, h('div', { class: 'footer' }, check));
}

function typeEx(it, body, done, hint = 'Écris en ' + L().name.toLowerCase()) {
  textInput(body, h('div', {}, h('h2', {}, hint), h('div', { class: 'big' }, it.f)), it, done);
}
function listenEx(it, body, done) {
  const skip = h('button', { onclick: () => { body.replaceChildren(); typeEx(it, body, done); } }, 'Je ne peux pas écouter');
  textInput(body, h('div', {}, h('h2', {}, 'Écris ce que tu entends'),
    h('button', { class: 'speak', 'aria-label': 'Écouter', onclick: () => say(it.t) }, '🔊'), ' ',
    h('button', { class: 'speak', 'aria-label': 'Écouter lentement', onclick: () => { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(it.t); u.lang = L().voice; u.rate = 0.5; speechSynthesis.speak(u); } }, '🐢')), it, done, skip);
  setTimeout(() => say(it.t), 250);
}
function textInput(body, top, it, done, extra) {
  const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Ta réponse' });
  const check = h('button', { class: 'primary', onclick: () => {
    const r = checkTyped(input.value, it.t); if (!input.value.trim()) return;
    input.disabled = true; check.remove(); extra?.remove();
    done(r.ok, it.t, r.kind === 'accent' ? 'Attention aux accents !' : r.kind === 'typo' ? 'Petite faute de frappe, c’est accepté.' : '');
  } }, 'Vérifier');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check.click(); });
  body.append(top, input, h('div', { class: 'footer' }, extra ? h('div', { class: 'row' }, extra) : null, check));
  setTimeout(() => input.focus(), 50);
}
function speakEx(it, body, done) {
  const skip = h('button', { onclick: () => { body.replaceChildren(); typeEx(it, body, done); } }, 'Je ne peux pas parler');
  let tries = 0;
  const widget = pronounce(it.t, { intro: true, onResult: (r) => {
    tries++;
    if (r.score >= 0.65 || tries >= 2) { skip.remove(); widget.querySelector('.mic').disabled = true; done(r.score >= 0.65, it.t, `Prononciation : ${Math.round(r.score * 100)} % (compris : « ${r.heard} »)`); }
    else { sfx('bad'); }
  } });
  body.append(h('h2', {}, 'Dis cette phrase à voix haute'), h('div', { class: 'big' }, it.f), h('div', { class: 'mute' }, '(tu as deux essais)'), widget,
    h('div', { class: 'footer' }, skip));
}

function keys(onNum, onEnter) {
  const fn = (ev) => {
    if (!root.isConnected || !document.querySelector('.options')) return document.removeEventListener('keydown', fn);
    if (ev.key >= '1' && ev.key <= '9') onNum(+ev.key - 1); else if (ev.key === 'Enter') onEnter();
  };
  document.addEventListener('keydown', fn);
}

/* ---------- résultat d'un exercice : SRS, XP, retour d'information ---------- */
function finish(e, it, body) {
  return (ok, solution, note = '') => {
    const first = !S.firstTry.has(it.id);
    if (first) { // seule la 1re tentative compte pour la mémoire : une réponse "réparée" ne prouve rien
      S.firstTry.add(it.id);
      save.cards[it.id] = review(card(it.id), ok);
      if (ok) { S.good++; S.xp += 10; S.combo++; } else { S.xp += 2; S.wrong.push(it); S.combo = 0; }
    }
    celebrate(ok, first, body);
    save.xp += ok && first ? 10 : first ? 2 : 0;
    save.days[dayKey(Date.now())] = today() + 1;
    persist();
    if (!ok) { // la phrase revient quelques exercices plus tard, en version facile
      S.queue.splice(Math.min(S.i + 4, S.queue.length), 0, { it, step: 0 });
      S.total = S.queue.length;
    }
    const dog = mascot(68, ok ? 'happy' : 'sad');
    if (ok) setTimeout(() => { dog.classList.remove('happy'); dog.classList.add('idle'); }, 900);
    const fb = h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), role: 'status' },
      h('div', { class: 'row' }, dog, h('b', { class: 'grow' }, ok ? pick(CHEERS) : pick(OOPS))),
      h('div', { class: 'sol' }, ok ? note : `Réponse : ${solution}`), !ok && note ? h('div', { class: 'sol' }, note) : null,
      h('div', { class: 'sol mute' }, `${it.t} = ${it.f}`));
    const cont = h('button', { class: 'primary', onclick: () => { S.i++; next(); } }, 'Continuer');
    const foot = body.querySelector('.footer') || body.appendChild(h('div', { class: 'footer' }));
    const rep = (canListen() || canSpeak()) && e.step !== 3 ? h('details', { class: 'card pron-details' }, h('summary', {}, '🎤 Dis-la à voix haute'),
      pronounce(it.t, { intro: false, onResult: (r) => { if (r.score >= 0.85) { sfx('ok'); react(dog, 'happy'); save.xp += 2; persist(); } else react(dog, 'sad', 1500); } })) : null;
    foot.replaceChildren(...kids(fb, rep, h('div', { style: 'height:10px' }), cont));
    cont.focus();
    if (ok && canSpeak() && e.step !== 2) say(it.t);
  };
}

function celebrate(ok, first, body) {
  const foot = body.querySelector('.footer'), r = (foot || body).getBoundingClientRect();
  const x = r.left + r.width / 2, y = Math.min(r.top, innerHeight - 120);
  if (ok) {
    sfx('ok');
    if (first) floatText('+10 XP', x, y, 'var(--ok)');
    if (S.combo >= 3) { confetti(S.combo >= 5 ? 70 : 30, x, y); if (S.combo === 3 || S.combo === 5) floatText(`🔥 combo x${S.combo} !`, x, y - 40, 'var(--brand)'); }
  } else { sfx('bad'); bounce(body, 'shake'); }
}

function summary() {
  const acc = S.firstTry.size ? Math.round((S.good / S.firstTry.size) * 100) : 0;
  const xpEl = h('b', {}, '+0 XP');
  mount(h('div', { class: 'center', style: 'margin-top:24px' },
    h('div', {}, mascot(120, acc >= 80 ? 'dance' : acc >= 50 ? 'happy' : 'idle')),
    h('h1', {}, 'Séance terminée'),
    h('p', {}, `${acc} % de réussite du premier coup · `, xpEl)),
    S.wrong.length ? h('div', { class: 'card' }, h('b', {}, 'À retravailler (reviendra bientôt)'),
      ...S.wrong.map((w) => h('div', {}, `${w.t} — `, h('span', { class: 'mute' }, w.f)))) : h('div', { class: 'card center' }, 'Sans-faute ! 🌟'),
    h('div', { class: 'footer' }, h('button', { class: 'primary', onclick: home }, 'Terminer')));
  if (acc >= 50) { sfx('win'); confetti(90, innerWidth / 2, innerHeight * 0.3); setTimeout(() => confetti(60, innerWidth * 0.25, innerHeight * 0.35), 350); setTimeout(() => confetti(60, innerWidth * 0.75, innerHeight * 0.35), 600); }
  let t0 = null; const tick = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / 900); xpEl.textContent = `+${Math.round(S.xp * k)} XP`; if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

home();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
