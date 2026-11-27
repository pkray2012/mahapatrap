# Build performance and link audit — 27 Nov 2026

Build: Astro 7.4 static output, Tailwind CSS 4 (compiled, inlined), Node 22. Checked on the production build (`npm run build` → `dist/`). Zero build warnings; `dist/` has 26 pages + `404.html` + `sitemap.xml` + `robots.txt`.

## 1. Lighthouse mobile (budget: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO = 100, LCP < 2.0 s, CLS < 0.05, TBT < 100 ms)

Lighthouse 12.8 (default mobile: Moto G Power emulation, simulated slow 4G, 4× CPU slowdown) with Chrome for Testing 153 headless, against `dist/` served locally with gzip (`npx serve`). Three runs per page (`scripts/lighthouse.sh`).

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT (3 runs) |
|---|---|---|---|---|---|---|---|
| / | 100 | 100 | 100 | 100 | 1.1 s | 0 | 40 / 90 / 70 ms |
| /services/leak-and-blockage-repair/ | 100 | 100 | 100 | 100 | 1.1 s | 0 | 40 / 20 / 10 ms |
| /areas/patia/ | 100 | 100 | 100 | 100 | 1.1 s | 0 | 20 / 30 / 10 ms |
| /pricing/ | 100 | 100 | 100 | 100 | 1.1 s | 0 | 70 / 0 / 20 ms |
| /contact/ | 100 | 100 | 100 | 100 | 1.1 s | 0 | 70 / 50 / 50 ms |

All five pages meet every budget on every run. Earlier runs during the build showed one contact-page run at TBT 140 ms (score 99); repeated runs were 10–70 ms, so it was run-to-run noise on a ~1 KB script, not a real long task.

Raw run log:

```
/ run 1 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 40 ms
/ run 2 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 90 ms
/ run 3 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 70 ms
/services/leak-and-blockage-repair/ run 1 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 40 ms
/services/leak-and-blockage-repair/ run 2 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 20 ms
/services/leak-and-blockage-repair/ run 3 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 10 ms
/areas/patia/ run 1 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 20 ms
/areas/patia/ run 2 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 30 ms
/areas/patia/ run 3 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 10 ms
/pricing/ run 1 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 70 ms
/pricing/ run 2 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 0 ms
/pricing/ run 3 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 20 ms
/contact/ run 1 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 70 ms
/contact/ run 2 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 50 ms
/contact/ run 3 performance 100 | accessibility 100 | best-practices 100 | seo 100 | LCP 1.1 s | CLS 0 | TBT 50 ms
```

