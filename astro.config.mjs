// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mahapatraplumbing.in',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // One small stylesheet, inlined into every page: no render-blocking CSS request on mobile.
    inlineStylesheets: 'always',
  },
  prefetch: false,
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Never inline the site script: it is served as one hashed /_astro/*.js file (cached for a year), which keeps
    // every HTML page inside the first ~14 KB round trip.
    build: { assetsInlineLimit: 0 },
  },
});
