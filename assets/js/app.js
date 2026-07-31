(()=>{
'use strict';

const CORE_URL='https://cdn.jsdelivr.net/gh/lsk751109-afk/ongil-site@60b71db3a7465f1fd979a36806ed319c13e59d2f/assets/js/app.js';
const MUSIC_URL='https://cdn1.suno.ai/30126064-f7f8-4625-90ad-7337a0a96909.mp3';
const VOLUME_KEY='ongil_music_volume_v1';

function loadCore(){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=CORE_URL;
    script.defer=true;
    script.onload=resolve;
    script.onerror=()=>reject(new Error('온길 기본 기능을 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });
}

function activateService(type){
  document.querySelectorAll('[data-service]').forEach(el=>el.classList.toggle('active',el.dataset.service===type));
  document.querySelectorAll('[data-panel]').forEach(el=>el.classList.toggle('active',el.dataset.panel===type));
  const workspace=document.getElementById('workspace');
  if(workspace) workspace.scrollIntoView({behavior:'smooth',block:'start'});
}

function rebuildHome(){
  if(document.querySelector('.neon-home')) return;
  document.body.classList.add('neon-home-enabled');

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/css/neon-home.css';
  document.head.appendChild(css);

  const main=document.getElementById('main');
  if(!main) return;

  const section=document.createElement('section');
  section.className='neon-home';
  section.setAttribute('aria-label','온길 주요 서비스');
  section.innerHTML=`
    <div class="neon-home-shell">
      <div class="neon-home-grid">
        <article class="neon-intro">
          <div class="neon-kicker"><small>오늘의 길</small><strong>빛을 따라<br>한 걸음씩</strong><span>溫 · 길</span></div>
          <div class="micro">TODAY · PATH · LIGHT</div>
          <h1>오늘의 길을 비추는<br>당신만의 온길</h1>
          <p>작명과 이름풀이, 좋은 날 택일, 제사지방과 축문까지 필요한 서비스를 한곳에서 이용하세요.</p>
          <button class="neon-btn" type="button" data-neon-service="naming">나의 온길 시작하기</button>
          <div class="neon-points"><span>결과 6개 제공</span><span>브라우저 안전 저장</span><span>인쇄 지원</span></div>
        </article>

        <article class="neon-card">
          <span class="tag">나의 이름</span>
          <h2>작명·개명<br>이름 추천</h2>
          <span class="hanja">名 · 命</span>
          <div class="neon-visual"><div class="neon-icon" aria-hidden="true">✦</div></div>
          <p>생년월일과 원하는 분위기를 반영해 이름 후보 6개와 뜻풀이를 제공합니다.</p>
          <button class="neon-btn" type="button" data-neon-service="naming">이름 추천 시작하기</button>
          <div class="mini"><span>후보 6개</span><span>상세 뜻풀이</span><span>저장 지원</span></div>
        </article>

        <article class="neon-card">
          <span class="tag">좋은 날</span>
          <h2>결혼·이사·개업<br>택일</h2>
          <span class="hanja">擇 · 日</span>
          <div class="neon-visual"><div class="neon-icon" aria-hidden="true">◎</div></div>
          <p>목적과 기간, 선호 요일을 입력하면 검토하기 좋은 날짜 후보를 정리합니다.</p>
          <button class="neon-btn" type="button" data-neon-service="date">좋은 날 찾아보기</button>
          <div class="mini"><span>후보 6일</span><span>요일 조건</span><span>저장 지원</span></div>
        </article>

        <article class="neon-card">
          <span class="tag">예를 잇는 문서</span>
          <h2>제사지방·축문<br>간편 작성</h2>
          <span class="hanja">禮 · 文</span>
          <div class="neon-visual"><div class="neon-icon" aria-hidden="true">禮</div></div>
          <p>고인과의 관계와 제례 정보를 입력해 지방과 축문 문안을 만들고 인쇄할 수 있습니다.</p>
          <button class="neon-btn" type="button" data-neon-service="jibang">제례 문서 작성하기</button>
          <div class="mini"><span>세로 문안</span><span>축문 작성</span><span>인쇄 지원</span></div>
        </article>
      </div>
    </div>`;

  main.insertBefore(section,main.firstChild);
  section.querySelectorAll('[data-neon-service]').forEach(btn=>{
    btn.addEventListener('click',()=>activateService(btn.dataset.neonService));
  });
}

function initQuickServices(){
  const buttons=[...document.querySelectorAll('[data-quick-service]')];
  buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      buttons.forEach(item=>item.classList.toggle('active',item===btn));
      activateService(btn.dataset.quickService);
    });
  });
}

function initMusic(){
  if(document.getElementById('ongilAmbientMusic')) return;

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/css/ambient-music.css?v=20260801-inline-volume-v9';
  document.head.appendChild(css);

  const saved=Number(localStorage.getItem(VOLUME_KEY));
  const initialVolume=Number.isFinite(saved)&&saved>=0&&saved<=0.5?saved:0.2;

  const audio=new Audio(MUSIC_URL);
  audio.id='ongilAmbientMusic';
  audio.loop=true;
  audio.preload='none';
  audio.volume=initialVolume;
  document.body.appendChild(audio);

  const control=document.createElement('div');
  control.className='ambient-music-control';
  control.setAttribute('role','group');
  control.setAttribute('aria-label','온길 배경음악');
  control.innerHTML=`
    <button class="ambient-music-toggle" type="button" aria-pressed="false" aria-label="배경음악 재생">
      <span aria-hidden="true">♪</span><b>음악 켜기</b>
    </button>
    <div class="ambient-volume-wrap">
      <label for="ongilAmbientVolume">음량</label>
      <input class="ambient-volume" id="ongilAmbientVolume" type="range" min="0" max="50" step="1" value="${Math.round(initialVolume*100)}">
      <span class="ambient-volume-value">${Math.round(initialVolume*100)}%</span>
    </div>`;
  const heroTrust=document.querySelector('.hero-v2-trust');
  const heroCopy=document.querySelector('.hero-v2-copy');
  if(heroTrust&&heroCopy){
    heroCopy.insertBefore(control,heroTrust);
  }else{
    document.body.appendChild(control);
  }

  const toggle=control.querySelector('.ambient-music-toggle');
  const label=toggle.querySelector('b');
  const slider=control.querySelector('.ambient-volume');
  const value=control.querySelector('.ambient-volume-value');

  function setPlaying(playing){
    toggle.setAttribute('aria-pressed',String(playing));
    toggle.setAttribute('aria-label',playing?'배경음악 일시정지':'배경음악 재생');
    label.textContent=playing?'음악 끄기':'음악 켜기';
  }

  toggle.addEventListener('click',async()=>{
    try{
      if(audio.paused){await audio.play();setPlaying(true)}else{audio.pause();setPlaying(false)}
    }catch(error){setPlaying(false);alert('배경음악을 불러오지 못했습니다. 잠시 후 다시 눌러 주세요.');console.error(error)}
  });

  slider.addEventListener('input',()=>{
    const percent=Number(slider.value);
    audio.volume=percent/100;
    value.textContent=`${percent}%`;
    localStorage.setItem(VOLUME_KEY,String(audio.volume));
  });

  audio.addEventListener('pause',()=>setPlaying(false));
  audio.addEventListener('play',()=>setPlaying(true));
  audio.addEventListener('error',()=>{setPlaying(false);label.textContent='음악 오류'});
}

loadCore()
  .catch(error=>console.error(error))
  .finally(()=>{
    initQuickServices();
    initMusic();
  });
})();