(() => {
  'use strict';
  if (!document.querySelector('script[data-ongil-main-finish]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/main-finish.js?v=20260803-final-v1';
    script.async = true;
    script.dataset.ongilMainFinish = 'true';
    document.head.appendChild(script);
  }
  if (!document.querySelector('script[data-ongil-lower-theme]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/lower-theme.js?v=20260803-warm-v1';
    script.async = true;
    script.dataset.ongilLowerTheme = 'true';
    document.head.appendChild(script);
  }
})();

(() => {
  'use strict';
  if (document.querySelector('script[data-ongil-payment-ui]')) return;
  const script = document.createElement('script');
  script.src = 'assets/js/payment-ui.js?v=20260803-service-pass-v1';
  script.async = true;
  script.dataset.ongilPaymentUi = 'true';
  document.head.appendChild(script);
})();

(() => {
  'use strict';
  if (document.querySelector('script[data-ongil-access-control]')) return;
  const script = document.createElement('script');
  script.src = 'assets/js/access-control.js?v=20260803-one-use-v1';
  script.async = true;
  script.dataset.ongilAccessControl = 'true';
  document.head.appendChild(script);
})();

(()=>{
'use strict';
const form=document.querySelector('#lottoForm');
if(!form)return;
const api=()=>window.ONGIL;
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const dateInput=form.querySelector('[name="lottoDate"]');
const dateChip=document.querySelector('#lottoDateChip');
let variation=0;

function seoulDateString(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}
function formatKoreanDate(value){
  const date=new Date(`${value}T12:00:00+09:00`);
  return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(date);
}
function updateDateChip(){if(dateChip&&dateInput?.value)dateChip.textContent=formatKoreanDate(dateInput.value);}
if(dateInput&&!dateInput.value)dateInput.value=seoulDateString();
updateDateChip();
dateInput?.addEventListener('change',()=>{variation=0;updateDateChip();});
form.addEventListener('reset',()=>setTimeout(()=>{
  variation=0;
  if(dateInput)dateInput.value=seoulDateString();
  updateDateChip();
},0));

function hash(text){
  let value=2166136261;
  for(const char of String(text)){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}
  return value>>>0;
}
function randomFactory(seed){
  let state=seed>>>0;
  return ()=>{state+=0x6D2B79F5;let x=state;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return ((x^(x>>>14))>>>0)/4294967296;};
}
function parseNumbers(value){
  return [...new Set(String(value||'').split(/[^0-9]+/).filter(Boolean).map(Number).filter(number=>number>=1&&number<=45))];
}
function rangeOf(number){return number<=10?1:number<=20?2:number<=30?3:number<=40?4:5;}
function stats(numbers){
  const odd=numbers.filter(number=>number%2===1).length;
  const low=numbers.filter(number=>number<=22).length;
  const sum=numbers.reduce((total,number)=>total+number,0);
  return {odd,even:6-odd,low,high:6-low,sum};
}
function isBalanced(numbers,style){
  const s=stats(numbers);
  const consecutive=numbers.slice(1).filter((number,index)=>number-numbers[index]===1).length;
  if(style==='low')return s.low>=4&&s.odd>=2&&s.odd<=4&&consecutive<=2;
  if(style==='high')return s.high>=4&&s.odd>=2&&s.odd<=4&&consecutive<=2;
  if(style==='mixed')return s.low>=2&&s.low<=4&&s.odd>=2&&s.odd<=4&&s.sum>=105&&s.sum<=180&&consecutive<=2;
  return true;
}
function generateSet(seed,style,required,excluded,usedSignatures){
  const allowed=Array.from({length:45},(_,index)=>index+1).filter(number=>!excluded.includes(number));
  if(required.some(number=>excluded.includes(number))||required.length>6||allowed.length<6)return null;
  for(let attempt=0;attempt<800;attempt++){
    const random=randomFactory(seed+attempt*104729);
    const picked=[...required];
    const pool=allowed.filter(number=>!picked.includes(number));
    while(picked.length<6&&pool.length){
      const index=Math.floor(random()*pool.length);
      picked.push(pool.splice(index,1)[0]);
    }
    picked.sort((a,b)=>a-b);
    const signature=picked.join('-');
    if(picked.length===6&&isBalanced(picked,style)&&!usedSignatures.has(signature)){
      usedSignatures.add(signature);
      return picked;
    }
  }
  return null;
}
function styleLabel(style){return ({mixed:'균형 조합',low:'낮은 수 중심',high:'높은 수 중심',free:'완전 자동'})[style]||'균형 조합';}
function setMarkup(numbers,index){
  const s=stats(numbers);
  return `<article class="lotto-set">
    <span class="lotto-set-label">추천 ${String(index+1).padStart(2,'0')}</span>
    <div class="lotto-balls">${numbers.map(number=>`<span class="lotto-ball" data-range="${rangeOf(number)}">${number}</span>`).join('')}</div>
    <span class="lotto-balance"><strong>홀 ${s.odd} · 짝 ${s.even}</strong><small>합계 ${s.sum}</small></span>
  </article>`;
}

form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  const required=parseNumbers(data.includeNumbers);
  const excluded=parseNumbers(data.excludeNumbers);
  if(required.some(number=>excluded.includes(number))){api()?.toast('포함 번호와 제외 번호가 겹칩니다.');return;}
  if(required.length>6){api()?.toast('포함 번호는 최대 6개까지 입력할 수 있습니다.');return;}
  const count=Math.min(10,Math.max(1,Number(data.setCount)||5));
  const baseSeed=hash(`${data.lottoDate}|${data.style}|${required.join(',')}|${excluded.join(',')}|${variation}`);
  const sets=[];
  const signatures=new Set();
  for(let index=0;index<count;index++){
    const numbers=generateSet(baseSeed+index*7919,data.style,required,excluded,signatures);
    if(numbers)sets.push(numbers);
  }
  if(!sets.length){api()?.toast('조건에 맞는 조합을 만들 수 없습니다. 포함·제외 번호를 줄여주세요.');return;}
  const body=`
    <div class="lotto-results">${sets.map(setMarkup).join('')}</div>
    <section class="lotto-summary-card"><h4>${esc(formatKoreanDate(data.lottoDate))} · ${esc(styleLabel(data.style))}</h4><p>입력한 날짜와 선택 조건을 기준으로 중복 없이 구성한 오락용 번호입니다. 번호 구간과 홀짝 비율을 분산했지만, 모든 6개 조합의 실제 당첨 확률은 동일합니다.</p></section>
    <p class="lotto-warning">복권 번호는 사전에 정확히 예측할 수 없으며 당첨을 보장하지 않습니다. 구매 여부와 금액은 본인이 책임 있게 판단하세요.</p>`;
  api()?.resultShell('lotto',`${formatKoreanDate(data.lottoDate)} 로또 추천번호`,body,sets.map(numbers=>numbers.join(', ')).join(' / '));
});

const remix=document.querySelector('#lottoRemixBtn');
remix?.addEventListener('click',()=>{
  variation+=1;
  form.requestSubmit();
});
})();
