import json
from pathlib import Path
from faster_whisper import WhisperModel

root=Path(__file__).resolve().parent.parent
model=WhisperModel('base', device='cpu', compute_type='int8', cpu_threads=2, num_workers=1, download_root='/tmp/quote-assistant-asr-cache')
segments, info=model.transcribe(str(root/'narration.wav'),language='es',beam_size=3,word_timestamps=True,vad_filter=False)
words=[]
for segment in segments:
    for word in segment.words or []:
        words.append({'text':word.word.strip(),'start':round(word.start,3),'end':round(word.end,3)})
    print(round(segment.end,1), segment.text, flush=True)
(root/'transcript.json').write_text(json.dumps(words,ensure_ascii=False,indent=2))
print('Transcribed words:',len(words),flush=True)
