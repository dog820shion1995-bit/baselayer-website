(()=>{"use strict";
const e=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const entries=window.BL_PRICES?.entries||{},items=window.BL_STORAGE_ITEMS||[];
const yen=n=>new Intl.NumberFormat("ja-JP").format(n)+"円";
function card(p){const d=entries[p.id];if(!d)return "";
let txt="価格未確認（メーカー・販売店へ要確認）",description="";
if(d.status==="reference"){
 if(d.kind==="service"){txt=yen(d.monthly)+"／月相当（税込）";description="12か月前払い＋初期費用 "+yen(d.initial)+"。初年度の基本契約時支払参考額は "+yen(d.monthly*12+d.initial)+"。";}
 else {txt=yen(d.price)+"（"+d.tax+"・メーカー希望小売価格等）";}
}else if(d.currency==="USD"){txt="$"+d.monthly.toFixed(2)+"／人／月（年払い・税別）";description="最低"+d.minUsers+"人。為替・請求通貨・消費税を要確認。円換算しません。";}
const url='product.html?id='+encodeURIComponent(p.id);
const media=window.BL_MEDIA?.[p.id];
const mediaHTML=media?.src?'<div class="catalog-item-image"><img loading="lazy" decoding="async" src="'+e(media.src)+'" alt="'+e(media.label)+'"></div><p class="product-photo-caption">'+e(media.credit)+'</p>':'';
return '<article class="catalog-item">'+mediaHTML+'<span class="pill">'+e(p.kind==="cloud"?"クラウドストレージ":p.kind==="nas"?"NAS":"外付けHDD・SSD")+'</span><h3>'+e(p.name)+'</h3><p><b>'+e(txt)+'</b></p><p>'+e(description)+" "+e(d.basis||"")+'</p><p class="smallnote">'+e(d.disclaimer||"")+'</p><p class="smallnote">価格掲載確認日：'+e(window.BL_PRICES.checked)+'</p><a href="'+url+'">この候補を選ぶ理由・仕様を見る →</a><br><a href="'+e(d.source)+'" target="_blank" rel="noopener noreferrer">価格の公式出典を確認 ↗</a></article>';
}
document.getElementById("cloudPrices").innerHTML=items.filter(x=>x.kind==="cloud").map(card).join("");
document.getElementById("devicePrices").innerHTML=items.filter(x=>x.kind!=="cloud").map(card).join("");
})();