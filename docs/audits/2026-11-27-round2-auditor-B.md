# Round 2 audit (Auditor B): search performance, AEO, GEO, conversion — 27 Nov 2026

Scope: all 26 pages in `content/pages/` and `content/pages/areas/` (privacy policy checked, not scored). Read against `content-brief.md` (incl. both "Owner answers" blocks), `sitemap.md`, `schema.md` §7, `page-specs.md`, `keyword-and-competitor-research.md`, `research/2026-11-27-keyword-universe.md`, `research/bhubaneswar_service_keywords.csv` and `bhubaneswar_keywords_all.csv`, `rate-card.md`. Read-only audit: no page was edited.

Method notes
- Metrics computed by script on visible copy (markers stripped): word count, title/description length, "near me" count, long sentences (>20 words), question H2s, FAQ count, FAQs that repeat an H2 on the same page, inbound/outbound internal links.
- Google has shown FAQ rich results only for well-known government and health sites since Aug 2023. FAQPage schema still helps answer engines and LLMs parse Q&A, but it will not win SERP space here. So every FAQ slot should add a new question, not repeat an H2.
- All proposed rewrites follow the owner rules: no prices for AMC, tank cleaning, borewell, renovation, new house or per-point; no durations; no partners; no banned words; free site visit only for big works; "near me" at most once in body copy.

---

## 1. Overall verdict

**Overall site score: 7.1 / 10.** It is a solid base. Entity facts are consistent everywhere: name, address, phone, hours, 5.0★ (45), the warranty scope and the visit-charge rule. Every page has a crawlable ₹ table, and answer-first intros name the business, area and phone. The area pages are genuinely different from each other, and the internal links form a clean hub-and-spoke.

What holds the score back:
1. **Build blocker:** 5 pages have invalid YAML front matter (unquoted `: ` in `meta_description`). The Next.js build (gray-matter / js-yaml) will fail on them.
2. **AEO waste:** on 9 of 13 service pages, 1 to 5 FAQs repeat the page's own H2 questions, word for word or nearly. There are also 10 cross-page question conflicts that break the "question ownership" rule.
3. **Keyword gaps with real demand:** "sewage tank cleaning" (320/mo), "water heater" (106 GBP searches), "washing machine drain pipe" (90 + 90), "water leakage / leak detection" (140 + 40), "commode" repair terms and "plumber bhubaneswar price list" are not placed where they would rank.
4. **Weak E-E-A-T and GEO signals:** no "at a glance" entity block, no real review excerpts, and an About page with no owner, start year or contextual inbound links. The contact email is spelled "mohapatra" while the brand is "Mahapatra".
5. **Off-site NAP:** per the research doc, GBP still shows "Open 24 hours". This contradicts every page and the schema, and it is the biggest local-pack consistency risk.

**3 weakest pages:** `/services/water-tank-cleaning/` (5.5), `/about/` (5.75), `/services/sewerage-and-drainage-works/` (6.25).

---

## 2. Per-page scores (/10)

| Page | SEO | AEO | GEO | Conv. | Avg | Words | FAQ = H2 dup | Notes |
|---|---|---|---|---|---|---|---|---|
| / (home) | 8 | 7 | 8 | 8 | 7.75 | 1,199 | 0 | Strong hub; missing BBSR / "plumbing work" / "online" wording; 2 FAQs duplicated elsewhere |
| /pricing/ | 8 | 8 | 9 | 7 | 8.0 | 915 | 0 | Best GEO page; "price list" missing; answers drain cost Q owned by drain page |
| /about/ | 5 | 6 | 6 | 6 | 5.75 | 810 | 0 | H1 lacks keyword; 0 contextual inbound links; 2 FAQs duplicate Contact |
| /contact/ | 6 | 6 | 8 | 8 | 7.0 | 512 | 0 | Keyword not in H1 or any H2; 1 FAQ duplicates Home; **YAML error** |
| leak-and-blockage-repair | 7 | 5 | 8 | 8 | 7.0 | 1,325 | 3 (+1 semantic) | Hidden-leak topic cannibalises Pipeline page; commode / jet spray terms missing |
| drain-cleaning-and-sewer-jetting | 8 | 7 | 8 | 8 | 7.75 | 1,284 | 1 (+1 semantic) | Good; "drainage cleaning" missing |
| bathroom-and-kitchen-fittings | 7 | 8 | 8 | 8 | 7.75 | 1,304 | 0 | Washing machine drain buried in an H3; 12 long sentences |
| geyser-installation-and-repair | 7 | 8 | 8 | 7 | 7.5 | 1,306 | 0 | "Water heater" under-used; redundant opening sentence |
| water-tank-and-motor-repair | 7 | 7 | 8 | 7 | 7.25 | 1,306 | 0 (+1 semantic) | Niladri Vihar page competes for its main question |
| pipeline-and-concealed-plumbing | 7 | 7 | 8 | 7 | 7.25 | 1,317 | 0 | Should own "hidden leak / leak detection"; **YAML error** |
| septic-tank-cleaning | 7 | 6 | 8 | 8 | 7.25 | 1,247 | 2 (+1 semantic) | "Sewage tank" (320/mo) appears once, in the area paragraph only |
| water-tank-cleaning | 6 | 5 | 5 | 6 | 5.5 | 1,161 | 2 (+1 semantic) | No cost question; "Call or WhatsApp us for a quote" ×7; thin entity facts |
| bathroom-plumbing-renovation | 6 | 6 | 7 | 7 | 6.5 | 1,317 | 0 (+1 cross-page) | Pitches "plumbing side" only, so it under-serves "bathroom renovation" intent; **YAML error** |
| new-bathroom-and-house-plumbing | 7 | 5 | 7 | 7 | 6.5 | 1,326 | 1 (+4 semantic) | 5 of 6 FAQs repeat H2s; **YAML error** |
| sewerage-and-drainage-works | 6 | 5 | 7 | 7 | 6.25 | 1,306 | 2 (+2 semantic) | 4 of 6 FAQs repeat H2s; "local authority" vague; **YAML error** |
| commercial-plumbing | 7 | 6 | 7 | 7 | 6.75 | 1,238 | 3 | Home AMC row on a commercial page; 3 FAQ duplicates |
| borewell-pump-and-pipe-repair | 7 | 8 | 8 | 7 | 7.5 | 1,319 | 0 | Title misses "service" (borewell service near me 260/mo) |
| areas/chandrasekharpur | 8 | 7 | 8 | 8 | 7.75 | 921 | 0 | Good base signal; no named landmarks |
| areas/patia | 8 | 7 | 7 | 8 | 7.5 | 903 | 0 | Good tenant angle; no landmarks |
| areas/kiit | 8 | 8 | 8 | 8 | 8.0 | 898 | 0 | Best area page ("not part of KIIT" FAQ is excellent for GEO) |
| areas/infocity | 7 | 7 | 7 | 8 | 7.25 | 871 | 0 | Good office angle; 4 FAQs |
| areas/niladri-vihar | 6 | 6 | 7 | 7 | 6.5 | 905 | 0 | 2 of 3 question H2s duplicate the motor service page |
| areas/sailashree-vihar | 7 | 7 | 7 | 7 | 7.0 | 912 | 0 | Concealed-leak and GI H2s overlap the Pipeline page |
| areas/jayadev-vihar | 7 | 6 | 7 | 7 | 6.75 | 900 | 0 | Geyser H2 repeats the geyser page; 4 FAQs |
| areas/nayapalli | 7 | 6 | 7 | 7 | 6.75 | 923 | 0 | Grammar error in the borewell H2 answer; 4 FAQs |

