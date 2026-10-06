# QA de perfiles reales — 2026-10-06

## Resultado local

Equipo de once perfiles reales, con tres Estimators activos, funciones por perfil y espacios Trabajo/Ejemplos separados. Los tipos, tiempos de esfuerzo, reglas de takeoff y compromisos existentes conservan su comportamiento. Los perfiles siguen siendo locales y seleccionables: no hay autenticación ni datos compartidos entre dispositivos.

Compilación de producción correcta. Las 45 pruebas de dominio y los 64 escenarios de navegador pasaron después de las correcciones de revisión, incluidos 15 escenarios específicos de perfiles. La suite final completa tardó 2,3 minutos y no tuvo fallos.

## Cobertura

| Área | Verificación |
|---|---|
| Equipo real | Un Senior, tres Estimators, siete Account Managers; identidad e historial con nombres reales |
| Kevin | Creación, asignación, reasignación, reglas, capacidad, importación y borrado |
| Estimators | Los tres actualizan sus estados/horas/comentarios; asignación, tipo y fechas protegidos |
| Account Managers | Los siete ven sus solicitudes; consulta sin edición; respaldo propio |
| Alertas | Marcar revisada afecta solo al perfil actual |
| Trabajo/Ejemplos | Arranque vacío, datos separados, selección persistente, borradores protegidos |
| Migración | Solo ejemplos reconocibles sin edición cambian de responsables; registros editados, horas, fechas e historial conservados |
| Respaldos grandes | 50 responsables anteriores + 3 actuales importan y recargan; exceso rechazado antes de reemplazar datos |
| Texto importado | El Estimator guarda avance conservando espacios de code/project/client literalmente |
| Pestañas | Perfiles independientes con sincronización local del mismo espacio y conflictos protegidos |
| Sin conexión | Recarga, selección de perfil/espacio y edición del progreso en Trabajo |
| Reglas previas | Siete tipos, nueve tiempos, takeoff +1 día hábil, snapshots, fechas manuales y recálculo deliberado |

## Errores corregidos

- Estimators podían cambiar responsables y otros campos de asignación; ahora el formulario y el guardado permiten únicamente su avance, horas y comentarios.
- Revisar una alerta afectaba a todas las personas; la revisión se almacena por perfil.
- Las vistas de consulta podían mostrar el borrador de configuración de Kevin; ahora muestran valores guardados y Kevin conserva su borrador.
- La importación de 53 responsables anteriores podía producir 56 personas y volverse ilegible al recargar. La reconciliación valida el límite antes de reemplazar o persistir, sin truncar registros.
- El guardado de avance recortaba espacios de campos protegidos y rechazaba cotizaciones importadas válidas. Solo una edición autorizada de asignación normaliza esos campos.
- El estado vacío tenía texto de contraste insuficiente. Usa el token de texto secundario verificado.
- El formulario de Estimator requería desplazarse por numerosos campos de consulta antes de actualizar el avance. Los campos editables aparecen primero; los de asignación se consultan en un desplegable nativo.

## Revisión visual

Ocho capturas válidas y abiertas: escritorio 1440 px (Kevin, Equipo, Account Manager y Trabajo vacío), tablet 820 px (Equipo), teléfono 390 px (Trabajo vacío, formulario de Estimator y Account Manager). Dos rondas propias con correcciones agrupadas. La última comprobación registra cero errores de ejecución, cero desbordamientos del documento y cero violaciones WCAG automatizadas en las ocho superficies. Las comprobaciones automatizadas complementan la revisión visual y las pruebas de teclado; no certifican accesibilidad completa.

El detector de Impeccable se intentó una vez y no pudo ejecutarse porque su launcher no está instalado en este entorno de skills remotas. El revisor independiente recibió esta limitación, abrió las ocho capturas y no encontró defectos visuales materiales. Su revisión encontró los dos errores de importación anteriores. El veredicto posterior fue **ship**, puntuando ambas correcciones como **resolved** mediante inspección, pruebas de regresión y comprobaciones Node independientes. Este veredicto cubre las correcciones listadas al alcance de la revisión original. Se conserva el sistema visual establecido.

Evidencia local de esta sesión: `.impeccable/review/team-profiles/`, logs `/tmp/team-review-*`, `/tmp/team-profiles-build5.log`; scripts reproducibles de captura y comprobación pública en `.superpowers/sdd/team-profiles/`. Las pruebas de regresión y este informe sí forman parte del repositorio; capturas y logs son artefactos locales.

## Publicación

Destino autorizado: proyecto existente `quote-assistant-moi`, equipo `moi-83ef`, https://quote-assistant-moi.vercel.app. Contexto de proyecto confirmado mediante CLI y plan `hobby` reconfirmado mediante API de equipo. Compilación local estática, sin Functions, base de datos ni servicios de pago. La guía PDF/Markdown y el informe de ejemplo incorporan el equipo real; el video existente se conserva.

Publicado en el mismo enlace: despliegue **dpl_Egbyx9CgPq2ypwibxrFPaqRG1jCz**, estado **READY**, destino producción. Verificación pública iniciada el 6 de octubre a las 18:11:34 UTC: HTTP anónimo 200, bytes de index y service worker iguales al build probado, cinco adjuntos con cabeceras y tamaños correctos, PDF/Markdown/ejemplo PDF exactos y muestra de video válida. Guía PDF: 36.609 bytes; Markdown: 7.203 bytes; informe de ejemplo: 25.674 bytes.

La comprobación de navegador público pasó 16 recorridos, con cero errores de ejecución: once perfiles, alcance de los siete Account Managers, nueve tiempos, takeoff sin acumulación, snapshots y recálculo deliberado, CSV, borradores y guardado demorado, reglas de Kevin, recarga offline, móvil y teclado. En Trabajo comprobó arranque vacío, asignación de Kevin a Moisés/Andrés Gianneo, avance e historial sincronizados entre pestañas con perfiles independientes, consulta del Account Manager, persistencia y edición offline desde el teléfono. Las operaciones de prueba se realizan en contextos de navegador aislados; no modifican datos del usuario.

Evidencia: `.impeccable/review/team-profiles/production-http.json` y `production-verification.json`. HTTP usa TLS normal; el navegador de prueba acepta el certificado del proxy del entorno. La documentación independiente está en [handoff de diseño](team-profiles-design-handoff.md); conserva DESIGN.md y la sidecar sin cambios.
