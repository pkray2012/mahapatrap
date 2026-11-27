#!/usr/bin/env bash
# Lighthouse mobile (default: simulated slow 4G, Moto G Power) on the 6 budget pages, 3 runs each.
# Needs Chrome: set CHROME_PATH if it is not /usr/bin/google-chrome. Serves dist/ with gzip on :4321.
set -euo pipefail
cd "$(dirname "$0")/.."
export CHROME_PATH="${CHROME_PATH:-/usr/bin/google-chrome}"
OUT="${OUT:-/tmp/lighthouse}"; mkdir -p "$OUT"
npx -y serve@14 dist -l 4321 >/dev/null 2>&1 & SRV=$!; trap 'kill $SRV' EXIT; sleep 4
for u in / /services/leak-and-blockage-repair/ /areas/patia/ /pricing/ /contact/ /services/bathroom-and-kitchen-fittings/; do
  for i in 1 2 3; do
    n="$(echo "$u" | tr '/' '_')$i"
    npx -y lighthouse@12 "http://localhost:4321$u" --quiet --chrome-flags="--headless=new --no-sandbox" \
      --output=json --output-path="$OUT/r$n.json" >/dev/null 2>&1
    node -e "const r=require('$OUT/r$n.json'),c=r.categories,a=r.audits;console.log('$u run $i', ['performance','accessibility','best-practices','seo'].map(k=>k+' '+Math.round(c[k].score*100)).join(' | '), '| LCP', a['largest-contentful-paint'].displayValue, '| CLS', a['cumulative-layout-shift'].displayValue, '| TBT', a['total-blocking-time'].displayValue)"
  done
done
