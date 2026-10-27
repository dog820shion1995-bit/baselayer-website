/* Visuals metadata — 2026-10-28. Only manufacturer images used under their
 documented product-explanation/photo-gallery allowances. No scraped logos or fake
 product shots. Other entries use licensed contextual Unsplash photos and are
 explicitly labeled as representative scenes, not product appearances. */
window.BL_MEDIA = {
 "buffalo-nas": {src:"https://www.buffalo.jp/webpim/product/image/L/LS720D/LS720D0402/LS720D0402__0100.jpg",label:"LS720D0402 実物写真",kind:"product",credit:"写真：BUFFALO（メーカー商品写真）",source:"https://www.buffalo.jp/product/detail/ls720d0402.html",rights:"https://www.buffalo.jp/other/about.html"},
 "buffalo-hdd": {src:"https://www.buffalo.jp/webpim/product/image/H/HD-LE-B/HD-LE4U3-BB/HD-LE4U3-BB__0100.jpg",label:"HD-LE4U3-BB 実物写真",kind:"product",credit:"写真：BUFFALO（メーカー商品写真）",source:"https://www.buffalo.jp/product/detail/hd-le4u3-bb.html",rights:"https://www.buffalo.jp/other/about.html"},
 "iodata-hdd": {src:"https://www.iodata.jp/product/hdd/hdd/hdja-utr/640/y.jpg",label:"HDJA-UTRシリーズ外観",kind:"product",credit:"写真：I-O DATA（メーカー製品ギャラリー）",source:"https://www.iodata.jp/product/hdd/hdd/hdja-utr/spec.htm",rights:"https://www.iodata.jp/copyright.htm/"},
 "iodata-usb": {src:"https://www.iodata.jp/product/hdd/hdd/hdd-utb/hdd-utb_bk_640.jpg",label:"HDD-UTBシリーズ（黒）の実物写真",kind:"product",credit:"写真：I-O DATA（メーカー製品ギャラリー）",source:"https://www.iodata.jp/product/hdd/hdd/hdd-utb/spec.htm",rights:"https://www.iodata.jp/copyright.htm/"},
 "synology": {src:"",label:"DS225+の正確な外観はメーカー公式で確認",kind:"official-link",credit:"メーカー提供画像の転載可否を未確認のため未掲載",source:"https://www.synology.com/ja-jp/products/DS225%2B"},
 "xserver": {src:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",label:"クラウド利用イメージ：共同作業",kind:"context",credit:"利用シーン写真：Unsplash（サービス画面ではありません）",source:"https://drive.xserver.ne.jp/",rights:"https://unsplash.com/license",
 "zoho": {src:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",label:"チーム共同作業のイメージ",kind:"context",credit:"利用シーン写真：Unsplash（サービス画面ではありません）",source:"https://www.zoho.com/jp/workdrive/",rights:"https://unsplash.com/license",
 "pcloud": {src:"https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=80",label:"チームでファイル管理する利用イメージ",kind:"context",credit:"利用シーン写真：Unsplash（サービス画面ではありません）",source:"https://www.pcloud.com/",rights:"https://unsplash.com/license"
};
/* A remote image can disappear or block hotlinking. Preserve the product decision
   and give visitors a clear route to the original official information. */
(() => {
 "use strict";
 if (typeof document === "undefined") return;
 const known=new Map(Object.values(window.BL_MEDIA||{}).filter(x=>x.src).map(x=>[x.src,x]));
 document.addEventListener("error", event => {
  const img=event.target;
  if (!(img instanceof HTMLImageElement)) return;
  const item=known.get(img.getAttribute("src"));
  if (!item) return;
  const fallback=document.createElement("div");
  fallback.className="product-media-missing";
  const title=document.createElement("strong");
  title.textContent="写真を表示できませんでした";
  const link=document.createElement("a");
  link.href=item.source;
  link.target="_blank";
  link.rel="noopener noreferrer";
  link.textContent="メーカー・提供元の公式情報を確認する ↗";
  fallback.append(title,link);
  img.replaceWith(fallback);
 }, true);
})();
