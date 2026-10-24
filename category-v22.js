"use strict";
(()=>{
const $=s=>document.querySelector(s), el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[\s_\-‐‑–—・.]/g,"");
const brandAliases={"ヤマハ":["yamaha"],"Dell":["デル"],"Logicool":["ロジクール","logitech"],"Cisco":["シスコ"],"HPE Aruba Networking":["aruba","アルバ","hpe"],"BUFFALO":["バッファロー"],"ELECOM":["エレコム"],"EPSON":["エプソン"],"Brother":["ブラザー"],"NEC":["日本電気"],"Sanwa Supply":["サンワサプライ","サンワ"]};
const modelKeys=m=>[m.model,m.brand+" "+m.model,...(brandAliases[m.brand]||[]).map(a=>a+" "+m.model),...(m.aliases||[])].map(norm);
const matchesModel=(m,q)=>{const needle=norm(q);if(!needle)return false;const keys=modelKeys(m);return keys.some(k=>k===needle||k.includes(needle)||needle.includes(k))||norm(m.category).includes(needle)};
const cats=[
{id:"router",group:"ネットワーク機器",name:"ルーター",icon:"▣",specs:["LANポート","WANポート","ルーティング性能","VPN方式","VPN性能","IPv6","保守状況"]},
{id:"switch",group:"ネットワーク機器",name:"スイッチ・ハブ",icon:"▦",specs:["ポート数","ポート速度","PoE","スイッチング容量","VLAN","管理方式","保守状況"]},
{id:"ap",group:"ネットワーク機器",name:"無線AP",icon:"◉",specs:["Wi-Fi規格","対応周波数帯","最大通信速度","PoE","管理方式","推奨端末数"]},
{id:"firewall",group:"ネットワーク機器",name:"ファイアウォール",icon:"⬡",specs:["FWスループット","VPN性能","同時セッション","ポート構成","ライセンス","保守状況"]},
{id:"lan",group:"ケーブル・接続部品",name:"LANケーブル",icon:"⌁",specs:["カテゴリ規格","長さ","シールド","コネクタ","導体","PoE対応"]},
{id:"fiber",group:"ケーブル・接続部品",name:"光ケーブル・SFP",icon:"⌁",specs:["規格","伝送距離","コネクタ","速度","波長","互換性"]},
{id:"cable",group:"ケーブル・接続部品",name:"その他ケーブル・変換",icon:"⌁",specs:["接続規格","長さ","対応帯域","端子形状","給電能力"]},
{id:"pc",group:"PC・サーバー・ストレージ",name:"PC",icon:"▤",specs:["CPU","メモリ","ストレージ","OS","接続端子","保証"]},
{id:"server",group:"PC・サーバー・ストレージ",name:"サーバー・NAS",icon:"▥",specs:["CPU","メモリ","ドライブベイ","RAID","ネットワーク","保守"]},
{id:"storage",group:"PC・サーバー・ストレージ",name:"SSD・HDD・メモリ",icon:"▰",specs:["容量","インターフェース","速度","フォームファクター","耐久性"]},
{id:"monitor",group:"ディスプレイ・周辺機器",name:"モニター",icon:"▣",specs:["画面サイズ","解像度","パネル方式","リフレッシュレート","映像入力","USB-C給電","保証"]},
{id:"peripheral",group:"ディスプレイ・周辺機器",name:"入力・周辺機器",icon:"◈",specs:["接続方式","対応OS","給電方式","サイズ","保証"]},
{id:"printer",group:"印刷・映像・会議機器",name:"プリンター・複合機",icon:"▤",specs:["印刷方式","カラー/モノクロ","印刷速度","両面印刷","用紙サイズ","接続方式","ランニングコスト"]},
{id:"meeting",group:"印刷・映像・会議機器",name:"映像・会議機器",icon:"▧",specs:["解像度","接続方式","対応OS","マイク/カメラ","設置方式"]},
{id:"power",group:"設備・電源・アクセサリー",name:"UPS・電源",icon:"ϟ",specs:["定格容量","出力方式","バックアップ時間","コンセント","管理機能"]},
{id:"rack",group:"設備・電源・アクセサリー",name:"ラック・設置用品",icon:"▥",specs:["寸法","耐荷重","対応ラック規格","設置方式","付属品"]}
];
const models=[
{model:"RTX830",brand:"ヤマハ",cat:"router",category:"VPNルーター",memo:"販売状況・VPN条件は公式資料で確認",specs:{"LANポート":"4 × 1GbE","WANポート":"1 × 1GbE","ルーティング性能":"最大2.0 Gbit/s","VPN方式":"IPsec / L2TP/IPsec"},source:"https://network.yamaha.com/products/routers/rtx830/spec"},
{model:"RTX810",brand:"ヤマハ",cat:"router",category:"VPNルーター",memo:"旧機種。仕様と販売状況は公式資料で再確認",specs:{"LANポート":"4 × 1GbE","WANポート":"1 × 1GbE","ルーティング性能":"最大1.0 Gbit/s","VPN方式":"IPsec（詳細は要確認）"}},
{model:"RTX1220",brand:"ヤマハ",cat:"router",category:"VPNルーター",memo:"詳細仕様未登録"},
{model:"U2720Q",brand:"Dell",cat:"monitor",category:"27型4Kモニター",memo:"仕様未登録。公式資料を確認"},
{model:"U2723QE",brand:"Dell",cat:"monitor",category:"27型4Kモニター",memo:"仕様未登録。後継関係は未確認"},
{model:"MX MASTER 3S",brand:"Logicool",cat:"peripheral",category:"ワイヤレスマウス",memo:"仕様未登録"},
{model:"Catalyst 9200",brand:"Cisco",cat:"switch",category:"ネットワークスイッチ",memo:"仕様未登録"},
{model:"Aruba Instant On AP22",brand:"HPE Aruba Networking",cat:"ap",category:"無線アクセスポイント",memo:"仕様未登録"}

,{model:"RTX840",brand:"ヤマハ",cat:"router",category:"VPNルーター",memo:"仕様・販売状況はメーカー公式情報で要確認"}
,{model:"RTX1210",brand:"ヤマハ",cat:"router",category:"VPNルーター",memo:"仕様・販売状況はメーカー公式情報で要確認"}
,{model:"NVR510",brand:"ヤマハ",cat:"router",category:"VoIPルーター",memo:"仕様・販売状況はメーカー公式情報で要確認"}
,{model:"SWX2210-8G",brand:"ヤマハ",cat:"switch",category:"LANスイッチ",memo:"仕様は未登録"}
,{model:"WLX222",brand:"ヤマハ",cat:"ap",category:"無線LANアクセスポイント",memo:"仕様は未登録"}
,{model:"U2724D",brand:"Dell",cat:"monitor",category:"PCモニター",memo:"仕様は未登録"}
,{model:"P2422H",brand:"Dell",cat:"monitor",category:"PCモニター",memo:"仕様は未登録"}
,{model:"P2723DE",brand:"Dell",cat:"monitor",category:"PCモニター",memo:"仕様は未登録"}
,{model:"LSW6-GT-8NS",brand:"BUFFALO",cat:"switch",category:"LANスイッチ",memo:"仕様は未登録"}
,{model:"WAPM-1266R",brand:"BUFFALO",cat:"ap",category:"無線LANアクセスポイント",memo:"仕様は未登録"}
,{model:"LD-GPAT/BU20",brand:"ELECOM",cat:"lan",category:"LANケーブル",memo:"規格・長さ等はメーカー公式資料で確認"}
,{model:"LD-GPAT/BU10",brand:"ELECOM",cat:"lan",category:"LANケーブル",memo:"規格・長さ等はメーカー公式資料で確認"}
,{model:"PX-M6011F",brand:"EPSON",cat:"printer",category:"ビジネスインクジェット複合機",memo:"仕様は未登録"}
,{model:"MFC-L3770CDW",brand:"Brother",cat:"printer",category:"レーザー複合機",memo:"仕様は未登録"}
,{model:"PR-L4C150",brand:"NEC",cat:"printer",category:"レーザープリンター",memo:"仕様は未登録"}
,{model:"ThinkVision T24i-30",brand:"Lenovo",cat:"monitor",category:"PCモニター",memo:"仕様は未登録"}
,{model:"MX KEYS S",brand:"Logicool",cat:"peripheral",category:"ワイヤレスキーボード",memo:"仕様は未登録"}
,{model:"DS220+",brand:"Synology",cat:"server",category:"NAS",memo:"仕様は未登録"}
,{model:"AP22",brand:"HPE Aruba Networking",cat:"ap",category:"無線アクセスポイント",memo:"仕様は未登録"}
];
const cat=id=>cats.find(c=>c.id===id), google=q=>"https://www.google.com/search?q="+encodeURIComponent(q);
const storage="baselayer-research-v16";let data={history:[],compare:[]};
try{const s=JSON.parse(localStorage.getItem(storage)||"null");if(s&&Array.isArray(s.history)&&Array.isArray(s.compare))data={history:s.history.slice(0,8),compare:s.compare.slice(0,4)}}catch{}
const save=()=>{try{localStorage.setItem(storage,JSON.stringify(data))}catch{}};
const categorySelect=$("#v22Category");let lastGroup="";
cats.forEach(c=>{if(c.group!==lastGroup){lastGroup=c.group;const g=el("optgroup");g.label=c.group;categorySelect.append(g)}const o=el("option",c.name);o.value=c.id;categorySelect.lastElementChild.append(o)});
function visual(c){const box=el("div",undefined,"v22-visual v22-"+(c?.id||"unknown"));box.setAttribute("role","img");box.setAttribute("aria-label",(c?.name||"カテゴリ未判定")+"のカテゴリイメージ（実物写真ではありません）");box.append(el("span",c?.icon||"?","v22-visual-icon"),el("small",c?.name||"未判定"));return box}
function external(label,url,desc){const a=el("a",undefined,"research-link");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.append(el("strong",label+" ↗"),el("small",desc));return a}
function renderHistory(){const root=$("#researchHistory");root.replaceChildren();if(!data.history.length){root.append(el("span","検索すると履歴が表示されます。","hint"));return}data.history.forEach(q=>{const b=el("button",q);b.type="button";b.onclick=()=>run(q);root.append(b)})}
function addCompare(m){if(data.compare.some(x=>norm(x.model)===norm(m.model))){$("#compareStatus").textContent="比較表に登録済みです。";return}if(data.compare.length>=4){$("#compareStatus").textContent="比較は4件までです。";return}data.compare.push({...m,memo:m.memo||""});save();renderCompare();$("#compareStatus").textContent=m.model+" を比較に追加しました。"}
function getModel(x){return models.find(m=>norm(m.model)===norm(x.model))||x}
function renderCompare(){const root=$("#compareRows");root.replaceChildren();$("#v19CompareCount").textContent=data.compare.length+" / 4件";const detail=$("#v22CompareSpecs");detail.replaceChildren();if(!data.compare.length){const tr=el("tr"),td=el("td","製品を検索して「比較に追加」を押してください。");td.colSpan=6;tr.append(td);root.append(tr);return}
const categoryIds=[...new Set(data.compare.map(x=>getModel(x).cat).filter(Boolean))];if(categoryIds.length>1)detail.append(el("p","異なるカテゴリの製品が含まれています。仕様の優劣はカテゴリ内で確認してください。","v22-warning"));
data.compare.forEach((x,i)=>{const m=getModel(x),c=cat(m.cat),tr=el("tr"),name=el("td");name.append(el("strong",x.model));if(m.source)name.append(external("公式資料",m.source,"出典を確認"));tr.append(name,el("td",x.brand||m.brand||"未確認"),el("td",c?.name||"未判定"));const spec=el("td");const entries=Object.entries(m.specs||{});spec.textContent=entries.length?entries.slice(0,3).map(([k,v])=>k+"："+v).join(" / "):"仕様未登録";tr.append(spec);const note=el("td"),input=el("input");input.value=x.memo||"";input.maxLength=180;input.setAttribute("aria-label",x.model+"のメモ");input.oninput=()=>{data.compare[i].memo=input.value;save()};note.append(input);tr.append(note);const action=el("td"),b=el("button","削除");b.type="button";b.onclick=()=>{data.compare.splice(i,1);save();renderCompare()};action.append(b);tr.append(action);root.append(tr)});
categoryIds.forEach(id=>{const c=cat(id);if(!c)return;const block=el("section",undefined,"v22-spec-group");block.append(el("h3",c.name+"の比較項目"));const table=el("table",undefined,"v22-detail-table"),thead=el("tr");thead.append(el("th","比較項目"));const matches=data.compare.filter(x=>getModel(x).cat===id);matches.forEach(x=>thead.append(el("th",x.model)));table.append(thead);c.specs.forEach(field=>{const tr=el("tr");tr.append(el("th",field));matches.forEach(x=>{const m=getModel(x),v=m.specs?.[field],td=el("td",v||"未確認");if(!v)td.className="v22-unknown";tr.append(td)});table.append(tr)});block.append(table);detail.append(block)})}
function infer(q){const s=q.toLowerCase();const rules=[[/lanケーブル|ethernet cable|cat\s*[568](?:a|e)?\b|rj-?45/,"lan"],[/hdmiケーブル|usb.?cケーブル|displayportケーブル|変換アダプタ/,"cable"],[/光ケーブル|sfp\+?|光ファイバ/,"fiber"],[/プリンター|複合機|printer|laserjet|pixma|colorio/,"printer"],[/モニター|ディスプレイ|monitor|ultrasharp|thinkvision/,"monitor"],[/アクセスポイント|無線ap|access point/,"ap"],[/スイッチングハブ|ネットワークスイッチ|switching hub/,"switch"],[/ファイアウォール|firewall/,"firewall"],[/ルーター|router/,"router"],[/ups|無停電電源/,"power"],[/nas|サーバー|server/,"server"],[/キーボード|マウス|webカメラ/,"peripheral"]];return rules.find(([r])=>r.test(s))?.[1]||null}
function run(raw){const q=String(raw).normalize("NFKC").trim().replace(/\s+/g," ").slice(0,100);if(!q)return;$("#searchInput").value=q;data.history=[q,...data.history.filter(x=>norm(x)!==norm(q))].slice(0,8);save();renderHistory();const root=$("#searchResults");root.replaceChildren();const chosen=categorySelect.value;const matches=models.filter(m=>(chosen==="all"||m.cat===chosen)&&matchesModel(m,q));
root.append(el("h3",matches.length?"登録済み参考データ（"+matches.length+"件）":"登録データなし・調査案内","research-results-heading"));
recordSearch(q,!!matches.length);
if(matches.length){const grid=el("div",undefined,"v16-result-grid");matches.forEach(m=>{const card=el("article",undefined,"v16-result-card");card.append(visual(cat(m.cat)));const details=el("div",undefined,"v18-device-details");details.append(el("small",cat(m.cat)?.group+" / "+cat(m.cat)?.name),el("h3",m.model),el("p",m.brand+" · "+m.category));const specs=el("div",undefined,"v17-specs");const entries=Object.entries(m.specs||{});if(entries.length)entries.slice(0,3).forEach(([k,v])=>specs.append(el("span",k+"："+v)));else specs.append(el("span","仕様：未登録"));details.append(specs,el("small",m.memo||""));if(m.source)details.append(external("メーカー公式資料",m.source,"掲載内容は公式資料で再確認"));const b=el("button","＋ 比較に追加");b.type="button";b.onclick=()=>addCompare(m);details.append(b);card.append(details);grid.append(card)});root.append(grid)}else{const guessed=chosen!=="all"?chosen:infer(q),c=cat(guessed);const msg=el("div",undefined,"v22-unregistered");msg.append(visual(c),el("h3","この型番はBASELAYERに未登録です。"),el("p",c?"カテゴリ候補："+c.name+"（型番の製品特定・仕様確認は未実施）":"カテゴリを判別できませんでした。上のカテゴリ欄から選択して再検索できます。"),el("p","未登録の型番について、実物画像や仕様を推測して表示しません。"));root.append(msg);const help=el("div",undefined,"v23-search-help");help.append(el("strong","型番が見つからない場合"),el("p","メーカー名と型番を組み合わせるか、カテゴリを選択してください。公式検索リンクから調査できます。"));const b=el("button","カテゴリを指定する");b.type="button";b.onclick=()=>{categorySelect.focus();categorySelect.scrollIntoView({behavior:"smooth",block:"center"})};help.append(b);root.append(help)}
const panel=el("section",undefined,"research-panel");panel.append(el("h3","「"+q+"」の調査リンク"),el("p","検索リンクは調査用です。メーカー・仕様・販売終了・後継機を自動認定しません。","hint"));const links=el("div",undefined,"research-grid");links.append(external("メーカー公式資料を探す",google('"'+q+'" 公式 仕様'),"公式仕様・PDFを確認"),external("販売状況・後継候補",google('"'+q+'" 販売終了 後継'),"メーカー公表情報で確認"),external("類似製品を調査",google('"'+q+'" 比較 代替'),"互換性は別途確認"),external("Amazonで商品を検索","https://www.amazon.co.jp/s?k="+encodeURIComponent(q),"価格・在庫は販売ページで確認／非アフィリエイト"));panel.append(links);root.append(panel);history.replaceState(null,"",location.pathname+"?q="+encodeURIComponent(q))}
const statsKey="baselayer-search-stats-v23";
let stats={total:0,found:0,missed:0};try{const x=JSON.parse(localStorage.getItem(statsKey)||"null");if(x&&Number.isInteger(x.total)&&Number.isInteger(x.found)&&Number.isInteger(x.missed))stats=x}catch{}
function renderStats(){const box=$("#v23Stats");if(!box)return;box.textContent="登録済み型番 "+models.length+"件 ／ このブラウザの検索 "+stats.total+"回（登録済みヒット "+stats.found+"回・未登録 "+stats.missed+"回）"}
function recordSearch(q,found){stats.total++;stats[found?"found":"missed"]++;try{localStorage.setItem(statsKey,JSON.stringify(stats))}catch{}renderStats()}
function renderCategories(){const root=$("#v22CategorySummary");root.replaceChildren();const groups=[...new Set(cats.map(x=>x.group))];groups.forEach(g=>{const section=el("section",undefined,"v22-category-group");section.append(el("strong",g));const chips=el("div",undefined,"v22-category-chips");cats.filter(c=>c.group===g).forEach(c=>{const b=el("button",c.name);b.type="button";b.onclick=()=>{categorySelect.value=c.id;$("#searchInput").focus();if($("#searchInput").value.trim())run($("#searchInput").value)};chips.append(b)});section.append(chips);root.append(section)})}
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();run($("#searchInput").value)});
categorySelect.onchange=()=>{if($("#searchInput").value.trim())run($("#searchInput").value)};
document.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>{categorySelect.value="all";run(b.dataset.quick)});
$("#clearHistory").onclick=()=>{data.history=[];save();renderHistory()};
$("#exportCompare").onclick=()=>{if(!data.compare.length){$("#compareStatus").textContent="先に比較候補を追加してください。";return}const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';const rows=[["型番","メーカー","カテゴリ","比較項目","値","メモ"]];data.compare.forEach(x=>{const m=getModel(x),c=cat(m.cat);c?.specs.forEach(f=>rows.push([x.model,x.brand,c.name,f,m.specs?.[f]||"未確認",x.memo||""]))});const csv="\uFEFF"+rows.map(row=>row.map(quote).join(",")).join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=el("a");a.href=url;a.download="baselayer-category-comparison.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)};
const guide={office:{title:"小規模オフィスで確認したいこと",intro:"人数・端末台数・回線速度から必要条件を整理します。",checks:["利用端末数と同時接続数","LAN/WANポート数と回線速度","必要なファイアウォール・VPN機能","保守サポートと販売状況"]},site:{title:"拠点間VPNで確認したいこと",intro:"拠点間の通信要件を整理します。",checks:["両拠点のVPN方式・暗号設定の互換性","必要なVPN対地数・トンネル数","VPNスループットと回線帯域","冗長化・障害時の運用方法"]},remote:{title:"リモートアクセスで確認したいこと",intro:"利用者と認証・セキュリティ要件を整理します。",checks:["対応するリモートアクセス方式","同時接続ユーザー数とライセンス","多要素認証・アクセス制御の実装方法","端末側OS・クライアントの対応状況"]}};
const stateKey="baselayer-selection-v20";let state={active:"office",checked:{office:[],site:[],remote:[]}};try{const s=JSON.parse(localStorage.getItem(stateKey)||"null");if(s&&guide[s.active]&&s.checked){state.active=s.active;Object.keys(guide).forEach(k=>state.checked[k]=Array.isArray(s.checked[k])?s.checked[k].filter(n=>Number.isInteger(n)&&n>=0&&n<4):[])}}catch{}
const saveState=()=>{try{localStorage.setItem(stateKey,JSON.stringify(state))}catch{}};
function showGuide(k){state.active=k;saveState();const c=guide[k];$("#v19GuideTitle").textContent=c.title;$("#v19GuideIntro").textContent=c.intro;const root=$("#v19GuideChecks");root.replaceChildren();c.checks.forEach((v,i)=>{const li=el("li"),label=el("label",undefined,"v20-check"),cb=el("input");cb.type="checkbox";cb.checked=state.checked[k].includes(i);cb.onchange=()=>{const s=new Set(state.checked[k]);cb.checked?s.add(i):s.delete(i);state.checked[k]=[...s].sort();saveState();updateSummary()};label.append(cb,document.createTextNode(v));li.append(label);root.append(li)});document.querySelectorAll("[data-usecase]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.usecase===k)));updateSummary()}
function updateSummary(){const c=guide[state.active],n=state.checked[state.active].length;$("#v20Progress").textContent="確認済み "+n+" / 4項目（このブラウザに保存）";$("#v20CompareContext").textContent="選択用途："+c.title.replace("で確認したいこと","")+" ／ 確認済み "+n+" / 4項目。未チェックは不適合を意味しません。"}
$("#v20Reset").onclick=()=>{state.checked[state.active]=[];saveState();showGuide(state.active)};
document.querySelectorAll("[data-usecase]").forEach(b=>b.onclick=()=>showGuide(b.dataset.usecase));
$("#v19JumpCompare").onclick=()=>$(".compare-workspace").scrollIntoView({behavior:"smooth"});
renderCategories();renderStats();renderHistory();renderCompare();showGuide(state.active);const initial=new URLSearchParams(location.search).get("q");if(initial)run(initial);
})();
