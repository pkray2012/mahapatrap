# Independent audit: 8 area pages (27 Nov 2026)

Pages: chandrasekharpur, patia, kiit, infocity, niladri-vihar, sailashree-vihar, jayadev-vihar, nayapalli (`content/pages/areas/`).
Rules checked: content-brief.md (area pages need at least 60% unique copy), rate-card.md, schema.md §3, sitemap.md, page-specs.md (Area pages), 27 Nov first-5-pages audit decisions.

All 8 pages pass these checks after the fixes: JSON-LD parses, FAQ JSON-LD text matches the visible FAQs (36/36), every WebPage keyword appears in the visible text, titles are 60 characters or less with the right suffix, descriptions are 155 characters or less and include "+91 9668875352", and word counts are 600–900. Also checked: every price is on the rate card. Water tank cleaning has no price and uses only "Call or WhatsApp us for a quote". No `aggregateRating`, no banned words, and no mention of Justdial, Madanpur, Rasulgarh, Baramunda, solar heaters, gas piping, borewell drilling, per-point rates or durations. The KIIT page clearly says the business is not part of KIIT. No unverified landmarks are named (only area names, Damana, Saheed Nagar and IRC Village).

## 1. Uniqueness

Method: 5-word shingles of the visible copy only. Excluded: front matter, HTML comments, `[CTA]`, `[IMAGE]`, `[MAP]` and `[BREADCRUMB]` markers, link URLs, the JSON-LD and Facts to confirm. Headings, tables, NAP lines and the "Why choose" bullets stay in, so the figures are conservative. Most shared shingles are required boilerplate: phone, hours, rating, rate-card rows, "written estimate before work starts" and "bigger jobs anywhere in Bhubaneswar".

Each cell shows the % of the row page's shingles that also appear on the column page (after fixes). Unique % means shingles found on no other area page.

| | CSP | PAT | KIIT | INF | NIL | SAI | JAY | NAY | Unique % (before → after) |
|---|---|---|---|---|---|---|---|---|---|
| Chandrasekharpur | – | 6.6 | 5.0 | 4.6 | 11.0 | 8.3 | 4.1 | 6.7 | 80.8 → 81.7 |
| Patia | 6.7 | – | 7.8 | 8.2 | 6.1 | 3.4 | 8.4 | 5.2 | 80.7 → 81.2 |
| KIIT | 5.0 | 7.8 | – | 5.9 | 6.4 | 4.3 | 6.3 | 7.3 | 83.2 → 84.1 |
| Infocity | 4.9 | 8.5 | 6.2 | – | 4.2 | 6.3 | 5.0 | 5.1 | 81.7 → 84.1 |
| Niladri Vihar | 11.2 | 6.1 | 6.4 | 4.0 | – | 7.0 | 4.9 | 7.6 | 81.1 → 81.7 |
| Sailashree Vihar | 8.5 | 3.4 | 4.3 | 6.1 | 7.0 | – | 4.4 | 3.7 | 82.4 → 85.3 |
| Jayadev Vihar | 4.1 | 8.2 | 6.2 | 4.7 | 4.8 | 4.3 | – | 4.5 | 84.9 → 84.8 |
| Nayapalli | 6.8 | 5.1 | 7.2 | 4.9 | 7.6 | 3.7 | 4.6 | – | 85.0 → 85.0 |

Every page is well above 60% unique, so no page needed a uniqueness rewrite. The highest pair is Chandrasekharpur and Niladri Vihar at about 11%: both cover sump, motor and overhead tank houses and use the same "Why choose" bullets.

Duplicate FAQ / question headings found and reworded:
| Duplicate | Kept on | Changed on |
|---|---|---|
| Leak from the flat above ("Water is leaking into my flat from the flat above" / "Water is leaking from the ceiling of my Patia flat") | Chandrasekharpur | Patia: new FAQ on a pre-rent / pre-purchase plumbing check |
| Tank and sump cleaning asked on 5 pages | Patia (matches autocomplete "water tank cleaning … near patia") | Chandrasekharpur: new move-in FAQ (washing machine + geyser). KIIT: reworded to "several overhead tanks and a sump". Niladri: "clean the sump when you come to repair the motor". Infocity: FAQ removed |
| Tenant booking (Patia H2, KIIT FAQ, Infocity FAQ) | Patia, KIIT (student angle) | Infocity: replaced with "office pantry sink keeps choking" FAQ |
| Small-job visit (Niladri "small job like a leaking tap" / Sailashree "small leak") | Niladri | Sailashree: new "brown water from my taps" FAQ (GI rust angle) |
| Before opening hours (Infocity H2 / Jayadev FAQ "before my shop opens") | Infocity | Jayadev: "work in my shop's washroom during trading hours" |
| Apartment societies (Chandrasekharpur FAQ / Infocity H2) | Chandrasekharpur | Infocity H2 now "Can residents and society offices near Infocity book you?" |

