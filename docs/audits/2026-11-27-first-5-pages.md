# Independent audit — first 5 pages (27 Nov 2026)

Scores (0–10): Home SEO 7 / AEO 7 / GEO 7 / Conv 6 · Pricing 8/7/8/7 · Septic 7/8/6/6 · Renovation 6/6/7/7 · Geyser 6/7/6/6.
Passed: JSON-LD parses, @id links resolve, FAQ schema = visible FAQs (29/29), title/description lengths, prices match rate card, no banned words or Madanpur, ad checkbox unticked, WhatsApp page tags correct.

Decisions taken after the audit (27 Nov 2026):
- Title suffix is always "| Mahapatra Plumbing" (owner rule) — ignore auditor title suggestions ending "| Mahapatra".
- Remove `aggregateRating` from all JSON-LD (ratings are from Google Maps, a third-party site; self-serving review markup). Keep the rating as visible text.
- Breadcrumbs: 2 levels (Home > Page) until a /services/ hub page exists. Show a visible breadcrumb line under the H1 marker on non-home pages: `[BREADCRUMB: Home > {Page}]`. Home page has no BreadcrumbList.
- Consent line on forms: "By sending, you agree we may use your number to reply on WhatsApp. See our Privacy Policy." Ad use depends only on the optional, unticked checkbox.
- Owner-dependent facts stay out of the copy until confirmed (see "Facts to confirm" in each page).

## home.md
Must fix
1. Form/CTA locations must use tracking-plan values: L29 `cta_location=hero` → `quick_quote_form`; L160 `book_visit` → `book_visit_form`; L164 `[CTA … location=book_visit]` → `book_visit_form`.
2. Form markers must use the form template: whatsapp_text = `Name: {name}\nArea: {area}\nProblem: {problem}\n[Page: Home | Form: quick_quote]` (and `Form: book_visit`).
3. Remove `aggregateRating`.
Should fix
4. H2 "How much does a plumber charge in Bhubaneswar?" cannibalises /pricing/: rename to "Popular plumbing rates", cut table to 5 rows (visit, minor fix, geyser service, drain unclogging, septic), keep a short paragraph, link anchor "plumber charges in Bhubaneswar" → /pricing/.
5. Emergency answer: replace with "Sometimes. Mahapatra Plumbing Services is open daily from 8 AM to 10 PM. Late-night and early-morning visits are on request, subject to availability, at ₹300 extra. Call +91 9668875352 and we will tell you if a plumber can come." Remove `emergency plumber near me` from secondary_keywords and WebPage keywords. Rename the H2 so it is not a question owned by /pricing/ (late night is owned by /pricing/), e.g. keep as a short statement in "Why choose us" instead of an H2.
6. Unconfirmed claims: "so most small jobs can be finished in one visit" → "so the plumber comes prepared."; delete "once the work is done"; "Every job … 90-day workmanship warranty" → "Every repair and installation job…".
7. "### Quick Quote on WhatsApp" directly after H1: make it a card label, not a heading.
8. New consent line (above).
Nice: drop BreadcrumbList; trim to ≤1,200 words; reviews section without invented quotes (real excerpts will be added later).

## pricing.md
Must fix
1. Concealed pipeline: use rate-card wording "Quote after inspection" (not "free site visit") until owner confirms.
Should fix
2. Replace FAQ "How much does geyser installation cost in Bhubaneswar?" with "How much does it cost to unclog a toilet or drain in Bhubaneswar?" — answer: "At Mahapatra Plumbing Services, a blocked sink or floor trap starts at ₹349. Toilet blockage removal starts at ₹999. The ₹199–₹349 visit charge is adjusted in the final bill if the work goes ahead. You get the price before work starts. Call or WhatsApp +91 9668875352."
3. Rate table: split into 4 tables under H3s (Small repairs, Installations, Cleaning, Bigger jobs) plus a short "Applies to every job" list; no empty category rows; header "Price" without "(₹)"; unlink "Visit / inspection".
4. "Parts are extra and quoted before fitting" → "Parts are extra. Ask for the part price before fitting."
5. Remove "billed quarterly" (AMC); use "from ₹999 per quarter". Add `"unitText": "per quarter"` to the AMC Offer.
6. Remove `aggregateRating`. 2-level breadcrumb.

