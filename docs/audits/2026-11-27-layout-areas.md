# Layout audit: area pages (8) — 27 Nov 2026

Read-only audit of the built `dist/` (copied to `/tmp/la-area/site`, served on :5094, not rebuilt).
Pages: `/areas/{chandrasekharpur,patia,kiit,infocity,niladri-vihar,sailashree-vihar,jayadev-vihar,nayapalli}/`.
Widths: 360, 390, 768, 1024, 1366, 1920. Full-page shots: `/tmp/la-area/shots/<slug>-<width>.png` (48 files).
Cropped review segments: `/tmp/la-area/seg/`. Raw programmatic results: `/tmp/la-area/checks.json`.
Scripts: `/tmp/la-area/tools/run.cjs` (shots + checks), `probe.cjs` (DOM probes).

**Caveat:** `src/lib/content.ts` already emits classes that `dist/` and `src/styles/global.css` do not have yet
(`svc-ico`, `cards-sm`, `chip-ico`), so another agent is changing the services/chips markup. Re-check the
services-list findings (M4, m6) after the next build.

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 5 |
| Minor | 12 |
| **Total** | **17** |

**Clean checks (no issues on any page or width):**
- `scrollWidth > innerWidth`: none.
- Elements past the viewport: none. The only hit was the `sr-only` skip link, which is expected.
- Clipped text: none.
- Buttons wrapping to 2 lines: none.
- Sticky header vs anchors: `scroll-padding-top: 5rem` (80 px) is more than the header height (65 px mobile, 73 px at 768 and up).
- Mobile action bar: `.mbar` is about 69 px tall. `body { padding-bottom: 4.5rem }` (72 px) clears it, so the footer and the last CTA are not covered.
- Area pages have no form and no reviews block (`reviews.json` `showOn` lists no `/areas/` URL), so there was nothing to check for those. See m12.

---

## Major

### M1. Hero right column is empty from 900 px up (all 8 pages)
- **Widths:** 1024, 1366, 1920. It starts at 900.
- **Shots:** `shots/kiit-1366.png` (crop `seg/kiit-1366-0.png`), `shots/patia-1920.png` (crop `seg/patia-1920-top.png`), `shots/jayadev-vihar-1024.png` (crop `seg/jay-1024-top.png`), overview `seg/heroes-1366.png`.
- **What's wrong:**
  - No area page has a hero card or a hero image, so the hero grid is `wrap hero-grid no-card` and has a single child.
  - At 900 px and up, `.hero-grid` is 2 columns (`1.15fr / .85fr`, areas `"text img"`). The text sits in about 607 px and the right 40% of the first screen is blank.
  - Side effects of the narrow column:
    - The H1 runs to 3 lines on kiit, chandrasekharpur, infocity and jayadev (at 1024 to 1920).
    - Trust chips stack one per row (kiit, jayadev), which makes the hero tall.
- **Cause:**
  - `src/lib/content.ts:532`: `if (!heroCard && page.fm.page_type === 'service') heroCard = quickQuoteCard(page);` gives the card to service pages only.
  - `global.css`: `.hero-grid.no-card { grid-template-areas: "text img"; }` keeps 2 columns even when there is no image.
- **Fix (recommended):** give area pages the same quick-quote card. This also adds a conversion point above the fold.
  ```ts
  if (!heroCard && (page.fm.page_type === 'service' || page.fm.page_type === 'area')) heroCard = quickQuoteCard(page);
  ```
  - Use the real `page_type` value for area pages. Check the frontmatter.
- **Fallback (CSS only):** when there is neither a card nor an image, drop to one column:
  ```css
  @media (min-width: 900px) {
    .hero-grid.no-card:not(:has(.hero-img)) { grid-template-columns: minmax(0, 1fr); grid-template-areas: "text"; }
    .hero-grid.no-card:not(:has(.hero-img)) .hero-text > p { max-width: 44rem; }
  }
  ```

