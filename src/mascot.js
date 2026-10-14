// Léo, spitz allemand blanc : SVG vectoriel animé par CSS (voir style.css, section mascotte).
// États : idle (vivant : respire, cligne, remue la queue), happy (saute, langue), sad (oreilles basses), dance.
const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="spitz" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="fur" cx="45%" cy="38%" r="65%"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#fbf8f2"/><stop offset="1" stop-color="#e9e2d6"/></radialGradient>
    <radialGradient id="furD" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#f7f3ec"/><stop offset="1" stop-color="#ddd5c8"/></radialGradient>
  </defs>
  <ellipse class="sp-shadow" cx="60" cy="112" rx="30" ry="4.5" fill="#000" opacity=".08"/>
  <g class="sp-all">
    <g class="sp-tail">
      <path d="M76 70 C 98 66, 110 40, 92 30 C 78 24, 70 40, 82 46" fill="none" stroke="url(#furD)" stroke-width="13" stroke-linecap="round"/>
      <path d="M76 70 C 98 66, 110 40, 92 30 C 78 24, 70 40, 82 46" fill="none" stroke="url(#fur)" stroke-width="9" stroke-linecap="round"/>
      <g fill="url(#fur)"><circle cx="100" cy="52" r="7"/><circle cx="102" cy="40" r="7"/><circle cx="94" cy="31" r="7"/><circle cx="84" cy="33" r="6"/><circle cx="96" cy="62" r="6"/></g>
    </g>
    <g class="sp-body">
      <ellipse cx="60" cy="88" rx="28" ry="20" fill="url(#fur)"/>
      <g fill="url(#fur)"><circle cx="35" cy="86" r="8"/><circle cx="38" cy="98" r="7"/><circle cx="85" cy="86" r="8"/><circle cx="82" cy="98" r="7"/></g>
      <ellipse cx="47" cy="108" rx="9" ry="4.5" fill="url(#fur)"/><ellipse cx="73" cy="108" rx="9" ry="4.5" fill="url(#fur)"/>
      <g stroke="#cfc6b8" stroke-width="1.4" stroke-linecap="round"><path d="M44 109.5v2M47.5 109.5v2M51 109.5v2M69 109.5v2M72.5 109.5v2M76 109.5v2"/></g>
    </g>
    <g class="sp-head">
      <g class="sp-ear sp-ear-l"><path d="M41 33 L 38 11 L 57 27 Z" fill="url(#fur)" stroke="#e4ddd0" stroke-width="1.5" stroke-linejoin="round"/><path d="M43 30 L 41.5 17 L 52 27 Z" fill="#f3b5c2"/></g>
      <g class="sp-ear sp-ear-r"><path d="M79 33 L 82 11 L 63 27 Z" fill="url(#fur)" stroke="#e4ddd0" stroke-width="1.5" stroke-linejoin="round"/><path d="M77 30 L 78.5 17 L 68 27 Z" fill="#f3b5c2"/></g>
      <g class="sp-ruff" fill="url(#fur)">
        <circle cx="28" cy="62" r="11"/><circle cx="92" cy="62" r="11"/><circle cx="31" cy="76" r="10"/><circle cx="89" cy="76" r="10"/>
        <circle cx="40" cy="84" r="10"/><circle cx="80" cy="84" r="10"/><circle cx="52" cy="88" r="9"/><circle cx="68" cy="88" r="9"/><circle cx="60" cy="89" r="9"/>
        <circle cx="33" cy="50" r="9"/><circle cx="87" cy="50" r="9"/>
      </g>
      <ellipse cx="60" cy="68" rx="32" ry="19" fill="url(#fur)"/>
      <ellipse cx="60" cy="70" rx="18" ry="10" fill="#efe9de" opacity=".6"/>
      <ellipse cx="60" cy="46" rx="24" ry="21" fill="url(#fur)"/>
      <g fill="url(#fur)"><circle cx="37" cy="44" r="9"/><circle cx="83" cy="44" r="9"/><circle cx="36" cy="55" r="8"/><circle cx="84" cy="55" r="8"/><circle cx="60" cy="27" r="7"/><circle cx="50" cy="29" r="6"/><circle cx="70" cy="29" r="6"/></g>
      <ellipse cx="60" cy="57" rx="12" ry="8.5" fill="#fff"/>
      <circle class="sp-blush" cx="43" cy="56" r="4.5" fill="#f3b5c2" opacity=".6"/><circle class="sp-blush" cx="77" cy="56" r="4.5" fill="#f3b5c2" opacity=".6"/>
      <g class="sp-eye" transform="translate(50 45)"><circle r="4" fill="#2a2019"/><circle cx="1.4" cy="-1.4" r="1.4" fill="#fff"/><circle cx="-1.2" cy="1.4" r=".6" fill="#fff" opacity=".7"/><rect class="sp-lid" x="-5" y="-5" width="10" height="10" fill="url(#fur)"/></g>
      <g class="sp-eye" transform="translate(70 45)"><circle r="4" fill="#2a2019"/><circle cx="1.4" cy="-1.4" r="1.4" fill="#fff"/><circle cx="-1.2" cy="1.4" r=".6" fill="#fff" opacity=".7"/><rect class="sp-lid" x="-5" y="-5" width="10" height="10" fill="url(#fur)"/></g>
      <g class="sp-brows" stroke="#b9b0a4" stroke-width="2" stroke-linecap="round" fill="none"><path class="sp-brow-l" d="M45 37 q 5 -3 10 0"/><path class="sp-brow-r" d="M65 37 q 5 -3 10 0"/></g>
      <path class="sp-nose" d="M56 53.5 h8 q1 0 .5 1 l-3.5 4 q-1 1 -2 0 l-3.5 -4 q-.5 -1 .5 -1 z" fill="#2a2019"/><circle cx="58" cy="54.5" r=".9" fill="#fff" opacity=".6"/>
      <path class="sp-mouth" d="M60 58.5 q -3 4.5 -7.5 2.5 M60 58.5 q 3 4.5 7.5 2.5" fill="none" stroke="#2a2019" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse class="sp-tongue" cx="60" cy="64" rx="4" ry="4.5" fill="#f06595"/>
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
