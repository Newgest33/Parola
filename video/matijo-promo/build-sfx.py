#!/usr/bin/env python3
"""Build sfx.wav (30 s) from the Pixabay-licensed effects bundled with the media-use skill."""
import sys, subprocess, pathlib
S = sys.argv[1] if len(sys.argv) > 1 else str(pathlib.Path(__file__).resolve().parents[2] / '.claude/skills/media-use/audio/assets/sfx')
if not pathlib.Path(S).is_dir():  # fallback: synthesized effects (python3 synth-sfx.py sfx-synth)
    S = str(pathlib.Path(__file__).resolve().parent / 'sfx-synth')
cues=[("pop",0.4,.5),("pop",1.9,.5),("pop",3.2,.5),("whoosh-short",4.0,.5),("whoosh-short",4.45,.7),("impact-bass-1",5.6,.6),
("whoosh-short",6.6,.6),("typing",7.1,.35),("typing",7.7,.35),("pop",8.8,.45),("click-soft",9.4,.7),
("whoosh-short",9.75,.6),("pop",10.25,.45),("pop",10.95,.45),("pop",11.65,.45),("notification",12.5,.45),("pop",13.15,.4),("pop",14.15,.4),("pop",15.0,.4),("pop",15.65,.4),("pop",16.2,.4),
("whoosh-short",16.9,.6),("pop",17.4,.4),("pop",17.8,.4),("pop",18.2,.4),("click-soft",20.3,.8),("chime",22.3,.55),("pop",22.7,.3),
("whoosh-short",23.2,.6),("impact-bass-1",23.4,.6),("sparkle",24.05,.5),("pop",26.4,.5)]
args=["ffmpeg","-y","-hide_banner","-loglevel","error"]; fc=[]
for i,(n,t,v) in enumerate(cues):
    args+=["-i",f"{S}/{n}.mp3"]; ms=int(t*1000)
    fc.append(f"[{i}]aformat=sample_rates=48000:channel_layouts=stereo,volume={v},adelay={ms}|{ms}[c{i}]")
fc.append("".join(f"[c{i}]" for i in range(len(cues)))+f"amix=inputs={len(cues)}:normalize=0:dropout_transition=0,apad=whole_dur=30,atrim=0:30[out]")
subprocess.run(args+["-filter_complex",";".join(fc),"-map","[out]","-ar","48000","sfx.wav"],check=True); print("sfx.wav ok")
