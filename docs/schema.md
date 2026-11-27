# Structured data (JSON-LD) with keywords — mahapatraplumbing.in (27 Nov 2026)

All schema is JSON-LD in `<script type="application/ld+json">`, generated from one data file so names, address, phone, hours and prices never differ between pages. Every page uses `@graph` with stable `@id`s so Google and AI engines see one connected entity.

## Where keywords go (and where they don't)

| Field | What goes in | Why |
|---|---|---|
| `WebPage.name` / `headline` | Page title with the primary keyword | Matches title tag and H1 |
| `WebPage.keywords` | Primary + 3–6 secondary keywords from the Keyword Matrix, comma-separated | Read by AI engines and Bing; Google ignores it but it is harmless |
| `WebPage.about` / `Service.name` | The service in plain words | Entity clarity for GEO |
| `Service.alternateName` | 2–4 natural variants people search ("septic tank cleaning", "sewage tank cleaning") | Helps AI match synonyms |
| `Service.serviceType` | One short category ("Septic tank cleaning") | |
| `Plumber.knowsAbout` | All 10 services | Tells AI engines what the business does |
| `Plumber.keywords` | 6–8 core business keywords | Entity-level |
| `areaServed` | Bhubaneswar (City) + the 8 areas (Place) | Local relevance |
| `FAQPage` questions | Real customer questions that include the keyword naturally | AEO / AI Overviews |

Rules: keywords must also appear in visible page text (natural variants such as "in Bhubaneswar" are fine); no stuffing (max ~8 per field); no `aggregateRating` (the 5.0★ comes from Google Maps, a third-party site — show it as visible text only); prices must match the rate card.

## 1. Sitewide entity (on every page)

```json
{
  "@type": "Plumber",
  "@id": "https://mahapatraplumbing.in/#business",
  "name": "Mahapatra Plumbing Services",
  "alternateName": "Mahapatra Plumbing",
  "url": "https://mahapatraplumbing.in/",
  "logo": "https://mahapatraplumbing.in/images/logo-horizontal.png",
  "image": "https://mahapatraplumbing.in/images/og-default.webp",
  "description": "Local plumber in Chandrasekharpur serving all of Bhubaneswar: leak and tap repair, geyser installation, drain cleaning, septic tank cleaning, bathroom renovation and new house plumbing. Written estimate before work, 90-day workmanship warranty.",
  "telephone": "+91-9668875352",
  "email": "amareshmohapatra143@gmail.com",
  "priceRange": "₹199–₹2,999+",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, UPI, Bank transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "District Center, Chandrasekharpur",
    "addressLocality": "Bhubaneswar",
    "addressRegion": "Odisha",
    "postalCode": "751016",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 20.3248238, "longitude": 85.8196582 },
  "hasMap": "https://www.google.com/maps?cid=4373818382391816251",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "08:00", "closes": "22:00"
  }],
  "areaServed": [
    { "@type": "City", "name": "Bhubaneswar" },
    { "@type": "Place", "name": "Chandrasekharpur, Bhubaneswar" },
    { "@type": "Place", "name": "Patia, Bhubaneswar" },
    { "@type": "Place", "name": "KIIT, Bhubaneswar" },
    { "@type": "Place", "name": "Infocity, Bhubaneswar" },
    { "@type": "Place", "name": "Niladri Vihar, Bhubaneswar" },
    { "@type": "Place", "name": "Sailashree Vihar, Bhubaneswar" },
    { "@type": "Place", "name": "Jayadev Vihar, Bhubaneswar" },
    { "@type": "Place", "name": "Nayapalli, Bhubaneswar" }
  ],
  "knowsAbout": [
    "Leak and tap repair",
    "Bathroom and kitchen fittings",
    "Geyser installation and repair",
    "Water tank and motor repair",
    "Water tank and sump cleaning",
    "Borewell pump and pipe repair",
    "Concealed pipeline and CPVC plumbing",
    "Drain cleaning and sewer jetting",
    "Septic tank cleaning",
    "Bathroom and kitchen plumbing renovation",
    "New house and bathroom plumbing",
    "Sewerage and drainage works",
    "Commercial plumbing and maintenance contracts"
  ],
  "keywords": "plumber in bhubaneswar, plumbing services bhubaneswar, plumber near me, plumber in chandrasekharpur, septic tank cleaning bhubaneswar, bathroom renovation bhubaneswar, geyser repair bhubaneswar",
  "sameAs": [
    "https://www.google.com/maps?cid=4373818382391816251"
  ]
}
```

