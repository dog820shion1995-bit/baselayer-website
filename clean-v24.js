"use strict";
(()=>{
 const tabs=[...document.querySelectorAll('[data-v24-tab]')];
 const panels=[...document.querySelectorAll('[data-v24-panel]')];
 function activate(key,scroll=false){
  if(!panels.some(p=>p.dataset.v24Panel===key))return;
  tabs.forEach(t=>{const on=t.dataset.v24Tab===key;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1});
  panels.forEach(p=>p.hidden=p.dataset.v24Panel!==key);
  if(scroll)document.querySelector('.v24-tabs')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 tabs.forEach((t,i)=>{t.onclick=()=>activate(t.dataset.v24Tab);t.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];activate(next.dataset.v24Tab);next.focus()})});
 document.querySelectorAll('[data-v24-go]').forEach(b=>b.onclick=()=>activate(b.dataset.v24Go,true));
 const jump=document.querySelector('#v19JumpCompare');if(jump)jump.addEventListener('click',()=>activate('compare',true));
 activate('find');
})();
