/* Privacy-first, client-only funnel instrumentation.
   Disabled until the owner configures analytics and reviews the privacy policy.
   Never include form answers, model IDs, query strings, URLs, or user identifiers. */
(() => {
"use strict";
const allowed=new Set([
 "page_view","diagnosis_entry","diagnosis_step_1","diagnosis_step_2",
 "diagnosis_step_3","diagnosis_complete","report_print","report_copy",
 "product_detail_view","price_page_view","case_to_diagnosis",
 "report_to_product","product_outbound_research",
 "manufacturer_info_click","marketplace_search_click"
]);
const cfg=window.BL_ANALYTICS_CONFIG||{};
const session=[];
const measurementId=String(cfg.measurementId||"").trim();
const enabled=cfg.enabled===true&&/^G-[A-Z0-9]{6,16}$/.test(measurementId);
if(enabled){
 const script=document.createElement("script");
 script.async=true;
 script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(measurementId);
 document.head.append(script);
 window.dataLayer=window.dataLayer||[];
 window.gtag=function(){window.dataLayer.push(arguments);};
 window.gtag("js",new Date());
 window.gtag("config",measurementId,{send_page_view:false,anonymize_ip:true});
}
const page=location.pathname.split("/").pop()||"index.html";
function event(name){
 if(!allowed.has(name))return;
 const payload={event:name,page_type:page};
 session.push(payload);
 if(session.length>100)session.shift();
 if(enabled&&typeof window.gtag==="function")window.gtag("event",name,{page_type:page});
 try{window.dispatchEvent(new CustomEvent("baselayer:metric",{detail:payload}));}catch{}
}
window.BL_TRACK=event;
window.BL_METRIC_PREVIEW=()=>session.slice();
event("page_view");
// Count the destination page once, including direct/search-engine landings.
// Do not also count the originating CTA click as a second diagnosis entry.
if(page==="start.html")event("diagnosis_entry");
if(page==="price-guide.html")event("price_page_view");
// An unknown product ID is not a successful product-detail view.
if(page==="product.html"&&document.querySelector(".detail-hero"))event("product_detail_view");
document.addEventListener("click",ev=>{
 const a=ev.target?.closest?.("a[href]");
 if(!a)return;
 let url;
 try{url=new URL(a.href);}catch{return;}
 if(url.origin===location.origin&&url.pathname.endsWith("/start.html")&&
    ["office-10-storage.html","nas-4tb-raid1.html","backup-first-steps.html"].includes(page)){
   event("case_to_diagnosis");
 }
 if(page==="start.html"&&url.origin===location.origin&&url.pathname.endsWith("/product.html")){
   event("report_to_product");
 }
 if(page!=="product.html"||!["http:","https:"].includes(url.protocol)||url.origin===location.origin)return;
 // The manufacturer information link is not a verified purchase.
 // Amazon/Rakuten links open search results, not confirmed authorized sellers.
 const purpose=a.getAttribute("data-bl-outbound");
 if(purpose==="manufacturer"){
   event("manufacturer_info_click");
   event("product_outbound_research");
 }else if(purpose==="marketplace-search"){
   event("marketplace_search_click");
   event("product_outbound_research");
 }
});
})();