# Quote Assistant — ubicación de los materiales

Página de descarga de la actualización: https://quote-assistant-moi.vercel.app/descargas/

El video y la guía se guardan en el teléfono cuando el usuario los descarga y selecciona una ubicación. En iPhone puede elegir **En mi iPhone** en Guardar en Archivos, o configurar las descargas de Safari allí. En Android normalmente se guardan en **Archivos → Descargas**. La página explica cómo borrar esas copias y vaciar la papelera cuando corresponde.

No se subieron archivos a Google Drive. Las copias de trabajo de esta sesión están en `/workspace/shared/downloads`; el proyecto editable del video está en `/workspace/videos/quote-assistant-video`, incluido su MP4 original en `renders/`. La copia destinada a publicación está en `public/descargas` de este repositorio y se sirve como archivos estáticos del proyecto `quote-assistant-moi`, en el equipo `moi` de Vercel. El MP4 generado queda fuera de Git para mantener ligero el código fuente. Las publicaciones anteriores permanecen en sus enlaces originales.

Para regenerar la entrega, mantén el MP4 y el SRT en una carpeta y ejecuta `npm run prepare:downloads -- /ruta/a/los/materiales`. El script copia esos activos, transforma `docs/guia-presentacion.md` en PDF y texto, y genera la página para teléfonos. Requiere Chromium; usa `QUOTE_ASSISTANT_BROWSER_PATH` para seleccionar otro ejecutable. El build del MVP no precarga estos materiales en la caché offline: la descarga se inicia al pulsar el enlace.

La compilación también genera copias en `dist/descargas` y `.vercel/output/static/descargas`. El paquete estático de publicación de esta sesión está en `/workspace/quote-assistant-release/.vercel/output/static/descargas`. Son copias de trabajo que pueden regenerarse; inclúyelas si necesitas eliminar todos los archivos del entorno.

Para retirar las descargas de la dirección pública, elimina los materiales de `public/descargas`, retira sus reglas de descarga en `vercel.json` y vuelve a desplegar. Para eliminar todas las copias alojadas, revisa y elimina también los despliegues anteriores que contengan estos archivos. Para borrar todas las copias de trabajo, elimina los archivos correspondientes de `shared/downloads`, los archivos duplicados en `public/descargas` y el MP4 en `videos/quote-assistant-video/renders`, conservando o eliminando el proyecto editable según se solicite. Borrar una copia local del teléfono no modifica esos originales ni los despliegues.

Se conserva Vercel Hobby, con sus límites y condiciones; no se añadieron servicios o planes de pago.

## Repositorio portable — 2026-10-11

El código completo se entrega en https://github.com/MoisesBaron1/quote-assistant, público según la configuración elegida por el usuario. `video/` contiene el proyecto editable y sus activos. El MP4 original se incorpora ahora a Git en `public/descargas/quote-assistant-promocion-y-guia.mp4` (47.215.369 bytes, menor de 50 MiB), junto a las otras cuatro descargas; un clon no depende de carpetas externas ni Git LFS.

Las ubicaciones `/workspace/...` anteriores documentan la sesión original. Desde una copia nueva, `npm run prepare:downloads` usa por defecto los activos de `public/descargas/`; el argumento de carpeta sigue disponible para reemplazarlos. El navegador puede ser el instalado por Playwright o `QUOTE_ASSISTANT_BROWSER_PATH`. La guía de continuidad y los pasos de Vercel están en [continuar-en-claude.md](continuar-en-claude.md).
