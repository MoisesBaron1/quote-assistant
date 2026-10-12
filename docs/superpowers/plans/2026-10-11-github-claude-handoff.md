# GitHub y continuidad en Claude — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Esta sesión ejecuta el traspaso directamente, autorizado por la solicitud del usuario.

**Goal:** Publicar todo el código de Quote Assistant en GitHub y entregar un entorno e instrucciones para continuar con Claude.

**Architecture:** Conservar la app estática y su historial. Añadir documentación de contexto, configuración portable de Node/Playwright y CI de verificación, e incorporar el proyecto HyperFrames y las descargas necesarias al mismo repositorio.

**Tech Stack:** React 19, TypeScript, Vite 7, Node 24, Playwright, GitHub Actions, Vercel Hobby, HyperFrames 0.8.104.

**Spec:** Solicitud del usuario de publicar todo el código y preparar continuidad en Claude; `PRODUCT.md` conserva el alcance operativo.

## Global Constraints

- Producto: Quote Assistant; conservar todos los comportamientos y reglas existentes.
- MVP gratuito, estático y local; no introducir backend, API de pago ni autenticación ficticia.
- Repositorio de MoisesBaron1 facilitado por el usuario; no subir credenciales o respaldos reales.
- Conservar historial Git y el enlace https://quote-assistant-moi.vercel.app.
- Contexto de Claude independiente de archivos temporales del entorno original.

## Review Focus

- Clon en otro equipo sin `/usr/bin/chromium`: Playwright debe usar navegador instalado o variable opcional.
- Ejecución de offline sin preview previo: la configuración debe iniciar un build y un servidor 4173.
- Descargas/video sin carpetas externas: incluir los activos usados y comprobar referencias locales.
- Publicación de archivos locales sensibles: revisar árbol e historial antes de subir.
- Traspaso con pérdida de reglas o historial: verificar SHA remoto, documentos y contratos actuales.

### Task 1: Entorno portable y contexto

**Files:** `.nvmrc`, `package.json`, `package-lock.json`, `playwright.config.ts`, `scripts/setup-claude.sh`, `.github/workflows/ci.yml`, `scripts/prepare-downloads.mjs`, `CLAUDE.md`, `README.md`, `docs/continuar-en-claude.md`, `docs/claude-prompt.md`.

**Interfaces:** Instalación mediante `npm ci`; verificación `npm test`, `npm run build`, `npm run test:e2e`; navegador opcional `QUOTE_ASSISTANT_BROWSER_PATH`.

- [x] Documentar arquitectura, perfiles, persistencia, reglas y límites reales.
- [x] Fijar Node 24; iniciar servidores automáticamente en Playwright y eliminar rutas obligatorias del equipo original.
- [x] Ejecutar instalación, dominio, build y navegador desde una copia limpia con Chromium gestionado por Playwright.
- [x] Comprobar referencias y `git diff --check`.

### Task 2: Código completo y publicación

**Files:** `video/`, `public/descargas/quote-assistant-promocion-y-guia.mp4`, `.gitignore`, `docs/github-claude-verification.md`, `progress.md`.

**Interfaces:** Repo `MoisesBaron1/quote-assistant`, rama `main`; release con ZIP textual de contexto; Vercel permanece en el origen actual.

- [x] Copiar composición, activos, scripts y licencias del video; excluir dependencias, modelos y renders redundantes.
- [x] Validar sintaxis, referencias a activos y ausencia de credenciales en el árbol/historial.
- [ ] Commit y publicación en el repositorio proporcionado por el usuario, conservando todos los commits anteriores.
- [ ] Verificar SHA, privacidad, archivos, release y resultado de GitHub Actions.
- [ ] Entregar enlace del repositorio, instrucciones Claude y evidencias.
