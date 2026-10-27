(() => {
"use strict";
const $=id=>document.getElementById(id);
const escape=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const items=Array.isArray(window.BL_STORAGE_ITEMS)?window.BL_STORAGE_ITEMS:[];
const group={cloud:"クラウド",nas:"NAS",hdd:"外付けHDD・SSD"};
const editorial=window.BL_EDITORIAL||{},pricing=window.BL_PRICES?.entries||{};
let kind=new URLSearchParams(location.search).get("kind")||"all";
if(!["all","cloud","nas","hdd"].includes(kind))kind="all";
let query="",selected=[];
const ext=(url,label)=>{try{let u=new URL(url);if(u.protocol!=="https:")return "";return '<a href="'+escape(u.href)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+' ↗</a>';}catch{return "";}};
function draw(){
document.querySelectorAll("button[data-kind]").forEach(b=>{const on=b.dataset.kind===kind;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});
const filtered=items.filter(p=>(kind==="all"||p.kind===kind)&&[p.name,p.brand,p.model,p.subtitle].join(" ").normalize("NFKC").toLowerCase().includes(query.normalize("NFKC").toLowerCase()));
$("catalogStatus").textContent=filtered.length+"件の候補を表示 / 初期登録"+items.length+"件";
$("catalogItems").innerHTML=filtered.length?filtered.map(p=>{
const checked=selected.includes(p.id);
const amazon="https://www.amazon.co.jp/s?k="+encodeURIComponent(p.brand+" "+p.model);
const rakuten="https://search.rakuten.co.jp/search/mall/"+encodeURIComponent(p.brand+" "+p.model)+"/";
return '<article class="catalog-item"><span class="pill">'+escape(group[p.kind])+'</span><h3>'+escape(p.name)+'</h3><p>'+escape(p.subtitle)+'</p><p>'+escape(p.feature)+'</p><p class="smallnote"><strong>比較候補にする理由：</strong>'+escape(editorial[p.id]?.pitch||"利用目的に応じて比較")+'</p><a href="product.html?id='+encodeURIComponent(p.id)+'">選定理由・他製品との違い・価格を詳しく見る →</a><details><summary style="cursor:pointer;font-weight:800;font-size:12px">仕様・注意点を確認する</summary><table class="learning-table"><tbody>'+Object.entries(p.specs||{}).map(([k,v])=>'<tr><th>'+escape(k)+'</th><td>'+escape(v)+'</td></tr>').join("")+'</tbody></table><p class="warning">'+escape(p.limits)+'</p><p class="smallnote">確認日：'+escape(p.reviewed)+' / '+ext(p.source,"メーカー公式情報")+'</p></details><div class="action-row">'+ext(p.official,"公式情報・申込先")+ (p.kind==="cloud"?"":ext(amazon,"Amazonで型番検索")+ext(rakuten,"楽天で型番検索"))+'</div><label><input type="checkbox" data-compare="'+escape(p.id)+'" '+(checked?"checked":"")+' aria-label="'+escape(p.name)+'を比較する"> 比較に'+(checked?"追加済み":"追加")+'</label><small>公式リンク・検索リンク。正式なアフィリエイトID未設定。価格・在庫は販売先で要確認。</small></article>';
}).join(""):'<p class="card">該当する商品が見つかりませんでした（未登録）。キーワードやカテゴリを変えてください。</p>';
drawComparison();
}
function drawComparison(){
const chosen=selected.map(id=>items.find(p=>p.id===id)).filter(Boolean);
$("selectedProducts").textContent="選択中："+(chosen.length?chosen.map(p=>p.model).join(" / "):"なし")+"（最大3件）";
if(chosen.length<2){$("compareTable").innerHTML='<p class="smallnote">2件以上選ぶと比較表が表示されます。</p>';return;}
const keys=[...new Set(chosen.flatMap(p=>Object.keys(p.specs||{})))];
$("compareTable").innerHTML='<table class="compare-table"><thead><tr><th>比較項目</th>'+chosen.map(p=>'<th>'+escape(p.model)+'</th>').join("")+'</tr></thead><tbody><tr><th>カテゴリ</th>'+chosen.map(p=>'<td>'+escape(group[p.kind])+'</td>').join("")+'</tr>'+
keys.map(k=>'<tr><th>'+escape(k)+'</th>'+chosen.map(p=>'<td>'+escape(p.specs?.[k]||"未登録")+'</td>').join("")+'</tr>').join("")+'</tbody></table><p class="smallnote">種類の異なる製品同士では必要な仕様が異なります。メーカーの互換性・購入条件を必ず確認してください。</p>';
}
$("catalogQuery").addEventListener("input",ev=>{query=ev.target.value.trim();draw();});
document.querySelectorAll("button[data-kind]").forEach(b=>b.addEventListener("click",()=>{kind=b.dataset.kind;draw();}));
$("catalogItems").addEventListener("change",ev=>{
const cb=ev.target.closest('input[data-compare]');if(!cb)return;
const id=cb.dataset.compare;
if(cb.checked&&!selected.includes(id)){if(selected.length>=3){cb.checked=false;window.alert("比較できるのは最大3件です。");return;}selected.push(id);}
if(!cb.checked)selected=selected.filter(x=>x!==id);
draw();
});
draw();
})();