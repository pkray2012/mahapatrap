# QA 3: design, mobile UX, accessibility, conversion (27 Nov 2026)

Scope: built `dist/` (26 pages + 404) served locally on port 5066. Chrome 153 via puppeteer-core, axe-core 4.x injected (WCAG 2.0/2.1/2.2 A+AA + best-practice). Viewports 360×800, 390×844, 768×1024, 1366×768. Read-only: no project files were changed.

Screenshots: `docs/audits/qa3-screens/` (`{page}-{width}-fold.png`, `{page}-{width}-full.png` (full pages at half size for 768/1366), `issue-*.png`, `mnav-open-390.png`, `dd-services-open-1366.png`, `faq-open-390.png`, `kbd-skiplink-390.png`, `footer-390-dpr2.png`). Note: in full-page shots the fixed Call/WhatsApp bar shows up part-way down the page. That is a capture artefact, not a bug.

**Counts: Critical 1 · Major 5 · Minor 14**

## What passes

- **Layout matches the brief.** The page order is navy top bar (≥768) → sticky white header → hero with Call Now + Book a Visit, trust row and Quick Quote card → service cards → at-a-glance and rate table → areas + map facade → reviews → FAQs → Book a Visit → navy footer. Colours stick to the palette: orange is only used for the accent underline, stars and focus ring, and WhatsApp green is only used on WhatsApp buttons.
- **Logo** is crisp at DPR 1 and 2 and not distorted (161×44, from a 2× source). The footer logo loads (lazy) with `alt=""`, and its link has an aria-label.
- **No horizontal overflow.** `scrollWidth == viewport` on all 27 pages at both 360 and 390.
- **Sticky mobile bar** shows on every page below 768 px. It is 69 px tall, body padding is 72 px plus the safe area, and the end of the footer stays clear of it (728 vs 731). Bar buttons are 52 px tall.
- **Above the fold at 360×800**, every page shows the H1 plus a Call action. The H1 bottom sits at 158–290 px, and the sticky bar is always in view.
- **Forms (5 tested: home QQ + BV, contact BV, leak QQ, tank-cleaning QQ):**
  - Every field has a label.
  - Empty submit blocks all 4 required fields with native messages. A bad phone number shows "Please match the requested format".
  - The "Use my details to improve ads (optional)" box is **unticked** by default.
  - The consent line and the `/privacy-policy/` link are present.
  - Submit opens `https://wa.me/919668875352?text=…`, which decodes to `Name: Ravi Das\nArea: Patia\nProblem: Kitchen tap leaking\n[Page: Home | Form: quick_quote]`. Page tags are correct: Home/Contact/Leak/TankClean, with quick_quote and book_visit.
  - CTA prefills are correct per page, e.g. Patia `…plumbing work in Patia, Bhubaneswar [Page: Patia]` and KIIT `…near KIIT, Bhubaneswar [Page: KIIT]`.
- **Keyboard:**
  - The skip link is the first Tab stop, is visible on focus with an orange 3 px outline, and goes to `#main`. The next Tab lands on the hero Call.
  - The hamburger and the Services dropdown open with Enter, and Tab moves into their links. Mobile nav links are 44–51 px tall, and the panel (633 px) ends above the sticky bar.
  - FAQ `<details>` opens with Enter and pushes `faq_open`.
  - Focus is visible on buttons, bar links, inputs (blue 2 px), checkbox, footer links and service cards.
- **Contrast** (own computation, including gradient backgrounds axe could not resolve): 0 failures at 390 and 1366 on home, leak, patia, contact, pricing and 404.
  - White on #0A7CC4 is 4.47:1. That passes only because `.btn` is 19 px/700, which counts as large text. No smaller blue-background text was found.
  - WhatsApp buttons use #072b16 on #25D366, which is about 9:1.
- **Landmarks:** one header, main and footer on every page. The navs are labelled Main / Mobile / Call or WhatsApp. There is one H1 per page.

## Critical

### C1. Every price table renders a broken, empty first row and loses its header styling (24 pages)
- **Pages:** all pages with a rate table: home, pricing (4 tables), about, privacy, every service page except water-tank-cleaning, all 8 area pages. Seen at all viewports.
- **Screenshots:** `issue-ratetable-leak-390.png`, `issue-ratetable-patia-390.png`, `pricing-390-full.png`.
- **Cause:** in `src/lib/content.ts` (postProcess, line ~269) the regex `/<th(?![^>]*scope)/g` also matches `<thead>`. Output is `<table> <th scope="col"ead> <tr>…`, so the browser invents a stray empty `<th>` row and the header row loses the tint styling. axe reports `empty-table-header` on 24 pages × 2 viewports. On a customer's phone it looks like a blank band above "Service | Price", right in the money section.
- **Fix:** change line 269 to
  `t = t.replace(/<th(?=[\s>])(?![^>]*scope)/g, '<th scope="col"');`
  Then rebuild and confirm `grep -c 'scope="col"ead' -r dist` returns 0.

## Major

