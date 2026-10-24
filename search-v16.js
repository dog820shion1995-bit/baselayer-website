"use strict";
(()=>{
const $=s=>document.querySelector(s);
const models=[
 {model:"RTX830",brand:"ヤマハ",category:"VPNルーター",memo:"公式仕様・販売状況を要確認"},
 {model:"RTX1220",brand:"ヤマハ",category:"VPNルーター",memo:"RTX830との互換性・後継関係は未確認"},
 {model:"U2720Q",brand:"Dell",category:"27型4Kモニター",memo:"USB-C給電・接続仕様を確認"},
 {model:"U2723QE",brand:"Dell",category:"27型4Kモニター",memo:"U2720Qの公式後継認定ではありません"},
 {model:"MX MASTER 3S",brand:"Logicool",category:"ワイヤレスマウス",memo:"OS対応と接続方式を確認"},
 {model:"Catalyst 9200",brand:"Cisco",category:"ネットワークスイッチ",memo:"ライセンス・ポート構成を確認"},
 {model:"Aruba Instant On AP22",brand:"HPE Aruba Networking",category:"無線アクセスポイント",memo:"PoE給電・管理方式を確認"}
];
const normalize=s=>String(s).normalize("NFKC").toLowerCase().replace(/[\s_-]/g,"");
const key="baselayer-research-v16";
let data={history:[],compare:[]};
try{const stored=JSON.parse(localStorage.getItem(key)||"null");if(stored&&Array.isArray(stored.history)&&Array.isArray(stored.compare))data={history:stored.history.slice(0,8),compare:stored.compare.slice(0,4)}}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch{}};
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const google=q=>"https://www.google.com/search?q="+encodeURIComponent(q);
const ext=(label,url,description)=>{const a=el("a",undefined,"research-link");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.append(el("strong",label+" ↗"),el("small",description));return a};
function renderHistory(){const root=$("#researchHistory");root.replaceChildren();if(!data.history.length){root.append(el("span","検索すると、最近の型番がここに表示されます。","hint"));return}data.history.forEach(q=>{const b=el("button",q);b.type="button";b.addEventListener("click",()=>run(q));root.append(b)})}
function addCompare(item){if(data.compare.some(x=>normalize(x.model)===normalize(item.model))){$("#compareStatus").textContent="すでに比較表に登録されています。";return}if(data.compare.length>=4){$("#compareStatus").textContent="比較できるのは4件までです。先に不要な候補を削除してください。";return}data.compare.push({...item,memo:item.memo||""});save();renderCompare();$("#compareStatus").textContent=item.model+" を比較に追加しました。"}
function renderCompare(){const root=$("#compareRows");root.replaceChildren();if(!data.compare.length){const tr=el("tr");const td=el("td","製品を検索して「比較に追加」を押してください。");td.colSpan=4;tr.append(td);root.append(tr);return}data.compare.forEach((item,i)=>{const tr=el("tr");tr.append(el("td",item.model),el("td",item.brand||"未確認"));const cell=el("td");const input=el("input");input.value=item.memo||"";input.maxLength=180;input.setAttribute("aria-label",item.model+"のメモ");input.addEventListener("change",()=>{data.compare[i].memo=input.value;save()});cell.append(input);tr.append(cell);const action=el("td");const b=el("button","削除");b.type="button";b.addEventListener("click",()=>{data.compare.splice(i,1);save();renderCompare()});action.append(b);tr.append(action);root.append(tr)})}
function run(raw){const q=String(raw).normalize("NFKC").trim().replace(/\s+/g," ").slice(0,100);if(!q)return;$("#searchInput").value=q;data.history=[q,...data.history.filter(x=>normalize(x)!==normalize(q))].slice(0,8);save();renderHistory();const root=$("#searchResults");root.replaceChildren();const matches=models.filter(m=>normalize(m.model+" "+m.brand+" "+m.category).includes(normalize(q)));root.append(el("h3",matches.length?"登録済み参考データ（"+matches.length+"件）":"登録データなし・外部調査を続ける","research-results-heading"));if(matches.length){const grid=el("div",undefined,"v16-result-grid");matches.forEach(m=>{const card=el("article",undefined,"v16-result-card");card.append(el("span",m.brand,"eyebrow"),el("h4",m.model),el("p",m.category),el("small",m.memo));const b=el("button","＋ 比較に追加");b.type="button";b.addEventListener("click",()=>addCompare(m));card.append(b);grid.append(card)});root.append(grid)}else root.append(el("p","現在の登録データにはありません。下のリンクからメーカー情報や候補を調査できます。","hint"));const panel=el("section",undefined,"research-panel");panel.append(el("h3","「"+q+"」の調査リンク"),el("p","外部サイトで検索します。仕様・互換性・後継関係は公式資料で必ず確認してください。","hint"));const grid=el("div",undefined,"research-grid");grid.append(ext("メーカー公式資料を探す",google('"'+q+'" メーカー 公式 仕様 PDF'),"公式情報を優先して確認"),ext("販売終了・後継候補",google('"'+q+'" 販売終了 後継機種'),"後継関係は自動判定しません"),ext("同等品・代替候補",google('"'+q+'" 同等品 代替 比較'),"仕様や互換性を個別に確認"),ext("販売情報を調べる","https://www.amazon.co.jp/s?k="+encodeURIComponent(q),"Amazonの通常検索・アフィリエイト未設定"));panel.append(grid);root.append(panel);history.replaceState(null,"",location.pathname+"?q="+encodeURIComponent(q));}
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();run($("#searchInput").value)});
document.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>run(b.dataset.quick)));
$("#clearHistory").addEventListener("click",()=>{data.history=[];save();renderHistory()});
$("#exportCompare").addEventListener("click",()=>{if(!data.compare.length){$("#compareStatus").textContent="先に比較候補を追加してください。";return}const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';const csv="\uFEFF"+["型番,メーカー,用途,メモ",...data.compare.map(x=>[x.model,x.brand,x.category,x.memo].map(quote).join(","))].join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=el("a");a.href=url;a.download="baselayer-comparison.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)});
renderHistory();renderCompare();const initial=new URLSearchParams(location.search).get("q");if(initial)run(initial);
})();
