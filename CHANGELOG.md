# Change log

All changes to mahapatraplumbing.in are recorded here, newest first.

## 2026-11-27

- Round 2 audit fixes (auditors A + B) on all 26 pages and docs: YAML front matter quoted (5 meta_descriptions) and check_pages.py now parses front matter with PyYAML; septic method wording removed (meta, intro, steps, alt, FAQ, JSON-LD) and H1 now "Septic & Sewage Tank Cleaning"; borewell scope fixed on Niladri Vihar/Nayapalli, drilling-contractor referral removed; warranty scoped to installation and repair jobs and "subject to availability" added everywhere; ~25 FAQs that repeated H2s or other pages replaced; trust strip on all 13 service pages; "at a glance" fact table on home and about; water tank cleaning reworked ("quote" line 3 uses, fact table, new FAQs, no price/method); keyword quick wins (geyser water heater, borewell service, washing machine H2, price list, BBSR, plumbing work); privacy JSON-LD gets Plumber + WebSite; Niladri headline; pricing AMC offer renamed; home AMC row off commercial; /about/ linked from home and contact; stale lines fixed in content-brief, page-specs, sitemap, schema (§2, §4, §5, §7 synced to pages), design doc, rate card, tracking plan, keyword research.
- AMC ₹999 price hidden everywhere (owner): pricing, commercial, KIIT, schema offers, rate card, brief; check script now flags any AMC price. Added owner SVG logos (horizontal navy lockup, colour icon) + header PNG export to brand/final/.
- Owner answers round 2 applied to all 26 pages: civil work (tiling, plaster, digging, chamber) offered after discussion instead of "plumbing only"; commercial AMC now "price on request" (KIIT, Infocity, Chandrasekharpur, Jayadev Vihar, commercial; new Commercial AMC row + Offer on /pricing/); no walk-ins (about FAQ, contact); Odia/Hindi/English on about and contact, ContactPoint availableLanguage or/hi/en; borewell pump lifted and lowered by our own team; hidden leaks: only the needed part opened and tested before closing (leak, pipeline, Sailashree Vihar); new house per-point rate discussed only over a call. Settled items removed from each page's Facts to confirm. word_count front matter recounted with scripts/check_pages.py.
- Keyword targeting: "plumber in chandrasekharpur" removed from about, Infocity, Niladri Vihar and Sailashree Vihar keywords; "plumber in patia" removed from KIIT. schema.md section 7 and pricing OfferCatalog synced.
- Added scripts/check_pages.py (JSON-LD parse, FAQ match, keywords in visible text, title/description length, rate-card prices, banned terms, round-2 rules, word counts).

