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

const minorSuits=[
  {name:'완드',symbol:'♣',theme:'열정 · 행동 · 창조',field:'목표와 실행',gift:'의욕을 구체적인 행동으로 옮기면 새로운 흐름을 만들 수 있습니다.',shadow:'의욕이 앞서 방향과 체력 배분을 놓치고 있지 않은지 점검하세요.'},
  {name:'컵',symbol:'♥',theme:'감정 · 관계 · 직관',field:'마음과 관계',gift:'감정을 솔직하고 차분하게 표현할수록 관계의 흐름이 선명해집니다.',shadow:'기대와 현실을 혼동하거나 상대의 마음을 추측으로 단정하지 마세요.'},
  {name:'소드',symbol:'♠',theme:'사고 · 판단 · 소통',field:'판단과 대화',gift:'사실과 기준을 분명히 하면 복잡한 문제의 핵심을 찾을 수 있습니다.',shadow:'지나친 걱정이나 날카로운 말이 문제를 키우지 않는지 돌아보세요.'},
  {name:'펜타클',symbol:'◆',theme:'재물 · 현실 · 기반',field:'재정과 생활 기반',gift:'시간과 자원을 꾸준히 관리하면 눈에 보이는 성과로 이어질 수 있습니다.',shadow:'눈앞의 이익이나 익숙한 안정에 매여 더 중요한 가치를 놓치지 마세요.'}
];
const minorRanks=[
  {roman:'A',name:'에이스',key:'시작 · 씨앗',up:'새로운 가능성이 열린 단계입니다. 작은 기회를 구체적인 첫 행동으로 연결하세요.',rev:'가능성은 있지만 준비나 확신이 부족할 수 있습니다. 시작 조건부터 다시 정리하세요.'},
  {roman:'2',name:'2',key:'선택 · 균형',up:'두 선택지의 장단점을 비교하고 우선순위를 정할 때입니다.',rev:'결정을 미루거나 양쪽을 모두 잡으려다 힘이 분산될 수 있습니다.'},
  {roman:'3',name:'3',key:'확장 · 협력',up:'혼자 준비한 것을 타인과 연결하면 더 넓은 결과를 만들 수 있습니다.',rev:'협력의 역할과 기대가 불분명해 진행이 엇갈릴 수 있습니다.'},
  {roman:'4',name:'4',key:'안정 · 기반',up:'지금까지 만든 기반을 지키고 안정적으로 정착시키는 흐름입니다.',rev:'안정을 지키려는 마음이 변화에 대한 저항으로 굳어지지 않았는지 보세요.'},
  {roman:'5',name:'5',key:'갈등 · 변화',up:'차이와 경쟁이 드러나지만 문제의 원인을 알 수 있는 계기이기도 합니다.',rev:'갈등을 피하기만 하면 같은 문제가 반복됩니다. 핵심 쟁점을 차분히 말하세요.'},
  {roman:'6',name:'6',key:'회복 · 조화',up:'도움의 균형과 관계의 회복이 가능한 흐름입니다. 주고받는 기준을 확인하세요.',rev:'한쪽만 베풀거나 받는 불균형이 생기지 않았는지 살펴보세요.'},
  {roman:'7',name:'7',key:'점검 · 인내',up:'성과를 서두르기보다 지금의 방식과 진행 상황을 평가할 때입니다.',rev:'기다림이 지치거나 성과 없는 반복이 될 수 있으니 방법을 수정하세요.'},
  {roman:'8',name:'8',key:'집중 · 숙련',up:'반복과 훈련이 실력을 만드는 시기입니다. 한 가지에 집중하세요.',rev:'완벽주의나 단조로운 반복 때문에 본래 목적을 잃지 않도록 점검하세요.'},
  {roman:'9',name:'9',key:'결실 · 독립',up:'스스로 쌓아온 결과를 확인하고 자신의 기준을 믿어도 좋습니다.',rev:'성과를 지키려는 불안이나 고립이 만족을 가리고 있을 수 있습니다.'},
  {roman:'10',name:'10',key:'완성 · 전환',up:'한 주기가 완성되는 단계입니다. 결과를 정리하고 다음 책임을 준비하세요.',rev:'책임이 과도해졌거나 끝낼 일을 붙들고 있지 않은지 확인하세요.'},
  {roman:'P',name:'시종',key:'소식 · 배움',up:'새로운 정보와 배움에 열린 태도가 기회를 가져옵니다. 먼저 질문하세요.',rev:'미숙한 정보나 가벼운 약속을 그대로 믿지 말고 사실을 확인하세요.'},
  {roman:'N',name:'기사',key:'이동 · 추진',up:'목표를 향해 움직일 힘이 생깁니다. 방향과 속도를 함께 관리하세요.',rev:'성급한 행동이나 방향 없는 돌진이 손실을 만들 수 있습니다.'},
  {roman:'Q',name:'여왕',key:'성숙 · 돌봄',up:'상황을 깊이 이해하고 사람과 자원을 세심하게 돌보는 힘이 중요합니다.',rev:'타인을 돌보느라 자신을 소진하거나 감정에 치우치지 않도록 하세요.'},
  {roman:'K',name:'왕',key:'통솔 · 책임',up:'경험을 바탕으로 기준을 세우고 책임 있게 결정할 단계입니다.',rev:'권위나 통제가 강해지지 않았는지 살피고 다른 의견을 들으세요.'}
];
minorSuits.forEach(suit=>minorRanks.forEach(rank=>cards.push({
  roman:`${suit.name} ${rank.roman}`,
  name:`${suit.name} ${rank.name}`,
  symbol:suit.symbol,
  keyword:`${rank.key} · ${suit.theme}`,
  upright:`${suit.field}의 영역에서 ${rank.up} ${suit.gift}`,
  reversed:`${suit.field}의 영역에서 ${rank.rev} ${suit.shadow}`
})));

const actions=form.querySelector('.form-actions');
const spread=form.querySelector('[name="spread"]');
const stage=document.createElement('section');
stage.className='tarot-picker span-2';
stage.setAttribute('aria-label','타로 카드 선택');
stage.innerHTML=`
  <div class="tarot-picker-head">
    <div><strong>78장 전체 덱에서 마음이 가는 카드를 선택하세요</strong><p>메이저 22장과 마이너 56장으로 구성된 실제 타로 덱입니다. 카드 앞면은 결과에서 공개됩니다.</p></div>
    <span class="tarot-selection-status" id="tarotSelectionStatus">0 / 1장 선택</span>
  </div>
  <div class="tarot-deck" id="tarotDeck">
    ${Array.from({length:cards.length},(_,index)=>`<button class="tarot-back-card" type="button" data-slot="${index}" aria-pressed="false" aria-label="${index+1}번째 타로 카드 선택"><span class="tarot-card-back-inner"><span class="tarot-back-moon"></span><span class="tarot-back-stars"></span></span><span class="tarot-pick-number" aria-hidden="true"></span></button>`).join('')}
  </div>
  <p class="tarot-picker-note">총 78장 · 같은 질문을 반복해서 뽑기보다 첫 선택의 메시지를 차분히 살펴보세요.</p>`;
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
