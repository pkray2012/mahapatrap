# Sitemap (Phase 1 draft, 27 Nov 2026)

Full keyword matrix (76 keywords, one primary keyword per page): https://claude.ai/artifact/MJtasm54H78VXN6xwfZ1ga

| URL | Page | Type | Primary keyword | Priority |
|---|---|---|---|---|
| / | Home | Core | plumber in bhubaneswar | High |
| /pricing/ | Pricing | Core | plumber charges in bhubaneswar | High |
| /about/ | About | Core | plumbing company in bhubaneswar | Medium |
| /contact/ | Contact | Core | plumber bhubaneswar contact number | Medium |
| /privacy-policy/ | Privacy Policy | Legal | — | Low |
| /services/septic-tank-cleaning/ | Septic Tank Cleaning | Big work (all Bhubaneswar) | septic tank cleaning bhubaneswar | High |
| /services/bathroom-plumbing-renovation/ | Bathroom & Kitchen Plumbing Renovation | Big work | bathroom renovation bhubaneswar | High |
| /services/new-bathroom-and-house-plumbing/ | New Bathroom & House Plumbing | Big work | new house plumbing work | High |
| /services/sewerage-and-drainage-works/ | Sewerage & Drainage Works | Big work | sewerage work contractor bhubaneswar | Medium |
| /services/commercial-plumbing/ | Commercial Plumbing (hotels, offices, hostels, shops) | Big work | commercial plumbing bhubaneswar | High |
| /services/geyser-installation-and-repair/ | Geyser Installation & Repair | Repair | geyser repair near me | High |
| /services/drain-cleaning-and-sewer-jetting/ | Drain Cleaning & Sewer Jetting | Repair | drain cleaning bhubaneswar | High |
| /services/leak-and-blockage-repair/ | Leak & Blockage Repair | Repair | pipe leakage repair near me | High |
| /services/bathroom-and-kitchen-fittings/ | Bathroom & Kitchen Fittings | Repair | bathroom fitting plumber near me | Medium |
| /services/water-tank-and-motor-repair/ | Water Tank & Motor Repair | Repair | water motor repair near me | Medium |
| /services/pipeline-and-concealed-plumbing/ | Pipeline & Concealed Plumbing | Repair | concealed pipe leakage repair | Medium |
| /services/water-tank-cleaning/ | Water Tank & Sump Cleaning | Big work (all Bhubaneswar) | water tank cleaning bhubaneswar | High |
| /services/borewell-pump-and-pipe-repair/ | Borewell Pump & Pipe Repair | All Bhubaneswar | borewell service near me | High |
| /areas/chandrasekharpur/ | Chandrasekharpur (+ Damana) | Locality | plumber in chandrasekharpur | High |
| /areas/patia/ | Patia | Locality | plumber in patia | High |
| /areas/niladri-vihar/ | Niladri Vihar | Locality | plumber in niladri vihar | Medium |
| /areas/sailashree-vihar/ | Sailashree Vihar | Locality | plumber in sailashree vihar | Medium |
| /areas/jayadev-vihar/ | Jayadev Vihar (+ Saheed Nagar) | Locality | plumber in jayadev vihar | Medium |
| /areas/nayapalli/ | Nayapalli (+ IRC Village) | Locality | plumber in nayapalli | Medium |
| /areas/kiit/ | KIIT (hostels, PGs, homes) | Locality | plumber near kiit | High |
| /areas/infocity/ | Infocity (offices, apartments) | Locality | plumber in infocity bhubaneswar | Medium |
| /sitemap.xml, /robots.txt | Technical | — | — | High |

Rules
- One primary keyword per URL; no two pages target the same primary keyword.
- Drain cleaning = repair visits; sewerage & drainage works = new lines / project work; septic tank cleaning = its own page.
- Fittings = single-item installs; renovation = whole bathroom/kitchen re-plumb; new bathroom & house = fresh construction.
- Locality pages target "plumber in {area}" for small repair works near Chandrasekharpur and link to service pages. Big-work pages say "all of Bhubaneswar".
- Areas = exactly the areas listed on the current website (Chandrasekharpur, Patia, Niladri Vihar, Sailashree Vihar, KIIT, Infocity, Jayadev Vihar, Nayapalli) + "Entire Bhubaneswar" for big works. Madanpur is not used.
- Commercial Plumbing added 27 Nov 2026 (India: 'commercial plumbing' 140/mo, 'commercial plumbing services' 50/mo; Bhubaneswar volume not measurable). New-house page also targets 'house plumbing work' (India 590/mo) and 'plumbing contractor' (India 590/mo). 26 pages total after 27 Nov keyword research (water tank cleaning + borewell added).
- Septic tank cleaning was added as a 10th service page after research (~490 searches/month, low difficulty).

## Service area wording (confirmed 27 Nov 2026)
- Every page states: "Serving all of Bhubaneswar". Area pages and the home areas list name the 8 areas above, then "and all of Bhubaneswar".
- Nearby mentions kept: Damana (on Chandrasekharpur page), Saheed Nagar (on Jayadev Vihar page), IRC Village (on Nayapalli page).

## Google Map (for local SEO)
- Embed the business's own Google Maps listing (CID 4373818382391816251, District Center, Chandrasekharpur 751016), not the generic "Chandrasekharpur" area map used today.
- Where: Contact page (full map), Home page (map in the areas section), every area page (small map + "Get directions" link).
- Speed: the map loads as a static preview image with a "View on Google Maps" button; the live map loads only when tapped, so mobile speed stays 95+.
- Footer on every page: address + "Get directions" link to the listing (`https://www.google.com/maps?cid=4373818382391816251`), tracked as `directions_click`.
- Schema `hasMap` on the Plumber entity points to the same listing URL.

## Every page must pass (SEO + AEO + GEO checklist)
SEO
- One primary keyword (Keyword Matrix), in title (≤60 chars), meta description (≤155), H1, first paragraph and URL
- Clean H1 → H2 → H3; 3–6 internal links (related services, matching area pages, pricing, contact); breadcrumb
- Canonical, Open Graph, WebP images with width/height and local alt text; in sitemap.xml
AEO (answer engines, Google AI Overviews)
- Question-style H2s with a 40–60 word answer-first paragraph under each
- ₹ price table for that service from the rate card
- 5–6 FAQs per page + FAQPage schema
GEO (generative engines: ChatGPT, Gemini, Perplexity)
- Same entity facts on every page: Mahapatra Plumbing Services · District Center, Chandrasekharpur, Bhubaneswar 751016 · +91 9668875352 · Mon–Sun 8 AM–10 PM · 5.0★ (45 Google reviews) · 90-day workmanship warranty
- Concrete proof: prices, warranty, materials (CPVC/UPVC/PPR), areas, typical job times; no vague claims
- Plumber + Service + FAQPage + BreadcrumbList JSON-LD; crawlable HTML tables (no images of text)
- Before deploy: keyword volume check + independent sub-agent audit of SEO, AEO and GEO for every page
- 27 Nov 2026 keyword research (`docs/research/2026-11-27-keyword-universe.md`), owner answers: water tank/sump cleaning YES (own page), borewell pump and pipe work YES (own page, no drilling), washing machine inlet/drain fitting YES (section on fittings page), solar water heater NO, gas pipeline NO, Rasulgarh/Baramunda area pages NO, plumbing rate per point NO price shown.