### M1. On phones the Price column of rate tables is off-screen or clipped
- **Pages:** all area pages, home "Popular plumbing rates", service pages. Seen at 360 and 390.
- **Screenshots:** `issue-ratetable-patia-390.png` (Price column fully hidden; the visitor sees only service names), `issue-ratetable-leak-390.png` ("Quote after free site visi…" cut off).
- **Cause:** `.tbl table { min-width: 32rem }` plus `.tbl td:nth-child(2) { white-space: nowrap }` forces 512 px inside a 326 px box. The table does scroll inside its box (no page overflow), but nothing tells the visitor that the prices are to the right. Prices are the main reason a visitor opens these tables.
- **Fix** (global.css):
  ```css
  .tbl table { min-width: 0; }
  @media (max-width: 479px) {
    .tbl th, .tbl td { padding: .625rem .75rem; }
    .tbl td:nth-child(2) { white-space: normal; min-width: 7.5rem; }
  }
  ```
  If a table really is wider than the screen, add a right-edge fade, e.g. `background: linear-gradient(to left, #fff 0, transparent 24px) right/24px 100% no-repeat local`, plus a "Swipe for prices →" hint.

### M2. Reviews carousel on mobile is not keyboard-reachable and shows no scroll cue
- **Pages:** home, pricing, contact, about and 6 service pages (wherever the strip shows). Seen at 360 and 390.
- **Screenshot:** `issue-reviews-scroller-390.png`.
- **Problem:** axe reports `scrollable-region-focusable` (serious, WCAG 2.1.1): the cards inside `.revs` have no focusable content. The only visual cue is a peek of the next card, with no dots or arrow.
- **Fix** in `Reviews.astro`: `<ul class="revs" tabindex="0" role="region" aria-label="Google reviews">`. Add a small "Swipe for more reviews →" line under the strip on mobile (`md:hidden`).

### M3. Chips with trailing text break into 2–3 ragged columns
- **Pages:** area pages ("Plumbing services in {Area}" chips; e.g. Patia "Geyser installation and repair (plumbing side)", "Bathroom renovation plumbing and new house plumbing, after a free site visit"). Home areas list: "Plumber in Jayadev Vihar (and Saheed Nagar)". Seen at 360 and 390.
- **Screenshots:** `issue-chips-patia-390.png`, `home-390-full.png`.
- **Cause:** `.chips li { display: inline-flex }` turns the link and each text node into separate flex columns.
- **Fix:**
  ```css
  .chips li { display: block; padding: .6rem .875rem; line-height: 1.4; }
  .chips a { padding-block: .6rem; margin-block: -.6rem; display: inline; }
  ```
  This keeps the 44 px target through the padding. Better still, move the long "and new house plumbing, after a free site visit" text out of the chip into a sentence.

### M4. The trust and visual-proof goal is still unmet: every photo is a placeholder, some in prime spots
- **Pages:** all pages, at all viewports. The worst cases are:
  - Contact: a placeholder directly under the hero CTAs.
  - Pricing: a large placeholder before the rate card.
  - Home: a placeholder between "Read our reviews on Google" and the review cards.
- **Screenshots:** `contact-360-fold.png`, `pricing-390-full.png`, `home-1366-full.png`.
- **Problem:** the placeholders look intentional (fixed ratio, icon, caption), so this is not a rendering bug. Still, 2–4 striped boxes per page push prices, reviews and forms down by about 220 px each on mobile.
- **Fix:** before launch, drop in real job photos (`public/images/<file>.webp`). Until then, have the `[IMAGE]` renderer output nothing for missing files in production (keep placeholders only in dev, via `import.meta.env.DEV`). At minimum, remove the placeholder above the review cards and the one above the pricing table.

### M5. The phone field rejects common Indian formats
- **Pages:** all forms, at all viewports.
- **Problem:** the pattern `(\+?91\s?)?[6-9]\d{4}\s?\d{5}` rejects `09876543210`, `98765-43210`, `+91-98765-43210` and `987 654 3210`. Bhubaneswar customers often type a leading 0 or a hyphen. They get a generic "Please match the requested format", which can lose a lead.
- **Fix:**
  - Relax the pattern to `[\s\-]*(\+?91|0)?[\s\-]*[6-9](?:[\s\-]*\d){9}[\s\-]*`.
  - Normalise in `site.ts` with `v('phone').replace(/\D/g,'').slice(-10)`.
  - Change the helper `title` to "10-digit mobile number, e.g. 98765 43210".

## Minor

1. **Orphaned full stop after wrapped links.** Seen on home 390 ("Read about our plumbing company in Bhubaneswar" then "." on its own line); screenshot `issue-orphan-period-home-390.png`. It happens wherever an in-text link wraps.
   - **Cause:** `.md p a:not(.btn), .md li a:not(.btn) { display: inline-block }`.
   - **Fix:** use `display: inline; padding-block: .3rem; box-decoration-break: clone;` and drop the negative margin. Inline padding enlarges the hit area without changing layout.
