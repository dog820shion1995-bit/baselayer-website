/* BASELAYER v31 — front-end only. Uses recorded product data; never invents compatibility. */
(() => {
  'use strict';
  const products = Array.isArray(window.BASELAYER_PRODUCTS) ? window.BASELAYER_PRODUCTS : [];
  const curatedRelations = Array.isArray(window.BASELAYER_RELATIONSHIPS) ? window.BASELAYER_RELATIONSHIPS : [];
  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const categories = {router:'ルーター',switch:'スイッチ',ap:'無線LAN・Wi-Fi',firewall:'ファイアウォール',lan:'LANケーブル',fiber:'光ケーブル',cable:'ケーブル',pc:'パソコン',server:'サーバー・NAS',storage:'ストレージ',monitor:'モニター',peripheral:'周辺機器',printer:'プリンター',meeting:'会議機器',power:'電源',rack:'ラック'};
  const labelCat = cat => categories[cat] || cat || 'その他';
  const validSpecs = p => !!(p?.specs && Object.keys(p.specs).length && p.source && p.checked);
  const modelKey = p => p ? `${p.brand}::${p.model}` : '';
  const productMap = new Map(products.map(p => [modelKey(p), p]));
  const getProduct = key => productMap.get(key) || null;
  const escapeAttr = esc;
  const safeSource = value => {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
  };

  // v32: product media is opt-in. A public image URL alone is not reuse permission.
  // Until all required rights metadata is present, show a category illustration.
  const mediaPaths = {
    router:'<rect x="3" y="8" width="18" height="9" rx="2"/><path d="M6 12h4M14 12h1M18 12h1M7 17v3M17 17v3"/>',
    switch:'<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M5 11h2m2 0h2m2 0h2m2 0h2M5 14h2m2 0h2m2 0h2"/>',
    ap:'<rect x="7" y="12" width="10" height="7" rx="2"/><path d="M4 9a11 11 0 0 1 16 0M7 11a7 7 0 0 1 10 0M12 15h.01"/>',
    monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/>',
    printer:'<path d="M6 8V3h12v5M6 18H4V9h16v9h-2M6 15h12v6H6zM17 12h1"/>',
    pc:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/>',
    server:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01"/>',
    storage:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01"/>',
    lan:'<path d="M7 3h10v7l-3 3v8h-4v-8l-3-3zM10 6v4m4-4v4"/>',
    power:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M13 6 9 13h4l-2 5"/>'
  };
  const productMedia = p => {
    if(!p)return '';
    const shape=mediaPaths[p.cat] || '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8"/>';
    const label=esc(labelCat(p.cat));
    const fallback=`<span class="product-media-fallback" role="img" aria-label="${label}のカテゴリイラスト（製品の実物写真ではありません）"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape}</svg></span>`;
    const im=p.image;
    const allowed=im && im.usage==='permitted' && im.brand===p.brand && im.model===p.model && typeof im.creator==='string' && im.creator.trim() && typeof im.license==='string' && /^(?:CC0|CC BY(?:-SA)? [234]\.0)$/.test(im.license) && typeof im.checked==='string' && /^\d{4}-\d{2}-\d{2}$/.test(im.checked) && safeSource(im.url) && safeSource(im.source) && safeSource(im.rightsEvidence) && safeSource(im.licenseUrl);
    const photo=allowed ? `<img class="product-media-photo" src="${escapeAttr(safeSource(im.url))}" alt="${esc(p.brand)} ${esc(p.model)}の製品写真" loading="lazy" decoding="async" width="72" height="72" data-product-photo>` : '';
    const credit=allowed ? `<span class="product-media-credit"><a href="${escapeAttr(safeSource(im.source))}" target="_blank" rel="noopener noreferrer" title="写真の出典：${esc(im.creator)}">写真: ${esc(im.creator)}</a> · <a href="${escapeAttr(safeSource(im.licenseUrl))}" target="_blank" rel="noopener noreferrer">${esc(im.license)}</a></span>` : '';
    return `<span class="product-media" data-category="${escapeAttr(p.cat)}">${fallback}${photo}${credit}</span>`;
  };
  // A broken or blocked external image must never leave a broken-image icon.
  document.addEventListener('error', event => {
    const img=event.target;
    if(img instanceof HTMLImageElement && img.hasAttribute('data-product-photo')){img.parentElement?.querySelector('.product-media-credit')?.remove();img.remove();}
  }, true);
  const statusBadge = p => `<span class="state-badge${validSpecs(p)?'':' pending'}">${validSpecs(p) ? '出典付き仕様あり' : '仕様登録待ち'}</span>`;
  const formatPreview = p => {const values = Object.entries(p.specs||{}).slice(0,2).map(([key,val])=>`${key}：${val}`);return values.length ? values.join(' ／ ') : '仕様の詳細はまだ登録されていません。';};
  const query = new URLSearchParams(location.search);
  const safeRead = (key,fallback) => {try{return JSON.parse(sessionStorage.getItem(key)) ?? fallback;}catch{return fallback;}};
  const safeWrite = (key,value) => {try{sessionStorage.setItem(key,JSON.stringify(value));}catch{/* storage may be disabled */}};
  const svgSearch='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.7" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.4 4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  const menuBtn = $('.mobile-toggle');
  if(menuBtn)menuBtn.addEventListener('click',()=>{const nav=$('#mobileNav');const show=nav.hidden;nav.hidden=!show;menuBtn.setAttribute('aria-expanded',String(show));menuBtn.setAttribute('aria-label',show?'メニューを閉じる':'メニューを開く');});

  if(document.body.dataset.page === 'home'){
    const featured=$('#homeProducts');
    const featuredCats=['router','switch','monitor'];
    const chosen=featuredCats.map(cat=>products.find(p=>p.cat===cat&&validSpecs(p))).filter(Boolean);
    featured.innerHTML=chosen.length ? chosen.map(p=>`<article class="featured-card">${productMedia(p)}<div class="featured-brand">${esc(p.brand)} · ${esc(labelCat(p.cat))}</div><h3>${esc(p.model)}</h3><p>${esc(p.category)}</p><div class="featured-meta">${statusBadge(p)}<a href="search.html?q=${encodeURIComponent(p.model)}">製品を見る ↗</a></div></article>`).join('') : '<p class="muted">出典付きの製品は準備中です。</p>';
  }

  if(document.body.dataset.page === 'search'){
    const validModes=['find','compare','alternatives'];
    const initialMode=validModes.includes(query.get('mode')) ? query.get('mode'):'find';
    const comparisonKeys = (safeRead('baselayer_v31_compare',[]))
      .filter(key => typeof key==='string' && productMap.has(key)).slice(0,3);
    let selected=[...new Set(comparisonKeys)];
    let mode='find';
    const announce=message=>{const status=$('#resultCount');if(mode==='find' && status) status.textContent=message;};
    const catFilter=$('#categoryFilter'),brandFilter=$('#brandFilter'),statusFilter=$('#statusFilter'),sortFilter=$('#sortFilter');
    Object.entries(categories).filter(([cat])=>products.some(p=>p.cat===cat)).forEach(([cat,label])=>catFilter.add(new Option(label,cat)));
    [...new Set(products.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b,'ja')).forEach(b=>brandFilter.add(new Option(b,b)));
    if(query.get('category') && [...catFilter.options].some(o=>o.value===query.get('category')))catFilter.value=query.get('category');
    const productQuery=$('#catalogQuery');productQuery.value=(query.get('q')||'').slice(0,100);

    const updateUrl = () => {
      const next=new URL(location.href);
      if(mode==='find')next.searchParams.delete('mode');else next.searchParams.set('mode',mode);
      const q=productQuery.value.trim();if(q)next.searchParams.set('q',q);else next.searchParams.delete('q');
      if(catFilter.value!=='all')next.searchParams.set('category',catFilter.value);else next.searchParams.delete('category');
      if(mode==='alternatives' && $('#alternativeTarget').value)next.searchParams.set('model',$('#alternativeTarget').value);else next.searchParams.delete('model');
      history.replaceState(null,'',next.pathname+next.search);
    };
    const selectMode = (name,focus=false) => {
      if(!validModes.includes(name))return;
      mode=name;
      $$('.workspace-tab').forEach(b=>{const active=b.dataset.mode===name;b.classList.toggle('is-active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
      for(const [key,panel] of [['find','#panelFind'],['compare','#panelCompare'],['alternatives','#panelAlternatives']])$(panel).hidden=(key!==name);
      updateUrl();
      renderTray();
      if(name==='compare')renderCompare();
      if(name==='alternatives')renderAlternatives();
      if(focus){const target=$(`.workspace-tab[data-mode="${name}"]`);target?.focus();window.scrollTo({top:Math.max(0,$('.workspace-tabs').getBoundingClientRect().top+scrollY-95),behavior:'smooth'});}
    };
    $$('.workspace-tab').forEach(b=>b.addEventListener('click',()=>selectMode(b.dataset.mode)));
    $('.workspace-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const i=validModes.indexOf(mode);const next=validModes[(i+(e.key==='ArrowRight'?1:2))%3];selectMode(next,true);});

    const renderResults=()=>{
      const search=productQuery.value.toLocaleLowerCase().normalize('NFKC').trim();
      const terms=search.split(/\s+/).filter(Boolean);
      let results=products.filter(p=>{
        if(catFilter.value!=='all'&&p.cat!==catFilter.value)return false;
        if(brandFilter.value!=='all'&&p.brand!==brandFilter.value)return false;
        if(statusFilter.value==='sourced'&&!validSpecs(p))return false;
        if(statusFilter.value==='pending'&&validSpecs(p))return false;
        if(!terms.length)return true;
        const hay=[p.model,p.brand,p.cat,p.category].join(' ').toLocaleLowerCase().normalize('NFKC');
        return terms.every(t=>hay.includes(t));
      });
      if(sortFilter.value==='model')results.sort((a,b)=>a.model.localeCompare(b.model,'ja'));
      else if(sortFilter.value==='brand')results.sort((a,b)=>a.brand.localeCompare(b.brand,'ja')||a.model.localeCompare(b.model,'ja'));
      else results.sort((a,b)=>Number(validSpecs(b))-Number(validSpecs(a))||a.model.localeCompare(b.model,'ja'));
      $('#resultCount').textContent=`${results.length}件の製品を表示 / 登録 ${products.length}件`;
      const container=$('#catalogResults');
      container.innerHTML=results.length ? results.map(p=>{
        const key=modelKey(p);const added=selected.includes(key);
        return `<article class="product-row"><div class="product-row-main">${productMedia(p)}<div class="product-row-top"><span class="product-brand">${esc(p.brand)} · ${esc(labelCat(p.cat))}</span>${statusBadge(p)}</div><h3>${esc(p.model)}</h3><p class="product-description">${esc(p.category)}</p><p class="product-preview">${esc(formatPreview(p))}</p></div><div class="product-row-actions"><button type="button" class="btn-outline" data-action="details" data-key="${escapeAttr(key)}">詳細を見る</button><button type="button" class="btn-quiet" data-action="compare" data-key="${escapeAttr(key)}" aria-pressed="${added}">${added?'✓ 比較に追加済み':'+ 比較に追加'}</button></div></article>`;
      }).join('') : `<div class="empty-state">${svgSearch}<strong>条件に合う製品がありません</strong><p>検索語や絞り込みを変更してください。未登録製品の仕様は推測して表示しません。</p><a href="search.html">条件をリセット</a></div>`;
      updateUrl();
    };
    $('#catalogSearchForm').addEventListener('submit',e=>{e.preventDefault();renderResults();});
    productQuery.addEventListener('input',()=>renderResults());
    [catFilter,brandFilter,statusFilter,sortFilter].forEach(el=>el.addEventListener('change',renderResults));
    $('#resetFilters').addEventListener('click',()=>{catFilter.value='all';brandFilter.value='all';statusFilter.value='all';sortFilter.value='verified';productQuery.value='';renderResults();productQuery.focus();});

    const storeComparison=()=>{safeWrite('baselayer_v31_compare',selected);$('#tabCompareCount').textContent=String(selected.length);renderTray();renderResults();if(mode==='compare')renderCompare();};
    const toggleCompare=(key)=>{
      if(!productMap.has(key))return;
      if(selected.includes(key))selected=selected.filter(k=>k!==key);
      else if(selected.length>=3){window.alert('比較できるのは最大3製品です。先に他の製品を比較から外してください。');return;}
      else selected.push(key);
      storeComparison();
    };
    const renderTray=()=>{
      $('#compareTray').hidden=selected.length===0 || mode==='compare';
      $('#trayLabel').textContent=`${selected.length}製品を比較候補に追加`;
      $('#trayModels').innerHTML=selected.map(key=>`<span>${esc(getProduct(key)?.model||'')}</span>`).join('');
    };
    const openDetail=key=>{
      const p=getProduct(key);if(!p)return;
      const rows=Object.entries(p.specs||{});
      $('#dialogBody').innerHTML=`<div class="dialog-body-content">${productMedia(p)}<div class="product-brand">${esc(p.brand)} · ${esc(labelCat(p.cat))}</div><h2 id="dialogTitle">${esc(p.model)}</h2><p class="dialog-category">${esc(p.category)}</p>${statusBadge(p)}<div class="dialog-notice">${validSpecs(p)?'メーカー出典URLと仕様の確認日が記録されています。販売・サポート状況は改めて公式情報で確認してください。':'この製品は仕様の詳細がまだ登録されていません。値を推測して埋めることはしていません。'}</div><h3 class="dialog-section-title">登録済みの仕様</h3>${rows.length?`<table class="dialog-specs"><tbody>${rows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">登録された仕様はありません。</p>'}${p.memo?`<div class="dialog-notice">確認事項：${esc(p.memo)}</div>`:''}<div class="dialog-source">${p.checked?`記録上の確認日：${esc(p.checked)}<br>`:''}${safeSource(p.source)?`出典：<a href="${escapeAttr(safeSource(p.source))}" target="_blank" rel="noopener noreferrer">メーカー公式ページを開く ↗</a>`:'出典URL：未登録'}</div><div class="dialog-footer-actions"><button type="button" class="btn-primary" id="dialogAddCompare">${selected.includes(key)?'比較から外す':'+ 比較に追加'}</button><a class="btn-outline" href="search.html?mode=alternatives&model=${encodeURIComponent(key)}">代替候補を探す ↗</a>${['router','switch','ap','server','monitor','printer'].includes(p.cat)?`<a class="btn-quiet" href="network.html?model=${encodeURIComponent(key)}&side=B">構成Bに追加 ↗</a>`:''}</div></div>`;
      $('#dialogAddCompare').addEventListener('click',()=>{toggleCompare(key);const now=$('#dialogAddCompare');now.textContent=selected.includes(key)?'比較から外す':'+ 比較に追加';});
      $('#productDialog').showModal();
    };
    $('#closeDialog').addEventListener('click',()=>$('#productDialog').close());
    $('#productDialog').addEventListener('click',e=>{if(e.target.id==='productDialog')$('#productDialog').close();});
    $('#catalogResults').addEventListener('click',e=>{const button=e.target.closest('button[data-action]');if(!button)return;button.dataset.action==='details'?openDetail(button.dataset.key):toggleCompare(button.dataset.key);});
    $('#goCompare').addEventListener('click',()=>selectMode('compare',true));
    $('#clearCompare').addEventListener('click',()=>{selected=[];storeComparison();});
    $('#onlyDiff').addEventListener('change',renderCompare);

    function renderCompare(){
      const chosen=selected.map(getProduct).filter(Boolean);
      const target=$('#compareView');
      if(!chosen.length){target.innerHTML='<div class="empty-state"><strong>比較する製品がまだありません</strong><p>「製品を探す」から比較したい製品を追加してください。</p><button class="btn-primary" id="chooseProducts">製品を探す →</button></div>';$('#chooseProducts').addEventListener('click',()=>selectMode('find',true));return;}
      const boxes=[...chosen];
      const cards=Array.from({length:3},(_,i)=>{const p=boxes[i];return p?`<div class="selected-card">${productMedia(p)}<span class="product-brand">${esc(p.brand)}</span><button type="button" data-remove="${escapeAttr(modelKey(p))}" aria-label="${esc(p.model)}を比較から外す">×</button><strong>${esc(p.model)}</strong>${statusBadge(p)}</div>`:'<div class="selected-card selected-empty">比較候補を追加できます</div>';}).join('');
      if(chosen.length<2){target.innerHTML=`<div class="compare-selected">${cards}</div><div class="empty-state"><strong>もう1製品選ぶと比較できます</strong><p>比較する製品を最大3件まで追加できます。</p><button class="btn-primary" id="chooseProducts">製品を追加する →</button></div>`;$('#chooseProducts').addEventListener('click',()=>selectMode('find',true));}
      else {
        const keys=[...new Set(chosen.flatMap(p=>Object.keys(p.specs||{})))];
        const onlyDiff=$('#onlyDiff').checked;
        const displayKeys=keys.filter(k=>!onlyDiff || new Set(chosen.map(p=>p.specs?.[k]??'仕様未登録')).size>1);
        const renderRow=(label,vals,highlight)=>`<tr><th scope="row">${esc(label)}</th>${vals.map(v=>`<td${highlight?' class="diff-cell"':''}>${esc(v??'仕様未登録')}</td>`).join('')}</tr>`;
        const rows=[renderRow('メーカー',chosen.map(p=>p.brand),new Set(chosen.map(p=>p.brand)).size>1),renderRow('カテゴリ',chosen.map(p=>labelCat(p.cat)),new Set(chosen.map(p=>p.cat)).size>1),...displayKeys.map(k=>{const vals=chosen.map(p=>p.specs?.[k]??'未確認');return renderRow(k,vals,new Set(vals).size>1);})];
        target.innerHTML=`<div class="compare-selected">${cards}</div><div class="compare-table-scroll"><table class="spec-compare"><thead><tr><th scope="col">仕様項目</th>${chosen.map(p=>`<th scope="col">${esc(p.model)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div><p class="comparison-note">※ 空欄は「未確認」と表示。測定条件や表現の違いによっても差として表示されます。${onlyDiff&&displayKeys.length===0?' 記録された仕様で違いが見つからない場合も、互換性を意味しません。':''}</p>`;
        const cats=new Set(chosen.map(p=>p.cat));if(cats.size>1)target.insertAdjacentHTML('beforeend','<div class="info-banner"><span>ⓘ</span><p>異なるカテゴリの製品が含まれます。用途の異なる製品について、優劣や代替可能性を比較することはできません。</p></div>');
      }
      $$('[data-remove]',target).forEach(b=>b.addEventListener('click',()=>toggleCompare(b.dataset.remove)));
    }

    const alternatives=$('#alternativeTarget');
    [...products].sort((a,b)=>a.cat.localeCompare(b.cat)||a.model.localeCompare(b.model,'ja')).forEach(p=>alternatives.add(new Option(`${labelCat(p.cat)} / ${p.brand} ${p.model}`,modelKey(p))));
    const initialKey=query.get('model')||'';
    if(productMap.has(initialKey))alternatives.value=initialKey;
    else if(initialKey){const p=products.find(p=>p.model===initialKey);if(p)alternatives.value=modelKey(p);}
    alternatives.addEventListener('change',()=>{updateUrl();renderAlternatives();});
    $('#alternativeResults').addEventListener('click',e=>{
      const btn=e.target.closest('button[data-pair]');if(!btn)return;
      const reference=alternatives.value,candidate=btn.dataset.pair;
      selected=[reference,candidate].filter(key=>productMap.has(key));storeComparison();selectMode('compare',true);
    });
    function renderAlternatives(){
      const ref=getProduct(alternatives.value),target=$('#alternativeResults');
      if(!ref){target.innerHTML='<div class="alternative-empty">基準となる製品を選ぶと、同じカテゴリの比較候補が表示されます。製品の置き換え可否は自動判定しません。</div>';return;}
      const candidates=products.filter(p=>p.cat===ref.cat&&modelKey(p)!==modelKey(ref)).map(p=>{
        const keys=Object.keys(ref.specs||{}).filter(k=>Object.hasOwn(p.specs||{},k));
        const relation=curatedRelations.find(r=>r.from_brand===ref.brand&&r.from_model===ref.model&&r.to_brand===p.brand&&r.to_model===p.model);
        return {p,overlap:keys.length,same:keys.filter(k=>ref.specs[k]===p.specs[k]).length,relation};
      }).sort((a,b)=>Number(Boolean(b.relation))-Number(Boolean(a.relation))||Number(validSpecs(b.p))-Number(validSpecs(a.p))||b.overlap-a.overlap||a.p.model.localeCompare(b.p.model,'ja'));
      const main=`<div class="alternative-reference">${productMedia(ref)}<div class="product-brand">基準となる製品 · ${esc(labelCat(ref.cat))}</div><h3>${esc(ref.brand)} ${esc(ref.model)}</h3><p>${validSpecs(ref)?'出典付き仕様の記録があります。':'仕様未登録のため、詳細な一致・相違を確認できません。'}</p></div>`;
      if(!candidates.length){target.innerHTML=main+'<div class="alternative-empty">同じカテゴリに登録されている比較候補はまだありません。ほかのカテゴリの機器を代替品として提示することはしません。</div>';return;}
      target.innerHTML=main+`<div class="alternative-candidates">${candidates.map(({p,overlap,same,relation})=>`<article class="alternative-card"><div>${productMedia(p)}<div class="product-row-top"><span class="product-brand">${esc(p.brand)} · ${esc(labelCat(p.cat))}</span>${statusBadge(p)}</div><h3>${esc(p.model)}</h3><p>${esc(p.category)}</p>${relation?`<p class="curated-evidence">${relation.relation==='official_successor'?'メーカーが後継品と明記した関係':'メーカー資料に基づく比較候補'}（導入前に適合条件を要確認） ${safeSource(relation.source)?`<a href="${escapeAttr(safeSource(relation.source))}" target="_blank" rel="noopener noreferrer">公式出典を確認 ↗</a>`:''}</p>`:''}<span class="alternative-scope">${overlap?`共通の仕様項目：${overlap}件 ／ 記録値が同じ項目：${same}件。その他の条件・測定条件は要確認。`:'仕様項目の比較は未完了。同じカテゴリの登録製品として表示しています。'} 公式後継品・互換品という認定ではありません。</span></div><div class="candidate-actions"><button class="btn-primary" type="button" data-pair="${escapeAttr(modelKey(p))}">2製品を比較 →</button></div></article>`).join('')}</div>`;
    }
    selectMode(initialMode);
    renderResults();renderTray();$('#tabCompareCount').textContent=String(selected.length);
  }

  if(document.body.dataset.page==='network'){
    const key='baselayer_v31_configs';
    const roles=[['router','ルーター'],['switch','スイッチ'],['ap','無線LAN AP'],['server','サーバー・NAS'],['monitor','モニター'],['printer','プリンター']];
    const blank=()=>Object.fromEntries(roles.map(([cat])=>[cat,'']));
    let configs={A:blank(),B:blank()};
    try{const stored=JSON.parse(localStorage.getItem(key)||'null');if(stored&&typeof stored==='object')for(const side of ['A','B'])for(const [cat] of roles){const v=stored[side]?.[cat];if(typeof v==='string' && (!v||productMap.has(v)))configs[side][cat]=v;}}catch{/* unavailable storage */}
    const initialProduct=getProduct(query.get('model')) || products.find(p=>p.model===query.get('model'));
    const side=['A','B'].includes(query.get('side'))?query.get('side'):'B';
    if(initialProduct&&roles.some(([cat])=>cat===initialProduct.cat)){configs[side][initialProduct.cat]=modelKey(initialProduct);const clean=new URL(location.href);clean.searchParams.delete('model');clean.searchParams.delete('side');history.replaceState(null,'',clean.pathname+clean.search);}
    const persist=()=>{try{localStorage.setItem(key,JSON.stringify(configs));}catch{/* storage may be disabled */}};
    const render=()=>{
      for(const side of ['A','B']){
        $('#config'+side).innerHTML=roles.map(([cat,label])=>{
          const list=products.filter(p=>p.cat===cat);
          return `<div class="config-row">${configs[side][cat]?productMedia(getProduct(configs[side][cat])):''}<label for="${side}_${cat}"><span>${esc(label)}</span><span>${list.length}製品登録</span></label><select id="${side}_${cat}" data-side="${side}" data-cat="${cat}"><option value="">— 未設定 —</option>${list.map(p=>`<option value="${escapeAttr(modelKey(p))}" ${configs[side][cat]===modelKey(p)?'selected':''}>${esc(p.brand)} ${esc(p.model)}${validSpecs(p)?'':'（仕様未登録）'}</option>`).join('')}</select><small>${configs[side][cat]?(validSpecs(getProduct(configs[side][cat]))?'出典付き仕様あり':'仕様未登録・条件の確認が必要'):'製品を選択してください'}</small></div>`;
        }).join('');
      }
      const changes=roles.map(([cat,label])=>{
        const a=getProduct(configs.A[cat]),b=getProduct(configs.B[cat]);
        const state=!a&&!b?'empty':!a?'added':!b?'removed':modelKey(a)===modelKey(b)?'unchanged':'changed';
        return {cat,label,a,b,state};
      });
      const counts=Object.fromEntries(['changed','added','removed','unchanged'].map(type=>[type,changes.filter(c=>c.state===type).length]));
      $('#configSummary').innerHTML=`<div class="summary-stats"><div class="summary-stat"><span>変更</span><strong>${counts.changed}</strong></div><div class="summary-stat"><span>追加</span><strong>${counts.added}</strong></div><div class="summary-stat"><span>削除</span><strong>${counts.removed}</strong></div><div class="summary-stat"><span>維持</span><strong>${counts.unchanged}</strong></div></div><div class="change-list">${changes.filter(c=>c.state!=='empty').length?changes.filter(c=>c.state!=='empty').map(c=>{
        const msg=c.state==='changed'?`${c.a.brand} ${c.a.model} → ${c.b.brand} ${c.b.model}`:c.state==='added'?`新しく追加：${c.b.brand} ${c.b.model}`:c.state==='removed'?`取り外し：${c.a.brand} ${c.a.model}`:`両構成とも ${c.a.brand} ${c.a.model}`;
        const labels={changed:'変更',added:'追加',removed:'削除',unchanged:'維持'};
        return `<div class="change-row"><span class="change-pill ${c.state}">${labels[c.state]}</span><div>${productMedia(c.b||c.a)}<strong>${esc(c.label)}</strong><p>${esc(msg)}${c.state==='changed'?' ／ 機能・接続・設定の互換性は未評価':''}</p></div></div>`;
      }).join(''):'<div class="empty-state"><strong>製品を選ぶと変更点が表示されます</strong><p>構成Aと構成Bの同じ役割で製品を選択してください。</p></div>'}</div><div class="info-banner" style="margin-top:18px"><span>ⓘ</span><p>構成比較は製品名の変更を整理しています。機器間の通信、ポート数、ライセンス、配線、構成の成立、販売状況は判定していません。</p></div>`;
      persist();
    };
    document.addEventListener('change',e=>{
      const el=e.target.closest('[data-side][data-cat]');if(!el)return;
      const newValue=el.value;
      if(newValue&&!productMap.has(newValue))return;
      configs[el.dataset.side][el.dataset.cat]=newValue;render();
    });
    $('#sampleConfigs').addEventListener('click',()=>{configs={A:blank(),B:blank()};configs.A.router=modelKey(products.find(p=>p.model==='RTX830'));configs.B.router=modelKey(products.find(p=>p.model==='RTX1300'));render();});
    $('#swapConfigs').addEventListener('click',()=>{const tmp=configs.A;configs.A=configs.B;configs.B=tmp;render();});
    $('#resetConfigs').addEventListener('click',()=>{if(window.confirm('構成Aと構成Bの選択をすべて初期化しますか？')){configs={A:blank(),B:blank()};render();}});
    $('#downloadConfig').addEventListener('click',()=>{
      const data={site:'BASELAYER',version:'31',type:'configuration_comparison',note:'製品名の変更点を記録したもの。性能・互換性・接続の成立は未検証。',exportedAt:new Date().toISOString(),configurations:configs,products:Object.fromEntries(['A','B'].map(s=>[s,Object.fromEntries(roles.map(([cat])=>[cat,(()=>{const p=getProduct(configs[s][cat]);return p?{brand:p.brand,model:p.model,source:safeSource(p.source)||null,checked:p.checked||null}:null;})()]))]))};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
      const uri=URL.createObjectURL(blob);const link=document.createElement('a');link.href=uri;link.download='baselayer-configuration-comparison.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(uri),1000);
    });
    render();
  }
})();
