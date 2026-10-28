// BASELAYER v32 review-only Playwright smoke checks.
// Mocked Commons image responses test UI behavior, NOT live image delivery or legal clearance.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base='http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true});
const errors=[];
const photoSvg='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="#aaa"/></svg>';
const goto=async(page)=>{
  const response=await page.goto(base+'nas-catalog-v32-preview.html',{waitUntil:'domcontentloaded'});
  assert(response?.ok(),'review preview did not return HTTP 200');
  await page.waitForFunction(()=>document.getElementById('count')?.textContent==='7機種');
};
try {
  const desktop=await browser.newPage({viewport:{width:1365,height:900}});
  desktop.on('pageerror',e=>errors.push('desktop: '+e.message));
  let imageRoutes=0;
  await desktop.route(/commons\\.wikimedia\\.org/,route=>{
    imageRoutes++;
    return route.fulfill({status:200,contentType:'image/svg+xml',body:photoSvg});
  });
  await goto(desktop);
  assert.equal(await desktop.locator('.card').count(),7,'expected seven NAS records');
  assert.equal(await desktop.locator('#rels li').count(),5,'expected five NAS-only comparison notes');
  assert.equal(await desktop.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
  await desktop.locator('#search').fill('DS918+');
  assert.equal(await desktop.locator('.card').count(),1);
  try {await desktop.locator('.media img').waitFor({timeout:6000});}
  catch {throw new Error('licensed image did not render; routes='+imageRoutes+' card='+await desktop.locator('.card').evaluate(n=>n.outerHTML.slice(0,1200)));}
  assert(await desktop.locator('.media img').evaluate(img=>img.complete&&img.naturalWidth>0),'licensed photo path did not load');
  assert.match(await desktop.locator('.credit').innerText(),/mculi/);
  assert.match(await desktop.locator('.credit').innerText(),/CC BY-SA 4.0/);
  assert.match(await desktop.locator('.credit').innerText(),/加工/);
  assert.equal(await desktop.locator('.credit a').count(),2);
  assert.match(await desktop.locator('.media img').getAttribute('alt'),/Synology DS918\+/);
  await desktop.locator('#search').fill('DS925+');
  assert.equal(await desktop.locator('.card').count(),1);
  assert.equal(await desktop.locator('.media img').count(),0,'unlicensed model should use fallback');
  assert.match(await desktop.locator('.placeholder').innerText(),/写真未確認/);
  await desktop.locator('#search').fill('');
  await desktop.locator('#brand').selectOption('QNAP');
  assert.equal(await desktop.locator('.card').count(),2);
  assert.equal(await desktop.locator('.card a.source').count(),2,'official source links missing');
  await desktop.locator('#search').fill('not-a-model');
  assert.match(await desktop.locator('#grid').innerText(),/一致する型番はありません/);
  await desktop.screenshot({path:'v32-nas-desktop.png',fullPage:true});

  const failed=await browser.newPage({viewport:{width:1365,height:900}});
  failed.on('pageerror',e=>errors.push('failed-photo: '+e.message));
  await failed.route('https://commons.wikimedia.org/wiki/Special:Redirect/file/**',route=>route.abort());
  await goto(failed);
  await failed.locator('#search').fill('DS918+');
  await failed.locator('.placeholder').waitFor();
  await failed.waitForFunction(()=>document.querySelectorAll('.credit').length===0);
  assert.equal(await failed.locator('.media img').count(),0,'failed photo did not fall back');
  assert.equal(await failed.locator('.credit').count(),0,'failed photo retained misleading attribution');
  await failed.close();

  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  mobile.on('pageerror',e=>errors.push('mobile: '+e.message));
  await mobile.route('https://commons.wikimedia.org/wiki/Special:Redirect/file/**',route=>route.abort());
  await goto(mobile);
  const dims=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  assert(dims.scroll<=dims.viewport+3,'mobile horizontal overflow: '+JSON.stringify(dims));
  await mobile.locator('#brand').selectOption('Synology');
  assert.equal(await mobile.locator('.card').count(),5);
  await mobile.locator('#search').fill('DS920+');
  assert.equal(await mobile.locator('.card').count(),1);
  await mobile.locator('.card summary').click();
  assert.match(await mobile.locator('.card dl').innerText(),/CPU/);
  await mobile.screenshot({path:'v32-nas-mobile.png',fullPage:true});
  assert.equal(errors.length,0,errors.join('; '));
  console.log('PASS: v32 review NAS desktop/mobile catalog, filter, source links, five comparisons, CC credit, mock image success, forced image failure and fallback.');
  console.log('NOTE: Commons live delivery, production integration and external license verification are NOT covered.');
} finally {await browser.close();}
