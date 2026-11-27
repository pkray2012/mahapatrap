# Round 2 audit, Auditor A: compliance and technical SEO (27 Nov 2026)

Scope: all 26 pages (`content/pages/*.md`, `content/pages/areas/*.md`) and the docs (`content-brief.md` incl. both Owner answers sections, `rate-card.md`, `schema.md`, `sitemap.md`, `page-specs.md`, `tracking-plan.md`, `design-contact-and-gbp.md`, `keyword-and-competitor-research.md`).
Method: every page body, FAQ and Facts-to-confirm section read in full; JSON-LD parsed and compared across pages with a script; link graph built from the markdown links. Read-only: no page or doc was edited.

`python3 scripts/check_pages.py` result: **26 pages, 0 problems.** Everything below is beyond what the checker tests.

## Summary

| Severity | Count |
|---|---|
| Critical | 1 |
| Major | 6 |
| Minor | 34 |
| **Total** | **41** |

What passed cleanly (checked by reading, not only grep): no Justdial, Madanpur, Rasulgarh or Baramunda anywhere; no solar heater or gas piping; no AMC, water tank cleaning, borewell, renovation, new house or per-point price figure (per-point FAQ says "discussed only over a call"); visit charge always ₹199–₹349 and always "adjusted in the final bill"; free site visit offered only for big works (checked all 40+ "free" mentions); civil work always "after discussing it with you", never "plumbing only"; no walk-ins (About and Contact); no septic partners; geyser work is plumbing-side only on every page; no job durations stated; titles ≤60 and end correctly; no `aggregateRating`; NAP identical on all pages (District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016; +91 9668875352); payment and GST wording identical; rating text identical (5.0★, 45 Google reviews, 43 five-star); no duplicate FAQ question across pages; no internal link to a URL outside the sitemap; no orphan service or area page.

---

## (a) Hard-rule breaks (with exact replacements)

### A1. Critical: septic page describes the cleaning method
Rule: content-brief.md:18 "Do NOT mention method, equipment, partners or disposal. Just say we arrange septic tank cleaning." Round 2 (content-brief.md:100) only relaxes "we"; it does not lift the method ban. The page describes emptying and sludge removal in the meta description, intro, a 5-step process, an image alt and both JSON-LD descriptions.

| File:line | Now | Replace with |
|---|---|---|
| septic-tank-cleaning.md:7 (and JSON-LD :259) | "...from ₹2,999. Emptying, sludge removal and soak pit check for homes, PGs and apartments. Call +91 9668875352." | `Septic tank cleaning in Bhubaneswar from ₹2,999 for homes, PGs, apartments and shops. Written estimate first. Call +91 9668875352.` (130 chars) |
| septic-tank-cleaning.md:18 | "We empty the tank, remove the settled sludge and check the inlet, outlet and soak pit." | `We also check the inlet, outlet and soak pit.` |
| septic-tank-cleaning.md:66–76 | H2 "What the septic tank cleaning job involves" + 5 numbered steps (Inspection, Emptying, Sludge removal, Inlet and outlet check, Soak pit check) | H2 `What you get with septic tank cleaning`, then bullets: `- **Price first.** A written estimate before work starts.` / `- **Inlet and outlet checked.** We check that the pipe from the house and the outlet to the soak pit are clear.` / `- **Soak pit checked.** We look for signs that the soak pit is choked or overflowing.` Keep line 76 ("If we find a broken pipe..."). |
| septic-tank-cleaning.md:68 | file `septic-tank-sludge-removal-bhubaneswar.webp`, alt "Septic tank sludge removal in progress at an independent house in Bhubaneswar" | `septic-tank-cleaning-house-bhubaneswar.webp`, alt="Septic tank cleaning at an independent house in Bhubaneswar" |
| septic-tank-cleaning.md:124 (and FAQPage JSON-LD) | "Book a service that cleans the tank from outside, with no one going in." (method claim; also an unconfirmed fact, see Facts line 377) | `Leave the job to the cleaning team and keep everyone away from the open lid.` |
| septic-tank-cleaning.md:281 (Service description) | "Tank emptying, sludge removal and outlet check, from ₹2,999 depending on tank size." | `Inlet, outlet and soak pit checked, from ₹2,999 depending on tank size.` |
| septic-tank-cleaning.md:278 (alternateName) | "Septic tank emptying" | `Sewage tank cleaning service` (or drop it) |

Word count after the cut stays well above 900 (now 1,223). If the owner is happy for the method to be shown, record that in content-brief.md and downgrade this item.

