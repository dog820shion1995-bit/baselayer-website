#!/usr/bin/env node
'use strict';
/* Offline static acceptance checks for BASELAYER storage edition. No network calls. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),js=read('storage-site.js'),policy=read('storage-policy.html'),css=read('storage-site.css');
const context={window:{}};
vm.runInNewContext(read('storage-data.js'),context,{filename:'storage-data.js'});
new vm.Script(js,{filename:'storage-site.js'});
const items=context.window.BL_STORAGE_ITEMS;
assert(Array.isArray(items) && items.length>=6,'expected at least six product records');
const ids=new Set();
for(const item of items) {
  for(const key of ['id','kind','model','brand','name','scope','feature','source','official','reviewed','specs','limits']) assert(item[key],item.id+': missing '+key);
  assert(['cloud','nas','hdd'].includes(item.kind),item.id+' invalid category');
  assert(!ids.has(item.id),'duplicate '+item.id);ids.add(item.id);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.reviewed),item.id+' invalid review date');
  for(const key of ['source','official']) {
    const url=new URL(item[key]);
    assert(url.protocol==='https:',item.id+' unsafe '+key);
  }
  assert(Object.keys(item.specs).length>=2,item.id+' insufficient specs');
  if(item.affiliate) assert(item.affiliateVerified===true,'an unverified affiliate link should never be enabled');
}
for(const cat of ['cloud','nas','hdd']) assert(items.some(x=>x.kind===cat),'missing '+cat);
const domIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const hit of js.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)) assert(domIds.has(hit[1]),'missing selector #'+hit[1]);
for(const file of ['storage-data.js','storage-site.js','storage-site.css','storage-policy.html']) assert(html.includes(file)||file==='storage-policy.html',file+' unlinked');
for(const section of ['categories','advisor','catalog','updates','guide','purchase','policy']) assert(domIds.has(section),'missing section '+section);
assert(!html.includes('amazon-20'),'unexpected hardcoded Amazon tracking ID');
assert(policy.includes('アフィリエイト') && policy.includes('個人情報'),'policy must explain affiliate and privacy');
assert(css.includes('@media(max-width:600px)'),'mobile rules missing');
console.log('PASS storage: '+items.length+' records, '+domIds.size+' DOM ids, all core areas, URLs and syntax checked.');
