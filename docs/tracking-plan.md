# Tracking plan — mahapatraplumbing.in (agreed 27 Nov 2026)

Goal: know exactly which page, which button and which service brings every call and WhatsApp lead, without sending any personal data to analytics. The site is built tracking-ready; live IDs are added later in Netlify environment variables.

## 1. Events to track

| Event name | Fires when | Key parameters | GA4 key event? |
|---|---|---|---|
| `call_click` | Any `tel:` link is tapped | cta_location, page_type, service, locality | Yes |
| `whatsapp_click` | Any `wa.me` button/link is tapped (not the forms) | cta_location, page_type, service, locality | Yes |
| `whatsapp_form_submit` | Quick Quote or Book a Visit form opens WhatsApp | form_id, cta_location, page_type, service | Yes |
| `generate_lead` | Fired together with each of the three events above (one standard lead event for Google Ads / GA4) | lead_channel (call / whatsapp / whatsapp_form), cta_location, service | Yes (primary conversion) |
| `email_click` | `mailto:` link tapped | cta_location | No |
| `directions_click` | "Get directions" / Open in Maps tapped | cta_location | No |
| `map_interaction` | Embedded Google Map clicked | page_type | No |
| `pricing_view` | Rate-card table scrolled into view (50% visible) | page_type, service | No |
| `faq_open` | An FAQ accordion item is opened | question_id, page_type | No |
| `service_card_click` | A service card is clicked | service, cta_location | No |
| `nav_click` | Header / footer / locality link clicked | link_text, cta_location | No |
| `scroll_depth` | 25 / 50 / 75 / 90% scrolled (GA4 enhanced measurement) | percent | No |
| `outbound_click` | Justdial / Google review / social links | link_domain | No |

## 2. Attributes on every clickable element

Every CTA is a real `<a>` tag (no JavaScript-only buttons), so GTM "Just Links" triggers catch it even if JavaScript fails.

```html
<a href="tel:+919668875352"
   data-track="call_click"
   data-cta-location="hero"
   data-service="geyser-installation"
   data-page-type="service">Call Now</a>

<a href="https://wa.me/919668875352?text=Hi%2C%20I%20need%20a%20quote%20for%20Geyser%20Installation%20in%20Bhubaneswar%20%5BPage%3A%20Geyser%5D"
   data-track="whatsapp_click"
   data-cta-location="sticky_mobile_bar"
   data-service="geyser-installation"
   data-page-type="service">WhatsApp</a>
```

Allowed `data-cta-location` values (fixed list, used in reports):
`top_bar`, `header`, `hero`, `quick_quote_form`, `service_card`, `pricing_table`, `inline_content`, `faq`, `book_visit_form`, `contact_page`, `footer`, `sticky_mobile_bar`, `floating_whatsapp`.

Allowed `data-page-type` values: `home`, `service`, `locality`, `pricing`, `about`, `contact`.

`data-service` = page slug (e.g. `septic-tank-cleaning`, `bathroom-plumbing-renovation`); `data-locality` on locality pages (e.g. `patia`).

## 3. WhatsApp source tags

Every WhatsApp link and both forms pre-fill a message that ends with a page tag, so a lead in the WhatsApp inbox can be matched to the page and button:

- Button: `Hi, I need a quote for {Service} in Bhubaneswar [Page: {PageTag}]`
- Form: `Name: {name}\nArea: {area}\nProblem: {problem}\n[Page: {PageTag} | Form: {form_id}]`

The form's typed name, phone, area and problem go **only** into the WhatsApp message, never into analytics.

## 4. dataLayer helper (no personal data)

One small script, loaded once:

```js
// lib/track.js
const ALLOWED = ['event','cta_location','page_type','service','locality','form_id',
  'lead_channel','link_text','link_domain','question_id','percent'];

export function pushTrackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  const safe = { event: eventName };
  for (const k of ALLOWED) if (params[k] != null) safe[k] = String(params[k]).slice(0, 100);
  window.dataLayer.push(safe);   // never names, phone numbers, addresses or message text
}

// one delegated click listener reads data-* attributes
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  const p = {
    cta_location: el.dataset.ctaLocation, page_type: el.dataset.pageType,
    service: el.dataset.service, locality: el.dataset.locality,
  };
  pushTrackEvent(el.dataset.track, p);
  const channel = { call_click: 'call', whatsapp_click: 'whatsapp',
                    whatsapp_form_submit: 'whatsapp_form' }[el.dataset.track];
  if (channel) pushTrackEvent('generate_lead', { ...p, lead_channel: channel });
}, { capture: true });
```

## 5. Analytics loading (`AnalyticsScripts`)

- Controlled only by environment variables: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID` (+ optional `NEXT_PUBLIC_GADS_ID`).
- If a variable is empty, nothing is rendered: no placeholder IDs, no console errors.
- Preferred setup: GTM only on the page; GA4, Google Ads and Clarity tags are added inside GTM. Direct GA4/Clarity tags are a fallback when GTM is not used.
- Scripts load after the page is interactive so Core Web Vitals stay at 95+ on mobile.
- Set in Netlify → Site configuration → Environment variables. Nothing secret goes into the public repo.

## 6. GTM container setup (done later, ~5 minutes)

1. Variables: Data Layer Variables for `cta_location`, `page_type`, `service`, `locality`, `form_id`, `lead_channel`.
2. Triggers: Custom Event triggers for `call_click`, `whatsapp_click`, `whatsapp_form_submit`, `generate_lead`, plus the secondary events.
3. Tags: GA4 Configuration; one GA4 Event tag per event passing the parameters; Google Ads conversion on `generate_lead`; Clarity tag on All Pages.
4. GA4: mark `call_click`, `whatsapp_click`, `whatsapp_form_submit` and `generate_lead` as key events; register `cta_location`, `page_type`, `service`, `locality`, `lead_channel` as custom dimensions.
5. Test in GTM Preview on the deployed site, then publish.

## 7. Reports this enables

- Leads by page and by service (which pages earn money)
- Call vs WhatsApp vs form split
- Which button position converts (hero vs sticky bar vs pricing table)
- Locality pages that bring leads
- Clarity heatmaps and recordings for the top service pages

## 8. Privacy rules

- Never send names, phone numbers, addresses, emails or form text to GA4, GTM, Google Ads or Clarity.
- Clarity: mask all form fields (default masking on).
- No cookie wall needed for India today; revisit if the site targets the EU.
