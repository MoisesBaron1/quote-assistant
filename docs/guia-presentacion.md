# Quote Assistant — guía de presentación (aprox. 5 minutos)

Abre https://quote-assistant-moi.vercel.app en el navegador y equipo que usarás para presentar. Déjala cargar con internet hasta que el pie de página indique **Disponible sin conexión**. Los datos se conservan en ese navegador; puedes descargar un respaldo JSON desde Configuración. La app y el subdominio están en el plan Hobby gratuito, con sus límites y condiciones.

Pulsa el icono de presentación en la barra superior para abrir **Guía de presentación**. El recorrido no modifica las cotizaciones.

Si ya habías editado cotizaciones en https://quote-assistant-moises.vercel.app o https://epica-dashboard-two.vercel.app, descarga el respaldo JSON desde Configuración allí e impórtalo en la nueva dirección. Cada dominio guarda sus datos por separado; esta actualización se publica en el nuevo enlace.

1. **Resumen (45 s).** Muestra los seis indicadores y la carga del equipo. Pulsa Retrasadas para abrir sus cotizaciones filtradas; limpia el filtro antes de continuar.
2. **Cotizaciones (60 s).** Muestra las tarjetas amplias y cambia a Tabla con el selector. Filtra por tipo o takeoff. Abre una cotización y enseña su tipo, responsable, fecha base, entrega final y compromiso original. Edita un comentario y guarda; entra a Historial para mostrar el registro. Los borradores piden confirmación antes de descartarlos.
3. **Equipo (60 s).** Usa Equilibrar carga. Enseña la propuesta y el cambio de carga estimado. Puedes cancelar o aplicar; aplicar registra las reasignaciones. Es una heurística basada en horas/capacidad, requiere criterio del equipo.
4. **Calendario (30 s).** Muestra las entregas por día, cambia de semana y vuelve a Hoy.
5. **Alertas (45 s).** Abre una alerta y muestra la explicación del riesgo. Prepara un mensaje, revísalo y cópialo. La demo no envía comunicaciones.
6. **Resumen ejecutivo (40 s).** Cierra con la distribución del trabajo y las prioridades. Usa Imprimir / PDF o exporta CSV. Adjuntamos un PDF de ejemplo con datos ficticios.

**Tipos y plazos.** Al crear o reasignar una cotización, selecciona Cotización de adicional, Retail menor, Retail mayor, Proyecto menor o Proyecto mayor. La opción Incluye takeoff añade exactamente un día hábil en los cinco tipos. En Configuración, el Senior Estimator puede establecer un plazo base de 1 a 365 días hábiles por tipo; todos empiezan vacíos. Se cuenta desde después de la asignación, de lunes a viernes y sin excluir festivos. Si no hay regla, introduce una fecha base manual de lunes a viernes, sin añadir todavía el takeoff. La vista previa muestra la entrega final. Una asignación de un día realizada el viernes vence el lunes; con takeoff, el martes.

**Compromisos existentes.** Cambiar una regla no modifica fechas guardadas. Para aplicar el plazo vigente a una cotización, edítala y pulsa Recalcular con la regla vigente; revisa la vista previa y guarda. La fecha original se conserva. Las cotizaciones antiguas quedan Sin clasificar, sin cambiar sus fechas. Puedes editarlas; para reasignarlas debes elegir el tipo. La redistribución automática las omite hasta que estén clasificadas. El contador de días restantes y los avisos conservan días calendario.

Si quieres recuperar los ejemplos, ve a Configuración → Restaurar datos de ejemplo y confirma. Primero descarga un respaldo si has hecho cambios que quieres conservar. La restauración recalcula las fechas de los ejemplos según el día actual.

Si se corta internet después de la primera carga completa, puedes recargar y continuar la demo. Si el navegador no admite o no completa el almacenamiento offline, conserva la pestaña abierta y utiliza el PDF como respaldo. Para datos locales dañados hay descarga del archivo original y restauración/importación confirmada.

Aclara al presentar: proyectos/personas son ejemplos, roles son vistas simuladas y los cambios se guardan en el navegador. La siguiente etapa para operación compartida es conectar datos reales, identidad y permisos; esas capacidades no forman parte de esta demo.
