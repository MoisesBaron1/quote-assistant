# Quote Assistant · Live Quotation Tracking

MVP local en español construido a partir de la épica adjunta y ampliado por autorización del usuario. React, TypeScript y Vite; tipografía alojada con el sitio. Trabajo empieza vacío y Ejemplos conserva la demostración en un almacén separado.

## Presentación

Activa el icono **Guía de presentación** en la barra superior para recorrer los seis módulos sin modificar datos.

1. Abre Resumen: indicadores de entrega, capacidad y cotizaciones críticas.
2. Abre una cotización: responsables, fechas original/vigente, comentarios e historial.
3. En Equipo, usa Equilibrar carga para revisar y aplicar una propuesta.
4. Consulta Calendario y Alertas; cambia Perfil actual para explorar los recorridos del equipo real.
5. Abre Resumen ejecutivo para imprimir o exportar CSV.

Incluye creación/edición/borrado, siete filtros de la épica, avisos internos, capacidad configurable, actividad, borrador copiable para clientes y respaldo/importación JSON validada.

Las cotizaciones incorporan siete tipos, incluidas las recotizaciones de proyecto y retail, y la opción «Incluye takeoff», que añade un día hábil. En Configuración, la vista Senior Estimator establece el plazo base de cada tipo (1–365 días hábiles); si falta, se pide una fecha base manual. Cada cotización conserva el cálculo utilizado y solo cambia con una edición explícita o «Recalcular con la regla vigente». Los plazos cuentan lunes a viernes, sin festivos, desde el día siguiente a la asignación.

Cotizaciones abre con tarjetas amplias y permite volver a Tabla. Ambas vistas comparten búsqueda, orden, paginación y filtros por tipo y takeoff. Los datos anteriores quedan «Sin clasificar» con sus fechas intactas; se exige clasificarlos al reasignar y la redistribución automática los omite hasta entonces.

## Alcance real del MVP

Los proyectos de Ejemplos son ficticios; las personas son el equipo facilitado por el usuario. Los datos se guardan en localStorage por navegador, origen y espacio; las pestañas del mismo espacio se actualizan mediante eventos de almacenamiento. No existe servidor de datos, autenticación ni colaboración entre dispositivos. Los perfiles ofrecen recorridos funcionales con controles de rol, pero son seleccionables sin contraseña y no verifican la identidad. El mensaje al cliente se prepara y copia; no se envía. Los avisos opcionales dependen del permiso del navegador y de que la app esté abierta.

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

Para operar de forma compartida desde distintos dispositivos: añadir identidad y permisos en servidor, almacenamiento autoritativo, auditoría protegida y sincronización entre usuarios. Estas capacidades no están conectadas en este MVP local.

Actualización publicada y verificada: https://quote-assistant-moi.vercel.app, proyecto `quote-assistant-moi` del equipo `moi`. Despliegue de producción en el plan gratuito Hobby de Vercel, con build local y solo archivos estáticos. No se contrataron servicios adicionales; aplican los límites y condiciones de Hobby. El usuario autorizó el nuevo enlace porque la cuenta conectada no tiene acceso al equipo del proyecto anterior.

Los enlaces anteriores, https://quote-assistant-moises.vercel.app y https://epica-dashboard-two.vercel.app, conservan acceso a las cotizaciones guardadas en ese navegador. El subdominio nuevo tiene almacenamiento separado por las reglas del navegador; para trasladar cambios, descarga el respaldo JSON desde Configuración en el enlace anterior e impórtalo en el nuevo. Se conservó el identificador interno de almacenamiento para proteger la compatibilidad.

## Preparación para una presentación

Los materiales para guardar en el teléfono están en https://quote-assistant-moi.vercel.app/descargas/: video MP4, guía PDF actualizada, texto editable, subtítulos e informe de ejemplo. La página explica cómo guardarlos y eliminarlos en iPhone y Android. Las copias de trabajo y de Vercel se documentan en [docs/entrega-archivos.md](docs/entrega-archivos.md). No se subieron archivos a Google Drive.

Abre la app con internet y espera a **Disponible sin conexión** en el pie. El build precarga los archivos estáticos, incluidos los módulos secundarios, y permite recargar y editar offline en navegadores compatibles. Los cachés se versionan y se conservan la versión actual y una anterior; las actualizaciones no borran cotizaciones. El estado offline considera también fallos reales de la navegación.