### A2. Major: borewell pump "repair" claimed on area pages, contradicting the service page
borewell-pump-and-pipe-repair.md:49 says "If the pump or motor is the problem, we tell you" (plumbing side only, owner rule content-brief.md:103). Two area pages say we repair the pump itself.

| File:line | Now | Replace with |
|---|---|---|
| areas/niladri-vihar.md:44 | "Yes, on existing borewells. We repair the pump and pipes of a borewell that is already there." | `Yes, on existing borewells. Our team lifts and lowers the submersible pump, replaces column pipes and fixes joints and the non-return valve. If the pump or motor itself is faulty, we tell you if a motor mechanic or electrician is needed.` |
| areas/nayapalli.md:20 | "...arranges septic tank cleaning, repairs borewell pumps and takes on bigger plumbing jobs..." | `...arranges septic tank cleaning, fixes borewell pipes and pump lines, and takes on bigger plumbing jobs...` |

### A3. Minor: borewell drilling mentioned beyond the one allowed sentence
| File:line | Now | Replace with |
|---|---|---|
| borewell-pump-and-pipe-repair.md:43 | "For a new borewell, contact a borewell contractor. Once it is ready, we can connect it to your sump or overhead tank." | `If you already have a borewell, we can connect it to your sump or overhead tank.` |

### A4. Minor: same-day hint
| File:line | Now | Replace with |
|---|---|---|
| home.md:18 | "Need a plumber in Bhubaneswar today?" | `Need a plumber in Bhubaneswar?` |

(areas/chandrasekharpur.md:119 "Can I get a plumber in Chandrasekharpur today?" is fine: the answer makes no promise.)

### A5. Minor: warranty shown without "installation and repair jobs only"
| File:line | Now | Replace with |
|---|---|---|
| home.md:22 (trust row, most visible spot) | `**90-day workmanship warranty**` | `**90-day workmanship warranty on repairs and installations**` |
| bathroom-plumbing-renovation.md:58 | "90 days on workmanship; parts follow brand warranty" | `90 days on workmanship for installation and repair jobs; parts follow brand warranty` |
| bathroom-plumbing-renovation.md:100 | "**90-day workmanship warranty**; parts follow..." | `**90-day workmanship warranty** on installation and repair jobs; parts follow...` |
| bathroom-and-kitchen-fittings.md:59 | "90-day workmanship warranty. Parts follow the brand warranty." | `90-day workmanship warranty on installation and repair jobs. Parts follow the brand warranty.` |
| geyser-installation-and-repair.md:77 | same as above | same as above |
| areas/kiit.md:24 | "90-day workmanship warranty on repairs" | `90-day workmanship warranty on repairs and installations` |

### A6. Minor: late-night charge without "subject to availability"
leak-and-blockage-repair.md:53, bathroom-and-kitchen-fittings.md:57, geyser-installation-and-repair.md:76, water-tank-and-motor-repair.md:81: `Late-night or early-morning visit: ₹300 extra.` → `Late-night or early-morning visit: ₹300 extra, on request, subject to availability.`
areas/jayadev-vihar.md:112: "Visits outside them are on request, at extra charge." → `Late-night and early-morning visits are on request, subject to availability (extra charge may apply).`

### A7. Minor: job-time H2 does not use the agreed sentence
bathroom-plumbing-renovation.md:66: append `We tell you the expected time with the estimate.` (content-brief.md:24). No duration is stated, so this is wording only.

---

## (b) Consistency issues

