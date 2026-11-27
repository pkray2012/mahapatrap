#!/usr/bin/env node
// Per-page size report over dist/: gzip sizes of HTML, CSS (inline <style> + linked .css) and JS
// (inline <script> excluding JSON-LD + linked .js), checked against docs/build-spec.md budgets.
// Usage: node scripts/size_report.mjs [--md]   Exit 1 if any page is over budget.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BUDGET = { html: 60 * 1024, css: 15 * 1024, js: 10 * 1024 };
const gz = (s) => gzipSync(Buffer.from(s), { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1);

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)]));
const rows = [];
for (const f of walk(DIST).filter((x) => x.endsWith('.html')).sort()) {
  const html = readFileSync(f, 'utf8');
  const url = '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');
  let css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
  for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) css += readFileSync(path.join(DIST, m[1]), 'utf8');
  let js = [...html.matchAll(/<script(?![^>]*application\/ld\+json)(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
  for (const m of html.matchAll(/<script[^>]+src="(\/[^"]+)"/g)) if (existsSync(path.join(DIST, m[1]))) js += readFileSync(path.join(DIST, m[1]), 'utf8');
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
  const r = { url, htmlRaw: html.length, html: gz(html), css: gz(css), js: js ? gz(js) : 0, ld: ld ? gz(ld) : 0 };
  r.over = ['html', 'css', 'js'].filter((k) => r[k] > BUDGET[k]);
  rows.push(r);
}
const md = process.argv.includes('--md');
const line = md
  ? (r) => `| ${r.url} | ${kb(r.htmlRaw)} | ${kb(r.html)} | ${kb(r.css)} | ${kb(r.js)} | ${kb(r.ld)} | ${r.over.length ? 'OVER: ' + r.over.join(', ') : 'OK'} |`
  : (r) => `${r.url.padEnd(46)} html ${kb(r.htmlRaw).padStart(6)} KB raw / ${kb(r.html).padStart(5)} KB gz | css ${kb(r.css).padStart(5)} KB gz | js ${kb(r.js).padStart(4)} KB gz | json-ld ${kb(r.ld).padStart(4)} KB gz | ${r.over.length ? 'OVER ' + r.over.join(',') : 'ok'}`;
if (md) console.log('| Page | HTML raw KB | HTML gzip KB (incl. inline CSS/JS/JSON-LD) | CSS gzip KB | JS gzip KB | JSON-LD gzip KB | Budget |\n|---|---|---|---|---|---|---|');
rows.forEach((r) => console.log(line(r)));
const max = (k) => Math.max(...rows.map((r) => r[k]));
console.log(`${md ? '\n' : ''}Max: HTML ${kb(max('html'))} KB gz (budget 60), CSS ${kb(max('css'))} KB gz (budget 15), JS ${kb(max('js'))} KB gz (budget 10).`);
const over = rows.filter((r) => r.over.length);
console.log(over.length ? `${over.length} page(s) over budget` : 'All pages within budget.');
process.exit(over.length ? 1 : 0);
