/* BASELAYER 2026: transparent, rule-based planning. No third-party analytics or request. */
(() => {
"use strict";
const byId=id=>document.getElementById(id);
const escape=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const label=(dict,value)=>dict[value]||"不明";
const amount=n=>new Intl.NumberFormat("ja-JP").format(n)+"円";
const products=Array.isArray(window.BL_STORAGE_ITEMS)?window.BL_STORAGE_ITEMS:[];
const goals={share:"複数人でファイルを共有したい",office:"共有の保存場所・容量を確保したい",backup:"大切なデータをバックアップしたい"};
const peopleMap={one:"1人",small:"2〜5人",medium:"6〜20人",large:"21人以上"};
const capacityMap={tiny:"100GB未満",small:"100GB〜1TB",medium:"1〜4TB",large:"4TB超"};
const state={step:1,goal:new URLSearchParams(location.search).get("goal")||"share",people:"small",capacity:"small",remote:"yes",already:"none",admin:"no",backup:"unknown",deviceCost:"",setupCost:"",monthlyCost:""};
if(!Object.prototype.hasOwnProperty.call(goals,state.goal))state.goal="share";
const card=(name,value,title,desc,checked)=>'<label class="option-card"><input type="radio" name="'+escape(name)+'" value="'+escape(value)+'" '+(checked===value?"checked":"")+'><span><strong>'+escape(title)+'</strong><small>'+escape(desc)+'</small></span></label>';
const selects=(key,title,options,help)=>'<div class="field-row"><label for="field_'+escape(key)+'">'+escape(title)+'</label><select id="field_'+escape(key)+'" data-field="'+escape(key)+'">'+options.map(([v,t])=>'<option value="'+escape(v)+'" '+(state[key]===v?"selected":"")+'>'+escape(t)+'</option>').join("")+'</select>'+(help?'<small>'+escape(help)+'</small>':"")+'</div>';
const actions=(prev,next,nextText)=>'<div class="wiz-actions">'+(prev?'<button type="button" class="btn btn-ghost" data-action="back">← 前に戻る</button>':'<a class="btn btn-ghost" href="index.html">← ホームへ</a>')+'<button type="button" class="btn btn-dark" data-action="next">'+escape(nextText||"次へ進む")+' →</button></div>';
function stepOne(){
return '<div class="wizard-counter">STEP 01 / 04　目的を決める</div><h2 id="wizardTitle">最初に、何を解決したいですか？</h2><p>ストレージの製品名ではなく、今の困りごとを選んでください。</p>'+
'<div class="option-grid">'+card("goal","share","ファイルを共有したい","社員・家族・外出先から同じファイルを使いたい",state.goal)+card("goal","office","保存先・容量を確保したい","保存場所をまとめる、容量不足を解消したい",state.goal)+card("goal","backup","データを守りたい","故障・紛失・誤削除から復元できるようにしたい",state.goal)+'</div>'+
'<div class="callout" style="margin-top:18px"><strong>ここが大切：</strong>共有とバックアップは異なる目的です。目的に応じて必要な保存方法が変わります。</div>'+actions(false,true,"利用環境を入力");
}
function stepTwo(){
return '<div class="wizard-counter">STEP 02 / 04　使い方を整理</div><h2 id="wizardTitle">どのくらいの人数・データを扱いますか？</h2><p>詳しい数値が分からない場合は、おおよそで問題ありません。</p>'+
selects("people","利用人数",[["one","1人"],["small","2〜5人"],["medium","6〜20人"],["large","21人以上"]])+
selects("capacity","いま保存したいデータの合計容量",[["tiny","100GB未満"],["small","100GB〜1TB"],["medium","1〜4TB"],["large","4TB超"]],"新しい保存先には、今後増える分の余裕も必要です。")+
selects("remote","社外・自宅・出張先からの利用",[["yes","必要"],["no","基本的に不要"],["unknown","まだ分からない"]])+
actions(true,true,"運用状況を確認");
}
function stepThree(){
return '<div class="wizard-counter">STEP 03 / 04　今ある環境と安全性</div><h2 id="wizardTitle">追加購入が必要かどうかも考えます。</h2><p>既に使えるものがあれば、新しく買わなくてよい場合もあります。</p>'+
selects("already","すでに契約しているサービス",[["none","特になし・不明"],["m365","Microsoft 365 / OneDrive 等"],["google","Google Workspace / Google Drive 等"],["other","その他の共有ストレージ"]],"既存のプランと権限・容量・バックアップ条件を確認してから追加購入を検討します。")+
selects("admin","機器の設定・障害対応ができる人",[["no","担当者がいない／自信がない"],["yes","担当者がいる／対応できる"],["unknown","分からない"]])+
selects("backup","別の場所から復元できるバックアップ",[["unknown","確認していない・分からない"],["none","ない"],["yes","ある（復元テスト済み）"]])+
'<div class="warning">個人情報・業務機密・規制対象のデータは、必要な法令や契約上の条件を別途確認してください。診断だけで安全性を保証するものではありません。</div>'+
actions(true,true,"構成案と費用を見る");
}
function classify(){
const {goal,remote,admin,capacity,already,people,backup}=state;
let kind="cloud",reason="",backupKind="hdd";
if(goal==="backup"){kind="hdd";reason="データを復元する目的では、作業中の元データとは別の保存先と運用方法の確認が先決です。外付けドライブから検討できます。";}
else if(goal==="share"){
 if(remote==="no"&&admin==="yes"){kind="nas";reason="社内だけでファイルを共有し、運用担当者がいるため、NASを候補として比較できます。クラウドも代替候補です。";}
 else {kind="cloud";reason=remote==="yes"?"離れた場所から複数人で使いたい場合、クラウドストレージは有力な比較候補です。":"管理の負担を抑えたい場合は、クラウドストレージから比較すると考えやすくなります。";}
}else{
 if(admin==="yes"&&remote==="no"){kind="nas";reason="機器を管理でき、社内中心で保存場所を増やすならNASを検討できます。HDDの有無と独立したバックアップが重要です。";}
 else {kind="cloud";reason="自社での機器運用が難しい、または社外利用も必要な場合は、クラウドを中心に比較できます。";}
}
const existing=already!=="none";
const highCapacity=capacity==="large";
const team=people==="large";
const needsBackup=backup!=="yes";
const flags=[];
if(existing&&kind==="cloud")flags.push("すでに使っているクラウドの容量・権限・利用条件で足りるなら、追加契約は不要な場合があります。");
if(highCapacity)flags.push("4TB超の容量が必要です。掲載サービスの単一プランで収まるとは限らないため、提供会社の上位プラン・容量条件を必ず確認してください。");
if(team)flags.push("21人以上での利用です。契約条件・権限管理・管理責任者・問い合わせ窓口を詳しく確認してください。");
if(needsBackup)flags.push("復元できるバックアップの整備・復元テストを購入判断に含めてください。");
if(kind==="nas")flags.push("NASは必要なHDDが同梱されているか、互換性はあるかを必ず確認してください。RAIDはバックアップの代わりになりません。");
if(goal==="backup")flags.push("外付けHDD1台だけでは破損・盗難・災害対策として十分でない場合があります。別の場所にもコピーを確保してください。");
return {kind,reason,backupKind,flags,existing,needsBackup};
}
function link(url,text,klass=""){
try{const u=new URL(url,location.href);if(u.protocol!=="https:")return "";return '<a class="'+escape(klass)+'" href="'+escape(u.href)+'" target="_blank" rel="noopener noreferrer">'+escape(text)+' ↗</a>';}catch{return "";}
}
function productCard(p){
const cloud=p.kind==="cloud";
const amazon='https://www.amazon.co.jp/s?k='+encodeURIComponent(p.brand+' '+p.model);
const rakuten='https://search.rakuten.co.jp/search/mall/'+encodeURIComponent(p.brand+' '+p.model)+'/';
return '<div class="spec-item"><strong>'+escape(p.brand)+' '+escape(p.model)+'</strong><p>'+escape(p.subtitle)+'</p><p>'+escape(p.feature)+'</p>'+
'<div class="action-row">'+link(p.official,'メーカー・提供元で仕様・料金を確認','text-link')+(cloud?'':link(amazon,'Amazonで型番検索','text-link')+link(rakuten,'楽天で型番検索','text-link'))+'</div>'+
'<p class="smallnote">紹介契約・購入可能性・最新価格・互換性は未確認。販売先では型番と契約条件を必ずご確認ください。</p></div>';
}
function moneyNumber(k){let s=String(state[k]||"").trim();if(!/^\d{1,9}$/.test(s))return null;const n=Number(s);return Number.isSafeInteger(n)?n:null;}
function totals(){
const keys=["deviceCost","setupCost","monthlyCost"];const n=keys.map(moneyNumber);
const filled=n.filter(v=>v!==null).length;
const initial=n[0]===null||n[1]===null?null:n[0]+n[1];
const year=initial===null||n[2]===null?null:initial+12*n[2];
byId("estimateInitial").textContent=initial===null?"未入力":amount(initial);
byId("estimateYear").textContent=year===null?"未入力":amount(year);
byId("estimateNote").textContent=filled<3?"入力されていない費用があるため、全体の合計は表示していません。分かる範囲で各販売先の価格を入力してください。":"入力された金額だけを使った初年度の試算です。税・送料・割引・更新費用等は入力額に含む場合のみ反映されます。";
}
function result(){
const result=classify();const names={cloud:"クラウドストレージを中心に比較",nas:"NASの構成を中心に比較",hdd:"独立したバックアップ先を検討"};
const why=result.existing&&result.kind==="cloud"?"既存サービスを先に確認":"比較の出発点";
const row=(caption,text)=>'<div class="reason-card"><b>'+escape(caption)+'</b><p>'+escape(text)+'</p></div>';
const relevant=products.filter(p=>p.kind===result.kind).slice(0,3);
const alternates=result.kind==="nas"?products.filter(p=>p.kind==="hdd").slice(0,1):result.kind==="cloud"?products.filter(p=>p.kind==="hdd").slice(0,1):products.filter(p=>p.kind==="cloud").slice(0,1);
return '<div class="wizard-counter">STEP 04 / 04　診断結果・費用・購入準備</div><div class="result-heading"><div><span class="result-tag">YOUR STORAGE PLAN</span><h2 id="wizardTitle">保存環境の整理結果</h2><p>判断の理由と、確認すべき候補を順番にまとめました。</p></div><span class="pill">入力に基づく参考案</span></div>'+
'<div class="rec-block"><span class="eyebrow">'+escape(why)+'</span><h3>'+escape(names[result.kind])+'</h3><p>'+escape(result.reason)+'</p></div>'+
'<div class="result-grid">'+row("選んだ目的",goals[state.goal])+row("使い方",label(peopleMap,state.people)+" / "+label(capacityMap,state.capacity)+" / 社外アクセス："+(state.remote==="yes"?"必要":state.remote==="no"?"不要":"未定"))+'</div>'+
'<h3 style="margin-top:30px">1. なぜこの方法？</h3><div class="callout">'+escape(result.reason)+'<br>保存・共有と、復元のためのバックアップは別に考えましょう。必要に応じて組み合わせます。'+(result.kind==="nas"?" NASのRAIDだけでは消去や災害に備えられません。":"")+'</div>'+
'<h3 style="margin-top:29px">2. 導入前に必ず確認すること</h3><ul style="line-height:1.9;padding-left:20px;font-size:12px">'+[...result.flags,"現時点の料金・サポート・契約期間・購入先の条件を公式サイトで確認すること。"].map(x=>'<li>'+escape(x)+'</li>').join("")+'</ul>'+
'<h3 style="margin-top:29px">3. 比較候補と購入先</h3><p class="muted" style="font-size:12px">以下は同じカテゴリの確認候補であり、適合や順位を保証したおすすめ製品ではありません。</p><div class="spec-list">'+relevant.map(productCard).join("")+'</div>'+
'<div class="callout" style="margin-top:14px"><b>もう一つの選択肢</b><p>同じ目的でも別の方法で実現できる場合があります。'+(result.kind==="cloud"?"オンプレミスで管理できるならNASも比較します。":result.kind==="nas"?"社外利用や運用の手間を減らしたい場合はクラウドも比較します。":"複数の端末を自動で保護するなら専用のバックアップサービスも検討できます。")+'</p>'+link("https://www.synology.com/ja-jp/dsm/solution/data_backup","3-2-1のバックアップの考え方を見る")+'</div>'+
'<div class="estimate" id="estimate"><h3>4. 費用をシミュレーション</h3><p>各販売先に表示される実際の税込金額を入力して概算を出せます。未確認の価格をBASELAYERが自動入力することはありません。</p>'+
'<div class="estimate-grid"><label>機器・ドライブ購入費（税込・円）<input type="number" id="deviceCost" data-cost="deviceCost" min="0" max="999999999" step="1" inputmode="numeric" placeholder="購入が不要なら0" value="'+escape(state.deviceCost)+'"></label>'+
'<label>初期費用・設定費（税込・円）<input type="number" id="setupCost" data-cost="setupCost" min="0" max="999999999" step="1" inputmode="numeric" placeholder="発生しなければ0" value="'+escape(state.setupCost)+'"></label>'+
'<label>月額契約・保守費（税込・円）<input type="number" id="monthlyCost" data-cost="monthlyCost" min="0" max="999999999" step="1" inputmode="numeric" placeholder="発生しなければ0" value="'+escape(state.monthlyCost)+'"></label></div>'+
'<div class="estimate-output"><div><span>初期費用（入力額合計）</span><strong id="estimateInitial">未入力</strong></div><div><span>初年度費用（初期＋月額×12）</span><strong id="estimateYear">未入力</strong></div></div><p class="smallnote" id="estimateNote"></p></div>'+
'<h3 style="margin-top:30px">5. 購入・申込みの進め方</h3><div class="callout"><b>BASELAYER内でできること</b>：仕組みの理解、条件整理、比較、購入候補の確認、費用試算、結果の印刷。<br><b>外部サイトで行うこと</b>：正式な見積り、商品の注文、SaaS契約・請求・決済、設置・サポートの手配。<br>公式リンクやAmazon・楽天の検索先で販売条件を確認し、必要な機器だけ購入してください。</div>'+
'<div class="action-row"><button class="btn btn-dark" id="printPlan" type="button">この結果を印刷・PDF保存 ↗</button><button class="btn btn-ghost" id="copyPlan" type="button">診断内容をコピー</button><a class="btn btn-outline" href="compare.html?kind='+encodeURIComponent(result.kind)+'">詳細な仕様比較へ →</a></div><p class="result-footnote" id="copyFeedback" role="status"></p>'+
'<div class="wiz-actions"><button class="btn btn-ghost" data-action="back" type="button">← 条件を見直す</button><button class="btn btn-outline" data-action="reset" type="button">最初から診断する</button></div>';
}
function render(){
state.step=Math.min(Math.max(1,state.step),4);
let el=byId("wizardContent");el.innerHTML=[null,stepOne,stepTwo,stepThree,result][state.step]();
byId("progressList").querySelectorAll("li").forEach((li,i)=>{li.classList.toggle("current",i===state.step-1);li.classList.toggle("done",i<state.step-1);});
if(state.step===4)totals();
}
function updateField(target){
if(!target||!target.name&&!target.dataset.field)return;
const key=target.dataset.field||target.name;
if(Object.prototype.hasOwnProperty.call(state,key))state[key]=target.value;
}
function summaryText(){
const r=classify();
const lines=["BASELAYER 保存環境の整理結果","目的："+goals[state.goal],"利用人数："+label(peopleMap,state.people),"データ容量："+label(capacityMap,state.capacity),"社外利用："+(state.remote==="yes"?"必要":state.remote==="no"?"不要":"未定"),"比較カテゴリ："+({cloud:"クラウドストレージ",nas:"NAS",hdd:"外付けHDD・SSD"}[r.kind]),"理由："+r.reason,"確認項目："+r.flags.join("／"),"初期費用："+byId("estimateInitial").textContent,"初年度費用："+byId("estimateYear").textContent,"※金額は利用者入力に基づく参考額。適合・価格を保証しません。"];
return lines.join("\n");
}
byId("wizardContent").addEventListener("change",event=>{updateField(event.target);});
byId("wizardContent").addEventListener("input",event=>{if(event.target.dataset.cost){state[event.target.dataset.cost]=event.target.value;totals();}});
byId("wizardContent").addEventListener("click",async event=>{
const next=event.target.closest("[data-action]");
if(next){const cmd=next.dataset.action;if(cmd==="next")state.step=Math.min(4,state.step+1);if(cmd==="back")state.step=Math.max(1,state.step-1);if(cmd==="reset"){Object.assign(state,{step:1,goal:"share",people:"small",capacity:"small",remote:"yes",already:"none",admin:"no",backup:"unknown",deviceCost:"",setupCost:"",monthlyCost:""});history.replaceState(null,"",location.pathname);}render();window.scrollTo({top:0,behavior:"auto"});return;}
if(event.target.closest("#printPlan")){window.print();return;}
const copy=event.target.closest("#copyPlan");
if(copy){try{if(!navigator.clipboard?.writeText)throw new Error("Clipboard unavailable");await navigator.clipboard.writeText(summaryText());byId("copyFeedback").textContent="診断結果をコピーしました。";}catch{byId("copyFeedback").textContent="コピーできませんでした。印刷・PDF保存をご利用ください。";}}
});
render();
})();
