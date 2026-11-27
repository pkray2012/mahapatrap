# Design polish pass: colour harmony + UI/UX (27 Nov 2026)

Scope: owner request "make sure the website uses a good colour combination and good UI/UX". This is a polish pass, not a redesign. The agreed layout (design-contact-and-gbp.md "Current design (layout kept)") and the logo palette stay as they are. Changes are limited to CSS, components and the logo export size. No page copy changes. No new JS. System fonts stay.

Method: built `dist/` was served on :5077 and captured with Chrome 153 (puppeteer-core) at 390×844 and 1366×768: home, pricing, contact, leak-and-blockage-repair, water-tank-cleaning and areas/patia, fold and full page. Before: `/tmp/design-before/`. After: `/tmp/design-after/`. Contrast was computed with the WCAG 2.x formula.

## Critique (before)

**What already works:** the palette is right and mostly used in the right places. Navy is used for headings and dark bands, blue for actions, green for WhatsApp, and orange is kept small. The type scale is sane, body line-height is 1.6, and tap targets are 44–52 px. Rate tables are readable on phones since QA3. The sticky mobile bar is clear.

| # | Area | Problem (before) | Severity |
|---|---|---|---|
| 1 | Section rhythm | "Tinted" sections use #F8FAFC on a white page (1.04:1). The alternation is invisible, so long pages read as one grey-white wall. Card borders on white do all the separating. | High |
| 2 | Hero → first section | The hero fades to #EAF2FA, and the first section was also the "tint" one. The seam reads as a muddy band. | Medium |
| 3 | Header button hierarchy | Desktop header has two identical filled blue buttons: "Get a Quote" (opens WhatsApp, with a WhatsApp icon) and "Call". Two primaries side by side, and a WhatsApp action is styled as a blue Call-type button, which mixes up the colour roles. | High |
| 4 | Header logo | The header logo is 44 px tall at every width. That is small next to 72 px of header and 48 px buttons on desktop. The 2× source is only 88 px tall, so it cannot go larger and stay sharp. | Medium |
| 5 | Focus ring | 3 px orange (#F7901E) on white is 2.34:1, below the 3:1 non-text contrast guidance (WCAG 1.4.11 / 2.4.13). It is also off-brand for an action colour. | High |
| 6 | Form fields | Input borders #94A3B8 are 2.56:1 on white, below 3:1. Empty fields look faint on phones in sunlight. | Medium |
| 7 | Desktop empty space | Book a Visit (home, contact) is a 32 rem form on the left, with the right half of the screen empty (QA3 minor 14). The "Why choose" checklists are a single 48 rem column, leaving the right third empty. | High |
| 8 | Map facade | At 1366 the map placeholder is a 900×390 px empty illustration, the biggest block on the page, and carries little information. | Medium |
| 9 | Trust chips | Fully rounded pills turn into lozenges when the text wraps to 2 lines on phones ("90-day workmanship warranty…"). | Low |
| 10 | Rate tables | No row striping, and prices are left-aligned next to long service names. On desktop the eye has to travel to find the price. | Medium |
| 11 | Cards | Service cards, FAQ, chips, map, tables and review cards each have slightly different shadows and hover states, and only service cards respond to hover. FAQ open state is not distinguished. | Low |
| 12 | Section headings | H2s sit straight on the background with no anchor. Sections blend together, especially with #1 fixed only weakly. | Low |
| 13 | Footer | On phones the footer is one 1,500 px single column, since 8 short area names and 4 company links each take a full row. On desktop the first column is the narrowest, so the email breaks mid-word ("…@gmai / l.com"). Headings have no accent. Links are 44 px tall even on desktop, which looks loose. | Medium |
| 14 | Buttons | There is no pressed state or transition. The outline button hover (tint) is the only feedback. Animations do not respect `prefers-reduced-motion` (FAQ chevron, card hover). | Low |
| 15 | Nav | There is no "you are here" state on Pricing/About/Contact. | Low |
| 16 | Tokens | Colours sit in `@theme` but several raw hex values are repeated in rules (`#fff`, `#94a3b8`, `#072b16`, `#dbe5f1`, rgba navy shadows). There is no single source for radius or shadow. | Low |

Not changed on purpose: the page order, the copy, the two-channel CTA rows (Call blue + WhatsApp green are two channels, not two primaries), WhatsApp green #25D366 with dark text (white text on #1DA851 is only 3.10:1, so it fails AA for normal text; #072B16 on #25D366 is 7.75:1), and the placeholder-free photo slots (they still wait for real job photos).

## Planned changes (before → after)

1. **Tokens (one source):** add `--color-wa-ink`, `--color-field`, `--color-on-navy`, `--color-on-navy-muted`, plus `--radius-card`, `--shadow-card`, `--shadow-raise` and `--ring` in `@theme`, and replace the raw hex values in rules with them.
2. **Section rhythm:** #F8FAFC alternation → white / tint #EAF2FA alternation, driven by CSS `main > section.sec:nth-of-type(odd)`, so the first section after the hero is always white and the standalone reviews section joins the rhythm.
3. **Section heading accent:** add a 40×3 px orange bar under each section H2 (orange as thin accent only).
4. **Header CTAs:** "Get a Quote" changes from filled blue to a secondary navy outline with a green WhatsApp icon. "Call" stays the only filled primary.
5. **Header logo:** 44 px → 44 px on mobile and 54 px from 768 px. The source is re-exported at 112 px tall (2× of 56) so it stays sharp at DPR 2.
6. **Nav current page:** add `aria-current="page"` and an underline/tint state on Pricing/About/Contact.
7. **Focus ring:** orange 3 px → brand blue #0866A3 3 px with 2 px offset (6.1:1 on white, 5.4:1 on tint). On navy bands (top bar, footer) it is orange (5.98:1 on navy).
8. **Form fields:** border #94A3B8 (2.56:1) → #7A8CA3 (3.44:1), with a blue hover border and a soft blue focus halo.
9. **Book a Visit desktop layout:** a section that contains a form card becomes a 2-column grid from 1024 px. The heading, intro, CTA and NAP sit on the left, and the form card sits on the right, so there is no empty half.
10. **Checklists on desktop:** lists with 6+ items flow into 2 columns from 1024 px.
11. **Map facade:** from 900 px it changes from a stacked 16:7 picture to a side-by-side card (picture left, address + buttons right), about 260 px tall instead of about 520 px.
12. **Trust chips:** radius 999px → .75rem, and the check icon sits in a small tinted circle.
13. **Rate tables:** add zebra rows (#F8FAFC) and right-align prices in 2-column rate tables; the header keeps the tint.
14. **Cards:** one card style (radius 1rem, #D6E2EF border, the same shadow) for cards, service cards, FAQ, map, tables and chips. Service cards get a hover lift and blue title, and FAQs get a hover state and a blue left border when open.
15. **Buttons:** add a 1 px pressed state, a subtle shadow on filled buttons and a 150 ms colour transition. All motion is off under `prefers-reduced-motion`.
16. **Footer:** on phones, Areas and Company links flow in 2 columns. On desktop the first column is wider (no mid-word email break), links are 36 px tall from 1024 px (44 px on touch sizes), headings get an orange accent, and muted text is #B8C7DB (8.2:1).
17. **Reviews:** the cards get a large tint quote mark (decorative, hidden from screen readers). The stars stay orange.

## Result (after)

All 17 planned changes are in. One fix came up during review: the side-by-side map was overlapping its address panel, because the later `.map-canvas` aspect-ratio rule won. The media query now comes after it.

Files changed: `src/styles/global.css`, `src/components/Header.astro` (logo 198×54 @1×/2×, `btn-quote`, `aria-current`), `src/components/Footer.astro` (`ft-grid`, 2-column lists, email wraps without breaking mid-word), `scripts/make-assets.mjs` (header logo source 88 → 112 px tall).

### Colour tokens (one source: `@theme` in global.css)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| navy | #0A2A5C | Headings, top bar, footer, outline buttons | 14.0:1 on white, 12.4:1 on tint |
| blue-dark | #0866A3 | Primary buttons, links, focus ring | white on it 6.11:1; on white 6.11:1, on tint 5.40:1 |
| blue-darker | #07578C | Primary hover, link hover | white on it 7.63:1 |
| blue | #0A7CC4 | Icons, form-card top border, card hover border, FAQ open bar | 4.47:1 on white, 3.96:1 on tint (non-text ≥3) |
| orange | #F7901E | H2 accent bar, hero locality underline, stars, nav current underline, footer icons, focus ring on navy | 5.98:1 on navy; decorative only on light (2.34:1, never text) |
| tint | #EAF2FA | Alternate section background, table header, hover fill | body text 12.9:1, muted 6.70:1 |
| page | #F8FAFC | Body background, zebra rows | — |
| ink | #1E293B | Body text | 14.6:1 on white |
| muted | #475569 | Secondary text, captions | 7.58:1 white, 6.70:1 tint |
| wa | #25D366 (hover #1EBE5A) | WhatsApp buttons only | wa-ink #072B16 on it 7.75:1 (6.27:1 hover). White on #25D366 1.98 and on #1DA851 3.10 both fail AA, so dark text stays |
| wa glyph | #128C4A | WhatsApp icon on the white "Get a Quote" outline | 4.31:1 |
| line | #D6E2EF | Card / table borders (decorative) | — |
| field | #7A8CA3 | Form field borders | 3.44:1 (was #94A3B8, 2.56:1) |
| on-navy-muted | #B8C7DB | Footer body text | 8.16:1 on navy |

### Verification (27 Nov 2026, after rebuild)
- `node scripts/check_links.mjs --report`: 0 problems.
- `python3 scripts/check_pages.py`: 26 pages, 0 problems.
- `node scripts/size_report.mjs`: all pages within budget. Max HTML 17.0 KB gz (60), CSS 6.6 KB gz (15), JS 1.4 KB gz (10).
- Lighthouse mobile (`scripts/lighthouse.sh`, 3 runs × 6 pages: home, leak, patia, pricing, contact, fittings): 100/100/100/100 on all 18 runs, LCP 1.1–1.2 s, CLS 0, TBT 0–40 ms.
- axe-core (WCAG 2.0/2.1/2.2 A+AA + best-practice), 27 pages × 390 and 1366: 0 violations.
- Horizontal overflow, 27 pages × 360/390/768/1024: 0 pages overflow.
- Screenshots: before in `/tmp/design-before/`, after in `/tmp/design-after/` (same 6 pages × 2 viewports, fold + full).