### M2. Body sections use only the left two-thirds of the container at 1024 px and up (all 8 pages)
- **Widths:** 1024, 1366, 1920.
- **Shots:** `seg/chandrasekharpur-1366-1.png`, `-2.png`, `-3.png`, `seg/infocity-1024-1.png`.
- **What's wrong:**
  - `.wrap` is 72rem (1152 px), but every text-only block stops earlier:
    - `.md p` / `ul` and `h2` stop at 48rem.
    - `.faqs` stops at 52rem.
    - `.tbl` and `.map` stop at 56rem.
  - Each of the 8 or 9 sections therefore has about 380 px of empty band on the right.
  - The pages look left-heavy and unfinished at 1366 and 1920. These pages have no images, cards or reviews to fill the space.
- **Cause:** `global.css`: `.sec h2 { max-width: 48rem }`, `.md p, .md > ul… { max-width: 48rem }`, `.faqs { max-width: 52rem }`, `.tbl, .map { max-width: 56rem }`, together with `.wrap { max-width: 72rem }`.
- **Fix (pick one):**
  - **(a) Recommended for conversion:** a 2-column body on area pages from 1100 px. The content column is about 46rem. A sticky right rail of about 20rem holds the quick-quote card, the trust list and the Call/WhatsApp buttons. In `[...slug].astro`, wrap the sections' `.wrap` contents in `<div class="area-body">` with `<aside class="area-rail">`:
    ```css
    @media (min-width: 1100px) {
      .area-rail { position: sticky; top: 6rem; }
      /* simplest: render the rail once, beside a wrapper around all sections */
      .area-layout { display: grid; grid-template-columns: minmax(0, 1fr) 20rem; gap: 3rem; max-width: 72rem; margin-inline: auto; }
    }
    ```
    - This is a component change in `src/pages/[...slug].astro`. Section background bands would need to move to the inner column or be dropped for area pages.
  - **(b) CSS only:** narrow and centre the reading container on area pages: `.sec .wrap.md { max-width: 52rem; }`. The hero must then also be single-column at 52rem (see the M1 fallback) so the left edges line up.

### M3. Line length is about 92–99 characters at 1024 px and up (all 8 pages)
- **Widths:** 1024, 1366, 1920.
- **Shot:** `seg/patia-1920-top.png` (body text under "What plumbing problems…").
- **What's wrong:**
  - Measured on patia@1366, the first paragraph has lines of 99, 96 and 92 characters.
  - FAQ answers (`.faq-a`, 52rem) are about 104 characters wide.
  - The comfortable range is 60–75 characters.
- **Cause:** `global.css` `.md p, .md > ul:not(…), .md > ol { max-width: 48rem }` at a 16 px system font; `.faqs { max-width: 52rem }`.
- **Fix:**
  ```css
  .md p, .md > ul:not(.cards):not(.chips):not(.trust), .md > ol { max-width: 68ch; }
  .faq-a { max-width: 68ch; }
  ```
  - Keep `.faqs` (the boxes) at the shared measure from m4.

### M4. Services section uses three different layouts; card grids leave orphans (infocity, niladri-vihar, sailashree-vihar)
- **Widths:** cards at 1024, 1366, 1920. Inconsistency at all widths.
- **Shots:** `seg/infocity-1024-1.png` (4 cards in 3 columns, then 2 cards in 3 columns), `shots/niladri-vihar-1366.png`, `seg/sail-360-0.png` (bulleted prose), `seg/naya-768-0.png` (chips).
- **What's wrong:**
  - The same "Plumbing services in <area>" block renders three ways:
    - Chips: chandrasekharpur, patia, kiit, jayadev, nayapalli.
    - Description cards: infocity (4 + 2), and niladri-vihar (4 cards + 2 chips mixed in one section).
    - A plain 2-item bullet list with inline links: sailashree-vihar.
  - In the card grids, 4 items in 3 columns leave one orphan card in row 2. The 2-item group leaves an empty third slot.
- **Cause:**
  - The renderer in `src/lib/content.ts:296-328` picks `cards` when every line has `: description`, otherwise `chips`. The area markdown files (`content/pages/areas/*.md`) are written inconsistently.
  - `.cards` is a fixed `repeat(3, …)` at 1024 px and up (`global.css`).