Consistency checks passed: every title is ≤60 characters, every description ≤155 and every title ends "| Mahapatra Plumbing (Services)". The primary keyword or a natural variant appears in the first 100 words on all pages. "near me" appears at most once per page. Long sentences are under 20% on every page. Every page has 3 or more question H2s.

---

## 3. Site-wide issues (apply to many pages)

### 3.1 P0: invalid front matter (build blocker)
These 5 files have a plain YAML scalar containing `: `, which js-yaml rejects:
- `bathroom-plumbing-renovation.md`, `contact.md`, `new-bathroom-and-house-plumbing.md`, `pipeline-and-concealed-plumbing.md`, `sewerage-and-drainage-works.md`, all in `meta_description`.

Fix: wrap each value in double quotes, as `pricing.md` and `sailashree-vihar.md` already do. Example:
`meta_description: "Bathroom renovation plumbing in Bhubaneswar: GI lines replaced with CPVC, concealed pipes, leak test before tiling. Free site visit. Call +91 9668875352."`
Add a YAML-parse check to `scripts/check_pages.py`.

### 3.2 FAQ slots that repeat the page's own H2s
Exact or near-exact repeats: leak (4), septic (3), new house (5), sewerage (4), commercial (3), water tank cleaning (3), drain (2), motor (1). Each repeat is a lost chance to rank for a new long-tail question. Section 5 gives drop/add lists with ready answers.

### 3.3 Cross-page question conflicts (breaks the "question ownership" rule)

| Question theme | Pages answering it | Owner (keep) | Fix on the others |
|---|---|---|---|
| Cost to unclog toilet/drain | /pricing/ FAQ, drain H2+FAQ | drain page | Replace the pricing FAQ (see §5 Pricing) |
| Renovation work outside Chandrasekharpur | home FAQ, renovation FAQ | home | Replace the renovation FAQ |
| What to share when booking | home FAQ, contact FAQ, contact H2, water-tank FAQ+H2 | home (general), water-tank (tank specifics) | Replace the contact FAQ; on the water-tank page keep one only |
| Where is the business located | about FAQ, contact H2 | contact | Replace the about FAQ |
| Can I visit / walk in | about FAQ, contact H2 text | contact | Replace the about FAQ |
| Hidden leak: how to find it | leak H2+FAQ, pipeline H2, Sailashree H2 | pipeline | Turn the leak H2 into a pointer; localise the Sailashree H2 |
| Replace GI with CPVC? | pipeline H2, renovation H2, Sailashree H2 | pipeline | Renovation H2 becomes a non-question pointer; Sailashree stays local (process) |
| Motor runs, tank not filling | motor H2, Niladri H2 | motor page | Re-angle the Niladri H2 |
| Overhead tank overflow | motor H2, Niladri FAQ | motor page | Replace the Niladri FAQ |
| Sump + overhead tank together | water-tank H2+FAQ, Patia FAQ, KIIT FAQ, Niladri FAQ | water-tank page | Area FAQs can stay short and local, but drop the water-tank page's own FAQ copy |
| Blocked drain vs septic | drain H2 + drain FAQ (same page) | drain H2 | Replace the drain FAQ |

### 3.4 GEO: missing "at a glance" entity block
LLMs quote short, self-contained fact lines. Add this table to Home (under the trust line) and About (under the intro). Every value comes from the fixed facts:

```
### Mahapatra Plumbing Services at a glance
| | |
|---|---|
| What we are | Plumber and plumbing company in Bhubaneswar, Odisha |
| Base | District Center, Chandrasekharpur, Bhubaneswar 751016 (call first; we come to you) |
| Phone / WhatsApp | +91 9668875352 |
| Hours | Open daily 8 AM – 10 PM |
| Service area | All of Bhubaneswar |
| Google rating | 5.0★ from 45 reviews (43 five-star) |
| Visit charge | ₹199–₹349, adjusted in the final bill if work goes ahead |
| Warranty | 90-day workmanship warranty on repair and installation jobs |
| Languages | Odia, Hindi, English |
```

### 3.5 Conversion: trust strip missing on service pages
All 8 area pages and Home show a one-line trust strip under the H1. None of the 13 service pages do. Add it under the breadcrumb on each one:
- Repair and installation pages: `**5.0★ from 45 Google reviews** · **Written estimate before work starts** · **90-day workmanship warranty** · **Open daily 8 AM – 10 PM**`
- Cleaning pages (septic, water tank, drain): replace the warranty item with `**Anywhere in Bhubaneswar**` for septic and tank cleaning, and `**Price before work starts**` for drain.
- Big-work pages: replace the warranty item with `**Free site visit + written estimate**`.

### 3.6 Conversion: CTA labels
The `[CTA: call+whatsapp]` markers give no button text. Recommended labels site-wide:
- Call: **"Call +91 96688 75352"**. Showing the number builds trust and works in screenshots.
- WhatsApp: **"WhatsApp a photo"**. This matches the "send a photo" advice on every page and is lower-friction than "Get quote".
- Big-work pages: **"Book free site visit"** on the WhatsApp button.

### 3.7 Social proof is only a number
Every page says "5.0★ from 45 Google reviews" but none shows a review. Add 3 real Google review excerpts (owner to choose, with reviewer first name and month) on Home, About, Leak, Drain and Septic. Never invent them, and keep `aggregateRating` out of the JSON-LD. This is the biggest single conversion lift available. → Facts to confirm.

### 3.8 Area pages: no named landmarks
`content-brief.md` asks for local landmarks. `page-specs.md` allows them only when the writer is sure they exist. Ask the owner for 2–3 landmarks or lane names per area that he actually works around, and add one sentence each. Candidates to confirm (do not publish unconfirmed):
- Chandrasekharpur: Damana Square side
- Patia: Patia Square
- KIIT: KIIT Square
- Infocity: Infocity Square
- Nayapalli: around Kalinga Stadium / CRP Square
- Jayadev Vihar: Jayadev Vihar Square

