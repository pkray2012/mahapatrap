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
  vite: { plugins: [tailwindcss()] },
});