| # | Sev | Issue | Fix |
|---|---|---|---|
| B1 | Minor | Septic wording differs: septic page "We clean septic tanks" / "We empty the tank" vs Nayapalli :20, :44, :114 "We arrange septic tank cleaning". Both allowed, but the site should say it one way. | Use "We arrange septic tank cleaning" on the septic page intro too, or "we clean" everywhere. Owner choice. |
| B2 | Minor | Free-site-visit list differs page to page: home.md:57 omits concealed pipeline; about.md:45 omits commercial; pricing.md:88 omits commercial; areas/nayapalli.md:92 omits concealed and commercial. | Use one line everywhere: `Free site visit and written estimate for concealed pipeline work, renovation, new house plumbing, sewerage works and bigger commercial jobs.` |
| B3 | Minor | Breadcrumb labels for combined areas are inconsistent: Jayadev page shows "Jayadev Vihar & Saheed Nagar", Nayapalli shows "Nayapalli" (H1 says "& IRC Village"), Chandrasekharpur shows "Chandrasekharpur" (title says "& Damana"). | Pick one rule (short area name only is simplest) and apply to all three, visible and JSON-LD. |
| B4 | Minor | Area WhatsApp prefills use three formats: "plumbing work in Patia, Bhubaneswar", "plumbing work near KIIT in Bhubaneswar", "plumbing work in Niladri Vihar in Bhubaneswar". Template (tracking-plan.md §3) is "{Service} in Bhubaneswar [Page: X]". | Standardise, e.g. `Hi, I need a quote for plumbing work in {Area}, Bhubaneswar [Page: {Tag}]` on all 8. |
| B5 | Minor | bathroom-and-kitchen-fittings, bathroom-plumbing-renovation, new-bathroom-and-house-plumbing and pipeline-and-concealed-plumbing repeat `whatsapp_text=` inside every CTA marker; the other 22 pages rely on front matter (content-brief.md:56 says prefill goes in front matter only). Values match, so no tracking risk. | Drop `whatsapp_text=` from the CTA markers on those 4 pages. |
| B6 | Minor | areas/nayapalli.md:52 grammar: "Our team lifts and lowers the submersible pump, replace column pipes, fix leaking joints..." | `Our team lifts and lowers the submersible pump, replaces column pipes, fixes leaking joints and the non-return valve, and repairs the line to your sump or tank.` |
| B7 | Minor | drain-cleaning-and-sewer-jetting.md:72–75: "Safer things to try first" lists "Never mix two drain cleaners", which is a warning, not a thing to try. | Rename to `Safer steps and warnings:` |
| B8 | Minor | Stale Facts-to-confirm items that ask for a price the owner has ruled out (content-brief.md:26): home.md:346, bathroom-plumbing-renovation.md:390, new-bathroom-and-house-plumbing.md:393. borewell facts line ("update schema.md §7 if accepted") is already done in schema.md:258. | Delete these Facts lines. |
| B9 | Minor | CTA coverage gaps: about.md has a price table but no `pricing_table` CTA; areas/patia.md and areas/niladri-vihar.md have no `inline_content` CTA. | Add `[CTA: call+whatsapp | location=pricing_table]` after about.md:58; add `[CTA: call+whatsapp | location=inline_content]` after patia.md:48 and niladri-vihar.md:44. |

Note for the caller: the attached project description still says "4.9★ across 45+ Justdial reviews", "₹149–₹299 visit charge" and 6 locality pages. All three are superseded by owner decisions in the repo (Google 5.0★/45, ₹199–₹349, 8 area pages, no Justdial). The pages follow the repo, which is correct.

---

## (c) Schema issues

Plumber node: identical on all 25 pages that carry it (same @id, address, geo 20.3248238/85.8196582, opening hours 08:00–22:00 daily, 13 knowsAbout items, sameAs = Google Maps CID only) and identical to schema.md §1. Only additions: `contactPoint` (or, hi, en) on Contact and `hasOfferCatalog` on Pricing, both as specified. All in-page @id references resolve except on Privacy (C1). FAQPage text equals visible FAQs (checker). Offers carry only rate-card figures.

| # | Sev | File:line | Issue | Fix |
|---|---|---|---|---|
| C1 | Minor | privacy-policy.md JSON-LD | WebPage `isPartOf` → #website and `about`/`publisher` → #business, but neither node is in the page graph, so the refs do not resolve in-page. | Add the WebSite node (and ideally the Plumber node, as schema.md says "on every page"), or drop `about`/`publisher`. |
| C2 | Minor | pricing.md:357 | OfferCatalog item "AMC check-up for homes (per quarter)": visible page says only "AMC check-up (homes) · Price on request". "Per quarter" is unsupported and echoes the hidden ₹999 plan. | `"name": "AMC check-up for homes"` plus `"description": "Price on request. Call or WhatsApp us for a quote."` |
| C3 | Minor | septic-tank-cleaning.md:278, :281 | Method words in Service JSON-LD (see A1). | As A1. |
| C4 | Minor | areas/niladri-vihar.md JSON-LD | WebPage has no `headline`; the other 7 area pages do. | Add `"headline": "Plumber in Niladri Vihar, Bhubaneswar"`. |
| C5 | Minor | several service pages | Offers with only a `description` and no price (renovation, new house, pipeline, sewerage, borewell, commercial). Valid schema; validators may warn "missing price". Acceptable by owner decision. | No change; note for the Rich Results test. |

---

## (d) Stale doc lines