### 3.9 Keyword hygiene in schema
`/areas/chandrasekharpur/` and `/areas/patia/` list "plumber in bhubaneswar" as a secondary keyword (front matter and schema §7). Remove it from the area pages so Home stays the only target for the main money term. Search Console shows Home at position 10.6–12.4 for "plumber bhubaneswar" and "plumber in bhubaneswar".

### 3.10 NAP and entity consistency (off-page)
- **GBP hours:** the research doc says GBP shows "Open 24 hours". Change it to Mon–Sun 8 AM–10 PM to match the site and schema. Highest-impact local fix.
- **Email:** `amareshmohapatra143@gmail.com` spells "Mohapatra", while the brand is "Mahapatra". If possible, create `hello@mahapatraplumbing.in` (or similar) and use it on the site, GBP and schema. → Facts to confirm.
- GBP: link the website field to `https://mahapatraplumbing.in/`, and list the same 13 services with the same names as the site's service pages.

---

## 4. Keyword-to-URL map (with gaps)

Volumes are Bhubaneswar monthly figures from Ubersuggest (relative demand), GBP owner export and Search Console (GSC).

| URL | Primary (page) | Key secondaries actually placed | Demand evidence | Status / gap |
|---|---|---|---|---|
| / | plumber in bhubaneswar | plumber bhubaneswar, plumber near me (×1), plumber service in bhubaneswar, plumbing services bhubaneswar, plumber near me home service | 320; GSC 312 + 273 + 153 impr. | OK. **Gap:** "plumbing work / works" (140 each), "plumber in bbsr" (autocomplete), "online plumber bhubaneswar" (autocomplete) |
| /pricing/ | plumber charges in bhubaneswar | plumber visit charge, rate list | plumber price list, plumber charges (10 each) + autocomplete "plumber bhubaneswar price list" | **Gap:** "price list" absent from H1/H2/meta |
| /about/ | plumbing company in bhubaneswar | brand name | low | **Gap:** keyword not in H1 or any H2 |
| /contact/ | plumber bhubaneswar contact number | plumber near me contact number | autocomplete | **Gap:** keyword only in intro; add an H2 |
| leak-and-blockage-repair | pipe leakage repair in bhubaneswar | tap repair, flush tank repair, toilet repair, toilet seat repair, water leakage, seepage | water leakage 140, leaking 140, toilet seat repair (GBP) | **Gap:** "commode repair / leakage" terms (Indian usage) missing. **Conflict:** hidden-leak detection should move to Pipeline |
| drain-cleaning-and-sewer-jetting | drain cleaning bhubaneswar | drain blockage removal, drain pipe cleaning, toilet blockage removal, sewer jetting | drain cleaning 210, drainage cleaning 40, drain pipe cleaning 30 | **Gap:** "drainage cleaning" (40) missing |
| bathroom-and-kitchen-fittings | bathroom fitting plumber near me | bathroom fitters, tap installation, toilet installation, sink installation, washing machine inlet and drain | bath fittings 110, washroom fittings 110, washing machine drain plumbing 90, drain pipe for washing machine 90 | **Gap:** washing machine drain sits in an H3 with no question; "bath / washroom fittings" absent |
| geyser-installation-and-repair | geyser repair in bhubaneswar | geyser installation, geyser servicing, water heater repair (×1) | geyser repair near me 70, geyser pipe 50, **"water heater" 106 GBP searches** | **Gap:** "water heater" in the areas paragraph only; "geyser pipe" absent |
| water-tank-and-motor-repair | water motor repair near me | motor repair, water pump repair, submersible pump repair, sump pump repair, water tank repair | motor repair near me 70, submersible pump repair 30, water pump repair (GBP) | OK. "motor mechanic near me" (320) correctly not targeted (referral only) |
| pipeline-and-concealed-plumbing | concealed pipe leakage repair | internal pipe leak, cpvc pipe fitting, cpvc pipework, pipeline repair | cpvc pipework 170, water leak detection 40, seepage in wall 30 | **Gap:** should own "water leak detection / hidden leak"; "cpvc pipe cost" (40) cannot be served (no price allowed) |
| septic-tank-cleaning | septic tank cleaning bhubaneswar | clean septic tank, septic tank cleaning services near me | **sewage tank cleaning 320**, clean septic tank 320, septic sewer cleaning 320, sewage tank cleaning services near me 90 | **Biggest gap on the site:** "sewage tank" appears once, in the area paragraph only. Not in H1, intro, H2 or table |
| water-tank-cleaning | water tank cleaning bhubaneswar | water tank cleaning services near me, sump cleaning, overhead tank cleaning | water tank cleaning 140, services near me 90, autocomplete "…price list" | **Gap:** no cost question (people search "price list") |
| bathroom-plumbing-renovation | bathroom renovation bhubaneswar | bathroom renovation cost, contractors near me, kitchen renovation bhubaneswar | bathroom renovation 20, cost 20 | Intent gap: page sells the "plumbing side" only, while searchers want the whole renovation. Owner now allows civil work on discussion |
| new-bathroom-and-house-plumbing | new house plumbing work | house plumbing work, plumbing contractor(s), plumbing work in house construction, per-point (answered without a rate) | GBP "plumbing work in construction" | OK |
| sewerage-and-drainage-works | sewerage work contractor bhubaneswar | sewerage work, sewer line repair near me, drainage work bhubaneswar | ~10 each; GBP "drainage cleaner company in odisha" | Low demand; fine as a supporting page |
| commercial-plumbing | commercial plumbing bhubaneswar | commercial plumbing services, AMC, hotel / office / hostel plumbing | commercial plumbing 140 (mostly non-local) | OK. Optional: "grease" (restaurant drains) FAQ |
| borewell-pump-and-pipe-repair | borewell service near me | borewell repair, submersible pump, borewell motor repair | **borewell service near me 260** | **Gap:** "service" not in title or H1 |
| areas/* (8) | plumber in {area} | Damana, Saheed Nagar, IRC Village, hostel near KIIT, office plumbing Infocity | 0–10 each; GSC/GBP show Patia and IRC Village Nayapalli | OK. Remove "plumber in bhubaneswar" from Chandrasekharpur and Patia secondaries |

Deliberately not targeted (correct; keep out): borewell drilling (590 "borewell" mostly drilling), solar water heater installation, gas pipeline, motor mechanic, Rasulgarh / Baramunda, "best plumber", "24 hour / 24 7 plumber", "emergency plumber" (the honest late-night line covers the intent), per-point rates.

No exact primary-keyword cannibalisation exists. The overlaps worth fixing are question-level and are listed in §3.3.

---

## 5. Per-page issues with exact rewrites

### Home (/)
1. Implied same-day promise and missing BBSR.
   - Current: "Need a plumber in Bhubaneswar today? Mahapatra Plumbing Services fixes leaks, taps, geysers, motors and blocked drains in homes, flats and offices."
   - Replace: "Need a plumber in Bhubaneswar (BBSR)? Mahapatra Plumbing Services fixes leaks, taps, geysers, motors and blocked drains in homes, flats and offices."
2. "Plumbing work" (140/mo) absent.
   - Current H2 answer opener: "Mahapatra Plumbing Services covers plumbing services in Bhubaneswar, from small repairs to big jobs."
   - Replace: "Mahapatra Plumbing Services covers plumbing services and plumbing work in Bhubaneswar, from small repairs to big jobs."
3. Booking H2: add the "online" intent.
   - Current: "Call or WhatsApp +91 9668875352 between 8 AM and 10 PM, any day. Or fill in the form below."
   - Replace: "Call or WhatsApp +91 9668875352 between 8 AM and 10 PM, any day. To book a plumber online, fill in the form below."
4. Add the "at a glance" table (§3.4) under the trust line.
5. Filler line. Current: "Save our number as "Plumber Bhubaneswar" for the next leak." → Delete it.
6. Give About its first contextual link. Current: "- **Local base.** District Center, Chandrasekharpur." → Replace: "- **Local base.** District Center, Chandrasekharpur. Read [about our plumbing company in Bhubaneswar](/about/)."
7. Add 3 real review excerpts under "What our customers say" (owner to supply).

### /pricing/
1. "Price list" gap.
   - H2 current: "Plumbing rate list in Bhubaneswar (2026)" → Replace: "Plumber price list in Bhubaneswar (2026)"
   - meta_description replace (146 chars, keep it in double quotes in YAML): "Plumber charges and price list in Bhubaneswar: visit ₹199–₹349 adjusted in your bill, minor fixes from ₹249, 90-day warranty. Call +91 9668875352."
2. Drop the FAQ owned by the drain page: "How much does it cost to unclog a toilet or drain in Bhubaneswar?" Replace with:
   - **Q: How do I get the exact price before the plumber starts?**
     A: Send a photo or short video of the problem on WhatsApp to +91 9668875352. We tell you which rate on this list applies. At the visit, the plumber checks the problem and gives you a written estimate before any work starts. Part prices are shared before fitting. Bigger jobs get a free site visit and a written estimate.
3. Clarify that only big works get a free visit, and add commercial.
   - Current: "Bathroom renovation, new house plumbing and sewerage lines differ in every building. Pipe length, walls and fittings change the cost. So we visit the site for free and give you a written estimate before work starts. The same applies to concealed pipeline repair."
   - Replace: "Bathroom renovation, new house plumbing, sewerage lines, concealed pipeline repair and bigger commercial jobs differ in every building. Pipe length, walls and fittings change the cost. So we visit the site for free and give you a written estimate before work starts. Small repairs have the ₹199–₹349 visit charge instead."
4. AMC row note. Current "Home check-up." → Replace "Call or WhatsApp us for a quote." (matches the commercial AMC row).

### /about/ (weak page #2)
1. H1 without keyword.
   - Current: "About Mahapatra Plumbing Services, Chandrasekharpur"
   - Replace: "About Mahapatra Plumbing Services, a Plumbing Company in Bhubaneswar" (update the `h1:` front matter too)
2. H2 with keyword. Current "Who is Mahapatra Plumbing Services?" → Replace "Who is Mahapatra Plumbing Services, plumbing company in Bhubaneswar?" (or keep the H2 and put the keyword in its first sentence; it is already there).
3. Add the "at a glance" table (§3.4).
4. Replace the 2 FAQs owned by Contact ("Where is Mahapatra Plumbing Services located?" and "Can I visit your office at District Center?") with:
   - **Q: Do you take both small repairs and big plumbing jobs?**
     A: Yes. The same team takes a dripping tap or a running flush, and bigger jobs like bathroom renovation, new house plumbing, sewerage lines and septic tank cleaning anywhere in Bhubaneswar. Small repairs have a ₹199–₹349 visit charge, adjusted in the final bill. Bigger jobs get a free site visit and a written estimate.
   - **Q: Which languages can I speak when I call?**
     A: You can speak Odia, Hindi or English when you call or WhatsApp Mahapatra Plumbing Services on +91 9668875352. Send a photo or voice note in any of the three. We reply on WhatsApp to fix a time, and you get a written estimate before work starts.
5. E-E-A-T and GEO: this page needs one or two human facts (owner name, year started, team size, a real team photo). The brief forbids inventing them. → Facts to confirm. This is the single largest GEO lever on the site.
6. Inbound links: 0 contextual links today. Add the Home link (above). On Contact, change "Why contact Mahapatra Plumbing Services" so its last bullet reads "**Local business.** Read [about Mahapatra Plumbing Services](/about/)."

### /contact/
1. Fix the YAML (§3.1).
2. Keyword in an H2. Current H2 "Mahapatra Plumbing contact details" → Replace "Plumber contact number in Bhubaneswar"
3. Awkward line. Current: "Save it as your plumber near me contact number for the next leak." → Replace: "Save +91 9668875352 as your plumber near me contact number, so it is ready for the next leak."
4. Duplicate FAQ (Home owns it): drop "What details should I share to get a plumbing quote?" Replace with:
   - **Q: How do I get directions to Mahapatra Plumbing Services?**
     A: Tap "Get directions" on this page to open our Google Maps listing at District Center, Chandrasekharpur, Bhubaneswar 751016. Please call or WhatsApp +91 9668875352 before coming. Our plumbers work on site, so in most cases we come to your home or building instead.

### Leak & Blockage Repair
1. Replace 4 FAQs that repeat H2s or move to other owners ("How much does tap repair cost…", "Why is my flush tank running…", "How do I find a hidden water leak…", "Why is there water around the base…"). Keep "Should I repair a dripping tap or replace it?" and "Is a small water leakage worth fixing quickly?". Add:
   - **Q: Why is my commode leaking?**
     A: A leaking commode (western toilet) usually has a worn flush valve seal, a loose inlet connection or a failed pan connector at the base. Water running into the pan points to the flush tank. Water on the floor points to the pan connection. We find the leaking joint and fix it. Minor fixes start from ₹249.
   - **Q: Can you fix a leaking jet spray or health faucet?**
     A: Yes. A jet spray usually leaks at the hose, the holder or the angle valve behind it. We tighten or replace the hose or valve. A minor fix starts from ₹249, and a new jet spray set is fitted for ₹299–₹799 plus parts. We share the part price before fitting.
   - **Q: Can you repair a loose or broken toilet seat?**
     A: Yes. A loose seat usually needs its hinge bolts tightened or replaced. A cracked seat needs a new seat cover. Toilet seat repair is a minor fix from ₹249. The new seat cover is a part, so we share its price before fitting. Send a photo of the seat on WhatsApp first.
   - **Q: Why does my kitchen sink leak from underneath?** (moved here from the Fittings page; keep its current answer)
2. Hand hidden-leak ownership to the Pipeline page. Replace the H2 "How do I find a hidden water leak at home?" and its whole section with:
   - "## Hidden leak inside a wall or floor?
     If a damp patch keeps coming back or your overhead tank drops with every tap closed, the leak may be inside a wall or floor. Our [concealed pipe leakage repair](/services/pipeline-and-concealed-plumbing/) service finds and fixes it, with a free site visit and written estimate."
3. Add a question H2 in place of the lost one. Current H2 "Toilet repair: leaks around the pan and loose seats" → Replace "Why is my toilet leaking at the base?" (body stays).
4. The rate table includes drain rows that belong to the drain page. Remove "Drain unclogging (sink / floor trap)" and "Toilet blockage removal" from this table. The link to drain cleaning above the table already covers them.

### Drain Cleaning & Sewer Jetting
1. "Drainage cleaning" (40/mo).
   - Current: "Mahapatra Plumbing Services offers drain cleaning in Bhubaneswar for blocked sinks, floor traps, toilets and drain pipes."
   - Replace: "Mahapatra Plumbing Services offers drain and drainage cleaning in Bhubaneswar for blocked sinks, floor traps, toilets, drain pipes and outside chambers."
2. FAQ repeating H2: drop "How much does drain cleaning cost in Bhubaneswar?" (the H2 answers it). Add:
   - **Q: Do you clean outside drain chambers?**
     A: Yes. We clear choked chambers around the house that carry waste from bathrooms and the kitchen to the septic tank or main line. If a chamber is broken or needs rebuilding, that is sewerage and drainage work, quoted after a free site visit and written estimate. Send a photo of the chamber on WhatsApp first.
3. Same-page duplicate: drop the FAQ "Is a blocked toilet a drain problem or a septic tank problem?" (the H2 "Blocked drain or full septic tank?" answers it). Add:
   - **Q: How do you clear a toilet that is fully blocked?**
     A: We clear the pan and the pipe after it, then flush a few times to check the flow. If the block is further down, we check the outside chamber too. Toilet blockage removal starts from ₹999. Stop flushing until the plumber arrives, so the pan does not overflow.

### Bathroom & Kitchen Fittings
1. Promote washing machine plumbing (90 + 90 searches) to a question H2.
   - Current H3: "### Washing machine inlet and drain fitting"
   - Replace with an H2 and an answer-first paragraph: "## How do you fit a washing machine inlet and drain pipe?
     A washing machine needs a water inlet tap at the right height and a drain pipe that runs to a floor trap or the sink waste. Mahapatra Plumbing Services fits both. We also fix drain hoses that spill or back up. The inlet tap fitting costs ₹299–₹799 plus parts, and the part price is shared before fitting." (keep the bullet list below)
2. Move "Can you fix a kitchen sink that leaks from underneath?" to the Leak page. Add:
   - **Q: Do you install bath and washroom fittings of any brand?**
     A: Yes. We fit bath and washroom fittings of the brand you choose, bought online or from a local shop. Send a photo on WhatsApp before you buy, so we can check the sizes match your points. The fitting follows its brand warranty. Our installation carries a 90-day workmanship warranty.
3. Readability: 12 sentences over 20 words (highest on the site). Split the intro list sentence: "We fit taps, mixers, showers, jet sprays, wash basins, western and Indian WCs, flush tanks, kitchen sinks and washing machine points." → "We fit taps, mixers, showers and jet sprays. We also fit wash basins, western and Indian WCs, flush tanks, kitchen sinks and washing machine points."

### Geyser Installation & Repair
1. Redundant opener, and "water heater" missing (106 GBP searches).
   - Current: "Need your geyser repaired in Bhubaneswar? Mahapatra Plumbing Services in Chandrasekharpur offers geyser repair in Bhubaneswar for leaking, noisy and low-flow geysers, and installs new ones."
   - Replace: "Mahapatra Plumbing Services in Chandrasekharpur offers geyser (water heater) repair in Bhubaneswar for leaking, noisy and low-flow geysers, and installs new ones."
   - H1 current "Geyser Repair & Installation in Bhubaneswar" → Replace "Geyser (Water Heater) Repair & Installation in Bhubaneswar" (update `h1:`)
2. "Geyser pipe" (50/mo). Current bullet: "**Inlet and outlet connections:** We connect the cold water inlet and the hot water outlet to your bathroom lines." → Replace: "**Inlet and outlet connections:** We connect the cold water inlet and the hot water outlet to your bathroom lines with geyser connection pipes."
3. Intent: "geyser repair" searchers often have a heating fault, which is out of scope. The page handles this honestly. Keep the plumbing-side paragraph directly under the hero CTA, as it is now. It protects lead quality.

### Water Tank & Motor Repair
1. FAQ repeating H2 (cost). Drop "How much does water pump repair cost in Bhubaneswar?" Add:
   - **Q: Why does water flow back into the sump when the motor stops?**
     A: That usually means the non-return valve on the delivery line is faulty, or the foot valve is not closing. Water then drains back, and the motor has to refill the line each time. We check both valves and replace the faulty one. Motor and pump repair starts from ₹399, and parts are extra.
2. Keep ownership of "motor runs but tank does not fill" and "overhead tank overflows". The Niladri Vihar page has to change instead (below).

### Pipeline & Concealed Plumbing
1. Fix the YAML (§3.1).
2. Take ownership of hidden-leak detection ("water leak detection" 40, "seepage in wall" 30).
   - H2 current: "How do I know a pipe is leaking inside the wall?" → Replace: "How do I find a hidden water leak in a wall or floor?"
   - First paragraph replace: "Look for a damp patch that keeps coming back, peeling paint, loose or hollow tiles, or low pressure at one tap. Then do a simple water leak detection check. Close every tap, switch off the motor and note the overhead tank level. If it drops within an hour or two, water is escaping somewhere."
3. The FAQ "Is every damp patch on a wall caused by a pipe leak?" is good. Keep it here as the single owner of the seepage question.

### Septic Tank Cleaning
1. Largest keyword gap on the site ("sewage tank cleaning" 320, "septic sewer cleaning" 320).
   - H1 current "Septic Tank Cleaning in Bhubaneswar" → Replace "Septic & Sewage Tank Cleaning in Bhubaneswar"
   - Intro current: "Mahapatra Plumbing Services offers septic tank cleaning anywhere in Bhubaneswar, starting at ₹2,999." → Replace: "Mahapatra Plumbing Services arranges septic and sewage tank cleaning anywhere in Bhubaneswar, starting at ₹2,999."
   - Table caption current "Septic tank cleaning rates in Bhubaneswar (labour charges):" → Replace "Septic and sewage tank cleaning price list, Bhubaneswar (labour charges):" (also serves the "…price list" autocomplete)
2. 3 FAQs repeat H2s (cost, how often, signs). Keep the H2s. Drop those 3 FAQs and add:
   - **Q: Is a sewage tank the same as a septic tank?**
     A: Yes. In most Bhubaneswar homes, people use both names for the same underground tank that collects toilet waste before it flows to the soak pit. We clean septic and sewage tanks for homes, PGs, apartments, shops and offices anywhere in Bhubaneswar, starting at ₹2,999. You get a written estimate before work starts.
   - **Q: Will cleaning stop the smell from my septic tank?**
     A: Often, yes, because a full tank is a common cause of smell. If the smell stays after cleaning, a cracked chamber, a blocked vent pipe or a dry floor trap may be the cause. We check the inlet, outlet and soak pit during the job, and tell you before any repair is done.
3. (For Auditor A / owner) The step list "Emptying… Sludge removal…" and the FAQ line "Book a service that cleans the tank from outside, with no one going in" describe the method. The owner said not to mention method. Consider cutting the steps to: "Inspection → Cleaning → Inlet, outlet and soak pit check → We tell you before any repair."

### Water Tank & Sump Cleaning (weakest page #1)
Why it is weak: no price is allowed, no method is allowed, the cost question is not answered at all, the same sentence appears 7 times, and the first H2 is about apartments rather than the main intent.
1. Add a cost H2 straight after the hero (owner-compliant, no figure):
   - "## How much does water tank cleaning cost in Bhubaneswar?
     The price depends on how many tanks you have, their size, where they sit and how easy the lids are to open. One overhead tank costs less than a large apartment sump with four roof tanks. Share the tank details and a photo on WhatsApp to +91 9668875352, and we quote before any work starts."
2. Make the apartment H2 a non-question so it stops duplicating the FAQs. Current "How do I book water tank cleaning for an apartment?" → Replace "Booking for an apartment, hostel or office" (body stays; delete its last sentence "Call or WhatsApp us for a quote.").
3. Cut "Call or WhatsApp us for a quote." from 7 uses to 3: hero, the new cost H2, the last FAQ.
4. Drop the FAQs that repeat H2s ("How often should a water tank be cleaned?", "Can you clean the underground sump and overhead tank together?", "What details should I share when booking water tank cleaning?"). Add:
   - **Q: Should I clean the sump after muddy supply water or borewell sand?**
     A: Yes, once the supply runs clear again. Silt settles at the bottom of the sump and is pushed back up each time the motor runs. Clean the sump and the overhead tank together, so dirt is not pumped back into a clean tank. Call or WhatsApp +91 9668875352 with the number and size of your tanks.
   - **Q: How do I keep my water tank clean for longer?**
     A: Keep every lid closed and fix a broken lid quickly. Clean the sump and the overhead tank together. Repair overflow and leaking pipes, so dirt and insects cannot enter. Book a cleaning after the monsoon, and sooner if the water turns muddy, smells or leaves sand in the bucket.
5. GEO: add one fact line under the hero: "Water tank and sump cleaning by Mahapatra Plumbing Services, District Center, Chandrasekharpur. Anywhere in Bhubaneswar. Open daily 8 AM – 10 PM. Written estimate before work starts."

### Bathroom & Kitchen Renovation
1. Fix the YAML (§3.1).
2. Serve "bathroom renovation" intent (the owner now allows tiling and civil work on discussion).
   - H1 current "Bathroom Renovation Plumbing in Bhubaneswar (and Kitchens)" → Replace "Bathroom & Kitchen Renovation Plumbing in Bhubaneswar"
   - Intro current: "Mahapatra Plumbing Services does the plumbing side of bathroom renovation in Bhubaneswar, and kitchens too. From our base in Chandrasekharpur, we replace old GI lines with CPVC, UPVC or PPR pipes, lay concealed lines, fit new fittings and leak-test before tiling. Call or WhatsApp +91 9668875352 for a free site visit."
   - Replace: "Mahapatra Plumbing Services takes bathroom renovation in Bhubaneswar, and kitchen renovation too, anywhere in the city. We replace old GI lines with CPVC, UPVC or PPR pipes, lay concealed lines, fit new fittings and leak-test before tiling. We can also handle the tiling, plaster or civil work, after discussing it with you. Call or WhatsApp +91 9668875352 for a free site visit."
3. The time H2 does not give an answer first. Current first paragraph: "The time depends on three things: the size of the bathroom, how much old pipe comes out, and whether the new lines are concealed or open. Open-line work in one bathroom is quicker than concealed re-plumbing. We discuss the work order with you at the site visit."
   - Replace: "It depends on the job. The size of the bathroom, how much old pipe comes out, and concealed or open lines all change the time. We tell you the expected time with the written estimate, after the free site visit. We also agree the work order with you, so plumbing and tiling do not clash."
4. Cross-page duplicate of the Pipeline H2. Current H2 "Should I replace old GI pipes with CPVC?" → Replace with a non-question H2 "Replacing old GI pipes during renovation" and keep the two body paragraphs. Add at the end: "See [GI to CPVC pipe replacement](/services/pipeline-and-concealed-plumbing/)."
5. Cross-page FAQ duplicate (Home owns it): drop "Do you take bathroom renovation work outside Chandrasekharpur?" Add:
   - **Q: Can you change an Indian toilet to a western toilet during renovation?**
     A: Yes. Changing an Indian WC to a western WC means checking the drain point and often moving it, plus floor work. We do the plumbing, and we can also handle the floor and tiling, after discussing it with you. It is quoted after a free site visit, with a written estimate before work starts.

### New House & Bathroom Plumbing
1. Fix the YAML (§3.1).
2. 5 of 6 FAQs repeat H2s (cost, when to call, CPVC vs PPR, builders, new bathroom). Keep "Do you have a per-point rate for house plumbing?" and "Can you plumb a new bathroom in an existing house?" (its H2 is not a question). Drop the other 4 and add:
   - **Q: Can you plan the plumbing from my house plan before construction?**
     A: Yes. Share the floor plan on WhatsApp. At the free site visit, we mark the bathroom, kitchen, tank and motor positions with you and your builder, and plan where pipes pass through the slab. You get a written estimate for the whole job before work starts.
   - **Q: Do you connect the sump, overhead tank and motor in a new house?**
     A: Yes. We lay the inlet, outlet and overflow lines for the sump and overhead tank, and the motor line from the sump to the roof. We plan the line lengths and valves at the free site visit. If the house has an existing borewell, we can connect it to the sump or tank too.
   - **Q: Can I buy the pipes and fittings myself?**
     A: Yes. You can buy your own pipes and fittings, and we do the plumbing work. The written estimate lists what is needed, so you buy the right type and sizes. If we supply any part, the part price is shared before fitting. Parts follow the brand's own warranty.
3. The builders section has only 2 bullets. Current: "- Written estimate for the job before work starts / - GST invoice on request". Add: "- Work planned stage by stage with your site engineer and civil team" and "- Leak test before plaster and tiling, so walls are closed only on tested lines".

### Sewerage & Drainage Works (weakest page #3)
Why it is weak: 4 of 6 FAQs repeat H2s, demand is low, the permission answer is vague, and the YAML is invalid.
1. Fix the YAML (§3.1).
2. Drop the FAQs "How much does sewer line work cost…", "How do I know if my sewer line is broken or sagging?", "Do I need permission to connect…" and "Is sewerage work the same as drain cleaning?" (all answered in H2s). Add:
   - **Q: Can you repair or rebuild a broken drain chamber or manhole?**
     A: Yes. If a chamber is broken, too low or keeps overflowing, we can repair or rebuild it, after discussing it with you. We also join the lines into it at the right slope. Chamber work is quoted after a free site visit, with a written estimate before work starts.
   - **Q: Can you connect my house drain to a new septic tank?**
     A: Yes. We lay the line from the house to the new septic tank with the right slope, and add chambers where the line turns. We run water through the line before it is closed. You get a free site visit and a written estimate before work starts. Call or WhatsApp +91 9668875352.
   - **Q: Can you lay a rainwater drain line from the roof and courtyard?**
     A: Yes. We lay drain lines for roof and courtyard rainwater outlets, sized and sloped so water does not stand. Where possible, we keep rainwater out of the septic tank line, so the tank does not fill faster. The work is quoted after a free site visit and written estimate.
3. GEO: "approval from the local authority" is vague. Ask the owner which office issues sewer connection approval in Bhubaneswar and name it (→ Facts to confirm). Do not publish a name until confirmed.

### Commercial Plumbing
1. Table: remove the row "AMC check-up (homes) | Price on request". It is irrelevant on this page.
2. 3 FAQs repeat H2s (cost, AMC, business hours). Drop them and add:
   - **Q: Do you clean water tanks and sumps for hotels and offices?**
     A: Yes. We clean overhead tanks and sumps for hotels, offices, hostels, PGs, shops and apartment societies anywhere in Bhubaneswar. Share the number of tanks, their size and how to reach them on WhatsApp. Call or WhatsApp us for a quote. See [water tank and sump cleaning](/services/water-tank-cleaning/).
   - **Q: Can you clear grease from a restaurant kitchen drain?**
     A: Yes. Restaurant and cafe sink lines choke with grease and food waste. We clear the sink trap and waste line, and check the outside chamber. Drain unclogging starts from ₹349. Ask your staff to scrape plates and keep oil out of the sink, to cut repeat blockages.
3. Answer-first gap: the cost H2 opens with a list of four factors. Put the rate first: "Single repairs follow our rate card, such as a minor fix from ₹249. Bigger commercial plumbing work gets a free site visit and a written estimate. The final cost depends on washrooms and floors, type of work, pipe material and access."

### Borewell Pump & Pipe Repair
1. Title (58 chars): current "Borewell Pump & Pipe Repair Bhubaneswar | Mahapatra Plumbing" → Replace "Borewell Service & Repair Bhubaneswar | Mahapatra Plumbing"
2. H1: current "Borewell Pump & Pipe Repair in Bhubaneswar" → Replace "Borewell Service: Pump & Pipe Repair in Bhubaneswar" (quote it in YAML)
3. Otherwise strong: the clear "we do not drill" scope is excellent for GEO.

### Area: Chandrasekharpur
1. Add one landmark line once the owner confirms (see §3.8). Example shape: "We work across Chandrasekharpur, from the lanes around District Center to the {confirmed landmark} side."
2. Remove "plumber in bhubaneswar" from `secondary_keywords` and schema keywords (§3.9).
3. "Because we are your neighbours." is a fragment. Replace with "We are your neighbours."

### Area: Patia
1. Remove "plumber in bhubaneswar" from secondaries (§3.9).
2. Add a confirmed landmark (§3.8).

### Area: KIIT
No changes needed beyond a confirmed landmark. "Is Mahapatra Plumbing Services part of KIIT?" is a model GEO disambiguation answer.

### Area: Infocity
1. Optional 5th FAQ (local, not owned elsewhere):
   - **Q: Can you fix plumbing in our office on a Sunday?**
     A: Yes. We are open every day, Sunday included, from 8 AM to 10 PM. A weekend slot lets us work in office washrooms and pantries while the floor is empty. Book a day ahead if you can. Call or WhatsApp +91 9668875352 with the building name and the problem.

### Area: Niladri Vihar
1. Duplicates the motor service page's question H2. Current H2 "Why does my motor run but the overhead tank not fill?" with its body → Replace with: "## Why is the water flow weak upstairs in my Niladri Vihar house?
   In a house fed by a roof tank, upstairs flow depends on the downtake pipe and its valves. A half-closed valve, an air pocket, a choked line or scale inside old pipes can reduce it. We trace the line from tank to tap and tell you what needs changing. If the motor runs but the tank stays empty, see [water motor and pump repair](/services/water-tank-and-motor-repair/)."
   Then drop the FAQ "Why is the water flow weak on the first floor of my house?" (now the H2).
2. The FAQ "My overhead tank overflows every time the motor runs. Can you stop it?" duplicates the motor H2. Replace with:
   - **Q: Can you replace cracked pipes on my roof?**
     A: Yes. Roof and outside lines left in sun and rain often crack at the joints. We replace the cracked section with CPVC, UPVC or PPR pipe and check every joint for leaks. A small joint repair starts from ₹249. Longer runs get a written estimate before work starts.
3. With these changes the page keeps 3 question H2s and 5 FAQs.

### Area: Sailashree Vihar
1. Overlaps the Pipeline FAQ. Current H2 "How do you fix a concealed leak behind bathroom tiles?" → Replace "Is the damp wall in my Sailashree Vihar house a pipe leak?" (body stays; it already starts by checking pipe vs seepage).

### Area: Jayadev Vihar & Saheed Nagar
1. The keyword is not in a question H2. Current H2 "What plumbing jobs come up in Jayadev Vihar and Saheed Nagar?" → Replace "What does a plumber in Jayadev Vihar and Saheed Nagar usually fix?"
2. The geyser H2 repeats the geyser page's prices and scope. Keep it, but shorten it to the 2 rate facts plus a link, so the two pages do not compete.

### Area: Nayapalli & IRC Village
1. Grammar error. Current: "Our team lifts and lowers the submersible pump, replace column pipes, fix leaking joints and the non-return valve, and repair the line to your sump or tank."
   - Replace: "Our team lifts and lowers the submersible pump. We replace column pipes, fix leaking joints and the non-return valve, and repair the line to your sump or tank."
2. Optional 5th FAQ:
   - **Q: Do you work in Nayapalli apartment societies?**
     A: Yes. We fix flat plumbing and shared lines in Nayapalli apartment blocks, including drain stacks, chambers, overhead tank lines and motor lines. For common lines, we work with the society secretary and give one written estimate before work starts. Regular maintenance (AMC) is price on request.

---

## 6. Internal linking

- Hub-and-spoke works: Home links all 13 services and 8 areas. Every service links /pricing/ and /contact/ plus one area page, with a different area on each service (good spread). Every area links to the other 7 areas and the relevant services.
- Inbound counts: /pricing/ 24 pages, /contact/ 23, leak 17. The weakest are sewerage (6 pages, 2 anchors), borewell (7, 2 anchors), septic (12 pages, only 2 distinct anchors) and **/about/ (0)**.
- Anchor variety fixes:
  - Septic: vary anchors to include "sewage tank cleaning in Bhubaneswar" (Nayapalli, drain page) and "septic tank cleaning price" (pricing table row stays as is).
  - Borewell: add "borewell service in Bhubaneswar" as the anchor on Niladri Vihar.
  - Sewerage: add "sewer line repair" as the anchor on Nayapalli and the drain page.
  - About: 2 new contextual links (Home, Contact) as above.
