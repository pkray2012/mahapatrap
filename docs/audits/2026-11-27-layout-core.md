# Layout audit: core pages (27 Nov 2026)

Read-only audit of the built site. Pages: `/`, `/pricing/`, `/about/`, `/contact/`, `/privacy-policy/`, `/404.html`.

**Method.** `dist/` copied to `/tmp/la-core/site` and served on port 5092. Each page was screenshotted full-length with puppeteer-core and Chrome at 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px (`/tmp/la-core/shots/<page>-<width>.png`, cut into segments in `/tmp/la-core/seg/` and `/tmp/la-core/mont/`). Every segment was looked at by eye. A script also measured, for every page and width: `scrollWidth`, elements that run past the viewport, scroll containers that overflow, buttons that wrap, last lines of headings that are too short, characters per line, and grid row counts and heights (`/tmp/la-core/metrics.json`). Extra captures (dropdowns, mobile menu, anchor jumps, tables) are the `x-*.png` files in the same shots folder.

**Code refs** point to the current `src/` (`src/styles/global.css` line numbers as read today). Another agent is editing `src/lib/content.ts` (for example, service cards now have a `.svc-head` in src). Check the selectors again before applying fixes.

**What passed**
- No horizontal page scroll at any width. `scrollWidth === clientWidth` on all 48 page/width pairs. The only scroll containers that overflow on purpose are the review carousel below 768 px and the privacy table (see C1).
- The sticky mobile bar never covers the end of the page, because `body` gets bottom padding below 768 px.
- At 1920 px everything stays inside the 72rem wrap, so nothing stretches edge to edge.
- `#faq`: no link anywhere on the site points to an FAQ anchor. FAQ sections get slug ids (for example `#plumber-in-bhubaneswar-common-questions` and `#contact-faqs`), so there is no `#faq` target to test. The only in-page jump is `#book-a-visit` (see M1).

**Counts: 1 Critical, 10 Major, 17 Minor (28 total).**

---

## Critical

### C1. Privacy table hides its "Personal data we send" column and squeezes the text (all widths)
- **Page / widths:** `/privacy-policy/`, all 8 widths
- **Shots:** `x-privacy-table-1280.png`, `x-privacy-table-360.png`, `privacy-768.png`, `mont/privacy-390-m0.png`
- **What's wrong:** From 600 px up, the 3-column table "Cookies, pixels and the services we use" is wider than its box (1089 px of content in 894 px at ≥1024, 718 px at 768). The third column, "Personal data we send", is off screen unless the reader scrolls the table sideways, and there is no scroll cue. At 1280, "What it does" takes one long bold line while the Service column wraps to 3–4 lines ("Google / Tag / Manager"). Below 600 px, the phone stacking meant for rate tables kicks in. "What it does" is forced into a 7.5rem bold "price" column that runs 8–10 lines. The third-column header is hidden, so "None" and "Only with your choice" appear with no label. This is the legal disclosure, and its key column can't be read.
- **Cause:** The rate-table styles apply to every table. `global.css` L224 `.tbl td:nth-child(2) { font-weight:600; white-space:nowrap; color:navy }`. L217 right-aligns column 2 for non-`.tbl-3` tables. L227–241 is the phone `.tbl-3` grid that hides `thead th:nth-child(3)` and gives column 2 a width of 7.5rem. `content.ts` L274/277 already marks price tables with `data-pricing`, but the CSS ignores that attribute.
- **Fix:** Scope all price-cell rules to price tables:
  ```css
  .tbl[data-pricing]:not(.tbl-3) :is(th,td):nth-child(2) { text-align:right; }        /* was L217 */
  .tbl[data-pricing] td:nth-child(2) { font-weight:600; white-space:nowrap; color:var(--color-navy); } /* was L224 */
  @media (max-width:599px){
    .tbl[data-pricing] td:nth-child(2){ white-space:normal; min-width:6.5rem; }
    .tbl-3[data-pricing] table, .tbl-3[data-pricing] tbody, .tbl-3[data-pricing] thead { display:block; }
    /* …move every .tbl-3 phone rule (L233–240) under .tbl-3[data-pricing] */
  }
  /* Text tables (privacy): fixed, readable columns; stacked with labels on phones */
  .tbl:not([data-pricing]) table { table-layout:fixed; }
  .tbl-3:not([data-pricing]) :is(th,td):nth-child(1){ width:28%; }
  @media (max-width:599px){
    .tbl-3:not([data-pricing]) thead { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); }
    .tbl-3:not([data-pricing]) tr { display:block; padding:.5rem 0; border-bottom:1px solid var(--color-line); }
    .tbl-3:not([data-pricing]) :is(th,td){ display:block; width:auto; border:0; padding:.25rem .75rem; }
    .tbl-3:not([data-pricing]) td::before { content:attr(data-label) ": "; font-weight:700; color:var(--color-navy); }
  }
  ```
  In `content.ts` L265–277, add `data-label="<header text>"` to each `<td>` for tables that aren't price tables.

