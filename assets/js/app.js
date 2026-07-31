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

function initMusic(){
  if(document.getElementById('ongilAmbientMusic')) return;

  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='assets/css/ambient-music.css';
  document.head.appendChild(css);

  const saved=Number(localStorage.getItem(VOLUME_KEY));
  const initialVolume=Number.isFinite(saved)&&saved>=0&&saved<=0.2?saved:0.07;

  const audio=new Audio(MUSIC_URL);
  audio.id='ongilAmbientMusic';
  audio.loop=true;
  audio.preload='none';
  audio.volume=initialVolume;
  audio.crossOrigin='anonymous';
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
      <input class="ambient-volume" id="ongilAmbientVolume" type="range" min="0" max="20" step="1" value="${Math.round(initialVolume*100)}">
      <span class="ambient-volume-value">${Math.round(initialVolume*100)}%</span>
    </div>`;
  document.body.appendChild(control);

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
      if(audio.paused){
        await audio.play();
        setPlaying(true);
      }else{
        audio.pause();
        setPlaying(false);
      }
    }catch(error){
      setPlaying(false);
      alert('배경음악을 불러오지 못했습니다. 잠시 후 다시 눌러 주세요.');
      console.error(error);
    }
  });

  slider.addEventListener('input',()=>{
    const percent=Number(slider.value);
    audio.volume=percent/100;
    value.textContent=`${percent}%`;
    localStorage.setItem(VOLUME_KEY,String(audio.volume));
  });

  audio.addEventListener('pause',()=>setPlaying(false));
  audio.addEventListener('play',()=>setPlaying(true));
  audio.addEventListener('error',()=>{
    setPlaying(false);
    label.textContent='음악 오류';
  });
}

loadCore()
  .catch(error=>console.error(error))
  .finally(initMusic);
})();
