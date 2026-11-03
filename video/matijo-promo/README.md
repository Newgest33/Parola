# Promo Matijo.com — 30 s, 1080p

Composition HTML rendue image par image (Playwright + ffmpeg), dans l'esprit HyperFrames.

## Fichiers
- `index.html` — la composition (5 scènes, sous-titres). Prévisualiser : servir le dossier en http et ouvrir `index.html?t=12.5`.
- `timeline.json` — tous les minutages (scènes, sous-titres, frappe, décalage de la voix). À ajuster sur la narration.
- `render.cjs` — `node render.cjs 0 video-silent.mp4` rend la vidéo ; `node render.cjs 0 x 3.5,12` sort des images fixes.
- `build-sfx.py` — effets sonores (depuis `.claude/skills/media-use/audio/assets/sfx`, licence Pixabay ; à défaut, les effets synthétisés de `synth-sfx.py`, dossier `sfx-synth/`).
- `synth-sfx.py` — repli : synthétise les 8 effets avec ffmpeg seul (`python3 synth-sfx.py sfx-synth`).
- `build-pad.py` — nappe musicale synthétisée.
- `mux.sh [voix.mp3]` — assemblage final : vidéo + nappe (duckée sous la voix) + effets + voix.
- `assets/` — logo officiel (SVG), police Bricolage Grotesque (Google Fonts, OFL).

## Voix off (ElevenLabs, voix « Nico », français, 28 s)
Deux prises générées dans le flow https://elevenlabs.io/app/flows/oVc7cJhJkaBvOpl461Mq
(nœud TTS `oamdAD8DEitXgr5F1VNq`). **Le montage est calé sur la prise 1, generation `pMMa4thWlxoSFnYZXenh`**
(transcription horodatée Scribe : « rattraper ? » finit à 3,84 s, « Matijo. » à 6,28 s, « gratuit. » à 9,44 s,
« scolaire. » à 16,48 s, « travail. » à 22,88 s, « com. » à 28,0 s ; temps vidéo = temps audio + `voice_offset`).

Téléchargement : l'URL signée de la prise s'obtient via l'outil ElevenLabs `creative_get_generations`
(flow + generation ci-dessus) et pointe sur `elevenlabsusercontent.com`. **Ce domaine doit figurer dans les
domaines autorisés de l'environnement Claude Code** (Network access → Allowed domains), sinon le proxy
refuse la connexion (403). Enregistrer le fichier dans `assets/voice.mp3`, puis :

```
python3 synth-sfx.py sfx-synth   # seulement si les effets Pixabay du skill media-use sont absents
python3 build-sfx.py && python3 build-pad.py
node render.cjs 0 video-silent.mp4
bash mux.sh
```

Si une autre prise est retenue : `ffmpeg -i assets/voice.mp3 -af silencedetect=noise=-35dB:d=0.35 -f null -`
donne les pauses entre phrases ; reporter les débuts de scène dans `timeline.json` et relancer le rendu.
