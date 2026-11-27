import type { APIRoute } from 'astro';
import { getPages } from '../lib/content';
import { SITE } from '../lib/site';

const PRIORITY: Record<string, string> = { home: '1.0', service: '0.9', pricing: '0.8', locality: '0.8', contact: '0.7', about: '0.6', legal: '0.3' };

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = getPages()
    .map((p) => p.fm)
    .sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)))
    .map((fm) => `  <url><loc>${SITE.origin}${fm.url}</loc><lastmod>${lastmod}</lastmod><priority>${PRIORITY[fm.page_type] || '0.5'}</priority></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
