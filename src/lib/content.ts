// Loads content/pages/**/*.md, renders markdown + markers to HTML strings.
// Markers: [CTA: ...], [IMAGE: ...], [MAP: ...], [FORM: ...], [CARD LABEL: ...], [BREADCRUMB: ...],
// [WHY PRICING: ...] (two-card Why choose us + Pricing block) and [PRICING TIERS] (three tier cards).
// Any other [UPPERCASE: ...] marker fails the build. "## JSON-LD" and "## Facts to confirm" are not rendered.
import { Marked } from 'marked';
import { load as yamlLoad } from 'js-yaml';
import path from 'node:path';
import { getImage } from 'astro:assets';
import { SITE, waLink, AREA_OPTIONS, SERVICE_ORDER, AREA_ORDER } from './site';
import { icon, iconForHref, trustIcon } from './icons';
import tierData from '../../content/data/pricing-tiers.json';
import reviewData from '../../content/data/reviews.json';

const marked = new Marked({ gfm: true, breaks: true });

// ---------- types ----------
export interface FrontMatter {
  url: string;
  page_type: 'home' | 'service' | 'locality' | 'pricing' | 'about' | 'contact' | 'legal' | '404';
  whatsapp_prefill: string;
  page_tag: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  [k: string]: unknown;
}
export interface Page {
  file: string;
  slug: string; // last URL segment, 'home' for /
  fm: FrontMatter;
  body: string;
  jsonLdText: string;
  graph: any[];
  breadcrumb: { name: string; item: string }[];
  faqs: Map<string, string>;
  navName: string; // short name used in nav/footer
}

// ---------- loading ----------
const RAW = import.meta.glob('/content/pages/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parseFile(file: string, raw: string): Page {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no front matter`);
  const fm = yamlLoad(m[1]) as FrontMatter;
  const [body, after = ''] = m[2].split(/\n## JSON-LD\s*\n/);
  const jm = after.match(/```json\n([\s\S]*?)\n```/);
  if (!jm) throw new Error(`${file}: JSON-LD block missing`);
  const jsonLdText = jm[1];
  const ld = JSON.parse(jsonLdText);
  const graph: any[] = ld['@graph'] || [ld];
  const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');
  const breadcrumb = bc ? bc.itemListElement.map((i: any) => ({ name: i.name, item: i.item })) : [];
  const faqNode = graph.find((n) => n['@type'] === 'FAQPage');
  const faqs = new Map<string, string>();
  for (const q of faqNode?.mainEntity || []) faqs.set(q.name, q.acceptedAnswer.text);
  const slug = fm.url === '/' ? 'home' : fm.url.split('/').filter(Boolean).pop()!;
  const navName = breadcrumb[1]?.name || 'Home';
  return { file, slug, fm, body, jsonLdText, graph, breadcrumb, faqs, navName };
}

let _pages: Page[] | null = null;
export function getPages(): Page[] {
  if (!_pages) _pages = Object.entries(RAW).map(([f, r]) => parseFile(f, r));
  return _pages;
}
export const services = () => SERVICE_ORDER.map((s) => getPages().find((p) => p.fm.url === `/services/${s}/`)!);
export const areas = () => AREA_ORDER.map((s) => getPages().find((p) => p.fm.url === `/areas/${s}/`)!);

// ---------- helpers ----------
export const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const cleanInline = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|`/g, '').trim();

export interface Ctx {
  page: Page;
  loc: string; // current data-cta-location
  label: string; // current heading text (for table region labels)
  heroForm?: string; // id of the form card beside the hero (the hero "Book a Visit" button jumps there)
}

/** data-* attributes for a tracked CTA. */
export function trackAttrs(page: Page, track: string, loc: string) {
  const t = page.fm.page_type;
  let a = `data-track="${track}" data-cta-location="${loc}" data-page-type="${t}"`;
  if (t === 'locality') a += ` data-locality="${page.slug}"`;
  else a += ` data-service="${page.slug}"`;
  return a;
}

// ---------- CTA ----------
export function callButton(page: Page, loc: string, label = `Call ${SITE.phoneDisplay}`, cls = 'btn btn-call') {
  return `<a class="${cls}" href="${SITE.tel}" ${trackAttrs(page, 'call_click', loc)}>${icon('phone')}<span>${esc(label)}</span></a>`;
}
export function waButton(page: Page, loc: string, label = 'WhatsApp us', cls = 'btn btn-wa') {
  return `<a class="${cls}" href="${esc(waLink(readableMsg(page.fm.whatsapp_prefill)))}" target="_blank" rel="noopener" ${trackAttrs(page, 'whatsapp_click', loc)}>${icon('wa')}<span>${esc(label)}</span></a>`;
}

/** Parse "KEY: a | b=c | d="e f" g" into a head and an attribute map (pipes inside quotes ignored). */
function parseMarker(line: string) {
  const inner = line.slice(1, -1);
  const colon = inner.indexOf(':');
  const kind = (colon < 0 ? inner : inner.slice(0, colon)).trim();
  const rest = colon < 0 ? '' : inner.slice(colon + 1);
  const parts: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    if (c === '"') q = !q;
    if (c === '|' && !q) {
      parts.push(cur.trim());
      cur = '';
    } else cur += c;
  }
  parts.push(cur.trim());
  const head = parts.shift() || '';
  const attrs: Record<string, string> = {};
  const extra: Record<string, string> = {};
  for (const p of parts) {
    const mm = p.match(/^([a-z_]+)=(?:"([^"]*)"\s*(.*)|(.*))$/);
    if (mm) {
      attrs[mm[1]] = mm[2] ?? mm[4] ?? '';
      if (mm[3]) extra[mm[1]] = mm[3].trim();
    }
  }
  return { kind, head, attrs, extra };
}

function renderCta(ctx: Ctx, mk: ReturnType<typeof parseMarker>) {
  const loc = mk.attrs.location || ctx.loc;
  const p = ctx.page;
  if (mk.head === 'call+whatsapp') {
    // cta-cw: the plain Call + WhatsApp pair (same as the sticky mobile bar); renderPage marks all but the last one
    // on a page as cta-mid, hidden below 768 px where the bar is always on screen.
    return `<div class="cta-row cta-cw">${callButton(p, loc)}${waButton(p, loc)}</div>`;
  }
  if (mk.head === 'call+book_visit') {
    // In the hero the secondary button always goes to the nearest form: the Quick Quote card beside / under the
    // hero (not a form at the end of the page), and it carries the form's name.
    const near = ctx.loc === 'hero' && ctx.heroForm;
    const href = near ? `#${ctx.heroForm}` : mk.extra.book_visit || '#book-a-visit';
    const label = near ? `Get a ${FORM_NAME}` : mk.attrs.book_visit || 'Book a Visit';
    return `<div class="cta-row">${callButton(p, loc, mk.attrs.call || 'Call Now')}<a class="btn btn-outline" href="${esc(href)}">${icon('arrow')}<span>${esc(label)}</span></a></div>`;
  }
  if (mk.head === 'contact_line') {
    return `<div class="cta-row">${callButton(p, loc, `Call ${mk.attrs.call || SITE.phoneDisplay}`)}${waButton(p, loc)}<a class="btn btn-outline" href="mailto:${SITE.email}" data-track="email_click" data-cta-location="${loc}" data-page-type="${p.fm.page_type}">${icon('mail')}<span>Email us</span></a></div>`;
  }
  throw new Error(`${p.file}: unknown CTA type "${mk.head}"`);
}

