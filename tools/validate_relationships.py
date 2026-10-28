#!/usr/bin/env python3
"""Offline evidence gate for model comparisons; no implied interchangeability."""
import datetime
import json
import pathlib
import sys
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

from catalog_quality import OFFICIAL_DOMAINS

ROOT = pathlib.Path(__file__).resolve().parents[1]
VALID = {"official_successor", "suggested_alternative"}


def validate(rows, products):
    errors = []
    models = {(p["brand"].casefold(), p["model"].casefold()) for p in products}
    seen = set()
    today = datetime.datetime.now(ZoneInfo("Asia/Tokyo")).date()
    for index, row in enumerate(rows, 1):
        required = ("from_brand", "from_model", "to_brand", "to_model",
                    "relation", "source", "checked")
        if not isinstance(row, dict) or any(
            not isinstance(row.get(key), str) or not row[key].strip()
            for key in required
        ):
            errors.append(f"relationship {index}: missing required field")
            continue
        name = f"{row['from_model']} -> {row['to_model']}"
        if row["relation"] not in VALID:
            errors.append(f"{name}: unsupported relationship type")
        key = tuple(row[field].casefold() for field in
                    ("from_brand", "from_model", "to_brand", "to_model", "relation"))
        if key in seen:
            errors.append(f"{name}: duplicate relationship")
        seen.add(key)
        for prefix in ("from", "to"):
            endpoint = (row[f"{prefix}_brand"].casefold(), row[f"{prefix}_model"].casefold())
            if endpoint not in models:
                errors.append(f"{name}: missing {prefix} product in catalog")
        parsed = urlsplit(row["source"])
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            errors.append(f"{name}: valid HTTPS evidence source required")
        try:
            checked = datetime.date.fromisoformat(row["checked"])
            if checked > today:
                errors.append(f"{name}: future evidence check date")
        except ValueError:
            errors.append(f"{name}: invalid evidence check date")
        if row["relation"] == "suggested_alternative":
            if not isinstance(row.get("note"), str) or not row["note"].strip():
                errors.append(f"{name}: suggested alternative needs a limitation note")
        if row["relation"] == "official_successor":
            if row["from_brand"].casefold() != row["to_brand"].casefold():
                errors.append(f"{name}: cross-brand official successor not allowed")
            official_hosts = OFFICIAL_DOMAINS.get(row["from_brand"], set())
            if parsed.hostname not in official_hosts:
                errors.append(f"{name}: official successor requires manufacturer-hosted evidence")
            if not isinstance(row.get("official_statement"), str) or not row["official_statement"].strip():
                errors.append(f"{name}: official successor requires an attributable manufacturer statement")
    return errors


def main():
    rows = json.loads((ROOT / "data/relationships.json").read_text(encoding="utf-8"))
    products = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
    errors = validate(rows, products)
    if errors:
        print("\n".join("ERROR " + message for message in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(rows)} relationships; endpoints, dates, and claim types pass offline checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