## 2. Summary

| Page | Score /10 | Unique % | Hard / consistency fixes | Judgement items |
|---|---|---|---|---|
| Chandrasekharpur | 8 | 81.7 | 2: duplicate tank FAQ replaced; /contact/ link added | Lists "plumber in damana" with no Damana-specific proof beyond 1 FAQ |
| Patia | 8 | 81.2 | 2: duplicate ceiling-leak FAQ replaced; /contact/ link added | Primary "plumber in patia" is also a KIIT secondary keyword |
| KIIT | 8.5 | 84.1 | 2: 4 nearby-area links added; tank FAQ reworded (1 redundant sentence cut to stay ≤900 words) | Hostel-blockage FAQ overlaps the drain page; AMC for PGs unconfirmed |
| Infocity | 8 | 84.1 | 5: tenant FAQ replaced; tank FAQ removed; society H2 reworded; 3 area links; /contact/ link | No rating strip under the hero; "office plumbing infocity" only matches with the comma in the H3 ignored |
| Niladri Vihar | 7.5 | 81.7 | 1 hard: tank-cleaning FAQ said "The price depends on tank size, the number of tanks and access". Now only "Call or WhatsApp us for a quote." | H2 "Why does my motor run but the overhead tank not fill?" cannibalises the motor page H2 |
| Sailashree Vihar | 8 | 85.3 | 3: duplicate small-leak FAQ replaced; 4 area links; /contact/ link | Strong topical angle, but GI-to-CPVC overlaps the pipeline page |
| Jayadev Vihar | 7.5 | 84.8 | 3: duplicate FAQ replaced; 4 area links; /contact/ link (1 sentence cut to stay ≤900) | Geyser H2 with prices overlaps the geyser page; "As a plumber in Saheed Nagar and Jayadev Vihar" reads stuffed |
| Nayapalli | 8 | 85.0 | 1: "Next door is Jayadev Vihar and Saheed Nagar" changed to "Close by are…" (Saheed Nagar is not next door to Nayapalli) | Septic answer says "from ₹2,999 depending on tank size" (fine, but tank-size pricing is unconfirmed) |

Total: 19 edits across all 8 files. FAQ JSON-LD was regenerated from the visible text and word_count front matter was updated.

Internal links after fixes (unique links in the visible copy): Chandrasekharpur 21, Patia 20, KIIT 16, Infocity 16, Niladri Vihar 18, Sailashree Vihar 14, Jayadev Vihar 17, Nayapalli 19. Every page now links to all 7 other area pages, /pricing/ and /contact/. These counts are above the 3–6 guideline, as the spec expects for area pages, so nothing was cut.

Re-run after fixes: JSON valid 8/8; FAQ match 8/8; keywords present 8/8 (Infocity's "office plumbing infocity" and Nayapalli's "plumber near irc village bhubaneswar" match only when punctuation is ignored, because of a comma in the visible text). Word counts: CSP 896, PAT 884, KIIT 889, INF 838, NIL 885, SAI 889, JAY 892, NAY 898.

## 3. Per-page detail

### Chandrasekharpur
- Strong home-base angle (District Center, Damana next door), with separate flat and house sections.
- Fixed: tank FAQ replaced with "I have just moved into a flat in Chandrasekharpur. Can you fit the washing machine and geyser?" (geyser installation from ₹699, part price shared). Added a contact link to the address line.
- Judgement: "plumber in chandrasekharpur" is also listed as a keyword on Infocity, Niladri Vihar and Sailashree Vihar (spec-driven). This is a cannibalisation risk for the money keyword. Recommend removing it from those 3 pages' WebPage keywords and secondary_keywords, and keeping the visible link anchor "plumber in Chandrasekharpur" pointing here.

