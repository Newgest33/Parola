// Léo, spitz allemand blanc : SVG vectoriel animé par CSS (voir style.css, section mascotte).
// États : idle (vivant : respire, cligne, remue la queue), happy (saute, langue), sad (oreilles basses), dance.
const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="spitz" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="fur" cx="40%" cy="32%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".65" stop-color="#fdfaf5"/><stop offset="1" stop-color="#e6dccb"/></radialGradient>
    <radialGradient id="furC" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#fdf8ef"/><stop offset="1" stop-color="#dfd2bb"/></radialGradient>
    <radialGradient id="furD" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#efe6d7"/><stop offset="1" stop-color="#d2c4ab"/></radialGradient>
    <filter id="fuzz" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="fuzzL" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="fuzzH" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs>
  <ellipse class="sp-shadow" cx="60" cy="113" rx="34" ry="4" fill="#000" opacity=".09"/>
  <g class="sp-all">
    <g class="sp-tail" filter="url(#fuzzH)">
      <path d="M78 62 C 84 70, 104 62, 102 44 C 100 28, 84 22, 74 32 C 68 38, 72 46, 80 44 C 86 42, 88 36, 84 34" fill="url(#furC)"/>
      <ellipse cx="90" cy="42" rx="12" ry="11" fill="url(#fur)"/>
    </g>
    <g class="sp-legs">
      <path d="M43 90 q -4 12 -2 22 h 10 q 1 -11 -1 -22 z" fill="url(#furD)" filter="url(#fuzzL)"/><ellipse cx="46" cy="112" rx="7.5" ry="3.3" fill="url(#fur)"/>
      <path d="M87 88 q 4 12 1 22 h -10 q -1 -11 1 -22 z" fill="url(#furD)" filter="url(#fuzzL)"/><ellipse cx="82" cy="110" rx="7" ry="3" fill="url(#furD)"/>
      <path d="M54 94 q -3 10 -1 19 h 10 q 1 -9 -1 -19 z" fill="url(#fur)" filter="url(#fuzzL)"/><ellipse cx="58" cy="113" rx="7.5" ry="3.3" fill="url(#fur)"/>
      <path d="M68 94 q -3 10 -1 19 h 10 q 1 -9 -1 -19 z" fill="url(#fur)" filter="url(#fuzzL)"/><ellipse cx="72" cy="113" rx="7.5" ry="3.3" fill="url(#fur)"/>
      <g stroke="#cbbda6" stroke-width="1.3" stroke-linecap="round"><path d="M43 114v1.5M46 114v1.5M49 114v1.5M55 115v1.5M58 115v1.5M61 115v1.5M69 115v1.5M72 115v1.5M75 115v1.5M79 112v1.5M82 112v1.5M85 112v1.5"/></g>
    </g>
    <g class="sp-body">
      <ellipse cx="64" cy="80" rx="33" ry="24" fill="url(#fur)" filter="url(#fuzz)"/>
      <ellipse cx="62" cy="93" rx="20" ry="8" fill="#ece2d0" opacity=".45"/>
    </g>
    <g class="sp-head">
      <g class="sp-ear sp-ear-l" filter="url(#fuzzL)"><path d="M36 34 C 28 26, 26 14, 29 9 C 40 14, 50 22, 54 30 Z" fill="url(#furC)"/><path d="M38 30 C 33 24, 32 17, 33 14 C 40 18, 46 24, 49 29 Z" fill="#e6c3b0"/></g>
      <g class="sp-ear sp-ear-r" filter="url(#fuzzL)"><path d="M82 34 C 90 26, 92 14, 89 9 C 78 14, 68 22, 64 30 Z" fill="url(#furC)"/><path d="M80 30 C 85 24, 86 17, 85 14 C 78 18, 72 24, 69 29 Z" fill="#e6c3b0"/></g>
      <ellipse cx="59" cy="64" rx="38" ry="25" fill="url(#furC)" filter="url(#fuzzH)"/>
      <ellipse cx="59" cy="48" rx="27" ry="24" fill="url(#fur)" filter="url(#fuzz)"/>
      <ellipse cx="59" cy="57" rx="11" ry="7.5" fill="#fff"/>
      <ellipse cx="59" cy="60" rx="7" ry="3.5" fill="#efe5d6" opacity=".5"/>
      <circle class="sp-blush" cx="42" cy="57" r="4.5" fill="#f0c3c3" opacity=".4"/><circle class="sp-blush" cx="76" cy="57" r="4.5" fill="#f0c3c3" opacity=".4"/>
      <g class="sp-eye" transform="translate(47 46)"><circle r="4.8" fill="#1e1712"/><circle cx="1.7" cy="-1.6" r="1.6" fill="#fff"/><circle cx="-1.5" cy="1.8" r=".8" fill="#fff" opacity=".6"/><rect class="sp-lid" x="-6" y="-6" width="12" height="12" fill="url(#fur)"/></g>
      <g class="sp-eye" transform="translate(71 46)"><circle r="4.8" fill="#1e1712"/><circle cx="1.7" cy="-1.6" r="1.6" fill="#fff"/><circle cx="-1.5" cy="1.8" r=".8" fill="#fff" opacity=".6"/><rect class="sp-lid" x="-6" y="-6" width="12" height="12" fill="url(#fur)"/></g>
      <g class="sp-brows" stroke="#b9ab98" stroke-width="2" stroke-linecap="round" fill="none"><path class="sp-brow-l" d="M42 38 q 5 -3 10 0"/><path class="sp-brow-r" d="M66 38 q 5 -3 10 0"/></g>
      <path class="sp-nose" d="M55 53 h8 q1.2 0 .8 1.1 l-3.8 4 q-1 1 -2 0 l-3.8 -4 q-.4 -1.1 .8 -1.1 z" fill="#1e1712"/><circle cx="57.3" cy="54.2" r=".9" fill="#fff" opacity=".55"/>
      <path class="sp-mouth" d="M59 58.2 q -2.5 4 -6.5 2.5 M59 58.2 q 2.5 4 6.5 2.5" fill="none" stroke="#1e1712" stroke-width="1.6" stroke-linecap="round"/>
      <ellipse class="sp-tongue" cx="59" cy="63" rx="3.8" ry="4.2" fill="#f06595"/>
    </g>
  </g>
</svg>`;

const parser = new DOMParser();
/** Crée une instance de Léo. size en px, state parmi idle | happy | sad | dance. */
export function mascot(size = 56, state = 'idle') {
  const el = parser.parseFromString(SVG, 'image/svg+xml').documentElement;
  el.setAttribute('width', size); el.setAttribute('height', size);
  el.classList.add(state);
  return el;
}

/** Joue un état ponctuel (happy / sad / dance) puis revient à idle. */
export function react(el, state, ms = 900) {
  if (!el) return;
  el.classList.remove('idle', 'happy', 'sad', 'dance'); void el.getBoundingClientRect();
  el.classList.add(state);
  if (ms) setTimeout(() => { el.classList.remove(state); el.classList.add('idle'); }, ms);
}
