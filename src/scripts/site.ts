// The only first-party script: tracking helper + delegated click listener, FAQ / pricing events,
// map facade and the WhatsApp form builder. No personal data ever goes to dataLayer.
type P = Record<string, string | undefined>;
const w = window as any;
const ALLOWED = ['cta_location', 'page_type', 'service', 'locality', 'form_id', 'lead_channel', 'link_text', 'link_domain', 'question_id', 'percent'];
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

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  // Close open dropdowns when clicking elsewhere.
  document.querySelectorAll('details.dd[open],details.mnav[open]').forEach((dd) => { if (!dd.contains(t)) dd.removeAttribute('open'); });
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

// Map facade: the Google Maps iframe loads only after a tap.
document.querySelectorAll<HTMLButtonElement>('[data-map-load]').forEach((b) =>
  b.addEventListener('click', () => {
    const canvas = b.closest('[data-map]')!.querySelector('.map-canvas')!;
    const f = document.createElement('iframe');
    f.src = b.dataset.src!;
    f.title = 'Mahapatra Plumbing Services on Google Maps';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.allowFullscreen = true;
    canvas.replaceChildren(f);
    canvas.removeAttribute('aria-hidden');
    b.remove();
    pushTrackEvent('map_interaction', { page_type: b.dataset.pageType });
  }));

// WhatsApp forms: build the message and open wa.me. Typed details go ONLY into the WhatsApp message.
document.querySelectorAll<HTMLFormElement>('form[data-wa-form]').forEach((f) =>
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement)?.value || '').trim();
    const text = (f.dataset.template || '').replace('{name}', v('name')).replace('{area}', v('area')).replace('{problem}', v('problem'));
    // Meta Advanced Matching only if the visitor ticked the box and a Meta Pixel ID is configured.
    // (Values go straight to the Meta Pixel, which hashes them; never to dataLayer / GA4 / Clarity.)
    const ads = (f.elements.namedItem('ads') as HTMLInputElement)?.checked;
    if (ads && META_ID) {
      w.__mpLoad?.();
      const digits = v('phone').replace(/\D/g, '').slice(-10);
      w.fbq?.('init', META_ID, { ph: '91' + digits, fn: v('name').split(/\s+/)[0].toLowerCase(), ct: 'bhubaneswar', st: 'od', country: 'in' });
    }
    fire('whatsapp_form_submit', f.dataset, { form_id: f.dataset.formId });
    const url = 'https://wa.me/919668875352?text=' + encodeURIComponent(text);
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else location.href = url;
  }));
