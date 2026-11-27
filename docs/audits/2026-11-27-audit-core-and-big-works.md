# Independent audit: core pages and big-work pages (27 Nov 2026)

Scope: 9 files in `content/pages/`: home, pricing, about, contact, privacy-policy, new-bathroom-and-house-plumbing, sewerage-and-drainage-works, commercial-plumbing, water-tank-cleaning.
Rules used: `content-brief.md` (with the owner answers from 27 Nov), `rate-card.md`, `schema.md`, `sitemap.md`, `page-specs.md`, the keyword universe and the decisions in `2026-11-27-first-5-pages.md`.

How it was checked (by script, then by reading each page):
- The JSON-LD parses on all 9 pages. FAQ JSON-LD matches the visible FAQs word for word (42/42 questions).
- Every WebPage/AboutPage/ContactPage `keywords` term appears in the visible text. Some appear as the natural "in Bhubaneswar" or "for Bhubaneswar" variant, which `schema.md` allows.
- Titles are ≤60 characters and end with "| Mahapatra Plumbing" or "| Mahapatra Plumbing Services". Descriptions are ≤155 characters.
- Every ₹ figure is on the rate card. There is no figure for water tank cleaning, borewell work, renovation, new house plumbing or a per-point rate.
- None of these appear: Justdial, Madanpur, Rasulgarh, Baramunda, solar, gas piping, drilling, aggregateRating, banned words, stated job durations or response times, or septic method/partner wording.
- No page claims a warranty on cleaning jobs. Geyser element and wiring faults are mentioned only as a referral to an electrician or service centre (commercial FAQ), which the rule allows.
- "near me" is used at most once in the body of each page.

Word counts below are my count of visible copy: no front matter, JSON-LD, markers or Facts. The writers' `word_count` values run about 10–60 words higher.

## Summary

| Page | Score /10 | Hard fixes made | Judgement items (top) |
|---|---|---|---|
| home | 8 | Added Water Tank & Sump Cleaning, Borewell Pump & Pipe Repair and Commercial Plumbing to the services grid. Services answer paragraph and estimate line updated. word_count updated. | Intro opens with a question and "today" (suggests same-day help). Reviews still have no real excerpts. |
| pricing | 8 | Added a quote-only tank-cleaning row and a borewell row ("Quote after inspection / Part price shared before fitting"), plus 2 matching Offers in the OfferCatalog. Fixed a missing blank line before the "Are parts included" H2. Trimmed to stay ≤900 words (897). Updated the stale warranty fact. | Drain cost FAQ cannibalises the drain page. The visit charge is answered 3 times. No commercial AMC row. Concealed wording differs from other rows. |
| about | 7 | None | 845 words, over the 500–800 spec. Customer-behaviour generalisations. Mostly repeats home. |
| contact | 8 | None | "What details should I share" overlaps home and tank FAQs. Keyword sentence sounds forced. Thin "What to send" H2. |
| privacy-policy | 8 | None | Needs a lawyer review. Tool list must match what is live. Website host not named. |
| new-bathroom-and-house-plumbing | 8 | None | 2 H2/FAQ pairs are near-duplicates. 1,296 words, at the cap. Builder angle overlaps commercial fit-outs. |
| sewerage-and-drainage-works | 7 | None | 4 of 6 FAQs repeat the H2 questions. "Flow check" and approval statements are unconfirmed. |
| commercial-plumbing | 7 | None | 8 internal links (guide is 3–6). 3 FAQs duplicate H2s. AMC row is not on the rate card. Unconfirmed process promises. |
| water-tank-cleaning | 7 | None | The top intent ("what does it include") is unanswered. "Sintex-type" is a brand name. "Call or WhatsApp us for a quote" appears 6+ times. No borewell link. |

Total hard fixes: 11 edits in 2 files (home.md: 4, pricing.md: 7). No other file needed a hard fix.

## Per-page detail

### home.md (/) — 8/10
Fixes made
1. Added 3 cards under "Bigger jobs anywhere in Bhubaneswar":
   - Water Tank & Sump Cleaning: "Call or WhatsApp us for a quote." No figure.
   - Borewell Pump & Pipe Repair: "Pump and pipe repair on existing borewells. Quote after inspection."
   - Commercial Plumbing. It already had its own page but was missing from the grid.
