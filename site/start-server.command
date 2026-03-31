#!/bin/zsh
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  PY=python3
else
  PY=python
fi
echo "Запускаем сервер на http://localhost:8000"
$PY -m http.server 8000
read -n 1 -s -r -p "Нажмите любую клавишу, чтобы закрыть терминал..."