---

## Major

### M1. "Book a Visit" jump hides the form card's title and top edge (all widths)
- **Pages / widths:** `/` and `/contact/`, all widths
- **Shots:** `x-anchor-home-360.png`, `x-anchor-home-1280.png`, `x-anchor-contact-1280.png`
- **What's wrong:** The hero "Book a Visit" button and `/#book-a-visit` scroll so that the `<form>` sits 80 px from the top. The card's "Book a Visit" title, its padding and its blue top border are tucked under the sticky header (header bottom is 65 px on mobile, 73 px on desktop). The visitor lands on an unlabelled "Name" field.
- **Cause:** `content.ts` L184 puts `id="book-a-visit"` on the `<form>` inside `.form-card`, not on the card. `global.css` L31 `scroll-padding-top:5rem` only clears the header.
- **Fix:** Move the id to the card wrapper (`content.ts` L509: `<div class="card form-card" id="book-a-visit">`), keeping `book_visit` as the form's id/name. If the id must stay on the form, add `#book-a-visit{ scroll-margin-top: calc(5rem + 4.5rem); }`. Also raise the desktop clearance: `@media (min-width:768px){ html{ scroll-padding-top:6rem; } }`. The gap is only 7 px today.

### M2. Lonely 7th card in the "Bigger jobs" service grid (640 px and up)
- **Page / widths:** `/`, 768 (2 columns: 2+2+2+**1**) and 1024–1920 (3 columns: 3+3+**1**)
- **Shots:** `seg/home-1440-03.png` ("Commercial Plumbing" alone), `seg/home-768-look0.png`
- **What's wrong:** The second `.cards` list has 7 items, so the last row has one card and two empty slots. It looks unfinished.
- **Cause:** `global.css` L191–193 sets `.cards` to a fixed 2/3-column grid with no rule for a short last row.
- **Fix (CSS, works for any count):**
  ```css
  @media (min-width:640px) and (max-width:1023px){ .cards > li:last-child:nth-child(odd){ grid-column:1 / -1; } }
  @media (min-width:1024px){
    .cards > li:last-child:nth-child(3n+1){ grid-column:1 / -1; }
    .cards > li:nth-last-child(2):nth-child(3n+1){ grid-column:span 1; } /* 3n+2 case: fine as 2 */
  }
  ```
  A better option is to add an 8th "Not listed? Send a photo on WhatsApp" CTA card (8 = 2×4 on tablet). Then pair it with the 3-column rule above, or use a 4-column grid at ≥1280 (`repeat(4,…)`, 4+4).

### M3. About page shows two identical Call/WhatsApp rows back to back (all widths)
- **Page / widths:** `/about/`, all widths
- **Shot:** `seg/about-1280-03.png`
- **What's wrong:** At the end of "How do we work on every job?", two identical button rows are stacked. It reads as a rendering bug.
- **Cause:** In `content/pages/about.md` L79–83, `[CTA … location=pricing_table]` and `[IMAGE: plumber-written-estimate…]` are followed by `[CTA … location=inline_content]`. The image file doesn't exist, so per `global.css` L256 the marker "renders nothing" and the two CTAs touch.
- **Fix:** Delete the L83 CTA from `about.md`. Defensively, in `content.ts`, collapse adjacent CTA rows after rendering: `html.replace(/(<div class="cta-row">[\s\S]*?<\/div>)\s*(?=<div class="cta-row">)/g, '')`. Or skip a CTA marker when the previous block was a CTA.

