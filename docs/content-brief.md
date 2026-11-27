# Content brief for every page (Phase 2) — mahapatraplumbing.in

Read before writing any page. For the remaining pages, also read `page-specs.md`. Also read the latest audit in `docs/audits/` and follow its decisions. Source docs in this folder: `rate-card.md`, `schema.md`, `sitemap.md`, `design-contact-and-gbp.md`, `tracking-plan.md`, `keyword-and-competitor-research.md`.

## Fixed facts (use exactly; never contradict)
- Name: Mahapatra Plumbing Services
- Address: District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016
- Phone / WhatsApp: +91 9668875352 (tel: `+919668875352`, wa.me `919668875352`)
- Email: amareshmohapatra143@gmail.com
- Hours: Open daily 8 AM – 10 PM. "Late-night and early-morning visits on request, subject to availability (extra charge may apply)." Late-night extra: +₹300.
- Service area: all of Bhubaneswar. Named areas: Chandrasekharpur, Patia, KIIT, Infocity, Niladri Vihar, Sailashree Vihar, Jayadev Vihar, Nayapalli (+ nearby Damana, Saheed Nagar, IRC Village). Never mention Madanpur.
- Big works (renovation, new house plumbing, sewerage, septic tank cleaning): pitch as "anywhere in Bhubaneswar". Small repairs: lean on the nearby areas around Chandrasekharpur, but never say "only".
- Proof: 5.0★ from 45 Google reviews (43 five-star) — visible text only, never `aggregateRating` in JSON-LD. Review themes customers mention: fair pricing, quality work, timely, kitchen and bathroom fixes. 90-day workmanship warranty on installation and repair jobs only (not cleaning jobs); parts follow brand warranty. Written estimate before work starts. Visit charge ₹199–₹349, adjusted in the final bill if work goes ahead. Payment: cash, UPI, bank transfer; GST invoice on request. Materials: CPVC, UPVC, PPR pipes.
- Customers: homes, flats, hostels and PGs (KIIT/Patia), shops, offices (Infocity), builders.
- Prices: only from `rate-card.md`. Do not invent any other price. Quote-only services say "Free site visit and written estimate".

## Owner answers (27 Nov 2026) — now fixed facts
- Septic tank cleaning is done with partners. Do NOT mention method, equipment, partners or disposal. Just say we arrange septic tank cleaning anywhere in Bhubaneswar.
- Also offered (added 27 Nov 2026): water tank / sump cleaning (no method, chemicals or partner mention; price on call), borewell pump and pipe repair on existing borewells (we do NOT drill), washing machine inlet and drain fitting.
- NOT offered, never mention as a service: solar water heater installation, gas pipeline work, borewell drilling. No per-point plumbing rate anywhere. No area pages or area mentions for Rasulgarh or Baramunda.
- Geyser: we do NOT repair or replace heating elements, thermostats or wiring. We fix plumbing-side faults (inlet/outlet leaks, valves, scaling, tank-joint leaks, installation) and tell the customer if an electrician or the brand's service centre is needed.
- Warranty: 90-day workmanship warranty on installation and repair jobs only. Not on cleaning jobs (drain, toilet blockage, septic, sewer jetting).
- Concealed pipeline repair / reroute: free site visit and written estimate.
- Job times: depend on the work. Never state durations; say "depends on the job; we tell you the expected time with the estimate".
- Parts and fittings: we supply fittings and parts; customers may also bring their own; the part price is shared before fitting (this is now allowed: "Part price shared before fitting").
- Bathroom re-plumbing and new house plumbing: never show a price; always "quote after free site visit and written estimate".
- Justdial: skip. Do not mention Justdial or link to it anywhere.

## Do NOT invent
Years in business, owner or staff names, team size, number of jobs done, certifications, brands stocked, equipment (e.g. suction tankers, CCTV cameras), response times in minutes, guarantees beyond the 90-day warranty, or specific customer stories. If a sentence needs such a fact, leave it out and add it to the "Facts to confirm" list at the end of the file. Never put placeholder text in the visible copy.

## Banned words and claims
"best", "No.1", "guaranteed", "no hidden charges", "no surprises", "trained", "certified", "full service", "24/7", "time plan", "in one visit", and any generalisation about what "many owners/customers" do. "near me" only once in body copy, in a natural sentence.

## Question ownership (no two pages answer the same question)
- /pricing/ owns: visit charge, late-night charge, parts, payment and GST, warranty terms.
- Each service page owns its own cost question ("How much does X cost in Bhubaneswar?") and its how/when/why questions.
- Home owns: what services, which areas, how to book. Home must not use a pricing question as an H2.
- Other pages mention the owned facts as bullets and link to the owner page.

## Area pages (doorway-page risk)
At least 60% unique copy per area page: local landmarks, building types (KIIT hostels and PGs, Infocity offices, apartment blocks), local problems, and a real job photo from that area. No find-and-replace templates.

## Voice
Plain, friendly Indian English for homeowners in Bhubaneswar. Short sentences (under 20 words), short paragraphs (2–3 sentences). Concrete, no hype ("best", "No.1", "guaranteed" are banned). Use ₹ and Indian terms people use: geyser, flush tank, jet spray, overhead tank, sump, soak pit, mistri. Second person ("you").

