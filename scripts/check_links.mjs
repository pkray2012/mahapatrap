#!/usr/bin/env node
// Internal link, anchor, canonical and internal-linking checker over dist/.
// Usage: node scripts/check_links.mjs [--report]   (--report prints the full Markdown report)
// Exit code 1 on any failure (broken link/anchor, non-canonical URL, canonical/sitemap/noindex issue,
// breadcrumb mismatch, missing rel="noopener" on new-tab links, nofollow on internal links).
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { load as yamlLoad } from 'js-yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://mahapatraplumbing.in';
const REPORT = process.argv.includes('--report');
const MIN_INBOUND = 3;
const GENERIC = /^(click here|read more|here|more|this page|link|learn more)$/i;

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// Duplicate content: only /x/index.html and /404.html may exist.
for (const f of htmlFiles) {
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  if (!rel.endsWith('/index.html') && rel !== '/404.html') err(`duplicate/non-directory HTML file ${rel}`);
}

const pagePath = (f) => {
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  return rel === '/404.html' ? '/404.html' : rel.replace(/index\.html$/, '');
};

// Front-matter URLs (source of truth for the 26 pages).
const contentFiles = walk(path.join(ROOT, 'content/pages')).filter((f) => f.endsWith('.md'));
const fmUrls = new Set(contentFiles.map((f) => yamlLoad(readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]).url));

// Parse all pages once.
const pages = new Map(); // path -> {root, ids}
for (const f of htmlFiles) {
  const root = parse(readFileSync(f, 'utf8'));
  const ids = new Set(root.querySelectorAll('[id]').map((e) => e.getAttribute('id')));
  pages.set(pagePath(f), { root, ids, file: f });
}

/** Is this internal URL in canonical form? Returns an error string or null. */
function nonCanonical(href) {
  if (/^https?:\/\/(www\.)?mahapatraplumbing\.in/i.test(href)) return 'absolute URL to own domain (use root-relative)';
  if (href.startsWith('//')) return 'protocol-relative URL';
  const [p] = href.split('#');
  if (p === '') return null; // same-page anchor
  if (p.includes('?')) return 'query string';
  if (/\/\//.test(p)) return 'double slash';
  if (/index\.html$/.test(p)) return '/index.html';
  const last = p.split('/').pop();
  const isAsset = last.includes('.');
  if (!isAsset && p !== p.toLowerCase()) return 'uppercase'; // hashed asset names may contain capitals
  if (!isAsset && !p.endsWith('/')) return 'missing trailing slash';
  return null;
}

const inbound = new Map([...fmUrls].map((u) => [u, []])); // target -> [{from, text}]
const anchorTargets = new Map(); // anchor text -> Set(target)
let linkCount = 0;

for (const [from, { root }] of pages) {
  const is404 = from === '/404.html';

  // ---- canonical / robots / og:url ----
  const canon = root.querySelectorAll('link[rel="canonical"]');
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const ogUrl = root.querySelector('meta[property="og:url"]')?.getAttribute('content');
  if (is404) {
    if (canon.length) err('404: must not have a canonical');
    if (!/noindex/.test(robots)) err('404: missing noindex');
  } else {
    if (canon.length !== 1) err(`${from}: ${canon.length} canonical tags`);
    const c = canon[0]?.getAttribute('href');
    if (c !== ORIGIN + from) err(`${from}: canonical ${c} != ${ORIGIN + from}`);
    if (!fmUrls.has(from)) err(`${from}: page not in content front matter`);
    if (ogUrl !== c) err(`${from}: og:url ${ogUrl} != canonical`);
    if (/noindex/.test(robots)) err(`${from}: has noindex`);
  }

  // ---- JSON-LD URLs + breadcrumbs ----
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    let ld;
    try { ld = JSON.parse(s.textContent); } catch { err(`${from}: JSON-LD does not parse`); continue; }
    const visit = (o, key) => {
      if (Array.isArray(o)) return o.forEach((x) => visit(x, key));
      if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => visit(v, k));
      if (typeof o === 'string' && ['@id', 'url', 'item'].includes(key) && o.startsWith('http') && /mahapatraplumbing/.test(o)) {
        if (!o.startsWith(ORIGIN + '/')) err(`${from}: JSON-LD ${key} not canonical origin: ${o}`);
        const p = o.slice(ORIGIN.length);
        const bad = nonCanonical(p);
        if (bad) err(`${from}: JSON-LD ${key} ${o}: ${bad}`);
        const pagePart = p.split('#')[0];
        if (!pagePart.includes('.') && !pages.has(pagePart)) err(`${from}: JSON-LD ${key} points to missing page ${o}`);
      }
      if (typeof o === 'string' && ['logo', 'image'].includes(key) && o.startsWith(ORIGIN) && !existsSync(path.join(DIST, o.slice(ORIGIN.length))))
        err(`${from}: JSON-LD ${key} file missing: ${o}`);
    };
    visit(ld);
    const graph = ld['@graph'] || [ld];
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');
    const crumbs = root.querySelectorAll('nav.crumbs li');
    if (bc) {
      const items = bc.itemListElement;
      if (crumbs.length !== items.length) err(`${from}: breadcrumb has ${crumbs.length} items, JSON-LD ${items.length}`);
      items.forEach((it, i) => {
        const li = crumbs[i];
        if (!li) return;
        if (li.text.trim() !== it.name) err(`${from}: breadcrumb label "${li.text.trim()}" != JSON-LD "${it.name}"`);
        const a = li.querySelector('a');
        const href = a ? a.getAttribute('href') : from; // last item = current page
        if (ORIGIN + href !== it.item) err(`${from}: breadcrumb link ${href} != JSON-LD ${it.item}`);
      });
    } else if (crumbs.length) err(`${from}: visible breadcrumb without BreadcrumbList`);
  }

  // ---- links and assets ----
  const main = root.querySelector('main');
  const bodyLinks = new Set(main ? main.querySelectorAll('a').filter((a) => !a.closest('nav')) : []);
  const refs = [
    ...root.querySelectorAll('a[href]').map((e) => ({ e, url: e.getAttribute('href'), kind: 'a' })),
    ...root.querySelectorAll('link[href]').map((e) => ({ e, url: e.getAttribute('href'), kind: 'link' })),
    ...root.querySelectorAll('img[src],script[src],iframe[src]').map((e) => ({ e, url: e.getAttribute('src'), kind: 'src' })),
    ...root.querySelectorAll('[srcset]').flatMap((e) => e.getAttribute('srcset').split(',').map((s) => ({ e, url: s.trim().split(/\s+/)[0], kind: 'src' }))),
  ];
  for (const { e, url, kind } of refs) {
    if (!url) { err(`${from}: empty href/src`); continue; }
    if (kind === 'link' && e.getAttribute('rel') === 'canonical') continue;
    if (/^(tel:|mailto:)/.test(url)) continue;
    if (/^https?:\/\//.test(url) && !/^https?:\/\/(www\.)?mahapatraplumbing\.in/i.test(url)) {
      if (kind === 'a' && /wa\.me|google\.com\/maps|maps\.google/.test(url)) {
        if (e.getAttribute('target') !== '_blank' || !/noopener/.test(e.getAttribute('rel') || '')) err(`${from}: ${url.slice(0, 50)} should open in new tab with rel="noopener"`);
      }
      continue;
    }
    linkCount++;
    const bad = nonCanonical(url);
    if (bad) { err(`${from}: non-canonical internal URL "${url}" (${bad})`); continue; }
    const [p, frag] = url.split('#');
    const target = p === '' ? from : p;
    if (kind === 'a' && /nofollow/.test(e.getAttribute('rel') || '')) err(`${from}: internal link ${url} is nofollow`);
    if (target.endsWith('/')) {
      if (!pages.has(target)) { err(`${from}: broken link ${url}`); continue; }
      if (frag && !pages.get(target).ids.has(frag)) err(`${from}: broken anchor ${url}`);
      if (kind === 'a' && bodyLinks.has(e) && target !== from && !is404 && inbound.has(target)) {
        const text = e.text.replace(/\s+/g, ' ').trim();
        inbound.get(target).push({ from, text });
        if (GENERIC.test(text)) warn(`${from}: generic anchor "${text}" -> ${target}`);
        const k = text.toLowerCase();
        if (!anchorTargets.has(k)) anchorTargets.set(k, new Set());
        anchorTargets.get(k).add(target);
      }
    } else if (!existsSync(path.join(DIST, decodeURIComponent(target)))) err(`${from}: missing asset ${url}`);
  }
}

