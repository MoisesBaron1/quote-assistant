# Quote Assistant — ubicación de los materiales

Página de descarga de la actualización: https://quote-assistant-moi.vercel.app/descargas/

El video y la guía se guardan en el teléfono cuando el usuario los descarga y selecciona una ubicación. En iPhone puede elegir **En mi iPhone** en Guardar en Archivos, o configurar las descargas de Safari allí. En Android normalmente se guardan en **Archivos → Descargas**. La página explica cómo borrar esas copias y vaciar la papelera cuando corresponde.

No se subieron archivos a Google Drive. Las copias de trabajo de esta sesión están en `/workspace/shared/downloads`; el proyecto editable del video está en `/workspace/videos/quote-assistant-video`, incluido su MP4 original en `renders/`. La copia destinada a publicación está en `public/descargas` de este repositorio y se sirve como archivos estáticos del proyecto `quote-assistant-moi`, en el equipo `moi` de Vercel. El MP4 generado queda fuera de Git para mantener ligero el código fuente. Las publicaciones anteriores permanecen en sus enlaces originales.

Para regenerar la entrega, mantén el MP4 y el SRT en una carpeta y ejecuta `npm run prepare:downloads -- /ruta/a/los/materiales`. El script copia esos activos, transforma `docs/guia-presentacion.md` en PDF y texto, y genera la página para teléfonos. Requiere Chromium; usa `QUOTE_ASSISTANT_BROWSER_PATH` para seleccionar otro ejecutable. El build del MVP no precarga estos materiales en la caché offline: la descarga se inicia al pulsar el enlace.

Para retirar las descargas de la dirección pública, elimina los materiales de `public/descargas`, retira sus reglas de descarga en `vercel.json` y vuelve a desplegar. Para eliminar todas las copias alojadas, revisa y elimina también los despliegues anteriores que contengan estos archivos. Para borrar todas las copias de trabajo, elimina los archivos correspondientes de `shared/downloads`, los archivos duplicados en `public/descargas` y el MP4 en `videos/quote-assistant-video/renders`, conservando o eliminando el proyecto editable según se solicite. Borrar una copia local del teléfono no modifica esos originales ni los despliegues.

Se conserva Vercel Hobby, con sus límites y condiciones; no se añadieron servicios o planes de pago.
