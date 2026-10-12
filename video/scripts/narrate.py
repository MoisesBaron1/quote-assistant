import json
from pathlib import Path
import os
import numpy as np
import soundfile as sf
import espeakng_loader

os.environ['PHONEMIZER_ESPEAK_LIBRARY'] = espeakng_loader.get_library_path()
os.environ['ESPEAK_DATA_PATH'] = espeakng_loader.get_data_path()
os.environ['OMP_NUM_THREADS'] = '2'
from kokoro_onnx import Kokoro

root = Path(__file__).resolve().parent.parent
cache = Path(os.environ.get('QUOTE_ASSISTANT_TTS_CACHE', str(Path.home()/'.cache/hyperframes/tts')))
model = Kokoro(str(cache/'models/kokoro-v1.0.onnx'), str(cache/'voices/voices-v1.0.bin'))
scenes = json.loads((root/'scenes.json').read_text())
audio, timings, spoken = [], [], []
elapsed = 0
for index, scene in enumerate(scenes):
    text = scene['narration'].replace('PDF', 'pe de efe').replace('CSV', 'ce ese uve')
    samples, rate = model.create(text, voice='em_alex', speed=0.97, lang='es')
    leading = np.zeros(round(rate*0.35), dtype=np.float32)
    trailing = np.zeros(round(rate*(2.3 if index == len(scenes)-1 else 0.8)), dtype=np.float32)
    clip = np.concatenate([leading, samples, trailing])
    sf.write(root/'assets/audio'/f'{scene["id"]}.wav', clip, rate)
    duration = len(clip)/rate
    timings.append({'id':scene['id'],'start':round(elapsed,5),'duration':round(duration,5),'voiceStart':round(elapsed+0.35,5),'voiceEnd':round(elapsed+0.35+len(samples)/rate,5)})
    audio.append(clip)
    spoken.append(text)
    elapsed += duration
    print(scene['id'], round(duration,2), 'seconds', flush=True)
sf.write(root/'narration.wav', np.concatenate(audio), rate)
(root/'timings.json').write_text(json.dumps({'voice':'em_alex','lang':'es','speed':0.97,'sampleRate':rate,'duration':elapsed,'scenes':timings},indent=2))
(root/'narration.txt').write_text('\n\n'.join(spoken)+'\n')
print('TOTAL', round(elapsed,2), flush=True)
