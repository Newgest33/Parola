import { LANGS } from './content.js';
import { checkTyped, review, newCard, mastery, shuffle, similarity, streak, dayKey, DAY, retention } from './lib.js';

/* ---------- état persistant (100 % local, exportable) ---------- */
const KEY = 'parola.v1';
const defaults = () => ({ lang: 'it', cards: {}, days: {}, xp: 0, goal: 15, tab: 'learn' });
let save;
try { save = { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { save = defaults(); }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* stockage indisponible */ } };

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
const mount = (...nodes) => { root.replaceChildren(...nodes); window.scrollTo(0, 0); };

/* ---------- voix : synthèse + reconnaissance (si le navigateur le permet) ---------- */
const canSpeak = 'speechSynthesis' in window;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function say(text) {
  if (!canSpeak) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = L().voice; u.rate = 0.9;
  const v = speechSynthesis.getVoices().find((x) => x.lang.replace('_', '-').startsWith(L().voice.slice(0, 2)));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function listen(onText, onEnd) {
  const r = new SR(); r.lang = L().voice; r.maxAlternatives = 3;
  r.onresult = (e) => onText([...e.results[0]].map((a) => a.transcript));
  r.onerror = () => onText([]); r.onend = onEnd; r.start();
  return r;
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
    ...[['learn', 'Apprendre'], ['stats', 'Progrès'], ['settings', 'Réglages']].map(([k, t]) =>
      h('button', { class: save.tab === k ? 'on' : '', role: 'tab', 'aria-selected': String(save.tab === k),
        onclick: () => { save.tab = k; persist(); home(); } }, t)));
  const head = h('div', { class: 'row between' },
    h('div', {}, h('h1', {}, 'Parola'), h('div', { class: 'row' }, ...langBtns)),
    h('div', { class: 'ring', style: `--p:${pct}`, title: 'Objectif du jour' }, h('span', {}, `${Math.min(today(), save.goal)}/${save.goal}`)));
  mount(head, tabs, save.tab === 'stats' ? statsView() : save.tab === 'settings' ? settingsView() : learnView(due, weak));
}

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
  return h('div', {}, actions, h('p', { class: 'mute' }, 'Toutes les unités sont libres d’accès : aucun verrou, aucune vie à perdre.'), ...units);
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

function settingsView() {
  const goal = h('input', { type: 'number', min: 5, max: 100, value: save.goal, style: 'width:90px', 'aria-label': 'Objectif quotidien',
    onchange: (e) => { save.goal = Math.max(5, Math.min(100, +e.target.value || 15)); persist(); } });
  const file = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async (e) => {
    try { const d = JSON.parse(await e.target.files[0].text()); if (!d.cards) throw 0; save = { ...defaults(), ...d }; persist(); home(); }
    catch { alert('Fichier invalide.'); } } });
  return h('div', {},
    h('div', { class: 'card row between' }, h('span', {}, 'Objectif quotidien (exercices)'), goal),
    h('div', { class: 'card' }, h('b', {}, 'Tes données t’appartiennent'),
      h('p', { class: 'mute' }, 'Tout reste dans ton navigateur : pas de compte, pas de pub, pas de pistage. Sauvegarde ou transfère ta progression :'),
      h('div', { class: 'row' },
        h('button', { onclick: () => {
          const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(save)], { type: 'application/json' })), download: 'parola-progression.json' });
          a.click(); } }, 'Exporter'),
        h('button', { onclick: () => file.click() }, 'Importer'), file,
        h('button', { onclick: () => { if (confirm('Tout effacer ?')) { save = defaults(); persist(); home(); } } }, 'Réinitialiser'))),
    h('p', { class: 'mute' }, canSpeak ? '🔊 Synthèse vocale disponible.' : '🔇 Synthèse vocale indisponible : les exercices d’écoute sont désactivés.',
      SR ? ' 🎤 Reconnaissance vocale disponible.' : ' 🎤 Reconnaissance vocale indisponible sur ce navigateur.'));
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
  S = { queue, i: 0, scope, total: queue.length, firstTry: new Set(), wrong: [], good: 0, xp: 0 };
  next();
}

