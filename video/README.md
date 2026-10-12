# Quote Assistant — promoción y guía de uso

Video horizontal para presentar la demo y enseñar sus funciones principales: resumen, filtros, creación, detalle/historial, capacidad, calendario, alertas, informe, respaldo y modo sin conexión. Usa la marca **Quote Assistant** y capturas reales de la app publicada.

App actual: https://quote-assistant-moi.vercel.app

Este proyecto conserva el video original del 1 de octubre de 2026, con capturas y locución de una versión anterior. No incluye todavía los perfiles y las reglas añadidos después. La documentación actual de la app está en la raíz del repositorio. El video publicado original está en `../public/descargas/quote-assistant-promocion-y-guia.mp4`.

Duración: 2 minutos y 19 segundos. Formato: 1920 × 1080, 30 fps, MP4. Narración sintética en español; subtítulos integrados y archivo SRT separado. La captura y el render usan solo datos de ejemplo.

## Editar y reproducir

Requiere Node.js 22 o posterior, FFmpeg y un navegador Chrome/Chromium compatible. No necesita una API de pago. Desde esta carpeta:

```bash
npm run dev
npm run check
npm run render -- --output renders/quote-assistant-promocion-y-guia.mp4 --fps 30 --quality high --workers 2
```

Si ya tienes Chromium instalado en Linux, puedes evitar la descarga del navegador del render: `HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npm run render -- --output renders/quote-assistant-promocion-y-guia.mp4 --fps 30 --quality high --workers 2`. Ajusta esa ruta a tu equipo.

Para una vista previa persistente:

```bash
npx hyperframes@0.8.104 preview --background --port 3017 --no-open
```

`index.html` es la composición; `scenes.json` conserva el texto y los activos por escena. `timings.json` usa duraciones medidas del audio, `captions.json` las frases subtituladas y `transcript-corrected.json` los tiempos de habla con la ortografía de marca corregida. Los archivos de audio y tipografía se incluyen para poder volver a renderizar sin repetir su generación.

Los scripts de captura y producción de voz conservan el proceso original. No son necesarios para reproducir o volver a renderizar la composición existente. El modelo de voz y el entorno Python no se distribuyen dentro del proyecto.

Para nuevas capturas, instala las dependencias y Chromium desde la raíz (`npm ci` y `npx playwright install chromium`), inicia la app con `npm run build && npm run preview -- --port 4173` y ejecuta `node video/scripts/capture-app.mjs` desde otra terminal en la raíz. Usa por defecto el espacio Ejemplos del preview de producción y un contexto de navegador aislado. Requiere este preview porque la preparación offline no se activa en el dev server. `QUOTE_ASSISTANT_CAPTURE_URL` selecciona otra URL de producción y `QUOTE_ASSISTANT_BROWSER_PATH` un navegador propio. El script reemplaza las capturas y el informe PDF de ejemplo; no es necesario para compilar la app.

Para regenerar voz, instala en un entorno Python los paquetes `kokoro-onnx`, `numpy`, `soundfile` y `espeakng-loader`; sitúa los modelos Kokoro en `models/kokoro-v1.0.onnx` y `voices/voices-v1.0.bin` dentro de `QUOTE_ASSISTANT_TTS_CACHE` (por defecto `~/.cache/hyperframes/tts`). La transcripción utiliza `faster-whisper`. Los modelos son descargas separadas y no se incluyen en Git. Los WAV existentes permiten renderizar sin repetir estos pasos.

## Verificación

HyperFrames `check` aprobó recursos, ejecución, layout y contraste sin errores. Se revisaron sus 14 advertencias: once recomendaciones para extraer subcomposiciones, dos para ordenar pistas y una por reutilizar el icono de marca en dos lugares. Las superposiciones informativas detectadas corresponden a los fundidos breves entre escenas. Se revisaron visualmente fotogramas de las once escenas. La comprobación automática de movimiento mediante un archivo `*.motion.json` no se activó; no se presenta como una prueba ejecutada.

La narración se generó con Kokoro en CPU, se transcribió con Faster Whisper en español y se corrigieron nombres, acentos y siglas conservando los tiempos del habla. Se niveló el volumen para presentación. Este entorno no permite una audición humana del audio; la verificación usa la transcripción y las mediciones de señal. El MP4 final se decodificó completo sin errores; sus especificaciones y las mediciones de audio se conservan en `DELIVERY.md`.

## Créditos

HyperFrames 0.8.104; GSAP 3.14.2 (licencia incluida en su encabezado); icono de capas de Lucide (ISC); DM Sans de Google Fonts / Fontsource (OFL); Kokoro-82M / kokoro-onnx para voz local; Whisper / Faster Whisper para transcripción. No se usaron imágenes de stock, música comercial ni servicios de pago. Los ejemplos y mensajes del producto no son información comercial real y no envían comunicaciones.