| # | Sev | File:line | Stale text | Should say |
|---|---|---|---|---|
| D1 | Major | design-contact-and-gbp.md:50 | Plumber template contains `"aggregateRating": { "ratingValue": "5.0", "reviewCount": "45" }` | Delete the line (hard rule: no aggregateRating). Also :49 areaServed is City only and :55 says "Every page: Plumber + BreadcrumbList" (home has no breadcrumb). Replace the whole template with "See schema.md §1". |
| D2 | Major | content-brief.md:15 | "Quote-only services say 'Free site visit and written estimate'." | Conflicts with :101. Water tank cleaning and borewell are quote-only but get no free visit. Say: `Big-work quote-only services (concealed pipeline, renovation, new house, sewerage, commercial) say "Free site visit and written estimate". Other quote-only services say "Call or WhatsApp us for a quote" (water tank) or "Quote after inspection" (borewell).` |
| D3 | Major | page-specs.md:44 | Commercial: "AMC: homes from ₹999 per quarter (rate card); commercial AMC quoted after a free site visit" | `AMC (homes and commercial): price on request, "Call or WhatsApp us for a quote". No figure, no free-visit wording.` |
| D4 | Major | page-specs.md:105 | KIIT angle: "AMC from ₹999 per quarter for owners" | `AMC price on request for owners.` |
| D5 | Major | sitemap.md:66 | GEO checklist: "Concrete proof: prices, warranty, materials, areas, typical job times" | Remove "typical job times" (owner: never state durations). |
| D6 | Major | schema.md:138 (§2 filled example) | "Tank emptying, sludge removal and outlet check" | `Inlet, outlet and soak pit checked`. Same file :136 and :247 still list alternateName "Soak pit cleaning", which the page removed pending owner confirmation. |
| D7 | Minor | schema.md:14 | "Plumber.knowsAbout: All 10 services" | `All 13 services` |
| D8 | Minor | schema.md:195 (§4) | "AMC check-up for homes (per quarter)"; §4 also lacks the water tank / sump cleaning and borewell offers the page carries | Rename (see C2) and add the two quote-only offers. |
| D9 | Minor | schema.md:243–259 (§7) | Keyword drift vs pages: /pricing/ page adds "how much does a plumber charge per visit in bhubaneswar"; septic adds "septic tank cleaning services"; geyser page uses "geyser repair in bhubaneswar, geyser servicing bhubaneswar, water heater repair" (doc: "...near me" forms); leak page uses "pipe leakage repair in bhubaneswar, tap repair, toilet repair, flush tank repair, toilet seat repair, water leakage" (doc: "near me" forms); fittings uses "kitchen sink repair" + "sink installation"; motor uses "water motor repair in bhubaneswar, motor repair, water pump repair, submersible pump repair, water tank repair"; pipeline adds "cpvc pipework". | Update §7 to the page values (they were changed to keep "near me" to one use per page). |
| D10 | Minor | sitemap.md:163, :165; page-specs.md:56 | Primary keyword "geyser repair near me" / "pipe leakage repair near me" | Pages now use "geyser repair in bhubaneswar" / "pipe leakage repair in bhubaneswar" as primary (title and H1 match). Update the docs, or revert the front matter. |
| D11 | Minor | page-specs.md:102, :108, :112, :116 | Keywords include "plumber in patia" (KIIT) and "plumber in chandrasekharpur" (Infocity, Niladri, Sailashree) | schema.md §7 and the pages omit them (correct: one primary per URL). Remove from page-specs. |
| D12 | Minor | page-specs.md:1, :13 | "remaining 21 pages"; About "10 services" | "all 26 pages"; "13 services". |
| D13 | Minor | page-specs.md:32 | New house: "Do not claim civil work or drawings." | Round 2 allows civil work after discussion: `Civil work: "We can also handle the tiling, plaster or civil work, after discussing it with you." Do not claim drawings.` |
| D14 | Minor | page-specs.md:81 | Question "...in one visit?" ("in one visit" is a banned phrase) | `Can you clean the underground sump and overhead tank together?` (as the page already does). |
| D15 | Minor | rate-card.md:33 | "Optional later: add typical starting price for bathroom re-plumbing / new house plumbing" | Conflicts with content-brief.md:26 ("never show a price"). Delete. |
| D16 | Minor | keyword-and-competitor-research.md:37 | "Locality pages: 6 near Chandrasekharpur..." | `8 area pages (adds KIIT and Infocity), per sitemap.md.` |
| D17 | Minor | tracking-plan.md:169 | Allowed `data-page-type` lacks `legal` (privacy page_type is legal, content-brief.md:70) | Add `legal`. |
| D18 | Minor | tracking-plan.md:159, :171 vs content-brief.md:72 | Example prefill "Geyser Installation" (page: "Geyser Installation & Repair"); tracking says `data-service` = page slug, brief says page_tag feeds data-service. Brief's CTA list (:57) lacks `floating_whatsapp`. | Align: data-service = slug, WhatsApp tag = page_tag; update example text; add floating_whatsapp to the brief list (or remove it from tracking). |

