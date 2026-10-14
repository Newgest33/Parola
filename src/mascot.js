// Léo, le vrai : trois photos détourées (img/leo-*.webp), animées en CSS (voir style.css, section mascotte).
// États : idle (de face, respire et penche la tête), happy (regard levé, saute), sad (de profil, boude), dance (se dandine).
const POSES = ['idle', 'happy', 'sad'];
const SRC = (pose) => `img/leo-${pose}.webp`;

// Préchargement : les changements d'état doivent être instantanés.
for (const p of POSES) { const i = new Image(); i.src = SRC(p); }

/** Crée une instance de Léo. size = hauteur en px, state parmi idle | happy | sad | dance. */
export function mascot(size = 56, state = 'idle') {
  const el = document.createElement('span');
  el.className = 'leo ' + state;
  el.style.height = size + 'px';
  el.setAttribute('aria-hidden', 'true');
  for (const pose of POSES) {
    const img = document.createElement('img');
    img.src = SRC(pose); img.alt = ''; img.className = 'leo-' + pose; img.draggable = false; img.decoding = 'async';
    el.append(img);
  }
  return el;
}

/** Joue un état ponctuel (happy / sad / dance) puis revient à idle. */
export function react(el, state, ms = 900) {
  if (!el) return;
  el.classList.remove('idle', 'happy', 'sad', 'dance'); void el.getBoundingClientRect();
  el.classList.add(state);
  if (ms) setTimeout(() => { el.classList.remove(state); el.classList.add('idle'); }, ms);
}
