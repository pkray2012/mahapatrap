# Content brief for every page (Phase 2) — mahapatraplumbing.in

Read before writing any page. Source docs in this folder: `rate-card.md`, `schema.md`, `sitemap.md`, `design-contact-and-gbp.md`, `tracking-plan.md`, `keyword-and-competitor-research.md`.

## Fixed facts (use exactly; never contradict)
- Name: Mahapatra Plumbing Services
- Address: District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016
- Phone / WhatsApp: +91 9668875352 (tel: `+919668875352`, wa.me `919668875352`)
- Email: amareshmohapatra143@gmail.com
- Hours: Open daily 8 AM – 10 PM. "Late-night and early-morning visits on request, subject to availability (extra charge may apply)." Late-night extra: +₹300.
- Service area: all of Bhubaneswar. Named areas: Chandrasekharpur, Patia, KIIT, Infocity, Niladri Vihar, Sailashree Vihar, Jayadev Vihar, Nayapalli (+ nearby Damana, Saheed Nagar, IRC Village). Never mention Madanpur.
- Big works (renovation, new house plumbing, sewerage, septic tank cleaning): pitch as "anywhere in Bhubaneswar". Small repairs: lean on the nearby areas around Chandrasekharpur, but never say "only".
- Proof: 5.0★ from 45 Google reviews (43 five-star). Review themes customers mention: fair pricing, quality work, timely, kitchen and bathroom fixes. 90-day workmanship warranty; parts follow brand warranty. Written estimate before work starts. Visit charge ₹199–₹349, adjusted in the final bill if work goes ahead. Payment: cash, UPI, bank transfer; GST invoice on request. Materials: CPVC, UPVC, PPR pipes.
- Customers: homes, flats, hostels and PGs (KIIT/Patia), shops, offices (Infocity), builders.
- Prices: only from `rate-card.md`. Do not invent any other price. Quote-only services say "Free site visit and written estimate".

## Do NOT invent
Years in business, owner or staff names, team size, number of jobs done, certifications, brands stocked, equipment (e.g. suction tankers, CCTV cameras), response times in minutes, guarantees beyond the 90-day warranty, or specific customer stories. If a sentence needs such a fact, leave it out and add it to the "Facts to confirm" list at the end of the file. Never put placeholder text in the visible copy.

## Voice
Plain, friendly Indian English for homeowners in Bhubaneswar. Short sentences (under 20 words), short paragraphs (2–3 sentences). Concrete, no hype ("best", "No.1", "guaranteed" are banned). Use ₹ and Indian terms people use: geyser, flush tank, jet spray, overhead tank, sump, soak pit, mistri. Second person ("you").

## SEO + AEO + GEO rules (every page)
- Primary keyword in: meta title (≤60 chars), meta description (≤155 chars), H1, first 100 words, URL (already set). Secondary keywords used naturally once each; no stuffing.
- Structure: H1 → intro (answer-first, 40–60 words, names the business, area and phone) → H2 sections. At least 3 H2s are questions a customer asks, each followed immediately by a 40–60 word answer-first paragraph, then detail.
- One ₹ price table (markdown table, crawlable) with the rows relevant to the page, copied from the rate card.
- "Why Mahapatra" proof block using only the fixed facts.
- Service area paragraph: named areas + "and all of Bhubaneswar".
- 5–6 FAQs (question + 40–70 word answer). Questions phrased the way people search or ask AI.
- 3–6 internal links with descriptive anchor text, to pages in `sitemap.md` (related services, pricing, contact, relevant area pages).
- CTA placements marked in the copy as `[CTA: call+whatsapp | location=hero]`, `[CTA: ... | location=pricing_table]`, `[CTA: ... | location=inline_content]`, `[CTA: ... | location=faq]`. WhatsApp prefill text given per page: `Hi, I need a quote for {Service} in Bhubaneswar [Page: {PageTag}]`.
- Image slots marked `[IMAGE: filename.webp | alt="..." | where]`; 2–4 per page; alt text describes the scene + service + Bhubaneswar. Photos will be real job photos supplied later.
- Length: service pages 900–1,300 words of visible copy; home 900–1,200; pricing 600–900; area pages 600–900.

## Output file format
Write to `content/pages/{slug}.md` (home = `content/pages/home.md`). Structure:

```
---
url: /services/septic-tank-cleaning/
page_type: service            # home | service | area | pricing | about | contact | legal
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
{ full "@graph" for this page, following docs/schema.md exactly: Plumber node, WebSite node, WebPage (with keywords), Service (service pages), FAQPage (same text as visible FAQs), BreadcrumbList }
```

## Facts to confirm
- bullet list of anything the owner should confirm (or "None")
```

## Self-check before finishing
- Every price matches `rate-card.md`; every keyword in schema `keywords` appears in visible text.
- FAQ text in JSON-LD is identical to the visible FAQs. JSON is valid (parse it).
- Title ≤60 chars, description ≤155 chars (count them).
- No invented facts, no Madanpur, no placeholder text in visible copy.