### Patia
- Good split into rented flats, apartment blocks and independent houses. Links to KIIT for hostels as the spec asks.
- Fixed: ceiling-leak FAQ (duplicate of Chandrasekharpur) replaced with "Can you check a flat's plumbing before I rent or buy it in Patia?" Added a contact link. Added a Facts bullet for the new pre-rent check claim.
- Judgement: no local signal beyond "next to Chandrasekharpur". A verified colony or square name and a real Patia photo would help most here.

### KIIT
- Best page of the set for intent match (hostels, PGs, AMC, room-by-room estimate). The "not part of KIIT" FAQ deals with the affiliation risk well.
- Fixed: Niladri Vihar, Sailashree Vihar, Jayadev Vihar and Nayapalli now linked. Tank FAQ reworded. Removed the "Need a plumber in Patia for a family house? See the Patia page." sentence to keep within 900 words (the Patia link stays in the list).
- Judgement: "plumber in patia" is a WebPage keyword here and the primary keyword of /areas/patia/; consider dropping it from KIIT. The "Why do toilets and drains in hostels block so often?" FAQ is close to the drain page's "Why does my bathroom drain keep blocking?" and "Do you clear blocked drains in hostels, PGs and offices?", which is a moderate overlap. The hostel/PG AMC "quoted after a free site visit" is not on the rate card (already in Facts).

### Infocity
- Office angle is clear and specific: visitor passes, isolating one washroom, RO purifier lines, pantry sinks.
- Fixed: tenant FAQ replaced with the pantry-sink FAQ ("Drain unclogging starts at ₹349"). Duplicate tank FAQ removed. Society H2 reworded. Sailashree Vihar, Jayadev Vihar and Nayapalli linked. Contact link added.
- Judgement: no rating/proof strip under the hero, unlike the other 7 pages, which is a small inconsistency. "We can also fit a separate valve" is unconfirmed (already in Facts).

### Niladri Vihar
- Clear water-system angle (sump → motor → roof tank) with useful how-to content.
- Fixed (hard rule): the tank-cleaning FAQ talked about price factors. It now reads "Call or WhatsApp us for a quote." and was reworded to "Can you clean the sump when you come to repair the motor?" so it no longer copies the other tank FAQs.
- Judgement: the H2 "Why does my motor run but the overhead tank not fill?" is almost the same as the motor page H2 "Why is my motor running but not filling the tank?", so the area page may compete for that query. Suggested change: make it a statement heading ("Motor running but the roof tank stays empty?"), shorten the answer, and link to the service page. The add-a-floor FAQ is a good local signal (independent houses).

### Sailashree Vihar
- Most distinct page (85%): GI rust, mixed joints after adding a floor, concealed leaks, staged replacement.
- Fixed: the small-leak FAQ (duplicate of Niladri) replaced with "Why does brown water come from my taps in Sailashree Vihar?". KIIT, Infocity, Jayadev Vihar and Nayapalli linked. Contact link added next to "Get directions".
- Judgement: only 4 FAQs and the page leans on /services/pipeline-and-concealed-plumbing/ topics. That is fine as long as the area page links to it (it does). "Older houses in Sailashree Vihar" is a general claim about the colony's building stock; ask the owner to confirm it.

### Jayadev Vihar & Saheed Nagar
- Clear shop, office and home mix, with geyser and fittings focus as the spec asks.
- Fixed: "Can you come before my shop opens?" (duplicate of Infocity H2) replaced with "Can you work in my shop's washroom during trading hours?". Patia, KIIT, Infocity and Niladri Vihar linked. Contact link added. One redundant sentence cut to stay within 900 words. Added a Facts bullet for the new claim.
- Judgement: the H2 "Do you install and service geysers in Jayadev Vihar?" gives the geyser prices and scope, which overlaps the geyser page's cost question. Acceptable as an area summary, but keep the geyser page as the canonical answer. The meta description leads with prices ("tap fitting from ₹299"), which is accurate to the rate card's lower bound. The first sentence of the Saheed Nagar FAQ reads keyword-stuffed.

