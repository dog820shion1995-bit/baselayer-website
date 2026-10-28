#!/usr/bin/env python3
"""Offline v32 media gate. Metadata is evidence, not a substitute for legal review."""
import datetime
import json
import pathlib
import re
import sys
from urllib.parse import unquote, urlsplit
from zoneinfo import ZoneInfo

ROOT = pathlib.Path(__file__).resolve().parents[1]
LICENSES = {
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
}
def https(value):
    return isinstance(value, str) and urlsplit(value).scheme == "https" and bool(urlsplit(value).netloc)

def validate(items):
    errors = []
    seen = set()
    permitted = 0
    used_photo_files = set()
    for p in items:
        errors_before = len(errors)
        name = f"{p.get('brand', '?')} {p.get('model', '?')}"
        key = (p.get("brand", "").casefold(), re.sub(r"[^a-z0-9]", "", p.get("model", "").casefold()))
        if key in seen:
            errors.append(f"{name}: duplicate brand/model")
        seen.add(key)
        im = p.get("image")
        if im is None:
            continue
        if not isinstance(im, dict) or im.get("usage") != "permitted":
            errors.append(f"{name}: unapproved image metadata")
            continue
        if im.get("brand") != p.get("brand") or im.get("model") != p.get("model"):
            errors.append(f"{name}: image model identity mismatch")
        for field in ("url", "source", "rightsEvidence", "licenseUrl"):
            if not https(im.get(field)):
                errors.append(f"{name}: invalid HTTPS {field}")
        license_name = im.get("license")
        if license_name not in LICENSES or im.get("licenseUrl") != LICENSES.get(license_name):
            errors.append(f"{name}: unrecognized license or license URL")
        if not isinstance(im.get("creator"), str) or not im["creator"].strip():
            errors.append(f"{name}: missing photo creator")
        try:
            day = datetime.date.fromisoformat(im["checked"])
            if day > datetime.datetime.now(ZoneInfo("Asia/Tokyo")).date():
                errors.append(f"{name}: future image review date")
        except (KeyError, ValueError, TypeError):
            errors.append(f"{name}: invalid image review date")
        if https(im.get("source")) and https(im.get("url")):
            source = urlsplit(im["source"])
            photo = urlsplit(im["url"])
            if source.netloc != "commons.wikimedia.org" or photo.netloc != "commons.wikimedia.org":
                errors.append(f"{name}: non-Commons photo needs a separate permission review")
            else:
                if not source.path.startswith("/wiki/File:") or not photo.path.startswith("/wiki/Special:Redirect/file/"):
                    errors.append(f"{name}: photo links must use Commons file and redirect paths")
                source_file = unquote(source.path.split("File:")[-1]).casefold()
                photo_file = unquote(photo.path.split("/file/")[-1]).casefold()
                if not source_file or source_file != photo_file:
                    errors.append(f"{name}: photo URL differs from license file page")
                if im.get("rightsEvidence") != im.get("source"):
                    errors.append(f"{name}: Commons rights evidence must point to the same file page")
                stem = source_file.rsplit(".", 1)[0]
                model = str(p.get("model", "")).casefold()
                if not model or not re.search(r"(?<![a-z0-9+])" + re.escape(model) + r"(?![a-z0-9+])", stem):
                    errors.append(f"{name}: image filename does not identify the exact product model")
                if source_file in used_photo_files:
                    errors.append(f"{name}: photo file reused for multiple catalog records; manual review required")
                used_photo_files.add(source_file)
        if len(errors) == errors_before:
            permitted += 1
    return errors, permitted

def main():
    items = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
    errors, permitted = validate(items)
    if errors:
        print("\n".join("ERROR: " + e for e in errors), file=sys.stderr)
        return 1
    print(f"v32 media PASS: {len(items)} products, {permitted} permitted exact-model photos; all others use category fallbacks.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
