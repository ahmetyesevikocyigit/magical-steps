#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  runtime_node="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
  if [[ -x "$runtime_node/node" ]]; then export PATH="$runtime_node:$PATH"; fi
fi
if ! command -v node >/dev/null 2>&1 || ! command -v pnpm >/dev/null 2>&1; then
  print "Node.js 22+ ve pnpm 11 kurulu olmalı. README.md dosyasına bakın."
  exit 1
fi
if curl --silent --fail http://127.0.0.1:3000 | /usr/bin/grep 'Magical Steps' >/dev/null; then
  print "Magical Steps çalışıyor: http://127.0.0.1:3000"
  exit 0
fi
[[ -d node_modules ]] || pnpm install --frozen-lockfile
[[ -f .next/BUILD_ID ]] || pnpm build
print "Önizleme: http://127.0.0.1:3000 — durdurmak için Ctrl+C"
pnpm start