### M4. Pricing rate tables: columns don't line up from table to table (600 px and up)
- **Page / widths:** `/pricing/`, 768–1920
- **Shots:** `seg/pricing-1280-01.png`, `seg/pricing-1280-02.png`
- **What's wrong:** The four stacked tables (Small repairs, Installations, Cleaning, Bigger jobs) each size their columns on their own. At 1280 the Price column starts at x = 525, 468, 426 and 426, and Notes jumps about too. Scanning prices down the page zig-zags.
- **Cause:** `global.css` L218 `.tbl table{ width:100% }` uses automatic table layout. No column widths are set.
- **Fix:**
  ```css
  @media (min-width:600px){
    .tbl-3[data-pricing] table{ table-layout:fixed; }
    .tbl-3[data-pricing] :is(th,td):nth-child(1){ width:46%; }
    .tbl-3[data-pricing] :is(th,td):nth-child(2){ width:24%; }
  }
  ```

### M5. Price column on phones is cramped; text prices wrap to 3–4 lines (360–599)
- **Pages / widths:** `/pricing/` 360–414, `/` 360 (2-column "Popular plumbing rates")
- **Shots:** `mont/pricing-390-m0.png` ("Call or / WhatsApp / us for a / quote", "Quote after / free site / visit"), `mont/home-360-m1.png` ("from / ₹2,999")
- **What's wrong:** The 7.5rem price column can't fit text prices, and "from ₹2,999" breaks between "from" and the amount.
- **Cause:** `global.css` L235/L237 `grid-template-columns: minmax(0,1fr) 7.5rem`; L229 `.tbl td:nth-child(2){ white-space:normal; min-width:6.5rem }`.
- **Fix:** Use `grid-template-columns: minmax(0,1fr) minmax(7.5rem, max-content)` and keep amounts whole: `.tbl[data-pricing] td:nth-child(2){ white-space:nowrap }` for cells that are only numbers. In content, shorten text prices to "On request" and "Free visit, then quote" (`content/pages/pricing.md`), or move the long wording into Notes.

### M6. Hero with no card or image is lopsided: right ~45% empty, H1 broken into 3 short lines (900 px and up)
- **Pages / widths:** `/pricing/`, `/about/`, `/contact/`, `/privacy-policy/`, 1024–1920
- **Shots:** `seg/pricing-1280-00.png`, `seg/about-1280-00.png`, `seg/contact-1280-00.png`
- **What's wrong:** `.no-card` heroes still use a 2-column grid (`"text img"`), but there is no image, so the text sits in a 1.15fr column and the right side is blank gradient. The H1 then wraps badly: "Plumber Charges in / Bhubaneswar: 2026 Rate / **Card**" and "About Mahapatra Plumbing / **Services,** / Chandrasekharpur".
- **Cause:** `global.css` L124–125 `.hero-grid.no-card{ grid-template-areas:"text img" }`. Columns come from L124 even when `.hero-img` is missing (`[...slug].astro` only renders `.hero-img` when `hasImg`).
- **Fix:**
  ```css
  @media (min-width:900px){
    .hero-grid.no-card:not(:has(.hero-img)){ grid-template-columns:minmax(0,1fr); grid-template-areas:"text"; }
    .hero-grid.no-card:not(:has(.hero-img)) h1{ max-width:24ch; }
  }
  ```
  This and m1 (`text-wrap:balance`) fix the orphans. The real fix is the planned job/technician photo in `.hero-img` (project brief: "real job/technician visuals").

### M7. Body text runs 88–96 characters per line (768 px and up)
- **Pages / widths:** all pages, 768–1920 (measured 88 characters per line at 1280 and 1920; about 81–90 at 768)
- **Shots:** `seg/home-1440-02.png`, `seg/about-1280-02.png`, `seg/contact-1280-02.png`
- **What's wrong:** This is above the 70–80ch target, so long paragraphs and FAQ answers are tiring to read.
- **Cause:** `global.css` L172 `.md p, .md > ul…, .md > ol { max-width:48rem }` (48rem at 16 px ≈ 90+ characters in this font). L244 `.faqs{ max-width:52rem }`. L131 `.hero-text > p{ max-width:40rem }` is fine.
- **Fix:** `.md p, .md > ul:not(.cards):not(.chips):not(.trust), .md > ol { max-width: 68ch; }`, and the same for `.faq-a p { max-width: 68ch; }`. Leave the 2-column list rule (L178) as it is.

