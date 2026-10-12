# Quote Assistant — instrucciones para continuar

## Antes de cambiar código

Lee `README.md`, `PRODUCT.md`, `DESIGN.md` y `docs/continuar-en-claude.md`. Revisa `git status` y el historial. Este repositorio contiene la app operativa, sus pruebas, guías y el proyecto editable del video en `video/`.

La extracción del documento original y los planes iniciales están en `docs/superpowers/`, marcados como históricos. Conservan trazabilidad; no reemplazan los contratos actuales ni las ampliaciones autorizadas después.

Usa español para la interfaz y para comunicarte con el propietario. El producto se llama **Quote Assistant**. Las referencias internas a `epica` en almacenamiento/caché conservan compatibilidad; no las renombres por motivos de branding.

## Entorno reproducible

- Node.js **24** (`.nvmrc`), npm y `package-lock.json`.
- `npm ci`: instalación exacta. No se necesitan variables de entorno ni claves para ejecutar la app.
- `npm run dev`: Vite, puerto 5173. `npm run build`: TypeScript, Vite y caché offline en `dist/`.
- `npm test`: pruebas de dominio con TypeScript nativo de Node.
- `npx playwright install chromium` y `npm run test:e2e`: Playwright inicia los servidores de desarrollo y producción automáticamente.
- En Linux CI: `npx playwright install --with-deps chromium` instala también dependencias del sistema. Para Chromium existente, usa `QUOTE_ASSISTANT_BROWSER_PATH`.
- `bash scripts/setup-claude.sh --browser`: instala, prueba, compila y descarga el navegador. El script no instala Claude ni inicia sesión.
- `.github/workflows/ci.yml` comprueba lógica, compilación y navegador en pushes a `main` y pull requests; no despliega.

## Contratos de negocio que hay que conservar

1. Siete tipos: Cotización de adicional, Retail menor, Retail mayor, Proyecto menor, Proyecto mayor, Recotización proyecto y Recotización retail. Los registros antiguos pueden seguir Sin clasificar hasta su clasificación explícita.
2. **Esfuerzo y plazo son distintos.** Los estándares son minutos de trabajo; nunca convertirlos automáticamente en días de entrega.
3. Takeoff añade **exactamente un día hábil** a todos los tipos. Alternarlo o guardar repetidamente no acumula días.
4. Plazos base configurables por Kevin: vacíos o enteros de **1 a 365 días hábiles**. Lunes a viernes, sin festivos y sin contar el día de asignación. Un día asignado el viernes vence el lunes; con takeoff, el martes.
5. Si no existe regla, pedir fecha base manual hábil, antes del takeoff. El método manual también se puede elegir con regla configurada. Respaldos anteriores conservan sus fechas aunque sean fines de semana.
6. Cada cotización guarda `deadline` con método, fecha base y regla utilizada. Cambiar configuración no actualiza compromisos existentes. El recálculo requiere la acción explícita correspondiente.
7. `originalDueDate` permanece intacta. Reasignar conserva las fechas. Clasificación, takeoff, entrega, esfuerzo y avance tienen historial con el nombre del perfil activo.
8. Aplicar el estándar a una cotización existente actualiza la estimación y **conserva las horas pendientes**. No cambiar horas de registros existentes por migración ni por editar configuración.
9. Estándares iniciales: adicional **21 min**; proyecto mayor con/sin takeoff **4 h / 6 h**; proyecto menor **3 h 30 / 4 h 30**; recotización proyecto **2 h**; recotización retail **1 h**; retail mayor **3 h**; retail menor **2 h**. Kevin puede configurarlos.
10. Lista para enviar y Entregada son terminales y no se marcan retrasadas. Los contadores de días naturales y la zona horaria configurable son distintos del cálculo de plazos hábiles. La zona inicial es UTC.

## Personas y funciones

- **Senior:** Kevin Amaya. Crea, asigna, reasigna, elimina; configura plazos, tiempos y capacidad; importa respaldos y revisa redistribución.
- **Estimators:** Danilo Heredia, Moisés Barón, Daniela Torres. Solo actualizan estado, estimación, horas pendientes y comentarios de sus propias cotizaciones. No modifican asignación, tipo, takeoff, fechas ni otros campos protegidos.
- **Account Managers:** Nayib Farah, Carlos Obregón, Anthony Coronell, Andrés Gianneo, Andrés Franco, Carlos Sierra, Eduardo Jiménez. Consultan sus solicitudes, reportes y borradores de mensajes, sin editar cotizaciones.
- Capacidad inicial: 40 h/semana por Estimator activo, configurable. Responsables anteriores referenciados quedan archivados; no participan en nuevas asignaciones ni redistribución.

