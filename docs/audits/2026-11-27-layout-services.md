# Layout audit: 13 service pages (27 Nov 2026)

Read-only audit of the built output (`dist/`, copied to `/tmp/la-svc/site`, served on port 5093). Nothing was rebuilt or edited apart from this file.

**Pages:** bathroom-and-kitchen-fittings, bathroom-plumbing-renovation, borewell-pump-and-pipe-repair, commercial-plumbing, drain-cleaning-and-sewer-jetting, geyser-installation-and-repair, leak-and-blockage-repair, new-bathroom-and-house-plumbing, pipeline-and-concealed-plumbing, septic-tank-cleaning, sewerage-and-drainage-works, water-tank-and-motor-repair, water-tank-cleaning.

**Widths:** 360, 390, 768, 1024, 1366, 1920, plus extra sweeps at 600, 640, 700, 850, 900, 1000, 1100 and 1200 for tables, headings, the hero and the footer.

**Screenshots:** full-length shots are in `/tmp/la-svc/shots/<slug>-<width>.png`. Cropped segments are in `/tmp/la-svc/crops/`, element shots are `/tmp/la-svc/shots/el-*.png` and the raw metrics are in `/tmp/la-svc/results.json`. In the full-page shots the fixed mobile bar shows at the 900 px viewport line. That comes from the capture method, not from the site.

**Totals:** 1 Critical, 7 Major and 13 Minor issue groups, so 21 groups in all. Most of them repeat across pages.

## What passed (checked programmatically on all 13 pages × 6 widths)

- `scrollWidth > innerWidth`: 0 pages at any width. No page-level horizontal scroll.
- Elements whose box goes past the viewport (outside a scroller): none.
- Text clipped by `overflow:hidden`: none. The skip link (`sr-only`) is the only hit, and that is expected.
- Sticky header and anchors: `scroll-padding-top: 5rem` (80 px) is larger than the header (65 px mobile, 73 px desktop), so anchors are not hidden.
- Mobile bar: `body` gets `padding-bottom: calc(4.5rem + safe-area)` (72 px) and the bar is 69 px tall, so the footer's last line is not covered.
- Mobile nav panel, FAQ accordion spacing (`.faqs` gap .75rem, 56 px summaries) and the 768 px reviews grid (2 cards plus a full-width CTA) are all fine.
- Map card: no service page has one. Job photos: no service page has any (`.photo` count is 0 on all 13 pages). That is a gap against the "Trust & Visual Proof" objective, not a layout bug.

---

## Critical

### C1. Rate table spills sideways at 600–800 px and the Price column is cut off
- **Pages:** bathroom-plumbing-renovation, new-bathroom-and-house-plumbing, pipeline-and-concealed-plumbing. Overflow is 231 px at 600, 147 px at 700 and 79 px at 768. Commercial-plumbing, drain-cleaning-and-sewer-jetting, septic-tank-cleaning and sewerage-and-drainage-works also overflow by 13–19 px at 600.
- **Screenshots:** `/tmp/la-svc/shots/el-tbl-bathroom-plumbing-renovation-768-0.png`, `/tmp/la-svc/shots/bathroom-plumbing-renovation-768.png`
- **What's wrong:** At 768 the "Price" header and the right half of "Quote after inspection (free site visit + written estimate)" sit outside the box. The Service column shrinks to about 90 px, so "New / house / bathroom / plumbing" stacks one word per line. Users have to discover a sideways scroll inside the table, which is the page's main conversion content.
- **Cause:** `src/styles/global.css`, `.tbl td:nth-child(2) { white-space: nowrap; }` (line 224). From 600 px up it applies to every price cell. The phone override `@media (max-width:599px) { .tbl td:nth-child(2) { white-space: normal } }` stops at 599 px.
- **Fix:** Keep `nowrap` only where the price is short, and let long price text wrap from 600 to 1023 px:
  ```css
  @media (max-width: 1023px) {
    .tbl:not(.tbl-kv) td:nth-child(2) { white-space: normal; min-width: 7.5rem; width: 42%; }
  }
  ```
  A more robust option is to add a `price-long` class in `src/lib/content.ts` (table renderer, around line 277) to any price cell over 20 characters. Then use `.tbl td.price-long { white-space: normal; text-align: right; min-width: 10rem; }` and keep `nowrap` for short prices like "From ₹249".

---

## Major

