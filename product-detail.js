(()=>{"use strict";
const $=id=>document.getElementById(id);
const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const all=Array.isArray(window.BL_STORAGE_ITEMS)?window.BL_STORAGE_ITEMS:[];
const article=window.BL_EDITORIAL||{};
const prices=window.BL_PRICES?.entries||{};
const id=new URLSearchParams(location.search).get("id");
const item=all.find(p=>p.id===id),ed=article[id],pricing=prices[id];
const kindLabel={cloud:"クラウドストレージ",nas:"NAS",hdd:"外付けHDD・SSD"};
const ext=(url,label,cls="",purpose="")=>{try{const u=new URL(url);const tag=["manufacturer","marketplace-search"].includes(purpose)?' data-bl-outbound="'+purpose+'"':"";return u.protocol==="https:"?'<a class="'+safe(cls)+'" href="'+safe(u.href)+'"'+tag+' target="_blank" rel="noopener noreferrer">'+safe(label)+' ↗</a>':"";}catch{return "";}};
const yen=n=>new Intl.NumberFormat("ja-JP").format(n)+"円";
const ul=arr=>'<ul>'+arr.map(x=>'<li>'+safe(x)+'</li>').join("")+'</ul>';
if(!item||!ed){$("pageTitle").textContent="製品が見つかりません";$("detailBody").innerHTML='<div class="card"><h2>未登録の製品です</h2><p>この製品はまだ比較対象として確認できていません。型番を確認するか、製品比較ページに戻ってください。</p><a class="btn btn-dark" href="compare.html">製品比較に戻る →</a></div>';return;}
function price(){
 if(!pricing||pricing.status==="unverified")return {main:"公式参考価格：未確認",desc:"メーカーの正式価格と現在の販売条件を確認する必要があります。"};
 if(pricing.currency==="USD")return {main:"$"+pricing.monthly.toFixed(2)+"／ユーザー／月（年払い・税別）",desc:"最低"+pricing.minUsers+"ユーザー。為替・日本の税・請求条件が確定するまで円総額には含めません。"};
 if(pricing.kind==="service")return {main:yen(pricing.monthly)+"／月相当（税込・12か月前払い）",desc:"別途初期費用"+yen(pricing.initial)+"。月額換算料金を毎月払いと誤認しないでください。"};
 return {main:yen(pricing.price)+"（"+pricing.tax+"・メーカー参考価格）",desc:"実売価格・在庫・割引・送料などは販売先で確認してください。"};
}
const media=window.BL_MEDIA?.[id];
function mediaPanel(){
 if(!media||!media.src)return '<div class="product-media-panel"><div class="product-media-missing"><strong>実物写真を確認する</strong><span>転載利用条件が確認できていないため、メーカー公式の製品ギャラリーへ案内します。</span></div>'+ext(item.official,"メーカーの実物写真を見る")+'</div>';
 try{const u=new URL(media.src);if(u.protocol!=="https:")throw Error("Not HTTPS");
 return '<div class="product-media-panel"><figure><img src="'+safe(u.href)+'" alt="'+safe(media.label)+'" loading="eager" decoding="async"><figcaption>'+safe(media.credit)+'</figcaption></figure>'+ext(media.source,"画像のメーカー・掲載元を確認")+'</div>';
 }catch{return "";}
}
const p=price();
const compares=ed.versus.map(v=>{const o=all.find(x=>x.id===v.id);return '<article class="card"><strong>'+safe(o?o.name:"別の選択肢")+'</strong><p>'+safe(v.text)+'</p>'+(o?'<a class="text-link" href="product.html?id='+encodeURIComponent(o.id)+'">こちらの特徴と比較する →</a>':"")+'</article>';}).join("");
const amazon='https://www.amazon.co.jp/s?k='+encodeURIComponent(item.brand+" "+item.model);
const rakuten='https://search.rakuten.co.jp/search/mall/'+encodeURIComponent(item.brand+" "+item.model)+'/';
$("pageTitle").textContent=item.name+"を選ぶ理由";
document.title=item.name+"｜メリット・他機種との違い・価格｜BASELAYER";
$("detailBody").innerHTML='<div class="product-cover-grid"><div class="detail-hero"><div><span class="pill">'+safe(kindLabel[item.kind])+'</span><h2>'+safe(item.name)+'</h2><p class="muted">'+safe(item.subtitle)+'</p><h3>'+safe(ed.headline)+'</h3><p>'+safe(ed.pitch)+'</p></div><div class="detail-pricing"><small>メーカー掲載の参考情報</small><strong>'+safe(p.main)+'</strong><small>'+safe(p.desc)+'</small><p class="smallnote">最終確認：'+safe(window.BL_PRICES?.checked||item.reviewed)+'</p></div></div>'+mediaPanel()+'</div>'+
'<div class="detail-rationale"><h3>なぜこの製品を候補にするのか</h3>'+ul(ed.choose)+'<p class="smallnote">特定の環境への適合が確認されたことを意味しません。利用人数・容量・復旧条件を診断結果と照合してください。</p></div>'+
'<section class="detail-page-section"><h2>他の製品と何が違う？</h2><div class="grid2">'+compares+'</div><p class="smallnote">比較は確認済みの製品仕様や料金体系の違いです。全製品より優れているという意味ではありません。</p></section>'+
'<section class="detail-page-section"><h2>こんな場合は選ばない方がよい</h2><div class="warning">'+ul(ed.notFor)+'</div></section>'+
'<section class="detail-page-section"><h2>主な仕様・条件</h2><table class="learning-table"><tbody>'+Object.entries(item.specs).map(([k,v])=>'<tr><th scope="row">'+safe(k)+'</th><td>'+safe(v)+'</td></tr>').join("")+'</tbody></table><h3>契約・購入前に確認したいこと</h3>'+ul(ed.checks)+'</section>'+
'<section class="detail-page-section"><h2>注意したい制限と運用コスト</h2><p>'+safe(item.limits)+'</p>'+(pricing?'<p>'+safe(pricing.basis||"")+'</p><p class="smallnote">'+safe(pricing.disclaimer||"")+'</p>':"")+'</section>'+
'<section class="detail-page-section"><h2>どこから確認・購入する？</h2><p class="smallnote">メーカー・提供元の公式ページは仕様と契約条件の確認用です。Amazon・楽天は型番の検索結果であり、掲載店が正規販売店であることを保証しません。購入前に販売元・型番・在庫・価格を確認してください。現時点では紹介ID未設定です。</p><div class="action-row">'+ext(item.official,"メーカー・提供元の公式情報（仕様・契約条件）", "btn btn-dark","manufacturer")+(item.kind==="cloud"?"":ext(amazon,"Amazonで型番検索（販売元を確認）","btn btn-outline","marketplace-search")+ext(rakuten,"楽天で型番検索（販売元を確認）","btn btn-outline","marketplace-search"))+'</div></section>'+
'<section class="detail-page-section"><h2>選定根拠・出典</h2><p class="smallnote">出典確認日：'+safe(item.reviewed)+'。製品情報や価格は予告なく変更されます。</p><div class="action-row">'+ed.source.map((u,i)=>ext(u,"メーカー出典 "+(i+1))).join(" ")+(pricing?.source?ext(pricing.source,"価格の公式出典"):"")+'</div></section>'+
'<section class="detail-page-section"><div class="callout"><h3>この製品が自分の環境に必要か確かめる</h3><p>当サイトでは、まず既存の機器・契約を活用できないか確認し、そのうえで保存先やバックアップの構成を整理します。</p><a class="btn btn-dark" href="start.html">環境診断・導入判断レポートへ →</a></div></section>';

/* Keep the strongest evidence above the fold; long specifications stay one click away. */
for(const section of Array.from(document.querySelectorAll(".detail-page-section"))){
 const heading=section.querySelector("h2");
 if(!heading||!["主な仕様・条件","注意したい制限と運用コスト","選定根拠・出典"].includes(heading.textContent.trim()))continue;
 const details=document.createElement("details");details.className="detail-disclosure";
 const summary=document.createElement("summary");
 summary.textContent=heading.textContent.trim()+"を詳しく確認する";
 details.append(summary);
 while(section.firstChild)details.append(section.firstChild);
 const oldHeading=details.querySelector("h2");if(oldHeading)oldHeading.remove();
 section.append(details);
}
})();