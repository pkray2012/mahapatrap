// The only first-party script: tracking helper + delegated click listener, header menus, FAQ / pricing events,
// and the WhatsApp form builder (the Google Map is a plain lazy iframe, no script). No personal data ever goes to dataLayer.
type P = Record<string, string | undefined>;
const w = window as any;
const ALLOWED = ['cta_location', 'page_type', 'service', 'locality', 'form_id', 'lead_channel', 'link_text', 'link_domain', 'question_id', 'percent', 'ads_consent'];
const META_ID = import.meta.env.PUBLIC_META_PIXEL_ID || '';
const body = document.body.dataset;

export function pushTrackEvent(event: string, params: P = {}) {
  w.dataLayer = w.dataLayer || [];
  const safe: Record<string, string> = { event };
  // Page defaults from <body>; an event value replaces a default only when it is set (undefined never wipes one).
  const merged: P = { page_type: body.pageType, service: body.service, locality: body.locality };
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') merged[k] = v;
  for (const k of ALLOWED) if (merged[k]) safe[k] = String(merged[k]).slice(0, 100);
  w.dataLayer.push(safe);
  // Fallback tag mode (no GTM): until the direct tags have loaded, events wait in __mpQ (created by Analytics.astro)
  // and are forwarded once, when the tags load.
  if (w.__mpForward) w.__mpForward(event, safe);
  else if (Array.isArray(w.__mpQ)) w.__mpQ.push([event, safe]);
}
w.pushTrackEvent = pushTrackEvent;

const LEAD: Record<string, string> = { call_click: 'call', whatsapp_click: 'whatsapp', whatsapp_form_submit: 'whatsapp_form' };
function fire(track: string, d: DOMStringMap, extra: P = {}) {
  const p: P = { cta_location: d.ctaLocation, page_type: d.pageType, service: d.service, locality: d.locality, ...extra };
  pushTrackEvent(track, p);
  if (LEAD[track]) pushTrackEvent('generate_lead', { ...p, lead_channel: LEAD[track] });
}

// ---------- Header menus (<details>) ----------
// Desktop (>= 1024 px): Services / Areas dropdowns close on outside click, Escape and when focus leaves them.
// Mobile (< 1024 px): the hamburger panel holds both lists as an accordion. Escape closes the innermost open list
// first (focus to its summary), then the panel (focus to the hamburger). The panel closes when focus or a click
// moves outside the header, and every menu resets when the window crosses the 1024 px breakpoint.
const header = document.querySelector<HTMLElement>('.site-header');
const navMain = document.querySelector<HTMLElement>('.nav-main');
const mnav = document.querySelector<HTMLDetailsElement>('details.mnav');
const dds = document.querySelectorAll<HTMLDetailsElement>('details.dd');
const desk = matchMedia('(min-width: 1024px)');
const menus = () => document.querySelectorAll<HTMLDetailsElement>('details.dd[open],details.mnav[open]');
const closeAll = () => { dds.forEach((d) => (d.open = false)); if (mnav) mnav.open = false; };

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const a = document.activeElement;
  const dd = a?.closest<HTMLDetailsElement>('details.dd[open]');
  if (dd) { dd.open = false; dd.querySelector('summary')?.focus(); return; }
  const inHeader = Boolean(header?.contains(a));
  const wasOpen = menus().length > 0;
  closeAll();
  if (wasOpen && inHeader && !desk.matches) mnav?.querySelector('summary')?.focus();
});
dds.forEach((d) => {
  d.addEventListener('focusout', (e) => {
    const to = e.relatedTarget as Node | null;
    if (d.contains(to)) return;
    // Mobile: a tap on the next summary in the panel must not collapse this list first (that moved the tapped
    // summary away before the click landed). Collapse only on desktop, or when focus leaves the nav panel.
    if (desk.matches || (to && !navMain?.contains(to))) d.open = false;
  });
  // Mobile accordion: keep the summary that was just opened in view inside the scrolling panel.
  d.addEventListener('toggle', () => {
    if (d.open && !desk.matches) d.querySelector('summary')?.scrollIntoView({ block: 'nearest' });
  });
});
header?.addEventListener('focusout', (e) => {
  const to = e.relatedTarget as Node | null;
  if (mnav?.open && to && !header.contains(to)) closeAll();
});
mnav?.addEventListener('toggle', () => {
  mnav.querySelector('summary')?.setAttribute('aria-label', mnav.open ? 'Close menu' : 'Open menu');
  if (!mnav.open) dds.forEach((d) => (d.open = false));
});
desk.addEventListener('change', closeAll);

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  // Close open menus when clicking elsewhere (the mobile menu panel sits next to its <details> in the header).
  menus().forEach((d) => { if (!d.contains(t) && !(d.classList.contains('mnav') && t.closest?.('.nav-main'))) d.open = false; });
  const el = t.closest<HTMLElement>('[data-track]');
  if (!el || el.tagName === 'FORM') return;
  const track = el.dataset.track!;
  const extra: P = {};
  if (track === 'nav_click') extra.link_text = (el.textContent || '').trim() || el.getAttribute('aria-label') || undefined;
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

