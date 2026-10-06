# Handoff de diseño — perfiles reales

Fecha: 2026-10-06. Extensión ordinaria del dashboard existente, en modo **Operate**. La autoridad visual sigue siendo [DESIGN.md](../DESIGN.md) y [.impeccable/design.json](../.impeccable/design.json). El alcance y los límites funcionales proceden de [PRODUCT.md](../PRODUCT.md) y del [plan de perfiles](team-profiles-plan.md).

## Encaje con el sistema existente

La entrega incorpora el equipo real y recorridos locales por persona dentro del espacio de operaciones establecido. Conserva DM Sans, el fondo de papel claro, las superficies blancas, la navegación carbón, las acciones cobalto, las líneas finas y los estados escritos junto a sus colores. Los nuevos elementos reutilizan controles nativos y paneles existentes; la identidad no depende de imágenes ni de efectos ornamentales.

| Extensión | Encaje observado |
|---|---|
| Perfil y espacio | Selectores nativos con nombres reales y grupos por función, junto al contexto de fecha. En teléfono usan texto de 16 px y altura mínima de 44 px. |
| Capacidad actual | Tres lanes para Danilo, Moisés y Daniela en escritorio y tablet; una columna en teléfono. Mantienen horas, capacidad, porcentaje y estado textual, con separadores finos. |
| Directorio | Kevin y los siete Account Managers se presentan en filas planas dentro del panel habitual. Las iniciales oscuras sobre fondos suaves respetan la regla de legibilidad. |
| Trabajo vacío | Explica cómo registrar la primera cotización y ofrece la acción a Kevin. El texto secundario utiliza el token de contraste existente; Ejemplos permanece en otro espacio. |
| Avance de Estimator | El drawer conserva su forma y controles. Los datos de asignación quedan en un desplegable nativo de solo lectura, dejando accesibles estado, horas y comentarios. |
| Alcance por persona | Identidad visible, historial, exportaciones y alertas acompañan al perfil seleccionado. Los Account Managers consultan sus solicitudes sin controles de edición. |

Estas son adaptaciones a once personas y tres Estimators, no decisiones nuevas del sistema global. No se autorizó un cambio duradero de paleta, tipografía, material, navegación o lenguaje de componentes. Se preservaron los archivos del sistema sin regenerarlos.

## Equipo, reglas y límite del producto

El roster comprobado es Kevin Amaya como Senior; Danilo Heredia, Moisés Barón y Daniela Torres como Estimators; Nayib Farah, Carlos Obregón, Anthony Coronell, Andrés Gianneo, Andrés Franco, Carlos Sierra y Eduardo Jiménez como Account Managers.

Kevin crea y administra asignaciones, reglas y capacidad. Los Estimators guardan únicamente estado, horas y comentarios de sus cotizaciones; los campos de asignación y compromisos se protegen también al guardar. Cada Account Manager consulta y prepara mensajes sobre sus solicitudes. Los avisos revisados son propios del perfil. La reconciliación conserva responsables anteriores cuando siguen referenciados, sin incluirlos en nuevas asignaciones ni en la capacidad del equipo actual.

Se mantienen los siete tipos de cotización, los nueve tiempos de esfuerzo, el takeoff de un día hábil, los snapshots de reglas y las fechas, horas e historial guardados. La estimación de esfuerzo sigue siendo independiente del plazo de entrega. Los cambios deliberados de reglas no reescriben compromisos anteriores.

Los perfiles son seleccionables por pestaña y **no autentican ni verifican identidad**. Trabajo y Ejemplos guardan datos separados en este navegador; las pestañas del mismo espacio se sincronizan localmente. El requisito de acceso desde distintos dispositivos continúa sin confirmar y no existe intercambio de datos entre dispositivos. La app y la guía explican ese límite. El MVP sigue siendo estático y gratuito, sin backend ni servicios de pago; los mensajes al cliente son borradores copiables sin envío externo.

