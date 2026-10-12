# Continuar Quote Assistant en Claude

Repositorio: https://github.com/MoisesBaron1/quote-assistant

App actual: https://quote-assistant-moi.vercel.app

## Qué incluye

Código React/TypeScript completo, historial Git, reglas y diseño del producto, 45 pruebas de lógica, 64 escenarios de navegador, guías PDF/Markdown, informe de ejemplo, subtítulos, MP4 y proyecto HyperFrames editable en `video/`. El video conserva capturas de una versión anterior; los perfiles y reglas más recientes se describen en `CLAUDE.md` y la guía actualizada.

No hacen falta claves para ejecutar la app. GitHub no almacena las cotizaciones que hayas registrado en el navegador: descarga el respaldo JSON desde Configuración para conservarlas o trasladarlas. No lo añadas al repositorio.

## Opción 1: Claude Code con acceso a GitHub

Si tu cuenta ofrece Claude Code en la web, abre https://claude.ai/code, conecta GitHub y autoriza el repositorio `MoisesBaron1/quote-assistant`. Selecciona el repositorio y la rama `main`. En su entorno, usa Node.js 24 y este comando de preparación:

```sh
bash scripts/setup-claude.sh --browser
```

En Linux, si el navegador informa que faltan bibliotecas del sistema, ejecuta `npx playwright install --with-deps chromium` con los permisos adecuados del entorno. La app utiliza los puertos 5173 y 4173 para pruebas; permite conexiones locales y las descargas de npm y Playwright en ese entorno.

Copia el contenido de [claude-prompt.md](claude-prompt.md) como primer mensaje. Claude Code lee `CLAUDE.md` como contexto del proyecto. Trabaja en una rama nueva y revisa el diff y las pruebas antes de integrar cambios en `main`.

La conexión a Claude y sus condiciones dependen de tu cuenta; esta entrega no activa una suscripción ni consume su API.

## Opción 2: Claude Code en tu computadora

Instala Git, Node.js 24 y Claude Code mediante el [instalador oficial](https://code.claude.com/docs/en/setup). En Windows puedes utilizar WSL para los comandos Bash. Inicia sesión con la cuenta de GitHub que tiene acceso al repositorio; por ejemplo, con `gh auth login` si tienes GitHub CLI.

```sh
git clone https://github.com/MoisesBaron1/quote-assistant.git
cd quote-assistant
bash scripts/setup-claude.sh --browser
claude
```

Para instalar manualmente en Windows sin Bash:

```sh
npm ci
npm test
npm run build
npx playwright install chromium
```

La app se abre con `npm run dev` y la dirección que indica Vite. El espacio inicial **Trabajo** está vacío; usa `http://localhost:5173/?space=demo` para los ejemplos. Las cotizaciones guardadas en Vercel no aparecen automáticamente en localhost porque son orígenes distintos.

## Opción 3: chat de Claude y paquete de contexto

En GitHub abre **Code → Download ZIP** para descargar todo el proyecto. Si usas Claude como chat, adjunta primero `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md` y `docs/claude-prompt.md`, junto con los archivos de la función que quieras trabajar. El chat recibe contexto; editar, ejecutar pruebas o desplegar requiere un entorno con herramientas, como Claude Code, o que ejecutes los comandos en tu equipo.

El paquete de contexto pequeño `quote-assistant-claude-context.zip` también se adjunta al release de esta entrega. Descomprímelo antes de adjuntar sus documentos al chat. Incluye únicamente documentación textual y el mapa del proyecto; el código completo permanece en el repositorio y su descarga ZIP.

## Verificación antes de integrar

```sh
npm test
npm run build
npm run test:e2e
git diff --check
```

Playwright inicia ambos servidores y compila el preview. En desarrollo puede reutilizar servidores ya abiertos; ciérralos cuando quieras comprobar el código exacto de la rama nueva. En CI se inicia todo desde cero. Para usar tu Chromium instalado:

```sh
QUOTE_ASSISTANT_BROWSER_PATH=/ruta/a/chromium npm run test:e2e
```

La suite de dominio requiere Node 24 por el soporte nativo de TypeScript y sus opciones. La versión de Node de Vite por sí sola no basta para ejecutar estas pruebas.

## Publicar en el enlace existente

Este traspaso no configura un despliegue automático ni modifica la app pública. Después de validar un cambio puedes conectar el repositorio al **proyecto existente** desde Vercel, o publicar manualmente desde la raíz:

```sh
npx vercel login
npx vercel link --scope moi-83ef --project quote-assistant-moi
npx vercel deploy --prod --scope moi-83ef
```

Confirma en la vinculación que el destino es `quote-assistant-moi` de tu equipo `moi`. Mantén Hobby y `vercel.json`; no hace falta base de datos ni variables de entorno. `.vercel` es configuración local y no se sube a GitHub. No crees un proyecto o dominio nuevo para una actualización normal.

Antes de reemplazar una versión, descarga un respaldo JSON desde la app actual y prueba la importación en un entorno de ejemplo. Publicar en el mismo origen conserva el almacenamiento del navegador; cambiar de subdominio requiere traslado manual de los datos.

## Video y materiales

`video/README.md` explica cómo reproducir y renderizar la composición original. Los archivos necesarios para volver a renderizar ya están incluidos; no se distribuyen modelos de voz ni entornos Python. `video/scripts/capture-app.mjs` captura ejemplos desde el preview de producción (4173), pero cambia las capturas y el informe de ejemplo: no es parte de la compilación normal. Usa producción porque el service worker está desactivado en el dev server.

Las cinco descargas están en `public/descargas/`, incluido el MP4 de aproximadamente 45 MiB; no dependen de Git LFS, Drive ni carpetas externas. `npm run prepare:downloads` regenera la guía usando esos materiales y el navegador Playwright. Instala Chromium antes de ejecutarlo; también acepta `QUOTE_ASSISTANT_BROWSER_PATH`.

## Estado y siguiente etapa

Las personas reales y los recorridos por perfil están implementados. El MVP sigue siendo local, offline y gratuito; seleccionar un perfil no autentica identidad. Las pestañas del mismo navegador/origen/espacio comparten datos. Usuarios en teléfonos o computadoras distintos todavía no colaboran entre sí.

Para evolucionar a una herramienta compartida, la futura tarea debe incluir cuentas verificadas, permisos en servidor, almacenamiento autoritativo, auditoría protegida, sincronización y migración de los respaldos. El trabajo actual no incorpora ni contrata esos servicios.
