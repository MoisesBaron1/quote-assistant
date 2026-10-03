# Quote Assistant · Live Quotation Tracking

MVP de demostración en español construido a partir de la épica adjunta y ampliado por autorización del usuario. React, TypeScript y Vite; tipografía alojada con el sitio.

## Presentación

Activa el icono **Guía de presentación** en la barra superior para recorrer los seis módulos sin modificar datos.

1. Abre Resumen: indicadores de entrega, capacidad y cotizaciones críticas.
2. Abre una cotización: responsables, fechas original/vigente, comentarios e historial.
3. En Equipo, usa Equilibrar carga para revisar y aplicar una propuesta.
4. Consulta Calendario y Alertas; cambia Vista demo para explorar perfiles.
5. Abre Resumen ejecutivo para imprimir o exportar CSV.

Incluye creación/edición/borrado, siete filtros de la épica, avisos internos, capacidad configurable, actividad, borrador copiable para clientes y respaldo/importación JSON validada.

Las cotizaciones incorporan cinco tipos e «Incluye takeoff», que añade un día hábil. En Configuración, la vista Senior Estimator establece el plazo base de cada tipo (1–365 días hábiles); si falta, se pide una fecha base manual. Cada cotización conserva el cálculo utilizado y solo cambia con una edición explícita o «Recalcular con la regla vigente». Los plazos cuentan lunes a viernes, sin festivos, desde el día siguiente a la asignación.

Cotizaciones abre con tarjetas amplias y permite volver a Tabla. Ambas vistas comparten búsqueda, orden, paginación y filtros por tipo y takeoff. Los datos anteriores quedan «Sin clasificar» con sus fechas intactas; se exige clasificarlos al reasignar y la redistribución automática los omite hasta entonces.

## Alcance real de la demo

Los ejemplos son ficticios. Los datos se guardan en localStorage por navegador y origen; las pestañas del mismo navegador se actualizan mediante eventos de almacenamiento. No existe servidor de datos, autenticación ni colaboración entre dispositivos. Las vistas de rol son simulaciones y no controles de acceso. El mensaje al cliente se prepara y copia; no se envía. Los avisos opcionales dependen del permiso del navegador y de que la app esté abierta.

Las mutaciones se serializan con Web Locks en navegadores compatibles. Se revisa la versión persistida antes de escribir; se bloquean formularios y confirmaciones desactualizados. Si falla el almacenamiento, la app conserva cambios en memoria, muestra una advertencia y permite respaldarlos. No constituye una base transaccional para producción.

Días restantes: días naturales en zona horaria configurable, UTC por defecto. Vence hoy = 0. Se considera retrasada si vence y no está finalizada. Lista para enviar y Entregada son estados terminales. Modificar la fecha original identifica una postergación incluso cuando se adelanta; la marca puede coexistir con retraso. La fecha original se conserva.

El riesgo y la redistribución son heurísticas explicables basadas en fechas, horas pendientes y capacidad nominal semanal. No consideran vacaciones, feriados, especialidad ni secuencia detallada; revisar antes de aplicar. Los indicadores siguen los filtros visibles. Al entrar al calendario se restablecen los filtros de tabla.

## Desarrollo y verificación

Requiere Node 22.12+; los tests de dominio con TypeScript nativo utilizan Node 24.

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright test
```

Las pruebas de navegador usan los servidores locales en 5173 (desarrollo) y 4173 (preview de producción, para offline). Antes de ejecutarlas, inicia `npm run dev` y, en otra terminal, `npm run build && npm run preview -- --port 4173`.

La configuración de Playwright usa `/usr/bin/chromium` para este entorno. Ajusta `executablePath` o instala el navegador de Playwright en otro equipo. Los tests cubren reglas de negocio, flujos principales, conflictos entre pestañas, almacenamiento fallido y controles WCAG automatizados. La inspección visual complementa las pruebas.

## Despliegue

`vercel.json` configura Vite y cabeceras. La demo es estática; no necesita claves ni variables de entorno. Para uso permanente, vincula tu cuenta de Vercel y ejecuta `vercel --prod`. La CLI también ofrece `vercel deploy --temporary` sin inicio de sesión; la URL y las condiciones reales de ese despliegue se registran en `progress.md`.

Para operar con datos reales: añadir identidad y permisos en servidor, almacenamiento autoritativo, auditoría protegida y sincronización entre usuarios; conectar la fuente de cotizaciones y aprobar las reglas de trabajo. Estas capacidades no están presentes en la demo.

Actualización publicada y verificada: https://quote-assistant-moi.vercel.app, proyecto `quote-assistant-moi` del equipo `moi`. Despliegue de producción en el plan gratuito Hobby de Vercel, con build local y solo archivos estáticos. No se contrataron servicios adicionales; aplican los límites y condiciones de Hobby. El usuario autorizó el nuevo enlace porque la cuenta conectada no tiene acceso al equipo del proyecto anterior.

Los enlaces anteriores, https://quote-assistant-moises.vercel.app y https://epica-dashboard-two.vercel.app, conservan acceso a las cotizaciones guardadas en ese navegador. El subdominio nuevo tiene almacenamiento separado por las reglas del navegador; para trasladar cambios, descarga el respaldo JSON desde Configuración en el enlace anterior e impórtalo en el nuevo. Se conservó el identificador interno de almacenamiento para proteger la compatibilidad.

## Preparación para una presentación

Los materiales para guardar en el teléfono están en https://quote-assistant-moi.vercel.app/descargas/: video MP4, guía PDF actualizada, texto editable, subtítulos e informe de ejemplo. La página explica cómo guardarlos y eliminarlos en iPhone y Android. Las copias de trabajo y de Vercel se documentan en [docs/entrega-archivos.md](docs/entrega-archivos.md). No se subieron archivos a Google Drive.

Abre la app con internet y espera a **Disponible sin conexión** en el pie. El build precarga los archivos estáticos, incluidos los módulos secundarios, y permite recargar y editar offline en navegadores compatibles. Los cachés se versionan y se conservan la versión actual y una anterior; las actualizaciones no borran cotizaciones. El estado offline considera también fallos reales de la navegación.

Las vistas mantienen una URL con hash y admiten recarga/atrás. Los indicadores abren sus filtros, los formularios protegen borradores y evitan doble envío, los errores llevan el foco al campo que necesita corrección, y los datos locales dañados pueden descargarse y reemplazarse de forma confirmada. Si un módulo no carga hay un camino de recuperación.

Recorrido de cinco minutos: [guía de presentación](docs/guia-presentacion.md).

Verificación de esta extensión: 27 pruebas de dominio y 36 escenarios de navegador, compilación correcta, revisión visual independiente y comprobación pública de formularios, recálculo, persistencia/offline, filtros, CSV, móvil y descargas. Detalle en [docs/quote-types-verification.md](docs/quote-types-verification.md).
