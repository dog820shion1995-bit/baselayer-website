/* Privacy-first event schema for future owner-managed analytics.
   Does NOT send traffic anywhere unless analytics credentials are configured.
   No input content, addresses, filenames, identifiers or personal data are logged. */
(() => {
"use strict";
const allowed=new Set(["page_view","diagnosis_entry","diagnosis_step_1","diagnosis_step_2","diagnosis_step_3","diagnosis_complete","report_print","report_copy","product_detail_view","price_page_view","external_product_click","case_to_diagnosis"]);
const cfg=window.BL_ANALYTICS_CONFIG||{};
const session=[];const measurementId=String(cfg.measurementId||"").trim();
const enabled=cfg.enabled===true&&/^G-[A-Z0-9]{6,16}$/.test(measurementId);
if(enabled){
 const s=document.createElement("script");
 s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(measurementId);
 document.head.append(s);
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments);};
 window.gtag("js",new Date());
 window.gtag("config",measurementId,{send_page_view:false,anonymize_ip:true});
}
function event(name){
 if(!allowed.has(name))return;
 const type=location.pathname.split("/").pop()||"index.html";
 const payload={event:name,page_type:type}; // deliberately no PII / form values
 session.push({event:name,page_type:type}); // volatile memory only, cleared on navigation
 if(session.length>100)session.shift();
 if(enabled&&typeof window.gtag==="function")window.gtag("event",name,{page_type:type});
 try{window.dispatchEvent(new CustomEvent("baselayer:metric",{detail:payload}));}catch{}
}
window.BL_TRACK=event;
window.BL_METRIC_PREVIEW=()=>session.slice();
event("page_view");
if(location.pathname.endsWith("price-guide.html"))event("price_page_view");
if(location.pathname.endsWith("product.html"))event("product_detail_view");
document.addEventListener("click",ev=>{
 const a=ev.target.closest("a[href]");if(!a)return;
 let url;try{url=new URL(a.href);}catch{return;}
 if(url.pathname.endsWith("start.html")){
  if(["office-10-storage.html","nas-4tb-raid1.html","backup-first-steps.html"].some(p=>location.pathname.endsWith(p)))event("case_to_diagnosis");
  event("diagnosis_entry");
 }
 if(!["https:","http:"].includes(url.protocol))return;
 if(url.origin!==location.origin&&location.pathname.endsWith("product.html"))event("external_product_click");
});
})();