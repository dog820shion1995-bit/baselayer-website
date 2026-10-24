#!/usr/bin/env python3
"""Discover candidate manufacturer pages from permitted public sitemaps; never publish specs."""
import argparse
import datetime
import gzip
import json
import pathlib
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET
from collections import deque

ROOT = pathlib.Path(__file__).resolve().parents[1]
UA = 'BASELAYERCatalogResearch/0.2 (daily low-volume public sitemap reader)'
CONFIG = [
    ('Yamaha', 'https://network.yamaha.com', r'/(?:products?|solutions?)/'),
    ('Dell', 'https://www.dell.com', r'/(?:[a-z]{2}-[a-z]{2}/)?(?:shop|support|.*(?:monitor|network|printer|server|storage))'),
    ('ELECOM', 'https://www.elecom.co.jp', r'/(?:products?|category|product)/'),
]
LIMIT_BYTES = 4_000_000
TIMEOUT = 12


def same_origin(url, base):
    a, b = urllib.parse.urlsplit(url), urllib.parse.urlsplit(base)
    return a.scheme == 'https' and a.netloc.lower() == b.netloc.lower()


def robots_for(base):
    url = base + '/robots.txt'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
            if response.status != 200:
                raise ValueError('robots.txt status ' + str(response.status))
            content = response.read(512_001)
            if len(content) > 512_000:
                raise ValueError('robots.txt too large')
            lines = content.decode('utf-8-sig', errors='replace').splitlines()
    except Exception as exc:
        print('ROBOTS_UNAVAILABLE', base, type(exc).__name__, str(exc)[:120])
        return None, []
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(lines)
    sitemaps = []
    for line in lines:
        match = re.match(r'^\s*Sitemap\s*:\s*(\S+)', line, re.I)
        if match and same_origin(match.group(1), base):
            sitemaps.append(match.group(1))
    return rp, list(dict.fromkeys(sitemaps))


def fetch_xml(url, base, rp):
    if not same_origin(url, base) or not rp.can_fetch(UA, url):
        print('SKIP_DISALLOWED', url)
        return None
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/xml,text/xml,*/*'})
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            if response.status != 200 or not same_origin(response.url, base):
                print('SKIP_REDIRECT_OR_STATUS', url)
                return None
            data = response.read(LIMIT_BYTES + 1)
            if len(data) > LIMIT_BYTES:
                print('SKIP_TOO_LARGE', url)
                return None
            if url.lower().endswith('.gz') or data[:2] == b'\x1f\x8b':
                data = gzip.decompress(data)
                if len(data) > LIMIT_BYTES:
                    print('SKIP_DECOMPRESSED_TOO_LARGE', url)
                    return None
            return data
    except Exception as exc:
        print('SKIP', url, type(exc).__name__, str(exc)[:120])
        return None


def crawl(brand, base, pattern, max_sitemaps, max_urls):
    rp, declared = robots_for(base)
    if rp is None:
        return []
    # Prefer sitemap URLs explicitly declared by the site; fall back to common names.
    seeds = declared or [base + '/sitemap.xml', base + '/sitemap_index.xml']
    queue = deque(seeds)
    seen = set()
    found = {}
    parsed = 0
    while queue and len(seen) < max_sitemaps and len(found) < max_urls:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        raw = fetch_xml(url, base, rp)
        time.sleep(0.25)
        if not raw:
            continue
        try:
            root = ET.fromstring(raw)
        except ET.ParseError:
            print('SKIP_INVALID_XML', url)
            continue
        parsed += 1
        tag = root.tag.rsplit('}', 1)[-1].lower()
        locs = [el.text.strip() for el in root.iter()
                if el.tag.rsplit('}', 1)[-1].lower() == 'loc' and el.text]
        if tag == 'sitemapindex':
            for loc in locs:
                if same_origin(loc, base) and loc not in seen and len(queue) < max_sitemaps * 5:
                    queue.append(loc)
        elif tag == 'urlset':
            for loc in locs:
                if (same_origin(loc, base) and rp.can_fetch(UA, loc)
                        and re.search(pattern, urllib.parse.urlsplit(loc).path, re.I)):
                    found[loc] = {'brand': brand, 'url': loc, 'status': 'discovered_unverified'}
                    if len(found) >= max_urls:
                        break
        else:
            print('SKIP_UNEXPECTED_XML', tag, url)
    print(brand, 'sitemaps_checked', len(seen), 'sitemaps_parsed', parsed,
          'candidate URLs found', len(found), 'seed_count', len(seeds))
    return list(found.values())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--max-sitemaps', type=int, default=25)
    parser.add_argument('--max-urls', type=int, default=1200)
    args = parser.parse_args()
    max_sitemaps = max(1, min(args.max_sitemaps, 50))
    max_urls = max(1, min(args.max_urls, 2000))
    path = ROOT / 'data' / 'discovered_candidates.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    old = json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
    if not isinstance(old, list):
        raise ValueError('discovered_candidates.json must be a JSON array')
    items = {v['url']: v for v in old if isinstance(v, dict) and isinstance(v.get('url'), str)}
    today = datetime.date.today().isoformat()
    for brand, base, pattern in CONFIG:
        for row in crawl(brand, base, pattern, max_sitemaps, max_urls):
            if row['url'] not in items:
                items[row['url']] = {**row, 'first_seen': today}
    path.write_text(json.dumps(sorted(items.values(), key=lambda x: (x.get('brand', ''), x['url'])),
                               ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Total candidate URLs:', len(items), '(NOT automatically verified or published)')


if __name__ == '__main__':
    main()
