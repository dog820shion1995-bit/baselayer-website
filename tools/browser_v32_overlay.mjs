// BASELAYER v32: test a safe two-file overlay on the CURRENT main storage journey.
// This is a staging-only coexistence/regression check; no production files are changed.
// Commons images are intentionally blocked here: this does NOT verify live delivery.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base='http://127.0.0.1:8766/';
const browser=await chromium.launch({headless:true});
const errors=[];
const sizes=[{name:'desktop',width:1365,height:900},{name:'mobile',width:390,height:844}];
async function open(page,path){
  const res=await page.goto(base+path,{waitUntil:'domcontentloaded'});
  assert(res?.ok(),path+' failed to return HTTP 200');
}
async function noOverflow(page,label){
  const d=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert(d.width<=d.viewport+4,label+' horizontal overflow '+JSON.stringify(d));
}
try{
 for(const size of sizes){
  const page=await browser.newPage({viewport:{width:size.width,height:size.height}});
  page.on('pageerror',e=>errors.push(size.name+': '+e.message));
  await page.route(/images\.unsplash\.com/,r=>r.abort());
  await page.route(/commons\.wikimedia\.org/,r=>r.abort());

  // Current main homepage must still lead to its live decision journey.
  await open(page,'index.html');
  assert.match(await page.title(),/BASELAYER/);
  assert.equal(await page.locator('a[href="start.html"]').count()>0,true);
  await noOverflow(page,size.name+' home');

  // Preserve all four live wizard stages and report generation.
  await open(page,'start.html?goal=backup');
  await page.waitForFunction(()=>document.getElementById('wizardTitle')?.textContent.includes('困っていますか'));
  assert(await page.locator('input[name="goal"][value="backup"]').isChecked());
  for(let stage=2;stage<=4;stage++){
   await page.locator('[data-action="next"]').click();
   await page.waitForFunction(n=>document.querySelector('.wizard-counter')?.textContent.includes('0'+n+' / 04'),stage);
  }
  assert.match(await page.locator('#wizardTitle').innerText(),/導入判断レポート/);
  await noOverflow(page,size.name+' decision report');

  // Preserve current main catalog search, NAS filter and 2-item comparison.
  await open(page,'compare.html');
  await page.waitForFunction(()=>document.getElementById('catalogStatus')?.textContent.includes('初期登録'));
  const count=await page.locator('.catalog-item').count();
  assert(count>=5,'current main storage catalog unexpectedly shrank to '+count);
  await page.locator('#catalogQuery').fill('DS225+');
  assert.equal(await page.locator('.catalog-item').count(),1,'main catalog search broken');
  await page.locator('#catalogQuery').fill('');
  await page.locator('button[data-kind="nas"]').click();
  assert(await page.locator('.catalog-item').count()>=2,'main NAS filter broken');
  await page.locator('input[data-compare]').nth(0).check();
  await page.locator('input[data-compare]').nth(1).check();
  assert(await page.locator('#compareTable table').count()===1,'main compare table missing');
  await noOverflow(page,size.name+' current comparison');

  // Staging overlay: the v32 page must coexist without legacy dependencies.
  await open(page,'nas-catalog-v32-preview.html');
  await page.waitForFunction(()=>document.getElementById('count')?.textContent==='6機種');
  assert.equal(await page.locator('.card').count(),6);
  assert.equal(await page.locator('#rels li').count(),5);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
  assert.equal(await page.evaluate(()=>typeof window.BL_STORAGE_ITEMS),'undefined','v32 leaked main catalog globals');
  assert.equal(await page.evaluate(()=>window.BASELAYER_V32_NAS_DATA?.products?.length),6);
  await page.locator('#search').fill('DS918+');
  assert.equal(await page.locator('#rels li').count(),1,'staged NAS search shows unrelated comparisons');
  await page.locator('.placeholder').waitFor();
  assert.equal(await page.locator('.media img').count(),0,'remote-image failure must fall back');
  await noOverflow(page,size.name+' staged NAS preview');
  await page.screenshot({path:'v32-overlay-'+size.name+'.png',fullPage:true});
  await page.close();
 }
 // Optional real network probe: record the result, but do not make a third-party
 // outage fail the deterministic main regression or imply rights beyond CC terms.
 const probe=await browser.newPage({viewport:{width:1365,height:900}});
 const mediaResponses=[];
 probe.on('response',response=>{
  if(response.url().includes('wikimedia.org'))mediaResponses.push(response.status()+' '+response.url().slice(0,180));
 });
 try{
  await open(probe,'nas-catalog-v32-preview.html');
  await probe.locator('#search').fill('DS918+');
  let liveLoaded=false;
  try{
   await probe.waitForFunction(()=>[...document.querySelectorAll('.media img')].some(img=>img.complete&&img.naturalWidth>0),null,{timeout:10000});
   liveLoaded=true;
  }catch{}
  const credited=liveLoaded&&await probe.locator('.credit').count()===1;
  console.log('LIVE_COMMONS_IMAGE_DELIVERY='+((liveLoaded&&credited)?'PASS_WITH_ATTRIBUTION':'NOT_VERIFIED_OR_UNAVAILABLE'));
  console.log('LIVE_COMMONS_HTTP='+JSON.stringify(mediaResponses.slice(0,4)));
 }catch(e){console.log('LIVE_COMMONS_IMAGE_DELIVERY=NOT_VERIFIED_OR_UNAVAILABLE '+e.message);}
 finally{await probe.close();}
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS: current main homepage, 4-step backup wizard, current NAS catalog search/filter/comparison and isolated v32 6-NAS/5-comparison overlay on desktop/mobile.');
 console.log('LIMIT: main was checked in a staged two-file overlay, not deployed; remote Commons image delivery was intentionally blocked and remains unverified.');
}finally{await browser.close();}
