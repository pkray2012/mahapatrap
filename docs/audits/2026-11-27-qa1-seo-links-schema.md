# QA 1: SEO, AEO, GEO, links and schema (rendered `dist/`), 27 Nov 2026

Scope: the built site in `dist/` (26 pages + `404.html`). The build was current: no file in `content/` or `src/` is newer than `dist/index.html`. Read-only audit. No site files were changed.

Checks run:
- `node scripts/check_links.mjs --report`: **0 problems.** 2,802 internal URLs, sitemap has 26 URLs. Two orphan-risk warnings: `/` (0 inbound body links) and `/about/` (2).
- `python3 scripts/check_pages.py`: **26 pages, 0 problems.**
- My own parsing of every rendered page with BeautifulSoup (the scripts are not in the repo). It covered the head tags, every JSON-LD block, rendered FAQ text against FAQPage text, the visible breadcrumb against BreadcrumbList, the Plumber node on every page, assets that schema and OG point to, heading order, raw markers and markdown, owner-rule words, decoded `wa.me` prefills, `tel:` links, the markdown source compared sentence by sentence with the rendered `<main>` text, sitemap XML, robots and `netlify.toml`.

**Totals: Critical 0 · Major 3 · Minor 17**

---

## What passed (no action)

- **Head, all 26 pages:**
  - Exactly one `<title>` (44–60 chars) and one meta description (131–154 chars, with "+91 9668875352"). All titles, descriptions and H1s are unique.
  - Every title ends with "| Mahapatra Plumbing" or "| Mahapatra Plumbing Services".
  - One canonical per page (https apex, trailing slash). `og:url` equals the canonical.
  - `og:title` and `og:description` equal the title and meta description. `og:image` is 1200×630 and exists. Four Twitter tags.
  - `lang="en-IN"`, viewport, favicon SVG + 32 px + apple-touch icon, and a valid `site.webmanifest` whose icons exist.
  - No `noindex` anywhere except `404.html`.
- **JSON-LD:**
  - Exactly one `application/ld+json` block per page (none on 404). All parse.
  - The `@graph` types follow `docs/schema.md`. Home has no BreadcrumbList. The About and Contact pages use AboutPage and ContactPage.
  - There is no `aggregateRating` and no `Review` anywhere.
  - Every `https://mahapatraplumbing.in/...` URL in the schema resolves to a file in `dist/`: `logo-horizontal.png` (924×288), `og-default.webp` and the page URLs.
- **FAQPage:**
  - On all 24 pages with FAQs, the number of questions in the schema equals the number of `<details>` blocks.
  - Every question and every answer in the schema is identical to the rendered text. Two first-pass mismatches (contact email answer, commercial tank answer) came from a link boundary in my own text extraction. The text itself is identical.
- **Breadcrumbs:** on all 25 non-home pages, the visible breadcrumb labels and links match BreadcrumbList exactly.
- **WebPage nodes:** `headline` equals the H1, `name` equals the title, and `description` equals the meta description on every page. Every schema `keywords` term appears in visible text, at least as a natural "in Bhubaneswar" variant.
- **Content integrity:**
  - The visible text contains no raw `[CTA…]`, `[IMAGE…]`, `[FORM…]`, `[CARD LABEL…]` or `[MAP…]` markers.
  - No "JSON-LD" or "Facts to confirm" text is shown, no markdown syntax (`**`, `](`, `#`, pipe tables) and no HTML comments, in the page source or as visible text.
  - Comparing the markdown with the rendered text sentence by sentence lost no content. Every difference was a deliberate transform (trust chips, service cards) or the spacing bug in m1.
  - Every page has exactly one H1 and no skipped heading levels.
- **Owner rules, site chrome and body:**
  - Top bar and footer show exactly "Open daily 8 AM – 10 PM".
  - Phone `+91 9668875352` and `tel:+919668875352` are used everywhere. The address "District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016" is in the footer and in schema.
  - None of these appear anywhere: Justdial, Madanpur, Rasulgarh, Baramunda, 24/7, "no hidden charges", "guaranteed", "trained", "certified", "full service", "in one visit", or time-in-minutes claims.
  - "Mohapatra" appears only inside the email address.
  - "near me" appears at most once per page.
  - There is no AMC price, no heating-element or thermostat repair claim, and no septic method, partner or tanker wording.
