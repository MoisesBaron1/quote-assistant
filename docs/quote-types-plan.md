# Quote Assistant — tipos, plazos y tarjetas

Plan aprobado por el usuario el 3 de octubre de 2026.

1. Cinco tipos obligatorios al crear o reasignar; takeoff añade un día hábil en todos.
2. Senior Estimator configura plazos base de 1–365 días hábiles, inicialmente vacíos.
3. Lunes a viernes, sin festivos, desde el día siguiente a la asignación. Sin regla se exige fecha base manual hábil. Método y regla quedan guardados por cotización.
4. Cambios globales no modifican compromisos existentes. Recalcular es explícito; la fecha original es inmutable y el historial registra tipo, takeoff y fechas.
5. Tarjetas amplias con selector persistente Tarjetas/Tabla, mismos filtros, orden y paginación. Tres/dos/una columnas según espacio; filtros por tipo y takeoff.
6. Datos antiguos quedan Sin clasificar conservando fechas. Redistribución omite los no clasificados. JSON, CSV, offline y conflictos entre pestañas preservan los nuevos datos.
7. Pruebas de dominio y navegador, revisión independiente, guía actualizada y despliegue gratuito en el proyecto Vercel existente.

Interfaces: Quote añade quoteType, takeoff y deadline (método, fecha base, días base); Settings añade leadDays por tipo. Normalización aditiva conserva version=1 y la clave local histórica. El cálculo de plazos hábiles se separa de los días calendario usados para contar días restantes.

Revisión: buscar incrementos dobles, recálculos involuntarios, pérdida de datos antiguos o borradores, conflictos de reglas, permisos de rol simulados y desbordamiento/contraste de tarjetas.

Publicación: el usuario autorizó usar un enlace nuevo y gratuito en el equipo «moi», después de verificar que la cuenta conectada no tiene acceso al proyecto anterior de «moises-baron». Los enlaces anteriores se conservan; las cotizaciones se trasladan mediante respaldo JSON.
