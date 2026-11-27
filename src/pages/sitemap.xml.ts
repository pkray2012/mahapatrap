import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import { getPages } from '../lib/content';
import { SITE } from '../lib/site';

const PRIORITY: Record<string, string> = { home: '1.0', service: '0.9', pricing: '0.8', locality: '0.8', contact: '0.7', about: '0.6', legal: '0.3' };

/** Last git commit date (YYYY-MM-DD) of a content file; falls back to the build date (no git, or uncommitted file). */
function lastmod(file: string, fallback: string) {
  try {
    const rel = file.replace(/^\//, '');
    const git = (args: string[]) => execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (git(['status', '--porcelain', '--', rel])) return fallback; // edited since the last commit
    const out = git(['log', '-1', '--format=%cs', '--', rel]);
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : fallback;
  } catch {
    return fallback;
  }
}

export const GET: APIRoute = () => {
  const build = new Date().toISOString().slice(0, 10);
  const urls = getPages()
    .slice()
    .sort((a, b) => (a.fm.url === '/' ? -1 : b.fm.url === '/' ? 1 : a.fm.url.localeCompare(b.fm.url)))
    .map((p) => `  <url><loc>${SITE.origin}${p.fm.url}</loc><lastmod>${lastmod(p.file, build)}</lastmod><priority>${PRIORITY[p.fm.page_type] || '0.5'}</priority></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