- **Fix:**
  1. Content: write every area's services block the same way. Recommended: two lists ("Repairs" / "Bigger jobs"), each line `- [Name](/services/x/): short description`, so all 8 pages get cards. Rewrite the sailashree list into this form.
  2. CSS, so card counts never orphan:
     ```css
     @media (min-width: 1024px) {
       .cards:has(> li:nth-child(4):last-child),
       .cards:not(:has(> li:nth-child(3))) { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 48rem; }
     }
     ```

### M5. Awkward heading breaks: one-word last lines and place names split (all 8 pages, all widths)
- **Shots:** `seg/kiit-1366-0.png`, `seg/sail-360-0.png`, `seg/naya-768-0.png`, `seg/jay-1024-top.png`.
- **Examples (`|` = line break):**
  - At 1024–1920:
    - kiit: "Which plumbing services can you book near | KIIT?", "Is there a maintenance plan for PG and hostel | owners?"
    - patia: "What plumbing problems do Patia homes usually | have?"
    - infocity: "Can a plumber come before our Infocity office | opens?"
    - jayadev: "Do you install and service geysers in Jayadev | Vihar?", "Which fittings can you change in a shop or | home?", "…Jayadev Vihar and Saheed | Nagar"
    - nayapalli: "Why choose Mahapatra Plumbing Services in | Nayapalli"
    - sailashree: "…Sailashree Vihar keep | leaking?"
    - H1s split as "Plumber in | Chandrasekharpur, | Bhubaneswar" and "Plumber in Jayadev | Vihar & Saheed Nagar, | Bhubaneswar"
  - At 360/390:
    - "Plumber in Sailashree | Vihar"
    - "…in IRC | Village?"
    - "…in Niladri | Vihar?"
    - "Common repair rates near | KIIT"
    - "A few rates for Niladri Vihar | jobs"
    - "Rates for common Nayapalli | jobs"
    - "Common prices for this | area"
- **Cause:**
  - No `text-wrap: balance` on headings (`global.css` `@layer base h1, h2, h3`).
  - Multi-word place names use ordinary spaces.
- **Fix:**
  ```css
  h1, h2, h3 { text-wrap: balance; }
  ```
  - In `content.ts` `postProcess()` (or when rendering headings and paragraphs), join place names with a non-breaking space: `Niladri Vihar`, `Sailashree Vihar`, `Jayadev Vihar`, `Saheed Nagar`, `IRC Village`, `District Center`, `KIIT Square`. Use a regex such as `/\b(Niladri|Sailashree|Jayadev) Vihar\b/g → '$1&nbsp;Vihar'`, and similarly `Saheed&nbsp;Nagar`, `IRC&nbsp;Village`.

---

## Minor

### m1. Extra 48 px blank band at the bottom of the hero below 900 px (all 8 pages)
- **Widths:** 360, 390, 768.
- **Shot:** `seg/kiit-360-hero.png` (blank under the trust chips); also visible in `seg/naya-768-0.png`.
- **Cause:** the mobile `.hero-grid` declares `grid-template-areas: "text" "card" "img"`. The card and image rows are empty but the 2 × 1.5rem row gaps still render. Measured on kiit@360: grid 849 px = 24 + 745 + 32 + 48 of gap.
- **Fix:** below 900 px, rely on source order and drop the template areas:
  ```css
  .hero-grid { display: grid; gap: 1.5rem; padding-block: 1.5rem 2rem; }  /* remove grid-template-areas here */
  .hero-text, .hero-aside, .hero-img { grid-area: auto; }
  @media (min-width: 900px) { .hero-text { grid-area: text; } .hero-aside { grid-area: card; } .hero-img { grid-area: img; } }
  ```

### m2. Rate table at 360/390: prices break mid-value and the service column runs 3–4 lines
- **Pages:**
  - kiit: "from / ₹349".
  - chandrasekharpur and niladri-vihar: "₹199– / ₹349".
  - sailashree-vihar: "Quote after free site visit + written estimate" takes 3 right-aligned lines, and "Visit / inspection (adjusted in final bill if work goes ahead)" takes 4 lines (row 123 px tall).
