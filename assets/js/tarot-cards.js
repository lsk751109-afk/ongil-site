(()=>{
'use strict';

const form=document.querySelector('#tarotForm');
if(!form)return;

const api=()=>window.ONGIL;
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const seedOf=text=>[...String(text)].reduce((value,char)=>((value*33)^char.charCodeAt(0))>>>0,5381);

const cards=[
  {roman:'0',name:'바보',symbol:'✦',keyword:'새로운 시작 · 자유',upright:'완벽한 준비보다 첫걸음이 중요합니다. 열린 마음으로 경험하되 기본적인 안전장치는 챙기세요.',reversed:'충동적으로 움직이거나 같은 실수를 반복하고 있지 않은지 점검해야 합니다.'},
  {roman:'I',name:'마법사',symbol:'✧',keyword:'실행 · 집중 · 가능성',upright:'이미 필요한 자원은 가까이에 있습니다. 목표를 한 문장으로 정리하고 바로 실행하세요.',reversed:'능력을 과장하거나 준비만 반복하기 쉽습니다. 말보다 검증 가능한 행동이 필요합니다.'},
  {roman:'II',name:'여사제',symbol:'☾',keyword:'직관 · 비밀 · 내면',upright:'표면적인 말보다 분위기와 반복되는 신호를 살피세요. 조용히 관찰할수록 답이 선명해집니다.',reversed:'불안과 직감을 혼동할 수 있습니다. 추측을 사실처럼 단정하지 말고 정보를 다시 확인하세요.'},
  {roman:'III',name:'여제',symbol:'♀',keyword:'풍요 · 돌봄 · 성장',upright:'관계와 일이 자라기 좋은 시기입니다. 결과를 재촉하기보다 충분한 시간과 자원을 주세요.',reversed:'타인을 돌보느라 자신의 에너지를 소진하고 있을 수 있습니다. 경계를 다시 세우세요.'},
  {roman:'IV',name:'황제',symbol:'♔',keyword:'질서 · 책임 · 기반',upright:'기준과 역할을 분명히 정하면 안정적인 성과를 만들 수 있습니다. 결정에는 책임이 따라야 합니다.',reversed:'통제하려는 태도가 관계를 경직시킬 수 있습니다. 필요한 규칙과 불필요한 고집을 구분하세요.'},
  {roman:'V',name:'교황',symbol:'☩',keyword:'전통 · 배움 · 조언',upright:'검증된 방식과 경험자의 조언이 도움이 됩니다. 기본 절차를 지키는 것이 오히려 빠른 길입니다.',reversed:'남의 기준을 그대로 따르기보다 현재 상황에 맞는지 검토해야 합니다.'},
  {roman:'VI',name:'연인',symbol:'♡',keyword:'관계 · 선택 · 가치',upright:'끌림뿐 아니라 가치관과 약속이 일치하는지 살펴보세요. 진솔한 선택이 관계를 깊게 합니다.',reversed:'마음과 행동이 어긋나기 쉽습니다. 회피하지 말고 선택의 기준을 명확히 하세요.'},
  {roman:'VII',name:'전차',symbol:'◇',keyword:'추진 · 승리 · 방향',upright:'목표를 하나로 좁히고 흔들리지 않으면 빠르게 진전될 수 있습니다.',reversed:'속도는 빠르지만 방향이 흐릴 수 있습니다. 경쟁보다 목적을 먼저 점검하세요.'},
  {roman:'VIII',name:'힘',symbol:'∞',keyword:'인내 · 용기 · 절제',upright:'강하게 밀어붙이기보다 차분하게 지속하는 힘이 유리합니다. 감정을 다루는 태도가 핵심입니다.',reversed:'자신감이 흔들리거나 억눌린 감정이 커질 수 있습니다. 작은 성공부터 다시 쌓으세요.'},
  {roman:'IX',name:'은둔자',symbol:'✺',keyword:'성찰 · 탐색 · 정리',upright:'외부의 소음을 줄이고 자신의 기준을 점검할 시간이 필요합니다. 혼자 생각할 여백을 확보하세요.',reversed:'고립이 길어지면 판단이 좁아질 수 있습니다. 신뢰하는 사람과 생각을 나누세요.'},
  {roman:'X',name:'운명의 수레바퀴',symbol:'◉',keyword:'변화 · 순환 · 기회',upright:'예상 밖의 변화가 기회가 될 수 있습니다. 흐름을 읽고 유연하게 대응하세요.',reversed:'통제할 수 없는 변수에 집착하고 있을 수 있습니다. 바꿀 수 있는 부분부터 정리하세요.'},
  {roman:'XI',name:'정의',symbol:'⚖',keyword:'균형 · 판단 · 책임',upright:'감정보다 기준과 사실을 중심으로 판단해야 합니다. 계약과 약속은 문서로 확인하세요.',reversed:'편견이나 불공정한 조건이 숨어 있을 수 있습니다. 한쪽 이야기만 듣지 마세요.'},
  {roman:'XII',name:'매달린 사람',symbol:'⧖',keyword:'멈춤 · 관점 · 수용',upright:'잠시 멈추는 것이 손해가 아닙니다. 관점을 바꾸면 보이지 않던 해결책이 드러납니다.',reversed:'기다림이 습관적인 미루기로 변했는지 점검하세요. 기한을 정하고 결론을 내려야 합니다.'},
  {roman:'XIII',name:'변화',symbol:'✣',keyword:'종료 · 전환 · 재생',upright:'끝내야 할 것을 정리하면 새로운 흐름이 시작됩니다. 익숙함을 놓는 용기가 필요합니다.',reversed:'이미 끝난 방식에 집착해 변화가 지연될 수 있습니다. 불필요한 부담을 덜어내세요.'},
  {roman:'XIV',name:'절제',symbol:'⚗',keyword:'조율 · 회복 · 균형',upright:'극단을 피하고 속도를 조절하세요. 서로 다른 요소를 잘 섞으면 안정적인 결과가 나옵니다.',reversed:'생활과 감정의 균형이 무너질 수 있습니다. 일정과 소비, 관계의 과잉을 줄이세요.'},
  {roman:'XV',name:'악마',symbol:'⛓',keyword:'집착 · 유혹 · 의존',upright:'강한 욕망이나 습관이 선택을 제한하고 있는지 살펴보세요. 끊을 수 있다는 사실부터 인정해야 합니다.',reversed:'의존에서 벗어날 가능성이 커지고 있습니다. 반복되는 패턴을 구체적으로 바꾸세요.'},
  {roman:'XVI',name:'탑',symbol:'⚡',keyword:'충격 · 해체 · 진실',upright:'불안정한 기반이 드러날 수 있습니다. 갑작스러운 변화 속에서도 사실을 빠르게 정리하세요.',reversed:'문제를 알고도 미루고 있을 수 있습니다. 작은 정비로 큰 충격을 예방하세요.'},
  {roman:'XVII',name:'별',symbol:'★',keyword:'희망 · 회복 · 방향',upright:'서두르지 않아도 방향은 맞습니다. 작은 신호와 꾸준한 회복을 이어가세요.',reversed:'기대가 낮아져 좋은 가능성까지 놓칠 수 있습니다. 현실적인 목표를 다시 세우세요.'},
  {roman:'XVIII',name:'달',symbol:'☾',keyword:'감정 · 불확실 · 상상',upright:'상황이 아직 명확하지 않습니다. 감정의 파도 속에서 사실과 상상을 분리하세요.',reversed:'혼란이 조금씩 걷히고 있습니다. 숨겨진 정보가 드러날 때까지 성급한 결론은 피하세요.'},
  {roman:'XIX',name:'태양',symbol:'☀',keyword:'성공 · 명확 · 활력',upright:'숨기지 말고 밝게 표현할수록 흐름이 좋아집니다. 성과를 함께 나누세요.',reversed:'좋은 기회가 있어도 과신하거나 세부 확인을 놓칠 수 있습니다. 기본을 점검하세요.'},
  {roman:'XX',name:'심판',symbol:'♫',keyword:'각성 · 결론 · 재출발',upright:'과거의 경험을 바탕으로 중요한 결론을 내릴 시기입니다. 미뤄둔 답을 선택하세요.',reversed:'후회나 타인의 평가 때문에 결정을 늦추고 있을 수 있습니다. 자신의 책임 범위를 분명히 하세요.'},
  {roman:'XXI',name:'세계',symbol:'◎',keyword:'완성 · 통합 · 확장',upright:'한 단계가 완성되고 더 넓은 기회로 이어집니다. 마무리와 공유를 함께 준비하세요.',reversed:'거의 끝났지만 마지막 정리가 부족합니다. 미완료 항목을 확인한 뒤 다음 단계로 가세요.'}
];

const actions=form.querySelector('.form-actions');
const spread=form.querySelector('[name="spread"]');
const stage=document.createElement('section');
stage.className='tarot-picker span-2';
stage.setAttribute('aria-label','타로 카드 선택');
stage.innerHTML=`
  <div class="tarot-picker-head">
    <div><strong>마음이 가는 카드를 선택하세요</strong><p>카드 앞면은 결과에서 공개됩니다. 1장 또는 3장을 직접 선택할 수 있습니다.</p></div>
    <span class="tarot-selection-status" id="tarotSelectionStatus">0 / 1장 선택</span>
  </div>
  <div class="tarot-deck" id="tarotDeck">
    ${Array.from({length:9},(_,index)=>`<button class="tarot-back-card" type="button" data-slot="${index}" aria-pressed="false" aria-label="${index+1}번째 타로 카드 선택"><span class="tarot-card-back-inner"><span class="tarot-back-moon"></span><span class="tarot-back-stars"></span></span><span class="tarot-pick-number" aria-hidden="true"></span></button>`).join('')}
  </div>
  <p class="tarot-picker-note">같은 질문을 반복해서 뽑기보다 첫 선택의 메시지를 차분히 살펴보세요.</p>`;
if(actions)actions.before(stage);else form.append(stage);

const deck=stage.querySelector('#tarotDeck');
const status=stage.querySelector('#tarotSelectionStatus');
let selected=[];

const requiredCount=()=>spread?.value==='three'?3:1;
function refresh(){
  const max=requiredCount();
  if(selected.length>max)selected=selected.slice(0,max);
  [...deck.querySelectorAll('.tarot-back-card')].forEach(button=>{
    const slot=Number(button.dataset.slot);
    const order=selected.indexOf(slot);
    button.setAttribute('aria-pressed',String(order>=0));
    button.querySelector('.tarot-pick-number').textContent=order>=0?String(order+1):'';
  });
  status.textContent=`${selected.length} / ${max}장 선택`;
}

deck.addEventListener('click',event=>{
  const button=event.target.closest('.tarot-back-card');
  if(!button)return;
  const slot=Number(button.dataset.slot);
  const current=selected.indexOf(slot);
  if(current>=0){
    selected.splice(current,1);
  }else if(selected.length<requiredCount()){
    selected.push(slot);
  }else{
    api()?.toast(`${requiredCount()}장만 선택할 수 있습니다.`);
  }
  refresh();
});

spread?.addEventListener('change',()=>{selected=[];refresh();});
form.addEventListener('reset',()=>setTimeout(()=>{selected=[];refresh();},0));
refresh();

function pickCards(data){
  const baseSeed=seedOf(`${data.topic}|${data.question}|${selected.join('-')}|${Date.now()}`);
  const picked=[];
  selected.forEach((slot,index)=>{
    let cardIndex=(baseSeed+slot*97+index*131)%cards.length;
    while(picked.some(item=>item.cardIndex===cardIndex))cardIndex=(cardIndex+1)%cards.length;
    const reversed=((baseSeed>>(index+1))&1)===1;
    picked.push({cardIndex,reversed,card:cards[cardIndex]});
  });
  return picked;
}

function cardMarkup(item,position){
  const direction=item.reversed?'역방향':'정방향';
  const reading=item.reversed?item.card.reversed:item.card.upright;
  return `<article class="tarot-reading-card${item.reversed?' is-reversed':''}">
    <span class="tarot-position-label">${esc(position)}</span>
    <div class="tarot-card-face">
      <span class="tarot-card-number">${esc(item.card.roman)}</span>
      <span class="tarot-direction-ribbon">${direction}</span>
      <div class="tarot-card-illustration"><span class="tarot-card-symbol">${item.card.symbol}</span></div>
      <h4 class="tarot-card-title">${esc(item.card.name)}</h4>
      <span class="tarot-card-keyword">${esc(item.card.keyword)}</span>
    </div>
    <p class="tarot-reading-text"><strong>${esc(item.card.keyword)}</strong>${esc(reading)}</p>
  </article>`;
}

form.addEventListener('submit',event=>{
  event.preventDefault();
  event.stopImmediatePropagation();
  const count=requiredCount();
  if(selected.length!==count){
    api()?.toast(`카드 ${count}장을 먼저 선택해 주세요.`);
    stage.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  const data=Object.fromEntries(new FormData(form).entries());
  const picked=pickCards(data);
  const positions=count===1?['오늘의 메시지']:['현재의 흐름','주의할 점','앞으로의 방향'];
  const question=(data.question||'현재 상황').trim();
  const names=picked.map(item=>item.card.name).join(' · ');
  const body=`
    <div class="tarot-reading-board${count===1?' one-card':''}">${picked.map((item,index)=>cardMarkup(item,positions[index])).join('')}</div>
    <section class="tarot-reading-summary">
      <h4>${esc(data.topic)} 종합 해석</h4>
      <p><b>${esc(question)}</b>에 대해 선택한 카드는 <b>${esc(names)}</b>의 흐름을 보여줍니다. 한 번에 모든 답을 정하려 하기보다 지금 확인할 수 있는 사실과 감정을 구분하고, 가장 작은 실행부터 시작하는 편이 좋습니다.</p>
    </section>
    <p class="consent-note">타로 결과는 오락성·자기성찰용 참고자료입니다. 건강, 법률, 계약, 투자 등 중요한 결정은 실제 정보와 관련 전문가의 판단을 우선하세요.</p>`;
  api()?.resultShell('tarot',`${data.topic} 타로`,body,names);
},true);
})();
