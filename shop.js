const catalog = [
 ['영웅 조각',500,[[10,10]],[['주간 성급 강화',149000,100]]],
 ['장비 강화석',10000,[[4,1000]],[['장비 강화팩',74500,12000]]],
 ['스킬 메달',10000,[[4,2500,'29서버'],[4,2000,'공개표']],[['영웅 성장팩',74500,30000]]],
 ['연구 메달',1000,[[4,100]],[['과학 연구팩',149000,5000]]],
 ['그리핀 코어',100,[[12,100]],[['주간 그리핀팩',74500,600]]],
 ['광석',4000,[[12,4000,'대형'],[5,1000,'소형']],[]],
 ['UR 장비 도면',1,[[12,1]],[]],['MR 장비 도면',1,[],[]],
 ['장식물 강화 재료',100,[],[['주간 장식물팩',149000,1100]]],
 ['영웅 경험치 상자 (10월 기록)',5,[[7,5]],[]],
 ['은색 장비 재료 (10월 기록)',1000,[],[['데일리 장비팩',7500,1000]]]
];
const el=id=>document.getElementById(id);
const fmt=n=>n.toLocaleString('ko-KR');
const read=id=>el(id).value!=='' && el(id).validity.valid && Number.isSafeInteger(el(id).valueAsNumber)?el(id).valueAsNumber:null;
catalog.forEach(([name],index)=>el('item').add(new Option(name,index)));
function calculate(){
 const [name,,exchanges,packs]=catalog[el('item').selectedIndex];
 const goal=read('goal'),owned=read('owned'),tickets=read('tickets');
 const out=el('results');out.replaceChildren();
 if([goal,owned,tickets].includes(null)){el('need').textContent='수량을 0 이상의 정수로 입력하세요.';return}
 const need=Math.max(0,goal-owned);
 el('need').textContent=need?name+' '+fmt(need)+'개 부족 · 예상 결제액이 낮은 순':'목표 달성 · 추가 결제 0원';
 el('tip').textContent=el('kind').value==='사냥 이벤트'?'사냥 티켓 100장 → 조각 10개. 이번 결제로 추가 교환 가능한 수량을 입력하세요.':'확률 보상은 직접 입력한 시나리오로 계산합니다.';
 if(!need)return;
 let offers=[];
 for(const [cost,qty,label] of exchanges){
  const swaps=Math.ceil(need/qty),used=swaps*cost,count=Math.ceil(Math.max(0,used-tickets)/100);
  offers.push(['전쟁교환소 '+(label||''),count*74500,'교환 '+fmt(swaps)+'회 · 교환권 '+fmt(used)+'장 사용 · 100장 묶음 '+fmt(count)+'회 구매']);
 }
 const direct=[...packs],price=read('price'),qty=read('qty');
 if(price&&qty)direct.push([el('kind').value+' (입력값)',price,qty]);
 for(const [title,price,qty] of direct){
  const count=Math.ceil(need/qty);
  offers.push([title,count*price,fmt(price)+'원 × '+fmt(count)+'회 · 총 '+fmt(count*qty)+'개']);
 }
 if(!offers.length){out.textContent='위 이벤트 비교란에 상품 가격과 지급량을 입력하세요.';return}
 offers.sort((a,b)=>a[1]-b[1]);
 for(const [title,cost,desc] of offers){
  const row=document.createElement('div');row.className='offer';
  row.innerHTML='<div class="line"><b></b><strong></strong></div><div class="bar"><i></i></div><small></small>';
  row.querySelector('b').textContent=title;row.querySelector('strong').textContent=fmt(cost)+'원';
  row.querySelector('i').style.width=100*cost/(offers.at(-1)[1]||1)+'%';row.querySelector('small').textContent=desc;out.append(row);
 }
}
el('item').onchange=()=>{el('goal').value=catalog[el('item').selectedIndex][1];for(const key of ['owned','price','qty'])el(key).value=key==='owned'?'0':'';calculate()};
document.addEventListener('input',calculate);calculate();