// Scroll regions (rate tables, the reviews strip) are tab stops only while they actually scroll sideways.
const regions = document.querySelectorAll<HTMLElement>('.tbl[tabindex], .revs-scroll[tabindex]');
const syncTab = () => regions.forEach((r) => {
  if (r.scrollWidth > r.clientWidth + 1) r.setAttribute('tabindex', '0');
  else r.removeAttribute('tabindex');
});
if (regions.length) {
  syncTab();
  if ('ResizeObserver' in w) { const ro = new ResizeObserver(syncTab); regions.forEach((r) => ro.observe(r)); }
  else addEventListener('resize', syncTab);
}

// ---------- WhatsApp forms ----------
// Build the message and open wa.me. Typed details go ONLY into the WhatsApp message.
// The script validates (native bubbles off): each error is shown under its field (aria-invalid + a persistent
// message tied in with aria-describedby) and focus goes to the first invalid field.
const PHONE_RE = /^[\s-]*(\+?91|0)?[\s-]*[6-9](?:[\s-]*\d){9}[\s-]*$/;
const MSG: Record<string, (v: string) => string> = {
  name: (v) => (v ? '' : 'Please enter your name.'),
  phone: (v) => (!v ? 'Please enter your mobile number.' : PHONE_RE.test(v) ? '' : 'Please enter a 10-digit mobile number, e.g. 98765 43210.'),
  area: (v) => (v ? '' : 'Please choose your area.'),
  problem: (v) => (v ? '' : 'Please tell us the problem.'),
};
const RESEND_MS = 3000;

document.querySelectorAll<HTMLFormElement>('form[data-wa-form]').forEach((f) => {
  f.noValidate = true;
  const field = (n: string) => f.querySelector<HTMLInputElement>(`[data-f="${n}"]`);
  const v = (n: string) => (field(n)?.value || '').trim();
  const check = (n: string) => {
    const el = field(n);
    if (!el) return '';
    const msg = MSG[n](n === 'phone' ? el.value : v(n));
    const err = f.querySelector<HTMLElement>(`[data-err="${n}"]`);
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    if (err) err.textContent = msg;
    return msg;
  };
  // Re-check a field the visitor is correcting (never before the first submit), so the message clears as soon as it is fixed.
  f.addEventListener('input', (e) => { const n = (e.target as HTMLElement).dataset?.f; if (n && MSG[n] && field(n)?.hasAttribute('aria-invalid')) check(n); });
  f.addEventListener('change', (e) => { const n = (e.target as HTMLElement).dataset?.f; if (n && MSG[n] && field(n)?.hasAttribute('aria-invalid')) check(n); });

  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Object.keys(MSG).filter((n) => check(n));
    if (bad.length) { field(bad[0])?.focus(); return; }
    // Double click / double tap: one WhatsApp window and one lead per form within 3 s.
    const now = Date.now();
    if (f.dataset.sent && now - Number(f.dataset.sent) < RESEND_MS) return;
    f.dataset.sent = String(now);
    const btn = f.querySelector<HTMLButtonElement>('button[type="submit"]');
    btn?.setAttribute('aria-disabled', 'true');
    setTimeout(() => btn?.removeAttribute('aria-disabled'), RESEND_MS);

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
  });
});