### M1. Single-word last lines on headings, all pages and all widths
- **Pages:** all 13. The pattern is worst on the "How much does … cost in Bhubaneswar?" H2, where "Bhubaneswar?" sits alone at every width from 600 to 1920 on 12 pages. The H1 ends with "Bhubaneswar" alone at 360/390 and 900–1024 on 11 pages, and at 1366/1920 on geyser and new-house. Other repeated cases are "take?" (bathroom-reno), "floor?" and "covers" (pipeline), "builders" and "construction?" (new-house), and "cleaning?" (water-tank-cleaning) at 600–1920.
- **Screenshots:** `/tmp/la-svc/crops/commercial-plumbing-1024-01.png` (H2 ending "Bhubaneswar?"), `/tmp/la-svc/crops/top-leak-768.png` (H1 ending "Bhubaneswar").
- **Cause:** `src/styles/global.css` sets no `text-wrap` on headings. `.sec h2` has `max-width: 48rem` with a font size of `clamp(1.5rem, 4vw, 2rem)`, so these headings run just past one line.
- **Fix:** One global rule in `@layer base`:
  ```css
  h1, h2, h3, .card-title, .faq > summary h3 { text-wrap: balance; }
  p, li, td, figcaption { text-wrap: pretty; }
  ```

### M2. H1 is too large in the two-column hero at 900–1100 px
- **Pages:** all 13. The worst are geyser-installation-and-repair (4 lines at 900) and bathroom-renovation (3 lines plus the orphan "Kitchens)").
- **Screenshot:** `/tmp/la-svc/shots/hero-geyser-900.png`
- **What's wrong:** The hero splits into 2 columns at 900 px, but the H1 is still sized for the full viewport width. `clamp(1.75rem, 5.5vw, 2.75rem)` hits its 44 px maximum at 800 px, so a 476 px text column gets a 44 px headline. Before the trust strip starts, the H1 alone takes about 220 px.
- **Cause:** `src/styles/global.css`, `.hero h1 { font-size: clamp(1.75rem, 5.5vw, 2.75rem) }` (line 130)
- **Fix:**
  ```css
  @media (min-width: 900px) and (max-width: 1199px) { .hero h1 { font-size: 2.25rem; } }
  ```
  Or apply `font-size: clamp(1.75rem, 1rem + 2.4vw, 2.75rem)` everywhere. Add M1's `text-wrap: balance` as well.

### M3. Rate tables at 360/390: price cells wrap to 3–5 right-aligned lines and squeeze the Service column
- **Pages:** commercial-plumbing (10 rows, up to 5 lines), bathroom-plumbing-renovation, new-bathroom-and-house-plumbing, pipeline-and-concealed-plumbing, leak-and-blockage-repair and water-tank-and-motor-repair (up to 4 lines). Bathroom-and-kitchen-fittings has 3 lines.
- **Screenshots:** `/tmp/la-svc/shots/el-tbl-commercial-plumbing-360-0.png`, `/tmp/la-svc/shots/el-tbl-bathroom-plumbing-renovation-360-0.png`, `/tmp/la-svc/crops/leak-and-blockage-repair-360-02.png`
- **What's wrong:** Cells like "Quote after inspection (free site visit + written estimate)" become a 4-line ragged-left block. "₹299–₹799 + / parts" breaks the price itself. The bathroom-renovation warranty row is 5 lines in a 155 px column. The table reads as two narrow strips.
- **Cause:** `src/styles/global.css` lines 227–230: `min-width: 6.5rem` with right alignment and long free-text values. The `.tbl-3` stacked layout exists but no service page uses 3 columns.
- **Fix:** Under 600 px, stack each row: service on top, price under it, left-aligned.
  ```css
  @media (max-width: 599px) {
    .tbl:not(.tbl-kv) thead { display: none; }
    .tbl:not(.tbl-kv) tbody tr { display: grid; grid-template-columns: 1fr; }
    .tbl:not(.tbl-kv) tbody td { border-bottom: 0; }
    .tbl:not(.tbl-kv) tbody td:nth-child(2) { text-align: left; padding-top: 0; white-space: normal; }
    .tbl:not(.tbl-kv) tbody tr { border-bottom: 1px solid var(--color-line); }
  }
  ```
  Alternatively keep 2 columns and add `white-space: nowrap` only to short prices, using the C1 `price-long` class. Separately, shorten the copy (for example "Free visit + written quote") so the table works at any width. Keep "₹299–₹799 + parts" from breaking with `&nbsp;` before "parts".

