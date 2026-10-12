import json, html, struct
from pathlib import Path

root=Path(__file__).resolve().parent.parent
scenes=json.loads((root/'scenes.json').read_text())
timing=json.loads((root/'timings.json').read_text())
captions=json.loads((root/'captions.json').read_text())
words=json.loads((root/'transcript-corrected.json').read_text())
duration=timing['duration']
esc=html.escape
parts=[]
for i,(scene,time) in enumerate(zip(scenes,timing['scenes'])):
    start=max(0,time['start']-0.45)
    image_parts=[]
    for k,image in enumerate(scene['images']):
        if image=='offline-ready.png':
            content='<div id="ready-icon" class="ready-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></svg></div><h2 id="ready-title">Disponible sin conexión</h2><p id="ready-hint">Espera este estado después de la primera carga con internet.</p><p class="ready-note">Los cambios se guardan en este navegador.</p>'
            image_parts.append(f'<div id="shot-{i}-{k}" class="shot-layer ready-state" style="opacity:0">{content}</div>')
        else:
            image_parts.append(f'<div id="shot-{i}-{k}" class="shot-layer {"zoom-detail" if image in ["new-quote.png","detail.png","edited.png","history.png","message.png","rebalance.png"] else ""}" style="opacity:{1 if k==0 else 0}"><img src="assets/screens/{esc(image)}" alt="{esc(scene["label"])}" /></div>')
    images=''.join(image_parts)
    parts.append(f'''<section id="scene-{i}" class="scene clip {esc(scene['layout'])}" data-start="{start:.5f}" data-duration="{time['start']+time['duration']-start:.5f}" data-track-index="{i%2+1}" style="z-index:{i+1}">
 <div class="scene-content"><div class="story-grid">
  <div class="copy"><p id="eyebrow-{i}" class="eyebrow">{esc(scene['label'])}</p><h1 id="title-{i}">{esc(scene['title'])}</h1><p id="copy-{i}" class="description">{esc(scene['copy'])}</p><div id="note-{i}" class="note">{'Demo interactiva' if i in [0,10] else 'Control '+str(i).zfill(2)+' · Sigue el recorrido'}</div></div>
  <div id="window-{i}" class="app-window"><div class="window-header"><span class="window-dot"></span><span>Quote Assistant</span><span class="window-context">Demostración funcional</span></div><div class="shots" data-layout-allow-overflow>{images}</div></div>
 </div><div id="action-{i}" class="action"><span class="action-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></span><span>{esc(scene['action'])}</span><span id="step-{i}" class="step">{i+1:02d} / {len(scenes):02d}</span></div></div>
 </section>''')