2. Services answer paragraph now names septic and water tank cleaning, borewell pump repair and commercial work. It stays 40–60 words.
3. Estimate line now reads: "Renovation, new plumbing, sewerage and bigger commercial jobs get a free site visit and written estimate."
4. `word_count` set to 1,159 (inside 900–1,200). The FAQs were not changed, so the JSON-LD is still in sync (5/5).

Judgement (not changed)
- The intro starts "Need a plumber in Bhubaneswar today?" A citable intro should open with the entity statement ("Mahapatra Plumbing Services is a plumber in Bhubaneswar…"). "Today" also suggests same-day availability, which nobody has confirmed.
- The H1 names "Repairs, Renovation & Septic Cleaning". That is fine, but water tank cleaning (High priority in the sitemap) gets no hero mention.
- The home page links to 24 pages. That is acceptable for a hub page.
- The reviews section has only a summary. It needs real excerpts, used with permission, for proof and GEO.
- GEO entity facts are strong: name, address, phone, hours, 5.0★/45, warranty scope and materials.

### pricing.md (/pricing/) — 8/10
Fixes made
1. "Cleaning" table: added `Water tank / sump cleaning | Call or WhatsApp us for a quote | Overhead tanks and sumps.` with no figure.
2. "Bigger jobs" table: added `Borewell pump & pipe repair | Quote after inspection | Part price shared before fitting.`
3. OfferCatalog: added 2 Offers with no price (description only), each linked to its service URL.
4. Added the missing blank line before "## Are parts included in the price?". The H2 was glued to the previous paragraph.
5. Trimmed 3 short lines to keep the page ≤900 words (now 897):
   - removed the duplicate "Visit charge adjusted" bullet
   - shortened the bigger-jobs line
   - changed "Rates updated 27 November 2026."
6. Facts to confirm: marked the warranty-on-cleaning question resolved (owner answered 27 Nov) and noted the two new quote-only rows.

Judgement
- **Cannibalisation:** the FAQ "How much does it cost to unclog a toilet or drain in Bhubaneswar?" answers the drain page's own cost question. The previous audit put it here, but the brief's ownership rule says each service page owns its cost question. Consider swapping it for "Do you supply the parts, or can I buy my own?" (a parts question, which pricing owns).
- The visit charge is answered 3 times: the H2 and 2 FAQs ("minimum plumber charge" and "Do I pay the visit charge…"). Merge 2 of them into one and use the free slot for payment methods.
- "Applies to every job" includes the warranty, but the warranty excludes cleaning jobs. The bullet says so, but the heading reads oddly. Consider "Late-night and warranty".
- Wording differs across rows: concealed says "Quote after free site visit" while the others say "Quote after inspection". The owner has now confirmed a free site visit for concealed work, so align the wording.
- There is no commercial maintenance contract row. The commercial page has one ("Quote after free site visit + written estimate"). Add it here or remove it there.
- "2026" in the title and H1 needs updating every January.

### about.md (/about/) — 7/10
No hard breaks.
Judgement
- 845 words, over the page-spec range of 500–800. Possible trims: the late-night text in the "Open daily" bullet, and the repeated "written estimate" sentence in "Who is…".
- "Families call us for leaks… Builders call for…" generalises what customers do. The brief bans generalisations about "many customers". Restate it as service scope.
- The copy repeats much of home: service list, rate table and areas. There is little About-only content (story, values, how a visit runs) because owner facts are not confirmed. GEO would gain most from the owner name, start year and team size, once confirmed.
- "plumber in chandrasekharpur" is a secondary keyword here but the primary of /areas/chandrasekharpur/. `schema.md` allows it. Keep it out of headings to avoid cannibalisation (currently fine).
- The FAQ "Is Mahapatra Plumbing the same as Mahapatra Plumbing Services?" is a good entity-disambiguation answer for AI engines.

### contact.md (/contact/) — 8/10
No hard breaks. 491 words (range 300–500).
Judgement
- "What details should I share to get a plumbing quote?" overlaps home's "What should I tell you when I book a plumber?" and the tank page's booking-details FAQ. Contact should own this question. Reword home's FAQ toward "how to book" only.
- "Save it as your plumber near me contact number for the next leak." reads as keyword placement. Fine once, but weak.
- The H2 "What to send on WhatsApp" is one sentence long. That is thin. Merge it into the FAQ or expand it.
- It suggests email for GST invoice requests. Not confirmed (see Facts).

