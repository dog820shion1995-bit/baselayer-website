/* BASELAYER product photography: Wikimedia Commons, exact-model + reusable-license gate.
   Never substitutes photos from a different model. Network failures retain existing illustrations. */
(()=>{'use strict';
const catalog=Array.isArray(window.BASELAYER_PRODUCTS)?window.BASELAYER_PRODUCTS:[];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const allowedLicense=s=>/^(CC0|CC BY(?:-SA)?(?:\s|$)|Public domain)/i.test(String(s||'').replace(/<[^>]*>/g,'').trim());
const cache=new Map();
async function findPhoto(p){
 const key=p.brand+'::'+p.model;if(cache.has(key))return cache.get(key);
 const work=(async()=>{
  const model=norm(p.model);if(model.length<5)return null;
  const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:'file: "'+p.model+'"',gsrnamespace:'6',gsrlimit:'15',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',format:'json',origin:'*'});
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
  try{
   const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:controller.signal});if(!response.ok)return null;
   const json=await response.json();const pages=Object.values(json.query?.pages||{});
   for(const page of pages){
    const info=page.imageinfo?.[0];const meta=info?.extmetadata||{};const title=norm(page.title);
    const lic=meta.LicenseShortName?.value||'';
    if(!title.includes(model)||!allowedLicense(lic)||!info?.thumburl||!info?.descriptionurl)continue;
    const words=(page.title||'').toLowerCase();if(/(logo|manual|datasheet|diagram|schematic|screenshot|box art)/i.test(words))continue;
    if(!/^https:\/\//.test(info.thumburl)||!/^https:\/\//.test(info.descriptionurl))continue;
    return {url:info.thumburl,source:info.descriptionurl,license:lic};
   }
   return null;
  }catch{return null}finally{clearTimeout(timer)}
 })();cache.set(key,work);return work;
}
function attach(root){
 const elements=[...root.querySelectorAll('[data-model-photo]')];
 if(!elements.length)return;
 const observer=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){observer.unobserve(entry.target);load(entry.target)}}},{rootMargin:'250px'}):null;
 async function load(el){
  if(el.dataset.photoLoading)return;el.dataset.photoLoading='1';
  const p=catalog.find(x=>x.model===el.dataset.modelPhoto&&x.brand===el.dataset.brandPhoto);
  if(!p)return;
  const photo=await findPhoto(p);if(!photo||!el.isConnected)return;
  const img=document.createElement('img');img.src=photo.url;img.alt=p.brand+' '+p.model+'の画像（Wikimedia Commons）';img.loading='lazy';img.decoding='async';img.className='catalog-photo';img.onerror=()=>{img.remove();el.classList.remove('has-photo')};
  const link=document.createElement('a');link.className='catalog-photo-credit';link.href=photo.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='写真出典・ライセンス';link.title=photo.license;
  el.append(img,link);img.onload=()=>{if(el.isConnected){el.classList.add('has-photo');el.dataset.photoVerified='1';}};
 }
 for(const el of elements){if(observer)observer.observe(el);else load(el)}
}
const mo=new MutationObserver(mutations=>{for(const mutation of mutations){for(const node of mutation.addedNodes){if(node.nodeType===1){if(node.matches?.('[data-model-photo]'))attach(node.parentElement||document.body);else if(node.querySelector?.('[data-model-photo]'))attach(node)}}}});
document.addEventListener('DOMContentLoaded',()=>{attach(document.body);mo.observe(document.body,{childList:true,subtree:true})});
})();
