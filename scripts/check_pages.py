#!/usr/bin/env python3
"""Check every page file in content/pages/ (and content/pages/areas/).

Checks per page:
  1. JSON-LD block parses.
  2. FAQPage questions/answers in JSON-LD are identical to the visible FAQs.
  3. Every WebPage `keywords` term appears in the visible text.
  4. meta_title <= 60 chars and ends with "| Mahapatra Plumbing" or
     "| Mahapatra Plumbing Services"; meta_description <= 155 chars.
  5. Every rupee figure (visible text + JSON-LD) is on docs/rate-card.md.
  6. No banned words / excluded topics in visible text or JSON-LD.
  7. Visible word count is inside the brief range for the page type and
     matches the front-matter word_count (within a small tolerance).
  8. Owner answers round 2 (27 Nov 2026): no walk-in invitations, no
     "plumbing only", no free visit "even if you don't go ahead", no AMC
     figure/free visit for commercial AMC, septic partners not mentioned,
     ContactPoint availableLanguage = or, hi, en.

Usage: python3 scripts/check_pages.py [--verbose]
Exit code 1 if any check fails.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted((ROOT / "content" / "pages").glob("*.md")) + sorted(
    (ROOT / "content" / "pages" / "areas").glob("*.md")
)
VERBOSE = "--verbose" in sys.argv

WORD_RANGES = {
    "service": (900, 1300),
    "locality": (600, 900),
    "home": (900, 1200),
    "pricing": (600, 900),
    "about": (500, 800),
    "contact": (300, 500),
    "legal": (600, 900),
}
WORD_COUNT_TOLERANCE = 5

# Rupee figures allowed by docs/rate-card.md (priceRange "₹199–₹2,999+" included).
RATE_CARD_FIGURES = {199, 349, 249, 299, 799, 499, 699, 999, 399, 2999, 300}

BANNED = [
    r"\bbest\b", r"\bno\.?\s?1\b", r"\bguaranteed?\b", r"no hidden charges",
    r"no surprises", r"\btrained\b", r"\bcertified\b", r"full service", r"24/7",
    r"24x7", r"time plan", r"in one visit", r"in one call", r"many (owners|customers)",
    r"justdial", r"madanpur", r"rasulgarh", r"baramunda", r"\bsolar\b",
    r"gas pip", r"gas line", r"aggregateRating", r"sintex", r"per-point rate of",
    # owner answers round 2
    r"plumbing only", r"plumbing work only", r"even if you (don't|do not) go ahead",
    r"(?<!no )(?<!not take )walk[- ]?ins?\b(?!, please)", r"before you visit", r"visit our (office|shop)", r"\bpartners?\b",
    r"your (tile or civil|tile|civil) (mistri|contractor)", r"free even if",
]
DRILL_OK = "We do not drill new borewells."

MARKER_RE = re.compile(r"\[(CTA|IMAGE|MAP|FORM|BREADCRUMB|CARD LABEL)[^\]]*\]")
LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]*\)")


def split_page(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise ValueError("no front matter")
    fm_raw, rest = m.group(1), m.group(2)
    fm = {}
    for line in fm_raw.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            v = v.strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            fm[k.strip()] = v
    body, _, after = rest.partition("\n## JSON-LD")
    jm = re.search(r"```json\n(.*?)\n```", after, re.S)
    json_text = jm.group(1) if jm else None
    facts = after.split("## Facts to confirm", 1)[1] if "## Facts to confirm" in after else ""
    return fm, body, json_text, facts


def clean_inline(s):
    s = LINK_RE.sub(r"\1", s)
    s = s.replace("**", "").replace("`", "")
    return s.strip()


def visible_text(body):
    body = re.sub(r"<!--.*?-->", " ", body, flags=re.S)
    body = MARKER_RE.sub(" ", body)
    body = LINK_RE.sub(r"\1", body)
    return body


def word_count(body):
    t = visible_text(body)
    t = re.sub(r"^\s*\|?[-:| ]+\|?\s*$", " ", t, flags=re.M)  # table separators
    t = re.sub(r"[#*|>`]", " ", t)
    words = [w for w in t.split() if re.search(r"[A-Za-z0-9₹]", w)]
    return len(words)


def visible_faqs(body):
    """Return {question: answer} for every H3 followed by a paragraph."""
    faqs = {}
    lines = body.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("### "):
            q = clean_inline(line[4:])
            para = []
            for nxt in lines[i + 1:]:
                if not nxt.strip():
                    if para:
                        break
                    continue
                if nxt.startswith("#") or nxt.startswith("["):
                    break
                para.append(nxt.strip())
            faqs[q] = clean_inline(" ".join(para))
    return faqs


def norm(s):
    s = s.lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9₹ ]+", " ", s)
    return " " + " ".join(s.split()) + " "


def keyword_in_text(kw, text_norm):
    words = norm(kw).split()
    if " " + " ".join(words) + " " in text_norm:
        return True
    # natural variant: "x bhubaneswar" -> "x in bhubaneswar" (any split point)
    for i in range(1, len(words)):
        for filler in ("in", "for", "near", "at"):
            v = words[:i] + [filler] + words[i:]
            if " " + " ".join(v) + " " in text_norm:
                return True
    # simple plural/singular variant on the last word
    alt = words[:-1] + [words[-1] + "s" if not words[-1].endswith("s") else words[-1][:-1]]
    return " " + " ".join(alt) + " " in text_norm


def rupee_figures(s):
    out = []
    for m in re.finditer(r"₹\s?([\d,]+)(?:\s?[–-]\s?₹?\s?([\d,]+))?", s):
        for g in m.groups():
            if g:
                out.append(int(g.replace(",", "")))
    return out


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def check_page(path):
    errors, notes = [], []
    text = path.read_text(encoding="utf-8")
    fm, body, json_text, _facts = split_page(text)
    vis = visible_text(body)
    vis_norm = norm(vis)

    # 1 JSON
    data = None
    if json_text is None:
        errors.append("no JSON-LD block")
    else:
        try:
            data = json.loads(json_text)
        except json.JSONDecodeError as e:
            errors.append(f"JSON-LD does not parse: {e}")
    nodes = list(walk(data)) if data else []

    # 2 FAQ match
    vfaqs = visible_faqs(body)
    faq_nodes = [n for n in nodes if n.get("@type") == "FAQPage"]
    n_faq = 0
    for fn in faq_nodes:
        for q in fn.get("mainEntity", []):
            n_faq += 1
            name, ans = q.get("name"), q.get("acceptedAnswer", {}).get("text")
            if name not in vfaqs:
                errors.append(f"FAQ question not visible: {name!r}")
            elif vfaqs[name] != ans:
                errors.append(f"FAQ answer differs: {name!r}")
    notes.append(f"FAQs {n_faq}")

    # 3 keywords
    for n in nodes:
        if str(n.get("@id", "")).endswith("#webpage") and n.get("keywords"):
            for kw in [k.strip() for k in n["keywords"].split(",") if k.strip()]:
                if not keyword_in_text(kw, vis_norm):
                    errors.append(f"schema keyword not in visible text: {kw!r}")
            if n.get("name") != fm.get("meta_title"):
                errors.append("WebPage name != meta_title")
            if n.get("description") != fm.get("meta_description"):
                errors.append("WebPage description != meta_description")

    # 4 title / description
    title = fm.get("meta_title", "")
    if len(title) > 60:
        errors.append(f"meta_title {len(title)} chars > 60")
    if not re.search(r"\| Mahapatra Plumbing( Services)?$", title):
        errors.append("meta_title suffix wrong")
    desc = fm.get("meta_description", "")
    if len(desc) > 155:
        errors.append(f"meta_description {len(desc)} chars > 155")
    notes.append(f"title {len(title)}c, desc {len(desc)}c")

    # 5 rupee figures
    scan = vis + "\n" + (json_text or "")
    for fig in rupee_figures(scan):
        if fig not in RATE_CARD_FIGURES:
            errors.append(f"₹{fig} not on rate card")
    for n in nodes:
        for key in ("price", "minPrice", "maxPrice"):
            if key in n:
                try:
                    v = int(float(str(n[key]).replace(",", "")))
                except ValueError:
                    continue
                if v not in RATE_CARD_FIGURES:
                    errors.append(f"Offer {key} {v} not on rate card")

    # 6 + 8 banned terms (visible + JSON)
    scan_low = scan.replace(DRILL_OK, "")
    for pat in BANNED:
        for m in re.finditer(pat, scan_low, re.I):
            ctx = scan_low[max(0, m.start() - 40): m.end() + 40].replace("\n", " ")
            errors.append(f"banned term /{pat}/: ...{ctx}...")
    # drilling may only appear as "we do not drill" / "do you drill new borewells?"
    for m in re.finditer(r"\bdrill\w*", scan_low, re.I):
        before = scan_low[max(0, m.start() - 8): m.start()].lower()
        if not (before.endswith("not ") or before.endswith("do you ")):
            ctx = scan_low[max(0, m.start() - 40): m.end() + 40].replace("\n", " ")
            errors.append(f"drilling mentioned: ...{ctx}...")
    near_me = len(re.findall(r"near me", vis.split("\n# ", 1)[-1], re.I))
    if near_me > 1:
        notes.append(f"WARN 'near me' x{near_me} in body")
    # AMC: commercial AMC must not get a figure or a free-visit quote
    for sent in re.split(r"(?<=[.!?|])\s+", vis):
        s = sent.lower()
        if ("amc" in s or "maintenance contract" in s or "maintenance plan" in s) and (
            "free site visit" in s or "quoted after" in s
        ):
            errors.append(f"AMC tied to free site visit/quote: {sent.strip()[:120]}")
        if re.search(r"(hostel|pg|office|commercial|shop|hotel|societ)", s) and "999" in s and "home" not in s:
            errors.append(f"₹999 AMC offered for non-homes: {sent.strip()[:120]}")
    # ContactPoint languages
    for n in nodes:
        if n.get("@type") == "ContactPoint":
            langs = n.get("availableLanguage")
            if sorted(langs or []) != sorted(["or", "hi", "en"]):
                errors.append(f"ContactPoint availableLanguage = {langs}")

    # 7 word count
    wc = word_count(body)
    ptype = fm.get("page_type")
    lo, hi = WORD_RANGES.get(ptype, (0, 10**6))
    if not lo <= wc <= hi:
        errors.append(f"word count {wc} outside {lo}-{hi} ({ptype})")
    try:
        fm_wc = int(fm.get("word_count", "0"))
    except ValueError:
        fm_wc = 0
    if abs(fm_wc - wc) > WORD_COUNT_TOLERANCE:
        errors.append(f"front-matter word_count {fm_wc} vs counted {wc}")
    notes.append(f"words {wc} ({ptype} {lo}-{hi})")
    return errors, notes


def main():
    total_err = 0
    for p in PAGES:
        rel = p.relative_to(ROOT)
        try:
            errors, notes = check_page(p)
        except Exception as e:  # noqa: BLE001
            errors, notes = [f"crash: {e}"], []
        errors = list(dict.fromkeys(errors))
        total_err += len(errors)
        status = "PASS" if not errors else "FAIL"
        print(f"{status}  {rel}  [{'; '.join(notes)}]")
        for e in errors:
            print(f"      - {e}")
    print(f"\n{len(PAGES)} pages, {total_err} problem(s)")
    return 1 if total_err else 0


if __name__ == "__main__":
    sys.exit(main())
