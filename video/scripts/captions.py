import json, re, unicodedata
from difflib import SequenceMatcher
from pathlib import Path

root=Path(__file__).resolve().parent.parent
scenes=json.loads((root/'scenes.json').read_text())
timings=json.loads((root/'timings.json').read_text())['scenes']
raw=json.loads((root/'transcript.json').read_text())
def norm(s):
    return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFD',s.lower()))
aligned=[]
for scene,timing in zip(scenes,timings):
    expected=scene['narration'].replace('Cuout Asístent','Quote Assistant').split()
    heard=[w for w in raw if w['start']<timing['voiceEnd'] and w['end']>timing['voiceStart']-0.12]
    assert heard,scene['id']
    matcher=SequenceMatcher(None,[norm(w) for w in expected],[norm(w['text']) for w in heard],autojunk=False)
    for kind,a,b,c,d in matcher.get_opcodes():
        if kind=='delete':
            start=heard[c-1]['end'] if c else timing['voiceStart']
            end=heard[c]['start'] if c<len(heard) else timing['voiceEnd']
        elif kind=='insert':
            continue
        else:
            start=heard[c]['start'];end=heard[d-1]['end']
        if kind=='equal':
            for ei,hi in zip(range(a,b),range(c,d)):
                aligned.append({'text':expected[ei],'start':heard[hi]['start'],'end':heard[hi]['end'],'scene':scene['id']})
        else:
            width=max(0.03,end-start)/max(1,b-a)
            for k,ei in enumerate(range(a,b)):
                aligned.append({'text':expected[ei],'start':round(start+k*width,3),'end':round(start+(k+1)*width,3),'scene':scene['id']})

cues=[];group=[]
def flush():
    if not group:return
    cues.append({'text':' '.join(w['text'] for w in group),'start':group[0]['start'],'end':group[-1]['end']+0.12})
    group.clear()
for w in aligned:
    if group and (w['scene']!=group[-1]['scene'] or w['start']-group[-1]['end']>0.35 or len(group)>=8 or len(' '.join(g['text'] for g in group))+len(w['text'])>86):flush()
    group.append(w)
    if w['text'].endswith(('.',':',';','?','!')) and len(group)>=3:flush()
flush()
for i,c in enumerate(cues[:-1]):c['end']=min(c['end'],cues[i+1]['start'])
cues=[c for c in cues if c['end']>c['start']]
(root/'captions.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2))
(root/'transcript-corrected.json').write_text(json.dumps(aligned,ensure_ascii=False,indent=2))
def stamp(n):
    ms=round(n*1000);s,ms=divmod(ms,1000);m,s=divmod(s,60);h,m=divmod(m,60)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
(root/'quote-assistant-subtitulos.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(cues))+'\n')
print('Cues:',len(cues),'max characters:',max(len(c['text']) for c in cues))
