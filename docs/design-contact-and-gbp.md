# Design, contact methods and GBP facts (checked 27 Nov 2026)

## Google Business Profile (live Maps listing)
- Name: Mahapatra Plumbing Services
- Address: District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016
- Phone: MISSING on the listing → add +91 9668875352
- Hours: Open 24 hours → change to Mon–Sun 8 AM – 10 PM
- Website: http://www.mahapatraplumbing.in/ → change to https://mahapatraplumbing.in/
- Category: Plumber only → add secondary categories (septic system service, bathroom remodeler, drainage service, water heater installation)
- Rating 5.0★, 45 reviews (43×5★, 2×4★); review topics: fair pricing, plumbing work, kitchen, pricing
- Attributes: online estimates, on-site services, repair services
- Plus code 8RF9+WV; lat 20.3248238, lng 85.8196582; CID 4373818382391816251; Place ID ChIJkdMjFQAJGToRO7CJMqXssjw
- Owner posts active (latest 7 Sep 2026)
- Website map embed currently points to generic "Chandrasekharpur", not the listing → embed the listing

## Contact methods on current site (keep all)
- Phone +91 9668875352: tel: links in header, hero "Call Now", hours "Call to check slot"; plain text in Book a Visit and footer (make clickable)
- WhatsApp 919668875352: header ("Hi Mahapatra Plumbing, I need help"), footer ("Hi I need a plumber"), plus two WhatsApp forms
- Forms: hero "Quick Quote" (Name, Phone (WhatsApp), Area, Problem) and "Book a Visit" (Full Name, Phone (WhatsApp), Address/Area, Problem). No backend: they build a wa.me message. Keep both; add page/service tag to message
- Email amareshmohapatra143@gmail.com as plain text → make mailto
- Rebuild adds sticky mobile Call + WhatsApp bar; data-track / data-cta-location on every CTA; no personal data to analytics

## Schema (JSON-LD) — sitewide Plumber template

```json
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "@id": "https://mahapatraplumbing.in/#business",
  "name": "Mahapatra Plumbing Services",
  "url": "https://mahapatraplumbing.in/",
  "telephone": "+91-9668875352",
  "email": "amareshmohapatra143@gmail.com",
  "priceRange": "₹199–₹2,999+",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "District Center, Chandrasekharpur",
    "addressLocality": "Bhubaneswar",
    "addressRegion": "Odisha",
    "postalCode": "751016",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 20.3248238, "longitude": 85.8196582 },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "08:00", "closes": "22:00"
  }],
  "areaServed": { "@type": "City", "name": "Bhubaneswar" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "45" },
  "sameAs": ["https://www.google.com/maps?cid=4373818382391816251", "[Justdial listing URL]"]
}
```

Every page: Plumber + BreadcrumbList. Service pages: + Service (with Offer from the rate card) + FAQPage. Pricing: + OfferCatalog.

## New logo (supplied 27 Nov 2026, files in `brand/`)
- Mark: "M" inside a house roofline, tap with water drop on the right, blue wave underneath, orange arc around the left/top
- Wordmark: "MAHAPATRA" in bold navy + "PLUMBING SERVICES" in white on a blue slanted ribbon with orange accent lines
- Sampled colours: navy ≈ #002454 (use #0A2A5C), blue ≈ #0078C0 (use #0A7CC4), orange ≈ #F7901E; light tint #D8E4F0
- `icon-checkerboard-not-transparent.png` has the checkerboard painted in; real transparent PNG or SVG versions are needed
- Website use: horizontal colour logo in header; icon on white as favicon / app icon / social; navy icon on dark sections

## Current design (layout kept)
- Built with Tailwind CDN + Lucide icons from unpkg, hosted on Netlify
- Current colours: emerald-500 #10B981 buttons, emerald-600 #059669 accent, slate-900 #0F172A top bar/headings, slate-800 #1E293B body, slate-50 #F8FAFC background, white bordered cards, rounded-xl/2xl
- Font: system sans-serif (no web font)
- Layout: dark top bar (phone, hours, WhatsApp pill) → sticky white header (nav + "Get a Quote") → hero (headline with accent locality word, Call Now + Book a Visit, trust row, Quick Quote card) → Services cards → Why Choose + Pricing → pricing tiers → Areas + map + Hours → Reviews → FAQ cards → Book a Visit form + map → footer
- Rebuild: same layout, Tailwind compiled at build time (no CDN), inline SVG icons, one rate-card table, sticky mobile bar, remove "Search term" line
- Decision (27 Nov 2026): switch colours to the new logo palette. Layout stays the same.

## Colour palette (approved 27 Nov 2026)
| Role | Colour | Use |
|---|---|---|
| Navy (brand primary) | #0A2A5C | Top bar, headings, footer, dark sections, logo |
| Blue (action) | #0A7CC4 (hover #0866A3) | Call Now, Get a Quote, links, active states |
| Orange (accent) | #F7901E | Small highlights only: locality word in hero headline, "Most booked" label, icons |
| Light tint | #EAF2FA | Section backgrounds, table header rows |
| Page background | #F8FAFC | Body background |
| Body text | #1E293B | Paragraphs |
| WhatsApp green | #25D366 (hover #1EBE5A) | WhatsApp buttons only, so they are instantly recognisable |

Contrast: white text on #0A7CC4 and #0A2A5C passes WCAG AA; orange is never used for body text or as a button background with white text.