2. **Escape does not close the hamburger or the Services/Areas dropdowns** (1366 and 390). Also, a dropdown stays open after keyboard focus tabs out of it, covering the hero (`dd-services-open-1366.png`).
   - **Fix** in `site.ts`: on `keydown` Escape, close `details.dd[open], details.mnav[open]` and focus their `summary`. On `focusout` of a `details.dd`, close it if `!dd.contains(e.relatedTarget)`.
3. **The hamburger label stays "Open menu" when open, and the icon does not change to an X** (390; `mnav-open-390.png`).
   - **Fix:** use the CSS `.mnav[open] > summary` rule to swap to a close icon, and an `aria-label` toggled in the existing click handler ("Close menu").
4. **Footer link tap targets are 36 px tall**, and the footer phone and email are 40 px (all pages, mobile). This passes WCAG 2.2 (24 px) but not the 44 px brief.
   - **Fix:** `.site-footer ul a { min-height: 44px }` and `.site-footer a { min-height: 44px }`.
5. **Breadcrumb "Home" link is 39×32 px** (25 pages, mobile). The `.crumbs a` padding .625rem is cancelled by `display: inline-block` plus `margin -.625rem`, and the measured box is 32 px.
   - **Fix:** `.crumbs a { padding: .75rem .25rem; }`.
6. **In-text links measure 35 px tall** (e.g. "plumber charges in Bhubaneswar", area names in body copy). This is acceptable for inline links (WCAG exception), and the fix in Minor 1 covers it.
7. **axe `region` (moderate) at 1366 on all pages:** the top-bar text sits outside any landmark.
   - **Fix:** wrap the top bar in `<aside aria-label="Contact and opening hours">`, or move it inside `<header>`.
8. **The skip link moves the scroll position but not focus** (activeElement = BODY). Chrome continues from #main, but older Safari and some screen readers do not.
   - **Fix:** `<main id="main" tabindex="-1">` plus `main:focus { outline: none }`.
9. **The phone number in body copy and the "at a glance" table is plain text, and `format-detection: telephone=no` stops iOS auto-linking it** (home, every hero intro; 9 unlinked mentions on home).
   - **Fix:** in `postProcess`, wrap `+91 9668875352` in `<a href="tel:+919668875352" data-track="call_click" data-cta-location="inline_content" …>` (skip it inside existing links). Or remove the format-detection meta.
10. **Footer tel and mailto links are missing `data-page-type`** (tracking-plan §2). Every other CTA has it.
    - **Fix** in `Footer.astro`: pass `page` in and add `data-page-type={page.fm.page_type}` (plus `data-service` / `data-locality`).
11. **No one-tap Call once the top bar scrolls away at 768–1366.** The sticky header has only "Get a Quote" (WhatsApp); the bar is hidden at ≥768. Screenshots: `home-768-fold.png`, `home-1366-fold.png`.
    - **Fix:** add a compact `tel:` button (phone icon + "+91 96688 75352") beside "Get a Quote" at `md+`, with `data-cta-location="header"`.
12. **Small text:** trust chips are 14 px, service-card and table text 15 px, consent 13 px, and the mobile-nav section labels 12 px uppercase. Body paragraphs are 16–17 px, which is OK.
    - **Fix:** raise `.svc-card p` and `.tbl table` to 1rem, and trust chips to .9375rem.
13. **Naming is inconsistent between nav/footer and page H1/cards.**
    - "Geyser Repair & Installation" vs "Geyser Installation & Repair".
    - "Concealed Pipeline Repair & CPVC Plumbing" vs "Pipeline & Concealed Plumbing".
    - "Water Tank & Sump Cleaning" vs the URL `water-tank-cleaning`.
    - **Fix:** use one `navName` per service, matching the card title.
14. **Desktop home "Book a Visit" leaves the right half empty** (1366, `home-1366-full.png`). The brief layout was "Book a Visit form + map".
    - **Fix:** use a 2-column grid at `lg`, with the form on the left and the NAP block (or the map facade) on the right. Also consider adding the Book a Visit form to area pages (they have CTAs but no form) and including the typed phone number in the WhatsApp message when it differs from the sender (optional).

## Not issues / notes
- axe `color-contrast` "incomplete" (294 nodes) are hero texts on a gradient. The manual check passes; the worst case is navy on #EAF2FA.
- Header `mnav` links reported as 24 px wide are inside the closed `<details>` and do not render. When the menu is open they are 358×44.
- Sticky bar body padding (4.5rem + safe area) vs bar height (69 px + safe area): correct.
- The mobile hero order differs between page types: service pages put the trust chips above the intro, area pages put them after the CTAs. Optional to align.

## Top 10 to fix first
1. C1 thead regex (one-line fix, 24 pages)
2. M1 rate-table price column hidden on mobile
3. M2 reviews scroller keyboard access + swipe cue
4. M3 broken chips on area pages and home
5. M5 phone pattern rejecting 0-prefix and hyphens
6. M4 placeholders above the reviews and the pricing table (and real photos before launch)
7. Minor 1 orphaned full stop after wrapped links
8. Minor 2 Escape and focus-out closing for the dropdowns and hamburger
9. Minor 4 + 5 footer and breadcrumb tap targets to 44 px
10. Minor 11 tel button in the sticky header for tablet and desktop
