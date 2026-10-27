/* BASELAYER product photography: Wikimedia Commons, exact-model + reusable-license gate.
   Never substitutes photos from a different model. Network failures retain existing illustrations. */
(()=>{'use strict';
const catalog=Array.isArray(window.BASELAYER_PRODUCTS)?window.BASELAYER_PRODUCTS:[];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const allowedLicense=s=>/^(CC0|CC BY(?:-SA)?(?:\s|$)|Public domain)/i.test(String(s||'').replace(/<[^>]*>/g,'').trim());
const yamahaOfficialModels=new Set(['RTX1300','RTX830','RTX810','RTX1220','RTX1210','RTX840','RTX3510','RTX3500','NVR510','NVR700W']);
const yamahaPhoto=p=>p.brand==='ヤマハ'&&yamahaOfficialModels.has(p.model)?{url:'https://www.rtpro.yamaha.co.jp/RT/pict/'+p.model.toLowerCase()+'.jpg',source:'https://network.yamaha.com/support/download/tool',license:'ヤマハ公式：外観写真の用途を問わないダウンロード案内'}:null;
const cache=new Map();
async function findPhoto(p){
 const key=p.brand+'::'+p.model;if(cache.has(key))return cache.get(key);
 const official=yamahaPhoto(p);if(official){cache.set(key,Promise.resolve(official));return official;}
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
  el.append(img,link);el.classList.add('has-photo');
 }
 for(const el of elements){if(observer)observer.observe(el);else load(el)}
}
const mo=new MutationObserver(()=>{if(document.body)attach(document.body)});
document.addEventListener('DOMContentLoaded',()=>{attach(document.body);mo.observe(document.body,{childList:true,subtree:true})});
})();
