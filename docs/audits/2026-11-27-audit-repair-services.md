# Independent audit: 9 service pages (27 Nov 2026)

Scope: septic-tank-cleaning, bathroom-plumbing-renovation, geyser-installation-and-repair, drain-cleaning-and-sewer-jetting, leak-and-blockage-repair, bathroom-and-kitchen-fittings, water-tank-and-motor-repair, pipeline-and-concealed-plumbing, borewell-pump-and-pipe-repair.
Rules checked against: content-brief.md (incl. owner answers 27 Nov), rate-card.md, schema.md, sitemap.md, page-specs.md, keyword universe, and the first-5-pages audit.

Passed on all 9 (automated + read-through): JSON-LD parses; no `aggregateRating`; FAQ JSON-LD = visible FAQs (54/54); 6 FAQs each, answers 43–61 words; titles ≤60 chars and end "| Mahapatra Plumbing"; descriptions ≤155 chars with "+91 9668875352"; WebPage name/description = meta; every ₹ figure is on the rate card; no price for water tank cleaning, borewell, renovation, new house or per point; no Justdial, Madanpur, Rasulgarh, Baramunda, solar or gas piping; no banned words; no stated job durations or response times; no geyser element/thermostat/wiring repair claim; no warranty on cleaning jobs (drain and leak pages exclude it explicitly); no septic method or partners; no leak-detection equipment; "near me" once per page; 2-level breadcrumb; 3–4 images and 4 valid CTA locations per page; word counts 1,220–1,299.

## Summary

| Page | Score /10 | Hard fixes made | Judgement items (not changed) |
|---|---|---|---|
| septic-tank-cleaning | 8 | Schema keyword "sewage tank cleaning services near me" was not in visible text → "sewage tank cleaning" (WebPage + front matter). Added link → /services/water-tank-cleaning/ | 7 unique links; job steps say "we" do work done by partners; "cleaning team" wording; stale Facts items |
| bathroom-plumbing-renovation | 7 | Added link → /services/commercial-plumbing/ | "How long" H2 does not use the agreed wording; GI→CPVC H2 overlaps pipeline; "buy fittings myself" FAQ overlaps fittings/geyser; 7 unique links; stale Facts items |
| geyser-installation-and-repair | 8 | Added link → /services/commercial-plumbing/ | "Every six months" for hard water is not checked; title says "Fitting" while H1 says "Installation" |
| drain-cleaning-and-sewer-jetting | 8 | None needed | Sewer jetting overlaps sewerage works; jetting not confirmed |
| leak-and-blockage-repair | 7 | None needed | URL/page_tag say "blockage" but the page covers no drain blockages; hidden-leak H2 overlaps pipeline; "quick fix" |
| bathroom-and-kitchen-fittings | 8 | None needed | Owns "fittings I bought online"; renovation and geyser repeat it |
| water-tank-and-motor-repair | 7 | None needed | 7 unique links; "submersible pump repair" and "motor runs but no water" overlap borewell; cost FAQ restates visit charge |
| pipeline-and-concealed-plumbing | 7 | None needed | GI→CPVC and CPVC-for-geyser overlap renovation; tank-level test repeats leak page |
| borewell-pump-and-pipe-repair | 7 | Drilling mentions beyond "We do not drill new borewells" removed: "drilling contractor… once it is drilled" → "borewell contractor… once it is ready"; "we do not drill borewells" → "we do not drill new borewells"; FAQ "…or drill a new one?" → "…or get a new one?" (visible + JSON-LD); Service description "No new borewell drilling" → "We do not drill new borewells". Schema keyword "submersible pump repair near me" → "submersible pump repair bhubaneswar" (visible text says "submersible pump repair in Bhubaneswar") | "The whole water line in one call" sounds close to the banned "in one visit"; overlaps motor page |

Totals: 4 files changed, 9 content fixes: 6 hard-rule fixes (2 schema keywords not in the visible text, 4 borewell drilling wordings) and 3 cross-links. word_count was also updated in 3 front matters. After the fixes, all 4 touched files pass the JSON parse, FAQ-match and keyword-presence checks.

## Per-page detail

### septic-tank-cleaning (8/10)
Fixed
1. WebPage `keywords` and `secondary_keywords`: "sewage tank cleaning services near me" was not in the visible text. "near me" is already used once, so the keyword was changed to "sewage tank cleaning" (the highest-volume term in this group, at 320/mo). The visible text has "sewage tank cleaning service". Update schema.md §7 to match.
2. Related services: added "Need your overhead tank or sump cleaned too? See [water tank and sump cleaning](/services/water-tank-cleaning/)." word_count 1207 → 1220.

