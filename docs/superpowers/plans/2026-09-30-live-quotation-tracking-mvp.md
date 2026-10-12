> Documento histórico del 30 de septiembre de 2026. Describe el análisis o el plan de esa fecha; las instrucciones actuales, ampliaciones autorizadas y límites están en `CLAUDE.md`, `PRODUCT.md` y los informes posteriores. No sustituye el estado implementado.

# Live Quotation Tracking Dashboard: plan de implementación del MVP

> **Para una futura ejecución por agentes:** usar `superpowers:executing-plans` para ejecutar por tareas. Este documento propone trabajo; no autoriza ni inicia implementación.

**Objetivo:** ofrecer a Estimators, Account Managers y Senior Estimator una vista única y actualizada de cotizaciones, fechas, estados y carga por integrante.

**Arquitectura propuesta:** una fuente autoritativa de cotizaciones, acceso a datos con contratos estables, cálculo centralizado de reglas e indicadores y una interfaz de dashboard. Una sola ruta de mantenimiento de los datos. Consulta periódica configurable si cumple la latencia acordada; eventos si el requisito de actualización lo exige.

**Stack:** la épica no establece tecnologías y no se ha proporcionado una aplicación existente para inspeccionar. La selección debe hacerse en T0 según el origen, la infraestructura disponible y los estándares del equipo; el plan no inventa archivos de producto ni interfaces de un repositorio inexistente.

**Especificación de referencia:** [Extracción de la épica y decisiones pendientes](../specs/2026-09-30-live-quotation-tracking-requirements.md). Es una propuesta, no una especificación aprobada.

## Restricciones globales

- «Todas las cotizaciones asignadas al equipo puedan visualizarse en un único dashboard.»
- «Cada cotización tenga un Estimator y Account Manager identificados.»
- «Cada solicitud tenga una fecha de entrega definida.»
- «El sistema determine automáticamente si una cotización está A tiempo, Retrasada o Postergada.»
- Soportar los diez campos, siete filtros y seis indicadores enumerados en la especificación.
- «La información se actualice de manera que represente el estado actual de las solicitudes.»
- Esta entrega contiene documentación; no crear software, instalar dependencias ni desplegar.

## Casos de revisión prioritarios

1. Cambio de fecha seguido de vencimiento: mantener detectable tanto el retraso como la modificación del compromiso.
2. Cruce del día de negocio sin edición de datos: recalcular días y vencimiento en la zona horaria acordada.
3. Cotización completada o entregada: aplicar las reglas acordadas sin contarla como una solicitud abierta retrasada.
4. Fechas/responsables incompletos y registros duplicados del origen: detectar incidencias, evitar dobles conteos y no presentar como A tiempo un registro indeterminado.
5. Fallo de actualización: conservar una señal clara de la antigüedad de la información y no confundir Last Update con la última sincronización.

## Descomposición propuesta

La estructura del futuro producto tendrá cinco responsabilidades: acceso y normalización del origen; reglas de fechas y estados; consulta y agregación de indicadores; tabla, filtros y resumen por Estimator; actualización y acceso por rol. Los archivos concretos se decidirán en T0, después de identificar el sistema existente y su stack. No se justifica dividir el MVP en microservicios.

### T0. Cerrar reglas, fuente y contrato de datos

**Produce:** ficha de decisiones D-01 a D-09, contrato de los diez campos más los datos derivados necesarios, matriz de permisos, ejemplos de cálculo consistentes y selección de stack. No requiere programación.

- [ ] Identificar el sistema fuente, dueño de los datos, integrantes del equipo y volumen; comprobar que se puede obtener la fecha original y reconocer completadas/entregadas.
- [ ] Definir Status, coexistencia de retraso/postergación, comportamiento de solicitudes completadas, cambios de fecha y universo de cada indicador.
- [ ] Fijar calendario, zona horaria, corte de vencimiento y latencia de actualización. Evaluar la propuesta de días naturales y refresco cada 60 segundos.
- [ ] Precisar filtros de Estado y Fecha de entrega, efecto de filtros en indicadores y permisos de consulta/edición. Decidir si criticidad y alta carga se evaluarán manualmente en este MVP.
- [ ] Preparar una tabla de casos con fecha de referencia única, incluyendo vencimiento hoy, ayer, futuro, postergación, postergada vencida y completada/entregada. Cada fila debe tener resultados esperados de días, estado y conteos.

**Verificación:** todas las decisiones que afectan el cálculo y la actualización tienen una respuesta explícita; ninguna prueba toma el ejemplo inconsistente del documento como fórmula.

### T1. Obtener y normalizar las cotizaciones del equipo

**Consume:** origen y contrato definidos en T0.\
**Produce:** conjunto único de cotizaciones con identificador estable, campos visibles, fecha original preservada y señales de finalización/entrega.

- [ ] Implementar una conexión con la fuente existente; si T0 eligió un registro propio, incluir aquí almacenamiento y captura mínima con validación. Aplicar las rutas de mantenimiento y permisos acordados.
- [ ] Mapear responsables, fechas, estados y comentarios al contrato; conservar identidad y compromiso original entre actualizaciones.
- [ ] Verificar contra una muestra controlada del origen: ninguna cotización del universo del equipo omitida, cada identificador aparece una sola vez y no se reemplaza la fecha original al modificar la vigente.
- [ ] Probar registros sin responsables/fechas y duplicados: registrar y hacer visibles las incidencias para corregirlas, sin inventar valores ni producir clasificaciones fiables donde faltan datos.

