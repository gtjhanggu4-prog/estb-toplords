const arrowForm=document.getElementById('arrowForm');
function updateArrows(){
 const output=document.getElementById('arrowResult');
 const read=name=>arrowForm.elements[name].valueAsNumber;
 const valid=name=>arrowForm.elements[name].validity.valid;
 if(!['target','owned','free'].every(valid)){
  output.textContent='목표·보유·무료 화살 수를 입력하세요.';return;
 }
 const shortage=Math.max(0,read('target')-read('owned')-read('free'));
 if(!shortage){output.textContent='목표 발수 충족 · 추가 결제 0원';return}
 const prefix='부족한 화살 '+shortage.toLocaleString('ko-KR')+'발';
 if(!['price','pack'].every(valid)){
  output.textContent=prefix+' · 패키지 가격과 지급 발수를 입력하세요.';return;
 }
 const count=Math.ceil(shortage/read('pack'));
 output.textContent=prefix+' · '+count+'팩 · 추가 결제 '+(count*read('price')).toLocaleString('ko-KR')+'원 · 남는 화살 '+(count*read('pack')-shortage)+'발';
}
arrowForm.onsubmit=event=>event.preventDefault();
arrowForm.addEventListener('input',updateArrows);
updateArrows();
