(() => {
  'use strict';

  const ORANGE = '#e86f12';

  function installStyles() {
    if (document.querySelector('#ongilMainFinishStyles')) return;
    const style = document.createElement('style');
    style.id = 'ongilMainFinishStyles';
    style.textContent = `
      .site-header{background:#141412!important;border-bottom:1px solid rgba(232,111,18,.24)!important;backdrop-filter:none!important}
      .header-inner{height:86px!important}
      .brand{gap:11px!important}
      .brand-seal{
        width:54px!important;height:54px!important;border-radius:50%!important;
        color:transparent!important;background:transparent!important;box-shadow:none!important;
        border:2px solid #d7b46d!important;position:relative!important;overflow:visible!important
      }
      .brand-seal:before{
        content:"";position:absolute;left:7px;top:8px;width:31px;height:31px;
        border-left:4px solid #d7b46d;border-bottom:3px solid #d7b46d;border-radius:50%;
        transform:rotate(-23deg)
      }
      .brand-seal:after{
        content:"";position:absolute;right:7px;top:7px;width:7px;height:7px;
        background:#f2d080;transform:rotate(45deg);box-shadow:0 0 10px rgba(242,208,128,.75)
      }
      .brand-copy strong{
        color:${ORANGE}!important;font-family:"Nanum Brush Script","Nanum Pen Script",cursive!important;
        font-size:39px!important;font-weight:400!important;line-height:1!important;letter-spacing:.01em!important
      }
      .brand-copy small{display:none!important}
      .main-nav a{color:#f3eee6!important;font-size:14px!important}
      .main-nav a:hover{color:#f38a31!important}
      .header-cta{background:${ORANGE}!important;color:#fff!important;box-shadow:0 9px 22px rgba(232,111,18,.28)!important}
      .menu-toggle span{background:#fff!important}

      .hero.hero-v2{
        min-height:700px!important;
        background:
          radial-gradient(circle at 87% 16%,rgba(247,190,83,.24),transparent 27%),
          linear-gradient(120deg,#fffaf0 0%,#f9ecd4 56%,#f5dfb7 100%)!important
      }
      .hero-v2 .hero-v2-grid{min-height:670px!important;grid-template-columns:.9fr 1.1fr!important;gap:54px!important;padding:70px 0!important}
      .hero-v2-badge{
        color:#9c5422!important;border-color:rgba(156,84,34,.45)!important;background:rgba(255,255,255,.48)!important
      }
      .hero-v2 h1{
        color:#1f1b18!important;font-family:"Nanum Brush Script","Nanum Pen Script",cursive!important;
        font-size:clamp(48px,5vw,70px)!important;font-weight:400!important;line-height:1.08!important;
        letter-spacing:.015em!important;text-shadow:none!important;filter:none!important;opacity:1!important
      }
      .hero-v2 h1 span{
        display:block!important;margin-top:7px!important;color:${ORANGE}!important;
        background:none!important;-webkit-text-fill-color:currentColor!important;font-family:inherit!important
      }
      .hero-v2-lead{color:#5f554c!important;font-size:16px!important;max-width:590px!important}
      .hero-v2 .button.primary{background:${ORANGE}!important;border-color:${ORANGE}!important;color:#fff!important}
      .hero-v2 .button.ghost{color:#8c4b1e!important;border-color:rgba(140,75,30,.35)!important;background:rgba(255,255,255,.56)!important}
      .hero-v2-trust{border-color:rgba(118,76,37,.16)!important}
      .hero-v2-trust div{border-color:rgba(118,76,37,.16)!important}
      .hero-v2-trust strong{color:#332820!important}
      .hero-v2-trust span{color:#786b60!important}
      .hero-v2-visual{box-shadow:0 25px 65px rgba(112,74,35,.16)!important}
      .hero-v2-visual:after{background:${ORANGE}!important;color:#fff!important}

      .hero-service-shortcuts{background:#f8edda!important}
      .hero-service-shortcuts button.active{background:${ORANGE}!important;border-color:${ORANGE}!important;box-shadow:0 11px 25px rgba(232,111,18,.2)!important}
      .hero-service-shortcuts button:hover{border-color:rgba(232,111,18,.45)!important;color:#c75708!important}

      @media(max-width:1000px){
        .hero-v2 .hero-v2-grid{grid-template-columns:1fr!important}
      }
      @media(max-width:700px){
        .header-inner{height:72px!important}
        .brand-seal{width:44px!important;height:44px!important}
        .brand-copy strong{font-size:32px!important}
        .hero-v2 h1{font-size:45px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function finishCopy() {
    const brandName = document.querySelector('.brand-copy strong');
    if (brandName) brandName.textContent = '온길';

    const badge = document.querySelector('.hero-v2-badge');
    if (badge) badge.textContent = '온길 · 필요한 서비스를 한곳에서';

    const title = document.querySelector('.hero-v2 h1');
    if (title) title.innerHTML = '좋은 시작이 필요한 순간<span>당신 곁의 온길</span>';

    const lead = document.querySelector('.hero-v2-lead');
    if (lead) lead.textContent = '작명·개명, 이름풀이, 좋은 날 택일, 제사지방, 축문, 궁합, 타로, 관상, 오늘의 로또를 필요한 만큼 선택해 이용하세요.';

    const visualLabel = document.querySelector('.hero-v2-visual');
    if (visualLabel) visualLabel.setAttribute('aria-label', '온길 생활문화 서비스 안내');

    const sectionHeading = document.querySelector('#services .section-head h2');
    if (sectionHeading) sectionHeading.innerHTML = '필요한 순간에 선택하는<br>온길의 아홉 가지 서비스';

    const sectionCopy = document.querySelector('#services .section-head > p');
    if (sectionCopy) sectionCopy.textContent = '현재 제공 중인 서비스만 선택해 바로 작성할 수 있으며, 결제한 서비스는 각 1회 이용할 수 있습니다.';
  }

  function init() {
    installStyles();
    finishCopy();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
