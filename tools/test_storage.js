#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const pages=['index.html','start.html','learn.html','compare.html','product.html','price-guide.html','storage-policy.html','office-10-storage.html','nas-4tb-raid1.html','backup-first-steps.html'];
const scripts=['journey-app.js','catalog-guide.js','product-detail.js','price-guide.js','product-editorial.js','official-prices.js','storage-data.js','visual-media.js','site-navigation.js','metrics-config.js','metrics-events.js'];
for(const p of [...pages,...scripts,'journey.css','visual-story.css','decision-cases.css','sitemap.xml','robots.txt','docs/growth-pdca-20261028.md'])assert(fs.existsSync(p),'file missing '+p);
for(const p of pages){const html=read(p);assert(html.includes('lang="ja"'),p+' Japanese language');assert(html.includes('name="viewport"'),p+' viewport');assert(html.includes('journey.css'),p+' responsive stylesheet');assert(html.includes('visual-story.css'),p+' visual stylesheet');assert(html.includes('site-navigation.js'),p+' accessible mobile navigation');assert(html.includes('metrics-events.js'),p+' metric event hook');}
for(const p of scripts)new vm.Script(read(p),{filename:p});
const ctx={window:{}};
for(const p of ['storage-data.js','official-prices.js','product-editorial.js','visual-media.js'])vm.runInNewContext(read(p),ctx,{filename:p});
const products=ctx.window.BL_STORAGE_ITEMS,prices=ctx.window.BL_PRICES,editorial=ctx.window.BL_EDITORIAL,media=ctx.window.BL_MEDIA;
assert.equal(Object.keys(media).length,8,'visual metadata for all products');
assert.equal(Object.values(media).filter(x=>x.kind==='product').length,4,'four manufacturer photos');
assert.equal(Object.values(media).filter(x=>x.kind==='context').length,3,'three licensed context photos');
assert(read('visual-media.js').includes('document.addEventListener("error"'),'missing remote-image fallback');
for(const item of products){const m=media[item.id];assert(m,'missing visual status for '+item.id);assert(m.source&&new URL(m.source).protocol==='https:');if(m.src){assert(new URL(m.src).protocol==='https:');assert(m.credit&&m.label,'missing media attribution');assert(m.rights&&new URL(m.rights).protocol==='https:','missing explicit image-use terms');}else{assert(m.kind==='official-link','no image must link to official source');}}
assert(read('storage-policy.html').includes('https://www.iodata.jp/copyright.htm'),'I-O DATA rights disclosure missing');
assert(read('storage-policy.html').includes('https://www.buffalo.jp/other/about.html'),'BUFFALO rights disclosure missing');
assert(read('index.html').includes('remoteSceneTitle'),'outside salesperson visual absent');
assert(read('learn.html').includes('id="recovery-terms"')&&read('learn.html').includes('docs.aws.amazon.com/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/recovery-objectives.html'),'RPO/RTO learning diagram or official evidence missing');
assert(read('journey-app.js').includes('learn.html#recovery-terms'),'wizard recovery glossary link missing');
assert(read('learn.html').includes('remote-example')&&read('learn.html').includes('backup-example'),'learning diagrams absent');
assert(read('learn.html').includes('remote-route-grid')&&read('learn.html').includes('経路 B')&&read('learn.html').includes('buffalo.jp/support/faq/detail/15880.html'),'remote access routes or official safety source missing');
assert(read('learn.html').includes('id="lan-example"')&&read('learn.html').includes('location-node-data'),'LAN/data-location explainer missing');
assert(read('index.html').includes('learn.html#lan-example'),'homepage lacks data-location journey');
assert(read('visual-story.css').includes('.location-grid'),'data-location responsive styles absent');
assert(read('journey-app.js').includes('visual-choice'),'wizard photo choices absent');
assert(read('product-detail.js').includes('mediaPanel()'),'product image view absent');
assert(read('catalog-guide.js').includes('mediaThumb'),'comparison photos absent');
assert.equal(products.length,8,'initial 8 product records');
assert.equal(Object.keys(prices.entries).length,8,'price coverage 8');
assert.equal(Object.keys(editorial).length,8,'why-selection content coverage 8');
for(const item of products){
 const p=prices.entries[item.id],e=editorial[item.id];
 assert(p&&e,'missing pricing/editorial '+item.id);
 assert(Array.isArray(e.choose)&&e.choose.length>=2,'selection evidence '+item.id);
 assert(Array.isArray(e.versus)&&e.versus.length>0,'comparison narrative '+item.id);
 assert(Array.isArray(e.notFor)&&e.notFor.length>0,'trade-off '+item.id);
 assert(e.versus.every(x=>products.some(y=>y.id===x.id)),'broken editorial comparison '+item.id);
 assert(e.source.every(x=>new URL(x).protocol==='https:'),'unsafe reference '+item.id);
 assert(new URL(p.source).protocol==='https:','unsafe price source');
 assert(item.specs&&item.official&&item.limits,'incomplete product '+item.id);
}
assert(prices.entries.xserver.monthly===3300&&prices.entries.xserver.initial===11000,'XServer official normal terms');
assert(prices.entries['buffalo-nas'].price===73480,'BUFFALO reference price');
assert(prices.entries['iodata-hdd'].price===40260,'I-O DATA reference price');
assert(prices.entries['iodata-usb'].disclaimer.includes('在庫限り'),'discontinued-model warning absent');
assert(prices.entries.zoho.currency==='USD','Zoho currency must not silently convert to JPY');
assert(prices.entries.synology.status==='unverified','Synology unsourced retail price must stay unknown');
assert(read('start.html').includes('product-editorial.js'),'decision report missing explanations');
assert(read('compare.html').includes('product-editorial.js'),'comparison rationale not loaded');
assert(read('index.html').includes('href="start.html"'),'landing guidance missing');
assert(!read('index.html').includes('id="productGrid"'),'homepage should not flood products');
assert(read('journey-app.js').includes('return {kind,title,reason'),'decision logic missing');
assert(read('journey-app.js').includes('const firstContract'),'prepayment correction absent');
assert(read('journey-app.js').includes('3年間の確認済み参考額'),'3 year cost absent');
assert(read('product-detail.js').includes('他の製品と何が違う'),'reasoned product detail absent');
assert(read('storage-policy.html').includes('参考額'),'pricing policy incomplete');
const sitemap=read('sitemap.xml');
const rob=read('robots.txt');
for(const file of ['office-10-storage.html','nas-4tb-raid1.html','backup-first-steps.html']){
 assert(sitemap.includes('/'+file+'</loc>'),'search sitemap missing '+file);
 assert(read(file).includes('href="start.html?goal='),'purchase decision CTA missing '+file);
 assert(read(file).includes('rel="noopener noreferrer"'),'official citations missing '+file);
 assert(read(file).includes('name="description"'),'search description missing '+file);
 assert(read('index.html').includes('href="'+file+'"'),'home page case link missing '+file);
}
assert(rob.includes('Sitemap: https://dog820shion1995-bit.github.io/baselayer-website/sitemap.xml'),'robots sitemap location missing');
assert(read('metrics-config.js').includes('enabled:false'),'remote tracking should be disabled without a measurement ID');
assert(!read('metrics-events.js').includes('localStorage'),'event implementation must not persist inputs');
assert(read('metrics-events.js').includes('page==="start.html"'),'direct diagnosis landings must be measured');
assert(read('metrics-events.js').includes('document.querySelector(".detail-hero")'),'unknown products must not count as detail views');
assert(read('product-detail.js').includes('data-bl-outbound'),'outbound research links must be explicitly classified');
assert(read('metrics-events.js').includes('marketplace_search_click'),'marketplace search is not a confirmed purchase');
assert(read('journey-app.js').includes('diagnosis_complete'),'diagnosis completion metric missing');
console.log('PASS: 10 pages, 3 organic search cases, sitemap, disabled analytics and 8 source-backed products.');