- **WhatsApp prefills:** every `wa.me` link, decoded, equals its page's front-matter `whatsapp_prefill` on all 26 pages. The 404 uses its own `[Page: 404]` tag. All `wa.me` links have `target="_blank" rel="noopener"`.
- **Crawlability:**
  - `robots.txt` allows everything and names the sitemap.
  - `sitemap.xml` is valid XML with exactly the 26 canonical URLs, each with `lastmod`.
  - `404.html` is `noindex`, has no canonical and is not in the sitemap.
  - `netlify.toml` 301s `http://`, `http://www.` and `https://www.` to `https://mahapatraplumbing.in/:splat`.
  - There are no duplicate element IDs. FAQ answers, price tables and nav dropdowns are plain HTML (`<details>`, `<table>`). No content depends on JS except the map iframe and the WhatsApp form builder.
- **AEO structure:**
  - Every service and area page has 3–4 question H2s, each followed immediately by a `<p>`. Most answers are 40–60 words (see m15 for About).
  - Each intro after the H1 is 45–61 words and names the business, area and phone.
  - Entity facts are in crawlable text on home, about and contact: name, address and PIN, phone, hours, "all of Bhubaneswar", owner Amaresh Mahapatra, started in 2021, 10+ years, 5.0★ from 45 Google reviews, visit charge ₹199–₹349, 90-day warranty, and languages Odia, Hindi and English.

---

## Major

### M1. 72 photo placeholders with visible captions on 25 pages
- **Where:** every page except `/privacy-policy/`. See `grep -c data-image-slot dist/**/index.html`.
- **Evidence:** each `[IMAGE: …]` slot renders as `<figure class="ph" data-image-slot="…"><div class="ph-box">(icon)(camera)</div><figcaption>{alt text}</figcaption></figure>`. One example is on `/services/septic-tank-cleaning/`: the visible caption reads "Plumber opening a septic tank lid before cleaning at a home in Bhubaneswar", but no photo exists. `public/images/` and `src/assets/photos/` hold no job photos.
- **Why it matters:**
  - Owner rule: "Never put placeholder text in visible copy". The project goal is to "remove visible SEO placeholder text".
  - Crawlers and AI assistants read the `<figcaption>` as a description of real job evidence that is not there.
  - There is also no `<img>` for Google Images or a Maps/GBP photo match.