Plus a `WebSite` node once (`@id` `https://mahapatraplumbing.in/#website`, `publisher` → `#business`).

## 2. Service page (template)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "...": "Plumber node from section 1" },
    {
      "@type": "WebPage",
      "@id": "https://mahapatraplumbing.in/services/{slug}/#webpage",
      "url": "https://mahapatraplumbing.in/services/{slug}/",
      "name": "{Meta title}",
      "description": "{Meta description}",
      "keywords": "{primary}, {secondary 1}, {secondary 2}, {secondary 3}",
      "isPartOf": { "@id": "https://mahapatraplumbing.in/#website" },
      "about": { "@id": "https://mahapatraplumbing.in/services/{slug}/#service" },
      "breadcrumb": { "@id": "https://mahapatraplumbing.in/services/{slug}/#breadcrumb" },
      "inLanguage": "en-IN"
    },
    {
      "@type": "Service",
      "@id": "https://mahapatraplumbing.in/services/{slug}/#service",
      "name": "{Service name} in Bhubaneswar",
      "alternateName": ["{variant 1}", "{variant 2}"],
      "serviceType": "{Category}",
      "description": "{40–60 word answer-first summary}",
      "provider": { "@id": "https://mahapatraplumbing.in/#business" },
      "areaServed": { "@type": "City", "name": "Bhubaneswar" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "priceSpecification": { "@type": "PriceSpecification", "minPrice": "{from price, or omit for quote-only services}", "priceCurrency": "INR" },
        "description": "{Price line from the rate card}"
      }
    },
    { "@type": "FAQPage", "...": "section 5" },
    { "@type": "BreadcrumbList", "...": "section 6" }
  ]
}
```

### Filled example: Septic Tank Cleaning

```json
{
  "@type": "Service",
  "@id": "https://mahapatraplumbing.in/services/septic-tank-cleaning/#service",
  "name": "Septic Tank Cleaning in Bhubaneswar",
  "alternateName": ["Sewage tank cleaning", "Septic tank emptying", "Soak pit cleaning"],
  "serviceType": "Septic tank cleaning",
  "description": "Septic and sewage tank cleaning anywhere in Bhubaneswar by Mahapatra Plumbing Services, Chandrasekharpur. Tank emptying, sludge removal and outlet check, from ₹2,999 depending on tank size. Book by call or WhatsApp on +91 9668875352, open daily 8 AM to 10 PM.",
  "provider": { "@id": "https://mahapatraplumbing.in/#business" },
  "areaServed": { "@type": "City", "name": "Bhubaneswar" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "priceSpecification": { "@type": "PriceSpecification", "minPrice": 2999, "priceCurrency": "INR" },
    "description": "Septic tank cleaning from ₹2,999; final price depends on tank size and access."
  }
}
```
WebPage `keywords`: `septic tank cleaning bhubaneswar, clean septic tank, sewage tank cleaning services near me, septic tank cleaning services near me, septic tank cleaning services`

## 3. Area page (template)

```json
{
  "@type": "WebPage",
  "@id": "https://mahapatraplumbing.in/areas/{area}/#webpage",
  "url": "https://mahapatraplumbing.in/areas/{area}/",
  "name": "Plumber in {Area}, Bhubaneswar | Mahapatra Plumbing Services",
  "keywords": "plumber in {area}, plumber near {landmark}, plumbing services {area}, plumber in bhubaneswar",
  "about": { "@id": "https://mahapatraplumbing.in/#business" },
  "spatialCoverage": { "@type": "Place", "name": "{Area}, Bhubaneswar, Odisha" },
  "breadcrumb": { "@id": "https://mahapatraplumbing.in/areas/{area}/#breadcrumb" },
  "inLanguage": "en-IN"
}
```
Plus the Plumber node, FAQPage (3–5 area questions) and BreadcrumbList. No separate LocalBusiness per area (one business, one address).

## 4. Pricing page

`WebPage` (keywords: `plumber charges in bhubaneswar, plumber visit charge bhubaneswar, plumbing rate list bhubaneswar`) + an `OfferCatalog` on the Plumber node:

```json
"hasOfferCatalog": {
  "@type": "OfferCatalog",
  "name": "Plumbing rate card, Bhubaneswar",
  "itemListElement": [
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visit / inspection" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 199, "maxPrice": 349, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Minor fix" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 249, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tap / jet spray / flush kit install" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 299, "maxPrice": 799, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Geyser service" },
      "priceSpecification": { "@type": "PriceSpecification", "price": 499, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Geyser installation" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 699, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drain unclogging" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 349, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Toilet blockage removal" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 999, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Water motor / pump repair" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 399, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Septic tank cleaning" },
      "priceSpecification": { "@type": "PriceSpecification", "minPrice": 2999, "priceCurrency": "INR" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AMC check-up for homes (per quarter)" } },
    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial AMC (hostels, PGs, offices, shops, hotels)" },
      "priceCurrency": "INR", "description": "Price on request. Call or WhatsApp us for a quote." }
  ]
}
```

## 5. FAQPage (every service, area and pricing page)

```json
{
  "@type": "FAQPage",
  "@id": "https://mahapatraplumbing.in/services/septic-tank-cleaning/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does septic tank cleaning cost in Bhubaneswar?",
      "acceptedAnswer": { "@type": "Answer", "text": "Septic tank cleaning by Mahapatra Plumbing Services starts at ₹2,999. The final price depends on tank size and how easy the tank is to reach. You get the price before work starts." }
    },
    {
      "@type": "Question",
      "name": "How often should a septic tank be cleaned?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most family homes in Bhubaneswar need septic tank cleaning every 2 to 3 years. Clean it sooner if toilets drain slowly, there is a bad smell near the tank, or water collects around the soak pit." }
    }
  ]
}
```
FAQ text must be identical to the visible FAQ on the page.

## 6. BreadcrumbList

Two levels (Home > Page) until a /services/ hub page exists. Home page has no BreadcrumbList.

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://mahapatraplumbing.in/services/septic-tank-cleaning/#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mahapatraplumbing.in/" },
    { "@type": "ListItem", "position": 2, "name": "Septic Tank Cleaning", "item": "https://mahapatraplumbing.in/services/septic-tank-cleaning/" }
  ]
}
```

