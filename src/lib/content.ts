// Loads content/pages/**/*.md, renders markdown + markers to HTML strings.
// Markers: [CTA: ...], [IMAGE: ...], [MAP: ...], [FORM: ...], [CARD LABEL: ...], [BREADCRUMB: ...].
// Any other [UPPERCASE: ...] marker fails the build. "## JSON-LD" and "## Facts to confirm" are not rendered.
import { Marked } from 'marked';
import { load as yamlLoad } from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { getImage } from 'astro:assets';
import { SITE, waLink, AREA_OPTIONS, SERVICE_ORDER, AREA_ORDER } from './site';
import { icon } from './icons';

const marked = new Marked({ gfm: true, breaks: true });

// ---------- types ----------
export interface FrontMatter {
  url: string;
  page_type: 'home' | 'service' | 'locality' | 'pricing' | 'about' | 'contact' | 'legal';
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
const cleanInline = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|`/g, '').trim();

export interface Ctx {
  page: Page;
  loc: string; // current data-cta-location
  label: string; // current heading text (for table region labels)
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
  return `<a class="${cls}" href="${esc(waLink(page.fm.whatsapp_prefill))}" target="_blank" rel="noopener" ${trackAttrs(page, 'whatsapp_click', loc)}>${icon('wa')}<span>${esc(label)}</span></a>`;
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
    return `<div class="cta-row">${callButton(p, loc)}${waButton(p, loc)}</div>`;
  }
  if (mk.head === 'call+book_visit') {
    const href = mk.extra.book_visit || '#book-a-visit';
    return `<div class="cta-row">${callButton(p, loc, mk.attrs.call || 'Call Now')}<a class="btn btn-outline" href="${esc(href)}">${icon('arrow')}<span>${esc(mk.attrs.book_visit || 'Book a Visit')}</span></a></div>`;
  }
  if (mk.head === 'contact_line') {
    return `<div class="cta-row">${callButton(p, loc, `Call ${mk.attrs.call || SITE.phoneDisplay}`)}${waButton(p, loc)}<a class="btn btn-outline" href="mailto:${SITE.email}" data-track="email_click" data-cta-location="${loc}" data-page-type="${p.fm.page_type}">${icon('mail')}<span>Email us</span></a></div>`;
  }
  throw new Error(`${p.file}: unknown CTA type "${mk.head}"`);
}

// ---------- IMAGE ----------
const PHOTOS = import.meta.glob('/src/assets/photos/*.{webp,jpg,jpeg,png,avif}', { eager: true, import: 'default' }) as Record<string, ImageMetadata>;

function placeholderIcon(file: string) {
  if (/amaresh|team|contact|owner/.test(file)) return 'user';
  if (/estimate/.test(file)) return 'file';
  if (/leak|drain|tank|septic|sewer|sump|water|whatsapp|borewell|motor|pump/.test(file)) return 'drop';
  return 'wrench';
}
function shortCaption(alt: string) {
  let c = alt.replace(/^Mahapatra Plumbing Services\s+/, '').replace(/^Mahapatra\s+/, '');
  c = c.charAt(0).toUpperCase() + c.slice(1);
  return c;
}

async function renderImage(ctx: Ctx, mk: ReturnType<typeof parseMarker>, hero = false) {
  const file = mk.head.trim();
  const alt = mk.attrs.alt || '';
  const base = file.replace(/\.[a-z]+$/, '');
  const photoKey = Object.keys(PHOTOS).find((k) => path.basename(k).replace(/\.[a-z]+$/, '') === base);
  const loading = hero ? 'eager' : 'lazy';
  const fp = hero ? ' fetchpriority="high"' : '';
  if (photoKey) {
    const src = PHOTOS[photoKey];
    const widths = [400, 800, 1200].filter((w) => w <= src.width);
    const sizes = hero ? '(min-width: 768px) 40vw, 100vw' : '(min-width: 768px) 448px, 100vw';
    const avif = await getImage({ src, widths, format: 'avif', sizes });
    const webp = await getImage({ src, widths, format: 'webp', sizes });
    return `<figure class="photo"><picture><source type="image/avif" srcset="${avif.srcSet.attribute}" sizes="${sizes}"><img src="${webp.src}" srcset="${webp.srcSet.attribute}" sizes="${sizes}" width="${src.width}" height="${src.height}" alt="${esc(alt)}" loading="${loading}" decoding="async"${fp}></picture></figure>`;
  }
  const pub = path.join(process.cwd(), 'public/images', file);
  if (fs.existsSync(pub)) {
    const { default: sharp } = await import('sharp');
    const meta = await sharp(pub).metadata();
    return `<figure class="photo"><img src="/images/${esc(file)}" width="${meta.width}" height="${meta.height}" alt="${esc(alt)}" loading="${loading}" decoding="async"${fp}></figure>`;
  }
  // No photo yet: fixed-ratio placeholder (no CLS), icon + short caption. The alt text is kept as the caption.
  return `<figure class="ph${hero ? ' ph-hero' : ''}" data-image-slot="${esc(file)}"><div class="ph-box" aria-hidden="true">${icon(placeholderIcon(file), 'ph-ico')}${icon('camera', 'ph-cam')}</div><figcaption>${esc(shortCaption(alt))}</figcaption></figure>`;
}

// ---------- MAP ----------
export function renderMap(page: Page, opts: { button?: string; loc?: string } = {}) {
  const loc = opts.loc || 'inline_content';
  const button = opts.button || 'Get directions';
  return `<div class="map" data-map>
<div class="map-canvas" aria-hidden="true"><span class="map-pin">${icon('pin')}</span></div>
<div class="map-info"><p class="map-title">${esc(SITE.name)}</p><p>${esc(SITE.addressLines.join(', '))}</p>
<div class="cta-row"><button type="button" class="btn btn-outline" data-map-load data-src="${esc(SITE.mapsEmbed)}" data-page-type="${page.fm.page_type}">${icon('pin')}<span>Show map</span></button><a class="btn btn-blue" href="${SITE.mapsUrl}" target="_blank" rel="noopener" data-track="directions_click" data-cta-location="${loc}" data-page-type="${page.fm.page_type}">${icon('arrow')}<span>${esc(button)}</span></a></div></div></div>`;
}

// ---------- FORM ----------
export function renderForm(page: Page, o: { formId: 'quick_quote' | 'book_visit'; id?: string; submit: string; template: string; loc: string }) {
  const pre = o.formId === 'quick_quote' ? 'qq' : 'bv';
  const id = o.id || (o.formId === 'quick_quote' ? 'quick-quote' : 'book-a-visit');
  const selArea = page.fm.page_type === 'locality' ? page.slug : '';
  const opts = AREA_OPTIONS.map(([v, l]) => `<option${v === selArea ? ' selected' : ''}>${esc(l)}</option>`).join('');
  return `<form id="${id}" class="wa-form" data-wa-form data-form-id="${o.formId}" ${trackAttrs(page, 'whatsapp_form_submit', o.loc)} data-template="${esc(o.template)}">
<div class="fld"><label for="${pre}-name">Name</label><input id="${pre}-name" name="name" type="text" autocomplete="name" required maxlength="60"></div>
<div class="fld"><label for="${pre}-phone">Phone (WhatsApp)</label><input id="${pre}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="(\\+?91\\s?)?[6-9]\\d{4}\\s?\\d{5}" title="10-digit Indian mobile number, e.g. 98765 43210" maxlength="16"></div>
<div class="fld"><label for="${pre}-area">Area</label><select id="${pre}-area" name="area" required><option value="">Choose your area</option>${opts}</select></div>
<div class="fld"><label for="${pre}-problem">Problem</label><textarea id="${pre}-problem" name="problem" rows="3" required maxlength="500"></textarea></div>
<label class="chk"><input type="checkbox" name="ads"><span>Use my details to improve ads (optional)</span></label>
<button type="submit" class="btn btn-wa btn-block">${icon('wa')}<span>${esc(o.submit)}</span></button>
</form>`;
}

function formFromMarker(ctx: Ctx, mk: ReturnType<typeof parseMarker>) {
  const formId = mk.head.trim() as 'quick_quote' | 'book_visit';
  if (formId !== 'quick_quote' && formId !== 'book_visit') throw new Error(`${ctx.page.file}: unknown form ${formId}`);
  return renderForm(ctx.page, {
    formId,
    id: mk.attrs.id,
    submit: mk.attrs.submit || 'Send on WhatsApp',
    template: (mk.attrs.whatsapp_text || '').replace(/\\n/g, '\n'),
    loc: mk.attrs.cta_location || (formId === 'quick_quote' ? 'quick_quote_form' : 'book_visit_form'),
  });
}

/** Quick Quote card for service pages (no FORM marker in their copy). */
export function quickQuoteCard(page: Page, headingTag = 'h2') {
  return `<div class="card form-card"><${headingTag} class="card-title">Quick Quote on WhatsApp</${headingTag}><p>Tell us the problem. We reply on WhatsApp.</p>${renderForm(page, {
    formId: 'quick_quote',
    submit: 'Get Quote on WhatsApp',
    template: `Name: {name}\nArea: {area}\nProblem: {problem}\n[Page: ${page.fm.page_tag} | Form: quick_quote]`,
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
      : `<li><a href="${esc(href)}">${esc(b.name)}</a></li>`;
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
      t = t.replace(/<th(?![^>]*scope)/g, '<th scope="col"');
    }
    const pricing = /<th[^>]*>\s*Price/.test(t) ? ' data-pricing' : '';
    const label = ctx.label ? esc(cleanInline(ctx.label)) : 'Table';
    return `<div class="tbl${keyValue ? ' tbl-kv' : ''}" role="region" aria-label="${label}" tabindex="0"${pricing}><table>${t}</table></div>`;
  });
  return html;
}

