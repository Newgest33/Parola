#!/usr/bin/env python3
"""Build sfx.wav (30 s) from the Pixabay-licensed effects bundled with the media-use skill."""
import sys, subprocess, pathlib
S = sys.argv[1] if len(sys.argv) > 1 else str(pathlib.Path(__file__).resolve().parents[2] / '.claude/skills/media-use/audio/assets/sfx')
cues=[("pop",0.3,.5),("pop",1.1,.5),("pop",1.9,.5),("whoosh-short",2.7,.5),("whoosh-short",3.4,.7),("impact-bass-1",4.3,.6),
("whoosh-short",6.0,.6),("typing",6.7,.35),("typing",7.3,.35),("pop",8.5,.45),("click-soft",8.8,.7),
("whoosh-short",9.6,.6),("pop",10.3,.4),("pop",10.7,.4),("pop",11.1,.4),("pop",11.5,.4),("pop",11.9,.4),("notification",12.6,.45),("pop",13.3,.45),("pop",14.0,.45),
("whoosh-short",16.5,.6),("pop",17.0,.4),("pop",17.4,.4),("pop",17.8,.4),("click-soft",19.4,.8),("chime",20.8,.55),("pop",22.2,.3),
("whoosh-short",23.5,.6),("impact-bass-1",23.7,.6),("sparkle",24.6,.5),("pop",25.8,.5)]
args=["ffmpeg","-y","-hide_banner","-loglevel","error"]; fc=[]
for i,(n,t,v) in enumerate(cues):
    args+=["-i",f"{S}/{n}.mp3"]; ms=int(t*1000)
    fc.append(f"[{i}]aformat=sample_rates=48000:channel_layouts=stereo,volume={v},adelay={ms}|{ms}[c{i}]")
fc.append("".join(f"[c{i}]" for i in range(len(cues)))+f"amix=inputs={len(cues)}:normalize=0:dropout_transition=0,apad=whole_dur=30,atrim=0:30[out]")
subprocess.run(args+["-filter_complex",";".join(fc),"-map","[out]","-ar","48000","sfx.wav"],check=True); print("sfx.wav ok")
