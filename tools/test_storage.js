#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const read=path=>fs.readFileSync(path,'utf8');
const files=['index.html','start.html','learn.html','compare.html','journey.css','journey-app.js','catalog-guide.js','storage-data.js','storage-policy.html'];
files.forEach(f=>assert(fs.existsSync(f),'missing '+f));
const pages=files.filter(f=>f.endsWith('.html'));
const pagesHtml=Object.fromEntries(pages.map(f=>[f,read(f)]));
const photos=[...pagesHtml['index.html'].matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
assert(photos.length>=2,'homepage needs meaningful photography');
assert(pagesHtml['index.html'].includes('href="start.html"'),'missing journey entry');
assert(pagesHtml['index.html'].includes('href="learn.html"'),'missing education entry');
assert(!pagesHtml['index.html'].includes('id="productGrid"'),'homepage must not be product grid');
assert(!pagesHtml['index.html'].includes('storage-site.js'),'legacy UI must not load');
assert(!pagesHtml['index.html'].includes('products.json'),'old catalog not loaded');
assert(pagesHtml['start.html'].includes('id="wizardContent"'),'wizard container missing');
assert(pagesHtml['start.html'].includes('journey-app.js'),'wizard script missing');
assert(pagesHtml['compare.html'].includes('catalog-guide.js'),'advanced comparison missing');
assert(pagesHtml['learn.html'].includes('3-2-1'),'backup education missing');
assert(pagesHtml['start.html'].includes('storage-data.js'),'new storage records not loaded');
for(const file of pages){const h=pagesHtml[file];assert(h.includes('journey.css'),file+' CSS');assert(h.includes('lang="ja"'),file+' language');assert(h.includes('name="viewport"'),file+' responsive');}
for(const file of ['journey-app.js','catalog-guide.js','storage-data.js'])new vm.Script(read(file),{filename:file});
const c={window:{}};vm.runInNewContext(read('storage-data.js'),c);
const data=c.window.BL_STORAGE_ITEMS;
assert.equal(data.length,8,'expected initial eight storage products');
assert.equal(new Set(data.map(x=>x.id)).size,data.length,'duplicate product ids');
for(const p of data){assert(['cloud','nas','hdd'].includes(p.kind));assert(p.specs&&p.source&&p.official&&p.limits);assert(new URL(p.source).protocol==='https:');}
assert(read('journey.css').includes('@media(max-width:640px)'),'responsive styles missing');
assert(read('journey-app.js').includes('byId("estimateYear")'),'costs not calculated');
assert(read('journey-app.js').includes('window.print()'),'print support missing');
assert(read('journey-app.js').includes('入力されていない費用'),'missing-price warning absent');
console.log('PASS: goal-first homepage, learning, journey, manual cost estimate, advanced comparison and 8 specialized products.');
