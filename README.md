# Epica · Live Quotation Tracking

MVP de demostración en español construido a partir de la épica adjunta y ampliado por autorización del usuario. React, TypeScript y Vite; tipografía alojada con el sitio.

## Presentación

1. Abre Resumen: indicadores de entrega, capacidad y cotizaciones críticas.
2. Abre una cotización: responsables, fechas original/vigente, comentarios e historial.
3. En Equipo, usa Equilibrar carga para revisar y aplicar una propuesta.
4. Consulta Calendario y Alertas; cambia Vista demo para explorar perfiles.
5. Abre Resumen ejecutivo para imprimir o exportar CSV.

Incluye creación/edición/borrado, siete filtros de la épica, avisos internos, capacidad configurable, actividad, borrador copiable para clientes y respaldo/importación JSON validada.

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

La configuración de Playwright usa `/usr/bin/chromium` para este entorno. Ajusta `executablePath` o instala el navegador de Playwright en otro equipo. Los tests cubren reglas de negocio, flujos principales, conflictos entre pestañas, almacenamiento fallido y controles WCAG automatizados. La inspección visual complementa las pruebas.

## Despliegue

`vercel.json` configura Vite y cabeceras. La demo es estática; no necesita claves ni variables de entorno. Para uso permanente, vincula tu cuenta de Vercel y ejecuta `vercel --prod`. La CLI también ofrece `vercel deploy --temporary` sin inicio de sesión; la URL y las condiciones reales de ese despliegue se registran en `progress.md`.

Para operar con datos reales: añadir identidad y permisos en servidor, almacenamiento autoritativo, auditoría protegida y sincronización entre usuarios; conectar la fuente de cotizaciones y aprobar las reglas de trabajo. Estas capacidades no están presentes en la demo.

Demo publicada y verificada: https://temporary-zippy-comet-gt96xu1.vercel.app. El despliegue anónimo vence el30 de septiembre de2026 a las18:50 UTC salvo que su propietario lo reclame mediante el enlace entregado en la conversación. Reclamarlo requiere iniciar sesión en una cuenta de Vercel.