**Cubre:** RF-01, RF-02 y base de RF-03; CA-01, CA-02, CA-03.

### T2. Calcular días, estado de entrega e indicadores

**Consume:** cotizaciones normalizadas y reglas de T0.\
**Produce:** Days Remaining, Delivery Status, condiciones de retraso/postergación y los seis indicadores sobre un universo definido.

- [ ] Implementar un cálculo central de fechas, finalización y cambios de compromiso; calcular el estado de entrega automáticamente.
- [ ] Agregar total asignadas, a tiempo, retrasadas, postergadas, entregadas y cantidad por Estimator. Aplicar la definición acordada de carga y de filtros.
- [ ] Verificar todos los casos de T0 con una fecha de referencia controlada; incluir el cruce de medianoche de negocio sin modificación de la solicitud.
- [ ] Probar postergada vencida y completada/entregada; comprobar la prioridad visual acordada y los solapamientos de conteos previstos.

**Cubre:** RF-04, RF-05, RF-07 y cálculo para RF-09; CA-04 y base de CA-07.

### T3. Construir la vista única, filtros y carga por Estimator

**Consume:** contrato de datos, cálculos e indicadores de T1/T2.\
**Produce:** dashboard consultable con tabla/detalle, filtros y resumen individual y consolidado.

- [ ] Mostrar los diez campos de la épica mediante tabla y detalle, con días y estado de entrega comprensibles. Incluir el resumen de seis indicadores y carga por Estimator.
- [ ] Implementar los siete filtros: Estimator, Account Manager, Estado, Fecha de entrega, Proyecto / Quote, Retrasadas y Postergadas. Para el MVP se propone que sean combinables y se puedan limpiar.
- [ ] Verificar cada filtro y una combinación representativa; comprobar que tabla e indicadores usan el universo acordado. Si hay paginación, los totales deben abarcar todas las coincidencias, no solo la página visible.
- [ ] Verificar una consulta del Senior Estimator para localizar personas con más cotizaciones y solicitudes próximas a vencer o retrasadas.

**Cubre:** RF-01, RF-02, RF-06, RF-07, RF-09; CA-01, CA-05, CA-07.

### T4. Mantener la vista actualizada y aplicar el acceso acordado

**Consume:** mecanismo de actualización, latencia y matriz de acceso de T0.\
**Produce:** consulta utilizable por los tres roles, cambios visibles dentro de la latencia acordada e indicación de frescura.

- [ ] Integrar los accesos del entorno y permitir que el Account Manager consulte sus solicitudes; aplicar los límites de visibilidad acordados, sin inferir que todos o ninguno deben ver solicitudes ajenas.
- [ ] Actualizar la vista mediante el mecanismo seleccionado y recalcular reglas cuando cambia el día de negocio aunque el origen no haya recibido ediciones.
- [ ] Mostrar Last Update por cotización y, por separado, el momento de la última sincronización. Proporcionar un estado claro cuando la actualización falla.
- [ ] Modificar Status y Due Date mediante la ruta autorizada y comprobar que tabla, días, entrega e indicadores reflejan el cambio dentro de la latencia acordada.
- [ ] Probar un fallo del origen: la vista debe identificar que sus datos conservados no están actualizados y recuperar la actualización cuando el origen vuelva a estar disponible.

**Cubre:** RF-03, RF-08; CA-06, CA-08.

### T5. Verificar aceptación y realizar un piloto

**Consume:** dashboard y conjuntos de prueba de T0–T4.\
**Produce:** evidencia de los ocho criterios y de todos los requisitos explícitos; resultados de un piloto con representantes de los tres roles.

- [ ] Ejecutar CA-01 a CA-08 y verificar además los diez campos, siete filtros, seis indicadores y cálculo de días. Reconciliar datos e indicadores con el origen.
- [ ] Probar una secuencia completa: asignar una cotización, consultar como Account Manager, cambiar fecha, observar postergación, cruzar vencimiento, completar/entregar y comprobar carga e indicadores conforme a T0.
- [ ] Incluir datos incompletos, duplicados, fallo de actualización y cambio de día; corregir defectos antes del piloto.
- [ ] Validar con Estimator, Account Manager y Senior Estimator que pueden responder quién atiende una solicitud, cuándo vence, en qué estado está y cómo se distribuye la carga.
- [ ] Preparar guía breve de uso y responsabilidad de actualización; habilitar el MVP en el entorno acordado tras superar la aceptación.

**Cubre:** RF-01 a RF-09; CA-01 a CA-08.

## Orden, exclusiones y definición de terminado

**Orden:** T0 → T1 → T2 → T3 → T4 → T5. La fuente, las reglas de entrega y la latencia son las principales dependencias; no se propone un plazo calendario sin conocerlas.

El MVP conserva todos los filtros e indicadores pedidos. No incorpora avisos automáticos, comunicación con clientes, predicciones, redistribución automática, ponderación por horas ni integración con varias fuentes. Los requisitos explícitos no se trasladan a una fase posterior.

**Terminado:** ocho criterios de aceptación superados, todos los campos/filtros/indicadores presentes, cálculos y actualización validados con casos consistentes, datos reconciliados y consulta útil para los tres roles en el piloto. Los beneficios de reducción de consultas y mejora del seguimiento se evaluarán con una línea base que la épica no proporciona.
