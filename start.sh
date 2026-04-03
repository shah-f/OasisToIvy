#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-4173}"
URL="http://127.0.0.1:${PORT}/index.html"

cd "$ROOT_DIR"

if lsof -ti "tcp:${PORT}" >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use."
  echo "If your preview server is already running, open:"
  echo "  ${URL}"
  exit 1
fi

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER_PID=$!

sleep 1

echo "Serving FraudShield Strategy at:"
echo "  ${URL}"
echo
echo "Press Ctrl+C to stop the server."

if command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 || true
fi

wait "$SERVER_PID"