---

## (e) Link issues

- All internal link targets exist in sitemap.md; no broken or off-sitemap targets. Every service and area page has 6 or more inbound in-content links (lowest: sewerage 6, borewell 7).
- E1 Minor: /about/ has **0** in-content inbound links (home has 0 too, but breadcrumbs cover it). Make sure header/footer nav links /about/, or add one body link, for example in home.md "Why choose" (`[About Mahapatra Plumbing Services](/about/)`).
- E2 Minor: brief asks for 3–6 internal links. Over on bathroom-plumbing-renovation (7 distinct), commercial-plumbing (8), septic-tank-cleaning (7), water-tank-and-motor-repair (7). Area pages carry 14–21 because page-specs requires service and area lists; acceptable. Trim the service pages only if you want strict compliance.
- E3 Minor: water-tank-and-motor-repair.md:148 "Book" section has no link to /contact/ (every other service page has one). Add `, or see all ways to [contact Mahapatra Plumbing Services](/contact/).`
- E4 Minor: generic anchors "Contact page" / "contact page" (home.md:160, about.md:102, pricing.md:100, chandrasekharpur.md:99, niladri-vihar.md:118, nayapalli.md:125, patia.md:104, kiit.md:125, infocity.md:112, jayadev-vihar.md:100, sailashree-vihar.md:91) and "pricing page" (niladri-vihar.md:70). Prefer `contact Mahapatra Plumbing Services` and `plumber charges in Bhubaneswar`.

---

## (f) Severity index

Critical (1): A1.
Major (6): A2, D1, D2, D3+D4 (counted as one: page-specs AMC figure), D5, D6.
Minor (34): A3–A7 (5), B1–B9 (9), C1–C4 (4), D7–D18 (12), E1–E4 (4). C5 is a note, not counted.

## (g) Score per page (/10)

| Page | Score | Main deductions |
|---|---|---|
| home | 8.5 | "today" (A4), unqualified warranty in trust row (A5), free-visit list (B2), stale fact (B8) |
| pricing | 9.0 | "(per quarter)" in OfferCatalog (C2), free-visit list (B2) |
| about | 8.5 | free-visit list omits commercial (B2), no pricing_table CTA (B9), no inbound body link (E1) |
| contact | 9.5 | none of note |
| privacy-policy | 8.5 | unresolved JSON-LD refs (C1); `legal` missing from tracking page types (D17) |
| septic-tank-cleaning | 6.0 | method described in meta, intro, steps, alt, FAQ, schema (A1); 7 links (E2) |
| water-tank-cleaning | 9.0 | no ₹ table by owner decision (documented), otherwise clean |
| drain-cleaning-and-sewer-jetting | 9.5 | "Safer things to try" wording (B7) |
| leak-and-blockage-repair | 9.0 | late-night wording (A6), keyword drift vs docs (D9/D10) |
| bathroom-and-kitchen-fittings | 8.5 | warranty qualifier (A5), late-night (A6), CTA whatsapp_text (B5) |
| geyser-installation-and-repair | 8.5 | warranty qualifier (A5), late-night (A6), primary keyword drift (D10) |
| water-tank-and-motor-repair | 8.5 | late-night (A6), no contact link (E3), 7 links (E2) |
| pipeline-and-concealed-plumbing | 9.0 | CTA whatsapp_text (B5) |
| bathroom-plumbing-renovation | 8.5 | warranty qualifier x2 (A5), job-time sentence (A7), stale fact (B8), B5 |
| new-bathroom-and-house-plumbing | 9.0 | stale fact (B8), B5 |
| commercial-plumbing | 9.5 | 8 links (E2) |
| sewerage-and-drainage-works | 9.5 | none of note |
| borewell-pump-and-pipe-repair | 8.5 | contractor referral (A3); pump-repair scope wording unclear (A2 source) |
| areas/chandrasekharpur | 9.5 | breadcrumb label (B3) |
| areas/patia | 9.0 | no inline CTA (B9), prefill format (B4) |
| areas/kiit | 9.0 | "warranty on repairs" (A5), prefill format (B4) |
| areas/infocity | 9.5 | anchors (E4) |
| areas/niladri-vihar | 8.0 | "we repair the pump" (A2), no inline CTA (B9), no headline (C4), prefill format (B4) |
| areas/sailashree-vihar | 9.5 | none of note |
| areas/jayadev-vihar | 9.0 | late-night wording (A6), breadcrumb label (B3) |
| areas/nayapalli | 8.0 | "repairs borewell pumps" (A2), grammar (B6), "arrange" vs "clean" (B1), breadcrumb (B3) |

Average: 8.9 / 10.