Fixes made during the audit:
- White text on Blue #0A7CC4 measured 4.47:1 (just under AA 4.5:1 for normal text). Button text is now 19 px bold, which is WCAG "large text" (3:1 needed), so the approved blue stays. Alternative if the owner prefers smaller buttons: use #0866A3 (the approved hover blue) as the button colour.
- WhatsApp buttons use dark text (#072B16) on #25D366, because white on #25D366 fails AA.
- Links inside paragraphs are underlined (Lighthouse "link-in-text-block").
- "Serve static assets with an efficient cache policy" flags only appear on the local server; `netlify.toml` sets one-year immutable caching for `/_astro/*` (hashed logo files) and one week for images/icons.

Notes: lab scores on a local server, not field data. Re-run PageSpeed Insights on the live Netlify URL after deploy (Netlify adds TLS and CDN latency).

## 2. Per-page size report (budget: HTML ≤ 60 KB gzip, CSS ≤ 15 KB gzip, JS ≤ 10 KB gzip)

`node scripts/size_report.mjs --md`. CSS is one Tailwind stylesheet inlined in `<head>` (no render-blocking CSS request); JS is one inline module (tracking helper, FAQ/pricing events, map facade, WhatsApp form). HTML gzip includes the inline CSS, JS and JSON-LD.

| Page | HTML raw KB | HTML gzip KB (incl. inline CSS/JS/JSON-LD) | CSS gzip KB | JS gzip KB | JSON-LD gzip KB | Budget |
|---|---|---|---|---|---|---|
| /404.html | 47.0 | 11.1 | 5.8 | 1.2 | 0.0 | OK |
| /about/ | 69.3 | 16.1 | 5.8 | 1.2 | 2.0 | OK |
| /areas/chandrasekharpur/ | 68.1 | 16.2 | 5.8 | 1.2 | 2.2 | OK |
| /areas/infocity/ | 67.2 | 16.3 | 5.8 | 1.2 | 2.1 | OK |
| /areas/jayadev-vihar/ | 67.4 | 16.2 | 5.8 | 1.2 | 2.2 | OK |
| /areas/kiit/ | 67.6 | 16.3 | 5.8 | 1.2 | 2.2 | OK |
| /areas/nayapalli/ | 67.2 | 16.1 | 5.8 | 1.2 | 2.1 | OK |
| /areas/niladri-vihar/ | 67.8 | 16.0 | 5.8 | 1.2 | 2.1 | OK |
| /areas/patia/ | 67.7 | 16.2 | 5.8 | 1.2 | 2.2 | OK |
| /areas/sailashree-vihar/ | 66.8 | 16.1 | 5.8 | 1.2 | 2.1 | OK |
| /contact/ | 67.9 | 15.8 | 5.8 | 1.2 | 1.9 | OK |
| / | 80.4 | 18.1 | 5.8 | 1.2 | 2.0 | OK |
| /pricing/ | 77.2 | 17.0 | 5.8 | 1.2 | 2.7 | OK |
| /privacy-policy/ | 59.1 | 14.8 | 5.8 | 1.2 | 1.4 | OK |
| /services/bathroom-and-kitchen-fittings/ | 75.7 | 18.1 | 5.8 | 1.2 | 2.6 | OK |
| /services/bathroom-plumbing-renovation/ | 76.2 | 18.1 | 5.8 | 1.2 | 2.6 | OK |
| /services/borewell-pump-and-pipe-repair/ | 73.2 | 17.6 | 5.8 | 1.2 | 2.6 | OK |
| /services/commercial-plumbing/ | 74.7 | 17.9 | 5.8 | 1.2 | 2.5 | OK |
| /services/drain-cleaning-and-sewer-jetting/ | 73.7 | 17.7 | 5.8 | 1.2 | 2.6 | OK |
| /services/geyser-installation-and-repair/ | 73.8 | 18.0 | 5.8 | 1.2 | 2.7 | OK |
| /services/leak-and-blockage-repair/ | 74.9 | 17.9 | 5.8 | 1.2 | 2.6 | OK |
| /services/new-bathroom-and-house-plumbing/ | 75.0 | 17.8 | 5.8 | 1.2 | 2.4 | OK |
| /services/pipeline-and-concealed-plumbing/ | 75.4 | 18.2 | 5.8 | 1.2 | 2.6 | OK |
| /services/septic-tank-cleaning/ | 70.7 | 17.3 | 5.8 | 1.2 | 2.5 | OK |
| /services/sewerage-and-drainage-works/ | 72.0 | 17.4 | 5.8 | 1.2 | 2.3 | OK |
| /services/water-tank-and-motor-repair/ | 73.1 | 17.8 | 5.8 | 1.2 | 2.6 | OK |
| /services/water-tank-cleaning/ | 70.3 | 17.1 | 5.8 | 1.2 | 2.3 | OK |

Max: HTML 18.2 KB gz (budget 60), CSS 5.8 KB gz (budget 15), JS 1.2 KB gz (budget 10).
All pages within budget.

With all six tracking IDs set (test build) the consent-aware loader adds ~1.1 KB gzip: max JS 2.3 KB gzip, max HTML 19.3 KB gzip. With no IDs set, no tracking code and no third-party request is in the page.

Images: header logo (full-colour horizontal, trimmed, 161×44 CSS px) as AVIF 3.5 KB (1×) / 6.3 KB (2×), WebP fallback 5.2 / 8.8 KB. Footer mark WebP 3.6 / 8.2 KB, lazy. No other images yet (job photo slots are CSS placeholders with fixed aspect ratio). No web fonts, no third-party requests on load; the Google Maps iframe loads only after "Show map" is tapped.

## 3. Canonical / non-canonical URL check (`node scripts/check_links.mjs`)

Result: **0 problems.**

- Every page has exactly one `<link rel="canonical">` = `https://mahapatraplumbing.in` + front-matter `url` (apex, https, trailing slash, lowercase, no query/fragment/index.html); the set of canonicals equals the 26 front-matter URLs. `og:url` equals the canonical on every page.
- Every internal `href`/`src` (header, footer, body, breadcrumbs, CTAs) is root-relative and canonical: no `http://`, no `www.`, no own-domain absolute URLs, no missing trailing slash, no `/index.html`, no double slashes, no uppercase page paths, no query strings. Any violation fails the script (exit 1).
- `sitemap.xml` lists exactly the 26 canonical URLs (no duplicates, no 404).
- `404.html`: `noindex`, no canonical, not in the sitemap. No other page has `noindex`.
- No duplicate content: only `/path/index.html` files are generated (no `/pricing.html` next to `/pricing/`). Netlify 301s `/pricing` → `/pricing/`; `netlify.toml` 301s `http://` and `www.` to `https://mahapatraplumbing.in/`.
- JSON-LD `@id`, `url` and `item` values all use `https://mahapatraplumbing.in/...` with trailing slash (or `/#fragment`) and point to pages that exist; schema `logo` (`/images/logo-horizontal.png`) and `image` (`/images/og-default.webp`) files exist in `dist/`.
- Visible breadcrumb labels and links match each page's BreadcrumbList exactly (25 pages; home has none).

## 4. Internal linking

- **0 broken internal links, 0 broken anchors** (2,800+ internal URLs incl. `#book-a-visit`, `#main`).
- Internal links: none `nofollow`. External: all `wa.me` and Google Maps links open in a new tab with `rel="noopener"`; `tel:` / `mailto:` open in place.
- Generic anchors ("click here", "read more", "here"): **none**.
- Same anchor text pointing to two different URLs: **none**.

### Inbound body links per page

Counted from other pages' `<main>` content only (header, footer, mobile menu and breadcrumbs excluded). "Source pages" = distinct linking pages. Target ≥ 3.

| Page | Source pages | Body links | Anchor texts (source) |
|---|---|---|---|
| / | 0 | 0 |  |
| /about/ | 2 | 2 | "about Mahapatra Plumbing Services" (/contact/); "about our plumbing company in Bhubaneswar" (/) |
| /services/sewerage-and-drainage-works/ | 6 | 7 | "sewerage and drainage works" (/areas/nayapalli/); "sewerage and drainage works" (/areas/nayapalli/); "Sewerage & Drainage Works" (/); "Sewerage & drainage works" (/pricing/); "sewerage and drainage works" (/services/drain-cleaning-and-sewer-jetting/); "sewerage and drainage works" (/services/new-bathroom-and-house-plumbing/); "sewerage and drainage works" (/services/septic-tank-cleaning/) |
| /services/borewell-pump-and-pipe-repair/ | 7 | 7 | "borewell pump and pipe repair" (/areas/chandrasekharpur/); "borewell pump and pipe repair" (/areas/nayapalli/); "borewell service in Bhubaneswar" (/areas/niladri-vihar/); "borewell pump and pipe repair" (/areas/patia/); "Borewell Pump & Pipe Repair" (/); "Borewell pump & pipe repair" (/pricing/); "borewell pump and pipe repair" (/services/water-tank-and-motor-repair/) |
| /areas/jayadev-vihar/ | 8 | 8 | "Jayadev Vihar" (/areas/chandrasekharpur/); "Jayadev Vihar" (/areas/infocity/); "Jayadev Vihar" (/areas/kiit/); "Jayadev Vihar and Saheed Nagar" (/areas/nayapalli/); "Jayadev Vihar" (/areas/niladri-vihar/); "Jayadev Vihar" (/areas/patia/); "Jayadev Vihar" (/areas/sailashree-vihar/); "Plumber in Jayadev Vihar" (/) |
| /areas/niladri-vihar/ | 9 | 9 | "Niladri Vihar" (/areas/chandrasekharpur/); "Plumber in Niladri Vihar" (/areas/infocity/); "Niladri Vihar" (/areas/jayadev-vihar/); "Niladri Vihar" (/areas/kiit/); "Niladri Vihar" (/areas/nayapalli/); "Niladri Vihar" (/areas/patia/); "Niladri Vihar" (/areas/sailashree-vihar/); "Plumber in Niladri Vihar" (/); "plumber in Niladri Vihar" (/services/water-tank-and-motor-repair/) |
| /areas/sailashree-vihar/ | 9 | 9 | "Sailashree Vihar" (/areas/chandrasekharpur/); "Sailashree Vihar" (/areas/infocity/); "Sailashree Vihar" (/areas/jayadev-vihar/); "Sailashree Vihar" (/areas/kiit/); "Sailashree Vihar" (/areas/nayapalli/); "Sailashree Vihar" (/areas/niladri-vihar/); "Sailashree Vihar" (/areas/patia/); "Plumber in Sailashree Vihar" (/); "plumber in Sailashree Vihar" (/services/pipeline-and-concealed-plumbing/) |
| /services/commercial-plumbing/ | 9 | 9 | "commercial plumbing services" (/about/); "commercial plumbing" (/areas/chandrasekharpur/); "commercial plumbing for offices" (/areas/infocity/); "Commercial plumbing for shops, offices and buildings" (/areas/jayadev-vihar/); "Plumbing for hostels, PGs and other buildings" (/areas/kiit/); "Commercial Plumbing" (/); "Commercial AMC (hostels, PGs, offices, shops, hotels)" (/pricing/); "commercial plumbing" (/services/geyser-installation-and-repair/); "commercial plumbing services" (/services/water-tank-cleaning/) |
| /areas/infocity/ | 10 | 10 | "Infocity" (/areas/chandrasekharpur/); "Infocity" (/areas/jayadev-vihar/); "Plumber in Infocity" (/areas/kiit/); "Infocity" (/areas/nayapalli/); "Infocity" (/areas/niladri-vihar/); "Infocity" (/areas/patia/); "Infocity" (/areas/sailashree-vihar/); "Plumber in Infocity" (/); "plumber in Infocity, Bhubaneswar" (/services/bathroom-and-kitchen-fittings/); "office plumbing in Infocity" (/services/commercial-plumbing/) |
| /areas/kiit/ | 10 | 11 | "KIIT" (/areas/chandrasekharpur/); "Plumber near KIIT" (/areas/infocity/); "KIIT" (/areas/jayadev-vihar/); "KIIT" (/areas/nayapalli/); "KIIT" (/areas/niladri-vihar/); "plumber near KIIT" (/areas/patia/); "KIIT" (/areas/patia/); "KIIT" (/areas/sailashree-vihar/); "Plumber near KIIT" (/); "plumber for hostels near KIIT" (/services/commercial-plumbing/); "plumbers near KIIT hostels" (/services/septic-tank-cleaning/) |
| /areas/nayapalli/ | 10 | 10 | "Nayapalli" (/areas/chandrasekharpur/); "Nayapalli" (/areas/infocity/); "Nayapalli and IRC Village" (/areas/jayadev-vihar/); "Nayapalli" (/areas/kiit/); "Nayapalli" (/areas/niladri-vihar/); "Nayapalli" (/areas/patia/); "Nayapalli" (/areas/sailashree-vihar/); "Plumber in Nayapalli" (/); "plumber in Nayapalli" (/services/borewell-pump-and-pipe-repair/); "plumber in Nayapalli and IRC Village" (/services/sewerage-and-drainage-works/) |
| /services/geyser-installation-and-repair/ | 10 | 11 | "Geyser installation and repair" (/areas/chandrasekharpur/); "Geyser installation and repair" (/areas/jayadev-vihar/); "Geyser installation and repair" (/areas/kiit/); "Geyser installation and repair" (/areas/nayapalli/); "Geyser installation and repair" (/areas/niladri-vihar/); "Geyser installation and repair" (/areas/patia/); "Geyser Installation & Repair" (/); "Geyser service" (/pricing/); "Geyser installation" (/pricing/); "geyser installation and repair" (/services/bathroom-and-kitchen-fittings/); "geyser installation" (/services/bathroom-plumbing-renovation/) |
| /areas/patia/ | 11 | 11 | "Patia" (/areas/chandrasekharpur/); "Plumber in Patia" (/areas/infocity/); "Patia" (/areas/jayadev-vihar/); "Plumber in Patia" (/areas/kiit/); "Patia" (/areas/nayapalli/); "Patia" (/areas/niladri-vihar/); "Patia" (/areas/sailashree-vihar/); "Plumber in Patia" (/); "plumbing services in Patia" (/services/leak-and-blockage-repair/); "plumbing services in Patia" (/services/septic-tank-cleaning/); "plumbing services in Patia" (/services/water-tank-cleaning/) |
| /services/bathroom-and-kitchen-fittings/ | 11 | 11 | "bathroom and kitchen fittings" (/areas/chandrasekharpur/); "Bathroom and kitchen fittings" (/areas/infocity/); "Bathroom and kitchen fittings" (/areas/jayadev-vihar/); "New taps, jet sprays and wash basins for PG rooms" (/areas/kiit/); "Bathroom and kitchen fittings" (/areas/patia/); "bathroom and kitchen fittings" (/areas/sailashree-vihar/); "Bathroom & Kitchen Fittings" (/); "Tap / jet spray / flush kit install" (/pricing/); "bathroom and kitchen fittings" (/services/bathroom-plumbing-renovation/); "bathroom and kitchen fittings service" (/services/geyser-installation-and-repair/); "bathroom and kitchen fittings" (/services/leak-and-blockage-repair/) |
| /services/pipeline-and-concealed-plumbing/ | 11 | 11 | "concealed pipe leakage repair" (/areas/chandrasekharpur/); "Concealed pipeline repair and CPVC plumbing" (/areas/jayadev-vihar/); "concealed pipeline repair" (/areas/patia/); "concealed pipeline repair and CPVC plumbing" (/areas/sailashree-vihar/); "Pipeline & Concealed Plumbing" (/); "Concealed pipeline repair / reroute" (/pricing/); "GI to CPVC pipe replacement" (/services/bathroom-plumbing-renovation/); "concealed pipeline repair" (/services/borewell-pump-and-pipe-repair/); "concealed pipe leakage repair" (/services/leak-and-blockage-repair/); "pipeline and concealed plumbing repair" (/services/new-bathroom-and-house-plumbing/); "Concealed pipeline repair and CPVC plumbing" (/services/water-tank-and-motor-repair/) |
| /services/water-tank-cleaning/ | 11 | 12 | "water tank cleaning" (/areas/chandrasekharpur/); "Water tank and sump cleaning" (/areas/infocity/); "Water tank and sump cleaning" (/areas/kiit/); "Water tank and sump cleaning" (/areas/nayapalli/); "Water tank and sump cleaning" (/areas/niladri-vihar/); "Water tank and sump cleaning" (/areas/patia/); "Water Tank & Sump Cleaning" (/); "Water tank / sump cleaning" (/pricing/); "water tank and sump cleaning" (/services/commercial-plumbing/); "water tank and sump cleaning" (/services/commercial-plumbing/); "water tank and sump cleaning" (/services/septic-tank-cleaning/); "water tank and sump cleaning" (/services/water-tank-and-motor-repair/) |
| /services/bathroom-plumbing-renovation/ | 12 | 12 | "Bathroom renovation plumbing" (/areas/chandrasekharpur/); "Bathroom renovation plumbing" (/areas/infocity/); "Bathroom and kitchen renovation plumbing" (/areas/jayadev-vihar/); "Bathroom renovation plumbing" (/areas/nayapalli/); "bathroom renovation plumbing" (/areas/niladri-vihar/); "Bathroom renovation plumbing" (/areas/patia/); "bathroom renovation plumbing" (/areas/sailashree-vihar/); "Bathroom & Kitchen Plumbing Renovation" (/); "Bathroom / kitchen renovation" (/pricing/); "bathroom renovation plumbing" (/services/bathroom-and-kitchen-fittings/); "bathroom renovation plumbing" (/services/new-bathroom-and-house-plumbing/); "bathroom renovation plumbing" (/services/pipeline-and-concealed-plumbing/) |
| /services/septic-tank-cleaning/ | 12 | 13 | "septic tank cleaning in Bhubaneswar" (/about/); "Septic tank cleaning" (/areas/chandrasekharpur/); "Septic tank cleaning" (/areas/kiit/); "septic tank cleaning" (/areas/nayapalli/); "Septic tank cleaning" (/areas/nayapalli/); "septic tank cleaning" (/areas/niladri-vihar/); "Septic tank cleaning" (/areas/patia/); "septic tank cleaning in Bhubaneswar" (/contact/); "Septic Tank Cleaning" (/); "Septic tank cleaning" (/pricing/); "septic tank cleaning in Bhubaneswar" (/services/drain-cleaning-and-sewer-jetting/); "septic tank cleaning" (/services/sewerage-and-drainage-works/); "septic tank cleaning" (/services/water-tank-cleaning/) |
| /services/water-tank-and-motor-repair/ | 12 | 14 | "water tank and motor repair" (/areas/chandrasekharpur/); "Water tank and motor repair" (/areas/infocity/); "Water motor, pump and tank repair" (/areas/jayadev-vihar/); "Water motor and tank repair" (/areas/nayapalli/); "water motor and pump repair" (/areas/niladri-vihar/); "Water tank and motor repair" (/areas/niladri-vihar/); "Water motor and tank repair" (/areas/patia/); "Water Tank & Motor Repair" (/); "Water motor / pump repair" (/pricing/); "water tank and motor repair" (/services/borewell-pump-and-pipe-repair/); "water tank and motor repair" (/services/commercial-plumbing/); "water tank and motor repair" (/services/new-bathroom-and-house-plumbing/); "water tank and motor repair" (/services/water-tank-cleaning/); "water tank and motor repair" (/services/water-tank-cleaning/) |
| /areas/chandrasekharpur/ | 13 | 13 | "plumber in Chandrasekharpur and Damana" (/about/); "Plumber in Chandrasekharpur" (/areas/infocity/); "Chandrasekharpur" (/areas/jayadev-vihar/); "Plumber in Chandrasekharpur" (/areas/kiit/); "Chandrasekharpur" (/areas/nayapalli/); "plumber in Chandrasekharpur" (/areas/niladri-vihar/); "Chandrasekharpur" (/areas/patia/); "plumber in Chandrasekharpur" (/areas/sailashree-vihar/); "Chandrasekharpur" (/contact/); "Plumber in Chandrasekharpur" (/); "plumber in Chandrasekharpur" (/pricing/); "plumber in Chandrasekharpur" (/services/drain-cleaning-and-sewer-jetting/); "plumber in Chandrasekharpur" (/services/geyser-installation-and-repair/) |
| /services/drain-cleaning-and-sewer-jetting/ | 13 | 16 | "Drain cleaning and toilet blockage removal" (/areas/chandrasekharpur/); "Drain cleaning and blockage removal" (/areas/infocity/); "Drain cleaning and blockage removal" (/areas/jayadev-vihar/); "Drain and toilet blockage removal" (/areas/kiit/); "drain cleaning" (/areas/nayapalli/); "Drain cleaning" (/areas/nayapalli/); "Drain cleaning" (/areas/niladri-vihar/); "Drain cleaning" (/areas/patia/); "Drain Cleaning & Sewer Jetting" (/); "Drain unclogging (sink / floor trap)" (/pricing/); "Toilet blockage removal" (/pricing/); "drain cleaning and blockage removal" (/services/commercial-plumbing/); "drain cleaning and blockage removal" (/services/leak-and-blockage-repair/); "drain cleaning and blockage removal" (/services/septic-tank-cleaning/); "drain cleaning and sewer jetting" (/services/septic-tank-cleaning/); "drain cleaning and blockage removal" (/services/sewerage-and-drainage-works/) |
| /services/new-bathroom-and-house-plumbing/ | 13 | 13 | "New house plumbing" (/areas/chandrasekharpur/); "New house and bathroom plumbing" (/areas/nayapalli/); "New house plumbing" (/areas/niladri-vihar/); "new house plumbing" (/areas/patia/); "new bathroom and house plumbing" (/areas/sailashree-vihar/); "New Bathroom & House Plumbing" (/); "New house / bathroom plumbing" (/pricing/); "new bathroom and house plumbing" (/services/bathroom-plumbing-renovation/); "new house plumbing work" (/services/borewell-pump-and-pipe-repair/); "new building plumbing work" (/services/commercial-plumbing/); "new house and bathroom plumbing" (/services/pipeline-and-concealed-plumbing/); "new house plumbing work" (/services/sewerage-and-drainage-works/); "New house plumbing work" (/services/water-tank-and-motor-repair/) |
| /privacy-policy/ | 15 | 16 | "Privacy Policy" (/contact/); "Privacy Policy" (/); "Privacy Policy" (/); "Privacy Policy" (/services/bathroom-and-kitchen-fittings/); "Privacy Policy" (/services/bathroom-plumbing-renovation/); "Privacy Policy" (/services/borewell-pump-and-pipe-repair/); "Privacy Policy" (/services/commercial-plumbing/); "Privacy Policy" (/services/drain-cleaning-and-sewer-jetting/); "Privacy Policy" (/services/geyser-installation-and-repair/); "Privacy Policy" (/services/leak-and-blockage-repair/); "Privacy Policy" (/services/new-bathroom-and-house-plumbing/); "Privacy Policy" (/services/pipeline-and-concealed-plumbing/); "Privacy Policy" (/services/septic-tank-cleaning/); "Privacy Policy" (/services/sewerage-and-drainage-works/); "Privacy Policy" (/services/water-tank-and-motor-repair/); "Privacy Policy" (/services/water-tank-cleaning/) |
| /services/leak-and-blockage-repair/ | 17 | 17 | "leak and blockage repair" (/about/); "Leak and tap repair" (/areas/chandrasekharpur/); "Tap, flush and pipe leak repair" (/areas/infocity/); "Tap, flush and pipe leak repair" (/areas/jayadev-vihar/); "Tap, flush and pipe leak repair" (/areas/kiit/); "Leak and blockage repair" (/areas/nayapalli/); "Leak and blockage repair" (/areas/niladri-vihar/); "Tap, flush and pipe leak repair" (/areas/patia/); "tap, flush tank and pipe leak repair" (/areas/sailashree-vihar/); "leak and blockage repair" (/contact/); "Leak & Blockage Repair" (/); "Minor fix (washer, small leak, loose fitting)" (/pricing/); "tap, flush and pipe leak repair" (/services/bathroom-and-kitchen-fittings/); "pipe leakage and blockage repair" (/services/drain-cleaning-and-sewer-jetting/); "pipe leakage and blockage repair" (/services/geyser-installation-and-repair/); "tap and pipe leak repair" (/services/pipeline-and-concealed-plumbing/); "Tap, flush and pipe leak repair" (/services/water-tank-and-motor-repair/) |
| /contact/ | 24 | 24 | "contact page" (/about/); "Contact page" (/areas/chandrasekharpur/); "contact page" (/areas/infocity/); "contact page" (/areas/jayadev-vihar/); "contact page" (/areas/kiit/); "Contact page" (/areas/nayapalli/); "Contact page" (/areas/niladri-vihar/); "contact page" (/areas/patia/); "contact page" (/areas/sailashree-vihar/); "Contact page" (/); "contact page" (/pricing/); "contact Mahapatra Plumbing Services" (/services/bathroom-and-kitchen-fittings/); "Contact Mahapatra Plumbing Services" (/services/bathroom-plumbing-renovation/); "contact Mahapatra Plumbing Services" (/services/borewell-pump-and-pipe-repair/); "contact page" (/services/commercial-plumbing/); "contact Mahapatra Plumbing Services" (/services/drain-cleaning-and-sewer-jetting/); "contact Mahapatra Plumbing Services" (/services/geyser-installation-and-repair/); "contact Mahapatra Plumbing Services" (/services/leak-and-blockage-repair/); "Contact Mahapatra Plumbing Services" (/services/new-bathroom-and-house-plumbing/); "Contact Mahapatra Plumbing Services" (/services/pipeline-and-concealed-plumbing/); "contact page" (/services/septic-tank-cleaning/); "contact page" (/services/sewerage-and-drainage-works/); "contact Mahapatra Plumbing Services" (/services/water-tank-and-motor-repair/); "contact page" (/services/water-tank-cleaning/) |
| /pricing/ | 24 | 27 | "plumbing charges in Bhubaneswar" (/about/); "plumber charges in Bhubaneswar" (/areas/chandrasekharpur/); "late-night and visit charges" (/areas/infocity/); "plumber charges in Bhubaneswar" (/areas/infocity/); "plumber charges in Bhubaneswar" (/areas/jayadev-vihar/); "plumber charges in Bhubaneswar" (/areas/kiit/); "plumbing rate card" (/areas/nayapalli/); "plumber charges in Bhubaneswar" (/areas/niladri-vihar/); "plumber charges in Bhubaneswar" (/areas/patia/); "plumber charges in Bhubaneswar" (/areas/sailashree-vihar/); "plumber charges in Bhubaneswar" (/contact/); "plumber charges in Bhubaneswar" (/); "plumbing rate card for Bhubaneswar" (/services/bathroom-and-kitchen-fittings/); "plumbing rate card for Bhubaneswar" (/services/bathroom-plumbing-renovation/); "warranty and payment details" (/services/bathroom-plumbing-renovation/); "plumbing rate card for Bhubaneswar" (/services/borewell-pump-and-pipe-repair/); "plumbing charges in Bhubaneswar" (/services/commercial-plumbing/); "plumber charges in Bhubaneswar" (/services/drain-cleaning-and-sewer-jetting/); "plumber charges in Bhubaneswar" (/services/geyser-installation-and-repair/); "plumber charges in Bhubaneswar" (/services/leak-and-blockage-repair/); "plumbing rate card for Bhubaneswar" (/services/new-bathroom-and-house-plumbing/); "warranty and payment details" (/services/new-bathroom-and-house-plumbing/); "plumber charges in Bhubaneswar" (/services/pipeline-and-concealed-plumbing/); "plumbing charges in Bhubaneswar" (/services/septic-tank-cleaning/); "plumber charges in Bhubaneswar" (/services/sewerage-and-drainage-works/); "plumber charges in Bhubaneswar" (/services/water-tank-and-motor-repair/); "plumber charges in Bhubaneswar" (/services/water-tank-cleaning/) |

### Pages below 3 inbound body-link sources (copy decision for the owner; no copy was changed)

| Page | Now | Suggested source pages and anchors |
|---|---|---|
| / (home) | 0 body links (linked from every page's logo, header and breadcrumb "Home") | /about/ intro or "Areas we serve": "plumber in Bhubaneswar" → /; /contact/ "Why contact" block: "Mahapatra Plumbing Services home page" → /; /pricing/ "Areas we serve": "plumbing services in Bhubaneswar" → /. Home's primary keyword is "plumber in bhubaneswar", so that anchor on 2–3 pages helps. |
| /about/ | 2 (/, /contact/) | /pricing/ "Why Mahapatra Plumbing Services": "about Amaresh Mahapatra and our team" → /about/; /services/commercial-plumbing/ or /services/new-bathroom-and-house-plumbing/ proof block: "about Mahapatra Plumbing Services" → /about/; one area page (e.g. /areas/chandrasekharpur/, the home base): "our plumbing company in Bhubaneswar" → /about/. |

All 13 service pages have 6–17 inbound source pages (home + related services + area pages + pricing), and all 8 area pages have 8–13 (home + the other areas + services).
