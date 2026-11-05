#!/usr/bin/env python3
"""Offline SEO integrity checks for Watamu Escursioni.

No non-standard dependencies or credentials. The noindex gate remains on until launch.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
from html import unescape
import json
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
PAGES = {((("" if lang == "it" else lang + "/") + path)): lang
         for lang in ("it", "en", "de", "fr") for path in CORE}
PAGES.update({path: "it" for path in GUIDES})
errors = []


def fail(message: str) -> None:
    errors.append(message)


def local_file(path: str) -> Path:
    clean = unquote(path).split("?", 1)[0].strip("/")
    if not clean:
        return ROOT / "index.html"
    p = ROOT / clean
    return p if p.suffix else p / "index.html"


class Inspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.canonicals = []
        self.links = []
        self.robots = ""
        self.description = ""
        self.h1s = 0
        self.title = ""
        self.structured = []
        self.in_title = False
        self.in_json = False

    def handle_starttag(self, tag, attrs):
        info = dict(attrs)
        if tag == "html":
            self.lang = info.get("lang")
        elif tag == "h1":
            self.h1s += 1
        elif tag == "link" and "canonical" in info.get("rel", "").split():
            self.canonicals.append(info.get("href"))
        elif tag == "a":
            self.links.append(info.get("href"))
        elif tag == "meta":
            if info.get("name", "").lower() == "robots":
                self.robots = info.get("content", "").lower()
            if info.get("name", "").lower() == "description":
                self.description = info.get("content", "")
        elif tag == "title":
            self.in_title = True
        elif tag == "script" and info.get("type") == "application/ld+json":
            self.in_json = True
            self.structured.append("")

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_json:
            self.structured[-1] += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "script":
            self.in_json = False


sitemap = ROOT / "sitemap.xml"
if not sitemap.is_file():
    fail("Missing sitemap.xml")
else:
    try:
        root = ET.parse(sitemap)
        ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
        listed = [node.text for node in root.findall(".//" + ns + "loc")]
        expected = {ORIGIN + "/" + path for path in PAGES}
        if len(set(listed)) != len(listed):
            fail("Duplicate URLs in sitemap")
        if set(listed) != expected:
            fail("Sitemap mismatch: missing=" + str(sorted(expected-set(listed))) +
                 "; extra=" + str(sorted(set(listed)-expected)))
    except (ET.ParseError, OSError) as exc:
        fail("Invalid sitemap XML: " + str(exc))

titles = {}
for path, language in PAGES.items():
    file = local_file(path)
    if not file.is_file():
        fail("Missing canonical page: " + path)
        continue
    page = Inspector()
    page.feed(file.read_text(encoding="utf-8"))
    url = ORIGIN + "/" + path
    if page.lang != language:
        fail(path + ": incorrect lang")
    if page.canonicals != [url]:
        fail(path + ": missing or incorrect self-canonical " + str(page.canonicals))
    if not page.title.strip():
        fail(path + ": missing title")
    if path in GUIDES:
        if page.title in titles:
            fail(path + ": repeated title also found at " + titles[page.title])
        titles[page.title] = path
        if page.h1s != 1:
            fail(path + ": expected one H1")
        if "noindex" not in page.robots:
            fail(path + ": demo noindex removed unexpectedly")
        if not page.description:
            fail(path + ": missing meta description")
        if len(page.structured) != 1:
            fail(path + ": expected one JSON-LD block")
        else:
            try:
                data = json.loads(page.structured[0])
                if data["@graph"][0]["url"] != url:
                    fail(path + ": JSON-LD URL mismatch")
            except (ValueError, KeyError, IndexError, TypeError) as exc:
                fail(path + ": invalid JSON-LD: " + str(exc))

        for href in page.links:
            if not href or not href.startswith("/"):
                continue
            target = urlparse(unescape(href)).path
            if not local_file(target).is_file():
                fail(path + ": broken internal link " + href)

hub = (ROOT / "escursioni-watamu/index.html").read_text(encoding="utf-8")
for path in GUIDES:
    if 'href="/' + path + '"' not in hub:
        fail("Guide not linked from activity hub: " + path)

robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
if "Disallow: /" not in robots:
    fail("Demo robots guard removed without launch review")

if errors:
    print("SEO checks FAILED:")
    for item in errors:
        print(" - " + item)
    sys.exit(1)

print(f"SEO checks PASSED: {len(PAGES)} URLs, {len(GUIDES)} editorial guides, all links and sitemap.")
