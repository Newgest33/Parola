#!/usr/bin/env python3
"""Fallback SFX: synthesize the 8 effects used by build-sfx.py with ffmpeg only. Usage: python3 synth-sfx.py sfx-synth"""
import subprocess, sys, os
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
def mk(name, fc):
    subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-filter_complex",fc,"-map","[o]","-ar","48000","-ac","2","-c:a","libmp3lame","-b:a","160k",os.path.join(out,name+".mp3")],check=True)
# pop: short pitched blip with fast decay
mk("pop", "sine=f=880:d=0.18,aformat=channel_layouts=stereo,afade=t=in:d=0.004,afade=t=out:st=0.03:d=0.15,volume=0.8[o]")
# whoosh-short: band-swept noise
mk("whoosh-short", "anoisesrc=d=0.6:c=pink:a=0.9,aformat=channel_layouts=stereo,bandpass=f=1200:w=800,afade=t=in:d=0.25,afade=t=out:st=0.3:d=0.3,volume=1.2[o]")
# impact-bass-1: low thump
mk("impact-bass-1", "sine=f=55:d=0.7,aformat=channel_layouts=stereo,afade=t=in:d=0.005,afade=t=out:st=0.1:d=0.6,volume=1.6,alimiter=limit=0.95[o]")
# typing: burst of soft clicks
mk("typing", "anoisesrc=d=0.35:c=white:a=0.6,aformat=channel_layouts=stereo,highpass=f=2500,tremolo=f=14:d=1,afade=t=out:st=0.25:d=0.1,volume=0.5[o]")
# click-soft
mk("click-soft", "anoisesrc=d=0.06:c=white:a=0.7,aformat=channel_layouts=stereo,highpass=f=1500,lowpass=f=6000,afade=t=out:st=0.01:d=0.05,volume=0.6[o]")
# notification: two rising tones
mk("notification", "sine=f=1046:d=0.5,aformat=channel_layouts=stereo,afade=t=out:st=0.1:d=0.4[a];sine=f=1568:d=0.5,aformat=channel_layouts=stereo,adelay=120|120,afade=t=out:st=0.1:d=0.4[b];[a][b]amix=inputs=2:normalize=0,volume=0.6[o]")
# chime: bell-like
mk("chime", "sine=f=1318:d=0.9,aformat=channel_layouts=stereo,afade=t=out:st=0.05:d=0.85[a];sine=f=2637:d=0.9,aformat=channel_layouts=stereo,afade=t=out:st=0.02:d=0.5,volume=0.4[b];[a][b]amix=inputs=2:normalize=0,volume=0.6[o]")
# sparkle: quick arpeggio of high tones
parts=[]; 
for i,f in enumerate([1568,1976,2349,2794,3136]):
    parts.append(f"sine=f={f}:d=0.35,aformat=channel_layouts=stereo,adelay={i*55}|{i*55},afade=t=out:st=0.05:d=0.3[p{i}]")
mk("sparkle", ";".join(parts)+";"+"".join(f"[p{i}]" for i in range(5))+"amix=inputs=5:normalize=0,volume=0.5[o]")
print("sfx synth ok")
