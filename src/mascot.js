// Léo, spitz allemand blanc : SVG vectoriel animé par CSS (voir style.css, section mascotte).
// États : idle (vivant : respire, cligne, remue la queue), happy (saute, langue), sad (oreilles basses), dance.
const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="spitz" aria-hidden="true" focusable="false">
  <ellipse class="sp-shadow" cx="60" cy="110" rx="30" ry="5" fill="#000" opacity=".08"/>
  <g class="sp-all">
    <g class="sp-tail">
      <path d="M80 72 C 104 64, 106 36, 86 40 C 76 42, 78 56, 88 54" fill="#fff" stroke="#d6cfc4" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="90" cy="42" r="6" fill="#fff"/><circle cx="98" cy="50" r="6" fill="#fff"/><circle cx="84" cy="52" r="6" fill="#fff"/>
    </g>
    <g class="sp-body">
      <ellipse cx="60" cy="84" rx="33" ry="25" fill="#fff" stroke="#d6cfc4" stroke-width="2.5"/>
      <g fill="#fff"><circle cx="30" cy="80" r="7"/><circle cx="34" cy="94" r="7"/><circle cx="90" cy="80" r="7"/><circle cx="86" cy="94" r="7"/><circle cx="45" cy="104" r="6"/><circle cx="75" cy="104" r="6"/></g>
      <ellipse cx="44" cy="106" rx="10" ry="5" fill="#fff" stroke="#d6cfc4" stroke-width="2"/>
      <ellipse cx="76" cy="106" rx="10" ry="5" fill="#fff" stroke="#d6cfc4" stroke-width="2"/>
      <g stroke="#d6cfc4" stroke-width="1.5" stroke-linecap="round"><path d="M40 108v2M44 108v2M48 108v2M72 108v2M76 108v2M80 108v2"/></g>
    </g>
    <g class="sp-head">
      <g class="sp-ear sp-ear-l"><path d="M34 44 L 28 14 L 52 32 Z" fill="#fff" stroke="#d6cfc4" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 38 L 33 22 L 46 32 Z" fill="#f6b6c4"/></g>
      <g class="sp-ear sp-ear-r"><path d="M86 44 L 92 14 L 68 32 Z" fill="#fff" stroke="#d6cfc4" stroke-width="2.5" stroke-linejoin="round"/><path d="M84 38 L 87 22 L 74 32 Z" fill="#f6b6c4"/></g>
      <ellipse cx="60" cy="62" rx="31" ry="22" fill="#fff"/>
      <g fill="#fff"><circle cx="31" cy="58" r="8"/><circle cx="36" cy="70" r="8"/><circle cx="89" cy="58" r="8"/><circle cx="84" cy="70" r="8"/><circle cx="50" cy="80" r="7"/><circle cx="70" cy="80" r="7"/></g>
      <circle cx="60" cy="48" r="25" fill="#fff" stroke="#d6cfc4" stroke-width="2.5"/>
      <g fill="#fff"><circle cx="38" cy="40" r="6"/><circle cx="82" cy="40" r="6"/><circle cx="60" cy="24" r="6"/><circle cx="48" cy="27" r="6"/><circle cx="72" cy="27" r="6"/></g>
      <circle class="sp-blush" cx="42" cy="56" r="5" fill="#f6b6c4" opacity=".55"/><circle class="sp-blush" cx="78" cy="56" r="5" fill="#f6b6c4" opacity=".55"/>
      <g class="sp-eye" transform="translate(49 46)"><circle r="4.2" fill="#2b2118"/><circle cx="1.4" cy="-1.4" r="1.3" fill="#fff"/><rect class="sp-lid" x="-5" y="-5" width="10" height="10" fill="#fff"/></g>
      <g class="sp-eye" transform="translate(71 46)"><circle r="4.2" fill="#2b2118"/><circle cx="1.4" cy="-1.4" r="1.3" fill="#fff"/><rect class="sp-lid" x="-5" y="-5" width="10" height="10" fill="#fff"/></g>
      <g class="sp-brows" stroke="#b9b0a4" stroke-width="2" stroke-linecap="round" fill="none"><path class="sp-brow-l" d="M43 37 q 6 -3 11 0"/><path class="sp-brow-r" d="M66 37 q 5 -3 11 0"/></g>
      <path class="sp-nose" d="M55 56 h10 l-5 5 z" fill="#2b2118" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
      <path class="sp-mouth" d="M60 61 q -3 5 -8 3 M60 61 q 3 5 8 3" fill="none" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
      <ellipse class="sp-tongue" cx="60" cy="68" rx="4.5" ry="5" fill="#f06595"/>
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