`src/team.ts` define personas y controles; `canViewQuote`/`canSaveQuote` deben aplicarse además de las restricciones de formulario. Esos controles pertenecen a un MVP **local sin autenticación**, no son autorización de servidor.

## Persistencia y límites reales

- Trabajo empieza vacío; Ejemplos tiene proyectos ficticios separados.
- Claves: Trabajo `quote-assistant-workspace-v1`; Ejemplos/compatibilidad `epica-workspace-v1`. Perfil `quote-assistant-profile-v1` y espacio `quote-assistant-space-v1` se guardan en `sessionStorage` por pestaña.
- `src/useWorkspace.ts` centraliza guardado, recuperación, revisión de versión y sincronización entre pestañas del mismo navegador/origen/espacio. Mantén protección de conflictos, borradores y errores de almacenamiento.
- No hay backend, contraseñas ni sincronización entre dispositivos. No presentes selección de perfil como inicio de sesión verificado.
- `src/upgradeTeam.ts` conserva cotizaciones editadas y migración idempotente. No truncar registros. Máximo normalizado: tres actuales + 50 responsables anteriores; rechazar un respaldo que lo exceda antes de reemplazar datos.
- Exportaciones y alertas respetan el perfil; los Account Managers no pueden importar. Las revisiones de alertas son personales.
- Mensajes se preparan/copían; no se envían. Riesgo y redistribución son heurísticas revisables.

## Mapa de código

| Archivo | Responsabilidad |
|---|---|
| `src/domain.ts` | Tipos, fechas, esfuerzo, filtros, riesgo, capacidad, CSV, validación de respaldos |
| `src/data.ts`, `src/newQuote.ts` | Configuración inicial, ejemplos, espacio vacío y nueva cotización |
| `src/team.ts`, `src/upgradeTeam.ts` | Perfiles, permisos de flujo y migración conservadora |
| `src/useWorkspace.ts` | Persistencia local, recuperación y coordinación entre pestañas |
| `src/App.tsx`, `src/ProfileControls.tsx` | Navegación, perfil/espacio, acciones, alcance y guardados |
| `src/QuoteForm.tsx`, `src/QuoteDrawer.tsx` | Asignación, avance, detalles, historial y recálculo |
| `src/Quotes.tsx`, `src/Views.tsx`, `src/SettingsView.tsx` | Tarjetas/tabla, equipo, calendario, alertas, reportes y configuración |
| `src/styles.css`, `DESIGN.md` | Sistema visual existente, móvil, impresión y movimiento reducido |
| `scripts/build-offline.mjs` | Service worker generado y caché estática versionada |
| `scripts/prepare-downloads.mjs`, `public/descargas/` | Página y materiales descargables |
| `tests/`, `e2e/` | Regresiones de negocio, roles, importación, offline y accesibilidad |
| `video/` | Composición HyperFrames, guion, audio, capturas, subtítulos y scripts |

## Método de trabajo

Conserva el diseño establecido y las tarjetas/tabla con filtros, orden, paginación y preferencia persistida. Cambios visibles deben revisarse en escritorio y teléfono, con teclado y sin desbordamientos.

Reproduce errores antes de corregirlos; añade regresiones para cambios de comportamiento. Ejecuta las pruebas afectadas y una compilación. Para cambios de persistencia, roles, plazos, UI compartida o herramientas de pruebas, ejecuta también la suite completa de navegador. Informa los comandos y resultados reales; no conviertas los informes históricos en evidencia de una nueva ejecución.

Mantén el MVP en servicios gratuitos y no actives planes de pago. No agregues dependencias o un backend por defecto. La siguiente etapa posible es identidad y almacenamiento compartido, pero requiere un alcance nuevo; todavía no está implementada.

No publiques credenciales, `.env*`, `node_modules`, `.vercel`, registros locales, respaldos reales ni carpetas de modelos. No borres almacenamiento del usuario para solucionar un bug. Los materiales con licencias incluidas en `video/licenses` y `assets/gsap.min.js` conservan sus avisos.

## Publicación y continuidad

App actual: https://quote-assistant-moi.vercel.app, proyecto Vercel `quote-assistant-moi`, equipo `moi` / scope CLI `moi-83ef`, Hobby. Repo: https://github.com/MoisesBaron1/quote-assistant. `main` contiene la entrega actual y el historial anterior se conserva.

`vercel.json` define el build estático y cabeceras de descarga. El MP4 ya está incluido en `public/descargas`; un clon normal conserva las cinco descargas sin LFS ni activos externos. No cambies el dominio/origen sin prever la migración por JSON de localStorage. `docs/continuar-en-claude.md` explica acceso, verificación y despliegue manual con tu propia cuenta; no hay despliegue automático de GitHub a Vercel configurado por este traspaso.