// ---------- IMAGE ----------
// Real job photos live in src/assets/photos/<name>.(webp|jpg|jpeg|png|avif); the marker's file name (any extension)
// is matched by base name and the photo is emitted as AVIF + WebP with a responsive srcset.
// Until a photo exists the marker renders NOTHING (no placeholder box, no caption).
const PHOTOS = import.meta.glob('/src/assets/photos/*.{webp,jpg,jpeg,png,avif}', { eager: true, import: 'default' }) as Record<string, ImageMetadata>;

async function renderImage(_ctx: Ctx, mk: ReturnType<typeof parseMarker>, hero = false) {
  const file = mk.head.trim();
  const alt = mk.attrs.alt || '';
  const base = file.replace(/\.[a-z]+$/, '');
  const photoKey = Object.keys(PHOTOS).find((k) => path.basename(k).replace(/\.[a-z]+$/, '') === base);
  if (!photoKey) return '';
  // On mobile the H1 + intro text are always first on screen (text is the LCP element), so no photo is ever
  // fetchpriority="high"/eager: hero photos sit below the text (and below the Quick Quote card on service pages).
  // Chrome's lazy-load margin still fetches a hero photo straight away when it is near the viewport.
  const src = PHOTOS[photoKey];
  const widths = [400, 800, 1200].filter((w) => w <= src.width);
  if (!widths.length) widths.push(src.width);
  const sizes = hero ? '(min-width: 900px) 40vw, 100vw' : '(min-width: 768px) 448px, 100vw';
  const avif = await getImage({ src, widths, format: 'avif', sizes });
  const webp = await getImage({ src, widths, format: 'webp', sizes });
  return `<figure class="photo"><picture><source type="image/avif" srcset="${avif.srcSet.attribute}" sizes="${sizes}"><img src="${webp.src}" srcset="${webp.srcSet.attribute}" sizes="${sizes}" width="${src.width}" height="${src.height}" alt="${esc(alt)}" loading="lazy" decoding="async"></picture></figure>`;
}

// ---------- MAP ----------
// The Google Maps embed is shown directly (no tap-to-load facade). loading="lazy" keeps it off the critical path:
// the browser fetches it only when it nears the viewport. The box has a fixed CSS height (320 px on phones,
// 400 px from 768 px), so nothing shifts when the map arrives.
export function renderMap(page: Page, opts: { button?: string; loc?: string } = {}) {
  const loc = opts.loc || 'inline_content';
  const button = opts.button || 'Get directions';
  return `<div class="map">
<div class="map-canvas"><iframe src="${esc(SITE.mapsEmbed)}" title="Map: ${esc(SITE.name)}, Chandrasekharpur" width="600" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
<div class="map-info"><p class="map-title">${esc(SITE.name)}</p><p class="map-rating"><span class="map-stars" aria-hidden="true">★★★★★</span> <strong>${reviewData.rating.toFixed(1)}</strong> · <a href="${esc(reviewData.googleMapsUrl)}" target="_blank" rel="noopener" data-track="outbound_click" data-cta-location="${loc}" data-page-type="${page.fm.page_type}">${reviewData.reviewCount} Google reviews</a></p><p>${esc(SITE.addressLines.join(', '))}</p>
<div class="cta-row"><a class="btn btn-blue" href="${SITE.mapsUrl}" target="_blank" rel="noopener" data-track="directions_click" data-cta-location="${loc}" data-page-type="${page.fm.page_type}">${icon('arrow')}<span>${esc(button)}</span></a></div></div></div>`;
}

// ---------- FORM ----------
// The "Use my details to improve ads" box is rendered only when an ads tag that can use it is configured at build
// time (Meta Pixel directly, or GTM, which receives ads_consent in the dataLayer). Without one it would do nothing.
const ADS_OPT_IN = Boolean(import.meta.env.PUBLIC_META_PIXEL_ID || import.meta.env.PUBLIC_GTM_ID);

/** Page tag as display text: "NiladriVihar" -> "Niladri Vihar", "NewHouse" -> "New House" (KIIT stays KIIT).
 *  Only the visible WhatsApp text changes; analytics data-* attributes use the URL slug, not this tag. */