### M8. Book-a-Visit split layout leaves a big empty block on the left (1024 px and up)
- **Pages / widths:** `/` and `/contact/`, 1024–1920
- **Shots:** `seg/home-1440-07.png`, `seg/home-1440-08.png`, `seg/contact-1280-01.png`, `seg/contact-1280-02.png`
- **What's wrong:** The form card is about 800 px tall. The left column (heading, 3–4 lines, CTA row) ends 350–500 px earlier, leaving a blank area beside the form. On `/contact/` the left column is just a heading and one paragraph. The copy also says "fill in the form **below**", but on desktop the form is on the right.
- **Cause:** `global.css` L149–153: a `:has(> .form-card)` 2-column grid with `align-items:start` and a left column with little content.
- **Fix:** (a) Make the left column sticky so it travels with the form: `.sec .wrap.md:has(> .form-card) > :not(.form-card){ position:sticky; top:6rem; }`. Applying it to the left children as a group works better: wrap them in a `<div class="bv-intro">` in `content.ts` and set `position:sticky; top:6rem; align-self:start`. Or (b) fill the left column with a short "What happens next" 3-step list (WhatsApp opens → we reply → written estimate). (c) Change "below" to "here" in `content/pages/home.md` and `contact.md`.

### M9. Services dropdown/menu: 13 links in 2 columns with wrapped, uneven rows and a lonely last link (768 px and up)
- **Pages / widths:** all pages; desktop dropdown 1024–1920, tablet menu 640–1023
- **Shots:** `x-dd-services-1024.png`, `x-mnav-768.png`, `x-mnav-360.png`
- **What's wrong:** On desktop, "Concealed Pipeline Repair & CPVC Plumbing" and "New House & Bathroom Plumbing" wrap. Rows have different heights (44/51 px) and the paired items in the other column float out of line. "Commercial Plumbing" sits alone on the last row. Repairs and bigger jobs are mixed together, unlike the home page's "Repairs / Bigger jobs" split. In the 360 menu, the wrapped item has less space above it than single-line items.
- **Cause:** `global.css` L111 `.dd-2{ grid-template-columns:repeat(2,…); min-width:34rem }` with row-major order. L93 `.dd-panel a{ min-height:44px }` has no vertical padding.
- **Fix:** Show two labelled columns, Repairs (6) and Bigger jobs (7), built in `Header.astro` from the same split the home page uses, with `grid-auto-flow:column; grid-template-rows:repeat(7,auto)`. Widen to `min-width:38rem` and use `white-space:nowrap` on `.dd-panel a` at ≥1024. Give the links `padding-block:.375rem` so wrapped items keep the same rhythm on mobile.

### M10. Phone number and opening hours split across lines (all widths)
- **Pages / widths:** `/` hero at 360/768 ("+91 / 9668875352"), `/about/` hero at 1280, `/pricing/` hero at 390, `/contact/` hero at 360 ("from 8 / AM"); "at a glance" table at 360 ("8 AM – 10 / PM"); `/contact/` details list at 360; `/` hero at 1440 ("10 / PM.")
- **Shots:** `seg/home-768-00.png`, `seg/about-1280-00.png`, `mont/home-360-m0.png`, `mont/contact-360-m0.png`, `seg/home-1440-00.png`
- **What's wrong:** The call number is the main conversion element. When it breaks after "+91", it looks wrong and is harder to read off. Times break between number and AM/PM.
- **Cause:** `content.ts` `linkPhones()` outputs `<a href="tel:…">+91 9668875352</a>` with a normal space. Times are plain text with normal spaces.
- **Fix:** In `linkPhones()` and `SITE.phoneDisplay`, use a no-break space (`+91 9668875352`), or add `a[href^="tel:"]{ white-space:nowrap; }` to `global.css`. In the markdown renderer, replace `/(\d{1,2}) (AM|PM)/g` with `$1 $2`, and use ` – ` around the en dash in "8 AM – 10 PM".

---

## Minor

### m1. Orphan words in headings, FAQ questions and short paragraphs (all widths)
- **Examples:** `/` H2 "What plumbing services do you offer in / **Bhubaneswar?**" (768–1920, `seg/home-1440-01.png`). `/` FAQ "…anywhere in / **Bhubaneswar?**" (1440, `seg/home-1440-07.png`). `/pricing/` H1 "…Rate / **Card**" (390, 1280). `/404` H1 "…was not / **found**" (390). `/privacy-policy/` H2 "Your rights under the DPDP / **Act**" (360/390). `/about/` H2 "How do we work on every / **job?**" (360). Booking paragraph ends "…to fix a / **time.**" (1440). Service card text "…from / **₹699.**" (390, 768, 1280). "…PGs and / **shops.**" (1024–1920).
- **Cause:** No `text-wrap` rules in `global.css`.
- **Fix:** In `@layer base`, add `h1,h2,h3,.card-title,.faq > summary h3{ text-wrap:balance; } p, li, figcaption{ text-wrap:pretty; }`.