caption_html=''.join(f'<div id="caption-{i}" class="caption clip" data-start="{c["start"]:.3f}" data-duration="{c["end"]-c["start"]:.3f}" data-track-index="4"><span>{esc(c["text"])}</span></div>' for i,c in enumerate(captions))
css='''
@font-face{font-family:"DM Sans";font-style:normal;font-weight:400;src:url("assets/dm-sans-latin-400-normal-CW0RaeGs.woff2") format("woff2")}
@font-face{font-family:"DM Sans";font-style:normal;font-weight:600;src:url("assets/dm-sans-latin-600-normal-Aqo67rzb.woff2") format("woff2")}
@font-face{font-family:"DM Sans";font-style:normal;font-weight:700;src:url("assets/dm-sans-latin-700-normal-DvUfVpUG.woff2") format("woff2")}
*{box-sizing:border-box;margin:0}html,body{width:1920px;height:1080px;overflow:hidden;background:#f7f8fa;font-family:"DM Sans",sans-serif;color:#202534}#root{width:1920px;height:1080px;position:relative;overflow:hidden;font-variant-numeric:tabular-nums}.clip{position:absolute;width:100%;height:100%}.scene{inset:0;background:#f7f8fa}.scene-content{display:flex;flex-direction:column;gap:28px;width:100%;height:100%;padding:160px 88px 196px}.story-grid{display:grid;grid-template-columns:440px minmax(0,1fr);gap:60px;flex:1;min-height:0;align-items:center}.copy{display:flex;flex-direction:column;gap:25px;min-width:0}.eyebrow{color:#3044d7;font-size:24px;font-weight:700;letter-spacing:.055em;line-height:1.4}h1{font-size:68px;font-weight:700;letter-spacing:-.05em;line-height:1.07;max-width:440px}.description{font-size:31px;line-height:1.45;color:#626a7a;max-width:422px}.note{font-size:23px;color:#3044d7;border-left:4px solid #3044d7;padding-left:17px;line-height:1.5;margin-top:12px}.hero h1{font-size:80px}.app-window{border:1px solid #e8ebf0;border-radius:18px;height:100%;width:100%;overflow:hidden;background:#ffffff;display:flex;flex-direction:column;min-height:0}.window-header{height:50px;flex-shrink:0;display:flex;align-items:center;gap:13px;padding:0 22px;border-bottom:1px solid #e8ebf0;font-size:19px;font-weight:600;color:#626a7a;background:#ffffff}.window-dot{width:10px;height:10px;background:#3044d7;border-radius:100%}.window-context{margin-left:auto;font-size:17px;font-weight:400}.shots{position:relative;flex:1;min-height:0;background:#ffffff;overflow:hidden}.shot-layer{position:absolute;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center}.shot-layer img{display:block;max-width:100%;max-height:100%;object-fit:contain;width:100%;height:100%;transform-origin:center center}.hero .shot-layer img{object-fit:cover;object-position:left top}.split .app-window{background:#ffffff}.action{display:flex;gap:19px;align-items:center;min-height:63px;border-top:1px solid #e8ebf0;padding-top:25px;font-size:27px;font-weight:600;color:#3044d7;line-height:1.35}.action-arrow{font-size:39px}.step{margin-left:auto;font-size:23px;font-weight:400;color:#626a7a;white-space:nowrap}.topbar{position:absolute;left:0;right:0;top:0;height:116px;z-index:25;display:flex;align-items:center;justify-content:space-between;padding:0 88px;border-bottom:1px solid #e8ebf0;background:#f7f8fa}.wordmark{display:flex;align-items:center;gap:18px;font-size:33px;font-weight:700;letter-spacing:-.035em}.wordmark svg{width:40px;height:40px;color:#3044d7}.video-label{font-size:23px;color:#626a7a;letter-spacing:.035em}.caption-band{position:absolute;left:0;right:0;bottom:0;height:158px;border-top:1px solid #e8ebf0;background:#ffffff;z-index:25}.caption{position:absolute;left:0;bottom:76px;width:100%;height:63px;display:flex;align-items:center;justify-content:center;padding:0 125px;text-align:center;z-index:30;font-size:34px;font-weight:600;color:#202534;line-height:1.35}.caption span{max-width:1650px}.footer{position:absolute;left:88px;right:88px;bottom:30px;display:flex;justify-content:space-between;font-size:20px;color:#626a7a;z-index:30}.progress-track{position:absolute;left:0;bottom:0;width:100%;height:5px;background:#e8ebf0;z-index:35}.progress{width:100%;height:100%;background:#3044d7;transform-origin:left center}
'''
css+='\n.hero h1{font-size:72px}.zoom-detail{align-items:flex-start}.zoom-detail img{width:100%;height:auto;max-height:none;object-fit:contain;flex-shrink:0}\n'
css+='\n.split .shot-layer img{object-fit:cover;object-position:top left}.action-arrow{display:flex;width:32px;flex-shrink:0}.action-arrow svg{width:32px;height:32px}.ready-state{background:#eef1ff;flex-direction:column;gap:25px;padding:64px;text-align:center}.ready-icon{color:#237850;width:82px;height:82px}.ready-icon svg{width:100%;height:100%}.ready-state h2{font-size:48px;line-height:1.2;color:#237850}.ready-state p{max-width:760px;font-size:30px;line-height:1.5;color:#626a7a}.ready-state .ready-note{font-size:23px;margin-top:10px}\n'
logo=(root/'assets/quote-assistant-mark.svg').read_text()
animations=[]
animations.append('const tl=gsap.timeline({paused:true});')
animations.append('tl.from(".wordmark",{y:-15,opacity:0,duration:.55,ease:"power3.out"},.1);tl.from(".video-label",{x:25,opacity:0,duration:.45,ease:"power2.out"},.22);tl.from(".footer",{y:10,opacity:0,duration:.45,ease:"expo.out"},.35);')
animations.append(f'tl.fromTo(".progress",{{scaleX:0}},{{scaleX:1,duration:{duration:.5f},ease:"none"}},0);')
map_rows=[]
for i,(scene,time) in enumerate(zip(scenes,timing['scenes'])):
    start=max(0,time['start']-.45)
    animations.append(f'tl.from("#scene-{i}",{{opacity:0,duration:.45,ease:"power2.inOut"}},{start:.5f});')
    motions=[('eyebrow','x:-24,opacity:0,duration:.4,ease:"power2.out"',.14),('title','y:34,opacity:0,duration:.65,ease:"power3.out"',.22),('copy','x:-18,opacity:0,duration:.5,ease:"expo.out"',.4),('note','y:15,opacity:0,duration:.4,ease:"power2.out"',.55),('window','x:42,opacity:0,duration:.7,ease:"expo.out"',.19),('action','y:14,opacity:0,duration:.5,ease:"power3.out"',.6)]
    for target,vars,offset in motions:animations.append(f'tl.from("#{target}-{i}",{{{vars}}},{start+offset:.5f});')
    for k in range(len(scene['images'])):
        at=time['start']+time['duration']*k/len(scene['images'])
        cues={('filter',1):'combinar',('detail',1):'Editar',('detail',2):'Historial',('team',1):'Revisa',('alerts',1):'Puedes',('backup',1):'Disponible'}
        keyword=cues.get((scene['id'],k))
        if keyword:
            hits=[w['start'] for w in words if w.get('scene')==scene['id'] and w['text'].strip('.,;:').lower()==keyword.lower()]
            if hits:at=max(time['start']+.5,hits[0]-.25)
        if k:animations.append(f'tl.fromTo("#shot-{i}-{k}",{{opacity:0}},{{opacity:1,duration:.45,ease:"power2.inOut"}},{at:.5f});')
        image=scene['images'][k]
        if image=='offline-ready.png':
            animations.append(f'tl.from("#ready-icon",{{scale:.8,opacity:0,duration:.5,ease:"power3.out"}},{at+.16:.5f});tl.from("#ready-title",{{y:22,opacity:0,duration:.5,ease:"expo.out"}},{at+.27:.5f});tl.from("#ready-hint",{{y:12,opacity:0,duration:.4,ease:"power2.out"}},{at+.42:.5f});tl.from(".ready-note",{{opacity:0,duration:.4,ease:"power3.out"}},{at+.5:.5f});')
            continue
        narrow=image in ['new-quote.png','detail.png','edited.png','history.png','message.png','rebalance.png']
        with (root/'assets/screens'/image).open('rb') as file:
            header=file.read(24);width,height=struct.unpack('>II',header[16:24])
        pan=max(0,height*1244/width-583) if narrow else 0
        if image=='new-quote.png':pan*=.55
        if narrow:
            hold=time['start']+time['duration']-at
            animations.append(f'tl.to("#shot-{i}-{k} img",{{y:-{pan:.2f},duration:{max(.5,min(time["duration"]/len(scene["images"]),hold)-2.2):.5f},ease:"power1.inOut"}},{at+1.3:.5f});')
        else:
            animations.append(f'tl.to("#shot-{i}-{k} img",{{scale:1.025,duration:{max(.5,time["duration"]/len(scene["images"])-.7):.5f},ease:"power1.inOut"}},{at+.6:.5f});')
    map_rows.append({'scene':scene['id'],'start':start,'voiceStart':time['voiceStart'],'end':time['start']+time['duration'],'entrances':len(motions)+1,'images':scene['images'],'hold':'intentional reading and spoken instruction','transition':'0.45 second incoming crossfade; previous scene stays fully visible'})
