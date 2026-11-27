// Inline SVG sprite (rendered once per page) + <use> helper. No icon fonts, no CDN, no icon library.
// Line icons: 24 px grid, 2 px stroke (1.75 px for the detailed service icons), round caps and joins.
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const L = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
const sym = (id: string, body: string, a = L) => `<symbol id="i-${id}" viewBox="0 0 24 24"><g ${a}>${body}</g></symbol>`;

// One icon per service page (keyed by URL slug), used on service cards and service chips.
export const SERVICE_ICONS: Record<string, string> = {
  'leak-and-blockage-repair': 'drop',
  'bathroom-and-kitchen-fittings': 'tap',
  'geyser-installation-and-repair': 'geyser',
  'water-tank-and-motor-repair': 'pump',
  'water-tank-cleaning': 'tank-clean',
  'borewell-pump-and-pipe-repair': 'borewell',
  'pipeline-and-concealed-plumbing': 'elbow',
  'drain-cleaning-and-sewer-jetting': 'drain',
  'septic-tank-cleaning': 'septic',
  'bathroom-plumbing-renovation': 'bath',
  'new-bathroom-and-house-plumbing': 'house-plus',
  'sewerage-and-drainage-works': 'manhole',
  'commercial-plumbing': 'building',
};
/** Icon for an internal URL: service icon, pin for area pages, core-page icons otherwise. */
export function iconForHref(href: string): string {
  const parts = href.split('/').filter(Boolean);
  if (parts[0] === 'services') return SERVICE_ICONS[parts[1]] || 'wrench';
  if (parts[0] === 'areas') return 'pin';
  return ({ pricing: 'rupee', about: 'user', contact: 'phone', 'privacy-policy': 'shield' } as Record<string, string>)[parts[0] || ''] || 'home';
}

/** Icon for a trust-strip item, picked from its text. */
export function trustIcon(text: string): string {
  if (/★|review/i.test(text)) return 'star';
  if (/warranty/i.test(text)) return 'shield';
  if (/estimate/i.test(text)) return 'file';
  if (/\d\s?(AM|PM)/.test(text)) return 'clock';
  if (/call|whatsapp/i.test(text)) return 'phone';
  if (/base:|chandrasekharpur/i.test(text)) return 'pin';
  if (/site visit/i.test(text)) return 'home';
  return 'check-circle';
}

export const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
<symbol id="i-phone" viewBox="0 0 24 24"><path ${S} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path ${S} stroke-width="3" d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-check-circle" viewBox="0 0 24 24"><g ${S}><circle cx="12" cy="12" r="9.5"/><path d="m8 12.3 2.7 2.7L16.2 9.5"/></g></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g ${S}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g ${S}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g ${S}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></g></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path ${S} d="M3 6h18M3 12h18M3 18h18"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path ${S} d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path ${S} d="M5 12h14M12 5l7 7-7 7"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path ${S} d="M18 6 6 18M6 6l12 12"/></symbol>
${sym('rupee', '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3c6.7 0 6.7-10 0-10"/>', S)}
${sym('home', '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h5v-6h4v6h5V9"/>', S)}
${sym('shield', '<path d="M12 21.5s8-3.5 8-10V5.5L12 2.5l-8 3v6c0 6.5 8 10 8 10z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>', S)}
${sym('user', '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', S)}
${sym('chat', '<path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.5-4.7A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>', S)}
${sym('file', '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5"/>', S)}
${sym('wrench', '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>', S)}
${sym('drop', '<path d="M12 2.8s6.5 6.6 6.5 11.7a6.5 6.5 0 0 1-13 0C5.5 9.4 12 2.8 12 2.8z"/><path d="M9 15a3 3 0 0 0 3 3"/>')}
${sym('tap', '<path d="M2.5 9.5H14a4 4 0 0 1 4 4v1.5h-4v-1.5H2.5z"/><path d="M8 9.5V6M5 6h6"/><path d="M16 18.5v.5M16 21.5v.01"/>')}
${sym('geyser', '<rect x="6" y="2.5" width="12" height="16" rx="3"/><circle cx="12" cy="8" r="2"/><path d="M9.5 13.5h5M9.5 18.5v3M14.5 18.5v3"/>')}
${sym('pump', '<rect x="2.5" y="9" width="9" height="8" rx="1.5"/><path d="M5.5 9v8M8.5 9v8M11.5 13h2"/><circle cx="17.5" cy="13" r="3.5"/><path d="M17.5 9.5V5h4M2.5 20.5h19"/>')}
${sym('tank-clean', '<path d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3v12c0 1.7-3.1 3-7 3s-7-1.3-7-3z"/><path d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3"/><path d="M12 11.5v5M9.5 14h5"/>')}
${sym('borewell', '<rect x="7.5" y="2.5" width="9" height="4.5" rx="1"/><path d="M2 9.5h7M15 9.5h7M9 7v14.5h6V7"/><path d="M12 11v6.5M10.25 15.75 12 17.5l1.75-1.75"/>')}
${sym('elbow', '<path d="M3 5h9a7 7 0 0 1 7 7v9M3 11h9a1 1 0 0 1 1 1v9M3 5v6M13 21h6M8 5v6M13 16h6"/>')}
${sym('drain', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 7.5v9M12 7.5v9M16 7.5v9"/>')}
${sym('septic', '<path d="M2 8h7.5M14.5 8H22M9.5 4.5v6M14.5 4.5v6M8.5 4.5h7"/><rect x="3.5" y="10.5" width="17" height="10" rx="2"/><path d="M6.5 15.5c1.8-1.2 3.7 1.2 5.5 0s3.7-1.2 5.5 0"/>')}
${sym('bath', '<path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="m7 19-1 2.5M17 19l1 2.5M6 12V5.5a2.5 2.5 0 0 1 5 0V6"/>')}
${sym('house-plus', '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11.5h14V9"/><path d="M12 11v6M9 14h6"/>')}
${sym('manhole', '<circle cx="12" cy="12" r="9"/><path d="M7 9.5h10M7 14.5h10M9.5 7v10M14.5 7v10"/>')}
${sym('building', '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h3a2 2 0 0 1 2 2v10M2 21h20"/><path d="M8 7.5h.01M12 7.5h.01M8 11.5h.01M12 11.5h.01M8 15.5h.01M12 15.5h.01" stroke-width="2.5"/>')}
</svg>`;

export const icon = (name: string, cls = 'ico') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
