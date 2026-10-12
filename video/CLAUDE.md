# Proyecto de video de Quote Assistant

Estas instrucciones complementan `../CLAUDE.md`. La app está en la raíz del repositorio; esta carpeta conserva la composición HyperFrames del video publicado originalmente.

- `index.html` contiene la composición; `scenes.json`, `timings.json`, `captions.json` y los transcripts conservan narración y sincronización.
- Audio, capturas, tipografía y GSAP están incluidos en `assets/`; `narration.wav` permite transcripción local. Mantén las licencias en `licenses/` y el aviso de GSAP.
- Las capturas y la locución son de una versión anterior de la app. No las presentes como una demostración actual de los once perfiles. Actualizarlas es una tarea de video separada.
- El MP4 publicado está en `../public/descargas/quote-assistant-promocion-y-guia.mp4`. Nuevos renders van en `renders/`, fuera de Git.
- La CLI está fijada a HyperFrames 0.8.104 en `package.json`. No cambiar la versión sin comprobar el render y las diferencias.
- `npm run check` valida la composición. Después de editar HTML o animación, ejecutarlo y revisar sus advertencias antes de renderizar. Revisar fotogramas de cada escena y el audio; registrar las verificaciones que se hayan realizado realmente.
- El render usa GSAP determinista y recursos locales; conserva un timeline raíz pausado en `window.__timelines`, tiempos y duraciones explícitos y subtítulos legibles.
- No hace falta regenerar la voz para renderizar: los WAV ya existen. Los scripts Python de voz/transcripción requieren sus dependencias y modelos locales; no se incluyen los pesos. `QUOTE_ASSISTANT_TTS_CACHE` selecciona la carpeta de modelos Kokoro.
- `scripts/capture-app.mjs` usa Playwright instalado en la raíz y, por defecto, `http://127.0.0.1:4173/?space=demo`. Inicia `npm run build && npm run preview -- --port 4173` antes: la preparación offline solo se activa en producción. `QUOTE_ASSISTANT_CAPTURE_URL` permite otra URL de producción. Captura en un contexto aislado, pero reemplaza capturas de esta carpeta y el informe de ejemplo de `public/descargas/`.

Comandos desde esta carpeta:

```sh
npm run check
npm run render -- --output renders/quote-assistant-promocion-y-guia.mp4 --fps 30 --quality high --workers 2
```

Requiere FFmpeg y Chrome/Chromium compatible; se puede seleccionar el ejecutable para HyperFrames mediante `HYPERFRAMES_BROWSER_PATH`.