- **Shots:** `seg/kiit-360-0.png` (column 2), `seg/sail-360-0.png` (column 2).
- **Cause:** `global.css` `@media (max-width: 599px) { .tbl td:nth-child(2) { white-space: normal; min-width: 6.5rem; } }`. The price cell is 104 px wide and the text may wrap anywhere.
- **Fix:**
  - Keep each price atomic: wrap prices in `<span class="nowrap">` in the table renderer, or join with non-breaking characters: `from&nbsp;₹349` and `₹199&#8209;₹349` / `₹199–&#8288;₹349`.
  - Raise the column to `min-width: 7rem`.
  - Content: move "(adjusted in final bill…)" into the note line under the table, and shorten "Quote after free site visit + written estimate" to "Free site visit + quote".

### m3. Desktop rate table is too wide for 2 columns
- **Pages:** all 8. **Widths:** 1024 and up.
- **Shot:** `seg/chandrasekharpur-1366-2.png` (top).
- **What's wrong:** at 56rem (896 px) there is about 600 px of empty space between the service name and its right-aligned price, which makes rows hard to track.
- **Fix:** `.tbl:not(.tbl-3):not(.tbl-kv) { max-width: 40rem; }`. The zebra rows already help.

### m4. Inconsistent right edges between blocks
- **Pages:** all 8. **Widths:** 1024 and up.
- **What's wrong:** text stops at 48rem, FAQ boxes at 52rem, and the table and map at 56rem, so the right edge steps in and out down the page.
- **Shot:** `seg/chandrasekharpur-1366-2.png` and `-3.png`.
- **Fix:** add one token, `--measure: 48rem`, and use it for `.faqs`, `.map`, `.tbl` (or 40rem per m3) and `.md p`. This goes together with M2 and M3.

### m5. Area links in the nearby-areas paragraph split across lines
- **Examples:**
  - chandrasekharpur@1366: "Jayadev | Vihar".
  - kiit@360: "Sailashree | Vihar".
  - jayadev@390: similar splits.
- **Shots:** `seg/chandrasekharpur-1366-2.png` (Nearby areas), `seg/kiit-360-0.png` (column 3).
- **Cause:** `.md p a:not(.btn) { display: inline }` with normal spaces.
- **Fix:** the same `&nbsp;` place-name join as M5. Optionally, use the chip list (`.chips`) for the nearby-areas links on all pages, as kiit does.

### m6. Services and nearby chips look ragged; punctuation inside chips
- **Pages:** nayapalli, jayadev, patia, kiit, chandrasekharpur. **Widths:** all.
- **Shots:** `seg/naya-768-0.png` (middle column), `seg/kiit-360-0.png` (column 2).
- **What's wrong:**
  - Mixed chips, with and without trailing descriptions, give random widths.
  - nayapalli chips end with a full stop ("Geyser installation and repair.", "…sewerage and drainage works.").
  - At 360 every chip takes its own row, so the block reads as an uneven list.
- **Cause:** content lines carry trailing text and full stops. `.chips li { display: block }` sizes each chip to its content.
- **Fix:**
  - Content: remove the trailing full stops in chip lines.
  - Better: convert to cards per M4.
  - If chips stay: below 480 px, set `.chips li { flex: 1 1 100%; }` so they form an even full-width stack.

### m7. Map card: tall decorative canvas at 768–899; buttons and labels inconsistent
- **Pages:** all 8.
- **Shots:** `seg/naya-768-0.png` (right column), `seg/sail-360-0.png` (column 3).
- **What's wrong:**
  - At 768 the stacked 16:7 placeholder is about 270 px tall and carries no information.
  - "Show map" and "Get directions" buttons have different widths at 900 px and up.
  - The second button reads "Get directions" on most pages but "View on Google Maps" on sailashree-vihar.
- **Fix:**
  - `@media (max-width: 899px) { .map-canvas { aspect-ratio: 3 / 1; } }`
  - At 900 px and up: `.map-info .cta-row > .btn { flex: 1 1 0; }`, or `min-width: 12rem`.
  - Use one label (content / component).

### m8. Footer: email breaks mid-word at 1024; long link labels wrap
- **Pages:** all 8.
- **Widths:**
  - 1024: "amareshmohapatra143@gmail.c | om".
  - 360–1366: "Concealed Pipeline Repair & CPVC | Plumbing", "Jayadev Vihar & | Saheed Nagar".
