#!/usr/bin/env python3
"""Conservative manufacturer sitemap discovery; candidates are NOT verified specifications."""
import argparse, datetime, gzip, json, pathlib, re, time, urllib.parse, urllib.request, urllib.robotparser, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
UA='BASELAYERCatalogResearch/0.1 (daily low-volume public sitemap reader)'
CONFIG=[('Yamaha','https://network.yamaha.com','https://network.yamaha.com/sitemap.xml',r'/products/'),('Dell','https://www.dell.com','https://www.dell.com/sitemap.xml',r'/.*(?:monitor|network|printer|server|storage)'),('ELECOM','https://www.elecom.co.jp','https://www.elecom.co.jp/sitemap.xml',r'/products/')]
LIMIT_BYTES=4_000_000

def fetch(url,base,robots):
    if not url.startswith(base+'/') or not robots.can_fetch(UA,url):return None
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/xml,text/xml,*/*'})
    try:
        with urllib.request.urlopen(req,timeout=12) as r:
            if r.status!=200:return None
            data=r.read(LIMIT_BYTES+1)
            if len(data)>LIMIT_BYTES:return None
            if url.endswith('.gz'):data=gzip.decompress(data)
            return data
    except Exception as e:
        print('SKIP',url,type(e).__name__,str(e)[:120]);return None

def crawl(brand,base,sitemap,pattern,max_sitemaps,max_urls):
    rp=urllib.robotparser.RobotFileParser();rp.set_url(base+'/robots.txt')
    try:rp.read()
    except Exception as e:print('ROBOTS_UNAVAILABLE',brand,e);return []
    if not rp.can_fetch(UA,sitemap):return []
    queue=[sitemap];seen=set();found=[]
    while queue and len(seen)<max_sitemaps and len(found)<max_urls:
        url=queue.pop(0)
        if url in seen:continue
        seen.add(url)
        raw=fetch(url,base,rp)
        if not raw:continue
        try:root=ET.fromstring(raw)
        except ET.ParseError:continue
        tag=root.tag.split('}')[-1]
        locs=[el.text.strip() for el in root.iter() if el.tag.split('}')[-1]=='loc' and el.text]
        if tag=='sitemapindex':
            for loc in locs:
                if loc.startswith(base+'/') and loc not in seen and len(queue)<max_sitemaps*3:queue.append(loc)
        elif tag=='urlset':
            for loc in locs:
                if loc.startswith(base+'/') and re.search(pattern,urllib.parse.urlparse(loc).path,re.I):
                    found.append({'brand':brand,'url':loc,'status':'discovered_unverified'})
                    if len(found)>=max_urls:break
        time.sleep(.25)
    return found

def main():
    p=argparse.ArgumentParser();p.add_argument('--max-sitemaps',type=int,default=12);p.add_argument('--max-urls',type=int,default=300);args=p.parse_args()
    path=ROOT/'data/discovered_candidates.json';old=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
    items={v['url']:v for v in old};today=datetime.date.today().isoformat()
    for brand,base,sitemap,pattern in CONFIG:
        rows=crawl(brand,base,sitemap,pattern,max(1,min(args.max_sitemaps,50)),max(1,min(args.max_urls,2000)))
        for row in rows:
            if row['url'] not in items:items[row['url']]={**row,'first_seen':today}
        print(brand,'candidate URLs found',len(rows))
    path.write_text(json.dumps(sorted(items.values(),key=lambda x:(x['brand'],x['url'])),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Total candidate URLs:',len(items),'(NOT automatically verified or published)')
if __name__=='__main__':main()
