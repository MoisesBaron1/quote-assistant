# Quote Assistant — verificación de tiempos de trabajo y QA

Fecha: 5 de octubre de 2026. Referencia de comparación: `fd41d33`. Alcance aprobado: [plan de tiempos y QA](work-times-qa-plan.md).

**Estado:** 83 pruebas aprobadas, revisión independiente cerrada y actualización publicada y verificada en el enlace actual de Vercel Hobby.

## Estándares confirmados

La tabla recibida expresa esfuerzo en horas:minutos:segundos; Configuración lo edita en HH:MM. SI/NO corresponde a takeoff y «Proyecto adicional» corresponde al tipo existente «Cotización de adicional». Son siete tipos y nueve variantes:

| Tipo | Takeoff | HH:MM | Minutos |
| --- | --- | --- | ---: |
| Cotización de adicional | Cualquiera | 00:21 | 21 |
| Proyecto mayor | Sí | 04:00 | 240 |
| Proyecto mayor | No | 06:00 | 360 |
| Proyecto menor | Sí | 03:30 | 210 |
| Proyecto menor | No | 04:30 | 270 |
| Recotización proyecto | Cualquiera | 02:00 | 120 |
| Recotización retail | Cualquiera | 01:00 | 60 |
| Retail mayor | Cualquiera | 03:00 | 180 |
| Retail menor | Cualquiera | 02:00 | 120 |

El esfuerzo es independiente del plazo de entrega. Los plazos empiezan sin configurar y admiten un entero de 1–365 días hábiles o una fecha base manual de lunes a viernes. El día de asignación no cuenta y no hay calendario de festivos. Takeoff añade exactamente un día hábil en los siete tipos; los contadores y avisos conservan días calendario.

Las nuevas cotizaciones reciben el estándar. Los ajustes manuales sobreviven a cambios de tipo. Las cotizaciones guardadas conservan estimación, horas pendientes y fechas; «Aplicar tiempo estándar» cambia explícitamente la estimación y conserva el pendiente. «Recalcular con la regla vigente» aplica explícitamente el plazo actual y mantiene el compromiso original. El historial registra cambios de esfuerzo.

## Correcciones verificadas

| Caso | Resultado y regresión |
| --- | --- |
| Número obligatorio vacío | Se valida como incompleto; muestra el error y enfoca el campo, sin guardar silenciosamente `0`. |
| Borrador de Configuración | Sobrevive a la navegación; los cambios de otra pestaña conservan el borrador y bloquean una escritura desactualizada. |
| Guardado demorado y navegación | El guardado exitoso liquida únicamente su borrador retenido; una edición posterior sigue protegida. Tres casos cubren permanecer fuera, volver sin editar y volver con nuevas ediciones. |
| Riesgo y fines de semana | La capacidad nominal disponible cuenta lunes a viernes; sábado y domingo no aportan horas. |
| Avance inferior a una hora | `0.35 h` estimadas y pendientes producen 0%; `0.175 h` pendientes producen 50% y «10 min 30 s». |
| Contraste del formulario | La introducción pasó de 4.17:1 al token compartido `--muted`; la regresión WCAG del formulario pasa. |
| Compatibilidad | Respaldos anteriores reciben los estándares ausentes sin modificar horas o fechas, incluidos compromisos antiguos en fin de semana. JSON conserva reglas; CSV conserva horas numéricas y metadatos; las vistas muestran duraciones legibles. |
| Roles y offline | Senior puede editar reglas; los otros roles demo consultan. Tras la primera carga online, la edición offline conserva plazos y estándares. |

El caso del indicador de retrasadas dejó de depender de un recuento fijo sensible a la fecha: compara el filtro con el valor actual del indicador. No se alteraron datos de negocio para satisfacer esa prueba.

El fallo inicial del caso de plazo congelado era de sincronización de la prueba: intentaba rellenar la configuración mientras el diálogo nativo seguía abierto y el campo del fondo permanecía inerte. Se corrigió esperando la creación, el cierre del diálogo, el valor `5` y la confirmación de guardado. Conserva las comprobaciones de fechas y recálculo; no requirió cambiar código de producción.

La [guía](guia-presentacion.md), su copia descargable y el PDF se actualizaron con tiempos, recotizaciones y límites del modelo.

## Evidencia

