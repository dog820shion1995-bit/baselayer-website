#!/usr/bin/env python3
"""Validate explicit manufacturer successor claims and non-official alternatives."""
import json,pathlib,sys,urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
P=ROOT/'data/relationships.json'
VALID={'official_successor','suggested_alternative'}
def main():
    rows=json.loads(P.read_text(encoding='utf-8'))
    products=json.loads((ROOT/'data/products.json').read_text(encoding='utf-8'))
    models={(p['brand'].casefold(),p['model'].casefold()) for p in products}
    keys=set()
    for row in rows:
        for k in ('from_brand','from_model','to_brand','to_model','relation','source','checked'):
            if not isinstance(row.get(k),str) or not row[k].strip():raise ValueError(f'missing {k}')
        if row['relation'] not in VALID:raise ValueError('bad relation')
        if urllib.parse.urlsplit(row['source']).scheme!='https':raise ValueError('HTTPS source required')
        if row['relation']=='official_successor' and row['from_brand'].casefold()!=row['to_brand'].casefold():raise ValueError('cross-brand official successor needs manual review')
        key=tuple(row[k].casefold() for k in ('from_brand','from_model','to_brand','to_model','relation'))
        if key in keys:raise ValueError('duplicate relationship')
        keys.add(key)
        if (row['from_brand'].casefold(),row['from_model'].casefold()) not in models:print('NOTE source model not in catalog:',row['from_model'])
        if (row['to_brand'].casefold(),row['to_model'].casefold()) not in models:print('NOTE target model not in catalog:',row['to_model'])
    print('Validated',len(rows),'relationships')
if __name__=='__main__':
    try:main()
    except ValueError as e:print('ERROR',e,file=sys.stderr);sys.exit(1)