export const readableTag = (tag: string) => String(tag).replace(/([a-z])([A-Z])/g, '$1 $2');
/** Readable "[Page: …" tag inside a WhatsApp message. */
export const readableMsg = (text: string) => text.replace(/\[Page: ([A-Za-z]+)/g, (_m, t: string) => `[Page: ${readableTag(t)}`);
/** Service name in words for service pages ("Leak & Blockage Repair"), from the WhatsApp prefill or the nav name. */
export function serviceName(page: Page) {
  if (page.fm.page_type !== 'service') return '';
  return page.fm.whatsapp_prefill.match(/quote for (.+?) in Bhubaneswar/)?.[1] || page.navName;
}
/** Every form message carries the phone typed in the form and, on service pages, the service in words. */
function formTemplate(page: Page, tpl: string) {
  let lines = tpl.split('\n');
  if (!lines.some((l) => l.includes('{phone}'))) {
    const at = lines.findIndex((l) => l.includes('{name}'));
    lines.splice(at + 1, 0, 'Phone: {phone}');
  }
  const svc = serviceName(page);
  if (svc && !lines.some((l) => /^Service:/.test(l))) {
    const at = lines.findIndex((l) => l.includes('{problem}'));
    lines.splice(at < 0 ? lines.length : at, 0, `Service: ${svc}`);
  }
  return readableMsg(lines.join('\n'));
}

/** One name and one button label for every WhatsApp form on the site (hero card, service/area card, booking
 *  sections). Analytics keep telling the two placements apart by data-form-id: quick_quote (hero / service /
 *  area card) and book_visit (the booking section further down the page). */
export const FORM_NAME = 'Quick Quote';
export const FORM_TITLE = 'Quick Quote on WhatsApp';
export const FORM_SUBMIT = 'Get Quote on WhatsApp';

export function renderForm(page: Page, o: { formId: 'quick_quote' | 'book_visit'; id?: string; submit?: string; template: string; loc: string }) {
  const pre = o.formId === 'quick_quote' ? 'qq' : 'bv';
  const id = o.id || (o.formId === 'quick_quote' ? 'quick-quote' : 'book-a-visit');
  const selArea = page.fm.page_type === 'locality' ? page.slug : '';
  const opts = AREA_OPTIONS.map(([v, l]) => `<option${v === selArea ? ' selected' : ''}>${esc(l)}</option>`).join('');
  const submit = o.submit || FORM_SUBMIT;
  // A field's description: an optional visible hint, then its error line (empty until site.ts fills it).
  const desc = (n: string, hint = false) => `aria-describedby="${hint ? `${pre}-${n}-hint ` : ''}${pre}-${n}-err"`;
  const err = (n: string) => `<p class="fld-err" id="${pre}-${n}-err" data-err="${n}"></p>`;
  // Fields have no `name` attribute: if the script has not run, a native submit sends nothing (no personal data
  // in a URL). site.ts reads them by data-f and validates (visible messages under each field). Phone accepts
  // 10 digits with optional 0 / 91 / +91 and spaces or dashes. The Area select is not `required` (Chromium would
  // expose an untouched empty select as "invalid" on load): aria-required + the script check cover it.
  return `<form id="${id}" class="wa-form" data-wa-form data-form-id="${o.formId}" ${trackAttrs(page, 'whatsapp_form_submit', o.loc)} data-template="${esc(formTemplate(page, o.template))}">
<p class="req-note">All fields are required.</p>
<div class="fld"><label for="${pre}-name">Name</label><input id="${pre}-name" data-f="name" type="text" autocomplete="name" required pattern=".*\\S.*" maxlength="60" ${desc('name')}>${err('name')}</div>
<div class="fld"><label for="${pre}-phone">Phone (WhatsApp)</label><input id="${pre}-phone" data-f="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[\\s\\-]*(\\+?91|0)?[\\s\\-]*[6-9](?:[\\s\\-]*\\d){9}[\\s\\-]*" maxlength="20" ${desc('phone', true)}><p class="hint" id="${pre}-phone-hint"><span class="hint-long">10-digit mobile number, e.g. 98765 43210</span><span class="hint-short">e.g. 98765 43210</span></p>${err('phone')}</div>
<div class="fld"><label for="${pre}-area">Area</label><select id="${pre}-area" data-f="area" aria-required="true" ${desc('area')}><option value="">Choose your area</option>${opts}</select>${err('area')}</div>
<div class="fld"><label for="${pre}-problem">Problem</label><textarea id="${pre}-problem" data-f="problem" rows="3" required maxlength="500" ${desc('problem', true)}></textarea><p class="hint" id="${pre}-problem-hint">e.g. kitchen tap dripping</p>${err('problem')}</div>
${ADS_OPT_IN ? '<label class="chk"><input type="checkbox" data-f="ads"><span>Use my details to improve ads (optional)</span></label>' : ''}
<button type="submit" class="btn btn-wa btn-block">${icon('wa')}<span>${esc(submit)}</span></button>
</form><noscript><p class="noscript">Please call <a href="${SITE.tel}">${SITE.phoneDisplay}</a> or <a href="${esc(waLink(readableMsg(page.fm.whatsapp_prefill)))}" target="_blank" rel="noopener">WhatsApp us</a>.</p></noscript>`;
}

function formFromMarker(ctx: Ctx, mk: ReturnType<typeof parseMarker>) {
  const formId = mk.head.trim() as 'quick_quote' | 'book_visit';
  if (formId !== 'quick_quote' && formId !== 'book_visit') throw new Error(`${ctx.page.file}: unknown form ${formId}`);
  return renderForm(ctx.page, {
    formId,
    id: mk.attrs.id,
    // One submit label everywhere (the marker's submit= text is ignored on purpose).
    submit: FORM_SUBMIT,
    template: (mk.attrs.whatsapp_text || '').replace(/\\n/g, '\n'),
    loc: mk.attrs.cta_location || (formId === 'quick_quote' ? 'quick_quote_form' : 'book_visit_form'),
  });
}

/** Quick Quote card for service pages (no FORM marker in their copy). */
export function quickQuoteCard(page: Page) {
  return `<div class="card form-card" id="quick-quote"><p class="card-title">${FORM_TITLE}</p><p>Tell us the problem. We reply on WhatsApp.</p>${renderForm(page, {
    formId: 'quick_quote',
    id: 'quick_quote',
    template: `Name: {name}\nPhone: {phone}\nArea: {area}\nProblem: {problem}\n[Page: ${page.fm.page_tag} | Form: quick_quote]`,
    loc: 'quick_quote_form',
  })}<p class="consent">By sending, you agree we may use your number to reply on WhatsApp. See our <a href="/privacy-policy/">Privacy Policy</a>.</p></div>`;
}

// ---------- BREADCRUMB ----------
export function renderBreadcrumb(page: Page) {
  if (!page.breadcrumb.length) throw new Error(`${page.file}: [BREADCRUMB] but no BreadcrumbList in JSON-LD`);
  const items = page.breadcrumb.map((b, i) => {
    const href = b.item.replace(SITE.origin, '');
    return i === page.breadcrumb.length - 1
      ? `<li aria-current="page">${esc(b.name)}</li>`
      : `<li><a href="${esc(href)}">${i === 0 ? icon('home', 'ico crumb-home') : ''}${esc(b.name)}</a></li>`;
  });
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.join('')}</ol></nav>`;
}

// ---------- markdown blocks ----------
function linkAttrs(ctx: Ctx, href: string, text: string) {
  const p = ctx.page;
  if (href.startsWith('tel:')) return ` ${trackAttrs(p, 'call_click', ctx.loc)}`;
  if (href.includes('wa.me/')) return ` target="_blank" rel="noopener" ${trackAttrs(p, 'whatsapp_click', ctx.loc)}`;
  if (href.startsWith('mailto:')) return ` data-track="email_click" data-cta-location="${ctx.loc}" data-page-type="${p.fm.page_type}"`;
  if (/^https?:\/\//.test(href)) {
    const dir = /direction/i.test(text);
    return ` target="_blank" rel="noopener" data-track="${dir ? 'directions_click' : 'outbound_click'}" data-cta-location="${ctx.loc}" data-page-type="${p.fm.page_type}"`;
  }
  if (href.startsWith('/areas/')) return ` data-track="nav_click" data-cta-location="${ctx.loc}"`;
  return '';
}

const PHONE_TEXT = SITE.phoneDisplay.replace(/\+/g, '\\+');
/** Wrap "+91 9668875352" in a tracked tel: link wherever it is plain text (never inside an existing link or tag). */
function linkPhones(ctx: Ctx, html: string) {
  const loc = ctx.loc === 'faq' || ctx.loc === 'hero' ? ctx.loc : 'inline_content';
  let inA = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      if (/^<a[\s>]/.test(part)) inA++;
      else if (/^<\/a>/.test(part)) inA = Math.max(0, inA - 1);
      return part;
    }
    return inA ? part : part.replace(new RegExp(PHONE_TEXT, 'g'), `<a href="${SITE.tel}" ${trackAttrs(ctx.page, 'call_click', loc)}>${SITE.phoneDisplay}</a>`);
  }).join('');
}

/** Line-break hygiene on visible text only (never inside tags, <script> or <select>): keep place names, times,
 *  phone numbers and price amounts on one line. NBSP = U+00A0, WJ = U+2060 (no break after the en dash). */
export function typo(html: string) {
  let skip = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      if (/^<(script|select)[\s>]/i.test(part)) skip++;
      else if (/^<\/(script|select)>/i.test(part)) skip = Math.max(0, skip - 1);
      return part;
    }
    if (skip || !part.trim()) return part;
    return part
      .replace(/\b([A-Z][a-z]+|[A-Z]{2,}) (Vihar|Nagar|Village|Square|Center)\b/g, '$1 $2')
      .replace(/\b(\d{1,2}) (AM|PM)\b/g, '$1 $2')
      .replace(/\b(AM|PM) – /g, '$1 – ')
      .replace(/\+91 (\d{10})/g, '+91 $1')
      .replace(/\b(from|From|up to|Up to) ₹/g, '$1 ₹')
      .replace(/₹([\d,]+)\s?[–-]\s?₹/g, '₹$1–⁠₹')
      .replace(/ \+ parts\b/g, ' + parts')
      .replace(/(\d) five-star\b/g, '$1 five-star');
  }).join('');
}

function postProcess(ctx: Ctx, html: string) {
  html = html.replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, (_m, href, text) => `<a href="${href}"${linkAttrs(ctx, href.replace(/&amp;/g, '&'), text)}>${text}</a>`);
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_m, inner: string) => {
    let t = inner;
    const emptyHead = /<thead>\s*<tr>(\s*<th[^>]*>\s*<\/th>)+\s*<\/tr>\s*<\/thead>/;
    const keyValue = emptyHead.test(t);
    if (keyValue) {
      t = t.replace(emptyHead, '');
      t = t.replace(/<tr>\s*<td([^>]*)>([\s\S]*?)<\/td>/g, '<tr><th scope="row"$1>$2</th>');
    } else {
      t = t.replace(/<th(?=[\s>])(?![^>]*scope)/g, '<th scope="col"');
    }
    const pricing = /<th[^>]*>\s*Price/.test(t) ? ' data-pricing' : '';
    // Text tables (not rate tables): every cell carries its column header, shown as a label when rows stack on phones.
    if (!keyValue && !pricing) {
      const heads = [...(t.match(/<thead>[\s\S]*?<\/thead>/)?.[0] || '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => esc(cleanInline(m[1].replace(/<[^>]+>/g, ''))));
      t = t.replace(/<tbody>([\s\S]*?)<\/tbody>/, (_b, rows: string) =>
        `<tbody>${rows.replace(/<tr>([\s\S]*?)<\/tr>/g, (_r, cells: string) => {
          let n = 0;
          return `<tr>${cells.replace(/<td(?=[\s>])/g, () => `<td data-label="${heads[n++] || ''}"`)}</tr>`;
        })}</tbody>`);
    }
    const label = ctx.label ? esc(cleanInline(ctx.label)) : 'Table';
    const cols = (t.match(/<tr>([\s\S]*?)<\/tr>/)?.[1].match(/<t[hd][\s>]/g) || []).length;
    // The region label is repeated as a visually hidden <caption>, so the table itself has a name too.
    const caption = ctx.label ? `<caption class="sr-only">${label}</caption>` : '';
    return `<div class="tbl${keyValue ? ' tbl-kv' : ''}${cols > 2 ? ' tbl-3' : ''}" role="region" aria-label="${label}" tabindex="0"${pricing}><table>${caption}${t}</table></div>`;
  });
  return linkPhones(ctx, html);
}

// A card list item links to a page ("/services/…") or, for a "Not sure? Send a photo on WhatsApp" card, to
// WhatsApp: "(whatsapp)" or "(/#quick-quote)" use the page's WhatsApp prefill, "(whatsapp: Hi, …)" a custom one,
// or a full wa.me URL.
const LIST_LINK_RE = /^- (\*\*)?\[([^\]]+)\]\((\/[^)]+|whatsapp(?::[^)]*)?|https:\/\/wa\.me\/[^)]+)\)(\*\*)?(.*)$/;
/** "/#quick-quote" or "#book-a-visit" (a link to a WhatsApp form card) in a card list is rendered as a WhatsApp card too. */
const isFormAnchor = (href: string) => /^\/?#(quick-quote|book-a-visit)$/.test(href);
const isWaHref = (href: string) => /^whatsapp\b/.test(href) || href.startsWith('https://wa.me/') || isFormAnchor(href);
function waCardHref(page: Page, href: string) {
  if (href.startsWith('https://wa.me/')) return href;
  const custom = href.match(/^whatsapp:\s*(.+)$/)?.[1];
  return waLink(readableMsg(custom || page.fm.whatsapp_prefill));
}
const CONTACT_ICONS: Record<string, string> = { 'Phone / WhatsApp': 'phone', Phone: 'phone', WhatsApp: 'wa', Email: 'mail', Address: 'pin', Hours: 'clock', Languages: 'chat' };
const CONTACT_RE = new RegExp(`^- \\*\\*(${Object.keys(CONTACT_ICONS).map((k) => k.replace(/[/]/g, '\\/')).join('|')}):\\*\\*`);
const TRUST_RE = /^\*\*[^*]+\*\*( · \*\*[^*]+\*\*)+$/;

function renderMdBlock(ctx: Ctx, md: string) {
  const lines = md.split('\n').filter((l) => l.trim());
  // Trust row: **a** · **b** · **c**
  if (lines.length === 1 && TRUST_RE.test(lines[0].trim())) {
    const items = lines[0].trim().split(' · ').map((s) => s.replace(/\*\*/g, ''));
    return `<ul class="trust">${items.map((i) => `<li>${icon(trustIcon(i))}<span>${marked.parseInline(i)}</span></li>`).join('')}</ul>`;
  }
  // Link lists -> service cards (icon + title + description), compact service cards (no description) or
  // link chips (area links, with a map-pin icon).
  if (lines.length > 1 && lines.every((l) => LIST_LINK_RE.test(l))) {
    const parsed = lines.map((l) => l.match(LIST_LINK_RE)!);
    const svcTrack = (href: string) =>
      `data-track="service_card_click" data-cta-location="service_card" data-service="${href.split('/').filter(Boolean).pop()}" data-page-type="${ctx.page.fm.page_type}"`;
    const ico = (href: string) => `<span class="svc-ico">${icon(isWaHref(href) ? 'wa' : iconForHref(href))}</span>`;
    const hasWa = parsed.some((m) => isWaHref(m[3]));
    // WhatsApp card: opens WhatsApp in a new tab, tracked as whatsapp_click (+ generate_lead) from the card grid.
    const waCard = (m: RegExpMatchArray, sm = '') => {
      const rest = m[5].trim().replace(/^:\s*/, '');
      const p = rest ? `<p>${marked.parseInline(cap(rest)) as string}</p>` : '';
      return `<li class="svc-card svc-wa${sm}"><div class="svc-head">${ico(m[3])}<a href="${esc(waCardHref(ctx.page, m[3]))}" target="_blank" rel="noopener" ${trackAttrs(ctx.page, 'whatsapp_click', 'service_card')}>${esc(m[2])}</a></div>${p}</li>`;
    };
    const withDesc = parsed.every((m) => isWaHref(m[3]) || /^:\s/.test(m[5]));
    if (withDesc && parsed.some((m) => !isWaHref(m[3]))) {
      const lis = parsed.map((m) => {
        const href = m[3];
        if (isWaHref(href)) return waCard(m);
        const track = href.startsWith('/services/') ? svcTrack(href) : `data-track="nav_click" data-cta-location="${ctx.loc}"`;
        return `<li class="svc-card"><div class="svc-head">${ico(href)}<a href="${esc(href)}" ${track}>${esc(m[2])}</a></div><p>${marked.parseInline(cap(m[5].replace(/^:\s*/, ''))) as string}</p></li>`;
      });
      return `<ul class="cards">${lis.join('')}</ul>`;
    }
    if (parsed.every((m) => m[3].startsWith('/services/') || isWaHref(m[3]))) {
      const lis = parsed.map((m) => {
        const href = m[3];
        if (isWaHref(href)) return waCard(m, ' svc-sm');
        const rest = m[5].trim();
        const multi = /\]\(\//.test(rest); // a second link in the line: no whole-card overlay
        const desc = /^:/.test(rest);
        const tail = rest && !desc ? (/^\s/.test(m[5]) ? ' ' : '') + (marked.parseInline(rest) as string) : '';
        const p = desc ? `<p>${marked.parseInline(cap(rest.replace(/^:\s*/, ''))) as string}</p>` : '';
        return `<li class="svc-card svc-sm${multi ? ' svc-multi' : ''}"><div class="svc-head">${ico(href)}<span><a href="${esc(href)}" ${svcTrack(href)}>${esc(m[2])}</a>${tail}</span></div>${p}</li>`;
      });
      return `<ul class="cards cards-sm">${lis.join('')}</ul>`;
    }
    if (hasWa) throw new Error(`${ctx.page.file}: a WhatsApp card needs service cards in the same list`);
    const lis = parsed.map((m) => {
      const html = postProcess(ctx, `<a href="${esc(m[3])}">${esc(m[2])}</a>`);
      const pin = m[3].startsWith('/areas/') ? icon('pin', 'ico chip-ico') : '';
      // Keep the source spacing: "[link] (and Damana)" gets a space, "[link], from ₹2,999" / "[link]." do not.
      return `<li>${pin}${html}${m[5].trim() ? (/^\s/.test(m[5]) ? ' ' : '') + (marked.parseInline(m[5].trim()) as string) : ''}</li>`;
    });
    return `<ul class="chips">${lis.join('')}</ul>`;
  }
  // Contact details list: "- **Phone / WhatsApp:** ..." items get a matching icon.
  if (lines.length > 1 && lines.every((l) => CONTACT_RE.test(l))) {
    const lis = lines.map((l) => {
      const label = l.match(CONTACT_RE)![1];
      const item = marked.parseInline(l.replace(/^- /, '')) as string;
      return `<li>${icon(CONTACT_ICONS[label], 'ico contact-ico')}<span>${item}</span></li>`;
    });
    return postProcess(ctx, `<ul class="contact-list">${lis.join('')}</ul>`);
  }
  return postProcess(ctx, marked.parse(md) as string);
}

// ---------- WHY PRICING (two cards) ----------
const listItems = (md: string) => md.split('\n').filter((l) => /^- /.test(l)).map((l) => marked.parseInline(l.slice(2).trim()) as string);

function renderWhyPricing(ctx: Ctx, mk: ReturnType<typeof parseMarker>, blocks: string[]) {
  const li = blocks.findIndex((b) => b.split('\n').every((l) => /^- /.test(l)));
  if (li !== 0) throw new Error(`${ctx.page.file}: [WHY PRICING] must be followed by the "why" bullet list`);
  const why = listItems(blocks[0]).map((h) => `<li>${icon('check-circle')}<span>${h}</span></li>`).join('');
  const right = blocks.slice(1).map((b) =>
    b.split('\n').every((l) => /^- /.test(l))
      ? `<ul class="wp-prices">${listItems(b).map((h) => { const i = h.lastIndexOf(': '); return i > 0 ? `<li><span>${h.slice(0, i)}</span><strong>${h.slice(i + 2)}</strong></li>` : `<li><span>${h}</span></li>`; }).join('')}</ul>`
      : `<p>${marked.parseInline(b.replace(/\n/g, ' ')) as string}</p>`,
  ).join('');
  const left = mk.head || 'Why choose us';
  const rt = mk.attrs.right || 'Pricing';
  // Left card footer (pinned to the card bottom, like the Pricing card's), so both cards end on one line.
  // Marker option: left_button="About our team" /about/ (default).
  const lb = mk.attrs.left_button || 'About our team';
  const lh = mk.extra.left_button || '/about/';
  const leftFoot = `<div class="wp-foot"><a class="btn btn-outline" href="${esc(lh)}">${esc(lb)}${icon('arrow')}</a></div>`;
  return postProcess(ctx, `<div class="wp-grid"><div class="card wp-card"><h3 class="wp-title">${icon('shield', 'ico wp-ico')}<span>${esc(left)}</span></h3><ul class="wp-list">${why}</ul>${leftFoot}</div><div class="card wp-card"><h3 class="wp-title">${icon('rupee', 'ico wp-ico')}<span>${esc(rt)}</span></h3>${right}<div class="wp-foot"><p class="wp-note">Visit charge ₹199–₹349, adjusted in the final bill. Free site visit for big works.</p><a class="btn btn-outline" href="/pricing/">See the full rate card${icon('arrow')}</a></div></div></div>`);
}

// ---------- PRICING TIERS (three cards, from content/data/pricing-tiers.json = rate card) ----------
export function renderTiers(page: Page) {
  const t = page.fm.page_type;
  const cards = tierData.tiers.map((tier: { name: string; price: string; badge?: string; items: string[] }) => {
    const slug = slugify(tier.name);
    const text = `Hi, I want to book: ${tier.name} [Page: ${readableTag(page.fm.page_tag)} | Tier: ${tier.name}]`;
    const attrs = `data-track="whatsapp_click" data-cta-location="pricing_table" data-page-type="${t}" data-service="${slug}"${t === 'locality' ? ` data-locality="${page.slug}"` : ''}`;
    const items = tier.items.map((it) => `<li>${icon('check-circle')}<span>${esc(it)}</span></li>`).join('');
    return `<li class="tier${tier.badge ? ' tier-hot' : ''}">${tier.badge ? `<p class="tier-badge">${esc(tier.badge)}</p>` : ''}<div class="tier-top"><p class="tier-name">${esc(tier.name)}</p>${icon('rupee', 'ico tier-ico')}</div><p class="tier-price">${esc(tier.price)}</p><ul class="tier-list">${items}</ul><a class="btn btn-blue btn-block tier-btn" href="${esc(waLink(text))}" target="_blank" rel="noopener" ${attrs}><span>Book Now</span><span class="sr-only">: ${esc(tier.name)}</span>${icon('arrow')}</a></li>`;
  }).join('');
  return `<div class="tiers" data-pricing><ul class="tier-grid">${cards}</ul><p class="tier-note">${esc(tierData.note)}</p></div>`;
}

// ---------- page assembly ----------
type Seg =
  | { t: 'md'; md: string }
  | { t: 'marker'; mk: ReturnType<typeof parseMarker>; line: string }
  | { t: 'h1'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'faq'; q: string; md: string };

const KNOWN = new Set(['CTA', 'IMAGE', 'MAP', 'FORM', 'BREADCRUMB', 'CARD LABEL', 'WHY PRICING', 'PRICING TIERS']);

function segment(page: Page): { segs: Seg[]; accent: string | null } {
  let body = page.body;
  let accent: string | null = null;
  body = body.replace(/<!--([\s\S]*?)-->/g, (_m, c: string) => {
    const a = c.match(/Accent colour on (?:the words? )?"([^"]+)"/);
    if (a) accent = a[1];
    return '';
  });
  const segs: Seg[] = [];
  const lines = body.split('\n');
  let buf: string[] = [];
  const flush = () => {
    const chunks = buf.join('\n').split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
    for (const c of chunks) segs.push({ t: 'md', md: c });
    buf = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tl = line.trim();
    const mm = tl.match(/^\[([A-Z][A-Z ]*)(:|\])/);
    if (mm && tl.endsWith(']')) {
      flush();
      if (!KNOWN.has(mm[1])) throw new Error(`${page.file}: unknown marker ${tl.slice(0, 40)}`);
      segs.push({ t: 'marker', mk: parseMarker(tl), line: tl });
      continue;
    }
    if (/^# /.test(line)) { flush(); segs.push({ t: 'h1', text: line.slice(2).trim() }); continue; }
    if (/^## /.test(line)) { flush(); segs.push({ t: 'h2', text: line.slice(3).trim() }); continue; }
    if (/^### /.test(line)) {
      flush();
      const q = cleanInline(line.slice(4));
      if (page.faqs.has(q)) {
        const ans: string[] = [];
        while (i + 1 < lines.length && !/^#{1,6} /.test(lines[i + 1]) && !/^\[[A-Z][A-Z ]*[:\]]/.test(lines[i + 1].trim())) ans.push(lines[++i]);
        segs.push({ t: 'faq', q, md: ans.join('\n').trim() });
      } else segs.push({ t: 'h3', text: line.slice(4).trim() });
      continue;
    }
    buf.push(line);
  }
  flush();
  return { segs, accent };
}

export interface Rendered {
  breadcrumb: string;
  h1: string;
  heroBlocks: string;
  heroCard: string;
  heroImage: string;
  sections: { id: string; title: string; html: string; card: string }[];
  faqCount: number;
}

async function renderSegs(ctx: Ctx, segs: Seg[], level: 'h2' | 'h3', heroMode = false) {
  const out: string[] = [];
  let card: string[] | null = null;
  let cardDone = false;
  let faqOpen = false;
  let firstImage: string | null = null;
  let cardHtml = '';
  const push = (h: string) => (card ? card.push(h) : out.push(h));
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s.t !== 'faq' && faqOpen) { push('</div>'); faqOpen = false; }
    const isConsent = s.t === 'md' && /^By sending/.test(s.md);
    if (card && cardDone && !isConsent) {
      out.push(...wrapCard(card, level));
      cardHtml = out[out.length - 1];
      card = null;
      cardDone = false;
    }
    if (s.t === 'md') {
      if (card && cardDone && isConsent) {
        card.push(`<div class="consent">${renderMdBlock(ctx, s.md)}</div>`);
        out.push(...wrapCard(card, level));
        cardHtml = out[out.length - 1];
        card = null;
        cardDone = false;
        continue;
      }
      push(renderMdBlock(ctx, s.md));
    } else if (s.t === 'h3') {
      ctx.label = s.text;
      push(`<h3>${marked.parseInline(s.text)}</h3>`);
    } else if (s.t === 'faq') {
      if (!faqOpen) { push('<div class="faqs">'); faqOpen = true; }
      const prevLoc = ctx.loc;
      ctx.loc = 'faq';
      push(`<details class="faq" data-qid="${slugify(s.q)}"><summary><h3>${esc(s.q)}</h3>${icon('chev', 'ico faq-chev')}</summary><div class="faq-a">${renderMdBlock(ctx, s.md)}</div></details>`);
      ctx.loc = prevLoc;
    } else if (s.t === 'marker') {
      const { kind } = s.mk;
      if (kind === 'CTA') {
        // Two CTA rows in a row (e.g. an [IMAGE] between them that has no photo yet renders nothing): keep the first.
        const list = card || out;
        if (!/^<div class="cta-row/.test(list[list.length - 1] || '')) push(renderCta(ctx, s.mk));
      } else if (kind === 'IMAGE') {
        if (heroMode && !firstImage) firstImage = await renderImage(ctx, s.mk, true);
        else {
          const img = await renderImage(ctx, s.mk);
          if (img) push(img);
        }
      } else if (kind === 'MAP') push(renderMap(ctx.page, { button: s.mk.attrs.button, loc: s.mk.attrs.cta_location }));
      else if (kind === 'CARD LABEL') {
        if (card) out.push(...wrapCard(card, level));
        card = [`<p class="card-title">${esc(s.mk.head)}</p>`];
        cardDone = false;
      } else if (kind === 'FORM') {
        push(formFromMarker(ctx, s.mk));
        if (card) cardDone = true;
      } else if (kind === 'PRICING TIERS') {
        push(renderTiers(ctx.page));
      } else if (kind === 'WHY PRICING') {
        // Consumes the markdown blocks that follow (up to the next marker / heading): the first list is the
        // "Why choose us" card, everything after it goes into the "Pricing" card.
        const blocks: string[] = [];
        while (i + 1 < segs.length && segs[i + 1].t === 'md') blocks.push((segs[++i] as { md: string }).md);
        push(renderWhyPricing(ctx, s.mk, blocks));
      } else if (kind === 'BREADCRUMB') {
        /* hoisted above the H1 */
      }
    } else if (s.t === 'h1' || s.t === 'h2') {
      throw new Error('unexpected heading in section');
    }
  }
  if (faqOpen) push('</div>');
  if (card) { out.push(...wrapCard(card, level)); cardHtml = out[out.length - 1]; }
  return { html: out, firstImage, cardHtml };
}

function wrapCard(parts: string[], _level: string) {
  // The in-page anchor (#book-a-visit, #quick-quote) sits on the card, so a jump lands on the card title, not the
  // first field; the <form> keeps its form id (book_visit / quick_quote) as its element id.
  let html = parts.join('');
  let id = '';
  html = html.replace(/<form id="([^"]+)"([^>]*?) data-form-id="([^"]+)"/, (_m, a, mid, fid) => { id = a; return `<form id="${fid}"${mid} data-form-id="${fid}"`; });
  // Every form card carries the same name (a [CARD LABEL] in the copy is replaced).
  if (id) html = html.replace(/^<p class="card-title">[\s\S]*?<\/p>/, `<p class="card-title">${FORM_TITLE}</p>`);
  return [`<div class="card form-card"${id ? ` id="${id}"` : ''}>${html}</div>`];
}

export async function renderPage(page: Page): Promise<Rendered> {
  const { segs, accent } = segment(page);
  const ctx: Ctx = { page, loc: 'inline_content', label: '' };
  const h1Idx = segs.findIndex((s) => s.t === 'h1');
  if (h1Idx < 0 || segs.filter((s) => s.t === 'h1').length !== 1) throw new Error(`${page.file}: needs exactly one H1`);
  const firstH2 = segs.findIndex((s) => s.t === 'h2');
  const heroSegs = segs.slice(0, firstH2 < 0 ? segs.length : firstH2).filter((s) => s.t !== 'h1');
  const h1Text = (segs[h1Idx] as any).text as string;
  let h1 = esc(h1Text);
  if (accent) {
    if (!h1Text.includes(accent)) throw new Error(`${page.file}: accent "${accent}" not in H1`);
    h1 = h1.replace(esc(accent), `<span class="accent">${esc(accent)}</span>`);
  }
  const hasCrumbMarker = segs.some((s) => s.t === 'marker' && s.mk.kind === 'BREADCRUMB');
  const breadcrumb = hasCrumbMarker ? renderBreadcrumb(page) : '';

  ctx.loc = 'hero';
  // The form card beside the hero: the hero's own [FORM] (its card id), else the Quick Quote card that service
  // and area pages get automatically.
  const heroFormMk = heroSegs.find((s) => s.t === 'marker' && s.mk.kind === 'FORM') as { mk: ReturnType<typeof parseMarker> } | undefined;
  ctx.heroForm = heroFormMk
    ? heroFormMk.mk.attrs.id || (heroFormMk.mk.head.trim() === 'quick_quote' ? 'quick-quote' : 'book-a-visit')
    : page.fm.page_type === 'service' || page.fm.page_type === 'locality' ? 'quick-quote' : undefined;
  const hero = await renderSegs(ctx, heroSegs, 'h2', true);
  ctx.heroForm = undefined;
  let heroCard = hero.cardHtml;
  let heroBlocks = hero.html.filter((h) => h !== heroCard).join('\n');
  // Service and area pages: Quick Quote card beside the hero text (no empty right half on desktop).
  if (!heroCard && (page.fm.page_type === 'service' || page.fm.page_type === 'locality')) heroCard = quickQuoteCard(page);

  const sections: Rendered['sections'] = [];
  if (firstH2 >= 0) {
    let cur: { title: string; segs: Seg[] } | null = null;
    const groups: { title: string; segs: Seg[] }[] = [];
    for (const s of segs.slice(firstH2)) {
      if (s.t === 'h2') { cur = { title: s.text, segs: [] }; groups.push(cur); } else cur!.segs.push(s);
    }
    for (const g of groups) {
      ctx.loc = 'inline_content';
      ctx.label = g.title;
      const r = await renderSegs(ctx, g.segs, 'h3');
      const id = slugify(cleanInline(g.title));
      // A section that holds a form card (Book a Visit) renders as intro + card (two columns on desktop).
      const card = r.cardHtml && r.html.includes(r.cardHtml) ? r.cardHtml : '';
      let parts = card ? r.html.filter((h) => h !== card) : r.html;
      // "Book …" sections and form sections always end with Call / WhatsApp buttons.
      if ((id.startsWith('book-') || card) && !parts.some((h) => h.startsWith('<div class="cta-row'))) {
        parts = [...parts, `<div class="cta-row cta-cw">${callButton(page, 'inline_content')}${waButton(page, 'inline_content')}</div>`];
      }
      sections.push({ id, title: typo(marked.parseInline(g.title) as string), html: typo(parts.join('\n')), card: card ? typo(card) : '' });
    }
  }
  // On phones the sticky bar already shows Call + WhatsApp: keep only the last plain Call + WhatsApp row of the page
  // visible there (cta-mid rows are hidden below 768 px by global.css).
  const cwCount = sections.reduce((n, s) => n + (s.html.match(/class="cta-row cta-cw"/g) || []).length, 0);
  let cwSeen = 0;
  for (const s of sections) {
    s.html = s.html.replace(/class="cta-row cta-cw"/g, (m) => (++cwSeen < cwCount ? 'class="cta-row cta-cw cta-mid"' : m));
  }
  heroBlocks = typo(heroBlocks);
  heroCard = typo(heroCard);
  h1 = typo(h1);
  const all = [breadcrumb, heroBlocks, heroCard, ...sections.map((s) => s.html + s.card)].join('\n');
  const leak = all.replace(/<script[\s\S]*?<\/script>/g, '').match(/\[(CTA|IMAGE|MAP|FORM|BREADCRUMB|CARD LABEL|WHY PRICING|PRICING TIERS)\b[^\]]*/);
  if (leak) throw new Error(`${page.file}: raw marker leaked into HTML: ${leak[0].slice(0, 60)}`);
  const faqCount = (all.match(/<details class="faq"/g) || []).length;
  if (faqCount !== page.faqs.size) throw new Error(`${page.file}: ${page.faqs.size} FAQs in JSON-LD but ${faqCount} rendered`);
  return { breadcrumb, h1, heroBlocks, heroCard, heroImage: hero.firstImage || '', sections, faqCount };
}
