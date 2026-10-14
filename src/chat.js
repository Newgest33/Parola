// Onglet « Tuteur » : jeu de rôle avec Léo (Claude côté serveur). Les outils DOM/voix sont injectés par app.js.
import { SCENARIOS } from './content.js';

export function tutorView(d) {
  const { h, L, save, persist } = d;
  const conv = save.chat?.lang === save.lang ? save.chat : null;
  const wrap = h('div', {});
  if (!conv) wrap.append(picker(d, wrap)); else wrap.append(chat(d, wrap, conv));
  return wrap;

  function start(sc) {
    save.chat = { lang: save.lang, scenario: sc.id, messages: [], status: null };
    persist();
    wrap.replaceChildren(chat(d, wrap, save.chat));
    send(d, wrap, save.chat, null); // premier tour : le personnage ouvre la scène
  }
  function picker(d, wrap) {
    const st = h('p', { class: 'mute' }, 'Vérification du tuteur…');
    fetch('api/tutor/status').then((r) => r.json()).then((s) => {
      st.textContent = s.ready ? (s.mock ? '🧪 Tuteur en mode simulé (démo).' : `🤖 Tuteur propulsé par Claude (${s.model}).`)
        : '⚠️ Tuteur non configuré sur le serveur : il faut définir ANTHROPIC_API_KEY. Tu peux quand même explorer les scénarios.';
    }).catch(() => { st.textContent = '⚠️ Serveur injoignable : le tuteur a besoin de `npm start`.'; });
    return h('div', {},
      h('div', { class: 'card' }, h('div', { class: 'row' }, d.mascot(72),
        h('div', {}, h('b', {}, 'Parle avec Léo'), h('div', { class: 'mute' }, `Un vrai dialogue en ${L().name.toLowerCase()} : Léo le spitz joue un rôle, te répond, te corrige en douceur et te souffle quoi dire.`))), st),
      ...SCENARIOS.map((sc) => h('button', { class: 'unit', onclick: () => start(sc) },
        h('span', { class: 'emoji' }, sc.emoji), h('span', { class: 'grow' }, h('b', {}, sc.title), h('div', { class: 'mute' }, sc.brief)))));
  }
}

function chat(d, wrap, conv) {
  const { h, L, save, persist, canSpeak, canListen, listen, say } = d;
  const sc = SCENARIOS.find((s) => s.id === conv.scenario) || SCENARIOS[0];
  const log = h('div', { class: 'chatlog', role: 'log', 'aria-live': 'polite' });
  const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Ton message', placeholder: `Écris en ${L().name.toLowerCase()}…` });
  const sendBtn = h('button', { class: 'primary', onclick: submit }, 'Envoyer');
  const mic = canListen() ? h('button', { class: 'mic', 'aria-label': 'Dicter' , onclick: () => {
    mic.classList.add('rec'); listen((alts) => { if (alts[0]) input.value = alts[0]; }, () => mic.classList.remove('rec')); } }, '🎤') : null;
  const hint = h('button', { onclick: () => { const s = lastReply(conv)?.suggestion; if (s) { input.value = s; input.focus(); } } }, '💡 Idée');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  const view = h('div', { class: 'chat' },
    h('div', { class: 'row between' }, h('b', {}, `${sc.emoji} ${sc.title}`),
      d.twoStep('Terminer', 'Sûr ? Terminer', () => { save.chat = null; persist(); wrap.replaceChildren(tutorView(d)); })),
    log,
    h('div', { class: 'chatbar' }, input, h('div', { class: 'row' }, hint, mic, sendBtn)));
  for (const m of conv.messages) log.append(bubble(d, m));
  if (conv.status === 'thinking') log.append(typing(h));
  if (conv.status?.error) log.append(errorBubble(d, conv.status.error, () => send(d, wrap, conv, null)));
  view.render = () => { log.replaceChildren(...conv.messages.map((m) => bubble(d, m))); if (conv.status === 'thinking') log.append(typing(h));
    if (conv.status?.error) log.append(errorBubble(d, conv.status.error, () => send(d, wrap, conv, null))); log.scrollTop = log.scrollHeight; };
  setTimeout(() => { log.scrollTop = log.scrollHeight; }, 0);
  return view;

  function submit() {
    const text = input.value.trim(); if (!text || conv.status === 'thinking') return;
    input.value = ''; send(d, wrap, conv, text);
  }
}

const lastReply = (conv) => [...conv.messages].reverse().find((m) => m.role === 'assistant')?.data;

async function send(d, wrap, conv, text) {
  const { save, persist, say, sfx, confetti } = d;
  if (text) conv.messages.push({ role: 'user', content: text });
  conv.status = 'thinking'; persist(); rerender();
  const hasUser = conv.messages.some((m) => m.role === 'user');
  const body = { lang: conv.lang, scenario: SCENARIOS.find((s) => s.id === conv.scenario),
    messages: hasUser ? conv.messages.map((m) => ({ role: m.role, content: m.content })) : [{ role: 'user', content: '(début de la scène : commence le dialogue)' }] };
  try {
    const r = await fetch('api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || `Erreur ${r.status}`);
    conv.messages.push({ role: 'assistant', content: data.reply, data });
    conv.status = null;
    if (text) {
      save.days[dayKey()] = (save.days[dayKey()] || 0) + 1;
      if (!data.corrections.length) { save.xp += 5; sfx('ok'); if (data.praise) confetti(25); } else { save.xp += 2; }
    }
    persist(); rerender(); say(data.reply);
  } catch (e) {
    conv.status = { error: e.message }; persist(); rerender(); sfx('bad');
  }
  function rerender() { const v = wrap.querySelector('.chat'); if (v?.render) v.render(); }
}
const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

function bubble(d, m) {
  const { h, canSpeak, say } = d;
  if (m.role === 'user') return h('div', { class: 'msg me' }, m.content);
  const data = m.data || {};
  const corr = (data.corrections || []).map((c) => h('div', { class: 'corr' }, h('s', {}, c.original), ' → ', h('b', {}, c.corrected), h('div', { class: 'mute' }, c.explanation)));
  const tr = h('div', { class: 'mute trans', hidden: true }, data.translation || '');
  const rep = h('div', { hidden: true }); let built = false;
  return h('div', { class: 'msg bot' },
    h('div', { class: 'row' }, d.mascot(36, (m.data?.corrections?.length ? 'idle' : 'idle')), h('div', { class: 'grow' }, m.content),
      canSpeak() ? h('button', { class: 'x', 'aria-label': 'Écouter', onclick: () => say(m.content) }, '🔊') : null,
      data.translation ? h('button', { class: 'x', 'aria-label': 'Traduire', onclick: () => { tr.hidden = !tr.hidden; } }, '🇫🇷') : null,
      h('button', { class: 'x', 'aria-label': 'Répéter à voix haute', onclick: () => { if (!built) { built = true; rep.append(d.pronounce(m.content, { intro: true })); } rep.hidden = !rep.hidden; } }, '🎤')),
    tr, rep,
    data.praise ? h('div', { class: 'praise' }, '⭐ ', data.praise) : null,
    corr.length ? h('div', { class: 'corrs' }, h('b', {}, 'Petites corrections'), ...corr) : null);
}
const typing = (h) => h('div', { class: 'msg bot typing', 'aria-label': 'Léo écrit' }, h('i'), h('i'), h('i'));
const errorBubble = (d, msg, retry) => d.h('div', { class: 'msg err' }, msg, ' ', d.h('button', { class: 'x', onclick: retry }, 'Réessayer'));
