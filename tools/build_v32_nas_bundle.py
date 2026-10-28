#!/usr/bin/env python3
"""Generate the isolated NAS review dataset from checked catalog records.

Review-only: never publishes photos or unsourced specs. Run media and relationship
validators before generating. No network access is required.
"""
import datetime
import json
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo
from validate_v32_media import validate as validate_media

ROOT = Path(__file__).resolve().parents[1]
HOSTS = {"Synology": "global.download.synology.com", "QNAP": "www.qnap.com"}

def select(products, relationships):
    today = datetime.datetime.now(ZoneInfo("Asia/Tokyo")).date()
    chosen = []
    keys = set()
    for product in products:
        if product.get("cat") != "server" or product.get("brand") not in HOSTS:
            continue
        # Do not surface an unsupported product as if it has official specifications.
        if not product.get("specs") or not product.get("source") or not product.get("checked"):
            continue
        key = (product["brand"], product["model"])
        if key in keys:
            raise ValueError(f"duplicate NAS identity: {key}")
        keys.add(key)
        source = urlsplit(product["source"])
        if source.scheme != "https" or source.netloc != HOSTS[product["brand"]]:
            raise ValueError(f"nonofficial NAS source: {key}")
        try:
            day = datetime.date.fromisoformat(product["checked"])
        except ValueError as exc:
            raise ValueError(f"invalid NAS source date: {key}") from exc
        if day > today:
            raise ValueError(f"future NAS source date: {key}")
        chosen.append(product)
    errors, _ = validate_media(chosen)
    if errors:
        raise ValueError("NAS media rights validation: " + "; ".join(errors))
    selected = []
    relation_keys = set()
    for relation in relationships:
        origin = (relation.get("from_brand"), relation.get("from_model"))
        target = (relation.get("to_brand"), relation.get("to_model"))
        if origin not in keys or target not in keys:
            continue
        if relation.get("relation") != "suggested_alternative":
            raise ValueError("unsupported NAS relationship type")
        ident = (origin, target)
        if ident in relation_keys:
            raise ValueError("duplicate NAS relationship")
        relation_keys.add(ident)
        if not relation.get("note") or not relation.get("source") or not relation.get("checked"):
            raise ValueError("NAS relationship lacks evidence")
        selected.append(relation)
    return {"products": chosen, "relationships": selected}

def main():
    products = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
    relationships = json.loads((ROOT / "data/relationships.json").read_text(encoding="utf-8"))
    subset = select(products, relationships)
    content = ("/* GENERATED: python tools/build_v32_nas_bundle.py; do not edit. */\n"
               "window.BASELAYER_V32_NAS_DATA = " +
               json.dumps(subset, ensure_ascii=False, separators=(",", ":")) + ";\n")
    (ROOT / "nas-catalog-v32-data.js").write_text(content, encoding="utf-8")
    print(f"PASS: isolated NAS bundle {len(subset['products'])} sourced products, "
          f"{len(subset['relationships'])} comparisons; no unsourced NAS entries.")

if __name__ == "__main__":
    main()