| Comprobación | Resultado comprobado | Registro |
| --- | --- | --- |
| Dominio, `npm test` | 35/35; cero fallos | `/tmp/work-times-domain-final.log` |
| Producción, `npm run build` | TypeScript, Vite y caché offline correctos; 11 recursos estáticos | `/tmp/work-times-build.log` |
| Regresión de guardado demorado | Dos fallos reproducidos antes del arreglo; 3/3 después | `/tmp/work-times-save-race-red.log`, `/tmp/work-times-save-race-green.log` |
| Sincronización del caso de plazo congelado | 3/3 repeticiones tras corregir la prueba | `/tmp/work-times-recalc-final.log` |
| Suite completa de navegador | 48/48; cero fallos; 1.8 minutos | `/tmp/work-times-all-e2e.log` |
| Materiales descargables | Generación correcta; guía PDF de 34 465 bytes | `/tmp/work-times-downloads.log` |
| Revisión responsive y accesibilidad | Ocho capturas; cero desbordamientos de página, errores de ejecución o violaciones automáticas | [checks.json](../.impeccable/review/work-times/checks.json) |

La cobertura está en [pruebas de tiempos](../tests/work-times.test.ts), [política de cotización](../tests/quotation-policy.test.ts), [navegador de tiempos](../e2e/work-times.spec.ts), [offline](../e2e/offline.spec.ts) y [presentación](../e2e/presentation.spec.ts). Los registros `/tmp` son evidencia local de esta sesión.

Capturas abiertas y validadas por el implementador y el revisor independiente en `.impeccable/review/work-times/`:

- Escritorio, 1440 px: `desktop-form-time.png`, `desktop-cards.png`, `desktop-table.png`, `desktop-settings.png`.
- Tableta, 820 px: `tablet-cards.png`.
- Móvil, 390 px: `mobile-cards.png`, `mobile-form-time.png`, `mobile-settings-times.png`.

## Revisión y canon visual

La revisión independiente emitió **ship**, sin hallazgos críticos, importantes ni visuales. Su único hallazgo menor —falso conflicto tras guardar y navegar— quedó resuelto con la regresión de tres casos anterior. También confirmó la causa del fallo de sincronización de la prueba. La suite completa posterior pasó 48/48; no quedan hallazgos abiertos de esta revisión.

La extensión conserva el canon de [DESIGN.md](../DESIGN.md): modo Operate, DM Sans autohospedada, papel claro, navegación carbón, acciones cobalto y controles existentes. No cambia la identidad visual. La revisión automatizada complementa las capturas y la cobertura de teclado; no equivale a una evaluación exhaustiva de accesibilidad.

Rezago documental previo: `DESIGN.md` y `.impeccable/design.json` conservan evidencia y componentes de septiembre, con recuentos históricos de 18 pruebas de dominio y 13/26 de navegador. Esos recuentos no describen esta entrega. Se informa el rezago sin modificar ninguno de los dos archivos.

## Límites y publicación

Continúa siendo una demo con datos sintéticos, persistencia local y sincronización entre pestañas del mismo navegador. Los roles no son autenticación. El riesgo es heurístico: no reserva una agenda ni contempla festivos o ausencias. No se añaden backend, integraciones pagadas ni comunicaciones enviadas. Los materiales de descarga no se precargan en la caché offline.

La entrega usa únicamente `dist` estático en el mismo proyecto y la dirección [quote-assistant-moi.vercel.app](https://quote-assistant-moi.vercel.app). Se reconfirmó el plan gratuito Hobby del equipo `moi-83ef` mediante Vercel CLI (`GET /v2/teams/team_6Qjg5ShNqz44Gso9FirLhZyg`). No hay Functions ni servicios pagados añadidos.

Despliegue de producción `dpl_Ae3Y71m3ysrQ926cVo7opsegb7wE`, estado **READY**, el 5 de octubre. La comprobación pública comenzó a las **22:49:30 UTC**:

- HTTPS anónimo devuelve 200; el índice y el service worker coinciden byte a byte con la compilación probada. El worker conserva `no-cache`.
- Navegador nuevo: nueve estándares exactos, fecha manual/takeoff sin acumulación, reglas congeladas y recálculo explícito con compromiso original conservado, filtros Tarjetas/Tabla, preferencia y CSV.
- Configuración Senior, borrador entre secciones y guardado demorado sin falso conflicto; consulta en otros roles demo; edición y recarga offline con tiempos y plazos conservados.
- Teléfono de 390 px sin desbordamiento y apertura de detalle por teclado. Cero errores de ejecución en la comprobación pública.
- Página de descargas y cinco archivos devuelven 200 con cabecera de descarga y tamaños esperados. Guía PDF de 34 465 bytes y texto actualizado coinciden con el artefacto local. El MP4 conserva sus 47 215 369 bytes; su muestra por rango coincide con el original.

Registros locales: [verificación de navegador](../.impeccable/review/work-times/production-verification.json), [HTTP y materiales](../.impeccable/review/work-times/production-http.json) y `/tmp/work-times-vercel-deploy.log`. Chromium usa la excepción de certificado del proxy de este entorno; la comprobación HTTP con `urllib` valida TLS normalmente. El alias permanece igual y la actualización conserva las cotizaciones guardadas en ese origen.
