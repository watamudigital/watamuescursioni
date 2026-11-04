#!/usr/bin/env python3
"""Zero-dependency static checks for the Watamu Digital demo."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = {"index.html":"it","en/index.html":"en","de/index.html":"de","fr/index.html":"fr"}
REQUIRED = ["assets/main.css","assets/main.js","assets/brand-refinement.css","robots.txt","vercel.json"]
errors = []

for name in REQUIRED:
    if not (ROOT / name).is_file():
        errors.append(f"Required file missing: {name}")

for name, language in PAGES.items():
    file = ROOT / name
    if not file.is_file():
        errors.append(f"Page missing: {name}")
        continue
    text = file.read_text(encoding="utf-8")
    if not re.search(r'<html\s+lang=["\']' + re.escape(language) + r'["\']', text, re.I):
        errors.append(f"Wrong HTML language in {name}")
    if not re.search(r"<title[^>]*>[^<]+</title>", text, re.I):
        errors.append(f"Page title missing: {name}")
    if "noindex" not in text.lower():
        errors.append(f"Demo indexing guard missing: {name}")

if (ROOT / "vercel.json").is_file():
    try:
        data = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            errors.append("vercel.json root must be an object")
    except Exception as exc:
        errors.append(f"Invalid vercel.json: {exc}")

for file in ROOT.rglob("*"):
    if not file.is_file() or ".git" in file.parts:
        continue
    if file.name in (".env", ".env.local") or file.suffix in (".pem", ".p12", ".pfx"):
        errors.append(f"Sensitive file must never be committed: {file.relative_to(ROOT)}")
    if file.suffix.lower() not in (".html", ".js", ".css", ".json", ".md", ".txt", ".yml", ".yaml", ".py", ".svg"):
        continue
    content = file.read_text(encoding="utf-8")
    patterns = [
        r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        r"\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}",
        r"\bsb_secret_[A-Za-z0-9_-]{16,}",
        r"\bsk_(?:test|live)_[A-Za-z0-9]{20,}",
    ]
    for pat in patterns:
        if re.search(pat, content):
            errors.append(f"Potential secret in {file.relative_to(ROOT)}")

if errors:
    print("\n".join("FAIL: " + x for x in errors))
    raise SystemExit(1)
print(f"PASS: {len(PAGES)} page(s), required assets, JSON, demo indexing and basic secret checks.")