- **Shots:** `shots/kiit-1024.png` (footer), `seg/chandrasekharpur-1366-3.png`, `seg/kiit-360-0.png` (column 4).
- **Cause:**
  - `Footer.astro:28` uses `[overflow-wrap:anywhere]` in the 1.35fr first column of `.ft-grid` at 1024 px and up.
  - Long nav names are used as-is.
- **Fix:**
  - Change `[overflow-wrap:anywhere]` to `break-all` only below 360, or set the email at `font-size: .9375rem` for 1024–1279 px.
  - Better: from 1024 to 1279 px use `.ft-grid { grid-template-columns: 1.5fr 1.2fr 1fr .7fr; }`.
  - Use shorter footer labels ("Concealed & CPVC Plumbing", "Jayadev Vihar") via `navName`.

### m9. Services dropdown: 13 items in 2 columns leave a lone last item
- **Widths:** 1024 and up, all pages (global).
- **Cause:** `.dd-2 { grid-template-columns: repeat(2, …) }` with an odd item count.
- **Fix:** span the last item: `.dd-2 > :last-child:nth-child(odd) { grid-column: 1 / -1; }`. Alternatively, add a 14th "All services" link.

### m10. CTA repetition makes mobile pages long
- **Pages:** all 8. **Widths:** 360, 390.
- **What's wrong:** each page has 5 in-content `.cta-row`s. Each is 2 full-width buttons, about 108 px, on top of the sticky Call/WhatsApp bar. That is roughly 540 px of repeated buttons, and pages run 7,600–8,700 px at 360.
- **Shot:** `seg/kiit-360-0.png`, `seg/sail-360-0.png`.
- **Fix:**
  - Below 768 px, where `.mbar` is visible, hide the middle CTA rows: `@media (max-width: 767px) { .sec:not(:last-of-type) .cta-row { display: none; } }`.
  - Alternatively, render them as a single compact text link.
  - Keep the hero and final-section CTAs.

### m11. Accent underline breaks across words and lines in multi-word H1s
- **Pages:** nayapalli ("Nayapalli & IRC Village"); also jayadev and sailashree where the accent phrase wraps.
- **Width:** 768. **Shot:** `seg/naya-768-0.png` (H1).
- **What's wrong:** the orange underline has gaps at the spaces and continues onto the next line.
- **Cause:** `.accent` uses `text-decoration` on a multi-word span (`content.ts:523`).
- **Fix:**
  - Accent only the first place name, e.g. "Nayapalli".
  - Or add `text-decoration-skip-ink: none; white-space: nowrap` on `.accent` when the phrase is 20 characters or fewer.

### m12. Area pages are text-only: no photos, reviews or cards to break up 8–9 sections
- **Pages:** all 8. **Widths:** all.
- **What's wrong:**
  - The only social proof is a single trust chip ("5.0★ from 45 Google reviews").
  - There are no job photos (`main img` count = 0 on every area page).
  - Sections alternate white and tint with only text, which adds to the empty feel of M2.
- **Fix:**
  - Add the area URLs to `content/data/reviews.json` → `showOn` so the `Reviews` component renders. The page template already supports it.
  - Add one job photo per page through the `.photo` marker, or as the hero image if the M1 card is not used.

---

## Top 10 fixes (in order)

1. **M1:** Quick-quote card in the area-page hero (`content.ts:532`), or the single-column fallback.
2. **M5:** `h1, h2, h3 { text-wrap: balance }` plus `&nbsp;` in place names.
3. **M2:** Fill or centre the desktop body (right rail or narrower centred container).
4. **M4:** One services-block format for all 8 area pages, plus `.cards` orphan rules.
5. **M3:** Body measure set to 68ch.
6. **m2:** Atomic prices and tidier copy in the 360 px rate table.
7. **m1:** Remove the empty hero grid rows below 900 px.
8. **m12:** Reviews on area pages (`reviews.json` `showOn`) and a job photo.
9. **m4 + m3:** One shared measure token; narrower 2-column rate table.
10. **m10:** Hide the repeated mid-page CTA rows on mobile, since the sticky bar is present.