- Area-page anchors to each other are often the bare area name ("Patia", "KIIT"). On 2–3 pages, use descriptive anchors ("plumber in Patia", "plumber near KIIT hostels"). Home, Chandrasekharpur and Infocity already do.

## 7. Mobile readability and conversion notes
- Sentence length is good site-wide (0–20% over 20 words). Paragraphs are 2–3 sentences. Tables are short (3–11 rows).
- The commercial page table has 11 rows, which means a long scroll on mobile. With the home AMC row removed it is 10. Consider splitting it into "Repairs" and "Bigger jobs" sub-tables, as /pricing/ does.
- Big-work pages put "free site visit" in the hero (good). Repair pages put the price in the hero (good). Keep it that way.
- Water tank cleaning has no number anywhere, so the hero needs a clear next step: "WhatsApp a photo of your tanks for a quote".

---

## 8. Prioritised fix list (top 20, by expected impact)

| # | Fix | Pages | Type | Impact |
|---|---|---|---|---|
| 1 | Quote the `meta_description` values so YAML parses; add a parse check to `check_pages.py` | renovation, contact, new house, pipeline, sewerage | Quick win | Build blocker |
| 2 | Change GBP hours from "Open 24 hours" to daily 8 AM–10 PM; align GBP services with the site's 13 service names | GBP (off-site) | Quick win | Very high (local pack, NAP) |
| 3 | Septic page: "septic & sewage tank" in H1, intro and table caption + 2 new FAQs | septic | Quick win | High (320 + 320/mo) |
| 4 | Replace FAQs that repeat H2s with the new Q&As in §5 | leak, septic, new house, sewerage, commercial, water tank, drain, motor | Medium rewrite | High (AEO coverage +25 questions) |
| 5 | Resolve the cross-page question conflicts in §3.3 | pricing, about, contact, renovation, leak, pipeline, Niladri, Sailashree | Medium rewrite | High (AEO, cannibalisation) |
| 6 | Add the "at a glance" entity table to Home and About | home, about | Quick win | High (GEO citations) |
| 7 | Add the trust strip under the H1 on all 13 service pages | services | Quick win | High (conversion) |
| 8 | Get 3 real Google review excerpts and show them on Home, About, Leak, Drain, Septic | 5 pages | Needs owner | High (conversion, GEO) |
| 9 | Water tank cleaning: add the cost H2 (no figure), restructure, cut repetition, 2 new FAQs, fact line | water tank | Medium rewrite | High (weakest page) |
| 10 | Geyser: "water heater" in H1 and intro, "geyser connection pipes" | geyser | Quick win | Medium-high (106 GBP searches) |
| 11 | About: keyword H1, owner E-E-A-T facts (owner name, year, real photo), 2 contextual inbound links | about | Needs owner | Medium-high (E-E-A-T, GEO) |
| 12 | Fittings: washing machine drain H2 + "bath / washroom fittings" FAQ | fittings | Quick win | Medium (90 + 90 + 110 + 110) |
| 13 | Hand hidden-leak ownership to Pipeline ("water leak detection"); leak page gets a pointer + commode / jet spray / seat FAQs | leak, pipeline | Medium rewrite | Medium (140 + 40 + 30) |
| 14 | Renovation: whole-renovation pitch incl. tiling on discussion; owner-compliant "how long" answer; GI H2 → pointer; Indian-to-western FAQ | renovation | Medium rewrite | Medium |
| 15 | Pricing: "price list" in H2 and meta; replace the unclog FAQ; clarify free visit = big works only (incl. commercial) | pricing | Quick win | Medium |
| 16 | Home: BBSR, "plumbing work", "book a plumber online"; drop the "today?" implication and filler line | home | Quick win | Medium (GSC gap terms) |
| 17 | Borewell title/H1 with "Borewell Service" | borewell | Quick win | Medium (260/mo) |
| 18 | Niladri Vihar de-cannibalisation (H2 + FAQ swap) | Niladri Vihar | Quick win | Medium |
| 19 | Area pages: 2–3 owner-confirmed landmarks each; remove "plumber in bhubaneswar" from Chandrasekharpur and Patia secondaries | 8 areas | Needs owner | Medium (local uniqueness) |
| 20 | Small fixes: Nayapalli grammar; commercial table home-AMC row; Contact H2 "Plumber contact number in Bhubaneswar"; branded email on a domain address; sewerage "local authority" named | various | Quick win | Low-medium |

Quick wins (under 1 hour total): #1, 3, 6, 7, 10, 12, 15, 16, 17, 18, 20.
Bigger rewrites: #4, 5, 9, 13, 14.
Owner-dependent: #2, 8, 11, 19.

---

## 9. Facts to confirm with the owner (from this audit)
- 3 real Google reviews to quote (reviewer first name, month, short excerpt).
- Owner's name and photo for the About page (the email suggests "Amaresh Mohapatra"; do not publish until confirmed), year the business started, and whether a team photo can be used.
- Spelling: is the family name "Mahapatra" or "Mohapatra"? Can a domain email (for example hello@mahapatraplumbing.in) replace the Gmail address?
- Which Bhubaneswar office approves new connections to the public sewer line (for the sewerage page).
- 2–3 landmarks or lane names per area that the team regularly works around.
- Confirm GBP hours have been changed from "Open 24 hours".
