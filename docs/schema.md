# Structured data (JSON-LD) with keywords — mahapatraplumbing.in (27 Nov 2026)

> **Update 27 Nov 2026 (owner-approved pre-launch fix):** the `keywords` property has been removed from every JSON-LD block (Plumber, WebPage, AboutPage etc.) in content/pages and from the templates below. Do not add it back. The keyword tables in this file stay as an on-page targeting reference only.

> **Update 27 Nov 2026 (owner-approved content fixes):** founder Person carries `"@id": "https://mahapatraplumbing.in/#owner"` and `"jobTitle": "Owner"`; the Plumber node has `"knowsLanguage": ["or","hi","en"]`; ContactPoint `areaServed` is the City Bhubaneswar (was "IN"); every WebPage-type node carries `"dateModified": "2026-11-27"` (update it when a page changes); /pricing/ lists quote-only items (AMC, commercial AMC, tank cleaning, borewell) as plain `Service` items in the OfferCatalog, with no Offer wrapper.

All schema is JSON-LD in `<script type="application/ld+json">`, generated from one data file so names, address, phone, hours and prices never differ between pages. Every page uses `@graph` with stable `@id`s so Google and AI engines see one connected entity.

## Where keywords go (and where they don't)

| Field | What goes in | Why |
|---|---|---|
| `WebPage.name` / `headline` | Page title with the primary keyword | Matches title tag and H1 |
| `WebPage.keywords` | Primary + 3–6 secondary keywords from the Keyword Matrix, comma-separated | Read by AI engines and Bing; Google ignores it but it is harmless |
| `WebPage.about` / `Service.name` | The service in plain words | Entity clarity for GEO |
| `Service.alternateName` | 2–4 natural variants people search ("septic tank cleaning", "sewage tank cleaning") | Helps AI match synonyms |
| `Service.serviceType` | One short category ("Septic tank cleaning") | |
| `Plumber.knowsAbout` | All 13 services | Tells AI engines what the business does |
| `Plumber.keywords` | 6–8 core business keywords | Entity-level |
| `areaServed` | Bhubaneswar (City) + the 8 areas + nearby Damana, Saheed Nagar, IRC Village (Place) | Local relevance |
| `FAQPage` questions | Real customer questions that include the keyword naturally | AEO / AI Overviews |

Rules: keywords must also appear in visible page text (natural variants such as "in Bhubaneswar" are fine); no stuffing (max ~8 per field); no `aggregateRating` (the 5.0★ comes from Google Maps, a third-party site — show it as visible text only); prices must match the rate card.

## 1. Sitewide entity (on every page)

```json
{
  "@type": "Plumber",
  "@id": "https://mahapatraplumbing.in/#business",
  "name": "Mahapatra Plumbing Services",
  "alternateName": "Mahapatra Plumbing",
  "founder": { "@type": "Person", "@id": "https://mahapatraplumbing.in/#owner", "name": "Amaresh Mahapatra", "jobTitle": "Owner" },
  "foundingDate": "2021",
  "url": "https://mahapatraplumbing.in/",
  "logo": "https://mahapatraplumbing.in/images/logo-horizontal.png",
  "image": "https://mahapatraplumbing.in/images/og-default.webp",
  "description": "Local plumber in Chandrasekharpur serving all of Bhubaneswar: leak and tap repair, geyser installation, drain cleaning, septic tank cleaning, bathroom renovation and new house plumbing. Written estimate before work, 90-day workmanship warranty on installation and repair jobs.",
  "telephone": "+91-9668875352",
  "email": "amareshmohapatra143@gmail.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9668875352",
    "email": "amareshmohapatra143@gmail.com",
    "contactType": "customer service",
    "areaServed": { "@type": "City", "name": "Bhubaneswar" },
    "availableLanguage": ["or", "hi", "en"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "08:00", "closes": "22:00"
    }
  },
  "knowsLanguage": ["or", "hi", "en"],
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
    { "@type": "Place", "name": "Nayapalli, Bhubaneswar" },
    { "@type": "Place", "name": "Damana, Bhubaneswar" },
    { "@type": "Place", "name": "Saheed Nagar, Bhubaneswar" },
    { "@type": "Place", "name": "IRC Village, Bhubaneswar" }
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
  "sameAs": [
    "https://www.google.com/maps?cid=4373818382391816251"
  ]
}
```

`contactPoint` (with `availableLanguage` or/hi/en) is part of this sitewide node on every page, not only on /contact/ (QA1 m5, 27 Nov 2026). `hasOfferCatalog` stays on /pricing/ only. The nearby areas Damana, Saheed Nagar and IRC Village are in `areaServed`; the Chandrasekharpur page's `spatialCoverage` also lists Damana and the Nayapalli page's lists IRC Village.

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

### Filled example: Septic Tank Cleaning (synced to the page, 27 Nov 2026)

No cleaning method, equipment, partners or disposal in any field (owner rule).

