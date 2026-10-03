# Tipos, plazos y tarjetas — registro de verificación

Fecha: 3 de octubre de 2026. Alcance: extensión aprobada en [quote-types-plan.md](quote-types-plan.md).

## Continuidad del sistema

La extensión conserva el modo **Operate** y la autoridad visual de la interfaz existente: DM Sans, papel claro, navegación carbón, acciones cobalto, superficies planas, divisores finos y estados escritos. Se contrastaron [PRODUCT.md](../PRODUCT.md), [DESIGN.md](../DESIGN.md), [.impeccable/design.json](../.impeccable/design.json), `src/Quotes.tsx`, `src/QuoteForm.tsx`, `src/SettingsView.tsx` y las adiciones de `src/styles.css`.

Las tarjetas amplias, el selector Tarjetas/Tabla, los plazos por tipo y la vista previa de entrega son patrones locales. Las tarjetas usan tres columnas, dos hasta 1350 px y una hasta 720 px; sus títulos de 19 px en escritorio y 20 px en móvil, fecha destacada y radio de 12 px pertenecen a esta superficie. El formulario y Configuración reutilizan los controles, la tinta secundaria, los bordes y el énfasis cobalto del producto. `DESIGN.md` y el sidecar se conservan sin cambios.

## Evidencia visual revisada

Capturas en [.impeccable/review/quote-types](../.impeccable/review/quote-types/):

| Captura | Comprobación |
| --- | --- |
| [desktop-cards.png](../.impeccable/review/quote-types/desktop-cards.png) | Tres columnas, jerarquía de entrega/responsables y Q-10306 con «Fecha modificada» aunque figure retrasada. |
| [desktop-table.png](../.impeccable/review/quote-types/desktop-table.png) | Tabla existente con tipo y takeoff; conserva información de compromiso modificado. |
| [desktop-settings.png](../.impeccable/review/quote-types/desktop-settings.png) | Cinco plazos inicialmente vacíos y explicación de la regla de takeoff. |
| [mobile-cards.png](../.impeccable/review/quote-types/mobile-cards.png) | Una columna y controles dentro de la página a 390 px. |
| [mobile-form-top.png](../.impeccable/review/quote-types/mobile-form-top.png) | Captura de viewport válida del formulario, con controles apilados. |
| [mobile-deadline.png](../.impeccable/review/quote-types/mobile-deadline.png) | Fecha base del viernes 9 de octubre + takeoff = lunes 12; ayuda y resultado legibles. |

[checks.json](../.impeccable/review/quote-types/checks.json) registra las seis superficies, sin desbordamiento de página, errores ni infracciones automatizadas; escritorio a 1440 px y móvil a 390 px. Las capturas complementan las pruebas de teclado y accesibilidad del navegador.

## Verificación funcional revisada

Los registros `/tmp/quote-policy-green.log`, `/tmp/quote-all-e2e.log` y `/tmp/quote-build.log` muestran **27 pruebas de dominio y 36 escenarios de navegador aprobados**, más compilación TypeScript/Vite y generación de caché offline correctas. Esta pasada documental consultó esos resultados.

La cobertura incluye los cinco tipos —Cotización de adicional, Retail menor, Retail mayor, Proyecto menor y Proyecto mayor—, takeoff de exactamente un día hábil en todos, lunes a viernes sin festivos y exclusión del día de asignación. Verifica plazos Senior vacíos o enteros de 1–365, fecha base manual hábil cuando falta regla, y conservación del método, días y fecha base guardados hasta un recálculo explícito.

También cubre compromiso original e historial, conservación de fechas antiguas incluso en fin de semana, clasificación antes de reasignar, exclusión de registros sin clasificar en redistribución, filtros/orden/paginación compartidos y preferencia de vista persistente. JSON, CSV, recarga, offline, borradores, conflictos entre pestañas y consulta fuera del rol Senior mantienen los datos y límites de la demo.

## Desajustes previos y estado

El ejemplo del botón primario en el sidecar conserva un hover mediante `brightness(.96)`, mientras el control implementado usa el cobalto oscuro documentado. Se registra como desajuste previo de la muestra, sin reparación. Las cifras de pruebas anteriores en `DESIGN.md` y el sidecar son evidencia histórica; este registro aporta los resultados de la extensión.

La identidad vigente y los límites de datos sintéticos, persistencia en navegador y roles simulados se mantienen.

## Publicación verificada

El usuario autorizó publicar en un enlace nuevo del equipo «moi», con el plan Hobby gratuito. Producción READY: https://quote-assistant-moi.vercel.app, despliegue `dpl_DYWcZodMaYwHgpKX2AmgtTn7CxK1`. Se publicaron los archivos estáticos del build probado, sin Functions ni servicios adicionales.

La comprobación pública confirmó tarjetas, alta manual con takeoff sin acumulación, política guardada y recálculo explícito con compromiso original intacto, filtros comunes, preferencia de vista, CSV, permisos de configuración de la demo, edición y recarga offline, y detalle móvil por teclado. No hubo errores de ejecución. El navegador de verificación ignoró errores de certificados del proxy del entorno; las comprobaciones HTTP normales validaron HTTPS sin esa excepción.

La app, service worker, página de descargas y los cinco materiales responden HTTP 200 sin autenticación. Las descargas tienen cabecera de archivo adjunto; el MP4 conserva 47.215.369 bytes y una muestra válida, y la guía PDF contiene el nuevo enlace. El HTML publicado coincide con el build local. Evidencia en `production-verification.json` y `production-http.json` dentro de la carpeta de revisión. Los enlaces anteriores conservan sus datos por origen; el traslado a la nueva app se realiza con respaldo JSON.