Judgement
- Internal links: now 7 unique (KIIT, Patia, drain ×2, sewerage, water-tank-cleaning, pricing, contact), above the 3–6 range. To get back to 6, unlink "plumbing services in Patia". The KIIT link already covers hostels.
- Owner says partners clean septic tanks. The "What the job involves" list ("We locate… We empty… We remove…") and the "Outlet and soak pit checked" proof bullet still describe the work as done by us. This names no method, but the "we" may not be accurate. Have the owner confirm.
- The FAQ "Book a service that cleans the tank from outside, with no one going in" hints at a method. It is safety advice and fine if true for the partner.
- AEO is strong: the cost, signs and frequency answers are direct and quotable. "Every 2 to 3 years" is general guidance and has not been checked.
- The Facts section still lists questions the owner answered on 27 Nov: no warranty on cleaning; don't mention method or disposal; never state durations. Remove these items.

### bathroom-plumbing-renovation (7/10)
Fixed
1. Related plumbing services: added "Redoing washrooms in a hotel, office or hostel? See [commercial plumbing](/services/commercial-plumbing/)." word_count 1278 → 1290.

Judgement
- The H2 "How long does bathroom plumbing renovation take?" ends with "We discuss the work order with you at the site visit." It does not use the agreed line "depends on the job; we tell you the expected time with the estimate". The answer comes first but is weak for AEO.
- Cannibalisation:
  - "Should I replace old GI pipes with CPVC?" is very close to the pipeline page's "Should I replace leaking GI pipes with CPVC in an old house?".
  - The CPVC/UPVC/PPR paragraph repeats the pipeline FAQ "Is CPVC pipe good for hot water from the geyser?".
  - Fix: keep renovation's version about "while the tiles are off", and link to pipeline for repairs in an existing house.
- FAQ "Can I buy the taps, WC and fittings myself?" duplicates the fittings H2 "Can you fit bathroom fittings I bought online?" and the geyser FAQ. Parts questions are also owned by /pricing/. Rephrase it for renovation, for example "When should I buy fittings for a renovation?".
- Internal links: now 7 unique. If 6 is a hard cap, drop the /pricing/ link in the warranty bullet, because the table note already links /pricing/.
- The "Why choose" block starts with "Searching for bathroom renovation contractors near me?". That uses "near me" naturally once, which is OK.
- The Facts section still asks "Does the team supply fittings?" and "typical duration". Both were answered (yes; never state). Remove them.

### geyser-installation-and-repair (8/10)
Fixed
1. Added "Geysers for many rooms in a hotel or hostel? See [commercial plumbing](/services/commercial-plumbing/)." to the "We work in" bullet. Links are now 6. word_count 1282 → 1295.

Judgement
- Scope wording is good: it says plainly that we do not replace elements, thermostats or wiring, and refers those faults to an electrician or the service centre.
- "If your home uses borewell or hard water, get it serviced every six months" and "October or November" are advice that has not been checked. The risk is low.
- The title says "Repair & Fitting" while the H1 says "Repair & Installation". This is fine for length, but "geyser installation bhubaneswar" now appears only in the H1 and body, not the title.
- The FAQ "Can you install a geyser I bought online?" is the third "bought it myself" question across these pages. It is acceptable here because it is geyser-specific.

### drain-cleaning-and-sewer-jetting (8/10)
No hard fixes.
- This is the clearest page on separating drain cleaning, septic and sewerage ("Blocked drain or full septic tank?").
- The FAQ "Is a blocked toilet a drain problem or a septic tank problem?" repeats the H2 "Blocked drain or full septic tank?" on the same page. That is fine for AEO, but it is mild self-duplication.
- Sewer jetting sits between this page and /sewerage-and-drainage-works/. Keep jetting as a repair-visit add-on here and keep new lines on sewerage, as the page does now. Jetting is still unconfirmed (see Facts).
- There is a good warranty-exclusion bullet for cleaning jobs.