const LIST_LINK_RE = /^- (\*\*)?\[([^\]]+)\]\((\/[^)]+)\)(\*\*)?(.*)$/;
const TRUST_RE = /^\*\*[^*]+\*\*( · \*\*[^*]+\*\*)+$/;

function renderMdBlock(ctx: Ctx, md: string) {
  const lines = md.split('\n').filter((l) => l.trim());
  // Trust row: **a** · **b** · **c**
  if (lines.length === 1 && TRUST_RE.test(lines[0].trim())) {
    const items = lines[0].trim().split(' · ').map((s) => s.replace(/\*\*/g, ''));
    return `<ul class="trust">${items.map((i) => `<li>${icon('check')}<span>${marked.parseInline(i)}</span></li>`).join('')}</ul>`;
  }
  // Link lists -> service cards (with description) or link chips.
  if (lines.length > 1 && lines.every((l) => LIST_LINK_RE.test(l))) {
    const parsed = lines.map((l) => l.match(LIST_LINK_RE)!);
    const withDesc = parsed.every((m) => /^:\s/.test(m[5]));
    if (withDesc) {
      const lis = parsed.map((m) => {
        const href = m[3];
        const svc = href.split('/').filter(Boolean).pop();
        const track = href.startsWith('/services/')
          ? `data-track="service_card_click" data-cta-location="service_card" data-service="${svc}" data-page-type="${ctx.page.fm.page_type}"`
          : `data-track="nav_click" data-cta-location="${ctx.loc}"`;
        return `<li class="svc-card"><a href="${esc(href)}" ${track}>${esc(m[2])}</a><p>${marked.parseInline(m[5].replace(/^:\s*/, '')) as string}</p></li>`;
      });
      return `<ul class="cards">${lis.join('')}</ul>`;
    }
    const lis = parsed.map((m) => {
      const html = postProcess(ctx, `<a href="${esc(m[3])}">${esc(m[2])}</a>`);
      return `<li>${html}${m[5] ? ' ' + (marked.parseInline(m[5].trim()) as string) : ''}</li>`;
    });
    return `<ul class="chips">${lis.join('')}</ul>`;
  }
  return postProcess(ctx, marked.parse(md) as string);
}

