/* BASELAYER Storage — static frontend.
   No external scripts, tracking, or unverified affiliate IDs.
   All external product links are HTTPS, disclosed and opened separately. */
(() => {
  'use strict';
  const catalog = Array.isArray(window.BL_STORAGE_ITEMS) ? window.BL_STORAGE_ITEMS.filter(item => item && item.id && item.model && item.kind) : [];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const e = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch (_) { return ''; } };
  const names = {cloud:'クラウドストレージ',nas:'NAS',hdd:'外付けHDD・SSD'};
  const art = {
    cloud:'<path d="M14 45h36a11 11 0 0 0 0-22h-4A17 17 0 0 0 13 29a9 9 0 0 0 1 16Z"/>',
    nas:'<rect x="13" y="8" width="38" height="48" rx="7"/><path d="M32 17v24M20 47h24M21 51h1"/>',
    hdd:'<rect x="9" y="16" width="46" height="31" rx="7"/><path d="M17 39h30M21 25h9"/>'
  };
  const icon = kind => '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="'+e(names[kind]||'ストレージ')+'の模式図（商品写真ではありません）">'+(art[kind]||art.hdd)+'</svg>';
  const map = new Map(catalog.map(item => [item.id,item]));
  const state = {category:'all',q:'',selected:[]};
  const scrollToCatalog = () => { const target=$('#catalog'); if(target) target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); };
  const ext = (href,label,kind) => { const url=safeUrl(href); return url ? '<a class="'+(kind||'')+'" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">'+e(label)+' ↗</a>' : ''; };
  function storeLinks(item) {
    const links=[];
    // Only a manually supplied, verified affiliate destination can be marked as an affiliate link.
    if(item.kind==='cloud') {
      if(item.affiliateVerified===true && safeUrl(item.affiliate)) links.push(ext(item.affiliate,'提携先でプランを確認（PR）','primary-link'));
      links.push(ext(item.official,'公式サービスを確認',''));
    } else {
      // Untracked product searches are intentionally not presented as exact stock/price/affiliate offers.
      const term=encodeURIComponent(item.brand+' '+item.model);
      links.push(ext('https://www.amazon.co.jp/s?k='+term,'Amazonで型番検索','primary-link'));
      links.push(ext('https://search.rakuten.co.jp/search/mall/'+term+'/','楽天市場で型番検索',''));
    }
    return links.join('');
  }
  function renderCards() {
    const input=state.q.normalize('NFKC').toLocaleLowerCase();
    const tokens=input.split(/\s+/).filter(Boolean);
    const result=catalog.filter(item => {
      if(state.category!=='all' && item.kind!==state.category) return false;
      const text=[item.brand,item.model,item.name,item.subtitle,item.scope,names[item.kind]].join(' ').normalize('NFKC').toLocaleLowerCase();
      return tokens.every(token => text.includes(token));
    });
    const grid=$('#productGrid');
    if(!grid) return;
    $('#catalogCount').textContent='初期登録 '+catalog.length+'件';
    $('#resultCount').textContent=result.length+'件の製品・サービスを表示';
    if(!result.length) {
      grid.innerHTML='<div class="catalog-empty"><strong>該当する製品が見つかりませんでした。</strong><p>型番・メーカー・カテゴリを変えてお試しください。未登録製品は推測して表示しません。</p></div>';
      return;
    }
    grid.innerHTML=result.map(item => {
      const checked=state.selected.includes(item.id);
      return '<article class="product-card">'+
        '<div class="product-art '+e(item.kind)+'">'+icon(item.kind)+'<span class="art-label">CATEGORY ILLUSTRATION</span></div>'+
        '<div class="product-body"><div class="product-overline">'+e(item.brand)+' / '+e(names[item.kind])+'</div>'+
        '<h3>'+e(item.name)+'</h3><p class="product-subtitle">'+e(item.subtitle)+'</p>'+
        '<p class="product-feature">'+e(item.feature)+'</p>'+
        '<div class="product-meta"><span>公式情報を参照</span><time datetime="'+e(item.reviewed)+'">'+e(item.reviewed)+'</time></div>'+
        '<div class="product-actions"><button type="button" data-detail="'+e(item.id)+'">詳細を見る</button>'+
        '<button type="button" data-toggle="'+e(item.id)+'" aria-pressed="'+checked+'" class="'+(checked?'is-added':'')+'">'+(checked?'✓ 追加済み':'+ 比較に追加')+'</button></div></div></article>';
    }).join('');
  }
  function updateTray() {
    const count=state.selected.length;
    $('#compareTray').hidden=count===0;
    $('#trayLabel').textContent='比較対象 '+count+' / 3件';
    $('#trayNames').textContent=state.selected.map(id=>map.get(id)?.model||'').join(' / ');
    $('#clearCompare').disabled=count===0;
    $('#trayOpen').disabled=count<2;
  }
  function toggle(id) {
    if(!map.has(id)) return;
    if(state.selected.includes(id)) state.selected=state.selected.filter(x=>x!==id);
    else if(state.selected.length>=3){window.alert('比較対象は最大3件です。先にほかの製品を外してください。');return;}
    else state.selected.push(id);
    renderCards(); updateTray();
  }
  function showDialog(selector) { const dialog=$(selector); if(!dialog) return; if(typeof dialog.showModal==='function') dialog.showModal(); else dialog.setAttribute('open',''); }
  function openDetails(id) {
    const item=map.get(id); if(!item) return;
    const specs=Object.entries(item.specs||{}).map(([key,val])=>'<tr><th scope="row">'+e(key)+'</th><td>'+e(val)+'</td></tr>').join('');
    $('#detailContent').innerHTML='<div class="detail-inner"><p class="detail-kicker">'+e(names[item.kind])+' / '+e(item.brand)+'</p>'+
      '<h2 id="detailTitle">'+e(item.name)+'</h2><p class="detail-lead">'+e(item.subtitle)+'</p>'+
      '<div class="detail-highlight">'+e(item.feature)+'</div>'+
      '<h3>どんな用途に向いている？</h3><p class="detail-lead">'+e(item.scope)+'</p>'+
      '<h3>主な特徴</h3><ul class="detail-points">'+(item.points||[]).map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
      '<h3>仕様・利用条件</h3><table class="detail-table"><tbody>'+specs+'</tbody></table>'+
      '<h3>選定時の注意点</h3><p class="detail-warning">'+e(item.limits)+'</p>'+
      '<h3>購入先・申込先を確認する</h3><div class="purchase-links">'+storeLinks(item)+'</div>'+
      '<p class="detail-caption">'+(item.kind==='cloud'?'クラウドの報酬付きリンクは提携確認後に設定します。公式サービスへのリンクは通常リンクです。':'Amazon・楽天のリンクは商品名の検索結果を開く通常リンクで、現時点ではアフィリエイトID未設定です。必ず型番・付属品・価格・在庫を確認してください。')+'</p>'+
      '<h3>情報の根拠</h3><div class="detail-source">情報確認日：<time datetime="'+e(item.reviewed)+'">'+e(item.reviewed)+'</time><br>参照：'+ext(item.source,'メーカー・サービス公式情報','')+'<br>価格・在庫は取得していません。公式情報の最新状況をご確認ください。</div>'+
      '<div class="purchase-links"><button type="button" class="primary" data-detail-compare="'+e(item.id)+'">'+(state.selected.includes(item.id)?'比較から外す':'比較に追加する')+'</button></div></div>';
    showDialog('#detailDialog');
  }
  const comparisonFields = ['種類','保管場所','共有方法','契約形態','ベイ数','搭載ディスク','ネットワーク','容量','接続','購入前の確認'];
  function openComparison() {
    const items=state.selected.map(id=>map.get(id)).filter(Boolean);
    if(items.length<2) {
      $('#compareContent').innerHTML='<div class="detail-inner"><h2 id="compareTitle" class="compare-title">製品比較</h2><p class="empty-comparison">2〜3件の製品・サービスを選ぶと、比較表が表示されます。検索結果の「比較に追加」から選択してください。</p></div>';
      showDialog('#compareDialog'); return;
    }
    const fields=[...new Set([...comparisonFields,...items.flatMap(i=>Object.keys(i.specs||{}))])].filter(k=>items.some(i=>Object.prototype.hasOwnProperty.call(i.specs||{},k)));
    const rows=[['カテゴリ',items.map(i=>names[i.kind])],['メーカー',items.map(i=>i.brand)],['用途',items.map(i=>i.scope)], ...fields.map(f=>[f,items.map(i=>i.specs?.[f]||'未登録')])];
    const note=new Set(items.map(x=>x.kind)).size>1 ? '異なるカテゴリを比較しています。クラウド・NAS・外付けHDDは同じ性能指標では評価できません。目的や運用方法を比較してください。' : '仕様の値はメーカーの掲載条件によって異なります。数値が似ていても適合性や完全互換を示すものではありません。';
    $('#compareContent').innerHTML='<div class="detail-inner"><p class="detail-kicker">SIDE BY SIDE</p><h2 id="compareTitle" class="compare-title">選んだ製品を比較</h2><p class="compare-summary">選択した'+items.length+'件の登録情報を並べて確認します。</p>'+
      '<div class="table-scroll"><table class="compare-table"><thead><tr><th scope="col">比較項目</th>'+items.map(i=>'<th scope="col">'+e(i.name)+'</th>').join('')+'</tr></thead><tbody>'+
      rows.map(([label,values])=>'<tr><th scope="row">'+e(label)+'</th>'+values.map(v=>'<td>'+e(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
      '<p class="compare-tip">'+e(note)+'</p><h3>詳しく調べる・購入先を確認する</h3><div class="purchase-links">'+items.map(i=>'<button type="button" class="primary" data-detail-from-compare="'+e(i.id)+'">'+e(i.model)+' の詳細</button>').join('')+'</div></div>';
    showDialog('#compareDialog');
  }
  function selectCategory(kind,scroll=true) {
    state.category=names[kind]?kind:'all';
    $$('[data-filter]').forEach(btn => {const checked=btn.dataset.filter===state.category;btn.classList.toggle('is-active',checked);btn.setAttribute('aria-pressed',String(checked));});
    renderCards();
    if(scroll) scrollToCatalog();
  }
  function renderAdvisor(event) {
    if(event)event.preventDefault();
    const goal=$('input[name="goal"]:checked')?.value||'share';
    const people=Number($('#memberCount').value||1);
    const remote=$('#remoteNeed').value;
    let kind,heading,description,checks;
    if(goal==='share'){
      kind=remote==='no'?'nas':'cloud';
      heading=remote==='no'?'NASとクラウドを比較':'クラウドストレージから比較';
      description='複数人での共有では、アクセス権限・社外共有・既存契約・費用を確認します。'+(remote==='no'?'社内のみの利用ならNASも候補です。':'社外アクセスを含む場合はクラウドが候補になります。');
      checks=['既存のMicrosoft 365・Google Workspace等で要件を満たせないか','契約人数と容量、権限・履歴の機能','重要データを復元できる独立したバックアップ'];
    } else if(goal==='office'){
      kind='nas';
      heading='NASを中心に導入条件を比較';
      description='社内ネットワーク上の保存場所にはNASが候補になります。'+(remote==='yes'?'社外からのアクセスが必要なら、運用・安全対策を含めクラウドも比較してください。':'設定・管理担当者の有無も考慮しましょう。');
      checks=['NAS本体のHDD付属／別売り','ネットワーク・利用人数・設定と保守の手間','障害・誤削除に備えた別のバックアップ先'];
    } else {
      kind='hdd';
      heading='外付けHDDとバックアップ方式を比較';
      description='PCのデータを残すなら外付けHDDは候補です。ただし社員が多い場合は運用が分散しやすいため、集中管理やクラウドバックアップも検討してください。';
      checks=['保存容量・接続先との対応','自動保存と復元の手順','別の場所にもコピーを保管する運用'];
    }
    const appendix=people>=20?'利用者が多いため、権限管理や運用担当者の確保を優先してください。':'';
    $('#advisorResult').innerHTML='<div class="result-tag">YOUR DIRECTION / 選定のヒント</div><div class="result-symbol" aria-hidden="true">✓</div><h3>'+e(heading)+'</h3><p>'+e(description+' '+appendix)+'</p>'+
      '<div class="result-divider"></div><p class="result-footer">購入前に確かめたいこと</p><ul class="detail-points">'+checks.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
      '<button class="result-cta" data-jump="'+e(kind)+'" type="button">'+e(names[kind])+'の候補を見る ↗</button>';
  }
  const guides={
    cloud:{heading:'クラウドストレージとは',items:['データをオンラインで保管・共有するサービスです。','利用者数・容量・アクセス権限・社外共有を確認します。','料金と支払い条件は、サービスの公式サイトで最新情報を確認します。','同期機能だけではバックアップの代わりにならない場合があります。']},
    nas:{heading:'NASとは',items:['NASは社内ネットワークなどから複数人で使える保存装置です。','ドライブが別売りの機種では、対応HDDを別途購入する必要があります。','RAIDは機器故障時の可用性を高める方式であり、独立したバックアップではありません。','設置・運用・故障時の対応を誰が担当するかも検討しましょう。']},
    backup:{heading:'バックアップは別に考える',items:['元のデータが削除・破損しても戻せるように、独立したコピーを保管することです。','クラウド同期やNASのRAIDだけでは、誤削除・暗号化被害に対応できない場合があります。','復元できるか定期的に確認することが重要です。','外付けHDDを使う場合も、接続しっぱなしの運用や保管場所に注意しましょう。']}
  };
  function showGuide(topic) {
    const guide=guides[topic]; if(!guide)return;
    $('#guideContent').innerHTML='<div class="detail-inner"><p class="detail-kicker">STORAGE ESSENTIALS</p><h2 id="guideDialogTitle">'+e(guide.heading)+'</h2><ul class="detail-points">'+guide.items.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul><div class="purchase-links"><button class="primary" type="button" data-jump="'+(topic==='backup'?'hdd':topic)+'">対象製品を探す ↗</button></div></div>';
    showDialog('#guideDialog');
  }
  const mobile=$('#mobileMenu'), menu=$('#menuToggle');
  if(menu && mobile) {
    menu.addEventListener('click',()=>{const show=mobile.hidden;mobile.hidden=!show;menu.setAttribute('aria-expanded',String(show));menu.setAttribute('aria-label',show?'メニューを閉じる':'メニューを開く');});
    mobile.addEventListener('click',event=>{if(event.target.closest('a')){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く');}});
  }
  $('#heroForm').addEventListener('submit',event=>{event.preventDefault();state.q=$('#heroQuery').value.trim();$('#catalogSearch').value=state.q;selectCategory('all',false);scrollToCatalog();});
  $('#catalogSearch').addEventListener('input',event=>{state.q=event.target.value.trim();renderCards();});
  $$('[data-category]').forEach(btn=>btn.addEventListener('click',()=>selectCategory(btn.dataset.category)));
  $$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>selectCategory(btn.dataset.filter,false)));
  $('#advisorForm').addEventListener('submit',renderAdvisor);
  $('#productGrid').addEventListener('click',event=>{
    const detail=event.target.closest('button[data-detail]'), change=event.target.closest('button[data-toggle]');
    if(detail)openDetails(detail.dataset.detail); else if(change)toggle(change.dataset.toggle);
  });
  $('#openCompare').addEventListener('click',openComparison);
  $('#trayOpen').addEventListener('click',openComparison);
  $('#clearCompare').addEventListener('click',()=>{state.selected=[];renderCards();updateTray();});
  $$('button[data-topic]').forEach(btn=>btn.addEventListener('click',()=>showGuide(btn.dataset.topic)));
  document.addEventListener('click',event=>{
    const jump=event.target.closest('button[data-jump]');
    if(jump) { const owner=jump.closest('dialog');if(owner && owner.open) owner.close();selectCategory(jump.dataset.jump); }
    const compare=event.target.closest('button[data-detail-compare]');
    if(compare){toggle(compare.dataset.detailCompare);openDetails(compare.dataset.detailCompare);}
    const fromCompare=event.target.closest('button[data-detail-from-compare]');
    if(fromCompare){$('#compareDialog').close();openDetails(fromCompare.dataset.detailFromCompare);}
    const close=event.target.closest('button[data-close]');
    if(close){ const dialog=$('#'+close.dataset.close); if(dialog)dialog.close(); }
  });
  $$('dialog').forEach(dialog => dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();}));
  renderCards();updateTray();
})();
