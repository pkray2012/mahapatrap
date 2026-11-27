# QA 2 — Mobile performance audit — 27 Nov 2026

Auditor: QA agent 2 (independent of the builder). Scope: all 26 pages in `sitemap.xml`. Read-only: no project file was changed; all tooling, builds and servers ran under `/tmp/qa2` (port 5055/5056/5057, stopped afterwards).

**Verdict: every page meets the mobile speed budget on the spec's Lighthouse profile.** No Critical issues. Two Major items (both about tracking and cache headers, i.e. things that will only show up after launch) and a handful of Minor ones.

## Method

- `dist/` from the repo (built 27 Nov 07:18; a fresh `npm run build` of current `src/` in a /tmp copy produces identical HTML, only Tailwind's utility list differs slightly because the copy has no `.git`), copied to `/tmp/qa2/dist`.
- Served by a small Node server that behaves like Netlify for performance purposes: **Brotli q11** (gzip fallback), pretty URLs, `Cache-Control` per `netlify.toml` (`/_astro/*` immutable, HTML `max-age=0, must-revalidate`).
- Lighthouse 12.8.2, Chrome for Testing 153 headless, default mobile preset (Moto G Power, simulated slow 4G: 150 ms RTT, 1.6 Mbps, **4× CPU**). One run on all 26 pages; 3 more runs on every page that scored < 100 Perf or had TBT ≥ 99 ms.
- Low-end profile: same preset with `--throttling.cpuSlowdownMultiplier=6`, 6 runs each on `/`, `/services/leak-and-blockage-repair/`, `/areas/patia/`.
- Byte audit straight from the HTML (gzip -9 and Brotli q11), DOM size and above-the-fold checks in headless Chrome at 412×823 (mobile, touch).
- Tracking: second build in `/tmp/qa2/envbuild` with dummy IDs (`PUBLIC_GTM_ID=GTM-TEST123`, `PUBLIC_GA4_ID=G-TEST123`, `PUBLIC_CLARITY_ID`, `PUBLIC_GADS_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_MS_UET_ID`). Third-party requests were intercepted and aborted, so nothing left the machine.
- Caveat: the box has 2 CPU cores shared with two other QA agents running Chrome at the same time. TBT jumps of a single run (e.g. 397 ms once on drain-cleaning) did not repeat on re-runs and are scheduling noise, not page cost. Lab numbers on localhost; re-check with PageSpeed Insights on the live Netlify URL.

## 1. Lighthouse mobile — all 26 pages

Budget: Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO = 100, LCP < 2.0 s, CLS < 0.05, TBT < 100 ms.
Values are run 1; brackets = the 3 re-runs. Times in seconds. "Req" excludes the one `data:` SVG (CSS bullet icon). HTML/CSS/JS sizes in KB; CSS and JS are inline in the HTML, so the HTML gzip/Brotli figures include them.

| Page | Perf | A11y | BP | SEO | FCP | LCP | SI | TBT ms | CLS | Req | Transfer KB | Image KB | HTML raw | HTML gz | HTML br | CSS gz | JS gz | JSON-LD raw KB (% of HTML) | DOM elements | LCP element |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 100 | 100 | 100 | 100 | 0.77 | 1.05 | 0.77 | 46 | 0 | 4 | 23.7 | 6.4 | 80.4 | 18.1 | 14.8 | 5.8 | 1.2 | 7.2 (9%) | 807 | text &lt;p&gt; |
| /about/ | 100 | 100 | 100 | 100 | 0.63 | 0.90 | 0.64 | 18 | 0 | 4 | 22.2 | 6.4 | 69.3 | 16.1 | 13.3 | 5.8 | 1.2 | 7.3 (10.5%) | 632 | text &lt;p&gt; |
| /areas/chandrasekharpur/ | 100 | 100 | 100 | 100 | 0.64 | 0.90 | 0.71 | 66 | 0 | 4 | 22.2 | 6.4 | 68.1 | 16.2 | 13.4 | 5.8 | 1.2 | 7.9 (11.6%) | 560 | text &lt;p&gt; |
| /areas/infocity/ | 100 | 100 | 100 | 100 | 0.64 | 0.90 | 0.69 | 20 | 0 | 4 | 22.4 | 6.4 | 67.2 | 16.3 | 13.5 | 5.8 | 1.2 | 7.3 (10.8%) | 553 | text &lt;p&gt; |
| /areas/jayadev-vihar/ | 100 | 100 | 100 | 100 | 0.63 | 0.90 | 0.63 | 6 | 0 | 4 | 22.3 | 6.4 | 67.4 | 16.2 | 13.4 | 5.8 | 1.2 | 7.6 (11.2%) | 547 | text &lt;p&gt; |
| /areas/kiit/ | 100 | 100 | 100 | 100 | 0.63 | 0.90 | 0.66 | 28 | 0 | 4 | 22.3 | 6.4 | 67.6 | 16.3 | 13.4 | 5.8 | 1.2 | 7.8 (11.5%) | 563 | text &lt;p&gt; |
| /areas/nayapalli/ | 98 (100/100/100) | 100 | 100 | 100 | 0.62 | 0.91 | 0.79 | 162 (8/5/0) | 0 | 4 | 22.2 | 6.4 | 67.2 | 16.1 | 13.3 | 5.8 | 1.2 | 7.4 (11%) | 553 | text &lt;p&gt; |
| /areas/niladri-vihar/ | 100 | 100 | 100 | 100 | 0.66 | 0.96 | 0.74 | 64 | 0 | 4 | 22.2 | 6.4 | 67.8 | 16.0 | 13.4 | 5.8 | 1.2 | 7.3 (10.8%) | 561 | text &lt;p&gt; |
| /areas/patia/ | 100 | 100 | 100 | 100 | 0.62 | 0.76 | 0.63 | 45 | 0 | 4 | 22.3 | 6.4 | 67.7 | 16.2 | 13.4 | 5.8 | 1.2 | 7.7 (11.3%) | 564 | text &lt;p&gt; |
| /areas/sailashree-vihar/ | 100 | 100 | 100 | 100 | 0.63 | 0.92 | 0.65 | 81 | 0 | 4 | 22.2 | 6.4 | 66.8 | 16.1 | 13.3 | 5.8 | 1.2 | 7.4 (11%) | 534 | text &lt;p&gt; |
| /contact/ | 100 | 100 | 100 | 100 | 0.66 | 0.91 | 0.73 | 35 | 0 | 4 | 22.1 | 6.4 | 67.9 | 15.8 | 13.2 | 5.8 | 1.2 | 7.3 (10.8%) | 601 | text &lt;p&gt; |
| /pricing/ | 100 | 100 | 100 | 100 | 0.63 | 0.90 | 0.63 | 18 | 0 | 4 | 22.8 | 6.4 | 77.2 | 17.0 | 13.9 | 5.8 | 1.2 | 12.8 (16.6%) | 703 | text &lt;p&gt; |
| /privacy-policy/ | 99 (100/100/100) | 100 | 100 | 100 | 0.65 | 0.68 | 0.73 | 119 (64/12/7) | 0 | 4 | 21.6 | 6.4 | 59.1 | 14.8 | 12.7 | 5.8 | 1.2 | 5.1 (8.7%) | 468 | text &lt;p&gt; |
| /services/bathroom-and-kitchen-fittings/ | 100 | 100 | 100 | 100 | 0.84 | 1.14 | 0.94 | 91 | 0 | 4 | 23.7 | 6.4 | 75.7 | 18.1 | 14.8 | 5.8 | 1.2 | 9.9 (13%) | 652 | text &lt;p&gt; |
| /services/bathroom-plumbing-renovation/ | 100 | 100 | 100 | 100 | 0.79 | 0.91 | 0.79 | 20 | 0 | 4 | 23.7 | 6.4 | 76.2 | 18.1 | 14.8 | 5.8 | 1.2 | 9.7 (12.8%) | 669 | text &lt;p&gt; |
| /services/borewell-pump-and-pipe-repair/ | 100 | 100 | 100 | 100 | 0.78 | 1.05 | 0.78 | 53 | 0 | 4 | 23.3 | 6.4 | 73.2 | 17.6 | 14.4 | 5.8 | 1.2 | 9.8 (13.4%) | 598 | text &lt;p&gt; |
| /services/commercial-plumbing/ | 100 | 100 | 100 | 100 | 0.77 | 1.05 | 0.77 | 22 | 0 | 4 | 23.5 | 6.4 | 74.7 | 17.9 | 14.6 | 5.8 | 1.2 | 9.3 (12.5%) | 663 | text &lt;p&gt; |
| /services/drain-cleaning-and-sewer-jetting/ | 90 (100/100/100) | 100 | 100 | 100 | 0.83 | 1.01 | 1.22 | 397 (39/15/4) | 0 | 4 | 23.4 | 6.4 | 73.7 | 17.7 | 14.5 | 5.8 | 1.2 | 10.2 (13.8%) | 619 | text &lt;p&gt; |
| /services/geyser-installation-and-repair/ | 99 (100/100/100) | 100 | 100 | 100 | 0.80 | 1.05 | 0.83 | 101 (24/16/14) | 0 | 4 | 23.6 | 6.4 | 73.8 | 18.0 | 14.7 | 5.8 | 1.2 | 10.2 (13.8%) | 611 | text &lt;p&gt; |
| /services/leak-and-blockage-repair/ | 99 (100/100/100) | 100 | 100 | 100 | 0.79 | 1.08 | 0.79 | 99 (16/27/79) | 0 | 4 | 23.5 | 6.4 | 74.9 | 17.9 | 14.6 | 5.8 | 1.2 | 10.0 (13.4%) | 646 | text &lt;p&gt; |
| /services/new-bathroom-and-house-plumbing/ | 100 | 100 | 100 | 100 | 0.77 | 0.91 | 0.77 | 34 | 0 | 4 | 23.6 | 6.4 | 75.0 | 17.8 | 14.7 | 5.8 | 1.2 | 9.2 (12.3%) | 664 | text &lt;p&gt; |
| /services/pipeline-and-concealed-plumbing/ | 100 | 100 | 100 | 100 | 0.79 | 1.06 | 0.79 | 27 | 0 | 4 | 23.7 | 6.4 | 75.4 | 18.2 | 14.8 | 5.8 | 1.2 | 9.7 (12.9%) | 660 | text &lt;p&gt; |
| /services/septic-tank-cleaning/ | 100 | 100 | 100 | 100 | 0.79 | 1.05 | 0.79 | 36 | 0 | 4 | 23.1 | 6.4 | 70.7 | 17.3 | 14.2 | 5.8 | 1.2 | 9.0 (12.8%) | 578 | text &lt;p&gt; |
| /services/sewerage-and-drainage-works/ | 100 | 100 | 100 | 100 | 0.78 | 1.05 | 0.78 | 40 | 0 | 4 | 23.2 | 6.4 | 72.0 | 17.4 | 14.3 | 5.8 | 1.2 | 9.0 (12.5%) | 611 | text &lt;p&gt; |
| /services/water-tank-and-motor-repair/ | 100 | 100 | 100 | 100 | 0.79 | 1.06 | 0.79 | 45 | 0 | 4 | 23.4 | 6.4 | 73.1 | 17.8 | 14.6 | 5.8 | 1.2 | 9.6 (13.2%) | 617 | text &lt;p&gt; |
| /services/water-tank-cleaning/ | 100 | 100 | 100 | 100 | 0.77 | 1.05 | 0.77 | 34 | 0 | 4 | 23.0 | 6.4 | 70.3 | 17.1 | 14.1 | 5.8 | 1.2 | 8.7 (12.4%) | 584 | text &lt;p&gt; |
**Summary.** 26/26 pages: Perf 98–100 on run 1 except one noisy 90 (drain-cleaning, TBT 397 ms; re-runs 100/100/100 with TBT 39/15/4 ms). A11y, BP and SEO 100 everywhere. Worst LCP 1.14 s (bathroom-and-kitchen-fittings), CLS 0 on every page, max FCP 0.84 s. 4 network requests per page (HTML, header logo AVIF 6.4 KB, favicon.svg, manifest). **No budget breach on the spec's profile.**

LCP element on every page is the hero intro paragraph `section.hero .hero-text > p` (text), never an image. LCP breakdown on `/`: TTFB ≈ 7 ms local, render delay ≈ 115 ms — there is no resource on the LCP path.

### Why service pages and Home are ~150 ms slower than area pages

FCP/LCP split into two clean groups that match the compressed HTML size exactly:

| HTML transfer (Brotli) | Pages | FCP |
|---|---|---|
| 13.2–14.5 KB | all area pages, About, Contact, Pricing, Privacy | 0.62–0.66 s |
| 14.7–15.5 KB | Home + all 14 service pages | 0.77–0.84 s |

The step is at ~14.6 KB = the TCP initial congestion window (10 × 1460 B). Pages above it need a second round trip (150 ms in Lighthouse's model). With the tracking IDs set, the loader adds ~1.2 KB gzip to every page, which pushes the area pages over the line too (measured: `/areas/patia/` FCP 0.62 s → 0.79–0.85 s with dummy IDs). Not a budget breach, but it is the single biggest remaining lab gain (see Minor #1).

## 2. Low-end Android profile (6× CPU)

| Page | Perf (6 runs) | LCP | TBT ms (6 runs) | CLS |
|---|---|---|---|---|
| / | 100, 96, 96, 100, 99, 100 | 1.05 s | 78, 243, 220, 48, 101, 16 | 0 |
| /services/leak-and-blockage-repair/ | 100, 100, 99, 99, 100, 100 | 1.05–1.11 s | 61, 76, 92, 101, 40, 60 | 0 |
| /areas/patia/ | 100, 94, 98, 99, 99, 100 | 0.78–0.91 s | 41, 299, 157, 120, 115, 46 | 0 |

LCP does not move (text LCP, no JS on the critical path). TBT goes over 100 ms in 7 of 18 runs; Perf never below 94. The blocking work is not JavaScript (script evaluation ≈ 30–60 ms): it is one "unattributable" task of ~300 ms (initial style recalculation + layout of the whole page) plus parse. DOM is 468–807 elements (Home 807, just over Lighthouse's 800 advisory line).

Tested and **rejected**: adding `content-visibility:auto` to below-the-fold sections (A/B, 3 runs each, same pages) gave no consistent TBT gain and dropped Accessibility to 96–97, so it is not recommended.

## 3. Byte audit

All pages, from the table above:

- **HTML** 59–80 KB raw, **14.8–18.2 KB gzip** (budget 60), 12.7–15.2 KB Brotli. Max is `/services/pipeline-and-concealed-plumbing/` 18.2 KB gz.
- **CSS**: one inline Tailwind stylesheet, 22.2 KB raw / **5.8 KB gzip** on every page (budget 15). No `<link rel="stylesheet">`, no render-blocking request.
- **JS**: one inline `type="module"` script, 2.5 KB raw / **1.2 KB gzip** (budget 10). With all six tracking IDs set: **2.3 KB gzip** (HTML +1.2 KB gz). No external first-party JS.
- **Requests on load**: 4 (document, header logo AVIF, favicon.svg, site.webmanifest). Footer logo is `loading="lazy"` and loads only on scroll.
- **Image bytes on load**: 6.4 KB (header logo, AVIF 2× at DPR 1.75). No content photos yet (job-photo slots are CSS placeholders with fixed `aspect-ratio`).
- **LCP element**: text on all 26 pages.
- **Preload / fetchpriority**: no `rel="preload"` and no `fetchpriority` in any page. **Correct for the current build**: the LCP is text and the only above-the-fold image is a 6 KB logo. (See Minor #4 for what happens when real hero photos are added.)
- **Unused CSS** (rules whose selectors match nothing on that page at load, mobile viewport): 10.7 % (Home) to 39.3 % (Privacy), typically 21–25 %. With 5.8 KB gzip in total this is ≈ 1–2 KB gzip per page, harmless. 25 rules are unused on every page: Tailwind preflight defaults (`hr`, `abbr`, `code`, `sub/sup`, `progress`…), state or future rules (`.faq[open] .faq-chev`, `.map-canvas iframe`, `.photo img`) and **12 stray utilities** (`.visible .absolute .fixed .static .sticky .block .inline .table .uppercase .underline .filter`, `space-y-1`) that Tailwind's automatic source detection picked up from ordinary words in project files. (Chrome's built-in CSS coverage cannot be used here: it reports the inline `@layer` sheet as 4 coarse ranges.)
- **Inline SVG sprite**: 4.3 KB raw, 15 symbols, ≈ 1.0 KB Brotli per page; every symbol is used somewhere on the site. Up to 69 `<svg><use>` instances on Home.
- **JSON-LD**: 5.1–13.1 KB raw = **8.7–16.6 % of the HTML** (max: Pricing 16.6 %, services 12.3–13.8 %), ≈ 1.0–1.3 KB Brotli. It is pretty-printed (minifying saves 1.7–4.2 KB raw but only ~130–190 B gzip) and sits in `<head>` **before** the `<style>` block, so the CSS starts at byte 7–15 K of the raw HTML instead of ~2 K.
- Marginal Brotli cost of each part on Home (15.2 KB total): CSS 5.2 KB, main content 4.0 KB, sprite 1.05 KB, JSON-LD 0.98 KB, inline script 0.96 KB, header 0.58 KB, footer 0.48 KB, mobile nav 0.1 KB.

## 4. Third parties, tracking and map facade

| Check | Result |
|---|---|
| No IDs set: third-party requests on load, after 5.5 s idle, and after a tap | **None** on `/`, service, area and contact pages. No tracking code in the HTML. Pass. |
| Dummy IDs: requests in the first 2 s after `load` with no interaction | **None**. Pass. |
| Dummy IDs: idle path | All 5 scripts requested at **3.0 s after load** (`requestIdleCallback` + 3 s). Pass. |
| Dummy IDs: interaction path | All 5 scripts requested **20–30 ms after the first tap**. Pass (but see Major #2). |
| Dummy IDs: Lighthouse (3 runs × 3 pages, third-party hosts blocked) | Perf 99–100, TBT 0–92 ms, LCP unchanged. The loader fires after Lighthouse's trace window, so lab TBT is unaffected. The real cost of the five tags (typically several hundred KB of JS) is **not** visible in lab tests and will show up in field INP/TBT. |
| Scripts loaded when both GTM and GA4/Ads/Clarity/Meta/UET IDs are set | `gtm.js` **and** `gtag/js`, `clarity`, `fbevents.js`, `bat.js` all load (5 scripts). See Major #2. |
| Map | Contact page: 0 iframes on load; the "Show map" button exists; after tap exactly 1 iframe (`https://maps.google.com/maps?cid=4373818382391816251&output=embed`) and that is the first request to Google. The iframe is absolutely positioned inside the fixed-ratio (16/7) canvas, so no layout shift on tap. Pass. |

## 5. Caching and headers (`netlify.toml`)

- `/_astro/*` → `public, max-age=31536000, immutable`. The only hashed assets are the logo AVIF/WebP files. Pass.
- HTML: no rule, so Netlify's default `public, max-age=0, must-revalidate` applies. Pass, **provided the `/*.png` rule below does not also match HTML** (Major #1).
- `/images/*`, `/favicon.svg` 1 week; `/site.webmanifest` 1 day with the correct content type. OK.
- Compression: Netlify compresses text responses (Brotli/gzip) automatically; nothing to configure. With no external CSS/JS, the only compressible responses are HTML, SVG, manifest, XML.
- Security headers present (not performance; HSTS has no `includeSubDomains`/`preload`, a note for QA 1).

## 6. Fonts and layout stability

- No web fonts: no `@font-face`, no Google Fonts, Lighthouse `numFonts: 0`. Body uses the spec's system stack. No fallback swap, so no font-related shift.
- CLS = 0 on all 26 pages (4× and 6× CPU, and with tracking IDs).
- Every `<img>` (2 per page: header logo 161×44, footer logo 65×56) has `width` and `height`. Image placeholders use `aspect-ratio` (16/9 or 4/3), map canvas 16/7. Top bar is `display:none` on mobile, header is `position:sticky`, sticky Call/WhatsApp bar is `position:fixed` with matching `body` bottom padding: no shifts.

## Findings

### Critical
None.

### Major

**M1. `[[headers]] for = "/*.png"` may apply a 1-week cache to every URL, HTML included.** Netlify's header paths are reliable only with `*` at the end of a path (`/images/*`). Netlify staff have stated that pattern characters after the first `*` can be silently dropped, which turns `/*.png` into `/*`. If that happens, every HTML page is served with `Cache-Control: public, max-age=604800`, so visitors and Google could see week-old prices and phone details after an update. This can't be tested locally, and the rule isn't needed.
*Fix* (netlify.toml): delete the `/*.png` block and list the files:
```toml
[[headers]]
  for = "/favicon-32.png"
  [headers.values]
    Cache-Control = "public, max-age=604800"
[[headers]]
  for = "/apple-touch-icon.png"
  [headers.values]
    Cache-Control = "public, max-age=604800"
[[headers]]
  for = "/icon-192.png"
  [headers.values]
    Cache-Control = "public, max-age=604800"
[[headers]]
  for = "/icon-512.png"
  [headers.values]
    Cache-Control = "public, max-age=604800"
```
Then, after deploy, check with `curl -sI https://mahapatraplumbing.in/pricing/ | grep -i cache-control`. Expected: `public,max-age=0,must-revalidate`.

**M2. The tracking loader loads GTM and the direct tags together, and does it inside the first tap.** In `src/components/Analytics.astro`, when `PUBLIC_GTM_ID` and any of GA4/Ads/Clarity/Meta/UET are set, all five scripts load (verified). `docs/tracking-plan.md` §5 says the direct tags are only a *fallback when GTM is not used*. Loading both doubles the JS and double-counts GA4 page views. Also, `load()` runs synchronously in the `pointerdown`/`touchstart` handler, so the scripts start running while the browser is handling the user's first tap. On a low-end phone that tap is often the hamburger menu or an FAQ, which risks a poor INP.
*Fix*:
```js
function load() {
  if (done) return; done = true;
  w.dataLayer = w.dataLayer || [];
  if (cfg.gtm) {                      // GTM present: it owns GA4/Ads/Clarity/Meta/UET
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    js('https://www.googletagmanager.com/gtm.js?id=' + cfg.gtm);
    return;
  }
  /* …existing direct-tag fallback unchanged… */
}
function soon() { (w.requestIdleCallback || function (f) { setTimeout(f, 1); })(load, { timeout: 2000 }); }
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { w.addEventListener(e, soon, { once: true, passive: true }); });
```
(Keep `w.__mpLoad = load` for the form's Meta path, and keep `__mpForward`, which already skips `gtag` when GTM is set.) Also cap the UET poll: `var n = 0, t = setInterval(function () { if (w.UET || ++n > 20) { clearInterval(t); if (w.UET) { … } } }, 500);`. Today the interval runs forever if an ad blocker blocks `bat.js`.
*Note for the owner/QA 1 (not performance)*: the builder's report calls this a "consent-aware loader", but the code does not check consent before loading the scripts.

### Minor

**m1. Home and all 14 service pages are ~0.7–0.9 KB over the first round trip.** Brotli size is 14.7–15.5 KB against a ~14.6 KB initial congestion window. That costs one extra RTT (FCP 0.77–0.84 s vs 0.62–0.66 s on area pages), and once tracking IDs are set every page will be over the line. *Fix*, in order of payoff:
  1. Serve the inline module script (`src/scripts/site.ts`, ≈ 1.0 KB Brotli) as an external hashed file. Astro does this by default when the script is not forced inline. It is a deferred module, so it does not block rendering, and `/_astro/*` is cached for a year, so repeat visits get it free. Saves ~1 KB on every page.
  2. Pin Tailwind's sources so stray utilities aren't generated. In `src/styles/global.css`: `@import "tailwindcss" source(none); @source "../";` (scans only `src/`). Removes the 12 unused utilities plus the `.container` media block (~0.5 KB raw).
  3. Minify the JSON-LD (`JSON.stringify(obj)` without indentation) and move the `<script type="application/ld+json">` blocks to the end of `<body>` (Google reads JSON-LD anywhere in the page). The CSS and hero then arrive in the first packets.
  Expected result: all 26 pages ≤ 14 KB Brotli, FCP ≈ 0.63 s, LCP ≈ 0.90 s everywhere, including with tracking IDs set.

**m2. TBT on 6× CPU reaches 100–300 ms in 7 of 18 runs** (Home and Patia). The cost is style and layout, not JS. Biggest levers: (a) Home has 807 DOM elements; the 26 service/area links appear three times (desktop dropdown, mobile `<details>` panel, footer). Render the mobile panel's link list from the same markup as the desktop dropdown, or trim the footer to the 6 core services + "All areas". (b) Avoid `:not(.cards):not(.chips):not(.trust)` chains on `.md > ul` selectors (a single `.md .prose-list` class is cheaper). Optional; the spec's 4× profile is met.

**m3. Unused CSS 11–39 % per page.** Harmless at 5.8 KB gzip. The stray utilities are fixed by m1.2. Leave the preflight rules.

**m4. Future hero photos: priority hints will be wrong on mobile for Home and service pages.** `renderImage(…, hero=true)` in `src/lib/content.ts` sets `loading="eager" fetchpriority="high"`. On mobile, Home and service pages place the hero image *below* the quote card (top ≈ 1,480 px on a 412×823 screen), so it would be fetched at high priority although it is off-screen. On area, Pricing, About and Contact pages (no card) the hero image starts at ~590–800 px, still below the fold. The text paragraph will stay the LCP element on mobile either way. *Fix*: for hero images use `loading="eager"` with **no** `fetchpriority` (or `fetchpriority="high"` only on pages whose hero has no card), and don't add a preload. Also, images placed in `public/images/` are emitted as a single `<img>` with no AVIF/WebP or `srcset`. Put all job photos in `src/assets/photos/` so they go through `getImage()`.

**m5. JSON-LD is 12–17 % of the HTML on service and pricing pages**, pretty-printed and placed before the CSS. Covered by m1.3.

**m6. The 404 page is not in this test** (not in the sitemap). Its HTML is the smallest (11 KB gz per the builder), so there is no risk.

## Top 5 improvements (by impact)

1. **M1** Replace the `/*.png` header rule with explicit file paths and verify HTML `Cache-Control` after deploy (prevents week-long stale HTML).
2. **M2** When GTM is set, load GTM only; defer the loader out of the tap handler with `requestIdleCallback`; cap the UET poll (protects field INP/TBT once tags go live, avoids double GA4 counting).
3. **m1** Get every page under ~14 KB Brotli: external hashed module script, pinned Tailwind sources, minified JSON-LD at the end of `<body>` (FCP −150 ms on 15 pages in the lab, and keeps all pages in one round trip after tracking is added).
4. **m2** Cut DOM duplication of the service/area link lists (Home 807 → ~600 elements) to lower the style/layout cost on low-end Android (TBT 100–300 ms at 6× CPU).
5. **m4** Fix the hero-image priority logic before real job photos go in, and route all photos through `src/assets/photos/` for AVIF/WebP + `srcset`.

## Re-run

Raw Lighthouse JSON and scripts: `/tmp/qa2/lh/{all,rerun,cpu6,base6b,exp6,env}`, `/tmp/qa2/tools/{server.mjs,run.sh,summ.mjs,bytes.mjs,cov2.mjs,tracking.mjs,seg.mjs}`. These are temporary and not part of the repo.