### m2. Service cards have more space at the bottom than the top (all widths)
- **Page:** `/`. **Shots:** `seg/home-1440-02.png`, `mont/home-360-m0.png`
- **What's wrong:** Cards have 16 px of padding above the title but about 32 px below the text, so they look bottom-heavy and short cards look half-empty.
- **Cause:** `.md p{ margin-bottom:1rem }` (L172) also hits `.svc-card p` (L203 sets no margin-bottom).
- **Fix:** `.svc-card p{ margin-bottom:0; }`. Also `.svc-card{ display:flex; flex-direction:column; }` so equal-height cards keep the text at the top.

### m3. Dead space under hero text on mobile (below 900 px)
- **Pages:** `/pricing/`, `/about/`, `/contact/`, `/privacy-policy/` (about 48 px extra), `/` (about 24 px). **Shots:** `mont/privacy-390-m0.png`, `mont/pricing-390-m0.png`
- **Cause:** L122 `grid-template-areas:"text" "card" "img"` creates 3 rows even when card or image is missing. The empty rows still get `gap:1.5rem`.
- **Fix:** On mobile, drop the named areas and rely on source order: `@media (max-width:899px){ .hero-grid{ grid-template-areas:none; } .hero-text,.hero-aside,.hero-img{ grid-area:auto; } }`. Also trim `.hero-text > :last-child{ margin-bottom:0 }`.

### m4. Space at the bottom of sections varies (all widths)
- **What's wrong:** Space below the last item depends on what it is: table (24 px margin), CTA row (20 px), paragraph (16 px), or section padding. For example, "at a glance" ends 80 px above the next band while it starts 56 px below its own top (`seg/home-1440-01.png`).
- **Fix:** `.sec .wrap > :last-child, .hero-text > :last-child{ margin-bottom:0; }`.

### m5. Footer columns are unbalanced; wrapped links break the rhythm (all widths)
- **Shots:** `seg/home-768-look1.png` (about 300 px empty below the brand column next to the 13 services), `seg/home-1440-08.png` (Company has 4 links next to 13), `x-bottom-360-contact.png`
- **What's wrong:** "Concealed Pipeline Repair & CPVC Plumbing" and "Jayadev Vihar & Saheed Nagar" wrap at most widths. At 360 the 2-column Areas list makes "Nayapalli" float mid-height beside a 2-line item.
- **Cause:** L313–320 `.ft-grid`/`.ft-2`. L309 `.site-footer a{ min-height:44px }` / L319 `2.25rem` with no padding.
- **Fix:** At 640–1023, use `.ft-grid > :first-child{ grid-column:1/-1 }` and Services `ul{ columns:2; column-gap:1rem }`. At ≥1024, move "Company" under "Areas" in the same column (or give Services `columns:2`) to even out heights. Use `.site-footer li a{ padding-block:.25rem; line-height:1.35 }` and `.ft-2{ align-items:start }`.

### m6. Uneven spacing between footer contact rows (all widths)
- **Shot:** `seg/home-1440-08.png`
- **What's wrong:** The rows for address, directions, phone, email and hours have gaps of 64/48/48/39 px, because link rows are 44 px tall and the hours row is a plain `<p>`.
- **Fix:** `.site-footer address > p{ min-height:44px; display:flex; align-items:center; }` (address row: `align-items:flex-start`).

### m7. Review cards: blank areas inside cards and a lone "review" on the caption's second line (all widths)
- **Shots:** `mont/home-360-m2.png` (370 px card with about 150 px of text), `seg/home-1440-06.png` ("Local Guide · Google / review")
- **Fix:** Wrap the source in a no-wrap span: in `Reviews.astro`, change `· Google review` to `<span class="whitespace-nowrap">· Google review</span>`. For the carousel below 768, let cards size to their content: `.revs{ align-items:start }` (keep the stretch on the desktop grid).

### m8. Rating card shows the star twice (768 px and up)
- **Shot:** `seg/home-1440-06.png` ("5.0★" in large type, then a row of 5 stars directly below)
- **Fix:** Drop the `<span>★</span>` after the score in `Reviews.astro` (`rev-score`), or drop the star row.