## 7. Keywords per page (schema `keywords` + Service `alternateName`)

| Page | WebPage `keywords` | Service `alternateName` |
|---|---|---|
| / | plumber in bhubaneswar, plumber bhubaneswar, plumber near me, plumber service in bhubaneswar, plumbing services bhubaneswar, plumber near me home service | — |
| /pricing/ | plumber charges in bhubaneswar, plumber visit charge bhubaneswar, plumbing rate list bhubaneswar | — |
| /about/ | plumbing company in bhubaneswar, mahapatra plumbing services | — |
| /contact/ | plumber bhubaneswar contact number, plumber near me contact number, mahapatra plumbing contact | — |
| /services/septic-tank-cleaning/ | septic tank cleaning bhubaneswar, clean septic tank, sewage tank cleaning, septic tank cleaning services near me | Sewage tank cleaning; Septic tank emptying; Soak pit cleaning |
| /services/bathroom-plumbing-renovation/ | bathroom renovation bhubaneswar, bathroom renovation, bathroom renovation cost, bathroom renovation contractors near me, kitchen renovation bhubaneswar | Bathroom remodelling; Bathroom re-plumbing; Kitchen plumbing renovation |
| /services/new-bathroom-and-house-plumbing/ | new house plumbing work, house plumbing work, plumbing contractor, plumbing contractors in bhubaneswar, plumbing work in house construction, new building plumbing work, new bathroom plumbing | New construction plumbing; House plumbing contractor; Residential plumbing contractor |
| /services/commercial-plumbing/ | commercial plumbing bhubaneswar, commercial plumbing services, commercial plumbing work, plumbing maintenance contract, hotel plumbing services, office plumbing services | Commercial plumbing services; Plumbing AMC for businesses; Hotel and office plumbing |
| /services/sewerage-and-drainage-works/ | sewerage work contractor bhubaneswar, sewerage work, sewer line repair near me, drainage work bhubaneswar | Sewer line installation; Drainage line work; Manhole work |
| /services/geyser-installation-and-repair/ | geyser repair near me, geyser installation bhubaneswar, geyser repair, geyser servicing near me, water heater repair near me | Water heater repair; Geyser service; Geyser fitting |
| /services/drain-cleaning-and-sewer-jetting/ | drain cleaning bhubaneswar, drain cleaning, drain blockage removal near me, drain pipe cleaning, toilet blockage removal | Drain unclogging; Blocked drain cleaning; Sewer jetting |
| /services/leak-and-blockage-repair/ | pipe leakage repair near me, tap repair near me, toilet repair near me, flush tank repair near me, toilet seat repair near me | Tap repair; Flush tank repair; Leak repair |
| /services/bathroom-and-kitchen-fittings/ | bathroom fitting plumber near me, bathroom fitters, tap installation, kitchen sink repair near me, toilet installation, washing machine inlet and drain fitting | Bathroom fitting installation; Sink and tap fitting; Washing machine plumbing |
| /services/water-tank-and-motor-repair/ | water motor repair near me, motor repair near me, water pump repair near me, submersible pump repair near me, water tank repair near me, sump pump repair | Water pump repair; Motor repair; Float valve repair |
| /services/water-tank-cleaning/ | water tank cleaning bhubaneswar, water tank cleaning services near me, water tank cleaning services, sump cleaning, overhead tank cleaning | Water tank cleaning; Sump cleaning; Overhead tank cleaning |
| /services/borewell-pump-and-pipe-repair/ | borewell service near me, borewell repair bhubaneswar, borewell submersible pump, borewell motor repair, submersible pump repair bhubaneswar | Borewell repair; Submersible pump lifting; Borewell pipe replacement |
| /services/pipeline-and-concealed-plumbing/ | concealed pipe leakage repair, internal pipe leak repair, cpvc pipe fitting, pipeline repair bhubaneswar | Concealed pipeline repair; CPVC plumbing; Pipe rerouting |
| /areas/chandrasekharpur/ | plumber in chandrasekharpur, plumber in damana, plumber in bhubaneswar | — |
| /areas/patia/ | plumber in patia, plumbing services patia, plumber in bhubaneswar | — |
| /areas/kiit/ | plumber near kiit, plumber for hostel near kiit | — |
| /areas/infocity/ | plumber in infocity bhubaneswar, office plumbing infocity | — |
| /areas/niladri-vihar/ | plumber in niladri vihar | — |
| /areas/sailashree-vihar/ | plumber in sailashree vihar | — |
| /areas/jayadev-vihar/ | plumber in jayadev vihar, plumber in saheed nagar | — |
| /areas/nayapalli/ | plumber in nayapalli, plumber near irc village bhubaneswar | — |

## 8. Validation before deploy
- Google Rich Results Test and validator.schema.org on every page type: 0 errors.
- Search Console → Enhancements after launch (Breadcrumbs, FAQ).
- Spot-check that every `keywords` term also appears in the page's visible text.
