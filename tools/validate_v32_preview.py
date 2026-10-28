#!/usr/bin/env python3
"""Static review-preview checks; does not claim browser rendering or image delivery."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "nas-catalog-v32-preview.html"

def main():
    page = HTML.read_text(encoding="utf-8")
    errors = []
    ids = re.findall(r'\bid="([^"]+)"', page)
    if len(ids) != len(set(ids)):
        errors.append("duplicate HTML element IDs")
    for required in ("search", "brand", "count", "grid", "rels"):
        if required not in ids:
            errors.append(f"missing UI element: {required}")
    if '<meta name="robots" content="noindex,nofollow">' not in page:
        errors.append("review preview must be noindex,nofollow")
    assets = re.findall(r'<script[^>]*\bsrc="([^"]+)"', page)
    if assets != ["product-data.js", "relationship-data.js"]:
        errors.append(f"unexpected data script assets: {assets!r}")
    for asset in assets:
        if not (ROOT / asset).is_file():
            errors.append(f"missing local script: {asset}")
    scripts = [s for s in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', page, re.S) if s.strip()]
    if len(scripts) != 1:
        errors.append(f"expected one inline controller, found {len(scripts)}")
    else:
        js = scripts[0]
        for required in ("rightsEvidence", "licenseUrl", "modifications",
                         "img.onerror", "placeholder()", "textContent",
                         "Special:Redirect/file/", "const boundary="):
            if required not in js:
                errors.append(f"missing rights/fallback safety marker: {required}")
        if re.search(r'\binnerHTML\b', js):
            errors.append("unsafe innerHTML use in catalog preview")
        check = subprocess.run(["node", "--check", "-"], input=js,
                               text=True, capture_output=True, check=False)
        if check.returncode:
            errors.append("inline JavaScript syntax: " + check.stderr.strip())
    if errors:
        for error in errors:
            print("ERROR " + error, file=sys.stderr)
        return 1
    print("PASS: v32 NAS review preview static structure, media gate, and Node JavaScript syntax.")
    print("NOTE: no browser rendering, remote image delivery, or license verification was performed.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
