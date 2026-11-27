# mahapatraplumbing.in

Website rebuild for **Mahapatra Plumbing Services**, District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016 · +91 9668875352 · open daily 8 AM – 10 PM.

Goal: turn the current single-page site into a fast, mobile-first, multi-page static site that ranks across Bhubaneswar (Google Search, Maps, AI answers) and brings in direct Call and WhatsApp leads.

## Status

- [x] Audit of the current site, Search Console, Google Business Profile and competitors
- [x] Ubersuggest project set up (56 keywords, 8 competitors, 15 AI-visibility prompts)
- [x] Rate card, hours, service area, contact methods and schema plan agreed
- [x] New logo received (`brand/`)
- [x] Phase 1 draft: keyword matrix + sitemap (`docs/sitemap.md`, awaiting approval)
- [x] Phase 2: page copy + JSON-LD (`content/pages/`, checked by `scripts/check_pages.py`)
- [x] Phase 3: static site build (Astro + Tailwind, `docs/build-spec.md`), ready for Netlify; first deploy pending owner review
- [x] Phase 4: tracking-ready (GTM / GA4 / Clarity / Ads / Meta / UET via environment variables; nothing loads until IDs are set)
- [ ] Real job photos for the `[IMAGE]` slots (drop them in `src/assets/photos/`)

## Folders

- `content/pages/` page copy (front matter + markdown + markers + JSON-LD); `content/data/reviews.json` Google review excerpts
- `src/` Astro site: `lib/content.ts` (loader + marker renderer), `layouts/Base.astro`, `components/` (top bar, header, footer, sticky bar, reviews, analytics loader), `scripts/site.ts` (the only client script), `styles/global.css`
- `scripts/` `make-assets.mjs` (logo/favicons/OG image from `brand/final/`), `check_pages.py` (content rules), `check_links.mjs` (links, anchors, canonicals, sitemap, internal linking), `size_report.mjs` (gzip budgets), `lighthouse.sh`
- `docs/` planning notes: keyword research, sitemap, schema, rate card, design and contact notes, tracking plan
- `brand/` logo files supplied by the owner
- `CHANGELOG.md` every change to the website is recorded here

## Notes

- Hosting: Netlify. Analytics IDs go in Netlify environment variables, never in the code.
- The repo is public during the build and will be made private when the work is done.

## How to run locally

Needs Node 22.23.4+ (`.nvmrc`) and, for the content check, Python 3 with PyYAML.

```bash
npm install
npm run dev            # http://localhost:4321 (also regenerates brand assets)
npm run build          # brand assets + static site into dist/
npm run preview        # serve dist/
npm run check:pages    # content rules (python3 scripts/check_pages.py)
npm run check:links    # after a build: links, anchors, canonical URLs, sitemap, inbound links (add -- --report for the table)
npm run check:size     # after a build: HTML/CSS/JS gzip per page vs the budget
bash scripts/lighthouse.sh   # Lighthouse mobile on 5 pages (needs Chrome; CHROME_PATH=...)
```

Edit page copy only in `content/pages/*.md`; the build fails on any unknown `[MARKER]`, a marker left in the HTML, or FAQs that do not match the JSON-LD.

Markers: `[CTA: ...]` Call/WhatsApp buttons (WhatsApp text = front-matter `whatsapp_prefill`), `[IMAGE: file.webp | alt="..." | where]` real photo if `src/assets/photos/<name>.(webp|jpg|png)` (optimised to AVIF + WebP) or `public/images/<file>` exists, else a fixed-ratio placeholder, `[MAP: ...]` map facade (iframe loads on tap), `[FORM: quick_quote|book_visit ...]` WhatsApp form, `[CARD LABEL: ...]` card heading, `[BREADCRUMB]` breadcrumb from the BreadcrumbList JSON-LD. Service pages get a Quick Quote card in the hero automatically.

## Tracking IDs (environment variables)

Set in Netlify → Site configuration → Environment variables (see `.env.example`), then redeploy. Empty = nothing is loaded.

| Variable | What |
|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager container (preferred: add GA4, Ads, Clarity tags inside GTM) |
| `PUBLIC_GA4_ID` | GA4 measurement ID (direct fallback without GTM) |
| `PUBLIC_CLARITY_ID` | Microsoft Clarity project |
| `PUBLIC_GADS_ID` | Google Ads `AW-...` ID |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel (Advanced Matching only when the visitor ticks the optional box on a form) |
| `PUBLIC_MS_UET_ID` | Microsoft Ads UET tag |

Scripts load after the first interaction or idle + 3 s. Every CTA carries `data-track`, `data-cta-location`, `data-page-type`, `data-service` / `data-locality`; events go to `window.dataLayer` with no personal data (`docs/tracking-plan.md`; the plan's `NEXT_PUBLIC_*` names are `PUBLIC_*` in Astro).

## Deploy on Netlify

1. Netlify → Add new site → Import from Git → this repo. `netlify.toml` sets build `npm run build`, publish `dist`, Node 22.
2. Add the tracking variables above when the IDs exist.
3. Domains: add `mahapatraplumbing.in` as the primary domain and `www.mahapatraplumbing.in` as an alias, enable HTTPS. `netlify.toml` 301-redirects `http://` and `www.` to `https://mahapatraplumbing.in/`; security and cache headers are set there too.
4. After deploy: submit `https://mahapatraplumbing.in/sitemap.xml` in Search Console, run PageSpeed Insights on the live URLs, test the WhatsApp forms on a phone, and update the Google Business Profile website link to `https://mahapatraplumbing.in/`.

