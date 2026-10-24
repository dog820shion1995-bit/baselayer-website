#!/usr/bin/env python3
"""Fetch discovered public pages, extract conservative evidence into a review queue.
Never publishes unverified specifications. Respect robots and throttle requests.
"""
import argparse, datetime, html, json, pathlib, re, time, urllib.parse, urllib.request, urllib.robotparser
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
UA='BASELAYERCatalogResearch/0.2 (public manufacturer catalog research)'
class Extract(HTMLParser):
    def __init__(self):
        super().__init__();self.title=False;self.titles=[];self.meta={};self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title':self.title=True
        if tag=='meta':
            key=a.get('property') or a.get('name')
            if key in ('description','og:title','og:description') and a.get('content'):self.meta[key]=a['content'][:500]
        if tag=='a' and a.get('href') and re.search(r'仕様|後継|代替|販売終了|生産終了|サポート|spec|successor|replacement|eol|end.of.life',a['href'],re.I):self.links.append(a['href'])
    def handle_endtag(self,tag):
        if tag=='title':self.title=False
    def handle_data(self,data):
        if self.title:self.titles.append(data)
def fetch(url,robots):
    if not robots.can_fetch(UA,url):return None
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html'})
    try:
        with urllib.request.urlopen(req,timeout=12) as resp:
            if resp.status!=200 or 'text/html' not in resp.headers.get('Content-Type',''):return None
            data=resp.read(650001)
            if len(data)>650000:return None
            charset=resp.headers.get_content_charset() or 'utf-8'
            return data.decode(charset,errors='replace')
    except Exception as e:
        print('SKIP',url,type(e).__name__);return None
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--limit',type=int,default=90);ap.add_argument('--delay',type=float,default=1.0);args=ap.parse_args()
    inp=ROOT/'data/discovered_candidates.json';out=ROOT/'data/evidence_queue.json'
    candidates=json.loads(inp.read_text(encoding='utf-8')) if inp.exists() else []
    previous=json.loads(out.read_text(encoding='utf-8')) if out.exists() else []
    records={x['url']:x for x in previous};robots={};done=0
    for item in candidates:
        if done>=max(0,min(args.limit,500)):break
        url=item.get('url','');u=urllib.parse.urlsplit(url)
        if u.scheme!='https' or not u.netloc or url in records:continue
        base=f'{u.scheme}://{u.netloc}'
        if base not in robots:
            rp=urllib.robotparser.RobotFileParser();rp.set_url(base+'/robots.txt')
            try:rp.read();robots[base]=rp
            except Exception:robots[base]=None
        rp=robots[base]
        if rp is None:continue
        raw=fetch(url,rp);done+=1
        if raw:
            p=Extract()
            try:p.feed(raw)
            except Exception:pass
            title=html.unescape(' '.join(p.titles)).strip()[:250]
            links=[]
            for link in p.links[:40]:
                target=urllib.parse.urljoin(url,link)
                if urllib.parse.urlsplit(target).netloc==u.netloc and target not in links:links.append(target)
            records[url]={'brand':item.get('brand',''),'url':url,'title':title,'description':p.meta.get('description') or p.meta.get('og:description',''),'related_official_urls':links[:12],'fetched_on':datetime.date.today().isoformat(),'review_status':'unverified_candidate','specs':{},'successor':None}
        time.sleep(max(0.2,args.delay))
    out.write_text(json.dumps(sorted(records.values(),key=lambda x:x['url']),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Fetched',done,'pages; evidence records',len(records),'— no specifications auto-published')
if __name__=='__main__':main()