// ---------- page assembly ----------
type Seg =
  | { t: 'md'; md: string }
  | { t: 'marker'; mk: ReturnType<typeof parseMarker>; line: string }
  | { t: 'h1'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'faq'; q: string; md: string };

const KNOWN = new Set(['CTA', 'IMAGE', 'MAP', 'FORM', 'BREADCRUMB', 'CARD LABEL']);

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
  sections: { id: string; title: string; html: string }[];
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
      if (kind === 'CTA') push(renderCta(ctx, s.mk));
      else if (kind === 'IMAGE') {
        if (heroMode && !firstImage) firstImage = await renderImage(ctx, s.mk, true);
        else push(await renderImage(ctx, s.mk));
      } else if (kind === 'MAP') push(renderMap(ctx.page, { button: s.mk.attrs.button, loc: s.mk.attrs.cta_location }));
      else if (kind === 'CARD LABEL') {
        if (card) out.push(...wrapCard(card, level));
        card = [`<${level} class="card-title">${esc(s.mk.head)}</${level}>`];
        cardDone = false;
      } else if (kind === 'FORM') {
        push(formFromMarker(ctx, s.mk));
        if (card) cardDone = true;
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
  return [`<div class="card form-card">${parts.join('')}</div>`];
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
  const hero = await renderSegs(ctx, heroSegs, 'h2', true);
  let heroCard = hero.cardHtml;
  let heroBlocks = hero.html.filter((h) => h !== heroCard).join('\n');
  if (!heroCard && page.fm.page_type === 'service') heroCard = quickQuoteCard(page);

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
      sections.push({ id: slugify(cleanInline(g.title)), title: marked.parseInline(g.title) as string, html: r.html.join('\n') });
    }
  }
  const all = [breadcrumb, heroBlocks, heroCard, ...sections.map((s) => s.html)].join('\n');
  const leak = all.replace(/<script[\s\S]*?<\/script>/g, '').match(/\[(CTA|IMAGE|MAP|FORM|BREADCRUMB|CARD LABEL)\b[^\]]*/);
  if (leak) throw new Error(`${page.file}: raw marker leaked into HTML: ${leak[0].slice(0, 60)}`);
  const faqCount = (all.match(/<details class="faq"/g) || []).length;
  if (faqCount !== page.faqs.size) throw new Error(`${page.file}: ${page.faqs.size} FAQs in JSON-LD but ${faqCount} rendered`);
  return { breadcrumb, h1, heroBlocks, heroCard, heroImage: hero.firstImage || '', sections, faqCount };
}
