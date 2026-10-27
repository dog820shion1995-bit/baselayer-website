/* BASELAYER Decision Report v2: deterministic, inspectable decision support.
   Inputs stay in the browser; no analytics, network writes or invented prices. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>new Intl.NumberFormat("ja-JP").format(Math.round(n))+"円";
const catalog=Array.isArray(window.BL_STORAGE_ITEMS)?window.BL_STORAGE_ITEMS:[];
const priceCatalog=window.BL_PRICES?.entries||{};
const editorial=window.BL_EDITORIAL||{};
const kinds={cloud:"クラウドストレージ",nas:"NAS",hdd:"外付けHDD・SSD"};
const goals={share:"ファイル共有を改善",office:"保存場所・容量の改善",backup:"バックアップと復元の対策"};
const opts=(key,label,entries,help)=>'<div class="field-row"><label for="f_'+key+'">'+escape(label)+'</label><select id="f_'+key+'" data-value="'+key+'">'+entries.map(([v,t])=>'<option value="'+escape(v)+'" '+(state[key]===v?"selected":"")+'>'+escape(t)+'</option>').join("")+'</select>'+(help?'<small>'+escape(help)+'</small>':"")+'</div>';
const choiceVisual={
 share:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&q=75",
 office:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500&q=75",
 backup:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=75"
};
const option=(key,v,title,sub)=>'<label class="option-card"><img src="'+choiceVisual[v]+'" alt="" loading="lazy"><span><input type="radio" name="'+key+'" value="'+v+'" '+(state[key]===v?"checked":"")+'><strong>'+escape(title)+'</strong><small>'+escape(sub)+'</small></span></label>';
const link=(url,title,cls="")=>{try{const u=new URL(url,location.href);if(u.protocol!=="https:")return "";return '<a class="'+escape(cls)+'" href="'+escape(u.href)+'" target="_blank" rel="noopener noreferrer">'+escape(title)+' ↗</a>';}catch{return "";}};
const init={step:1,goal:"share",mode:"simple",people:"small",capacity:"small",remote:"yes",already:"none",admin:"no",backup:"unknown",rto:"unknown",rpo:"unknown",critical:"normal",sensitive:"unknown",growth:"normal",budget:"unknown",deviceCount:"unknown",hasNas:"unknown",selectedId:"",extraInitial:"",extraMonthly:"",view:"owner"};
const state={...init};
const fromLink=new URLSearchParams(location.search).get("goal");
if(Object.prototype.hasOwnProperty.call(goals,fromLink))state.goal=fromLink;
const meaning={people:{one:"1人",small:"2〜5人",medium:"6〜20人",large:"21人以上"},capacity:{tiny:"100GB未満",small:"100GB〜1TB",medium:"1〜4TB",large:"4TB超"},rto:{unknown:"未確認",hour:"1時間以内",day:"当日中",days:"2〜3日以内",week:"数日以上"},rpo:{unknown:"未確認",hour:"1時間以内",day:"1日以内",week:"数日前でもよい"},critical:{normal:"通常",high:"仕事が止まると影響大",severe:"営業・顧客対応が止まる"},budget:{unknown:"未設定",low:"5万円未満",middle:"5〜15万円",high:"15万円以上"}};
const show=(key)=>meaning[key]?.[state[key]]||state[key];
const nav=(prev,nextTitle)=>'<div class="wiz-actions">'+(prev?'<button type="button" class="btn btn-ghost" data-action="back">← 前に戻る</button>':'<a class="btn btn-ghost" href="index.html">← ホームへ</a>')+'<button type="button" class="btn btn-dark" data-action="next">'+escape(nextTitle)+' →</button></div>';
function stepOne(){
 return '<div class="wizard-counter">STEP 01 / 04　解決したい問題</div><h2 id="wizardTitle">何に困っていますか？</h2><p>最初は製品の名前ではなく、今の課題を選びます。</p><div class="option-grid visual-choice">'+
 option("goal","share","複数人で共有したい","社内・社外からファイルを利用したい")+
 option("goal","office","保存容量・置き場所を整えたい","保存先の散在や容量不足を解決したい")+
 option("goal","backup","データを安全に戻せるようにしたい","故障・誤削除・攻撃から復旧したい")+'</div>'+
 '<div class="field-row"><label for="f_mode">どのくらい詳しく検討したいですか？</label><select id="f_mode" data-value="mode"><option value="simple" '+(state.mode==="simple"?"selected":"")+'>かんたんに始めたい（初心者向け）</option><option value="advanced" '+(state.mode==="advanced"?"selected":"")+'>詳しく条件を確認したい（担当者向け）</option></select><small>かんたんモードでも診断の最後に詳細条件を追加できます。</small></div>'+
 '<div class="callout"><b>商品の売り込みより先に。</b> 今持っているサービスで対応できる場合は、追加購入しない選択肢も案内します。</div>'+nav(false,"利用環境を入力する");
}
function stepTwo(){
return '<div class="wizard-counter">STEP 02 / 04　利用環境</div><h2 id="wizardTitle">どのくらいの環境で使いますか？</h2><p>おおよその人数・容量が分かれば診断を進められます。</p>'+
opts("people","利用人数",[["one","1人"],["small","2〜5人"],["medium","6〜20人"],["large","21人以上"]])+
opts("capacity","いま保存したい容量",[["tiny","100GB未満"],["small","100GB〜1TB"],["medium","1〜4TB"],["large","4TB超"]],"NASの総容量とRAID構成による実効容量は異なります。")+
'<div class="visual-question"><div class="visual-question-grid"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75" alt="スマホやPCで外から資料を確認する仕事のイメージ" loading="lazy"><div><strong>社外からも資料を見たい？</strong><p>外出中の営業担当がスマホで見積書を開くような使い方です。</p><div class="flow-mini"><span>外出先</span>→<span>認証</span>→<span>会社の保存先</span></div></div></div></div>'+
opts("remote","外出先や別の拠点からアクセスしますか？",[["yes","必要"],["no","基本的に不要"],["unknown","まだ分からない"]])+
opts("already","すでに利用している共有サービス",[["none","特になし／分からない"],["m365","Microsoft 365・OneDrive・SharePointなど"],["google","Google Workspace・Google Driveなど"],["other","その他のクラウドやファイル共有サービス"]])+
opts("hasNas","現在NASやファイルサーバーを使っていますか？",[["unknown","分からない"],["yes","利用している"],["no","利用していない"]])+
nav(true,"データ保護と運用を確認する");
}
function stepThree(){
return '<div class="wizard-counter">STEP 03 / 04　復元と管理</div><h2 id="wizardTitle">データが使えない場合、どのくらい困りますか？</h2><p>難しい単語は不要です。分からない質問は「未確認」のままでも進めます。</p>'+
'<div class="visual-question"><div class="visual-question-grid"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=75" alt="故障時に備えたい業務PCのイメージ" loading="lazy"><div><strong>PCが壊れても元に戻せる？</strong><p>共有先があることと、復元用の別コピーがあることは違います。</p><div class="flow-mini"><span>仕事のデータ</span>→<span>別のコピー</span>→<span>復元</span></div></div></div></div>'+
opts("backup","別の場所に、復元できるバックアップはありますか？",[["unknown","分からない・未確認"],["none","ない"],["yes","ある（復元テスト済み）"]])+
opts("rto","データが使えない場合、いつまでに業務を再開したいですか？",[["unknown","まだ分からない"],["hour","1時間以内"],["day","当日中"],["days","2〜3日以内"],["week","数日以上かかってもよい"]],"目標復旧時間（RTO）の参考質問です。速いほど別の設計・費用が必要になる場合があります。")+
opts("rpo","直近のデータをどれくらい失っても許容できますか？",[["unknown","まだ分からない"],["hour","過去1時間以内のデータまで必要"],["day","前日のデータが残ればよい"],["week","数日前のデータでもよい"]],"目標復旧時点（RPO）の参考質問です。自動バックアップの頻度を決める判断材料です。")+
opts("critical","止まった場合の業務への影響",[["normal","支障はあるが、一時的に別の作業ができる"],["high","多くの社員の作業が止まる"],["severe","営業や顧客対応が止まる"]])+
opts("admin","機器の設置・設定・障害対応を担当できる人",[["no","いない／難しい"],["yes","いる"],["unknown","未確認"]])+
'<details class="expert-fields" '+(state.mode==="advanced"?"open":"")+'><summary>さらに詳しい条件を入力（任意・担当者向け）</summary>'+
opts("sensitive","機密性・契約・法令に関する制約",[["unknown","未確認"],["normal","一般的な業務データが中心"],["restricted","機密情報・顧客情報・規制対象データあり"]])+
opts("growth","データ量の増え方",[["normal","大きく増えない"],["fast","急速に増える可能性がある"],["unknown","未確認"]])+
opts("deviceCount","対象端末台数",[["unknown","未確認"],["few","1〜5台"],["middle","6〜20台"],["many","21台以上"]])+
opts("budget","初期費用の目安",[["unknown","まだ決まっていない"],["low","5万円未満"],["middle","5〜15万円"],["high","15万円以上"]])+'</details>'+
'<div class="warning">RTO/RPO・機密区分・容量・実際の運用条件が不足している場合、診断結果は設計確定ではありません。業務継続のための最終設計は必要に応じて専門家にご相談ください。</div>'+
nav(true,"導入判断レポートを作成する");
}
function decide(){
 const notes=[],unknown=[],must=[],alternatives=[];
 const isExisting=state.already!=="none";
 const needsBackup=state.backup!=="yes";
 let kind="cloud",title="",reason="";
 if(state.goal==="backup"){
  kind="hdd";title="バックアップ方式を先に設計";reason="日常の共有先と別に、復元できるコピーの保管方法を決めます。外付けHDDは一候補であり、これだけで全社の保護が完成するわけではありません。";
 } else if(state.goal==="share"){
  if(state.remote==="no"&&state.admin==="yes"){kind="nas";title="NASとクラウドの両方を検討";reason="社内中心のファイル共有で機器管理者がいるため、NASも候補です。ただし初期購入、保守、独立バックアップまで含めて比較します。";}
  else {kind="cloud";title="クラウド共有を先に確認";reason="離れた場所からの利用、または運用負担の軽減を重視する条件です。新規契約の前に既存の共有機能を確認してください。";}
 }else{
  if(state.admin==="yes"&&state.remote==="no"){kind="nas";title="NASによる集約を検討";reason="社内で管理できる場合はNASも候補。容量と運用の両方が適切かを評価します。";}
  else {kind="cloud";title="クラウド中心に容量と運用を比較";reason="管理負担や社外利用を考慮するとクラウドが一つの比較候補です。費用と既存サービスの条件が重要です。";}
 }
 if(isExisting){notes.push("すでに共有サービスを契約しているため、現在のプラン・権限・容量で足りるなら新規契約は不要です。");alternatives.push("既存サービスのプラン確認と設定改善");}
 if(needsBackup){must.push("独立したバックアップの有無と復元テストを確認");}
 if(state.hasNas==="yes"){notes.push("既存NAS・サーバーの状態、空き容量、保守、障害時のバックアップを先に確認。");}
 if(state.remote!=="no"){must.push("社外アクセスの認証、権限、共有範囲とログを確認");}
 if(state.capacity==="large"){unknown.push("4TB超に必要な実効容量・増設可能性・料金の確認");}
 if(state.growth!=="normal"){unknown.push("将来のデータ増加に必要な容量余力");}
 if(state.rto==="unknown")unknown.push("目標とする業務復旧時間");
 if(state.rpo==="unknown")unknown.push("許容できるデータ損失範囲");
 if(state.sensitive==="unknown")unknown.push("扱う情報の機密性・契約上の制約");
 if(state.sensitive==="restricted")must.push("機密・個人情報の取扱条件、必要な法令・契約・保存先を確認");
 if(state.rto==="hour"||state.rpo==="hour"){must.push("1時間単位の復旧・復元には専用設計や自動化が必要。機器単品の購入では要件を満たせない可能性");}
 if(state.critical==="severe"||state.critical==="high"){must.push("事業停止の影響が大きいため、障害対応手順・訓練・責任者を定める");}
 if(kind==="nas"){must.push("NASの実効容量（RAID設定）、対応ドライブと保守、独立したバックアップの確保");if(state.admin!=="yes")unknown.push("NASを保守・設定できる担当者");alternatives.push("クラウドへの移行・運用委託");}
 if(kind==="hdd"){must.push("バックアップの自動化、別の保管場所、定期的な復元テスト");alternatives.push("専用バックアップサービス・別拠点保存");}
 if(kind==="cloud"){must.push("契約単位、容量、アクセス権限、保管場所、請求条件");alternatives.push("社内用NAS＋独立バックアップ");}
 if(state.budget==="unknown")unknown.push("導入予算・保守予算");
 if(state.people==="large")must.push("21人以上の権限・監査・管理責任者と提供元のサポート条件");
 if(state.deviceCount==="unknown")unknown.push("保護対象端末の台数");
 return {kind,title,reason,notes,must,unknown,alternatives,needsBackup,isExisting,requireSpecialist:state.rto==="hour"||state.rpo==="hour"||state.sensitive==="restricted"||state.critical==="severe"};
}
const bullet=items=>'<ul class="report-bullets">'+items.map(x=>'<li>'+escape(x)+'</li>').join("")+'</ul>';
function reportText(){
 const d=decide(),p=priceCatalog[state.selectedId],f=estimate();
 return [
 "BASELAYER 導入判断レポート（正式見積ではありません）",
 "作成基準：2026-10-28 / 価格掲載確認日："+(window.BL_PRICES?.checked||"不明"),
 "目的："+goals[state.goal],
 "人数："+show("people")+" / 容量："+show("capacity"),
 "社外利用："+(state.remote==="yes"?"必要":state.remote==="no"?"不要":"未確認"),
 "復旧までの希望："+show("rto")+" / 許容できるデータの損失："+show("rpo"),
 "重要度："+show("critical")+" / 現在の共有契約："+state.already+" / 既存NAS："+state.hasNas,
 "案："+d.title, "根拠："+d.reason,
 "優先確認："+d.must.join("、"),
 "未確認："+(d.unknown.join("、")||"特になし（追加の確認は必要）"),
 "比較製品："+(p?.model||"未選択"),
 "公式参考価格："+priceText(p),
 "参考初期費用："+f.initialLabel,"参考初年度費用："+f.yearLabel,"参考3年費用："+f.threeLabel,
 "見積りに必要な条件："+d.must.join("、"),
 "注意：未入力・税・送料・変動単価・初回設定費・保守等が含まれない場合があり、この結果は正式見積書ではありません。"
 ].join("\n");
}
function priceText(p){
 if(!p)return "候補未選択";
 if(p.status==="unverified")return "未確認（メーカー・販売店へ問い合わせ）";
 if(p.currency==="USD")return "$"+p.monthly.toFixed(2)+"/人/月・年間払い、税別。最低"+p.minUsers+"人。円の総額には含めない";
 if(p.kind==="service")return fmt(p.monthly)+"/月相当・"+p.commitmentMonths+"か月前払い、初期"+fmt(p.initial);
 return fmt(p.price)+"（"+p.tax+"、メーカー参考価格）";
}
function pricePanel(){
 const relevant=catalog.filter(p=>p.kind===decide().kind);
 const choices='<option value="">未選択（製品価格は含めない）</option>'+relevant.map(p=>'<option value="'+escape(p.id)+'" '+(state.selectedId===p.id?"selected":"")+'>'+escape(p.name)+'</option>').join("");
 const current=priceCatalog[state.selectedId];
 return '<div class="report-cost" id="costSection"><h3>4. メーカー参考価格から費用感を確認</h3><p class="smallnote">販売サイトの最安値ではなく、メーカー公式の参考価格を利用。価格の種類・税込／税抜・確認日を表示します。適合や購入を自動確定する機能ではありません。</p>'+
 '<label class="report-label" for="chooseProduct">比較する製品・サービス</label><select id="chooseProduct" data-value="selectedId">'+choices+'</select>'+
 '<div id="officialPrice">'+(current?'<p><strong>'+escape(priceText(current))+'</strong></p><p class="smallnote">'+escape(current.basis)+'<br>'+escape(current.disclaimer)+'</p>'+link(current.source,"価格の公式出典を確認"):'<p class="smallnote">製品を選ぶと価格の根拠と条件を表示します。</p>')+'</div>'+
 '<div class="estimate-grid"><label>別途必要な機器・導入費（税込）<input id="extraInitial" data-money="extraInitial" type="number" min="0" max="999999999" step="1" inputmode="numeric" value="'+escape(state.extraInitial)+'" placeholder="未確認の場合は空欄"></label>'+
 '<label>保守・バックアップ等の月額（税込）<input id="extraMonthly" data-money="extraMonthly" type="number" min="0" max="999999999" step="1" inputmode="numeric" value="'+escape(state.extraMonthly)+'" placeholder="未確認の場合は空欄"></label></div>'+
 '<div class="estimate-output"><div><span>初回購入・契約時の確認済み参考額</span><strong id="sumInitial">—</strong></div><div><span>初年度の確認済み参考額</span><strong id="sumYear">—</strong></div><div><span>3年間の確認済み参考額</span><strong id="sumThree">—</strong></div></div>'+
 '<p class="smallnote" id="costNote" role="status"></p><div class="warning">メーカー希望小売価格は販売価格ではありません。クラウドの年払いとドル建て料金は厳密に区別します。未確認の費用を0円とみなさず、参考額に含まれない項目を明記します。</div></div>';
}
const toNum=x=>/^\d{1,9}$/.test(String(x))?Number(x):null;
function estimate(){
 const p=priceCatalog[state.selectedId],otherUp=toNum(state.extraInitial),otherMonth=toNum(state.extraMonthly);
 const known=p&&p.status==="reference"&&p.currency==="JPY";
 const firstContract=known&&p.kind==="service"?p.monthly*p.commitmentMonths:0;
 const baseUp=known?(p.kind==="hardware"?p.price:p.initial+firstContract):null;
 const baseMonth=known&&p.kind==="service"?p.monthly:known?0:null;
 const canCalc=baseUp!==null&&baseMonth!==null;
 const up=(baseUp||0)+(otherUp||0), otherRecurring=otherMonth||0;
 const year=up+otherRecurring*12;
 const three=up+otherRecurring*36+(p?.kind==="service"?baseMonth*24:0);
 const initialLabel=canCalc?fmt(up):"価格未確認";
 const yearLabel=canCalc?fmt(year):"価格未確認";
 const threeLabel=canCalc?fmt(three):"価格未確認";
 return {initialLabel,yearLabel,threeLabel,partial:otherUp===null||otherMonth===null,known,foreign:!!p&&p.currency==="USD"};
}
function updateAmounts(){
 const f=estimate();$("sumInitial").textContent=f.initialLabel;$("sumYear").textContent=f.yearLabel;$("sumThree").textContent=f.threeLabel;
 const notes=[];
 if(f.foreign)notes.push("米ドルの料金は、為替・税・請求条件が未確定のため円換算しません。");
 if(!f.known)notes.push("選択中の製品に検証済みの円建て参考価格がないため、総額は算出しません。");
 if(f.partial&&f.known)notes.push("「参考額」は現在価格が確認できた項目の合計であり、未入力の導入費・保守・バックアップ費は含まれません。正式な総費用ではありません。");
 if(f.known)notes.push("3年の試算は現在の参考単価が変わらない仮定。更新・交換、割引・値上げ、税・送料、人的コスト等は含まれていません。契約が12か月前払いのサービスは初回購入時に初年度の利用料を含めます。");
 const p=priceCatalog[state.selectedId];if(p?.kind==="service")notes.push("サービスの12か月前払いは月額換算を12倍して年費用に含めます。初期費用は初年度のみ計上。");
 $("costNote").textContent=notes.join(" ");
}
function personalFit(p){
 const warnings=[];
 const choose=editorial[p.id]?.choose?.[0]||p.feature;
 if(p.id==="buffalo-nas"&&state.capacity==="medium")warnings.push("4TBはHDDの合計容量です。出荷時RAID1の利用可能容量は約2TB。必要容量が2TBを超える場合は本型番では不足します。");
 if(p.id==="buffalo-nas"&&state.capacity==="large")warnings.push("4TB超の必要容量には、2TB×2のこの型番では容量不足です。");
 if(p.id==="synology")warnings.push("HDD別売りのため、メーカー対応ドライブと実効容量・総費用は未確定です。");
 if(p.kind==="hdd"&&state.capacity==="large")warnings.push("容量4TBの機器1台では4TB超を保存できません。");
 if(p.id==="xserver"&&(state.capacity==="medium"||state.capacity==="large"))warnings.push("XServerスモールビジネスはHDD 1TB／SSD 500GB。必要容量に応じて上位プランを比較してください。");
 if(p.id==="iodata-usb")warnings.push("メーカーサイトでは在庫限り・後継HDD-UT4KCと案内しています。継続調達時は後継品も確認してください。");
 if(state.already!=="none"&&p.kind==="cloud")warnings.push("既存クラウド契約で条件を満たすなら、追加契約しない選択を優先します。");
 if(state.goal==="backup")warnings.push("この機器単体ではバックアップ構成が完成しません。保存場所・自動化・復元テストまで設計してください。");
 return {choose,warnings};
}
function result(){
 const d=decide(),canBuy=catalog.filter(p=>p.kind===d.kind);
 const useExisting=d.isExisting&&d.kind==="cloud";
 const founder='<div class="report-pane" id="reportPane">'+
 '<div class="report-owner"><h3>決裁者向け：必要性・費用・次の判断</h3><p>'+escape(d.reason)+'</p><p><b>初めに決めること：</b>現在の契約で対応可能か、業務停止時にどれだけ困るか、導入費用の許容範囲。</p><p><b>推奨する次の行動：</b>'+(useExisting?'まず既存のクラウド契約内容を確認。追加購入の決定は保留。':'正式見積の前に必要条件を確認して候補を絞る。')+'</p></div>'+
 '<div class="report-technical" hidden><h3>社内SE向け：確認と設計の条件</h3>'+bullet([...d.must,...d.unknown.map(x=>x+"（未確認）")])+
 '<p class="smallnote">バックアップは独立したコピーと復元テストを考慮。容量や型番の適合はメーカー公式資料で検証してください。</p></div>'+
 '<div class="report-sales" hidden><h3>OA営業向け：見積依頼に必要な要件</h3><p>顧客の目的：'+escape(goals[state.goal])+'。人数 '+escape(show("people"))+'、容量 '+escape(show("capacity"))+'。</p><p>候補：'+escape(d.title)+'。現時点で未確認のため、見積依頼前に以下をヒアリングしてください。</p>'+bullet([...d.unknown,...d.must])+
 '<p class="smallnote">この資料は見積依頼用の準備情報であり、正式な見積書・請求書ではありません。</p></div></div>';
 return '<div class="wizard-counter">STEP 04 / 04　導入判断レポート</div><div class="report-header"><div><span class="result-tag">BASELAYER DECISION REPORT</span><h2 id="wizardTitle">導入判断レポート</h2><p>3つの視点から同じ条件を確認できます。現時点では正式な設計・見積りではありません。</p></div><span class="pill">'+(d.requireSpecialist?"専門家確認を推奨":"参考構成・要確認")+'</span></div>'+
 '<div class="rec-block"><span class="eyebrow">検討の方向性</span><h3>'+escape(d.title)+'</h3><p>'+escape(d.reason)+'</p></div>'+
 '<div class="report-snapshot"><div><small>検討目的</small><b>'+escape(goals[state.goal])+'</b></div><div><small>利用人数</small><b>'+escape(show("people"))+'</b></div><div><small>容量</small><b>'+escape(show("capacity"))+'</b></div><div><small>復旧希望</small><b>'+escape(show("rto"))+'</b></div></div>'+
 '<div class="callout"><b>1. 選定の前に大切なこと</b><p>'+escape(d.reason)+'</p>'+((d.isExisting)?"<p><strong>既存サービスで対応できる場合、新規契約は不要です。</strong></p>":"")+'</div>'+
 '<h3>2. 確認が必要な条件とリスク</h3>'+bullet([...d.must,...d.notes])+
 '<div class="warning"><b>未確認事項（確定前に確認してください）</b>'+bullet(d.unknown.length?d.unknown:["実際の運用、メーカー仕様、バックアップ復元可否"])+(d.requireSpecialist?"<strong>障害復旧・機密データの要件が厳しいため、設計者・提供会社の確認を強く推奨します。</strong>":"")+'</div>'+
 '<h3>3. この条件で比較する理由付き製品候補</h3><p class="smallnote">条件を満たすと確定した製品ではありません。追加購入不要の可能性も残したうえで比較します。</p><div class="report-product-list">'+canBuy.map(p=>{const fit=personalFit(p),img=window.BL_MEDIA?.[p.id];const cover=img?.src?'<div class="catalog-item-image" style="grid-column:1/-1;max-width:360px"><img src="'+escape(img.src)+'" loading="lazy" alt="'+escape(img.label)+'"></div><p class="product-photo-caption" style="grid-column:1/-1">'+escape(img.credit)+'</p>':'';return '<div>'+cover+'<strong>'+escape(p.brand+" "+p.model)+'</strong><span>'+escape(priceText(priceCatalog[p.id]))+'</span><p class="smallnote" style="grid-column:1/-1;margin:0"><b>比較候補にする理由：</b>'+escape(fit.choose)+'</p><p class="smallnote" style="grid-column:1/-1;margin:0"><b>他製品との違い：</b>'+escape(editorial[p.id]?.versus?.[0]?.text||"同じ用途の選択肢と比べます")+'</p>'+(fit.warnings.length?'<p class="warning" style="grid-column:1/-1;margin:0">'+escape(fit.warnings.join(" "))+'</p>':'')+'<p class="smallnote" style="grid-column:1/-1;margin:0"><b>購入前の確認：</b>'+escape(editorial[p.id]?.checks?.[0]||p.limits)+'</p><div style="grid-column:1/-1"><a class="text-link" href="product.html?id='+encodeURIComponent(p.id)+'">詳しい選定理由・比較・注意点を見る →</a></div></div>'}).join("")+'</div>'+
 '<div class="report-tabs" role="group" aria-label="レポートの表示対象"><button type="button" data-view="owner" aria-pressed="true">社長・決裁者向け</button><button type="button" data-view="technical" aria-pressed="false">社内SE向け</button><button type="button" data-view="sales" aria-pressed="false">OA営業向け</button></div>'+founder+
 pricePanel()+
 '<div class="report-handoff"><h3>5. 導入の準備から購入まで</h3><ol><li>未確認事項と復旧条件を確認</li><li>既存契約の機能・容量を再確認</li><li>メーカー公式仕様と価格を確認</li><li>必要な機器・設定・保守・バックアップを見積依頼</li><li>正規販売先で契約・購入</li><li>導入後、権限・バックアップと復元をテスト</li></ol><p class="smallnote">BASELAYERは利用者から代金を徴収せず、購入・SaaSの申込みや請求は各販売会社で行われます。</p></div>'+
 '<div class="action-row no-print"><button type="button" class="btn btn-dark" id="printPlan">レポートを印刷・PDF保存</button><button type="button" class="btn btn-outline" id="copyPlan">レポート内容をコピー</button><a class="btn btn-ghost" href="compare.html?kind='+escape(d.kind)+'">詳細な仕様比較へ →</a></div><p id="copyFeedback" class="smallnote" role="status"></p>'+
 '<div class="wiz-actions no-print"><button type="button" class="btn btn-ghost" data-action="back">← 条件を修正する</button><button type="button" class="btn btn-ghost" data-action="reset">もう一度診断する</button></div>';
}
function render(){
 state.step=Math.min(4,Math.max(1,state.step));
 document.querySelector(".wizard-shell")?.classList.toggle("report-wide",state.step===4);
 $("wizardContent").innerHTML=[null,stepOne,stepTwo,stepThree,result][state.step]();
 $("progressList").querySelectorAll("li").forEach((li,i)=>{li.classList.toggle("current",i===state.step-1);li.classList.toggle("done",i<state.step-1);});
 if(state.step===4){updateAmounts();changeView(state.view);}
}
function changeView(view){
 state.view=view;
 const parent=$("wizardContent");if(!parent)return;
 for(const name of ["owner","technical","sales"]){
  const p=parent.querySelector(".report-"+name);if(p)p.hidden=name!==view;
  const b=parent.querySelector('[data-view="'+name+'"]');if(b)b.setAttribute("aria-pressed",String(name===view));
 }
}
function handleData(target){
 if(!target)return;
 let key=target.dataset?.value||target.name;
 if(key&&Object.prototype.hasOwnProperty.call(state,key)){
  state[key]=target.value;
  if(key==="selectedId"){const official=priceCatalog[state.selectedId];const container=$("officialPrice");if(container){container.innerHTML=official?'<p><strong>'+escape(priceText(official))+'</strong></p><p class="smallnote">'+escape(official.basis)+" "+escape(official.disclaimer)+'</p>'+link(official.source,"価格の公式出典を確認"):'<p class="smallnote">未選択・価格未確認</p>';}updateAmounts();}
 }
}
$("wizardContent").addEventListener("change",event=>handleData(event.target));
$("wizardContent").addEventListener("input",event=>{
 const key=event.target.dataset?.money;
 if(key){const val=event.target.value;state[key]=val;updateAmounts();}
});
$("wizardContent").addEventListener("click",async event=>{
 const action=event.target.closest("[data-action]");
 if(action){
  const cmd=action.dataset.action;
  if(cmd==="next")state.step=Math.min(4,state.step+1);
  if(cmd==="back")state.step=Math.max(1,state.step-1);
  if(cmd==="reset"){Object.assign(state,init);history.replaceState(null,"",location.pathname);}
  render();window.scrollTo({top:0,behavior:"auto"});return;
 }
 const view=event.target.closest("[data-view]");if(view){changeView(view.dataset.view);return;}
 if(event.target.closest("#printPlan")){window.print();return;}
 if(event.target.closest("#copyPlan")){
  try{if(!navigator.clipboard?.writeText)throw Error("clipboard unavailable");await navigator.clipboard.writeText(reportText());$("copyFeedback").textContent="レポート内容をコピーしました。";}
  catch{$("copyFeedback").textContent="コピーできませんでした。印刷・PDF保存をご利用ください。";}
 }
});
render();
})();