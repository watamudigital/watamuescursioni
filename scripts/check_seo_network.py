#!/usr/bin/env python3
"""Check Watamu Escursioni SEO architecture before a release.

No network, API credentials or non-standard dependencies required.
These checks intentionally keep the existing demo noindex/robots block.
"""
from __future__ import annotations

from html import unescape
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://watamuescursioni.com"
CORE = [
    "", "escursioni-watamu/", "safari-blu-watamu/",
    "safari-tsavo-east-da-watamu/", "snorkeling-watamu/",
    "mida-creek/", "marafa-hells-kitchen/", "rovine-gede/"
]
GUIDES = [
    "cosa-fare-a-watamu/", "prezzi-escursioni-watamu/",
    "safari-da-watamu/", "safari-tsavo-est-uno-o-due-giorni/",
    "safari-blu-o-snorkeling-watamu/", "maree-watamu/",
    "watamu-con-bambini/", "watamu-in-7-giorni/"
]
LANGUAGES = ["it", "en", "de", "fr"]
PAGES = {(("" if lang == "it" else lang + "/") + path): lang
         for lang in LANGUAGES for path in CORE}
PAGES.update({path: "it" for path in GUIDES})
failures = []


def fail(message: str) -> None:
    failures.append(message)


def attr(tag: str, name: str) -> str | None:
    match = re.search(r'\\b' + re.escape(name) + r'\\s*=\\s*(["\\'])(.*?)\\1', tag, re.I | re.S)
    return unescape(match.group(2)) if match else None


def path_to_file(path: str) -> Path:
    path = path.strip("/")
    if not path:
        return ROOT / "index.html"
    target = ROOT / path
    if target.suffix:
        return target
    return target / "index.html"


def tags(text: str, name: str) -> list[str]:
    return re.findall(r"<" + re.escape(name) + r"\\b[^>]*>", text, re.I | re.S)


sitemap_path = ROOT / "sitemap.xml"
if not sitemap_path.is_file():
    fail("Missing sitemap.xml")
else:
    try:
        doc = ET.parse(sitemap_path)
        namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
        locations = [item.text for item in doc.findall(".//" + namespace + "loc")]
        expected = {ORIGIN + "/" + path for path in PAGES}
        if len(locations) != len(set(locations)):
            fail("Duplicate URLs in sitemap")
        extra = set(locations) - expected
        missing = expected - set(locations)
        if extra:
            fail("Unexpected sitemap URLs: " + ", ".join(sorted(extra)))
        if missing:
            fail("Missing sitemap URLs: " + ", ".join(sorted(missing)))
    except (ET.ParseError, OSError) as exc:
        fail("Unparseable sitemap: " + str(exc))

titles = {}
for path, language in PAGES.items():
    file = path_to_file(path)
    if not file.is_file():
        fail("Missing page " + path)
        continue
    text = file.read_text(encoding="utf-8")
    html_tag = next(iter(tags(text, "html")), "")
    if attr(html_tag, "lang") != language:
        fail(f"{path}: expected lang {language}")
    title_match = re.search(r"<title>\\s*(.*?)\\s*</title>", text, re.I | re.S)
    if not title_match or not title_match.group(1):
        fail(f"{path}: missing title")
    elif path in GUIDES:
        title = unescape(title_match.group(1))
        if title in titles:
            fail(f"{path}: duplicate guide title with {titles[title]}")
        titles[title] = path

    canonicals = [attr(tag, "href") for tag in tags(text, "link")
                  if (attr(tag, "rel") or "").lower() == "canonical"]
    expected_url = ORIGIN + "/" + path
    if canonicals != [expected_url]:
        fail(f"{path}: expected one self-canonical {expected_url}, got {canonicals}")

    if path in GUIDES:
        h1_count = len(re.findall(r"<h1\\b", text, re.I))
        if h1_count != 1:
            fail(f"{path}: expected one H1, found {h1_count}")
        if not re.search(r"<meta\\b[^>]*name=['\\\"]robots['\\\"][^>]*noindex", text, re.I):
            fail(f"{path}: missing prerelease noindex")
        if not re.search(r"<meta\\b[^>]*name=['\\\"]description['\\\"][^>]*content=", text, re.I):
            fail(f"{path}: missing meta description")
        schema_matches = re.findall(r'<script type="application/ld\\+json">(.*?)</script>', text, re.S | re.I)
        if len(schema_matches) != 1:
            fail(f"{path}: expected one JSON-LD block")
        else:
            try:
                data = json.loads(schema_matches[0])
                if data["@graph"][0]["url"] != expected_url:
                    fail(f"{path}: structured-data URL mismatch")
            except (ValueError, KeyError, IndexError, TypeError) as exc:
                fail(f"{path}: invalid structured data: {exc}")

    # Avoid orphaned/incorrect internal destinations in editorial guides.
    if path in GUIDES:
        for tag in tags(text, "a"):
            href = attr(tag, "href")
            if not href:
                continue
            parsed = urlparse(href)
            if parsed.scheme or parsed.netloc:
                continue
            if not href.startswith("/"):
                continue
            pathname = unquote(parsed.path)
            if not path_to_file(pathname).is_file():
                fail(f"{path}: broken internal link {href}")

# A crawler must discover all eight guides from the activity hub.
hub = (ROOT / "escursioni-watamu/index.html").read_text(encoding="utf-8")
for path in GUIDES:
    if 'href="/' + path + '"' not in hub:
        fail("Guide not linked from /escursioni-watamu/: " + path)

robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
if "Disallow: /" not in robots:
    fail("Prerelease robots guard was removed without launch checklist")

if failures:
    print("SEO network checks FAILED:")
    for entry in failures:
        print(" - " + entry)
    sys.exit(1)
print(f"SEO network checks passed: {len(PAGES)} canonical URLs, {len(GUIDES)} guides, sitemap and internal links.")
