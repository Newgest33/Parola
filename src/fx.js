// Effets visuels et sonores (confettis, texte flottant, bips WebAudio). Tout est coupé si l'utilisateur
// préfère moins d'animations (prefers-reduced-motion).
export const fx = { sound: true };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#e8590c', '#fcc419', '#51cf66', '#339af0', '#f06595', '#9775fa'];
const EMOJI = ['🎉', '⭐', '🍺', '🍝', '🥘', '✨'];

function layer() {
  let l = document.getElementById('fx');
  if (!l) { l = document.createElement('div'); l.id = 'fx'; l.setAttribute('aria-hidden', 'true'); document.body.append(l); }
  return l;
}

export function confetti(count = 40, x = innerWidth / 2, y = innerHeight * 0.6) {
  if (reduced()) return;
  const l = layer();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    const emoji = Math.random() < 0.12;
    el.textContent = emoji ? EMOJI[(Math.random() * EMOJI.length) | 0] : '';
    el.style.cssText = `left:${x}px;top:${y}px;background:${emoji ? 'none' : COLORS[i % COLORS.length]};${emoji ? 'font-size:18px;width:auto;height:auto' : ''}`;
    l.append(el);
    const a = Math.random() * Math.PI * 2, v = 90 + Math.random() * 190;
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 120, rot = Math.random() * 720 - 360;
    const anim = el.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx * 1.2}px,${dy + 320}px) rotate(${rot}deg)`, opacity: 0 }],
      { duration: 1000 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)' });
    anim.onfinish = () => el.remove();
  }
}

export function floatText(text, x, y, color = '#2f9e44') {
  if (reduced()) return;
  const el = document.createElement('b');
  el.textContent = text; el.style.cssText = `left:${x}px;top:${y}px;color:${color}`;
  layer().append(el);
  el.animate([{ transform: 'translate(-50%,0) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-30px) scale(1.2)', opacity: 1, offset: 0.3 },
    { transform: 'translate(-50%,-90px) scale(1)', opacity: 0 }], { duration: 1100, easing: 'ease-out' }).onfinish = () => el.remove();
}

export function bounce(el, name = 'jump') {
  if (!el || reduced()) return;
  el.classList.remove(name); void el.offsetWidth; el.classList.add(name);
}

let ctx;
export function sfx(kind) {
  if (!fx.sound) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [523, 659, 784], bad: [220, 165], win: [523, 659, 784, 1047] }[kind] || [];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.09;
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch { /* audio indisponible */ }
}