- Logo: removed baked-in checkerboard from owner's logo (5.png) -> brand/final/ transparent PNG, white variant for dark footer, icons 512/192/180/32.
- Owner answers round 2 recorded in content-brief.md and rate card (visit ₹199–₹349 confirmed; free site visit only for big works; civil work on discussion; commercial AMC price on request; no walk-ins; Odia/Hindi/English).
- Independent SEO/AEO/GEO audit of all 26 pages (3 auditors, reports in docs/audits/): ~40 fixes incl. borewell drilling wording, tank-cleaning price line on Niladri Vihar, duplicate FAQs across area pages, missing area/contact links, home + pricing now list water tank cleaning, borewell and commercial. Removed 'Sintex' brand name and 'in one call' wording. schema.md section 7 keywords synced.
- All 26 pages drafted (added borewell, KIIT, Infocity, Patia, Sailashree Vihar, Nayapalli). Plumber schema knowsAbout synced to 13 services on every page + schema.md. Chandrasekharpur tank-cleaning price wording replaced with "call or WhatsApp us for a quote".
- Draft copy written (pre-audit) for 15 pages: about, contact, privacy-policy, new house, sewerage, commercial, drain, leak, fittings, motor, pipeline, water tank cleaning, areas Chandrasekharpur, Jayadev Vihar, Niladri Vihar.
- Water tank cleaning: no price shown anywhere (owner). Ubersuggest business summary updated to current rate card, services and areas (Madanpur and old prices removed).
- Removed stale Justdial references from 5 written pages' Facts to confirm, tracking-plan outbound_click and design doc sameAs (Justdial skipped).
- Ubersuggest rank tracking: 68 → 84 keywords (water tank cleaning, borewell, motor, leakage, price list, washing machine drain). Sheet: 19 keyword rows + 2 sitemap rows added.
- Owner answers on research: added /services/water-tank-cleaning/ and /services/borewell-pump-and-pipe-repair/ (26 pages), washing machine fitting section on fittings page; solar heater, gas piping, borewell drilling, per-point rate and Rasulgarh/Baramunda excluded. Updated sitemap, page-specs, schema keywords, rate card, content brief.
- Keyword universe research: 1,635 service-intent Bhubaneswar keywords grouped by page (`docs/research/`, Sheet tab "All Keywords (research)").
- Keywords: added new-house plumbing and commercial plumbing keywords (Sheet, Ubersuggest tracking now 68). New page /services/commercial-plumbing/ (24 pages total).
- Owner: skip Justdial entirely; never show a price for bathroom re-plumbing / new house plumbing. Added `docs/page-specs.md` for the remaining 18 pages.
- Audit fixes applied to the first 5 pages (question ownership, no aggregateRating, 2-level breadcrumbs, de-stuffed keywords, unconfirmed claims removed).
- Owner answers applied: septic method not mentioned (partners); geyser electrical parts not repaired; warranty on installation and repair only; free site visit for concealed pipeline; job times not stated; parts supplied or customer's own, price shared before fitting. Geyser title now "Geyser Repair & Fitting in Bhubaneswar | Mahapatra Plumbing".
- Titles: brand suffix is always "Mahapatra Plumbing" (fixed Pricing and Septic titles; rule added to content brief).
- Phase 2 drafts: Home, Pricing, Septic Tank Cleaning, Bathroom & Kitchen Plumbing Renovation, Geyser Installation & Repair (`content/pages/`). Reviewed: consent checkbox made opt-in (unticked), geyser H1 made natural, renovation wording smoothed.
- Tracking plan: "Use my details to improve ads" box is now unticked by default (DPDP Act needs an active choice).
- Added `docs/schema.md`: JSON-LD templates (Plumber, WebSite, WebPage, Service, OfferCatalog, FAQPage, BreadcrumbList) with keywords mapped for all 23 pages.
- Sitemap doc: kept Damana and Saheed Nagar mentions, "all of Bhubaneswar" wording on every page, Google Maps listing embed plan, and the per-page SEO/AEO/GEO checklist.
- Sitemap: KIIT and Infocity get their own area pages, so the new site keeps every area listed on the current site (8 area pages, 23 pages total).
- Removed Madanpur everywhere: keyword matrix row, Ubersuggest tracking, research notes. Not mentioned on the homepage either.
- Phase 1 draft: keyword matrix (76 keywords) and sitemap (21 pages incl. new septic tank cleaning page) — `docs/sitemap.md`.
- Tracking plan: Meta Advanced Matching approved for form leads (hashed phone, first name, city/state/country), with form notice, optional opt-out box and a new /privacy-policy/ page.
- Tracking plan: added ad pixels for future ads (Meta Pixel, Google Ads, Microsoft Ads UET), all optional via environment variables or GTM, no personal data sent.
- Decided: website colours switch from emerald green to the new logo palette (navy #0A2A5C, blue #0A7CC4, orange #F7901E accent, WhatsApp buttons stay green). Layout unchanged.
- Added `docs/tracking-plan.md`: click tracking for calls, WhatsApp, forms and other actions (events, data attributes, WhatsApp source tags, dataLayer helper, GTM/GA4/Clarity setup, privacy rules).
- Repository created (`pkray2012/mahapatrap`, public during the build).
- Added planning docs: audit summary, keyword and competitor research, approved rate card, design / contact / Google Business Profile notes.
- Added logo files to `brand/`.
- No changes made to the live website yet.
