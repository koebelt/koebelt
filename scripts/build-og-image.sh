#!/bin/sh
# Renders scripts/og/og-image.html to public/og-image.png (1200x630), the image
# shown when a link to the site is shared. Needs a Chromium: pass its path as
# CHROME, or have Playwright's headless shell installed.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | tail -1)}"
[ -x "$CHROME" ] || { echo "no Chromium found; set CHROME=/path/to/chrome" >&2; exit 1; }
"$CHROME" --headless --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$PWD/public/og-image.png" "file://$PWD/scripts/og/og-image.html"
