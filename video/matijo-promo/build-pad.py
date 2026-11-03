#!/usr/bin/env python3
"""Synthesize pad-norm.wav: a soft ambient bed (D / A / Bm / G), 30 s, via ffmpeg only."""
import subprocess
notes={'D3':146.83,'F#3':185.0,'A3':220.0,'E3':164.81,'C#4':277.18,'B2':123.47,'F#4':369.99,'G3':196.0,'B3':246.94,'D4':293.66,'A2':110.0}
chords=[('D3','F#3','A3'),('A2','E3','C#4'),('B2','D4','F#4'),('G3','B3','D4')]; bar=7.5
layers=[]; n=0
for i,ch in enumerate(chords):
    t0=i*bar
    for f in ch:
        for det in (0.997,1.0,1.004):
            layers.append(f"sine=frequency={notes[f]*det:.2f}:duration={bar+1.5},aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:st=0:d=1.6,afade=t=out:st={bar+0.2}:d=1.3,adelay={int(t0*1000)}|{int(t0*1000)},volume=0.055[l{n}]"); n+=1
fc=";".join(layers)+";"+"".join(f"[l{i}]" for i in range(n))+f"amix=inputs={n}:normalize=0,lowpass=f=900,tremolo=f=0.18:d=0.25,aecho=0.6:0.4:420:0.25,apad=whole_dur=30,atrim=0:30,afade=t=in:st=0:d=2,afade=t=out:st=27:d=3,volume=24dB[out]"
subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-filter_complex",fc,"-map","[out]","-ar","48000","pad-norm.wav"],check=True); print("pad-norm.wav ok")
