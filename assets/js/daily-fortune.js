(()=>{
'use strict';
const form=document.querySelector('#dailyFortuneForm');
if(!form)return;
const api=()=>window.ONGIL;
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const dateChip=document.querySelector('#dailyDateChip');

function seoulDate(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}
function formatDate(value){return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date(`${value}T12:00:00+09:00`));}
function hash(text){let value=2166136261;for(const char of String(text)){value^=char.charCodeAt(0);value=Math.imul(value,16777619);}return value>>>0;}
function score(seed,offset,min=68,max=96){return min+((seed+offset*7919)%(max-min+1));}
function pick(array,seed,offset){return array[(seed+offset*3571)%array.length];}
function zodiac(year){return ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'][((year-4)%12+12)%12];}
function tone(value){return value>=90?'매우 좋은 흐름':value>=82?'안정적인 흐름':value>=74?'조율이 필요한 흐름':'신중함이 필요한 흐름';}
const texts={
  overall:['작은 선택을 바로 실행하면 흐름이 빠르게 좋아집니다.','새로운 일보다 이미 시작한 일을 정리할수록 성과가 커집니다.','사람과 정보가 모이는 날이므로 중요한 대화를 미루지 마세요.','속도보다 방향을 점검하면 실수를 줄일 수 있습니다.'],
  money:['고정지출과 충동구매를 줄이면 여유가 생깁니다.','작은 수입이나 미뤄둔 정산에서 도움이 생길 수 있습니다.','큰 구매와 투자 판단은 하루 더 확인하는 편이 좋습니다.','계약과 숫자를 직접 확인하면 손실을 예방할 수 있습니다.'],
  work:['말보다 결과물과 일정 준수로 신뢰를 보여주세요.','협력자와 역할을 분명히 정하면 업무가 빨라집니다.','새 도구나 방식을 배우면 처리 속도가 개선됩니다.','핵심 업무 하나에 집중하면 성과가 선명해집니다.'],
  love:['상대의 마음을 추측하지 말고 직접 확인하는 대화가 필요합니다.','고마움을 구체적으로 표현하면 관계가 부드러워집니다.','새 인연은 빠른 결론보다 생활 방식과 가치관을 살펴보세요.','혼자만의 시간과 함께하는 시간을 균형 있게 나누세요.'],
  health:['수면과 식사 시간을 일정하게 유지하는 것이 좋습니다.','가벼운 걷기와 스트레칭이 컨디션 회복에 도움이 됩니다.','피로가 쌓이기 쉬우므로 일정 사이에 휴식 시간을 두세요.','오래 앉아 있는 시간을 나누고 목·어깨를 풀어주세요.']
};
const colors=['보라색','청록색','하늘색','금빛 베이지','살구색','진녹색'];
const directions=['동쪽','남동쪽','남쪽','서쪽','북서쪽','북쪽'];
const times=['오전 9~11시','오후 1~3시','오후 4~6시','저녁 7~9시'];
function luckyNumbers(seed){const result=[];let value=seed;while(result.length<3){value=(Math.imul(value,1664525)+1013904223)>>>0;const n=(value%45)+1;if(!result.includes(n))result.push(n);}return result.sort((a,b)=>a-b).join(' · ');}

const today=seoulDate();
if(dateChip)dateChip.textContent=formatDate(today);

form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  const seed=hash(`${today}|${data.nickname}|${data.birthDate}|${data.gender}|${data.focus}`);
  const scores={overall:score(seed,1),money:score(seed,2),work:score(seed,3),love:score(seed,4),health:score(seed,5)};
  const total=Math.round(Object.values(scores).reduce((sum,value)=>sum+value,0)/5);
  const who=(data.nickname||'회원').trim();
  const sign=zodiac(Number(data.birthDate.slice(0,4)));
  const cards=[
    ['총운',scores.overall,pick(texts.overall,seed,1)],
    ['재물운',scores.money,pick(texts.money,seed,2)],
    ['사업·직장운',scores.work,pick(texts.work,seed,3)],
    ['애정·인연운',scores.love,pick(texts.love,seed,4)],
    ['건강운',scores.health,pick(texts.health,seed,5)]
  ];
  const body=`
    <section class="daily-result-hero"><div class="daily-symbol">☾</div><div class="daily-result-copy"><small>${esc(formatDate(today))} · ${esc(sign)}띠</small><h4>${esc(who)}님의 오늘은 ${tone(total)}</h4><p>${esc(data.focus)}을 중심으로 보면 서두르기보다 우선순위를 정하고 작은 실행을 바로 시작하는 편이 좋습니다.</p></div><div class="daily-score" style="--score:${total}%"><strong>${total}</strong><small>오늘의 흐름</small></div></section>
    <div class="daily-grid">${cards.map(([title,value,text])=>`<article class="daily-card"><div class="daily-card-head"><h4>${title}</h4><b>${value}점</b></div><p>${esc(text)}</p><div class="daily-meter"><span style="--meter:${value}%"></span></div></article>`).join('')}</div>
    <div class="daily-lucky"><article><small>행운 색상</small><strong>${colors[seed%colors.length]}</strong></article><article><small>좋은 방향</small><strong>${directions[(seed>>2)%directions.length]}</strong></article><article><small>좋은 시간</small><strong>${times[(seed>>4)%times.length]}</strong></article><article><small>행운 번호</small><strong>${luckyNumbers(seed)}</strong></article></div>
    <p class="consent-note">오늘의 운세는 무료로 제공되는 전통문화 기반 오락성 참고자료입니다. 건강·법률·투자·계약 판단을 대신하지 않습니다.</p>`;
  api()?.resultShell('daily',`${formatDate(today)} 오늘의 운세`,body,`${sign}띠 · 종합 ${total}점`);
});
})();