Las vistas mantienen una URL con hash y admiten recarga/atrás. Los indicadores abren sus filtros, los formularios protegen borradores y evitan doble envío, los errores llevan el foco al campo que necesita corrección, y los datos locales dañados pueden descargarse y reemplazarse de forma confirmada. Si un módulo no carga hay un camino de recuperación.

Recorrido de cinco minutos: [guía de presentación](docs/guia-presentacion.md).

Verificación de la extensión de tipos del 3 de octubre: 27 pruebas de dominio y 36 escenarios de navegador, compilación correcta, revisión visual independiente y comprobación pública de formularios, recálculo, persistencia/offline, filtros, CSV, móvil y descargas. Detalle en [docs/quote-types-verification.md](docs/quote-types-verification.md).

## Tiempos de trabajo y QA — 2026-10-05

Los estándares recibidos se integran como minutos de esfuerzo, separados de los días hábiles de entrega. El adicional es 00:21; proyectos mayor con/sin takeoff 04:00/06:00 y menor 03:30/04:30; recotización proyecto 02:00, recotización retail 01:00, retail mayor 03:00 y retail menor 02:00. Senior puede cambiarlos en Configuración. Las cotizaciones existentes conservan sus horas; Aplicar tiempo estándar ajusta solo la estimación en una edición, conservando el pendiente. Ver [plan y matriz QA](docs/work-times-qa-plan.md).

Verificación de esta entrega: 35 pruebas de dominio y 48 escenarios de navegador aprobados, compilación correcta, ocho capturas sin desbordamientos ni violaciones WCAG automatizadas y revisión independiente cerrada. Las regresiones cubren campos vacíos, borradores y guardados demorados, progreso de 21 minutos, capacidad de días hábiles, reglas, compatibilidad y offline. Detalle en [informe QA](docs/work-times-qa-verification.md).

Publicación de estos tiempos comprobada el 5 de octubre en el mismo enlace: nueve estándares, reglas y compromisos, borradores y guardados demorados, edición offline, móvil y las cinco descargas. El proyecto continúa en Hobby con archivos estáticos.

## Equipo real y perfiles locales — 2026-10-06

Senior: **Kevin Amaya**. Estimators: **Danilo Heredia, Moisés Barón y Daniela Torres**. Account Managers: **Nayib Farah, Carlos Obregón, Anthony Coronell, Andrés Gianneo, Andrés Franco, Carlos Sierra y Eduardo Jiménez**.

Kevin crea, asigna, reasigna y administra reglas y capacidad. Los Estimators actualizan solo el estado, las horas y los comentarios de sus propias cotizaciones; en el teléfono, estos campos aparecen antes de los datos de asignación de consulta. Cada Account Manager sigue sus solicitudes, prepara mensajes y consulta reportes. Perfil actual conserva la selección por pestaña, actualiza la identidad y usa el nombre real en el historial. Las revisiones de alertas son propias del perfil; sus exportaciones contienen solo las cotizaciones visibles.

Los visitantes nuevos abren **Trabajo**, inicialmente vacío. **Ejemplos** contiene cotizaciones ficticias separadas. Cambiar de espacio protege la configuración pendiente, que Kevin puede guardar o descartar. Restaurar ejemplos no reemplaza Trabajo. Las pestañas comparten únicamente el almacén del mismo espacio en este navegador.

La migración reemplaza responsables solo en ejemplos antiguos reconocibles sin edición. Conserva registros modificados y sus responsables anteriores, junto con fechas, horas e historial. Kevin puede revisarlos en Equipo y asignarlos al equipo actual. Danilo, Moisés y Daniela forman la capacidad actual y la redistribución; la referencia inicial es 40 h/semana, configurable.

**Los perfiles locales no son cuentas autenticadas y no sincronizan entre dispositivos.** El alcance del MVP sigue siendo gratuito, sin backend conectado. La guía describe esta condición y los recorridos de cada función. Plan: [perfiles del equipo](docs/team-profiles-plan.md).

Verificación de perfiles: **45 pruebas de dominio y 64 escenarios de navegador aprobados**, compilación correcta, ocho superficies verificadas y revisión independiente de las dos correcciones cerrada. Publicado el 6 de octubre en el enlace actual de Vercel Hobby, con comprobación anónima de la app, las cinco descargas y los recorridos de perfiles/persistencia/offline. Detalle: [informe QA de perfiles](docs/team-profiles-verification.md) y [handoff visual](docs/team-profiles-design-handoff.md).