### M4. Hero at 640–899 px: the quote card is pinned left with about 200 px of empty space beside it
- **Pages:** all 13 (768 measured: card 512 px wide in a 720 px column).
- **Screenshot:** `/tmp/la-svc/crops/top-leak-768.png`
- **What's wrong:** Above the card, the text, trust chips and CTAs use the full 720 px. The card then stops at 512 px and leaves a blank right gutter, so the hero looks unfinished on tablets.
- **Cause:** `src/styles/global.css`, `.form-card { max-width: 32rem; }` (line 140). The single-column hero grid only relaxes this through the `:has()` rule, which applies to content sections at ≥1024, not the hero.
- **Fix:**
  ```css
  @media (min-width: 640px) and (max-width: 899px) { .hero-aside .form-card { max-width: none; } }
  ```
  Then lay out the form fields in 2 columns at this width: `.hero-aside .wa-form { grid-template-columns: 1fr 1fr; }` with `.fld:has(textarea), .chk, .wa-form .btn { grid-column: 1 / -1; }`. Or center the 32rem card with `margin-inline: auto`.

### M5. Hero trust strip wraps raggedly at every width
- **Pages:** all 13.
- **Screenshots:** `/tmp/la-svc/crops/leak-and-blockage-repair-360-00.png` (4 stacked chips of widths 282/323/242/325 px), `/tmp/la-svc/crops/top-leak-1024.png` (4 rows at 900–1023), `/tmp/la-svc/crops/leak-and-blockage-repair-1366-00.png` (1 + 2 + 1 at 1100–1920).
- **What's wrong:** The 4 chips never form a tidy block. At 1366 and 1920, "5.0★ from 45 Google reviews" sits alone on the first row and "Written estimate…" alone on the last. At 900–1023 they stack 4 high and add about 150 px to the hero.
- **Cause:** `src/styles/global.css`, `.trust { display:flex; flex-wrap:wrap }` (line 134). Chip widths are set by their content.
- **Fix:**
  ```css
  .trust { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr)); gap: .5rem; }
  @media (max-width: 479px) { .trust { grid-template-columns: 1fr 1fr; } .trust li { font-size: .9375rem; } }
  ```
  This gives a 2×2 grid in the hero column and equal-width chips on phones. Shortening "Call or WhatsApp +91 9668875352" to "Call / WhatsApp 7 days" also helps, because the number is already in the CTAs.

### M6. Footer email breaks mid-word ("…@gmail.co / m")
- **Pages:** all 13. It happens at 640–767 and 1000–1099 (also seen at 1024).
- **Screenshots:** `/tmp/la-svc/shots/footer-640.png`, `/tmp/la-svc/crops/commercial-plumbing-1024-04.png`
- **Cause:** The `[overflow-wrap:anywhere]` class on the mailto link in `src/components/Footer.astro` (line 28). The address is a few px wider than the 2-column and 4-column footer cells.
- **Fix:** Remove `[overflow-wrap:anywhere]` and output `{user}<wbr>@{domain}` so any break falls at the `@`. Or set `font-size: .9375rem` on that link. For the 4-column grid, giving the first footer column `minmax(0,1.5fr)` also stops the wrap at 1024.