### leak-and-blockage-repair (7/10)
No hard fixes.
- The URL and breadcrumb say "Leak & Blockage Repair", but the only "blockage" covered is hard-water deposits in taps. Drain blockages are sent to the drain page. Consider renaming the breadcrumb to "Tap, Flush & Pipe Leak Repair" to match the H1. The URL can stay.
- The H2 "How do I find a hidden water leak at home?" and the pipeline H2 "How do I know a pipe is leaking inside the wall?" both use the close-all-taps tank-level test. Both H2s are required by page-specs. Suggested split: leak keeps the DIY tank test; pipeline drops the tank test and focuses on wall and floor signs.
- "Toilet seat repair is often a quick fix" hints at a duration. Consider "is usually a minor fix".
- "Hostels and PGs in Patia have many shared bathrooms, where taps and flushes wear out sooner" is a general claim. It is OK.

### bathroom-and-kitchen-fittings (8/10)
No hard fixes.
- This page correctly owns "fittings bought online" and the washing machine inlet and drain H3, as required by page-specs.
- Overlap with renovation (RO points and kitchen sink) is limited to listing the items, which is acceptable.
- Several service promises need confirming: the WhatsApp size check, several items in one booking, and seat cover fitting (see Facts).
- "kitchen sink repair near me" from schema.md §7 is used as "kitchen sink repair", as the writer noted. Update schema.md.

### water-tank-and-motor-repair (7/10)
No hard fixes.
- Internal links: 7 unique (borewell, water-tank-cleaning, Niladri Vihar, pricing, pipeline, leak, new-house). There is no /contact/ link. Drop one of the three "Related services" links to get back to 6.
- Cannibalisation with borewell:
  - Both pages target "submersible pump repair".
  - "Why is my motor running but not filling the tank?" vs "Why does my borewell motor run but no water comes out?".
  - "Do you repair motor winding…" vs "Do you do borewell motor repair?".
  - The sump/borewell split is stated on both pages, which helps. Drop "submersible pump repair" from the motor page keywords and keep only "sump pump repair", so borewell owns it.
- The cost FAQ ends with the visit-charge sentence, a fact owned by /pricing/. Keep it as a bullet only, or link to /pricing/.
- The page never repeats the warning not to run a dry motor more than twice. That is fine.

### pipeline-and-concealed-plumbing (7/10)
No hard fixes.
- The GI→CPVC H2 and the CPVC-for-geyser FAQ overlap renovation (see above). The H2 is phrased for an "old house" as the spec asked, but the body text is almost the same as renovation's.
- The tank-level test repeats the leak page. The water meter mention is good and adds variety.
- The cost answer has no figure, which is correct per the rate card. It is quotable ("no fixed price… depends on…").
- "We try to open only the part of the wall or floor needed" and "We look at it and tell you what to check before the site visit" are service promises. They are in Facts.

### borewell-pump-and-pipe-repair (7/10)
Fixed
1. Drilling mentions: the rule allows only "We do not drill new borewells". Removed "drilling contractor / once it is drilled" and "drill a new one" (FAQ question, visible and JSON-LD). Changed "we do not drill borewells" and the Service description to the exact phrase. The H2 "Do you drill new borewells?" is kept, because page-specs requires it.
2. Schema keyword "submersible pump repair near me" did not appear in the visible text, and "near me" is already used for "borewell service near me". Changed it to "submersible pump repair bhubaneswar" (visible: "submersible pump repair in Bhubaneswar"). The Facts note is updated. Update schema.md §7.

Judgement
- "The whole water line in one call" is close to the banned "in one visit" idea. Consider "Borewell, sump, motor line and overhead tank: one plumber for the whole line".
- "We check the motor when we lift the borewell submersible pump" adds a scope promise. It is in Facts.
- The cost H2 answers with "quoted after inspection" plus what decides the cost. This is correct. For AEO it would be stronger if the owner allows a starting figure.

## Cross-page findings
1. Overlap clusters:
   - GI→CPVC: renovation vs pipeline.
   - Hidden leak test: leak vs pipeline.
   - Submersible pump and "motor runs, no water": motor vs borewell.
   - "Fittings I bought": fittings vs renovation vs geyser.
   - Jetting: drain vs sewerage.
   - Drain, septic and sewerage are already well separated by cross-links.
2. Internal links: septic (7), renovation (7) and motor (7) are above 6.
3. Question ownership: no page has a visit-charge, late-night, payment/GST or warranty question as an H2 or FAQ. Motor's cost FAQ and renovation's "buy fittings myself" FAQ touch pricing-owned topics.
4. GEO consistency is good on all 9 pages:
   - NAP, hours, 5.0★ / 45 Google reviews (43 five-star) and CPVC/UPVC/PPR are consistent.
   - Prices are the same in the copy, the tables and the Service offers.
   - Every Service node links to #business.