### m9. "Read all reviews on Google" button wraps to 2 lines (360–414)
- **Shot:** `mont/home-360-m2.png` (button 214 px wide, 62 px tall)
- **Fix:** `.rev-cta .btn{ align-self:stretch; }` (full card width) or shorten the label to "All Google reviews".

### m10. 404: second heading crowds the chips; mobile list is long (all widths)
- **Shots:** `seg/404-1280-00.png` ("Areas we serve" about 20 px under the chips), `mont/404-390-m0.png` (16 chips, one per row)
- **Cause:** `.chips{ margin-bottom:1.5rem }` is the only gap before the next `h2`. No rule adds space before a second `h2` in a section.
- **Fix:** `.sec .wrap > * + h2{ margin-top:2.5rem; }`. Below 480 px, `.chips li{ flex:1 1 calc(50% - .25rem) }` gives a tidy 2-column grid.

### m11. Form card sits at the left with an empty strip on the right (640–1023)
- **Pages:** `/` hero and booking, `/contact/` booking. **Shots:** `seg/home-768-00.png`, `seg/home-768-look1.png`
- **Cause:** L140 `.form-card{ max-width:32rem }`, left-aligned.
- **Fix:** `@media (min-width:640px) and (max-width:1023px){ .form-card{ max-width:none; } }`, or center it with `margin-inline:auto`.

### m12. Key-value table: patchy zebra stripes and a narrow label column on phones
- **Shots:** `seg/home-1440-01.png`, `mont/home-360-m0.png`
- **What's wrong:** The label cells always have the page tint, so odd rows look checkered (tinted label, white value) and even rows look fully tinted. At 360 the 38% label column squeezes values ("Open daily 8 AM – 10 / PM").
- **Cause:** L223 `.tbl-kv tbody th{ background:var(--color-page) }` plus L215 zebra; L231 width 38%.
- **Fix:** Remove the `background` from L223 (keep zebra only), or drop zebra for `.tbl-kv`. On phones, `.tbl-kv tbody th{ width:7.5rem }` (fixed), so values get the rest.

### m13. Anchor clearance only 7 px on desktop (768 px and up)
- `scroll-padding-top:5rem` (80) against a 73 px header. See the M1 fix (`6rem` at ≥768).

### m14. Map card buttons have different widths when stacked (900 px and up)
- **Shot:** `seg/home-1440-05.png` ("Show map" 148 px over "View on Google Maps" 236 px)
- **Fix:** `.map-info .cta-row{ flex-direction:column; align-items:stretch; }` at ≥900, or keep them on one row.

### m15. Content blocks end at different right edges (1024 px and up)
- **What's wrong:** In one section, paragraphs stop at 48rem, FAQs at 52rem, tables and map at 56rem, and cards and reviews at 72rem (`seg/home-1440-01..07.png`). Each section has a ragged right edge, and single-column sections leave about 30% of the row blank.
- **Fix:** Use 2 widths: a text measure (`68ch`, M7) and a "wide" measure for tables, map and FAQs (`--measure-wide: 56rem`). Use the same value in L214, L244 and L263.

### m16. Thin sections look unfinished (all widths)
- `/about/` "Meet Amaresh Mahapatra" (3 lines, no photo; `seg/about-1280-02.png`). `/about/` "Who do we work for?" (2 lines; `seg/about-1280-04.png`). `/contact/` "What to send on WhatsApp" (1 sentence; `mont/contact-360-m0.png`). Each gets full 56 px section padding and its own tinted band.
- **Fix:** Merge them into the neighbouring section in content as `###` subsections, or add the owner photo and a short card list. CSS option: `.sec:has(.wrap > :nth-child(3):last-child){ padding-block:2rem; }`.

### m17. Thin page-colored strip between footer and mobile bar (below 768 px)
- **Shot:** `x-bottom-360-contact.png`
- **Cause:** L43 `body{ padding-bottom:calc(4.5rem + safe-area) }` (72 px), but the bar is about 69 px tall, so a 3 px light strip shows.
- **Fix:** `@media (max-width:767px){ .site-footer{ padding-bottom:calc(4.5rem + env(safe-area-inset-bottom)); } body{ padding-bottom:0; } }`.

---

## Outside layout scope (noted only)
- Visit charge on the site is ₹199–₹349 (glance table, rate tables, hero copy). The project brief says ₹149–₹299. Please confirm which is current.
- `/` places a FAQ CTA row and then the booking section's CTA row about one screen apart. That's acceptable, but worth thinning out when fixing M3.
