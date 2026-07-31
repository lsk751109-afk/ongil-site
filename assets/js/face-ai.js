(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const form=$('#faceForm');
const input=$('#facePhoto');
const preview=$('#facePreview');
const status=$('#faceAiStatus');
const analyzeButton=$('#faceAiAnalyzeBtn');
const summary=$('#faceAiSummary');
if(!form||!input||!preview||!status||!analyzeButton)return;

const VERSION='0.10.35';
const MODULE_URL=`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/+esm`;
const WASM_URL=`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL_URL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let landmarker=null;
let modelPromise=null;
let features=null;
let busy=false;

const labels={
  faceShape:{oval:'타원형·균형형',round:'둥근형',long:'긴형',square:'각진형',heart:'하트형·역삼각형'},
  eyes:{soft:'부드러운 눈매',clear:'또렷한 눈매',up:'올라간 눈매',down:'내려간 눈매'},
  brows:{straight:'일자형',arched:'아치형'},
  nose:{balanced:'균형형',high:'높고 곧은형',round:'둥글고 넓은형',small:'작고 섬세한형'},
  mouth:{balanced:'균형 잡힌 입매',full:'도톰한 입술',thin:'얇고 단정한 입술',up:'입꼬리가 올라간형'}
};

const readings={
  faceShape:{
    oval:'전체 비율이 비교적 고르게 잡힌 얼굴형으로 분류됐습니다. 전통 관상 표현에서는 균형과 조화를 상징하는 형태로 설명합니다.',
    round:'가로 폭과 세로 길이의 차이가 크지 않은 둥근 얼굴형으로 분류됐습니다. 전통 관상 표현에서는 부드럽고 친근한 인상을 상징합니다.',
    long:'세로 길이가 상대적으로 긴 얼굴형으로 분류됐습니다. 전통 관상 표현에서는 신중함과 깊이를 상징하는 형태로 설명합니다.',
    square:'광대와 턱선의 폭 차이가 작고 윤곽이 선명한 얼굴형으로 분류됐습니다. 전통 관상 표현에서는 단단함과 책임감을 상징합니다.',
    heart:'이마 쪽 폭이 턱선보다 상대적으로 넓은 얼굴형으로 분류됐습니다. 전통 관상 표현에서는 감각과 표현력을 상징합니다.'
  },
  eyes:{
    soft:'눈꼬리 기울기와 눈의 폭이 부드러운 범위로 측정됐습니다. 전통식 해석에서는 편안하고 온화한 인상으로 표현합니다.',
    clear:'눈의 가로 폭이 또렷하게 인식됐습니다. 전통식 해석에서는 관찰력과 집중력이 드러나는 인상으로 표현합니다.',
    up:'눈 바깥쪽이 안쪽보다 상대적으로 올라간 형태로 측정됐습니다. 전통식 해석에서는 추진력 있는 인상으로 표현합니다.',
    down:'눈 바깥쪽이 안쪽보다 상대적으로 내려간 형태로 측정됐습니다. 전통식 해석에서는 차분하고 부드러운 인상으로 표현합니다.'
  },
  brows:{
    straight:'눈썹 중심과 양 끝의 높이 차이가 작아 일자형에 가까운 형태로 분류됐습니다. 전통식 해석에서는 현실적이고 안정적인 인상으로 설명합니다.',
    arched:'눈썹 중심의 곡률이 비교적 뚜렷해 아치형으로 분류됐습니다. 전통식 해석에서는 유연하고 감각적인 인상으로 설명합니다.'
  },
  nose:{
    balanced:'코의 길이와 폭이 얼굴 비율 안에서 중간 범위로 측정됐습니다. 전통식 해석에서는 현실감과 균형을 상징합니다.',
    high:'코의 세로 비율이 상대적으로 길게 측정됐습니다. 전통식 해석에서는 목표 의식과 자존감을 상징하는 형태로 표현합니다.',
    round:'코의 가로 폭이 상대적으로 넓게 측정됐습니다. 전통식 해석에서는 안정과 생활력을 상징하는 형태로 표현합니다.',
    small:'코의 가로 폭이 상대적으로 좁게 측정됐습니다. 전통식 해석에서는 섬세함과 신중함을 상징하는 형태로 표현합니다.'
  },
  mouth:{
    balanced:'입술 두께와 입꼬리 기울기가 중간 범위로 측정됐습니다. 전통식 해석에서는 말과 행동의 균형을 상징합니다.',
    full:'입술 높이가 입 너비에 비해 상대적으로 크게 측정됐습니다. 전통식 해석에서는 따뜻한 표현력과 풍부한 감정을 상징합니다.',
    thin:'입술 높이가 입 너비에 비해 상대적으로 작게 측정됐습니다. 전통식 해석에서는 절제된 표현과 신중함을 상징합니다.',
    up:'입꼬리가 입술 중심보다 상대적으로 위쪽에 위치한 것으로 측정됐습니다. 전통식 해석에서는 밝고 긍정적인 인상을 상징합니다.'
  }
};

function setStatus(message,type=''){
  status.className=`face-ai-status${type?` ${type}`:''}`;
  status.textContent=message;
}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function avg(...values){return values.reduce((a,b)=>a+b,0)/values.length;}
function choose(name,value){const el=form.elements[name];if(el)el.value=value;}
function api(){return window.ONGIL;}

async function ensureModel(){
  if(landmarker)return landmarker;
  if(modelPromise)return modelPromise;
  modelPromise=(async()=>{
    const vision=await import(MODULE_URL);
    const fileset=await vision.FilesetResolver.forVisionTasks(WASM_URL);
    const options={
      baseOptions:{modelAssetPath:MODEL_URL,delegate:'GPU'},
      runningMode:'IMAGE',
      numFaces:1,
      minFaceDetectionConfidence:.55,
      minFacePresenceConfidence:.55,
      minTrackingConfidence:.5,
      outputFaceBlendshapes:false,
      outputFacialTransformationMatrixes:false
    };
    try{
      landmarker=await vision.FaceLandmarker.createFromOptions(fileset,options);
    }catch{
      options.baseOptions.delegate='CPU';
      landmarker=await vision.FaceLandmarker.createFromOptions(fileset,options);
    }
    return landmarker;
  })().catch(error=>{modelPromise=null;throw error;});
  return modelPromise;
}

async function getImage(){
  for(let i=0;i<30;i++){
    const img=$('img',preview);
    if(img){
      try{await img.decode();}catch{}
      if(img.complete&&img.naturalWidth>0)return img;
    }
    await new Promise(r=>setTimeout(r,100));
  }
  throw new Error('사진을 불러오지 못했습니다.');
}

function calculate(landmarks,img){
  const p=i=>landmarks[i];
  const faceWidth=dist(p(234),p(454));
  const faceHeight=dist(p(10),p(152));
  const jawWidth=dist(p(172),p(397));
  const foreheadWidth=dist(p(54),p(284));
  const aspect=faceHeight/faceWidth;
  const jawRatio=jawWidth/faceWidth;
  const foreheadRatio=foreheadWidth/faceWidth;

  let faceShape='oval';
  if(aspect>1.48)faceShape='long';
  else if(jawRatio>.86)faceShape='square';
  else if(foreheadRatio-jawRatio>.08)faceShape='heart';
  else if(aspect<1.29)faceShape='round';

  const leftTilt=p(33).y-p(133).y;
  const rightTilt=p(263).y-p(362).y;
  const eyeTilt=avg(leftTilt,rightTilt);
  const eyeWidth=avg(dist(p(33),p(133)),dist(p(263),p(362)))/faceWidth;
  let eyes='soft';
  if(eyeTilt<-.007)eyes='up';
  else if(eyeTilt>.007)eyes='down';
  else if(eyeWidth>.235)eyes='clear';

  const leftArch=avg(p(70).y,p(107).y)-p(105).y;
  const rightArch=avg(p(336).y,p(300).y)-p(334).y;
  const brows=avg(leftArch,rightArch)>.010?'arched':'straight';

  const noseWidth=dist(p(98),p(327))/faceWidth;
  const noseHeight=dist(p(168),p(2))/faceHeight;
  let nose='balanced';
  if(noseWidth>.255)nose='round';
  else if(noseWidth<.185)nose='small';
  else if(noseHeight>.34)nose='high';

  const mouthWidth=dist(p(61),p(291));
  const lipHeight=dist(p(13),p(14));
  const lipRatio=lipHeight/mouthWidth;
  const cornerY=avg(p(61).y,p(291).y);
  const centerY=avg(p(13).y,p(14).y);
  let mouth='balanced';
  if(cornerY<centerY-.005)mouth='up';
  else if(lipRatio>.16)mouth='full';
  else if(lipRatio<.075)mouth='thin';

  const eyeLevel=Math.abs(avg(p(33).y,p(133).y)-avg(p(263).y,p(362).y))/faceHeight;
  const centerOffset=Math.abs(p(1).x-avg(p(234).x,p(454).x))/faceWidth;
  const faceArea=faceWidth*faceHeight;
  const sizePenalty=faceArea<.10?10:faceArea<.16?4:0;
  const confidence=Math.round(clamp(98-eyeLevel*260-centerOffset*120-sizePenalty,68,98));

  return {faceShape,eyes,brows,nose,mouth,confidence,landmarks,imgWidth:img.naturalWidth,imgHeight:img.naturalHeight};
}

function drawMesh(data,img){
  let canvas=$('.face-ai-canvas',preview);
  if(!canvas){canvas=document.createElement('canvas');canvas.className='face-ai-canvas';preview.appendChild(canvas);}
  canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(241,217,154,.75)';
  ctx.strokeStyle='rgba(182,162,255,.8)';
  ctx.lineWidth=Math.max(1,canvas.width/700);
  for(let i=0;i<data.landmarks.length;i+=5){
    const lm=data.landmarks[i];
    ctx.beginPath();ctx.arc(lm.x*canvas.width,lm.y*canvas.height,Math.max(1.2,canvas.width/650),0,Math.PI*2);ctx.fill();
  }
  const xs=data.landmarks.map(x=>x.x*canvas.width),ys=data.landmarks.map(x=>x.y*canvas.height);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  ctx.setLineDash([canvas.width/80,canvas.width/120]);
  ctx.strokeRect(minX,minY,maxX-minX,maxY-minY);
  ctx.setLineDash([]);
}

function renderSummary(data){
  summary.innerHTML=[
    ['얼굴형',labels.faceShape[data.faceShape]],
    ['눈매',labels.eyes[data.eyes]],
    ['눈썹',labels.brows[data.brows]],
    ['코',labels.nose[data.nose]],
    ['입매',labels.mouth[data.mouth]],
    ['인식 품질',`${data.confidence}%`]
  ].map(([k,v])=>`<div class="face-ai-chip"><b>${k}</b>${v}</div>`).join('');
}

async function analyze(){
  if(busy)return;
  if(!input.files?.[0]){setStatus('정면 사진을 먼저 촬영하거나 선택해 주세요.','error');return;}
  busy=true;features=null;form.classList.remove('ai-ready');summary.innerHTML='';
  analyzeButton.disabled=true;
  try{
    setStatus('휴대폰에서 AI 얼굴 인식 모델을 준비하고 있습니다. 사진은 업로드하지 않습니다.','loading');
    const [model,img]=await Promise.all([ensureModel(),getImage()]);
    setStatus('얼굴의 3차원 기준점과 비율을 분석하고 있습니다.','loading');
    const result=model.detect(img);
    const landmarks=result.faceLandmarks?.[0];
    if(!landmarks)throw new Error('얼굴을 찾지 못했습니다. 밝은 곳에서 정면으로 다시 촬영해 주세요.');
    features=calculate(landmarks,img);
    choose('faceShape',features.faceShape);
    choose('eyes',features.eyes);
    choose('brows',features.brows);
    choose('nose',features.nose);
    choose('mouth',features.mouth);
    drawMesh(features,img);
    renderSummary(features);
    form.classList.add('ai-ready');
    setStatus(`AI 자동 판독 완료 · 정면 인식 품질 ${features.confidence}%`,'success');
    analyzeButton.textContent='AI 다시 판독';
  }catch(error){
    console.error(error);
    setStatus(error?.message||'AI 판독 중 오류가 발생했습니다. 사진을 다시 촬영해 주세요.','error');
  }finally{
    busy=false;analyzeButton.disabled=false;
  }
}

function resultBody(data,nickname){
  const rows=[
    ['얼굴형',readings.faceShape[data.faceShape]],
    ['눈매',readings.eyes[data.eyes]],
    ['눈썹',readings.brows[data.brows]],
    ['코의 비율',readings.nose[data.nose]],
    ['입매',readings.mouth[data.mouth]]
  ];
  const title=nickname||'나의 인상';
  return `<div class="face-ai-result-head"><div><strong>${title} AI 관상 참고풀이</strong><small>MediaPipe 얼굴 기준점 기반 자동 분류</small></div><div class="face-ai-confidence">${data.confidence}%</div></div><div class="detail-grid">${rows.map(([h,p])=>`<article class="detail-card"><h4>${h} · ${labels[h==='얼굴형'?'faceShape':h==='눈매'?'eyes':h==='눈썹'?'brows':h==='코의 비율'?'nose':'mouth'][h==='얼굴형'?data.faceShape:h==='눈매'?data.eyes:h==='눈썹'?data.brows:h==='코의 비율'?data.nose:data.mouth]}</h4><p>${p}</p></article>`).join('')}<article class="detail-card"><h4>종합 안내</h4><p>AI는 얼굴의 위치와 비율만 자동 측정했습니다. 성격·능력·건강·신용·미래를 과학적으로 판정하는 기능이 아니며, 전통 관상 문화를 현대적으로 재구성한 오락성 참고 설명입니다.</p></article></div><p class="consent-note">사진 원본과 얼굴 기준점은 서버·저장함·백업 파일에 포함하지 않습니다. 결과 저장 시에는 분류된 특징과 해석 문구만 현재 브라우저에 보관됩니다.</p>`;
}

analyzeButton.addEventListener('click',analyze);
input.addEventListener('change',()=>{
  features=null;form.classList.remove('ai-ready');summary.innerHTML='';
  setStatus('사진이 준비되면 AI 자동 판독을 시작합니다.');
  setTimeout(analyze,250);
});

form.addEventListener('submit',async e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  if(!features){await analyze();if(!features)return;}
  const nickname=(form.elements.nickname?.value||'').trim();
  const body=resultBody(features,nickname);
  api()?.resultShell('face',`${nickname||'모바일'} AI 관상`,body,`${labels.faceShape[features.faceShape]} · ${labels.eyes[features.eyes]} · 인식 ${features.confidence}%`);
},true);

form.addEventListener('reset',()=>{
  features=null;form.classList.remove('ai-ready');summary.innerHTML='';
  const canvas=$('.face-ai-canvas',preview);if(canvas)canvas.remove();
  setStatus('정면 사진을 촬영하면 AI가 얼굴형과 주요 비율을 자동 판독합니다.');
  analyzeButton.textContent='사진 AI 자동 판독';
});

setStatus('정면 사진을 촬영하면 AI가 얼굴형과 주요 비율을 자동 판독합니다.');
})();