## Evidencia comprobada

Se leyeron PRODUCT.md, DESIGN.md, el sidecar, el plan, [la verificación funcional](team-profiles-verification.md) y la copia de límites de la guía. Se revisaron los cambios de App, ProfileControls, QuoteForm/QuoteDrawer, Quotes, SettingsView, Views, data, domain, team, upgradeTeam, useWorkspace y styles.

Se abrieron las ocho capturas existentes en `.impeccable/review/team-profiles/`; cada una muestra la superficie indicada por su nombre:

| Tamaño | Capturas |
|---|---|
| Escritorio, 1440 px | `desktop-kevin-demo.png`, `desktop-team.png`, `desktop-account.png`, `desktop-work-empty.png` |
| Tablet, 820 px | `tablet-team.png` |
| Teléfono, 390 px | `mobile-work-empty.png`, `mobile-estimator-form.png`, `mobile-account.png` |

`checks.json` registra ancho de documento igual al viewport, cero errores de ejecución y cero violaciones WCAG automatizadas en las ocho superficies. El formulario móvil es una captura válida del viewport del drawer; no pretende mostrar todo su contenido. Las capturas verifican composición y texto visible, y los controles automatizados no certifican accesibilidad completa.

La revisión independiente inicial (`independent-review.md`) encontró dos regresiones funcionales de importación. El veredicto final (`review-fix-verdict.md`) dio **disposition: ship** y puntuó ambas como resueltas: rechazar una reconciliación con más responsables anteriores de los admitidos antes de reemplazar datos, y conservar literalmente los campos protegidos con espacios al guardar avance de un Estimator. Ese veredicto se limita a las dos correcciones; no constituye una nueva auditoría del producto. No pidió cambios visuales adicionales.

Los logs locales observados después de las correcciones muestran 45/45 casos de dominio (`/tmp/team-review-domain-green.log`), 15/15 casos específicos de perfiles (`/tmp/team-review-browser-green.log`), compilación de producción correcta (`/tmp/team-profiles-build5.log`) y **64 casos aprobados** en la suite completa (`/tmp/team-review-full-e2e.log`). Los 15 casos de perfiles están incluidos en la suite completa. Este handoff no ejecutó pruebas nuevas, no tomó capturas ni verificó una publicación.

El intento único del detector de Impeccable consta como no ejecutable por ausencia del launcher en el entorno de skills remotas. La limitación fue comunicada al revisor; no se presenta como un detector aprobado. Las capturas y logs son evidencia local, no imágenes servidas por la aplicación.

## Desfase documental conservado

DESIGN.md y el sidecar conservan referencias históricas a las capturas de septiembre y a 18 pruebas de dominio, 13 escenarios de navegador y el refinamiento posterior de 26 escenarios. Esos registros preceden esta entrega y no describen su QA actual. También conservan la descripción general de vistas de demostración; PRODUCT.md, la guía y el selector actual precisan el funcionamiento con nombres reales y perfiles locales sin identidad verificada.

La descripción histórica de capacidad a cuatro o dos columnas en DESIGN.md no refleja la adaptación de este alcance a tres Estimators y una columna móvil. Se registra aquí como diferencia de composición local, sin convertirla en una regla nueva del sistema. Ningún desfase se reparó como efecto secundario de la extensión.

Los archivos de autoridad mantuvieron exactamente sus bytes durante este handoff. SHA-256 comprobados antes y después:

- `DESIGN.md`: `602942cb29dd0541f293239d10ed21d04a6e0dff10e3d025c36db70208bf0b3f`
- `.impeccable/design.json`: `4064b6267a2ff89d7ba0a031e8e770575ed360750f7966bde545e4f843baecaa`

Resultado: extensión documentada y compatible con el mundo Operate existente; las dos correcciones materiales tienen veredicto resuelto. La única escritura de este handoff es este documento.
