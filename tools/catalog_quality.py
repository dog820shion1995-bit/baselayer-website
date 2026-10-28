#!/usr/bin/env python3
"""Offline, evidence-focused quality checks for the BASELAYER product catalog.

Never fetches vendor pages. A source link is evidence metadata, not automatic
proof of the vendor's current sales status or product interchangeability.
"""
import collections
import datetime
import json
import pathlib
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[1]
OFFICIAL_DOMAINS = {
    'ヤマハ': {'network.yamaha.com'},
    'Dell': {'www.dell.com'},
    'Sanwa Supply': {'www.sanwa.co.jp'},
    'ELECOM': {'www.elecom.co.jp'},
    'BUFFALO': {'www.buffalo.jp'},
    'EPSON': {'www.epson.jp'},
    'Synology': {'global.download.synology.com'},
}

def main():
    rows = json.loads((ROOT / 'data/products.json').read_text(encoding='utf-8'))
    relations = json.loads((ROOT / 'data/relationships.json').read_text(encoding='utf-8'))
    errors = []
    today = datetime.date.today()
    counts = collections.Counter()
    sourced = 0
    for index, item in enumerate(rows, 1):
        counts[item['cat']] += 1
        specs = item.get('specs') or {}
        if not specs:
            continue
        sourced += 1
        source = item['source']
        parsed = urllib.parse.urlsplit(source)
        allowed = OFFICIAL_DOMAINS.get(item['brand'])
        if allowed is None:
            errors.append(f"record {index} {item['brand']} {item['model']}: official domain not configured")
        elif parsed.scheme != 'https' or parsed.netloc.lower() not in allowed:
            errors.append(f"record {index} {item['model']}: source host is not approved: {parsed.netloc}")
        try:
            checked = datetime.date.fromisoformat(item['checked'])
        except (ValueError, KeyError):
            errors.append(f"record {index} {item['model']}: invalid check date")
            continue
        if checked > today:
            errors.append(f"record {index} {item['model']}: check date is in the future")
        elif (today - checked).days > 365:
            print(f"STALE_REVIEW_NEEDED {item['brand']} {item['model']} last checked {checked}")
    print(f"Catalog: {len(rows)} models; {sourced} with recorded specs and sources; {len(rows) - sourced} pending; {len(relations)} relationships")
    print('By category:', ', '.join(f'{k}:{v}' for k,v in sorted(counts.items())))
    if errors:
        print('\n'.join('ERROR ' + msg for msg in errors), file=sys.stderr)
        sys.exit(1)
    print('PASS: Catalog source domains and check dates are valid (live manufacturer data not rechecked).')

if __name__ == '__main__':
    main()