5. The project description still says the visit charge is ₹149–₹299. The rate card and every page say ₹199–₹349. The owner should confirm, and the project description should be updated.

## Facts to confirm with owner (consolidated, deduplicated)

Prices and what they include
1. Does the ₹199–₹349 visit charge apply to septic and borewell inspections, or are those inspections free? (septic, borewell)
2. Is the free site visit for quote-only jobs (renovation, concealed pipeline) free anywhere in Bhubaneswar, even if the customer does not go ahead? (renovation, pipeline)
3. Optional starting prices to show:
   - bathroom re-plumbing (renovation)
   - borewell pump lifting and column pipe replacement (borewell)
   - wash basin, WC, sink, RO points, washing machine points and angle valve fitting (fittings)
   - sewer jetting (drain)
   - soak pit cleaning (septic)
4. What the ₹499 geyser service includes (draining, flushing, descaling; storage vs instant). Does ₹699 installation include wall drilling and mounting for both types? Are connection pipes and the PRV always extra? (geyser)
5. What the ₹399 motor/pump repair covers vs the ₹249 minor fix. (motor)
6. Toilet seat repair: is it a minor fix plus the seat price? Is a toilet-base reseal a minor fix or quoted separately? Is aerator or shower-head cleaning a minor fix? (leak)
7. Confirm 27 Nov 2026 visit charge: ₹199–₹349 (rate card) vs ₹149–₹299 (project description).

Scope and how the team works
8. Septic (done with partners): is the tank cleaned from outside with no one going in? Can we say "we" inspect, check the outlet and check the soak pit? Is soak pit cleaning a separate job? (septic)
9. Sewer jetting: still offered on request? Which lines does it cover? Is "Sewerage & drainage works: quote" right for choked outside lines? Does the team check the outside chamber and test flow after clearing? (drain)
10. Tiling, plaster and civil work: plumbing only, working with the customer's mistri? (renovation, pipeline)
11. Geyser electrical point: plumbing only? Do you install geysers the customer bought online or from shops? (renovation, geyser)
12. Fittings:
    - Do you fit fittings the customer bought?
    - Do you offer a photo size check on WhatsApp?
    - Can several items be fitted in one booking?
    - Do you fit seat covers?
    - Indian→western WC conversion: do you do the floor work?
    - Washing machine: hoses or only the points?
    - RO: points only?
    - Any brands to name?
    (fittings, renovation)
13. Motors: is rewinding and electrical work always referred to a motor mechanic or electrician? (motor, borewell) Also:
    - Do you install new motors?
    - Do you repair tank bodies or install new tanks?
    - Do you work on level controllers?
    - Which motor types do you work on?
    (motor)
14. Borewell:
    - Which column pipe types do you supply?
    - Is there a pump depth limit, and do extra helpers or charges apply?
    - Does the team lift the pump itself?
    - Do you reinstall a pump after a mechanic repairs it?
    - Does the 90-day warranty cover pump lifting and pipe replacement?
    - Do you check the motor when the pump is lifted?
    (borewell)
15. Leaks:
    - How are hidden leaks found (any equipment)?
    - Do you open only the needed part of the wall?
    - Do you review WhatsApp photos before the visit?
    - Do you do a leak check before the wall or floor is closed?
    - Do you retest the repaired joint before leaving?
    - How is the renovation leak test done?
    - Do you offer waterproofing or seepage treatment? (not offered on the page)
    (leak, pipeline, renovation)
16. Real job photos for all 28 image slots (septic 3, renovation 4, geyser 3, drain 3, leak 3, fittings 3, motor 3, pipeline 3, borewell 3).

Already answered by the owner on 27 Nov 2026; remove from the page Facts sections:
- septic warranty (no warranty on cleaning)
- septic method and disposal (do not mention)
- septic and renovation job durations (never state)
- renovation: does the team supply fittings (yes)

Editor action (not for the owner): update schema.md §7 keywords:
- septic "sewage tank cleaning"
- borewell "submersible pump repair bhubaneswar"
- fittings "kitchen sink repair" and "sink installation"
- optionally drop "submersible pump repair" from the motor page
