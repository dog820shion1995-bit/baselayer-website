(() => {
"use strict";
const header=document.querySelector(".site-head");
const inner=header?.querySelector(".head-inner");
if(!inner)return;
const button=document.createElement("button");
button.type="button";
button.className="mobile-menu-button";
button.setAttribute("aria-expanded","false");
button.setAttribute("aria-controls","baselayerMobileNavigation");
button.textContent="メニュー";
const nav=document.createElement("nav");
nav.id="baselayerMobileNavigation";
nav.className="mobile-site-links";
nav.setAttribute("aria-label","モバイル用ナビゲーション");
nav.hidden=true;
const links=[
 ["index.html","トップ"],
 ["learn.html","まず違いを知る"],
 ["office-10-storage.html","社員10人の共有フォルダ"],
 ["start.html","環境を診断する"],
 ["price-guide.html","費用の目安"],
 ["compare.html","製品・サービスを比較する"],
 ["storage-policy.html","掲載方針"]
];
for(const [href,label] of links){
 const a=document.createElement("a");a.href=href;a.textContent=label;
 if(location.pathname.split("/").pop()===href)a.setAttribute("aria-current","page");
 nav.append(a);
}
function close(){nav.hidden=true;button.setAttribute("aria-expanded","false");button.textContent="メニュー";}
button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")==="true";nav.hidden=open;button.setAttribute("aria-expanded",String(!open));button.textContent=open?"メニュー":"閉じる";});
nav.addEventListener("click",e=>{if(e.target.closest("a"))close();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
inner.append(button);header.append(nav);
})();