```json
{
  "@type": "Service",
  "@id": "https://mahapatraplumbing.in/services/septic-tank-cleaning/#service",
  "name": "Septic Tank Cleaning in Bhubaneswar",
  "alternateName": [
    "Sewage tank cleaning",
    "Septic tank cleaning service"
  ],
  "serviceType": "Septic tank cleaning",
  "description": "Septic and sewage tank cleaning anywhere in Bhubaneswar by Mahapatra Plumbing Services, Chandrasekharpur. Tank inspected and cleaned, inlet, outlet and soak pit checked, from ₹2,999 depending on tank size. Book by call or WhatsApp on +91 9668875352, open daily 8 AM to 10 PM.",
  "provider": {
    "@id": "https://mahapatraplumbing.in/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Bhubaneswar"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": 2999,
      "priceCurrency": "INR"
    },
    "description": "Septic tank cleaning from ₹2,999; final price depends on tank size and access."
  }
}
```
WebPage `keywords`: `septic tank cleaning bhubaneswar, clean septic tank, sewage tank cleaning, septic tank cleaning services near me, septic tank cleaning services`

## 3. Area page (template)

```json
{
  "@type": "WebPage",
  "@id": "https://mahapatraplumbing.in/areas/{area}/#webpage",
  "url": "https://mahapatraplumbing.in/areas/{area}/",
  "name": "Plumber in {Area}, Bhubaneswar | Mahapatra Plumbing Services",
  "about": { "@id": "https://mahapatraplumbing.in/#business" },
  "spatialCoverage": { "@type": "Place", "name": "{Area}, Bhubaneswar, Odisha" },
  "breadcrumb": { "@id": "https://mahapatraplumbing.in/areas/{area}/#breadcrumb" },
  "inLanguage": "en-IN"
}
```
Plus the Plumber node, WebSite node, FAQPage (3–5 area questions) and BreadcrumbList. Do not put "plumber in bhubaneswar" in area-page keywords (Home is the only target for it). Every WebPage carries `headline` = the H1. No separate LocalBusiness per area (one business, one address).

## 4. Pricing page

`WebPage` (keywords: `plumber charges in bhubaneswar, plumber visit charge bhubaneswar, plumbing rate list bhubaneswar, plumber price list bhubaneswar, how much does a plumber charge per visit in bhubaneswar`) + an `OfferCatalog` on the Plumber node (synced to the page, 27 Nov 2026; AMC and water tank cleaning carry no price):

```json
"hasOfferCatalog": {
  "@type": "OfferCatalog",
  "name": "Plumbing rate card, Bhubaneswar",
  "itemListElement": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Visit / inspection"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 199,
        "maxPrice": 349,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Minor fix"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 249,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Tap / jet spray / flush kit install"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 299,
        "maxPrice": 799,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Geyser service"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": 499,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Geyser installation"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 699,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Drain unclogging"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 349,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Toilet blockage removal"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 999,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Water motor / pump repair"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 399,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Septic tank cleaning"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 2999,
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "AMC check-up for homes"
      },
      "priceCurrency": "INR",
      "description": "Price on request. Call or WhatsApp us for a quote."
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Water tank / sump cleaning",
        "url": "https://mahapatraplumbing.in/services/water-tank-cleaning/"
      },
      "priceCurrency": "INR",
      "description": "Call or WhatsApp us for a quote."
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Borewell pump & pipe repair",
        "url": "https://mahapatraplumbing.in/services/borewell-pump-and-pipe-repair/"
      },
      "priceCurrency": "INR",
      "description": "Quote after inspection; part price shared before fitting."
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Commercial AMC (hostels, PGs, offices, shops, hotels)",
        "url": "https://mahapatraplumbing.in/services/commercial-plumbing/"
      },
      "priceCurrency": "INR",
      "description": "Price on request. Call or WhatsApp us for a quote."
    }
  ]
}
```

## 5. FAQPage (every service, area and pricing page)

Example: the first two septic page FAQs. FAQs must not repeat an H2 question on the same page, and no question is answered on two pages (see content-brief.md "Question ownership").

