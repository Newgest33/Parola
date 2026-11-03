# Promo Matijo.com — 30 s, 1080p

Composition HTML rendue image par image (Playwright + ffmpeg), dans l'esprit HyperFrames.

## Fichiers
- `index.html` — la composition (5 scènes, sous-titres). Prévisualiser : servir le dossier en http et ouvrir `index.html?t=12.5`.
- `timeline.json` — tous les minutages (scènes, sous-titres, frappe, décalage de la voix). À ajuster sur la narration.
- `render.js` — `node render.js 0 video-silent.mp4` rend la vidéo ; `node render.js 0 x 3.5,12` sort des images fixes.
- `build-sfx.py` — effets sonores (depuis `.claude/skills/media-use/audio/assets/sfx`, licence Pixabay).
- `build-pad.py` — nappe musicale synthétisée.
- `mux.sh [voix.mp3]` — assemblage final : vidéo + nappe (duckée sous la voix) + effets + voix.
- `assets/` — logo officiel (SVG), police Bricolage Grotesque (Google Fonts, OFL).

## Voix off (ElevenLabs, voix « Nico », français, 28 s)
Deux prises générées dans le flow https://elevenlabs.io/app/flows/oVc7cJhJkaBvOpl461Mq
Télécharger la prise choisie dans `assets/voice.mp3`, puis :

```
python3 build-sfx.py && python3 build-pad.py
node render.js 0 video-silent.mp4
bash mux.sh
```

Recalage sur la narration : `ffmpeg -i assets/voice.mp3 -af silencedetect=noise=-35dB:d=0.35 -f null -`
donne les pauses entre phrases ; reporter les débuts de scène dans `timeline.json` et relancer le rendu.