- **Fix:** before launch, do one of the following:
  - (a) Supply the real photos (filenames are listed in each page's "Facts to confirm"). Or:
  - (b) Until photos exist, render placeholders with **no visible caption**: drop the `<figcaption>` and keep the alt text only in `data-image-slot`/`data-alt`. Or hide empty slots entirely with `display:none` on `.ph`. Make the change in the IMAGE-marker renderer in `src/lib/content.ts`, so that a missing file outputs nothing (or `<figure class="ph" aria-hidden="true">` with no text).

### M2. WhatsApp forms leak name, phone and problem into the URL when JS has not run
- **Where:** `#quick-quote` (home and 13 pages with the hero card) and `#book-a-visit` (home, contact). For example, `dist/contact/index.html`.
- **Evidence:**
  - The `<form id="book-a-visit" class="wa-form" data-wa-form …>` has no `action` and no `method`.
  - Its fields have `name="name"`, `name="phone"`, `name="area"` and `name="problem"`. Only the inline module script (`src/scripts/site.ts:69–71`, `e.preventDefault()`) stops the default submit.
  - If JS is off, fails, or has not executed yet (module scripts run after parsing), the browser does a GET to `/contact/?name=…&phone=…&problem=…`.
  - Once GA4 or Clarity IDs are set, that `page_location` sends a phone number to Google and Microsoft. This breaks tracking-plan §8, the privacy rule against personal data in URLs, and GA4's PII terms.
- **Fix (in `src/lib/content.ts`, FORM renderer):**
  - Remove the `name` attributes. The script can read the fields by `id` (`qq-name`, `bv-phone`, …), so a no-JS submit sends nothing.
  - Or add `method="post"` so values never enter the URL.
  - Add `<noscript><p>Please call <a href="tel:+919668875352">+91 9668875352</a> or <a href="https://wa.me/919668875352">WhatsApp us</a>.</p></noscript>` inside each form card.

### M3. Home has 0 inbound body links, /about/ has 2 (orphan risk for the two entity pages)
- **Evidence:** the `check_links.mjs --report` table. `/` has 0 sources. `/about/` has 2 sources (`/` "about our plumbing company in Bhubaneswar", `/contact/` "about Mahapatra Plumbing Services"). Header and footer links do not count.
- **Fix:** exact copy edits below. The word counts stay inside the `check_pages.py` limits; the tight ones are noted. Each edit links existing words where possible. Links inside FAQ answers do not change the FAQPage text, because the plain words are unchanged.

**Links to `/` (anchor "plumber in Bhubaneswar" or "plumbing services in Bhubaneswar"):**

| # | File:line | Current text | New text | Words |
|---|---|---|---|---|
| H1 | `content/pages/areas/patia.md:98` (FAQ answer) | "We are a local plumber in Bhubaneswar, and the areas…" | "We are a local [plumber in Bhubaneswar](/), and the areas…" | +0 |
| H2 | `content/pages/areas/kiit.md:89` | "We serve all of Bhubaneswar from District Center, Chandrasekharpur." | "We are a [plumber in Bhubaneswar](/) based at District Center, Chandrasekharpur, and we serve the whole city." | +5 (884→889, limit 900) |
| H3 | `content/pages/about.md:51` | "We handle everyday repairs and bigger plumbing jobs anywhere in Bhubaneswar:" | "We handle everyday repairs and bigger plumbing jobs anywhere in Bhubaneswar. See all our [plumbing services in Bhubaneswar](/):" | +6 (774→780) |
| H4 | `content/pages/contact.md:50` | "…Jayadev Vihar and Nayapalli, and all of Bhubaneswar." | "…Jayadev Vihar and Nayapalli, and [all of Bhubaneswar](/)." | +0 (contact is at 496/500, so no new words) |

Optional: in the eight area pages' "Nearby: … and all of Bhubaneswar." chip lines (for example `areas/patia.md:100`), link "all of Bhubaneswar" to `/`. This adds 8 sources with a weak but locally relevant anchor.

**Links to `/about/` (vary the anchor and avoid repeating "about our plumbing company in Bhubaneswar"):**

| # | File:line | Current text | New text | Words |
|---|---|---|---|---|
| A1 | `content/pages/areas/kiit.md:121` (FAQ answer) | "No. Mahapatra Plumbing Services is an independent local plumber…" | "No. [Mahapatra Plumbing Services](/about/) is an independent local plumber…" | +0 |
| A2 | `content/pages/areas/chandrasekharpur.md:30` (end of paragraph) | "…under our 90-day workmanship warranty." | "…under our 90-day workmanship warranty. Read [about Amaresh Mahapatra, our owner](/about/)." | +6 (890→896, limit 900, tight) |
| A3 | `content/pages/commercial-plumbing.md:97` (after the "Open daily" bullet in "Why choose") | (new bullet) | "- **Owner-run.** Started in 2021 by Amaresh Mahapatra, who has 10+ years of plumbing experience. Read [about Mahapatra Plumbing Services](/about/)." | +21 (1165→1186) |
| A4 | `content/pages/pricing.md:100` | "We are at District Center, Chandrasekharpur, Bhubaneswar 751016." | "[Mahapatra Plumbing Services](/about/) is at District Center, Chandrasekharpur, Bhubaneswar 751016." | +2 (891→893, tight) |

Do not add the owner bullet to `new-bathroom-and-house-plumbing.md` or `bathroom-plumbing-renovation.md`. Both are at 1,283/1,300 words.

Result: `/` goes from 0 to 4 sources and `/about/` from 2 to 6. Rebuild, then rerun `check_links.mjs --report` and `check_pages.py`.

---

## Minor

**m1. A space before punctuation after links in link lists (9 occurrences, 5 pages).**
- Evidence:
  - `/areas/nayapalli/` ×5, e.g. "Water motor and tank repair ." and "Water tank and sump cleaning . Call or WhatsApp us…".
  - `/areas/kiit/` ×2: "Septic tank cleaning , from ₹2,999." and "…other buildings , including new washroom lines."
  - `/areas/niladri-vihar/` ×1: "… :".
  - `/services/water-tank-and-motor-repair/` ×1: "New house plumbing work , including sump…".
- Cause: `src/lib/content.ts:305` always inserts `' '` before the text that follows the link.
- Fix: `return \`<li>${html}${m[5] ? (/^[\s]/.test(m[5]) ? ' ' : '') + (marked.parseInline(m[5].trim()) as string) : ''}</li>\`;` This adds the space only when the source had one.

**m2. Service-card descriptions start in lower case (10 cards).**
- Evidence: `/areas/infocity/` (6), e.g. "running flushes and dripping taps.", "call or WhatsApp us for a quote.". `/areas/niladri-vihar/` (4).
- Fix: in `src/lib/content.ts:299`, upper-case the first letter of the description: `const d = m[5].replace(/^:\s*/, ''); d.charAt(0).toUpperCase() + d.slice(1)`. Or capitalise the text in the two markdown files.

**m3. Different names for the same service across nav, home cards, H1 and schema (GEO entity consistency).**
- Evidence (nav / home card):
  - "Geyser Repair & Installation" / "Geyser Installation & Repair"
  - "Bathroom Renovation Plumbing" / "Bathroom & Kitchen Plumbing Renovation"
  - "New House & Bathroom Plumbing" / "New Bathroom & House Plumbing"
  - "Concealed Pipeline Repair & CPVC Plumbing" / "Pipeline & Concealed Plumbing"
- Fix: in `content/pages/home.md`, rename the four service-card link texts to the nav labels. Keep H1s as they are, because they carry keywords.

**m4. Reviews strip shows a banned word ("Best") on 7 pages.**
- Evidence: the quote "Best quality work, well behaved and good communication…" appears on `/`, `/about/`, `/contact/`, `/pricing/`, `/services/commercial-plumbing/`, `/services/new-bathroom-and-house-plumbing/` and `/services/pipeline-and-concealed-plumbing/`.
- It is a verbatim customer quote, not our claim. Still, it is the only "best" on the site and sits in site chrome.
- Fix: in `content/data/reviews.json`, map those pages (`pageMatch`) to another review, e.g. "Very much satisfied with the quality of work. Plumbing charge was very reasonable." Or shorten the excerpt to start at "Well behaved and good communication…", if trimming excerpts is allowed.

**m5. The Plumber node is not identical on every page.**
- Evidence:
  - `/contact/` adds `contactPoint` with `availableLanguage: ["or","hi","en"]`. Other pages lack the languages, although the owner fact is sitewide.
  - `/pricing/` adds `hasOfferCatalog`. This is by design per `docs/schema.md` §4, so it is fine.
- Fix: move `contactPoint` (telephone `+91-9668875352`, contactType "customer service", `availableLanguage ["or","hi","en"]`, areaServed "IN") into the sitewide Plumber node in `src/lib/site.ts` (or wherever the shared node is generated). Leave `hasOfferCatalog` on pricing only.

**m6. Nearby areas the pages target are missing from schema.**
- Evidence:
  - Pages target "plumber in damana" (Chandrasekharpur) and "plumber near irc village bhubaneswar" (Nayapalli).
  - `spatialCoverage` on those pages lists only the main area. Jayadev Vihar does include Saheed Nagar.
  - The sitewide `areaServed` names none of Damana, Saheed Nagar or IRC Village.
- Fix: in the JSON-LD of `content/pages/areas/chandrasekharpur.md`, add `{ "@type": "Place", "name": "Damana, Bhubaneswar, Odisha" }` to `spatialCoverage`. In `areas/nayapalli.md`, add `{ "@type": "Place", "name": "IRC Village, Bhubaneswar, Odisha" }`. Optionally add the three to the Plumber `areaServed`.

**m7. `sitemap.xml` `lastmod` is the build date for every URL on every build.**
- Evidence: `src/pages/sitemap.xml.ts:8` uses `new Date()`. All 26 URLs show 2026-11-27, and every redeploy will mark everything changed. Google ignores `lastmod` that is always "now".
- Fix: use a front-matter `updated:` date per page, or the git last-commit date of the source `.md`, falling back to the build date.

**m8. The footer map link does not follow the spec.**
- Evidence: the footer link text is "Google Maps listing" with `data-track="outbound_click"`. `docs/sitemap.md` says footer: address + "Get directions" link, tracked as `directions_click`.
- Fix: in `src/components/Footer.astro`, change the text to "Get directions" and set `data-track="directions_click"`.

**m9. Small problems on the 404 page.**
- Evidence:
  - CTAs carry `data-page-type="legal"` and `data-service="404"`. "legal" is meant for the privacy policy only, so 404 clicks will be counted as privacy-page clicks.
  - The "Popular pages" list has no area links.
- Fix: in `src/pages/404.astro`, use `data-page-type="404"` (and add it to the tracking-plan allowed list) or leave it empty. Add the 8 area links under "Popular pages".

**m10. The About price table has no ₹ in its cells.**
- Evidence: `content/pages/about.md:72–75` has cells "199–349", "from 249", "from 349", "from 2,999". The ₹ is only in the header "Price (₹)". An AI quoting a single row loses the currency.
- Fix: write "₹199–₹349", "from ₹249", "from ₹349", "from ₹2,999", and change the header to "Price".

**m11. Generic anchor "contact page" on 13 pages.**
- Evidence: the `check_links` table, e.g. `/areas/*` "contact page", `/pricing/` "contact page", `/services/septic-tank-cleaning/` "contact page".
- Fix: change these to "contact Mahapatra Plumbing Services" (already used on 9 service pages) or "plumber Bhubaneswar contact number" (once, on `/pricing/`).

**m12. `/services/` and `/areas/` return 404.**
- Evidence: there is no hub page (breadcrumbs are 2-level by design). Users who trim the URL hit the 404.
- Fix: in `netlify.toml`, add 301s from `/services/` to `/#what-plumbing-services-do-you-offer-in-bhubaneswar` and from `/areas/` to `/#which-areas-of-bhubaneswar-do-you-serve`. Optionally build real hub pages later.

**m13. Two FAQ answers end with a cross-reference that reads oddly as plain schema text.**
- Evidence: in schema, `/areas/chandrasekharpur/` "…See our commercial plumbing page." and `/services/commercial-plumbing/` "…See water tank and sump cleaning."
- Fix: rephrase both in the markdown FAQ and the JSON-LD, e.g. "Our commercial plumbing service covers this." Or move the link out of the answer into the next paragraph.

**m14. Thin entity images and links.**
- Evidence:
  - OG and schema `image` are the same logo card on every page.
  - `sameAs` lists only the Google Maps URL.
- Fix: once real photos exist, set the Plumber `image` to a real van, team or job photo and give service pages their own `og:image`. Add any official Facebook or Instagram page to `sameAs`, if one exists. Never add Justdial.

**m15. Headings that weaken the answer-first structure.**
- Evidence:
  - The H2 "Quick Quote on WhatsApp" (form card label) is the first H2 on 14 pages, placed before the question H2s.
  - On `/about/`, the question H2s are followed by 11–17-word lead sentences and then lists ("Who is Mahapatra Plumbing Services?", "What work do we do?", "Who do we work for?", "What do customers say about us?").
- Fix:
  - Render `[CARD LABEL: …]` as `<p class="card-title">` instead of `<h2>`, in the CARD LABEL renderer in `src/lib/content.ts`.
  - On About, give each question H2 a 40–60-word answer paragraph before the list. Mind the 800-word limit (now 774), so trim list text to compensate.

**m16. The rating will go out of date.**
- Evidence: "5.0★ from 45 Google reviews (43 five-star)" is hard-coded in body copy on about 25 pages and in the home meta description.
- Fix: keep the number in `content/data/reviews.json` only, render it via a token, and show "as of {captured}" once on `/about/`. Re-check it monthly against the GBP listing.
- NAP and hours against GBP were **not** verified in this audit. No browser was opened; the owner requires permission first.

**m17. Hosting checks to run after the first deploy.**
- Confirm `/pricing` returns 301 to `/pricing/`. This needs Netlify's "Pretty URLs" on; the comment in `netlify.toml` assumes it.
- Confirm `<site>.netlify.app` 301s to the apex. Set the primary domain to `mahapatraplumbing.in` in Netlify's domain settings.
- Run `curl -sI http://www.mahapatraplumbing.in/pricing/` and expect one hop to `https://mahapatraplumbing.in/pricing/`.

---

## Notes for the other QA agents
- Image placeholders (M1) and the H2 card label (m15) also affect design and UX.
- `data-service` is empty on locality-page CTAs (only `data-locality` is set). This matches tracking-plan §2, but "leads by service" reports will show blanks for area pages. That is expected.