```json
{
  "@type": "FAQPage",
  "@id": "https://mahapatraplumbing.in/services/septic-tank-cleaning/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is a sewage tank the same as a septic tank?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. In most Bhubaneswar homes, people use both names for the same underground tank that collects toilet waste before it flows to the soak pit. We clean septic and sewage tanks for homes, PGs, apartments, shops and offices anywhere in Bhubaneswar, starting at ₹2,999. You get a written estimate before work starts."
      }
    },
    {
      "@type": "Question",
      "name": "Will cleaning stop the smell from my septic tank?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Often, yes, because a full tank is a common cause of smell. If the smell stays after cleaning, a cracked chamber, a blocked vent pipe or a dry floor trap may be the cause. We check the inlet, outlet and soak pit during the job, and tell you before any repair is done."
      }
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

Synced from the page JSON-LD on 27 Nov 2026 (round 2 audit pass). "near me" is kept to one use per page, so several rows use the "in bhubaneswar" form.

| Page | WebPage `keywords` | Service `alternateName` |
|---|---|---|
| / | plumber in bhubaneswar, plumber bhubaneswar, plumber near me, plumber service in bhubaneswar, plumbing services bhubaneswar, plumber near me home service | — |
| /pricing/ | plumber charges in bhubaneswar, plumber visit charge bhubaneswar, plumbing rate list bhubaneswar, plumber price list bhubaneswar, how much does a plumber charge per visit in bhubaneswar | — |
| /about/ | plumbing company in bhubaneswar, mahapatra plumbing services | — |
| /contact/ | plumber bhubaneswar contact number, plumber near me contact number, mahapatra plumbing contact | — |
| /services/bathroom-and-kitchen-fittings/ | bathroom fitting plumber near me, bathroom fitters, tap installation, kitchen sink repair, toilet installation, sink installation, washing machine inlet and drain fitting | Bathroom fitting installation; Sink and tap fitting; Washing machine plumbing |
| /services/bathroom-plumbing-renovation/ | bathroom renovation bhubaneswar, bathroom renovation, bathroom renovation cost, bathroom renovation contractors near me, kitchen renovation bhubaneswar | Bathroom remodelling; Bathroom re-plumbing; Kitchen plumbing renovation |
| /services/borewell-pump-and-pipe-repair/ | borewell service near me, borewell repair bhubaneswar, borewell submersible pump, borewell motor repair, submersible pump repair bhubaneswar | Borewell repair; Submersible pump lifting; Borewell pipe replacement |
| /services/commercial-plumbing/ | commercial plumbing bhubaneswar, commercial plumbing services, commercial plumbing work, plumbing maintenance contract, hotel plumbing services, office plumbing services | Commercial plumbing services; Plumbing AMC for businesses; Hotel and office plumbing |
| /services/drain-cleaning-and-sewer-jetting/ | drain cleaning bhubaneswar, drain cleaning, drain blockage removal near me, drain pipe cleaning, toilet blockage removal | Drain unclogging; Blocked drain cleaning; Sewer jetting |
| /services/geyser-installation-and-repair/ | geyser repair near me, geyser repair in bhubaneswar, geyser installation bhubaneswar, geyser repair, geyser servicing bhubaneswar, water heater repair | Water heater repair; Geyser service; Geyser fitting |
| /services/leak-and-blockage-repair/ | pipe leakage repair near me, pipe leakage repair in bhubaneswar, tap repair, toilet repair, flush tank repair, toilet seat repair, water leakage | Tap repair; Flush tank repair; Leak repair |
| /services/new-bathroom-and-house-plumbing/ | new house plumbing work, house plumbing work, plumbing contractor, plumbing contractors in bhubaneswar, plumbing work in house construction, new building plumbing work, new bathroom plumbing | New construction plumbing; House plumbing contractor; Residential plumbing contractor |
| /services/pipeline-and-concealed-plumbing/ | concealed pipe leakage repair, internal pipe leak repair, cpvc pipe fitting, pipeline repair bhubaneswar, cpvc pipework | Concealed pipeline repair; CPVC plumbing; Pipe rerouting |
| /services/septic-tank-cleaning/ | septic tank cleaning bhubaneswar, clean septic tank, sewage tank cleaning, septic tank cleaning services near me, septic tank cleaning services | Sewage tank cleaning; Septic tank cleaning service |
| /services/sewerage-and-drainage-works/ | sewerage work contractor bhubaneswar, sewerage work, sewer line repair near me, drainage work bhubaneswar | Sewer line installation; Drainage line work; Manhole work |
| /services/water-tank-and-motor-repair/ | water motor repair near me, water motor repair in bhubaneswar, motor repair, water pump repair, submersible pump repair, water tank repair, sump pump repair | Water pump repair; Motor repair; Float valve repair |
| /services/water-tank-cleaning/ | water tank cleaning bhubaneswar, water tank cleaning services near me, water tank cleaning services, sump cleaning, overhead tank cleaning | Water tank cleaning; Sump cleaning; Overhead tank cleaning |
| /areas/chandrasekharpur/ | plumber in chandrasekharpur, plumber in damana | — |
| /areas/infocity/ | plumber in infocity bhubaneswar, office plumbing infocity | — |
| /areas/jayadev-vihar/ | plumber in jayadev vihar, plumber in saheed nagar | — |
| /areas/kiit/ | plumber near kiit, plumber for hostel near kiit | — |
| /areas/nayapalli/ | plumber in nayapalli, plumber near irc village bhubaneswar | — |
| /areas/niladri-vihar/ | plumber in niladri vihar | — |
| /areas/patia/ | plumber in patia, plumbing services patia | — |
| /areas/sailashree-vihar/ | plumber in sailashree vihar | — |

## 8. Validation before deploy
- Google Rich Results Test and validator.schema.org on every page type: 0 errors.
- Search Console → Enhancements after launch (Breadcrumbs, FAQ).
- Spot-check that every `keywords` term also appears in the page's visible text.