for i,c in enumerate(captions):
    animations.append(f'tl.from("#caption-{i}",{{y:7,opacity:0,duration:{min(.18,(c["end"]-c["start"])/3):.5f},ease:"power2.out"}},{c["start"]:.3f});tl.set("#caption-{i}",{{opacity:0}},{c["end"]:.3f});')
animations.append('window.__timelines=window.__timelines||{};window.__timelines["quote-assistant"]=tl;')
document=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=1920,height=1080"/><title>Quote Assistant — promoción y guía</title><script src="assets/gsap.min.js"></script><style>{css}</style></head><body><main id="root" data-composition-id="quote-assistant" data-start="0" data-duration="{duration:.5f}" data-width="1920" data-height="1080">{''.join(parts)}<header class="topbar"><div class="wordmark">{logo}<span>Quote Assistant</span></div><div class="video-label">PROMOCIÓN + GUÍA DE USO</div></header><div class="caption-band"></div>{caption_html}<footer class="footer"><span>Demo interactiva · Datos de ejemplo · Guardado local</span><span>quote-assistant-moises.vercel.app</span></footer><div class="progress-track"><div class="progress"></div></div><audio id="narration" src="assets/audio/voice-master.wav" data-start="0" data-duration="{duration:.5f}" data-track-index="3" data-volume="1"></audio></main><script>{''.join(animations)}</script></body></html>'''
(root/'index.html').write_text(document)
(root/'animation-map.json').write_text(json.dumps({'duration':duration,'deterministic':True,'choreography':map_rows,'captionCues':len(captions)},ensure_ascii=False,indent=2))
story=(root/'STORYBOARD.md').read_text()
for i,(scene,time) in enumerate(zip(scenes,timing['scenes'])):
    old=f'## {i+1:02d} — {scene["label"]}'
    lines=story.splitlines()
    lines=[f'{old} ({time["start"]:.2f}–{time["start"]+time["duration"]:.2f}s, audio real)' if line.startswith(old) else line for line in lines]
    story='\n'.join(lines)+'\n'
(root/'STORYBOARD.md').write_text(story)
(root/'meta.json').write_text(json.dumps({'id':'quote-assistant-video','name':'Quote Assistant — promoción y guía'},ensure_ascii=False,indent=2))
print('Composition:',round(duration,2),'seconds;',len(scenes),'scenes;',len(captions),'caption cues')
