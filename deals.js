const byId=id=>document.getElementById(id);
const prices=[7500,15000,30000,75000];
const deals=[
 ['스페셜 가속','5분 가속 300개 · 목재/식량 SSR 상자 각 3개',500],
 ['슈퍼 건설','5분 가속 150개 · 황금 방패 기사 1 · 목재 SSR 상자 3개',500],
 ['잔다르크 한정','전용 조각 10 · SR 경험치 상자 15 · 스킬 메달 1,000',500],
 ['정보 수집','기타 구성 미확인',500],
 ['상회 직송 첫 단계','후속 무료 수령 단계 별도',500],
 ['직접 입력 타임딜','현재 회차 상품',0]
];
const milestones=[[100,10,5,500,500],[200,10,5,500,500],[400,15,10,1000,1000],[600,15,10,1000,1000],[1000,30,20,2000,2000]];
const fmt=n=>n.toLocaleString('ko-KR');
function field(label,key,value=''){
 return '<label>'+label+'<input type="number" min="0" max="100000000" data-key="'+key+'" value="'+value+'"></label>';
}
function rows(id){return Array.from(byId(id).children)}
function number(row,key){return Number(row.querySelector('[data-key="'+key+'"]').value)}
function options(id,low,high,value){
 const select=byId(id);select.replaceChildren();
 for(let i=low;i<=high;i++)select.add(new Option(i?i+'단계':'없음',i));
 select.value=Math.min(high,Math.max(low,value));
}
options('cap',1,4,3);
prices.forEach((p,i)=>byId('steps').insertAdjacentHTML('beforeend','<div class="row"><b>'+(i+1)+'단계</b><div class="grid">'+field('가격 (원)','price',p)+field('목표 아이템 수량','qty',0)+field('지급 다이아','gem',0)+'</div></div>'));
deals.forEach(([name,desc,gem])=>byId('deals').insertAdjacentHTML('beforeend','<div class="row"><label><input type="checkbox"> '+name+'</label><small>'+desc+'</small><div class="grid">'+field('한국 가격 (원)','price')+field('목표 아이템 수량','qty',0)+field('지급 다이아','gem',gem)+'</div></div>'));
function addLevel(){byId('levels').insertAdjacentHTML('beforeend','<div class="grid">'+field('보상 레벨','threshold')+field('다이아','gem')+'</div>')}
byId('add').onclick=addLevel;addLevel();
function updateRange(initial=false){
 const cap=Number(byId('cap').value);
 options('start',0,cap,Number(byId('start').value));
 options('end',Number(byId('start').value),cap,initial?cap:Number(byId('end').value));
 rows('steps').forEach((row,i)=>row.hidden=i>=cap);
}
function render(){
 const out=byId('summary');const first=Number(byId('start').value),last=Number(byId('end').value);
 let cost=0,qty=0,gems=0;
 function include(row){cost+=number(row,'price');qty+=number(row,'qty');gems+=number(row,'gem')}
 const active=[...rows('steps').slice(first,last),...rows('deals').filter(row=>row.querySelector('[type=checkbox]').checked)];
 const before=Number(byId('before').value),after=before+Number(byId('gain').value);
 const earned=milestones.filter(([threshold])=>threshold>before&&threshold<=after);
 byId('milestones').textContent=milestones.map(([n,,,,g])=>fmt(n)+'배지 / '+fmt(g)+'♦').join(' · ');
 const levels=rows('levels'),old=Number(byId('oldLevel').value),next=Number(byId('newLevel').value);
 if(active.some(row=>number(row,'price')<=0)||[...active.flatMap(row=>[...row.querySelectorAll('[type=number]')]),...document.querySelectorAll('#levels input,#before,#gain,#oldLevel,#newLevel')].some(input=>!input.validity.valid)||next<old){
 out.textContent='선택한 상품의 가격과 레벨·수량을 확인하세요.';return;}
 active.forEach(include);
 const levelGems=levels.reduce((sum,row)=>{const level=number(row,'threshold');return sum+(level>old&&level<=next?number(row,'gem'):0)},0);
 const sums=earned.reduce((sum,row)=>sum.map((n,i)=>n+row[i+1]),[0,0,0,0]);
 out.innerHTML='<div class="total">'+fmt(cost)+'원 · '+fmt(gems+levelGems+sums[3])+' 다이아</div><p>상품 '+fmt(gems)+' ♦ + 레벨 '+fmt(levelGems)+' ♦ + 누적 충전 '+fmt(sums[3])+' ♦</p><p>상품 목표 아이템 '+fmt(qty)+'개'+(qty?' · 개당 '+fmt(Math.round(cost/qty))+'원':'')+'</p><p>누적 보상 '+earned.length+'단계 · 이순신 조각 '+sums[0]+' · SSR 경험치 상자 '+sums[1]+' · 스킬 메달 '+fmt(sums[2])+'</p>';
}
document.addEventListener('input',event=>{if(['cap','start'].includes(event.target.id))updateRange(event.target.id==='cap');render()});
updateRange(true);render();
