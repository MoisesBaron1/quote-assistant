# Traspaso a GitHub y Claude — verificación local

Fecha de entrega: 11 de octubre de 2026, zona America/Bogota. Destino proporcionado por el usuario: https://github.com/MoisesBaron1/quote-assistant, público en el momento de verificarlo. La app permanece en https://quote-assistant-moi.vercel.app.

## Alcance entregado

- Código de la app, historial Git existente, Node 24 y lockfile.
- `CLAUDE.md`, mapa de archivos, contratos de negocio, perfiles, límites y guía de continuidad.
- Extracción original de la épica y planes históricos, identificados como tales.
- Setup portable y CI de instalación, dominio, build y navegador; no despliegue automático.
- Proyecto HyperFrames completo para renderizar, activos y licencias; conserva el video original.
- Cinco materiales descargables, incluido el MP4 de 47.215.369 bytes, sin LFS o carpetas externas.

No se modifican componentes, reglas, perfiles o almacenamiento de la app. El JavaScript compilado y el service worker coinciden exactamente con los del enlace publicado, verificado por HTTP anónimo 200 y SHA-256.

## Copia limpia

Se exportó el árbol preparado de Git a un directorio nuevo, sin `node_modules`, `.vercel`, credenciales, builds o archivos temporales de la sesión original. En esa copia:

| Comprobación | Resultado |
|---|---|
| `bash scripts/setup-claude.sh --browser` | Instalación exacta, Node 24.19.0, 45 pruebas de lógica, build y Chromium gestionado por Playwright correctos |
| `CI=1 npm run test:e2e` | **64/64 aprobados**, 1,8 minutos, servidores iniciados automáticamente |
| Dos importaciones repetidas tres veces | **6/6 aprobadas** después de corregir sus esperas |
| `npm run prepare:downloads` sin argumento | Correcto; usa archivos incluidos y genera guía/PDF/página |
| `node video/scripts/capture-app.mjs` | 19 capturas, HTTP 200 y cero errores de ejecución desde preview de producción |
| Referencias del HTML de video | 17 activos locales encontrados; ninguno ausente |
| Python y JavaScript de herramientas | Sintaxis correcta; Bash correcto |
| Documentación enlazada | Sin enlaces locales rotos en documentos principales |
| Patrones comunes de claves | Sin coincidencias en el árbol preparado ni en 165 blobs del historial previo; revisión básica, no auditoría completa |
| Tamaños | Ningún archivo alcanza el límite de 100 MiB de GitHub |

La comprobación de captura y la regeneración de descargas se ejecutaron solo en la copia aislada. No se reemplazan las capturas originales del video, los PDF publicados ni datos del navegador del usuario. No se genera una versión nueva del MP4 ni se afirma una revisión nueva de su locución.

## Correcciones de portabilidad

La suite anterior usaba Chromium de `/usr/bin` y servidores iniciados manualmente. Ahora usa Chromium de Playwright por defecto, admite `QUOTE_ASSISTANT_BROWSER_PATH` y prepara automáticamente 5173/4173. Node 24 queda declarado para las pruebas TypeScript nativas.

Dos pruebas de respaldo importaban inmediatamente después de pulsar Guardar configuración. Con el Chromium actual, el guardado y el snapshot de importación podían cruzarse y el control de versión rechazaba correctamente la importación. Se reprodujeron ambos fallos; las pruebas esperan ahora «Configuración guardada». Las protecciones de la app no se relajaron.

La captura de video necesita el service worker para mostrar offline, que solo se registra en producción. Se reprodujo el timeout en desarrollo y se corrigió el destino predeterminado al preview 4173. Se conserva el contexto aislado de captura.

## Evidencia y continuidad

Regresiones y configuración están dentro de Git. Informes anteriores: `docs/team-profiles-verification.md`, `docs/work-times-qa-verification.md` y `docs/quote-types-verification.md`.

Logs de esta sesión: `/tmp/quote-claude-clean-setup.log`, `/tmp/quote-claude-clean-e2e-final.log`, `/tmp/quote-claude-imports-final-green.log`, `/tmp/quote-claude-downloads.log`, `/tmp/quote-claude-video-capture-preview.log`. Son evidencia local; los comandos de arriba permiten reproducirla sin esos archivos.

La publicación debe conservar la rama `main` y los ocho commits originales, verificar el SHA remoto y revisar el primer resultado de GitHub Actions. El paquete textual de contexto acompaña la entrega; `docs/continuar-en-claude.md` y `docs/claude-prompt.md` explican su uso. Credenciales y configuraciones locales de GitHub/Vercel no forman parte del repositorio ni de los paquetes.