### M7. Desktop pages end on a text-only "Book …" section, and endings differ between pages
- **Pages:** 7 pages end with a one-paragraph "Book …" section that has 0 buttons and no form: bathroom-and-kitchen-fittings, borewell, drain-cleaning, geyser, leak, pipeline and water-tank-and-motor. The other 6 end on the FAQ CTA row. Reviews appear on only 6 of 13 pages (bathroom-fittings, bathroom-reno, commercial, leak, new-house, pipeline).
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-1366-04.png` (the "Book a leak repair" band: 252 px, one sentence, links only)
- **What's wrong:** At ≥768 the mobile bar is hidden, so a section named "Book" has no button. The section rhythm and the page ending also change from page to page.
- **Cause:** The content markdown for those 7 pages. `src/pages/[...slug].astro` renders the sections as written. The `.sec .wrap.md:has(> .form-card)` two-column layout (global.css lines 149–153) exists but these sections never use it.
- **Fix:** In `src/lib/content.ts`, when a section id starts with `book-`, append the standard `cta-row` (Call and WhatsApp) or the `quickQuoteCard(page)`. The existing `:has(> .form-card)` rule then lays it out in 2 columns at ≥1024. Make "Book …" the final section on all 13 pages, before Reviews.

---

## Minor

### m1. Reviews CTA card: the button wraps to 2 lines and the counts break awkwardly
- **Pages:** the 6 pages with reviews. The button is 62 px tall at 360–700. The leave-a-review link ends with "review" alone at 900–1100, and the count line shows "43 / five-star" at 390.
- **Screenshots:** `/tmp/la-svc/shots/el-revcta-commercial-plumbing-390-0.png`, `/tmp/la-svc/crops/commercial-plumbing-1024-04.png`
- **Cause:** `src/components/Reviews.astro` line 19 (`.rev-cta .btn-outline`). The carousel card is 85% of a 328 px column.
- **Fix:** `.rev-cta .btn { white-space: nowrap; font-size: .9375rem; padding-inline: .875rem; }` and change the label to "All Google reviews". Also use `&nbsp;` in "43&nbsp;five-star" and "Leave a&nbsp;review", plus `text-wrap: balance` on `.rev-write`. The 5.0★ rating also appears twice (the line under the heading and the CTA card); the line under the heading could go.

### m2. Rate tables are too wide for 2-column data at ≥1024 px
- **Pages:** all 13 (`.tbl` is 896 px wide). The worst is geyser, where 3 short rows leave about 450 px of white space between the service and its price.
- **Screenshot:** `/tmp/la-svc/shots/el-tbl-geyser-installation-and-repair-1366-0.png`
- **Cause:** `.tbl { max-width: 56rem }` (global.css line 214).
- **Fix:** `.tbl:not(.tbl-kv) { max-width: 40rem; }` (keep 48rem for `.tbl-kv`).

### m3. Three different right edges in the content column
- **Pages:** all 13 at ≥1024. Paragraphs and lists stop at 48rem (768 px), FAQs at 52rem (832 px) and tables at 56rem (896 px).
- **Screenshots:** `/tmp/la-svc/crops/leak-and-blockage-repair-1366-01.png`, `-1366-04.png`
- **Cause:** `.md p … { max-width: 48rem }` (line 172), `.faqs { max-width: 52rem }` (line 244), `.tbl, .map { max-width: 56rem }` (lines 214 and 263).
- **Fix:** Use one token, `--measure: 48rem`, for `.faqs`, `.tbl-kv` and `.map`, with narrower 2-column rate tables as in m2.

### m4. Body text lines are long at ≥1024 px
- **Pages:** all 13. Paragraphs are 768 px at 16 px, roughly 95–100 characters per line.
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-1366-02.png`
- **Fix:** `.md p, .md > ul…, .md > ol { max-width: 42rem; }` (about 75ch), or keep 48rem and raise body text to `1.0625rem` at ≥1024. At 1920 nothing gets longer, because `.wrap` caps the page at 72rem.

