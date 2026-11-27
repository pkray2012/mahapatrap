// Inline SVG sprite (rendered once per page) + <use> helper. No icon fonts, no CDN.
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
<symbol id="i-phone" viewBox="0 0 24 24"><path ${S} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path ${S} stroke-width="3" d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g ${S}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g ${S}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g ${S}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></g></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path ${S} d="M3 6h18M3 12h18M3 18h18"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path ${S} d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path ${S} d="M5 12h14M12 5l7 7-7 7"/></symbol>
<symbol id="i-wrench" viewBox="0 0 24 24"><path ${S} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></symbol>
<symbol id="i-drop" viewBox="0 0 24 24"><path ${S} d="M12 2.7 17.7 8.3a8 8 0 1 1-11.3 0z"/></symbol>
<symbol id="i-user" viewBox="0 0 24 24"><g ${S}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><g ${S}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></g></symbol>
<symbol id="i-camera" viewBox="0 0 24 24"><g ${S}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></g></symbol>
</svg>`;

export const icon = (name: string, cls = 'ico') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
