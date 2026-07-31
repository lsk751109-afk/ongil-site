(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const formObject=form=>Object.fromEntries(new FormData(form).entries());
const api=()=>window.ONGIL;
const seedOf=text=>[...String(text)].reduce((a,c)=>((a*31)+c.charCodeAt(0))>>>0,2166136261);
const score=(seed,offset,min=68,max=96)=>min+((seed+offset*7919)%(max-min+1));
const toneByScore=n=>n>=90?'매우 안정적인 조화':n>=82?'서로 보완되는 조화':n>=74?'대화로 성장하는 관계':'차이를 이해할수록 좋아지는 관계';

const compatibilityForm=$('#compatibilityForm');
if(compatibilityForm){
  compatibilityForm.addEventListener('submit',e=>{
    e.preventDefault();
    const d=formObject(e.currentTarget);
    if(d.adultConfirm!=='yes'){
      api()?.toast('속궁합 결과는 두 사람 모두 성인임을 확인해야 합니다.');
      return;
    }
    const seed=seedOf(`${d.nameA}|${d.birthA}|${d.nameB}|${d.birthB}|${d.relationship}|${d.affection}|${d.pace}`);
    const emotional=score(seed,1), communication=score(seed,2), lifestyle=score(seed,3), finance=score(seed,4), intimacy=score(seed,5,66,95);
    const overall=Math.round((emotional+communication+lifestyle+finance+intimacy)/5);
    const cards=[
      ['감정 궁합',emotional,emotional>=84?'감정의 온도를 빠르게 알아차리는 편입니다. 고마움과 서운함을 바로 표현하면 안정감이 커집니다.':'감정 표현 방식이 다를 수 있습니다. 상대의 반응을 단정하지 말고 확인하는 대화가 중요합니다.'],
      ['대화 궁합',communication,communication>=84?'의견이 달라도 핵심을 정리해 합의점을 찾는 힘이 있습니다.':'문제를 해결하려는 속도가 다를 수 있으므로 말할 시간과 생각할 시간을 구분하는 편이 좋습니다.'],
      ['생활 궁합',lifestyle,lifestyle>=84?'일상 리듬과 책임 분담을 비교적 자연스럽게 맞출 수 있습니다.':'생활 습관과 개인 시간의 기준을 구체적으로 정하면 갈등을 크게 줄일 수 있습니다.'],
      ['재물·사업 궁합',finance,finance>=84?'목표와 지출 기준을 함께 정하면 장기 계획을 안정적으로 운영할 수 있습니다.':'공동 지출과 개인 지출을 분리하고 큰 계약은 반드시 함께 확인하는 방식이 적합합니다.']
    ];
    const body=`
      <section class="compatibility-score">
        <div class="score-ring" style="--score:${overall}%"><strong>${overall}</strong><small>종합 궁합</small></div>
        <div class="compatibility-copy"><h4>${esc(d.nameA)} · ${esc(d.nameB)}</h4><p>${toneByScore(overall)}입니다. ${esc(d.relationship)} 관계에서 감정, 대화, 생활, 재물과 친밀감의 균형을 함께 살피는 것이 핵심입니다.</p></div>
      </section>
      <div class="detail-grid">${cards.map(([h,s,p])=>`<article class="detail-card"><h4>${h} · ${s}점</h4><p>${esc(p)}</p></article>`).join('')}
        <article class="detail-card intimacy-card"><h4>속궁합 · ${intimacy}점</h4><p>${intimacy>=86?'친밀감의 속도와 애정 표현이 비교적 자연스럽게 맞는 편입니다. 익숙함 속에서도 상대의 의사를 계속 확인하면 만족도가 높아집니다.':intimacy>=76?'끌림은 충분하지만 원하는 속도나 표현 방식에서 차이가 날 수 있습니다. 분위기보다 명확한 동의와 대화가 우선입니다.':'친밀감의 기대와 속도를 서로 다르게 느낄 수 있습니다. 부담 없는 대화로 경계와 선호를 먼저 확인하는 것이 중요합니다.'}</p></article>
        <article class="detail-card"><h4>관계 조언</h4><p>애정 표현은 ${esc(d.affection)}, 친밀감 속도는 ${esc(d.pace)}를 선호한다고 입력했습니다. 서로의 선호는 고정된 성격이 아니라 상황에 따라 달라질 수 있으므로 정기적으로 확인하세요.</p></article>
      </div>
      <p class="consent-note">속궁합 결과는 성인 관계를 위한 비의학적·오락성 참고자료입니다. 친밀한 관계에서는 상호 동의, 존중, 피임과 건강 관리가 어떤 해석보다 우선합니다.</p>`;
    api()?.resultShell('compatibility',`${d.nameA} · ${d.nameB} 궁합`,body,`종합 ${overall}점 · 속궁합 ${intimacy}점`);
  });
}

const tarotCards=[
  ['태양','☀','명확함과 자신감','숨기지 말고 밝게 표현할수록 흐름이 좋아집니다.'],
  ['별','✦','희망과 회복','서두르지 않아도 방향은 맞습니다. 작은 신호를 이어가세요.'],
  ['달','☾','직감과 불확실성','보이는 정보만으로 단정하지 말고 사실을 다시 확인하세요.'],
  ['세계','◎','완성과 확장','마무리할 일과 새로 시작할 일을 구분하면 기회가 열립니다.'],
  ['연인','♡','선택과 관계','끌림보다 가치관과 약속의 일치 여부를 살피는 시기입니다.'],
  ['정의','⚖','균형과 책임','감정보다 기준을 세우고 공정하게 판단해야 합니다.'],
  ['전차','◇','추진력과 집중','목표를 하나로 좁히면 빠르게 진전될 수 있습니다.'],
  ['은둔자','△','성찰과 정리','외부 의견을 줄이고 자신의 기준을 점검할 시간이 필요합니다.'],
  ['운명의 수레바퀴','◉','변화와 전환','예상 밖의 변화가 기회가 될 수 있으니 유연하게 대응하세요.'],
  ['힘','∞','인내와 내면의 힘','강하게 밀기보다 차분하게 지속하는 태도가 유리합니다.'],
  ['절제','♢','조율과 회복','극단을 피하고 생활과 감정의 속도를 조절하세요.'],
  ['마법사','✧','시작과 실행','이미 필요한 자원은 충분합니다. 작은 실행부터 시작하세요.']
];
const tarotForm=$('#tarotForm');
if(tarotForm){
  tarotForm.addEventListener('submit',e=>{
    e.preventDefault();
    const d=formObject(e.currentTarget);
    const count=d.spread==='one'?1:3;
    const seed=seedOf(`${d.question}|${Date.now()}|${d.topic}`);
    const picked=[];
    for(let i=0;i<count;i++){
      let idx=(seed+i*7)%tarotCards.length;
      while(picked.some(x=>x.idx===idx))idx=(idx+1)%tarotCards.length;
      const reversed=((seed>>(i+1))&1)===1;
      picked.push({idx,reversed,card:tarotCards[idx]});
    }
    const positions=count===1?['오늘의 메시지']:['현재','주의할 점','앞으로의 흐름'];
    const body=`<div class="tarot-draw">${picked.map((x,i)=>`<article class="tarot-card"><small>${positions[i]} · ${x.reversed?'역방향':'정방향'}</small><div class="tarot-symbol">${x.card[1]}</div><div><strong>${x.card[0]}</strong><p>${x.reversed?'지금은 '+x.card[2]+'의 균형이 흐트러져 있는지 점검하세요.':x.card[2]+'의 흐름입니다. '+x.card[3]}</p></div></article>`).join('')}</div><div class="detail-card"><h4>${esc(d.topic)} 종합 해석</h4><p>${esc(d.question||'현재 상황')}에 대해 카드는 즉시 결론을 내리기보다 현재의 선택과 감정을 정리하라고 제안합니다. 중요한 계약·건강·법률·투자 결정은 실제 정보와 전문가 판단을 우선하세요.</p></div>`;
    api()?.resultShell('tarot',`${d.topic} 타로`,body,picked.map(x=>x.card[0]).join(', '));
  });
}

const faceInput=$('#facePhoto');
const facePreview=$('#facePreview');
let faceObjectUrl='';
if(faceInput&&facePreview){
  faceInput.addEventListener('change',e=>{
    const file=e.target.files?.[0];
    if(faceObjectUrl)URL.revokeObjectURL(faceObjectUrl);
    if(!file){facePreview.classList.remove('show');facePreview.innerHTML='';return;}
    faceObjectUrl=URL.createObjectURL(file);
    facePreview.innerHTML=`<img src="${faceObjectUrl}" alt="관상 참고용 촬영 사진"><span class="face-guide" aria-hidden="true"></span>`;
    facePreview.classList.add('show');
  });
}
const faceForm=$('#faceForm');
if(faceForm){
  faceForm.addEventListener('submit',e=>{
    e.preventDefault();
    const d=formObject(e.currentTarget);
    const interpretations={
      faceShape:{oval:'균형과 조화를 중시하며 상황에 맞춰 유연하게 대응하는 인상',round:'친근하고 관계 중심적이며 정서적 안정감을 중요하게 여기는 인상',long:'신중하고 계획적이며 깊이 생각한 뒤 움직이는 인상',square:'결단력과 책임감을 중시하고 기준이 분명한 인상',heart:'감수성과 표현력이 풍부하고 새로운 아이디어에 빠르게 반응하는 인상'},
      eyes:{soft:'상대의 분위기를 세심하게 읽고 공감적으로 반응하는 경향',clear:'관찰력이 좋고 핵심을 빠르게 파악하려는 경향',up:'목표 의식과 추진력이 강하게 드러나는 경향',down:'차분하고 배려 깊으며 갈등을 부드럽게 풀려는 경향'},
      brows:{straight:'현실적이고 판단 기준이 명확한 편',arched:'감각과 표현력이 좋고 변화에 유연한 편',thick:'의지와 집중력이 강하고 책임을 오래 유지하는 편',soft:'관계를 부드럽게 조율하고 협력을 중시하는 편'},
      nose:{balanced:'현실 감각과 자기관리의 균형을 중시하는 인상',high:'목표와 자존감이 분명하고 성취 욕구가 강한 인상',round:'안정과 생활의 여유를 중요하게 여기는 인상',small:'세부 변화에 민감하고 신중하게 판단하는 인상'},
      mouth:{balanced:'말과 행동의 균형을 중요하게 여기는 인상',full:'감정과 애정을 적극적으로 표현하는 인상',thin:'필요한 말을 선별하고 절제된 표현을 선호하는 인상',up:'긍정적 분위기를 만들고 회복이 빠른 인상'}
    };
    const rows=[['얼굴형',interpretations.faceShape[d.faceShape]],['눈매',interpretations.eyes[d.eyes]],['눈썹',interpretations.brows[d.brows]],['코',interpretations.nose[d.nose]],['입매',interpretations.mouth[d.mouth]]];
    const seed=seedOf(Object.values(d).join('|'));
    const body=`<div class="detail-grid">${rows.map(([h,p])=>`<article class="detail-card"><h4>${h}</h4><p>${esc(p)}</p></article>`).join('')}<article class="detail-card"><h4>종합 인상</h4><p>선택한 특징을 종합하면 ${score(seed,1,72,92)}점의 안정적인 인상으로 정리됩니다. 첫인상보다 표정, 말투, 생활 태도가 실제 관계에 더 큰 영향을 줍니다.</p></article></div><p class="consent-note">사진은 화면에서만 미리보기 되며 서버로 전송하거나 저장하지 않습니다. 관상 결과는 전통문화 기반 오락성 설명이며 성격, 능력, 건강, 신용 또는 미래를 사실로 판단하지 않습니다.</p>`;
    api()?.resultShell('face',`모바일 관상 · ${d.nickname||'나의 인상'}`,body,rows.map(x=>x[0]).join(', '));
  });
}
})();