### privacy-policy.md (/privacy-policy/) — 8/10
No hard breaks. 882 words (range 600–900). The tool list matches `tracking-plan.md` (GTM, GA4, Clarity, Google Ads, Microsoft UET, Meta Pixel with opt-in Advanced Matching).
Judgement
- Needs a lawyer review before ads go live (DPDP wording, nomination right, cross-border line).
- Remove rows for any tool not switched on at launch.
- There is no internal link to /contact/. Optional for a legal page.

### new-bathroom-and-house-plumbing.md — 8/10
No hard breaks. The per-point FAQ only says no per-point rate is published, with no figure. That is allowed and captures "plumbing rates per point" searches.
Judgement
- The cost H2 and cost FAQ are near-identical, and so are "When should the plumber start" and "When should I call a plumber while building". Near-duplicate Q&A on one page adds little. Use the FAQ slots for new questions, such as "Do you provide the plumbing layout drawing?" (only if the owner confirms) or "What is a leak test before tiling?".
- 1,296 words, at the 1,300 cap. Any addition needs a matching cut.
- The H2 "Plumbing contractors in Bhubaneswar for builders" and the builder FAQ overlap with commercial's "new offices, shops and washroom fit-outs" FAQ. Keep builders/residential here and businesses on commercial.
- Process claims (slab-stage pipes, leak test before tiling) are stated as fact but listed in the page's own Facts to confirm.
- No area page is linked. Not required by the spec, but one link (e.g. Patia or Nayapalli) would help local relevance.

### sewerage-and-drainage-works.md — 7/10
No hard breaks. The title is exactly 60 characters. "drainage cleaner company in odisha" was correctly left out (no Odisha-wide claim).
Judgement
- 4 of the 6 FAQs repeat the 4 question H2s almost word for word (cost, broken line, permission, drain cleaning vs sewerage). This is the weakest AEO use of FAQ slots in this batch. Replace 2–3 of them, for example "Can a sewer line be repaired without breaking the whole floor?" (only if confirmed) or "What pipe is used for sewer lines?" (after the owner confirms).
- "Usually, yes… generally needs approval from the local authority" is hedged but is still a general legal statement. It should name the authority once the owner confirms it (see Facts).
- "Flow check before closing" is presented as a differentiator. It is unconfirmed and not in the page's Facts list, so I added it to the consolidated list.
- Drain cleaning and septic are separated well, with clear routing links.

### commercial-plumbing.md — 7/10
No hard breaks. The geyser FAQ says "For heating element or wiring faults, we tell you if an electrician or the brand's service centre is needed". That is a referral, not a repair claim, so it complies.
Judgement
- 8 internal links: pricing, infocity, kiit, drain, motor, tank cleaning, new house, contact. The guideline is 3–6. Drop 2, for example the duplicate contact link and motor or new house.
- The 3 question H2s are repeated as FAQs (cost, AMC, business hours).
- The table row "Commercial maintenance contract | Quote after free site visit + written estimate" comes from the page spec, not the rate card (the page itself flags this).
- These process claims are unconfirmed: "One written estimate for the whole building… listing every washroom, tank and line we checked" and "we work floor by floor".
- Hotels, guest houses, restaurants and cafes are not in the brief's customer list. They are offered as service types, not claimed as clients. That is acceptable but needs owner confirmation.
- Front matter `word_count: 1302` is over the 1,300 cap by the writer's own count (my count is 1,236). Recount before build.

### water-tank-cleaning.md — 7/10
No hard breaks. It shows no price (no figure, no table, no cost question), claims no warranty, describes no method, chemicals or disposal, and does not say who does the work.
Judgement
- **The top AEO intent is unanswered.** The spec's "What does water tank cleaning include?" was dropped because the method cannot be described. AI answers for "water tank cleaning Bhubaneswar" will cite pages that explain scope. Once the owner confirms the method (Facts), add that H2 with a scope-level answer.
- The first H2 is "How do I book water tank cleaning for an apartment?". That is narrower than the primary intent (all homes). Consider a general booking H2 with an apartment sub-point.
- "Sintex-type" is a brand name used as a generic term. That is a trademark and unverifiable-brand risk. Use "plastic (PVC/polyethylene) overhead tanks".
- "Call or WhatsApp us for a quote" appears 6+ times. It is the owner-mandated line, but the repetition reads as filler. Keep it in the intro, booking H2, sump H2 and 1 FAQ.
- "At least twice a year" is general guidance stated as fact (listed in Facts). "Borewell water often carries more sand and iron" is generic and acceptable.
- The borewell context is there but not linked. Link "borewell water" to /services/borewell-pump-and-pipe-repair/ (it would replace the contact link to stay at 6).
- The "How often" and "together" questions appear as both H2 and FAQ (duplication).

