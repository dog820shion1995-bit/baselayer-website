#!/usr/bin/env python3
"""Generate the small, offline relationship dataset for the optional UI evidence marker."""
import json
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
rows = json.loads((ROOT / 'data/relationships.json').read_text(encoding='utf-8'))
if not isinstance(rows, list):
    raise ValueError('relationships must be a list')
(ROOT / 'relationship-data.js').write_text(
    '/* Generated from data/relationships.json; review before publishing. */\n' +
    'window.BASELAYER_RELATIONSHIPS = ' + json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + ';\n',
    encoding='utf-8')
print(f'Generated {len(rows)} relationship records')