function next() {
  if (S.i >= S.queue.length) return summary();
  const e = S.queue[S.i];
  const bar = h('div', { class: 'topbar' },
    h('button', { class: 'x', 'aria-label': 'Quitter', onclick: () => { if (confirm('Quitter la séance ? Ta progression est conservée.')) { speechSynthesis?.cancel(); home(); } } }, '✕'),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': S.i, 'aria-valuemax': S.total }, h('i', { style: `width:${(S.i / S.total) * 100}%` })));
  const body = h('div', { class: 'grow', style: 'display:flex;flex-direction:column' });
  mount(bar, body);
  const run = () => exercise(e, body);
  if (e.intro) introCard(e.it, body, () => { body.replaceChildren(); run(); }); else run();
}

function introCard(it, body, go) {
  say(it.t);
  body.append(h('p', { class: 'mute' }, 'Nouvelle phrase'),
    h('div', { class: 'card center' }, h('div', { class: 'big' }, it.t), h('div', {}, it.f),
      canSpeak ? h('button', { class: 'speak', 'aria-label': 'Écouter', onclick: () => say(it.t) }, '🔊') : null),
    h('div', { class: 'footer' }, h('button', { class: 'primary', onclick: go }, 'Compris')));
}

/* ---------- exercices ---------- */
function exercise(e, body) {
  const { it, step } = e;
  const words = it.t.split(' ').length;
  let type;
  if (step === 0) type = 'mc-recognise';
  else if (step === 1) type = words >= 2 ? 'build' : 'mc-produce';
  else if (step === 2) type = canSpeak ? 'listen' : 'type';
  else type = SR && Math.random() < 0.3 ? 'speak' : 'type';
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
    hear ? h('div', { class: 'row' }, h('div', { class: 'big grow' }, hear), audio && canSpeak ? h('button', { class: 'speak', 'aria-label': 'Écouter', onclick: () => say(hear) }, '🔊') : null) : null,
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
  const mic = h('button', { class: 'speak mic', 'aria-label': 'Parler' }, '🎤');
  const skip = h('button', { onclick: () => { body.replaceChildren(); typeEx(it, body, done); } }, 'Je ne peux pas parler');
  const status = h('p', { class: 'mute center' }, 'Appuie sur le micro et dis la phrase.');
  let rec;
  mic.onclick = () => {
    mic.classList.add('rec'); status.textContent = 'Je t’écoute…'; let got = null;
    rec = listen((alts) => { got = alts; }, () => {
      mic.classList.remove('rec');
      if (!got || !got.length) { status.textContent = 'Je n’ai rien entendu, réessaie.'; return; }
      const best = Math.max(...got.map((a) => similarity(a, it.t)));
      mic.disabled = true; skip.remove(); done(best >= 0.8, it.t, `J’ai compris : « ${got[0]} »`);
    });
  };
  body.append(h('h2', {}, 'Dis cette phrase à voix haute'), h('div', { class: 'big' }, it.f), h('div', { class: 'center' }, mic), status,
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
      if (ok) { S.good++; S.xp += 10; } else { S.xp += 2; S.wrong.push(it); }
    }
    save.xp += ok && first ? 10 : first ? 2 : 0;
    save.days[dayKey(Date.now())] = today() + 1;
    persist();
    if (!ok) { // la phrase revient quelques exercices plus tard, en version facile
      S.queue.splice(Math.min(S.i + 4, S.queue.length), 0, { it, step: 0 });
      S.total = S.queue.length;
    }
    const fb = h('div', { class: 'feedback ' + (ok ? 'good' : 'bad'), role: 'status' },
      h('b', {}, ok ? ['Bien joué !', ' ✓'] : 'Pas tout à fait'),
      h('div', { class: 'sol' }, ok ? note : `Réponse : ${solution}`), !ok && note ? h('div', { class: 'sol' }, note) : null,
      h('div', { class: 'sol mute' }, `${it.t} = ${it.f}`));
    const cont = h('button', { class: 'primary', onclick: () => { S.i++; next(); } }, 'Continuer');
    const foot = body.querySelector('.footer') || body.appendChild(h('div', { class: 'footer' }));
    foot.replaceChildren(fb, h('div', { style: 'height:10px' }), cont);
    cont.focus();
    if (ok && canSpeak && e.step !== 2) say(it.t);
  };
}

function summary() {
  const acc = S.firstTry.size ? Math.round((S.good / S.firstTry.size) * 100) : 0;
  mount(h('div', { class: 'center', style: 'margin-top:24px' },
    h('div', { style: 'font-size:3em' }, acc >= 80 ? '🎉' : acc >= 50 ? '👍' : '💪'),
    h('h1', {}, 'Séance terminée'),
    h('p', {}, `${acc} % de réussite du premier coup · +${S.xp} XP`)),
    S.wrong.length ? h('div', { class: 'card' }, h('b', {}, 'À retravailler (reviendra bientôt)'),
      ...S.wrong.map((w) => h('div', {}, `${w.t} — `, h('span', { class: 'mute' }, w.f)))) : h('div', { class: 'card center' }, 'Sans-faute ! 🌟'),
    h('div', { class: 'footer' }, h('button', { class: 'primary', onclick: home }, 'Terminer')));
}

home();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
