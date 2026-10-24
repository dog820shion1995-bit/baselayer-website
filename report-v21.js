"use strict";
(()=>{
const $=s=>document.querySelector(s);
const escapeHTML=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const modelData={
"rtx830":{lan:"4 × 1GbE",wan:"1 × 1GbE",vpn:"IPsec / L2TP/IPsec",throughput:"最大2.0 Gbit/s",source:"https://network.yamaha.com/products/routers/rtx830/spec"},
"rtx810":{lan:"4 × 1GbE",wan:"1 × 1GbE",vpn:"IPsec（詳細は公式資料）",throughput:"最大1.0 Gbit/s",source:"https://network.yamaha.com/products/routers/rtx830"}
};
const cases={office:{name:"小規模オフィス",items:["利用端末数と同時接続数","LAN/WANポート数と回線速度","必要なファイアウォール・VPN機能","保守サポートと販売状況"]},site:{name:"拠点間VPN",items:["両拠点のVPN方式・暗号設定の互換性","必要なVPN対地数・トンネル数","VPNスループットと回線帯域","冗長化・障害時の運用方法"]},remote:{name:"リモートアクセス",items:["対応するリモートアクセス方式","同時接続ユーザー数とライセンス","多要素認証・アクセス制御の実装方法","端末側OS・クライアントの対応状況"]}};
function load(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}}
function exportReport(){
const saved=load("baselayer-research-v16")||{};
const compare=Array.isArray(saved.compare)?saved.compare.slice(0,4):[];
const state=load("baselayer-selection-v20")||{};
const active=Object.hasOwn(cases,state.active)?state.active:"office";
const item=cases[active];const checked=Array.isArray(state.checked?.[active])?state.checked[active]:[];
const date=new Date().toLocaleString("ja-JP");
const rows=compare.map(x=>{const spec=modelData[String(x.model||"").toLowerCase().replace(/[\s_-]/g,"")];const td=v=>"<td>"+escapeHTML(v)+"</td>";const safeSource=spec?.source?'<a href="'+escapeHTML(spec.source)+'" target="_blank" rel="noopener noreferrer">メーカー資料を確認</a>':"未登録";return "<tr>"+[x.model||"未確認",x.brand||"未確認",spec?.lan||"未確認",spec?.wan||"未確認",spec?.vpn||"未確認",spec?.throughput||"未確認",x.memo||"（記入なし）"].map(td).join("")+"<td>"+safeSource+"</td></tr>"}).join("");
const checklist=item.items.map((v,i)=>"<li>"+(checked.includes(i)?"☑ 確認済み":"☐ 未確認")+"　"+escapeHTML(v)+"</li>").join("");
const body=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BASELAYER 選定レポート</title><style>body{font-family:system-ui,-apple-system,'Yu Gothic',sans-serif;color:#163a2e;margin:0;background:#f5f8f6}main{max-width:1050px;margin:30px auto;background:white;padding:40px;border-radius:16px}header{border-bottom:4px solid #163a2e;padding-bottom:20px}h1{font-size:30px}h2{margin-top:38px;font-size:21px}p,li{line-height:1.8}ul{padding-left:20px;list-style:none}li{padding:7px 0}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #d6e5dc;text-align:left;padding:10px;vertical-align:top;overflow-wrap:anywhere}th{background:#e9f4ed}a{color:#166044}.note{background:#eef6f0;padding:15px;border-radius:8px;font-size:12px}.actions{text-align:right}.actions button{background:#163a2e;color:white;padding:12px 20px;border:0;border-radius:8px;cursor:pointer}@media print{body{background:white}main{margin:0;padding:12px;border-radius:0}.actions{display:none}thead{display:table-header-group}tr{break-inside:avoid}}@media(max-width:700px){main{padding:20px;margin:0}table{display:block;overflow-x:auto}}</style></head><body><main><div class="actions"><button onclick="window.print()">印刷・PDF保存</button></div><header><strong>BASELAYER / SELECTION REPORT</strong><h1>IT機器 選定レポート</h1><p>作成日時：${escapeHTML(date)}　｜　用途：${escapeHTML(item.name)}</p></header><h2>1. 用途別チェックリスト</h2><p>確認済み ${checked.filter(i=>Number.isInteger(i)&&i>=0&&i<4).length} / 4項目</p><ul>${checklist}</ul><h2>2. 比較対象機器（${compare.length}件）</h2>${compare.length?'<table><thead><tr><th>型番</th><th>メーカー</th><th>LAN</th><th>WAN</th><th>VPN</th><th>性能</th><th>メモ</th><th>資料</th></tr></thead><tbody>'+rows+'</tbody></table>':'<p>比較対象はまだ登録されていません。</p>'}<h2>3. 確認事項</h2><p class="note">本資料はブラウザ内に保存された利用者のチェック・メモと、BASELAYERに登録された参考データから生成したものです。チェック済みは利用者による確認記録であり、仕様・互換性・用途適合性を保証しません。掲載仕様はメーカーの最新公式資料で再確認してください。価格・在庫・後継機種は自動判定していません。</p></main></body></html>`;
const url=URL.createObjectURL(new Blob([body],{type:"text/html;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="baselayer-selection-report.html";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);$("#v21Status").textContent="レポートの保存を開始しました。保存したHTMLをブラウザで開いて確認してください。";
}
$("#v21Export")?.addEventListener("click",exportReport);
})();