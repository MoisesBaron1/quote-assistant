> Documento histórico del 30 de septiembre de 2026. Describe el análisis o el plan de esa fecha; las instrucciones actuales, ampliaciones autorizadas y límites están en `CLAUDE.md`, `PRODUCT.md` y los informes posteriores. No sustituye el estado implementado.

# Live Quotation Tracking Dashboard: extracción de la épica

**Fuente:** `1-Epica_Live_Quotation_Tracking_Dashboard.docx`, adjunto del usuario. Lectura completa del texto y de las tres tablas: estados de entrega, campos requeridos y ejemplo de visualización. No contiene imágenes ni anexos incrustados.

**Iniciativa:** Live Quotation Tracking – Estimator Team.\
**Rol solicitante:** Senior Estimator.\
**Estado de esta entrega:** análisis y propuesta de MVP; no se ha implementado software ni aprobado una especificación técnica.

## 1. Objetivo, usuarios y beneficios

Centralizar las cotizaciones asignadas al equipo de Estimators y mostrar su estado actual respecto de la fecha comprometida de entrega. Los Estimators, Account Managers y el Senior Estimator necesitan consultar el mismo estado de las solicitudes.

La épica busca reducir consultas manuales, mejorar la visibilidad de la carga de trabajo, detectar retrasos anticipadamente, facilitar la priorización y el seguimiento de fechas, mejorar la comunicación y apoyar las decisiones de distribución de trabajo. No establece metas numéricas para estos beneficios.

## 2. Requerimientos funcionales explícitos

| ID | Requerimiento | Referencia en la épica |
|---|---|---|
| RF-01 | Consolidar todas las cotizaciones asignadas al equipo en un único dashboard. | Solución propuesta; Vista general del equipo |
| RF-02 | Mostrar Quote / Project, Account Manager, Estimator, Date Assigned, Due Date, Status, Delivery Status, Days Remaining, Last Update y Comments. Identificar responsables y fecha de entrega por solicitud. | Campos requeridos; Criterios de aceptación |
| RF-03 | Reflejar las actualizaciones del estado de cada cotización y mantener información que represente la situación actual. | Seguimiento en tiempo real; Criterios de aceptación |
| RF-04 | Calcular automáticamente los días restantes para la entrega. | Seguimiento en tiempo real |
| RF-05 | Determinar automáticamente el estado de entrega: A tiempo, Retrasada o Postergada; identificar cotizaciones retrasadas. | Seguimiento en tiempo real; Estados de entrega |
| RF-06 | Filtrar por Estimator, Account Manager, Estado, Fecha de entrega, Proyecto / Quote, Cotizaciones retrasadas y Cotizaciones postergadas. | Filtros |
| RF-07 | Mostrar total de cotizaciones asignadas, a tiempo, retrasadas, postergadas, entregadas y cantidad por Estimator. | Indicadores principales |
| RF-08 | Permitir que los Account Managers consulten el estado de sus solicitudes sin contactar al Estimator. | Visibilidad para Account Managers |
| RF-09 | Permitir al Senior Estimator ver carga individual y consolidada, detectar posibles retrasos, identificar alta carga y seguir solicitudes críticas para apoyar la redistribución y priorización. | Gestión del Senior Estimator |

RF-09 no define una operación para reasignar cotizaciones dentro del dashboard, ni una fórmula de capacidad, ni umbrales de alta carga o criticidad. La redistribución figura como una decisión que la visibilidad debe facilitar.

## 3. Criterios de aceptación originales

Estos ocho criterios se transcriben sin añadir umbrales ni permisos no especificados:

| ID | Criterio de aceptación |
|---|---|
| CA-01 | Todas las cotizaciones asignadas al equipo puedan visualizarse en un único dashboard. |
| CA-02 | Cada cotización tenga un Estimator y Account Manager identificados. |
| CA-03 | Cada solicitud tenga una fecha de entrega definida. |
| CA-04 | El sistema determine automáticamente si una cotización está A tiempo, Retrasada o Postergada. |
| CA-05 | Los usuarios puedan filtrar la información. |
| CA-06 | Los Account Managers puedan consultar el estado de sus solicitudes. |
| CA-07 | El Senior Estimator pueda visualizar la carga de trabajo individual y consolidada del equipo. |
| CA-08 | La información se actualice de manera que represente el estado actual de las solicitudes. |

