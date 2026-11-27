// The only first-party script: tracking helper + delegated click listener, FAQ / pricing events,
// and the WhatsApp form builder (the Google Map is a plain lazy iframe, no script). No personal data ever goes to dataLayer.
type P = Record<string, string | undefined>;
const w = window as any;
const ALLOWED = ['cta_location', 'page_type', 'service', 'locality', 'form_id', 'lead_channel', 'link_text', 'link_domain', 'question_id', 'percent', 'ads_consent'];
const META_ID = import.meta.env.PUBLIC_META_PIXEL_ID || '';
const body = document.body.dataset;

export function pushTrackEvent(event: string, params: P = {}) {
  w.dataLayer = w.dataLayer || [];
  const safe: Record<string, string> = { event };
  const merged: P = { page_type: body.pageType, service: body.service, locality: body.locality, ...params };
  for (const k of ALLOWED) if (merged[k]) safe[k] = String(merged[k]).slice(0, 100);
  w.dataLayer.push(safe);
  w.__mpForward?.(event, safe);
}
w.pushTrackEvent = pushTrackEvent;

const LEAD: Record<string, string> = { call_click: 'call', whatsapp_click: 'whatsapp', whatsapp_form_submit: 'whatsapp_form' };
function fire(track: string, d: DOMStringMap, extra: P = {}) {
  const p: P = { cta_location: d.ctaLocation, page_type: d.pageType, service: d.service, locality: d.locality, ...extra };
  pushTrackEvent(track, p);
  if (LEAD[track]) pushTrackEvent('generate_lead', { ...p, lead_channel: LEAD[track] });
}

// Header menus (<details>): close on outside click, Escape, and (dropdowns) when focus leaves them.
const header = document.querySelector('.site-header');
const menus = () => document.querySelectorAll<HTMLDetailsElement>('details.dd[open],details.mnav[open]');
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  menus().forEach((d) => {
    const inside = d.contains(document.activeElement) || (d.classList.contains('mnav') && header?.contains(document.activeElement));
    d.open = false;
    if (inside) d.querySelector('summary')?.focus();
  });
});
document.querySelectorAll<HTMLDetailsElement>('details.dd').forEach((d) =>
  d.addEventListener('focusout', (e) => { if (!d.contains(e.relatedTarget as Node | null)) d.open = false; }));
const mnav = document.querySelector<HTMLDetailsElement>('details.mnav');
mnav?.addEventListener('toggle', () => mnav.querySelector('summary')?.setAttribute('aria-label', mnav.open ? 'Close menu' : 'Open menu'));

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  // Close open menus when clicking elsewhere (the mobile menu panel sits next to its <details> in the header).
  menus().forEach((d) => { if (!d.contains(t) && !(d.classList.contains('mnav') && t.closest?.('.nav-main'))) d.open = false; });
  const el = t.closest<HTMLElement>('[data-track]');
  if (!el || el.tagName === 'FORM') return;
  const track = el.dataset.track!;
  const extra: P = {};
  if (track === 'nav_click') extra.link_text = (el.textContent || '').trim();
  if (track === 'outbound_click' || track === 'directions_click') { try { extra.link_domain = new URL((el as HTMLAnchorElement).href).hostname; } catch {} }
  fire(track, el.dataset, extra);
}, { capture: true });

// FAQ opened
document.querySelectorAll<HTMLDetailsElement>('details.faq').forEach((d) =>
  d.addEventListener('toggle', () => { if (d.open) pushTrackEvent('faq_open', { question_id: d.dataset.qid }); }));

// Rate table 50% visible (once per page)
const tables = document.querySelectorAll('[data-pricing]');
if (tables.length && 'IntersectionObserver' in w) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) { pushTrackEvent('pricing_view'); io.disconnect(); }
  }, { threshold: 0.5 });
  tables.forEach((t) => io.observe(t));
}

// WhatsApp forms: build the message and open wa.me. Typed details go ONLY into the WhatsApp message.
document.querySelectorAll<HTMLFormElement>('form[data-wa-form]').forEach((f) =>
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = (n: string) => f.querySelector<HTMLInputElement>(`[data-f="${n}"]`);
    const v = (n: string) => (field(n)?.value || '').trim();
    // Accepts 98765 43210, 09876543210, +91-98765-43210, 91 98765 43210 ...: keep the last 10 digits.
    const phone = v('phone').replace(/\D/g, '').slice(-10);
    // Function replacers: typed text is inserted literally ("$&" etc. in a message is not a replace pattern).
    const vals: Record<string, string> = { name: v('name'), phone, area: v('area'), problem: v('problem') };
    const text = (f.dataset.template || '').replace(/\{(name|phone|area|problem)\}/g, (_m, k: string) => vals[k]);
    // Meta Advanced Matching only if the visitor ticked the box and a Meta Pixel ID is configured.
    // (Values go straight to the Meta Pixel, which hashes them; never to dataLayer / GA4 / Clarity.)
    // The box is rendered only when PUBLIC_META_PIXEL_ID or PUBLIC_GTM_ID is set at build time.
    const box = field('ads');
    const ads = Boolean(box?.checked);
    if (ads && META_ID) {
      w.__mpLoad?.();
      w.fbq?.('init', META_ID, { ph: '91' + phone, fn: v('name').split(/\s+/)[0].toLowerCase(), ct: 'bhubaneswar', st: 'od', country: 'in' });
    }
    // ads_consent ("true"/"false", no personal data) lets GTM gate ad-matching tags on the visitor's choice.
    fire('whatsapp_form_submit', f.dataset, { form_id: f.dataset.formId, ...(box ? { ads_consent: String(ads) } : {}) });
    const url = 'https://wa.me/919668875352?text=' + encodeURIComponent(text);
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else location.href = url;
  }));
