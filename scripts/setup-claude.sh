#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Instala Node.js 24 antes de continuar (.nvmrc indica la versión).'
  exit 1
fi

node -e 'if (Number(process.versions.node.split(".")[0]) < 24) { console.error("Quote Assistant requiere Node.js 24 o posterior para sus pruebas TypeScript."); process.exit(1); }'

npm ci
npm test
npm run build

if [[ "${1:-}" == "--browser" ]]; then
  npx playwright install chromium
fi

printf '%s\n' 'Proyecto preparado. Lee CLAUDE.md y docs/continuar-en-claude.md.'
printf '%s\n' 'Para abrir la app: npm run dev'
printf '%s\n' 'Para verificar el navegador: npm run test:e2e (instala Chromium primero).'