Los campos, filtros, indicadores y cálculo de días son requisitos explícitos aunque no todos estén repetidos individualmente en estos ocho criterios.

## 4. Datos requeridos

### Campos explícitos

| Campo | Definición de la épica | Observación para implementación |
|---|---|---|
| Quote / Project | Nombre o número de la cotización. | No se garantiza que un nombre sea único. |
| Account Manager | Account Manager responsable. | Debe estar identificado por cotización. |
| Estimator | Estimator asignado. | Debe estar identificado por cotización. |
| Date Assigned | Fecha en que fue asignada. | Precisar si es fecha o fecha y hora en el sistema fuente. |
| Due Date | Fecha comprometida de entrega. | Debe existir para cada solicitud; se necesita saber si representa la fecha vigente. |
| Status | Estado actual de la cotización. | Catálogo del flujo de trabajo no definido. |
| Delivery Status | A tiempo / Retrasada / Postergada. | Campo calculado; no equivale a Status. |
| Days Remaining | Días restantes para la entrega. | Campo calculado; el ejemplo admite valores negativos. |
| Last Update | Última actualización realizada. | Precisar el evento que actualiza este valor. |
| Comments | Comentarios o información relevante. | Se requiere el campo; no se establece que siempre deba tener contenido. |

### Datos o configuración necesarios por inferencia

| Dato | Motivo | Clasificación |
|---|---|---|
| Identificador estable de cotización | Evitar duplicados y relacionar actualizaciones de una misma solicitud. | Necesario para una integración fiable; no especificado como campo visible. |
| Fecha de entrega original y fecha vigente | Comparar contra el compromiso original para detectar Postergada. La original no debe sustituirse en cada cambio. | Necesidad derivada de la definición de Postergada. |
| Señal de completada y señal de entregada, mediante estados o eventos | Retrasada excluye las completadas; el indicador de entregadas necesita reconocer las entregadas. | Necesidad derivada; su equivalencia no está definida. |
| Catálogo de integrantes del equipo y responsables | Delimitar qué cotizaciones se incluyen y agrupar por persona de forma consistente. | Necesidad derivada. |
| Zona horaria, calendario y regla de vencimiento | Calcular días y decidir cuándo pasa una solicitud a retrasada. | Configuración pendiente de negocio. |
| Momento de la última consulta o sincronización | Distinguir la frescura del dashboard de Last Update por cotización. | Propuesta del MVP. |

Un historial completo de cambios y las fechas reales de finalización/entrega son útiles para auditoría y puntualidad histórica, pero no son exigencias explícitas de esta épica. No son necesarios para el MVP si el origen proporciona la fecha original y señales fiables de completada/entregada, y no se calculan métricas históricas.

## 5. Reglas de entrega y restricciones

La tabla del documento define literalmente:

- **A tiempo:** «La cotización se encuentra dentro del plazo establecido para su entrega.»
- **Retrasada:** «La fecha de entrega ya pasó y la cotización aún no ha sido completada.»
- **Postergada:** «La fecha de entrega fue modificada respecto a la fecha originalmente establecida.»

El dashboard debe abarcar las cotizaciones asignadas al equipo, identificar responsables y fechas, calcular automáticamente el estado de entrega y los días, consolidar la carga y representar información actual. Estas son restricciones funcionales del resultado.

La épica no fija plataforma, lenguaje, base de datos, infraestructura, proveedor, sistema origen, volumen, presupuesto, plazo, frecuencia de actualización, SLA, días hábiles/naturales, zona horaria, esquema de autenticación, permisos de edición ni reglas de privacidad entre Account Managers. Esas decisiones no deben presentarse como requisitos extraídos.

La visibilidad que requieren los roles está definida; los límites de acceso y quién puede modificar los datos no lo están. Que un Account Manager pueda ver sus solicitudes no establece que solo pueda ver las suyas.

## 6. Ambigüedades y decisiones pendientes

