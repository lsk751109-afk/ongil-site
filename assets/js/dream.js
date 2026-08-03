(()=>{
'use strict';
const form=document.querySelector('#dreamForm');
if(!form)return;
const api=()=>window.ONGIL;
const esc=value=>api()?.esc(value)||String(value);
const symbols=[
  [/물|바다|강|비/,['물','감정과 변화','물의 상태는 현재 감정과 생활의 흐름을 상징합니다. 맑은 물은 정리와 회복, 거친 물은 부담과 변화에 대한 대비를 뜻합니다.']],
  [/돈|금|보석|지갑/,['재물','가치와 기회','실제 횡재를 보장하기보다 자신이 중요하게 여기는 가치와 기회를 점검하라는 의미로 볼 수 있습니다.']],
  [/뱀|호랑이|용|동물/,['동물','본능과 관계','동물의 태도는 주변 사람과의 관계, 자신 안의 본능적 힘이나 경계심을 나타낼 수 있습니다.']],
  [/집|방|문|창문/,['집과 공간','생활 기반','집은 자신과 가족, 생활의 기반을 상징합니다. 문이 열리면 새 기회, 막혀 있으면 해결할 과제를 뜻할 수 있습니다.']],
  [/불|화재|빛|태양/,['불과 빛','에너지와 전환','밝은 불은 의욕과 전환, 통제되지 않는 불은 과로와 감정의 과열을 돌아보라는 신호로 해석할 수 있습니다.']],
  [/사람|가족|친구|연인/,['사람','관계와 마음','등장한 사람은 실제 그 사람뿐 아니라 그 관계에서 느끼는 기대, 미안함, 그리움을 반영할 수 있습니다.']]
];
form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  const text=data.dreamText.trim();
  const found=symbols.filter(([pattern])=>pattern.test(text)).slice(0,3);
  const readings=(found.length?found:[symbols[3],symbols[5]]).map(([,item])=>item);
  const body=`<div class="detail-grid">${readings.map(([title,key,copy])=>`<article class="detail-card"><h4>${esc(title)} · ${esc(key)}</h4><p>${esc(copy)}</p></article>`).join('')}<article class="detail-card"><h4>꿈의 전체 흐름</h4><p>${esc(data.mood)}의 느낌이 강한 꿈입니다. 최근 반복되는 생각과 관계, 미뤄둔 일을 함께 돌아보면 꿈의 의미를 더 현실적으로 이해할 수 있습니다.</p></article></div><p class="consent-note">꿈해몽은 전통문화와 심리적 상징을 바탕으로 한 참고자료이며 미래의 사건을 보장하지 않습니다.</p>`;
  api()?.resultShell('dream',`${data.dreamDate} 꿈해몽`,body,text.slice(0,80));
});
})();