## septic-tank-cleaning.md
Must fix
1. Move the "WhatsApp prefill for every CTA…" line (L13) into front matter `whatsapp_prefill:`.
2. Method/disposal unconfirmed: replace "Book trained people who clean the tank from outside" with "Book a service that cleans the tank from outside, with no one going in." No method or disposal claims.
3. Remove warranty and visit-charge rows from the price table and the warranty bullet until the owner confirms they apply to cleaning.
Should fix
4. De-stuff: "How often you should clean septic tank systems depends on three things" → "How often you need to clean a septic tank depends on three things:"; H2 "Septic tank cleaning services near me: areas we cover" → "Areas we cover for septic tank cleaning", first sentence "We clean septic tanks anywhere in Bhubaneswar, including Chandrasekharpur, Patia, KIIT…".
5. Invented behaviour: "Hostel and PG owners near KIIT and Patia often keep a fixed cleaning schedule." → "Hostels and PGs near KIIT and Patia fill tanks faster, so a fixed cleaning schedule helps."; "many owners book cleaning on a fixed schedule" → "a fixed cleaning schedule helps."
6. Delete "No surprises in the final bill".
7. "(labour, from our approved rate card)" → "Septic tank cleaning rates in Bhubaneswar (labour charges):"
8. Remove "Soak pit cleaning" from Service alternateName.
9. Meta description phone as "+91 9668875352". Remove `aggregateRating`. 2-level breadcrumb. Trim to ≤1,300 words.

## bathroom-plumbing-renovation.md
Must fix
1. Make clear it is renovation PLUMBING. H1 → "Bathroom Renovation Plumbing in Bhubaneswar (and Kitchens)". Title must contain "bathroom renovation", say plumbing, end "| Mahapatra Plumbing", ≤60 chars. Update WebPage name/headline.
Should fix
2. "How long…" and cost answers have no numbers: keep qualitative, no invented numbers; make the first sentence a direct, quotable statement of what decides time/cost.
3. Remove unconfirmed claims: "We share a time plan with your written estimate"; "or we can arrange them" (fittings); "pressure gauge" in alt text → "Plumber checking new bathroom pipes for leaks before tiling in Bhubaneswar"; "pressure and leak test" → "leak test".
Nice: link /services/geyser-installation-and-repair/ from the geyser-points bullet. Remove `aggregateRating`. 2-level breadcrumb. Phone "+91 9668875352" in description.

## geyser-installation-and-repair.md
Must fix
1. Element/thermostat scope unconfirmed: keep the H2 "Why is my geyser not giving hot water?" but answer neutrally: we check the geyser, fix plumbing-side causes, and tell you if an electrical part needs replacing (and by whom) — no promise either way. Flag in Facts to confirm.
2. FAQ 2 "That way you do not pay for the wrong visit" → "We check it and tell you whether it needs an electrician or the brand's service centre."
Should fix
3. De-stuff: "Need geyser repair near me in Bhubaneswar?" → "Need your geyser repaired in Bhubaneswar?"; title → geyser repair/installation in Bhubaneswar, ends "| Mahapatra Plumbing", ≤60 chars, no "near me". Keep "geyser repair near me" in schema keywords and once naturally in body.
4. Descaling: use "where the model allows" everywhere; drop "full" from "a full geyser service costs ₹499".
5. "geyser use peaks … first cold week" → "Most homes use the geyser most from December to February, so book a service before then."
6. Service schema: two Offers — installation (minPrice 699) and service (price 499).
7. Remove `aggregateRating`. 2-level breadcrumb.

## Cross-page
- Question ownership: /pricing/ owns visit charge, late night, parts, payment/GST questions. Other pages state these as bullets, not FAQs/H2s. Home and Geyser FAQs about the visit charge → replace with page-specific questions.
- "Why choose" block: shared facts are fine, but each page adds 2 points specific to that service.
- Phone format "+91 9668875352" everywhere.
- Note: FAQ rich results now show mainly for government/health sites; FAQ markup is kept for AI engines.