| ID | Decisión | Consecuencia |
|---|---|---|
| D-01 | Elegir la fuente única, el mecanismo de actualización y quién mantiene cada dato. | Sin actualización fiable del origen, una pantalla que se refresca no asegura información actual. |
| D-02 | Definir el catálogo de Status y si completada y entregada representan el mismo evento. | Afecta la detección de retrasos y el contador de entregadas. |
| D-03 | Resolver el caso de una solicitud postergada que también está vencida y cómo mostrar las completadas. | Las tres etiquetas no son mutuamente excluyentes por sus definiciones. |
| D-04 | Precisar si Postergada incluye cualquier modificación, adelantos, cambios sucesivos y regreso a la fecha original. | La definición habla de fecha modificada; no exige que la nueva fecha sea posterior. |
| D-05 | Elegir días naturales o hábiles, zona horaria, hora de corte y tratamiento del día de vencimiento. | Determina Days Remaining y el paso automático a Retrasada. |
| D-06 | Acordar la latencia admitida para «en vivo» y «estado actual». | Determina si basta una consulta periódica o se requieren eventos. |
| D-07 | Definir universo y período de los indicadores; decidir cómo afectan los filtros y si los conteos se solapan. | Evita que tabla, indicadores y carga individual describan universos distintos. |
| D-08 | Establecer permisos de consulta y edición por rol. | El documento solo garantiza visibilidad, no reglas completas de autorización. |
| D-09 | Precisar si alta carga y criticidad requieren reglas automáticas o evaluación del Senior Estimator. | El MVP puede apoyar esta evaluación con conteos y fechas; una alerta automática necesitaría umbrales. |

El ejemplo de visualización no es una especificación válida del cálculo de días: Sep 30 con 1 día restante, Sep 29 con -1 y Oct 02 con 2 no corresponden a una misma fecha de referencia usando una diferencia simple de días naturales. Además, no indica año ni fecha de corte. Deben prepararse ejemplos consistentes antes de probar la regla.

## 7. Propuesta de alcance del MVP

Mantener todos los requisitos explícitos: un dashboard para el equipo, los diez campos, siete filtros, seis indicadores, cálculo automático de días y entrega, consulta por los tres roles y actualización de datos. La carga se representa inicialmente por cantidad de cotizaciones, que es la medida explícita de la épica; no se infieren horas ni complejidad de las cotizaciones.

Propuesta de arquitectura: una fuente única, un componente de acceso a datos, un cálculo central de reglas e indicadores y una interfaz con tabla y resumen por Estimator. Conectar la fuente existente si permite obtener y actualizar los datos necesarios. Si no existe un origen utilizable, elegir un registro compartido con captura y edición mínima antes de implementar; no mantener ambos como fuentes autoritativas.

Para una latencia compatible con consulta periódica, proponer un refresco configurable de 60 segundos y mostrar la última sincronización. Ese valor es una propuesta, no un criterio original. Preferir eventos si la latencia acordada lo exige y el origen los admite.

Propuesta de calendario inicial: días naturales en una zona horaria de negocio acordada; cero días significa que vence hoy y negativo que la fecha ya pasó. No adoptar la zona horaria de la máquina como regla de negocio.

Propuesta de resolución de estados para solicitudes abiertas: conservar las condiciones independientes de vencida y fecha modificada; usar prioridad visual Retrasada, luego Postergada, luego A tiempo, manteniendo visible que hubo cambio de fecha. Los filtros y conteos de retrasadas/postergadas pueden solaparse. Esta propuesta requiere una definición de negocio antes de implementarse. Acordar por separado el comportamiento de completadas/entregadas y el universo del indicador A tiempo.

No añadir al MVP envío automático de avisos, comunicación con clientes, redistribución automática, planificación por horas, predicción de retrasos, múltiples fuentes ni un módulo de auditoría histórica. No se solicitan en la épica. La necesidad de una reasignación manual dentro del dashboard debe confirmarse antes de incorporarla al alcance.

## 8. Trazabilidad hacia el plan

| Requisitos / criterios | Tareas del plan |
|---|---|
| RF-01, RF-02; CA-01, CA-02, CA-03 | T1, T3, T5 |
| RF-04, RF-05; CA-04 | T0, T2, T5 |
| RF-06; CA-05 | T3, T5 |
| RF-07, RF-09; CA-07 | T0, T2, T3, T5 |
| RF-08; CA-06 | T0, T4, T5 |
| RF-03; CA-08 | T1, T4, T5 |

**Plan asociado:** [Plan del MVP](../plans/2026-09-30-live-quotation-tracking-mvp.md).