## Cross-page findings
- **H2 vs FAQ duplication** is the main pattern on new house, sewerage, commercial and tank cleaning: the same question answered twice on one page. It is not a rule break, but it wastes 2–4 FAQ slots per page that could capture new long-tail questions.
- **Question ownership:** pricing's drain-cost FAQ conflicts with the drain page. Booking-details FAQs appear on home, contact and tank cleaning (contact should own them). Builders and fit-outs are split between new house and commercial.
- **Service lists are now complete** on home and pricing (13 services, matching `knowsAbout`). The about page already listed borewell and tank cleaning in text.
- **Visit charge on quote-only and big jobs:** several pages leave it unclear whether the ₹199–₹349 visit charge applies, or whether the "free site visit" replaces it. One owner answer would settle this on 5+ pages.

## Facts to confirm with owner (consolidated, deduplicated)

Pricing and charges
1. What decides the visit charge within ₹199–₹349 (distance, job type, time)?
2. Does the ₹199–₹349 visit charge apply to commercial repair calls, water tank cleaning and borewell inspections? Is the "free site visit" for new house, sewerage, concealed and commercial work free even when the customer does not go ahead?
3. Optional: a typical starting price for bathroom re-plumbing / new house plumbing, if the owner wants one shown.
4. Water tank / sump cleaning: confirm "no price on the website" stays (price per tank, if it ever changes).
5. AMC: what a home AMC (from ₹999 per quarter) and a commercial AMC cover (visits, checks, labour/parts discounts). Should the "Commercial maintenance contract" row appear on commercial and pricing?
6. Does commercial work outside 8 AM – 10 PM carry the same +₹300 late-night extra?

Business identity and contact
7. Can customers walk in at District Center, Chandrasekharpur (office or shop, and its hours)?
8. Owner name, start year and team size for the About page (all left out until confirmed).
9. Any trade registration or GST number to display.
10. Is email checked daily? Should GST invoice requests go by email or WhatsApp?
11. Languages spoken on calls (Odia, Hindi, English). Schema says English only.
12. Google Business Profile: add +91 9668875352 and change hours from "Open 24 hours" to 8 AM – 10 PM so NAP and hours match.
13. The project description still says a ₹149–₹299 visit charge and 4.9★ from another platform. The website uses the rate card (₹199–₹349) and Google (5.0★, 45 reviews). Update the project description.

Proof and media
14. Real job photos for every image slot (home 3, pricing 3, about 3, contact 2, new house 3, sewerage 3, commercial 3, water tank 3).
15. Real review excerpts, with the reviewers' permission, for home and about.
16. Commercial client names or references the owner is willing to show (none on the site now).

Scope and process claims
17. New house: confirm the team does no civil work or drawings, and whether the estimate is itemised (per bathroom, floor or point). Does the team place pipes or sleeves at the slab stage? How is the leak test done? Do they take multi-storey builder projects, and what are the stage-wise payment terms? Do they lay rainwater down pipes and connect the house drain to the main sewer on new houses?
18. Sewerage: is the digging, chamber building and floor re-closing done in-house or with a civil mistri? Do they help with sewer connection approval, and which authority handles it in Bhubaneswar? Which pipe types and sizes are used? Does the 90-day warranty cover sewer line laying? Is sewer jetting available for repeat blockages? Is a water "flow check before closing" done on every job? (The last point was added by this audit.)
19. Commercial: do they serve hotels, guest houses, restaurants and cafes? Can they work floor by floor? Do they coordinate with civil or interior contractors on fit-outs? Is "one written estimate listing every washroom, tank and line" an accurate promise? (The last point was added by this audit.)
20. Water tank cleaning: should the cleaning method be described (steps, tools, agents), and is the work done in-house? Is "at least twice a year" the right interval? Should customers store water beforehand? Can apartment bookings be scheduled around water supply timings? Is "Sintex-type" acceptable wording, or should it be replaced with a generic term? (The last point was added by this audit.)
21. Home intro: is same-day help ("Need a plumber in Bhubaneswar today?") something the business can offer most days? (Added by this audit.)

Legal
22. Privacy policy: lawyer review before ads start. Confirm the grievance contact (named person?) and a reply time, which tools are live at launch, the retention periods (GA4, Clarity, WhatsApp chats, bills), and whether to name the host (Netlify).