### Nayapalli & IRC Village
- Good "water leaving the house" angle (drain stack, chambers, septic, soak pit) and a useful borewell WhatsApp FAQ.
- Fixed: "Next door is Jayadev Vihar and Saheed Nagar" changed to "Close by are…", because Saheed Nagar is not adjacent.
- Judgement: "from ₹2,999 depending on tank size" adds a pricing factor the owner has not confirmed. Septic method, partners and disposal are correctly not mentioned.

## 4. Cross-page judgement items (report only)
1. Keyword cannibalisation between area pages: "plumber in chandrasekharpur" is a keyword on 4 pages and "plumber in patia" on 2. Keep each as primary on its own page only.
2. Cannibalisation with service pages: Niladri motor H2, KIIT hostel-blockage FAQ and Jayadev geyser H2 (details above).
3. Weak local signals: no page names a verified landmark (on purpose), and all 20 image slots are still placeholders. Real job photos per area and 1–2 owner-confirmed landmarks are now the main way to tell the pages apart for Google and AI engines.
4. GEO/AEO entity clarity is good: every page names Mahapatra Plumbing Services, District Center Chandrasekharpur 751016, +91 9668875352, daily 8 AM–10 PM, 5.0★ from 45 Google reviews and the 90-day warranty scope. Every page has answer-first FAQs. Templated H2 patterns ("What plumbing problems … ?", "Why choose …") repeat on most pages but the bodies under them differ.
5. Risky or unconfirmed claims still live, all listed in Facts: hostel/PG AMC quoted after site visit; fitting isolation valves; RO purifier scope; visitor-pass process; staged GI replacement; septic "depending on tank size"; small shop jobs without closing (added by this audit).

## 5. Facts to confirm with owner (consolidated, deduplicated)
1. Real job photos for every area page: Chandrasekharpur/Damana (apartment bathroom leak, house sump motor line); Patia (rented-flat tap, house overhead tank motor line, apartment kitchen sink); KIIT area (hostel flush tank, PG floor trap, hostel overhead tanks); Infocity (office washroom flush, office pantry sink); Niladri Vihar (motor, sump or overhead tank work, 3 slots); Sailashree Vihar (GI-to-CPVC replacement, damp wall from concealed leak); Jayadev Vihar/Saheed Nagar (shop washroom tap, flat geyser fitting, office pantry sink); Nayapalli/IRC Village (house drain chamber, apartment drain stack).
2. Landmarks: any landmark the owner is sure of for Patia, KIIT (for example KIIT Square), Sailashree Vihar, Jayadev Vihar/Saheed Nagar and Nayapalli. None are named now.
3. Walk-ins at District Center, or call before visiting?
4. Apartment society and common-line work (shared drain stacks, tank/sump/motor lines, building-wide maintenance), booked by a society, in Chandrasekharpur, Nayapalli and elsewhere.
5. Commercial building / hostel / PG maintenance quoted after a free site visit, based on number of washrooms and floors. Does ₹999 per quarter AMC also apply to small PGs?
6. Jobs inside the KIIT university campus: taken or not? (Page mentions only private hostels, PGs, flats and homes.)
7. Water tank and sump cleaning: price per tank (not shown, per owner decision) and whether the method may be described.
8. Float valves and overflow controls on overhead tanks: repair/replace confirmed? Are automatic motor controllers offered?
9. RO purifier: inlet, tap point and drain lines only; filters, membranes and electrical parts go to the brand.
10. Office visitor/contractor pass process (customer arranges the pass).
11. Fitting a separate isolation valve for one washroom during a repair visit.
12. GI-to-CPVC replacement done in stages (one bathroom or line at a time), and rerouting new lines instead of breaking tiles.
13. Geyser fitting/service and tap/flush fitting are the main jobs from Jayadev Vihar/Saheed Nagar; visits planned around shop/office hours "where possible".
14. Small shop jobs (flush kit, tap, basin waste) can usually be done without the shop closing (added by this audit).
15. House-to-septic-tank line and inspection chamber repair in Nayapalli/IRC Village (routed to sewerage and drainage works, quoted after free site visit). Is septic pricing "depending on tank size"?
16. Pre-rent / pre-purchase plumbing check booked as a normal visit, with the visit charge adjusted if repairs go ahead (added by this audit).
