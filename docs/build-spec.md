# Build spec — mahapatraplumbing.in (Phase 3, agreed 27 Nov 2026)

## Stack (owner decision 27 Nov 2026)
- **Astro** (latest stable), static output (`output: 'static'`), deployed on **Netlify** (free).
- **Tailwind CSS** compiled at build time (no CDN). Only classes used end up in CSS.
- **Zero client JavaScript by default.** The only scripts allowed: (1) WhatsApp form builder, (2) none for the map (the Google Maps iframe is embedded directly with loading="lazy", changed 27 Nov 2026), (3) tracking helper (`pushTrackEvent`) + deferred tag loader (GTM only when a GTM ID is set; it does not check consent). All inline or tiny module scripts, deferred. No React/Vue/Svelte islands, no jQuery, no icon fonts, no Google Fonts.
- Icons: inline SVG components (no Lucide CDN).
- Content source: `content/pages/*.md` and `content/pages/areas/*.md` (front matter + markdown + markers), `content/data/reviews.json`. Never retype page copy into components.
- `scripts/check_pages.py` must still pass on the content.

## Mobile speed budget (hard requirement — owner, 27 Nov 2026)
- Lighthouse **mobile** Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on Home, one service page, one area page, Pricing, Contact.
- LCP < 2.0 s, CLS < 0.05, TBT < 100 ms (Lighthouse mobile, simulated 4G).
- Per page: HTML ≤ 60 KB gzip, CSS ≤ 15 KB gzip (one file, inlined if Astro inlines small styles), JS ≤ 10 KB gzip total, no render-blocking third-party requests.
- System font stack only (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif`).
- Images: Astro `<Image>`/`<Picture>` → AVIF + WebP, responsive `srcset`, explicit width/height, `loading="lazy"`; only an image that is actually first on screen on mobile may get `fetchpriority="high"`/eager (none today: the LCP element is the hero text; QA2 27 Nov 2026). Logo: `brand/final/mahapatra-logo-horizontal-navy@2x.png` converted to WebP sized for 2× display (~40–48 px tall in header), plus SVG icon for favicon.
- Google Map: embedded iframe with `loading="lazy"` (320px tall on phones, 400px from 768px), plus an address card and "Get directions" button (owner request, 27 Nov 2026). "Get directions" links to the listing (`https://www.google.com/maps?cid=4373818382391816251`).
- Tracking scripts (GTM/GA4/Clarity/Ads/Meta/UET) load **after first user interaction or `requestIdleCallback` + 3 s**, and only when their env ID is set. With no IDs set nothing loads.
- Prefetch: none by default (no link prefetching of all pages).

## Look (keep current layout, logo palette)
Follow `docs/design-contact-and-gbp.md` → "Current design (layout kept)" and "Colour palette (approved)". Navy #0A2A5C, Blue #0A7CC4 (hover #0866A3), Orange #F7901E accents only, Tint #EAF2FA, BG #F8FAFC, Text #1E293B, WhatsApp #25D366 (hover #1EBE5A). WCAG AA contrast. Rounded-xl/2xl cards, white bordered cards.

Global layout on every page:
1. Dark navy top bar: phone (tel:), hours "Open daily 8 AM – 10 PM", WhatsApp pill. Hidden on small screens if it hurts LCP/CLS (sticky bar covers it).
2. Sticky white header: logo (links /), nav (Services dropdown or simple links, Pricing, Areas, About, Contact), "Get a Quote" button (WhatsApp/quote form anchor). Mobile: hamburger using `<details>`/CSS only (no JS).
3. Breadcrumb (from `[BREADCRUMB]` marker; not on home).
4. Page body rendered from markdown.
5. Reviews strip (from `reviews.json`, pages in `showOn`, review choice from `pageMatch`; visible text only, link "Read all reviews on Google" → listing). No Review/aggregateRating schema.
6. Footer (navy): NAP, hours, all service links, all area links, Pricing/About/Contact/Privacy, "Serving all of Bhubaneswar", © year, white logo variant.
7. **Sticky mobile bottom bar** (< 768 px): two equal buttons "Call" (tel:+919668875352) and "WhatsApp" (wa.me with page prefill). Body gets bottom padding so content is never hidden. `data-cta-location="sticky_mobile_bar"`.

## Markers in the markdown (must be rendered, never shown raw)
- `[CTA: call+whatsapp | location=hero]` (and other locations) → Call + WhatsApp button pair. WhatsApp link uses the page's front-matter `whatsapp_prefill` (URL-encoded) to `https://wa.me/919668875352?text=...`.
- `[IMAGE: file.webp | alt="..." | where]` → real photo if `src/assets/photos/<name>.(webp|jpg|jpeg|png|avif)` exists (AVIF + WebP, responsive `srcset`, lazy), else **nothing** (no placeholder box, no caption; QA 27 Nov 2026). No photo gets `fetchpriority="high"`: on mobile the H1 and intro text are always first on screen.
- `[MAP: google-maps-listing]` → lazy Google Maps iframe + address card.
- `[BREADCRUMB]` → breadcrumb component (labels from the page's BreadcrumbList JSON-LD).
- Any other `[...]` marker → fail the build (so nothing raw leaks).
- Sections `## JSON-LD` and `## Facts to confirm` are **not rendered** as content. The JSON-LD block is injected as `<script type="application/ld+json">` in `<head>` exactly as written.

## SEO / technical
- `<title>` = `meta_title`, meta description = `meta_description`, canonical `https://mahapatraplumbing.in{url}` (trailing slash), `lang="en-IN"`, OG/Twitter tags (OG image: logo card 1200×630 generated at build).
- `sitemap.xml` (all 26 URLs, lastmod), `robots.txt` (allow all, sitemap line), `404.html`.
- Netlify `_redirects` / `netlify.toml`: force HTTPS and apex: `http://*`, `https://www.mahapatraplumbing.in/*` → `https://mahapatraplumbing.in/:splat` 301. Trailing slash consistent. Security headers (X-Content-Type-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal), long cache for hashed assets.
- One H1 per page (from content). Heading order preserved.
- Favicons from `brand/final/` (svg + 32/180/192/512 png) and a web manifest.

## Forms (keep both from the current site)
- Quick Quote (hero on home and service pages where the copy has a hero form marker or after hero CTA) and Book a Visit (contact page and home bottom): Name, Phone (WhatsApp), Area (select: the 8 areas + "Other area in Bhubaneswar"), Problem. On submit build a WhatsApp message (with `[Page: {page_tag} | Form: quick_quote|book_visit]`) and open `wa.me`. No backend. Inline 1–2 KB script.
- Consent line under each form: "By sending, you agree we may use your number to reply on WhatsApp. See our Privacy Policy." (link /privacy-policy/).
- Optional checkbox, **unticked by default**: "Use my details to improve ads" (Meta Advanced Matching per tracking-plan §5c). Only when ticked may hashed phone/first name be passed to Meta, and only if the Meta ID env var is set.
- Native validation (required, `type="tel"`, pattern for 10-digit Indian mobile), accessible labels, 44 px tap targets.

## Tracking hooks (implement now; IDs come later)
Follow `docs/tracking-plan.md` exactly: every CTA has `data-track`, `data-cta-location`, `data-page-type`, `data-service`, `data-locality`; one delegated click listener pushes `call_click` / `whatsapp_click` / `outbound_click` / `whatsapp_form_submit` / `generate_lead` to `dataLayer` (no personal data). Env vars: `PUBLIC_GTM_ID`, `PUBLIC_GA4_ID`, `PUBLIC_CLARITY_ID`, `PUBLIC_GADS_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_MS_UET_ID` (Astro uses `PUBLIC_` prefix; note the rename in tracking-plan.md). Nothing loads when unset.

## Done means
- `npm run build` passes with zero warnings about missing markers/links; `dist/` has all 26 pages + sitemap + robots + 404.
- Internal link checker over `dist/` finds 0 broken links.
- Lighthouse mobile results (or, if Chrome cannot run in the build environment, a size report proving the budgets) saved to `docs/audits/2026-11-27-build-performance.md`.
- README "How to run / deploy" section updated; CHANGELOG entry.