### m5. At desktop widths every content section is left-heavy, with about 45% of the width empty
- **Pages:** all 13 at 1366 and 1920. Content sits in 768 px at the left of a 1152 px container.
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-1366-02.png`
- **Fix (optional):** Add a sticky aside at ≥1200 px holding the rate summary or the quick-quote card: `.sec .wrap.md { display:grid; grid-template-columns: minmax(0,48rem) 1fr; }`. Or accept the gap and center the column. This is a design choice, not a bug.

### m6. Short one-paragraph sections make the band rhythm choppy
- **Pages:** "Hidden leak inside a wall or floor?" (280 px, leak), "Kitchen sink installation and repair" (252, fittings), "New bathroom plumbing in…" (254, new-house), "Simple habits…" (294, drain), and the "Book …" sections. At 1366, 3 colour bands can show in one screen.
- **Cause:** Every H2 becomes a full `.sec` with 56 px top and bottom padding (global.css line 167).
- **Fix:** Merge these into the neighbouring section as an H3, or add a compact variant: `.sec:has(> .wrap > h2 + p:last-child) { padding-block: 2rem; }`.

### m7. Key-value table zebra looks patchy
- **Page:** water-tank-cleaning (`.tbl-kv`), all widths.
- **Screenshot:** `/tmp/la-svc/shots/el-tbl-water-tank-cleaning-1366-0.png`
- **Cause:** `.tbl-kv tbody th { background: var(--color-page) }` (line 223) together with `.tbl tbody tr:nth-child(even) > *` zebra (line 215). Odd rows have a grey th beside a white td, and even rows are grey on both sides, which reads as a checkerboard.
- **Fix:** `.tbl-kv tbody tr:nth-child(even) > * { background: transparent; }` so the shaded th column stays as the only tint.

### m8. Services dropdown leaves one item alone on the last row, and rows don't line up
- **Pages:** all 13 at ≥1024.
- **Screenshot:** `/tmp/la-svc/shots/dd-open-1366.png`
- **What's wrong:** 13 links in 2 columns leave "Commercial Plumbing" alone on the last row. "Concealed Pipeline Repair & CPVC Plumbing" and "New House & Bathroom Plumbing" wrap to 2 lines, so the two columns drift out of line.
- **Cause:** `.dd-2 { grid-template-columns: repeat(2,…); min-width: 34rem }` (line 111).
- **Fix:** `min-width: 40rem` plus `.dd-panel a { white-space: nowrap; }`, and add a 14th "All services →" link (or show the list in 3 columns of 5/4/4 with `min-width: 48rem`).

### m9. Footer link lists: wrapped links look cramped and the Areas sub-columns touch
- **Pages:** all 13. "Concealed Pipeline Repair & CPVC Plumbing" and "Jayadev Vihar & Saheed Nagar" wrap at most widths. At 640–1023 the Areas `.ft-2` grid puts "Chandrasekharpur" flush against "Patia".
- **Screenshots:** `/tmp/la-svc/shots/footer-640.png`, `/tmp/la-svc/crops/leak-and-blockage-repair-360-06.png`
- **Cause:** `.site-footer a { display:inline-flex; min-height:44px }` (line 309) gives 2-line links a 1.6 line-height with no internal padding. `.ft-2 { column-gap: 1rem }` (line 314) is narrow.
- **Fix:** `.site-footer li a { padding-block: .5rem; line-height: 1.35; }`, `.ft-2 { column-gap: 1.5rem; }`, and drop `.ft-2` back to 1 column at 640–1023, when the footer itself has 2 columns. You could also shorten the labels ("Concealed Pipe & CPVC", "Jayadev Vihar").

### m10. Related-services chips: one alone on the last row
- **Page:** water-tank-and-motor-repair at 1366 and 1920 (3 chips: 2 + 1). Other pages with `related-services` use lists and are fine.
- **Screenshot:** `/tmp/la-svc/shots/el-rel-water-tank-and-motor-repair-1366-0.png`
- **Fix:** `.chips:has(> li:nth-child(3):last-child) { display:grid; grid-template-columns: repeat(auto-fit, minmax(16rem,1fr)); }` or render related services with the `.cards` grid.

### m11. Hero at ≥1100 px: the form card is about 180 px taller than the text column
- **Pages:** all 13. The card is 700 px tall against 517–670 px of text. Leak and drain show the biggest gap.
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-1366-00.png` (empty band under the Call and WhatsApp buttons)
- **Cause:** `.hero-grid { align-items: start }` (line 124).
- **Fix:** `.hero-grid:not(.no-card) { align-items: center; }`, or tighten the form (`.wa-form { gap: .5rem }` and a 3-row textarea) so the card is about 600 px tall.

### m12. Review carousel cards at 360/390 have a large blank gap above the reviewer name
- **Pages:** the 6 pages with reviews.
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-360-05.png`
- **Cause:** Grid rows stretch every card to the tallest one, and `figcaption { margin-top:auto }` pins the name to the bottom.
- **Fix:** Accept it (consistent card height is reasonable in a carousel), or use `.revs { align-items: start; }` with `figcaption { margin-top: .5rem; }` on phones only.

### m13. On phones the quick-quote form starts 800–1020 px down
- **Pages:** all 13 at 360 and 390 (form top: leak 805 px, geyser 1019 px).
- **Screenshot:** `/tmp/la-svc/crops/leak-and-blockage-repair-360-00.png`
- **Note:** This is intended: the Call and WhatsApp buttons and the sticky bar come first. If the form matters, shorten the hero intro on phones, for example by hiding the second hero paragraph on geyser with `.hero-text > p + .cta-row + p`.

---

## Repeat map (issue × pages)

| Issue | Pages | Widths |
|---|---|---|
| C1 table overflow | bathroom-reno, new-house, pipeline (+4 pages by 13–19 px) | 600–800 |
| M1 heading orphans | all 13 | all |
| M2 hero H1 size | all 13 (worst: geyser) | 900–1100 |
| M3 cramped tables | commercial, bathroom-reno, new-house, pipeline, leak, motor, fittings | 360/390 |
| M4 hero card pinned left | all 13 | 640–899 |
| M5 trust strip | all 13 | all |
| M6 footer email | all 13 | 640–767, 1000–1099 |
| M7 page endings without buttons | 7 pages end on "Book …" with no buttons | ≥768 |
| m1–m13 | see each issue | |

## Fix order

1. C1 and M3: table CSS (global.css lines 214–241), plus a `price-long` class in `src/lib/content.ts`.
2. M1: one `text-wrap: balance / pretty` rule.
3. M2, M4, M5 and m11: hero CSS (global.css lines 121–136).
4. M6: `<wbr>` in the Footer.astro email.
5. M7: CTA row in "Book" sections (`src/lib/content.ts`).
6. The minor issues, in any order.
