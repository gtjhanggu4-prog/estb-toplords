(() => {
 const list=[['ko','🇰🇷','한국어'],['en','🇬🇧','English'],['fr','🇫🇷','Français'],['de','🇩🇪','Deutsch'],['tr','🇹🇷','Türkçe'],['ar','🇸🇦','العربية'],['fa','🇮🇷','فارسی']];
 const copy=[
 ['언어 선택','탑로드 스튜디오','영웅 전투실','부대 편성과 전투 분석','전장 열기','구매 계산기','패키지 가격과 보상 비교','이벤트 도감','이벤트별 진행 방식과 보상'],
 ['Choose your language','Top Lords Studio','Battle studio','Formations and battle analysis','Enter the field','Purchase calculator','Compare pack prices and rewards','Event atlas','Event rules and rewards'],
 ['Choisir la langue','Studio Top Lords','Salle de combat','Formations et analyse des combats','Entrer sur le terrain','Calculateur d’achats','Comparer les offres et les récompenses','Atlas des événements','Règles et récompenses'],
 ['Sprache wählen','Top Lords Studio','Kampfstudio','Aufstellungen und Kampfanalyse','Zum Schlachtfeld','Kaufrechner','Paketpreise und Belohnungen vergleichen','Eventatlas','Ablauf und Belohnungen'],
 ['Dil seçin','Top Lords Stüdyosu','Savaş stüdyosu','Dizilim ve savaş analizi','Savaş alanına gir','Satın alma hesaplayıcısı','Paket fiyatlarını ve ödülleri karşılaştır','Etkinlik atlası','Etkinlik kuralları ve ödülleri'],
 ['اختر اللغة','استوديو توب لوردز','ساحة المعركة','تشكيل الفرق وتحليل المعارك','ادخل الميدان','حاسبة المشتريات','مقارنة أسعار الحزم والمكافآت','أطلس الفعاليات','قواعد الفعاليات ومكافآتها'],
 ['انتخاب زبان','استودیوی تاپ لوردز','میدان نبرد','چیدمان تیم و تحلیل نبرد','ورود به میدان','ماشین‌حساب خرید','مقایسه قیمت بسته‌ها و پاداش‌ها','اطلس رویدادها','قوانین و پاداش رویدادها']
 ];
 const saved=localStorage.getItem('estb-lang'),valid=list.some(([id])=>id===saved);
 let current=valid?saved:navigator.language.slice(0,2);
 if(!list.some(([id])=>id===current))current='en';
 const modal=document.createElement('dialog');modal.className='localeGate';modal.setAttribute('aria-labelledby','localeTitle');document.body.append(modal);
 const home=document.querySelector('.portals'),select=document.querySelector('select#lang');
 function apply(id){
 current=id;const i=list.findIndex(row=>row[0]===id),t=copy[i];
 if(home){
 document.documentElement.lang=id;document.documentElement.dir=['ar','fa'].includes(id)?'rtl':'ltr';
 document.querySelector('h1').textContent=t[1];document.title=t[1]+' · ESTB';
 home.querySelectorAll('a').forEach((a,j)=>{a.querySelector('h2').textContent=t[[2,5,7][j]];a.querySelector('p').textContent=t[[3,6,8][j]];a.querySelector('small').hidden=true});home.querySelector('b').textContent=t[4]+' ↗';
 document.querySelector('#chooseLocale').textContent=list[i][1]+' '+list[i][2];
 }
 if(select){for(const opt of select.options){const l=list.find(x=>x[0]===opt.value);if(l)opt.textContent=l[1]+' '+l[2]}if(select.value!==id){select.value=id;select.dispatchEvent(new Event('change'))}}
 }
 function open(){let i=list.findIndex(row=>row[0]===current);modal.innerHTML='<small>ESTB · TOP LORDS</small><h2 id="localeTitle">'+copy[i][0]+'</h2><div>'+list.map(([id,flag,name])=>'<button type="button" lang="'+id+'" data-code="'+id+'"><span aria-hidden="true">'+flag+'</span> '+name+'</button>').join('')+'</div>';modal.showModal()}
 modal.addEventListener('click',e=>{const b=e.target.closest('[data-code]');if(!b)return;localStorage.setItem('estb-lang',b.dataset.code);apply(b.dataset.code);modal.close()});
 modal.addEventListener('cancel',e=>{if(!localStorage.getItem('estb-lang'))e.preventDefault()});
 if(home){const b=document.createElement('button');b.id='chooseLocale';b.onclick=open;document.querySelector('header').append(b)}
 if(select)select.addEventListener('change',()=>apply(select.value));
 apply(current);if(!valid)open();
})();
