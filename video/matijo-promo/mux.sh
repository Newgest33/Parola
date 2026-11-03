#!/usr/bin/env bash
# Assemble the final MP4: silent render + music bed + SFX (+ voice-over when assets/voice.mp3 exists).
set -euo pipefail
cd "$(dirname "$0")"
VOICE=${1:-assets/voice.mp3}
OFFSET=$(python3 -I -c "import json;print(int(json.load(open('timeline.json')).get('voice_offset',0.25)*1000))")
if [ -f "$VOICE" ]; then
  ffmpeg -y -hide_banner -loglevel error -i video-silent.mp4 -i sfx.wav -i pad-norm.wav -i "$VOICE" \
    -filter_complex "[3]aformat=sample_rates=48000:channel_layouts=stereo,adelay=${OFFSET}|${OFFSET},apad=whole_dur=30,atrim=0:30[v];[v]asplit=2[v1][v2];[2]volume=0.9[m];[m][v2]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=600:makeup=1[md];[1]volume=0.4[s];[md][s][v1]amix=inputs=3:normalize=0,alimiter=limit=0.95[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest matijo-promo.mp4
  echo "matijo-promo.mp4 (avec voix)"
else
  ffmpeg -y -hide_banner -loglevel error -i video-silent.mp4 -i sfx.wav -i pad-norm.wav \
    -filter_complex "[2]volume=0.9[m];[1]volume=0.4[s];[m][s]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest matijo-promo-sans-voix.mp4
  echo "matijo-promo-sans-voix.mp4 (voix absente : $VOICE introuvable)"
fi
