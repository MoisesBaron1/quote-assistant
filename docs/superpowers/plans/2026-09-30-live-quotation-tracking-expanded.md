> Documento histórico del 30 de septiembre de 2026. Describe el análisis o el plan de esa fecha; las instrucciones actuales, ampliaciones autorizadas y límites están en `CLAUDE.md`, `PRODUCT.md` y los informes posteriores. No sustituye el estado implementado.

# Plan ampliado ejecutado — Epica MVP

La instrucción posterior del usuario autoriza implementar mejoras y desplegar en Vercel. Sustituye la restricción inicial de no programar. Fuente: DOCX íntegro y análisis de requerimientos del 30 de septiembre.

1. **Reglas y datos.** Implementar funciones puras (`src/domain.ts`) para fechas naturales en zona de negocio, estados terminales, retrasos/postergaciones superpuestos, filtros, indicadores, validación, carga/riesgo/rebalance, CSV y respaldo. Comprobar mediante tests de dominio (`tests/domain.test.ts`). Datos sintéticos explícitos (`src/data.ts`), sin inventar integración real.
2. **Persistencia.** Almacenamiento en navegador (`src/useWorkspace.ts`), restauración validada, sincronización entre pestañas, manejo de errores. Serializar mutaciones y bloquear versiones antiguas; conservar cambios en memoria si no se pueden guardar.
3. **Interfaz.** Resumen, tabla y detalle, formulario, historial y mensajes (`src/Quotes.tsx`); calendario, equipo, alertas, actividad, reglas e informe ejecutivo (`src/Views.tsx`). Orquestación, importación/exportación y vistas demo (`src/App.tsx`). Layout adaptable, teclado, fechas y estilos (`src/components.tsx`, `src/styles.css`).
4. **Mejoras autorizadas.** Edición/creación/borrado, capacidad y propuesta de redistribución, riesgo explicable, alertas, actividad, respaldo JSON, CSV, informe imprimible y mensaje copiable. Aclarar límites de las heurísticas y roles simulados.
5. **Verificación.** Build de producción, tests de dominio, Playwright para flujos de usuario y escenarios entre pestañas; axe en resumen, detalle/historial, configuración e informe. Revisar capturas desktop/mobile mediante revisión independiente y corregir hallazgos materiales en una sola ronda.
6. **Entrega.** Documentar uso y límites en README/PRODUCT/DESIGN/progress; commit local y archivo del código. Desplegar demo estática en Vercel, comprobar URL pública y flujo de presentación en navegador limpio. Registrar duración/claim si la vía disponible es temporal.

Decisiones: no se proporcionaron fuente real ni credenciales, por lo que el MVP entregable es una demostración funcional con datos sintéticos y persistencia local. Autenticación, backend compartido y envío real de comunicaciones requieren integración posterior. No publicar datos del documento o del equipo fuera del proyecto sintético.
