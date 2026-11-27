// Generates brand assets from brand/final/ with sharp (runs before `astro dev` / `astro build`).
//  - src/assets/generated/logo-header.png  trimmed full-colour horizontal logo (Astro <Picture> makes AVIF/WebP)
//  - src/assets/generated/logo-footer.png  white "on dark" mark for the navy footer
//  - public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
//  - public/images/logo-horizontal.png     (schema "logo")
//  - public/images/og-default.webp + og-default.png (1200x630 social card, schema "image")
import sharp from 'sharp';
import { mkdir, copyFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b = (f) => path.join(root, 'brand/final', f);
const out = (f) => path.join(root, f);
await mkdir(out('src/assets/generated'), { recursive: true });
await mkdir(out('public/images'), { recursive: true });

// Header logo: crop to content, 2x of the 54 px desktop display height (44 px on phones) => 112 px tall source.
const trimmed = await sharp(b('mahapatra-logo-horizontal-colour@2x.png')).trim({ threshold: 1 }).toBuffer();
await sharp(trimmed).resize({ height: 112 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out('src/assets/generated/logo-header.png'));

// Schema logo (bigger, PNG, white background so it reads anywhere).
await sharp(trimmed).resize({ height: 240 }).flatten({ background: '#ffffff' }).extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' })
  .png({ compressionLevel: 9, palette: true }).toFile(out('public/images/logo-horizontal.png'));

// Footer mark (white + colour on navy), 2x of 56 px.
await sharp(b('mahapatra-logo-on-dark.png')).trim({ threshold: 1 }).resize({ height: 112 }).png({ palette: true }).toFile(out('src/assets/generated/logo-footer.png'));

// Favicons / app icons.
await copyFile(b('mahapatra-icon-colour.svg'), out('public/favicon.svg'));
await sharp(b('icon-512.png')).resize(32, 32).png({ palette: true }).toFile(out('public/favicon-32.png'));
await sharp(b('icon-512.png')).resize(180, 180).flatten({ background: '#ffffff' }).png({ palette: true }).toFile(out('public/apple-touch-icon.png'));
await sharp(b('icon-512.png')).resize(192, 192).png({ palette: true }).toFile(out('public/icon-192.png'));
await sharp(b('icon-512.png')).png({ palette: true }).toFile(out('public/icon-512.png'));

// OG card 1200x630: white card, logo centred, navy band with orange line at the bottom (no text rendering, no fonts needed).
const ogLogo = await sharp(trimmed).resize({ width: 980 }).toBuffer();
const meta = await sharp(ogLogo).metadata();
const band = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#ffffff"/><rect y="0" width="1200" height="14" fill="#0A7CC4"/>
  <rect y="540" width="1200" height="90" fill="#092B55"/><rect y="532" width="1200" height="8" fill="#FF8A00"/></svg>`);
const og = sharp(band).composite([{ input: ogLogo, top: Math.round((540 - meta.height) / 2), left: Math.round((1200 - meta.width) / 2) }]);
const ogBuf = await og.png().toBuffer();
await sharp(ogBuf).webp({ quality: 82 }).toFile(out('public/images/og-default.webp'));
await sharp(ogBuf).png({ palette: true }).toFile(out('public/images/og-default.png'));

const s = async (f) => `${f} ${(await stat(out(f))).size} B`;
console.log('[assets]', (await Promise.all(['src/assets/generated/logo-header.png', 'src/assets/generated/logo-footer.png', 'public/images/og-default.webp', 'public/icon-512.png'].map(s))).join(' | '));
