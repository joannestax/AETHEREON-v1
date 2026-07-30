#!/usr/bin/env bash
# Deploy Aetheron web preview to GitHub Pages (orphan gh-pages branch).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE="$ROOT/apps/mobile"
DIST="$MOBILE/dist"

cd "$MOBILE"
echo "→ Exporting Expo web static build…"
npx expo export --platform web

if [[ ! -d "$DIST" ]]; then
  echo "Export failed: dist/ missing" >&2
  exit 1
fi

cp "$DIST/index.html" "$DIST/404.html"
touch "$DIST/.nojekyll"

echo "→ Publishing orphan gh-pages branch…"
cd "$ROOT"
TMP="$(mktemp -d)"
# Fresh orphan branch — static site only
git clone --depth 1 --branch gh-pages "$(git remote get-url origin)" "$TMP" 2>/dev/null \
  || {
    mkdir -p "$TMP"
    git -C "$TMP" init
    git -C "$TMP" remote add origin "$(git remote get-url origin)"
    git -C "$TMP" checkout -b gh-pages
  }

# Wipe everything except .git
find "$TMP" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$DIST"/. "$TMP"/
cd "$TMP"
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
else
  git -c user.name="Aetheron Genesis" -c user.email="aetheron@origo.local" \
    commit -m "deploy: Aetheron web preview $(date -u +%Y-%m-%dT%H:%MZ)"
  git push -u origin HEAD:gh-pages --force
fi
rm -rf "$TMP"
echo "✓ Preview: https://joannestax.github.io/AETHEREON-v1/"
echo "  (GitHub → Settings → Pages → Source: gh-pages / root — if not already enabled)"