// Same anchor text -> different URLs
const ambiguous = [...anchorTargets].filter(([, t]) => t.size > 1);
for (const [text, t] of ambiguous) warn(`anchor text "${text}" points to ${[...t].join(', ')}`);

// ---- sitemap ----
const sm = existsSync(path.join(DIST, 'sitemap.xml')) ? readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8') : '';
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!sm) err('sitemap.xml missing');
const expected = new Set([...fmUrls].map((u) => ORIGIN + u));
for (const l of locs) {
  if (!expected.has(l)) err(`sitemap: unexpected URL ${l}`);
  const bad = nonCanonical(l.slice(ORIGIN.length));
  if (bad) err(`sitemap: ${l} ${bad}`);
}
for (const u of expected) if (!locs.includes(u)) err(`sitemap: missing ${u}`);
if (new Set(locs).size !== locs.length) err('sitemap: duplicate URLs');
if (!existsSync(path.join(DIST, 'robots.txt'))) err('robots.txt missing');

// ---- orphan check ----
const rows = [...inbound].map(([target, list]) => {
  const sources = new Set(list.map((l) => l.from));
  return { target, sources: sources.size, links: list };
}).sort((a, b) => a.sources - b.sources || a.target.localeCompare(b.target));
const thin = rows.filter((r) => r.sources < MIN_INBOUND);
for (const r of thin) warn(`orphan risk: ${r.target} has inbound body links from only ${r.sources} page(s)`);

// ---- output ----
const pageCount = [...pages.keys()].filter((p) => p !== '/404.html').length;
console.log(`Checked ${htmlFiles.length} HTML files (${pageCount} pages + 404), ${linkCount} internal URLs, sitemap ${locs.length} URLs.`);
if (REPORT) {
  console.log('\n### Inbound body links per page (from other pages, header/footer/nav/breadcrumbs excluded)\n');
  console.log('| Page | Source pages | Body links | Anchor texts (source) |\n|---|---|---|---|');
  for (const r of rows) {
    const anchors = r.links.map((l) => `"${l.text}" (${l.from})`).join('; ');
    console.log(`| ${r.target} | ${r.sources} | ${r.links.length} | ${anchors} |`);
  }
}
for (const w of warns) console.log('WARN  ' + w);
for (const e of errors) console.log('FAIL  ' + e);
console.log(errors.length ? `\n${errors.length} problem(s)` : `\nLink check: 0 problems (links, anchors, canonical, sitemap, noindex, breadcrumbs, new-tab rel). ${thin.length} page(s) below ${MIN_INBOUND} inbound body-link sources (warning, copy decision).`);
process.exit(errors.length ? 1 : 0);
