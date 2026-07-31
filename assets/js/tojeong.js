(()=>{
'use strict';
const form=document.querySelector('#tojeongForm');
if(!form)return;
const api=()=>window.ONGIL;
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const preview=document.querySelector('#tojeongZodiacPreview');
const birthDate=form.querySelector('[name="birthDate"]');
const targetYear=form.querySelector('[name="targetYear"]');

const zodiacs=[
  {name:'쥐',emoji:'🐭',trait:'기회를 빠르게 읽고 실속을 챙기는 힘'},
  {name:'소',emoji:'🐮',trait:'꾸준함과 책임으로 기반을 다지는 힘'},
  {name:'호랑이',emoji:'🐯',trait:'결단력과 추진력으로 길을 여는 힘'},
  {name:'토끼',emoji:'🐰',trait:'섬세한 감각과 관계를 조율하는 힘'},
  {name:'용',emoji:'🐲',trait:'큰 그림과 자신감으로 변화를 만드는 힘'},
  {name:'뱀',emoji:'🐍',trait:'관찰과 집중으로 타이밍을 잡는 힘'},
  {name:'말',emoji:'🐴',trait:'활동성과 독립심으로 전진하는 힘'},
  {name:'양',emoji:'🐑',trait:'배려와 감성으로 조화를 만드는 힘'},
  {name:'원숭이',emoji:'🐵',trait:'재치와 적응력으로 문제를 푸는 힘'},
  {name:'닭',emoji:'🐔',trait:'정확성과 성실함으로 완성도를 높이는 힘'},
  {name:'개',emoji:'🐶',trait:'의리와 신뢰로 관계를 지키는 힘'},
  {name:'돼지',emoji:'🐷',trait:'포용력과 낙천성으로 복을 넓히는 힘'}
];

const categoryTemplates={
  overall:[
    '새로운 기회보다 이미 시작한 일을 정리하고 완성할 때 성과가 커집니다.',
    '사람과 정보가 자연스럽게 모이는 흐름입니다. 선택의 기준을 분명히 하면 기회가 선명해집니다.',
    '속도를 높이기보다 방향을 재확인해야 하는 해입니다. 작은 약속을 지키는 태도가 큰 신뢰로 이어집니다.',
    '변화의 폭이 큰 만큼 유연함이 중요합니다. 익숙한 방식과 새 방식을 적절히 섞으면 안정적입니다.'
  ],
  money:[
    '수입을 늘리는 것보다 새는 지출을 막는 관리가 우선입니다. 큰 구매는 한 번 더 비교하세요.',
    '작은 수익원을 여러 번 반복하는 방식이 유리합니다. 단기 유혹보다 현금 흐름을 지키세요.',
    '계약과 숫자를 직접 확인하면 손실을 줄일 수 있습니다. 공동 자금은 기준을 문서로 남기세요.',
    '예상 밖의 지출이 생길 수 있으므로 여유 자금을 확보하면 마음이 안정됩니다.'
  ],
  business:[
    '성과를 넓히기 전에 핵심 고객과 업무 품질을 안정시키는 것이 유리합니다.',
    '협력 제안이 들어오더라도 역할과 책임을 먼저 정해야 좋은 관계가 오래갑니다.',
    '새로운 분야를 배우거나 도구를 바꾸는 시도가 업무 흐름을 개선할 수 있습니다.',
    '말보다 일정과 결과물로 신뢰를 보여주면 평가가 높아집니다.'
  ],
  love:[
    '감정을 추측하지 말고 확인하는 대화가 관계를 편안하게 만듭니다.',
    '새 인연은 빠른 결론보다 생활 리듬과 가치관을 천천히 살피는 편이 좋습니다.',
    '가까운 사이일수록 고마움을 구체적으로 표현하면 서운함이 줄어듭니다.',
    '혼자만의 시간과 함께하는 시간을 균형 있게 나누면 관계가 안정됩니다.'
  ],
  health:[
    '수면과 식사 시간을 일정하게 유지하는 것이 컨디션 관리의 핵심입니다.',
    '무리한 계획보다 가벼운 운동을 꾸준히 이어가는 편이 좋습니다.',
    '피로를 참기보다 휴식 일정을 먼저 확보하세요. 증상이 지속되면 의료진과 상담해야 합니다.',
    '목·어깨와 소화 부담을 줄이기 위해 오래 앉아 있는 시간을 나누는 습관이 도움 됩니다.'
  ],
  family:[
    '가족의 기대를 마음속으로 짐작하기보다 역할을 구체적으로 나누는 것이 좋습니다.',
    '오래 미뤄둔 대화를 차분히 시작하면 관계의 오해가 풀릴 수 있습니다.',
    '도움을 주고받을 때 범위와 시간을 분명히 하면 부담이 줄어듭니다.',
    '가족 행사는 형식보다 서로의 상황을 배려하는 방식으로 조정하는 편이 좋습니다.'
  ]
};

const monthMessages=[
  '계획을 작게 나누고 첫 단계를 시작하기 좋습니다.',
  '대화와 협의에서 중요한 실마리를 찾을 수 있습니다.',
  '지출과 일정의 우선순위를 다시 정리하세요.',
  '새 제안보다 기존 약속을 완성하는 데 집중하세요.',
  '배움과 이동에서 새로운 기회가 생길 수 있습니다.',
  '감정적으로 결정하지 말고 하루 정도 여유를 두세요.',
  '관계의 균형을 점검하고 역할을 분명히 하세요.',
  '체력 관리와 휴식이 업무 성과를 좌우합니다.',
  '작은 성과가 쌓이며 자신감이 회복되는 시기입니다.',
  '계약·문서·숫자를 꼼꼼하게 확인해야 합니다.',
  '주변의 도움을 받아 막힌 일을 정리하기 좋습니다.',
  '한 해를 정리하고 다음 계획의 기반을 만들 때입니다.'
];

function seoulYear(){return Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(new Date()));}
function populateYears(){
  const current=seoulYear();
  targetYear.innerHTML='';
  for(let year=current-1;year<=current+3;year++){
    const option=document.createElement('option');
    option.value=String(year);option.textContent=`${year}년`;
    if(year===current)option.selected=true;
    targetYear.append(option);
  }
}
function zodiacOf(year){const index=((year-4)%12+12)%12;return {...zodiacs[index],index};}
function updatePreview(){
  if(!birthDate?.value){preview.innerHTML='<span>十二</span><small>띠 자동 계산</small>';return;}
  const zodiac=zodiacOf(Number(birthDate.value.slice(0,4)));
  preview.innerHTML=`<span>${zodiac.emoji}</span><small>${zodiac.name}띠</small>`;
}
function hash(text){let value=2166136261;for(const char of String(text)){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}return value>>>0;}
function score(seed,offset,min=68,max=96){return min+((seed+offset*7919)%(max-min+1));}
function pick(array,seed,offset){return array[(seed+offset*3571)%array.length];}
function tone(number){return number>=90?'매우 좋은 흐름':number>=82?'안정적인 흐름':number>=74?'조율이 필요한 흐름':'신중함이 필요한 흐름';}
function direction(seed){return ['동쪽','남동쪽','남쪽','남서쪽','서쪽','북서쪽','북쪽','북동쪽'][seed%8];}
function color(seed){return ['금빛 베이지','짙은 보라','청록색','하늘색','버건디','진녹색','은회색','살구색'][seed%8];}
function numberSet(seed){
  const values=[];let current=seed;
  while(values.length<3){current=(Math.imul(current,1664525)+1013904223)>>>0;const value=(current%45)+1;if(!values.includes(value))values.push(value);}
  return values.sort((a,b)=>a-b).join(' · ');
}

populateYears();updatePreview();
birthDate?.addEventListener('change',updatePreview);
form.addEventListener('reset',()=>setTimeout(()=>{populateYears();updatePreview();},0));

form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  if(!data.birthDate){api()?.toast('생년월일을 입력해 주세요.');return;}
  const birthYear=Number(data.birthDate.slice(0,4));
  const zodiac=zodiacOf(birthYear);
  const seed=hash(`${data.nickname}|${data.birthDate}|${data.birthTime}|${data.gender}|${data.targetYear}|${data.focus}`);
  const scores={
    overall:score(seed,1),money:score(seed,2),business:score(seed,3),love:score(seed,4),health:score(seed,5),family:score(seed,6)
  };
  const total=Math.round(Object.values(scores).reduce((sum,value)=>sum+value,0)/6);
  const categories=[
    ['총운',scores.overall,pick(categoryTemplates.overall,seed,1)],
    ['재물운',scores.money,pick(categoryTemplates.money,seed,2)],
    ['사업·직장운',scores.business,pick(categoryTemplates.business,seed,3)],
    ['애정·인연운',scores.love,pick(categoryTemplates.love,seed,4)],
    ['건강운',scores.health,pick(categoryTemplates.health,seed,5)],
    ['가족·관계운',scores.family,pick(categoryTemplates.family,seed,6)]
  ];
  const strongMonth=((seed%12)+1);
  const secondStrong=((seed*7+3)%12)+1;
  const cautionMonth=((seed*11+5)%12)+1;
  const months=Array.from({length:12},(_,index)=>{
    const month=index+1;
    const status=month===strongMonth||month===secondStrong?'good':month===cautionMonth?'caution':'';
    const label=status==='good'?'상승':status==='caution'?'주의':'안정';
    const message=monthMessages[(index+zodiac.index+(seed%5))%monthMessages.length];
    return `<article class="tojeong-month ${status}"><strong>${month}월 <span>${label}</span></strong><p>${esc(message)}</p></article>`;
  }).join('');
  const who=(data.nickname||`${zodiac.name}띠`).trim();
  const body=`
    <section class="tojeong-hero">
      <div class="tojeong-animal">${zodiac.emoji}</div>
      <div class="tojeong-copy"><small>${esc(data.targetYear)}년 · ${zodiac.name}띠 토정비결</small><h4>${esc(who)}님의 한 해 흐름</h4><p>${esc(zodiac.trait)}이 강점으로 드러나는 해입니다. ${esc(data.focus)}을 중심으로 보면 ${tone(total)}이며, 서두르기보다 기준을 세우고 꾸준히 움직이는 것이 중요합니다.</p></div>
      <div class="tojeong-score" style="--score:${total}%"><strong>${total}</strong><small>종합 흐름</small></div>
    </section>
    <div class="tojeong-fortunes">${categories.map(([title,value,text])=>`<article class="tojeong-fortune"><div class="tojeong-fortune-head"><h4>${title}</h4><b>${value}점</b></div><p>${esc(text)}</p><div class="tojeong-meter"><span style="--meter:${value}%"></span></div></article>`).join('')}</div>
    <div class="tojeong-months">${months}</div>
    <div class="tojeong-points"><article class="tojeong-point"><small>좋은 방향</small><strong>${direction(seed)}</strong></article><article class="tojeong-point"><small>도움 되는 색</small><strong>${color(seed>>2)}</strong></article><article class="tojeong-point"><small>행운 번호</small><strong>${numberSet(seed)}</strong></article></div>
    <p class="consent-note">띠는 출생연도를 기준으로 간단 계산합니다. 음력 설·입춘 이전 출생자는 실제 띠가 다를 수 있습니다. 본 결과는 전통문화 기반 오락성 참고자료이며 건강·법률·투자·계약 판단을 대신하지 않습니다.</p>`;
  api()?.resultShell('tojeong',`${data.targetYear}년 ${zodiac.name}띠 토정비결`,body,`${zodiac.name}띠 · 종합 ${total}점 · 좋은 달 ${strongMonth}월, ${secondStrong}월`);
});
})();