## SEO + AEO + GEO rules (every page)
- Meta title ends with "| Mahapatra Plumbing" or "| Mahapatra Plumbing Services", never "| Mahapatra" alone.
- Primary keyword (or a natural variant such as "septic tank cleaning in Bhubaneswar") in: meta title (≤60 chars), meta description (≤155 chars), H1, first 100 words, URL (already set). Phone in meta descriptions as "+91 9668875352". Secondary keywords used naturally once each; no stuffing.
- Structure: H1 → intro (answer-first, 40–60 words, names the business, area and phone) → H2 sections. At least 3 H2s are questions a customer asks, each followed immediately by a 40–60 word answer-first paragraph, then detail.
- One ₹ price table (markdown table, crawlable) with the rows relevant to the page, copied from the rate card.
- "Why Mahapatra" proof block using only the fixed facts.
- Service area paragraph: named areas + "and all of Bhubaneswar".
- 5–6 FAQs (question + 40–70 word answer). Questions phrased the way people search or ask AI.
- 3–6 internal links with descriptive anchor text, to pages in `sitemap.md` (related services, pricing, contact, relevant area pages).
- WhatsApp prefill goes in front matter as `whatsapp_prefill:`, never in body text. Forms use the template from tracking-plan.md §3 with `[Page: {PageTag} | Form: {form_id}]`.
- Allowed CTA locations: top_bar, header, hero, quick_quote_form, service_card, pricing_table, inline_content, faq, book_visit_form, contact_page, footer, sticky_mobile_bar.
- Breadcrumb: 2 levels (Home > Page) on every non-home page, shown as `[BREADCRUMB: Home > {Page}]` under the H1 and as BreadcrumbList in JSON-LD. Home has none.
- "Why choose" block: shared facts plus 2 points specific to that page.
- CTA placements marked in the copy as `[CTA: call+whatsapp | location=hero]`, `[CTA: ... | location=pricing_table]`, `[CTA: ... | location=inline_content]`, `[CTA: ... | location=faq]`. WhatsApp prefill text given per page: `Hi, I need a quote for {Service} in Bhubaneswar [Page: {PageTag}]`.
- Image slots marked `[IMAGE: filename.webp | alt="..." | where]`; 2–4 per page; alt text describes the scene + service + Bhubaneswar. Photos will be real job photos supplied later.
- Length: service pages 900–1,300 words of visible copy; home 900–1,200; pricing 600–900; area pages 600–900.

## Output file format
Write to `content/pages/{slug}.md` (home = `content/pages/home.md`). Structure:

```
---
url: /services/septic-tank-cleaning/
page_type: service            # home | service | locality | pricing | about | contact | legal
whatsapp_prefill: "Hi, I need a quote for {Service} in Bhubaneswar [Page: {PageTag}]"
page_tag: Septic              # used in WhatsApp [Page: ...] tag and data-service
meta_title: ...
meta_description: ...
primary_keyword: ...
secondary_keywords: [..., ...]
h1: ...
word_count: ...
---

(page copy in markdown: H1, sections, table, FAQs, CTA and IMAGE markers, internal links as [anchor](/path/))

## JSON-LD
```json
{ full "@graph" for this page, following docs/schema.md exactly: Plumber node (no aggregateRating), WebSite node, WebPage (with keywords), Service (service pages), FAQPage (same text as visible FAQs), BreadcrumbList (2 levels; none on home) }
```

## Facts to confirm
- bullet list of anything the owner should confirm (or "None")
```

## Self-check before finishing
- Every price matches `rate-card.md`; every keyword in schema `keywords` appears in visible text.
- FAQ text in JSON-LD is identical to the visible FAQs. JSON is valid (parse it).
- Title ≤60 chars, description ≤155 chars (count them).
- No invented facts, no Madanpur, no placeholder text in visible copy.

## Owner answers, 27 Nov 2026 (round 2) — apply on every page
- Visit charge ₹199–₹349 is correct (adjusted in the final bill).
- Septic: never mention partners. Writing "we" for the septic job is fine.
- Free site visit ONLY for big works: concealed pipeline, bathroom/kitchen renovation, new house/bathroom plumbing, sewerage & drainage works, commercial work. Never offer a free visit for small repairs. Do not promise it is free "even if you don't go ahead".
- Civil work (tiling, plaster, digging, chamber work): we can do it too, after discussing it with the customer. Do not say "plumbing only" or "your mistri does the civil work". Say e.g. "We can also handle the tiling, plaster or civil work, after discussing it with you."
- Motor rewinding / electrical faults: always referred to a motor mechanic or electrician (keep current wording).
- Borewell: our team lifts and lowers the submersible pump itself.
- We fit taps and fittings that customers bought online or from shops.
- Hidden / concealed leaks: we open only the part of the wall or floor that is needed, and test before closing it.
- AMC: ₹999 per quarter is for homes only. Commercial AMC (hostels, PGs, offices, hotels, shops, apartment societies): price on request ("Call or WhatsApp us for a quote"). No figure, no "quoted after free site visit" wording for AMC.
- No walk-ins at District Center: customers call or WhatsApp first; we come to them.
- Languages on calls: Odia, Hindi and English (schema availableLanguage: or, hi, en).
