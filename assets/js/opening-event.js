(() => {
  'use strict';

  const ACCESS_KEY = 'ongil_paid_access_v1';
  const CLAIM_KEY = 'ongil_opening_event_5_claimed_v1';
  const EVENT_END_AT = new Date('2026-09-03T23:59:59+09:00').getTime();
  const services = ['fortune', 'analysis', 'tarot', 'dream', 'lotto'];
  const button = document.querySelector('#claimOpeningPass');
  if (!button) return;

  const style = document.createElement('style');
  style.textContent = `
    .opening-event{background:linear-gradient(110deg,#7f280d 0%,#c24c0a 54%,#ed8b18 100%);color:#fff;border-bottom:1px solid rgba(255,255,255,.28)}
    .opening-event-inner{display:flex;align-items:center;justify-content:space-between;gap:30px;padding-top:22px;padding-bottom:22px}
    .opening-event-copy small{display:block;color:#ffe2a8;font-weight:900;letter-spacing:.16em;margin-bottom:5px}
    .opening-event-copy h2{margin:0 0 6px;font-size:clamp(22px,3vw,34px);line-height:1.2;color:#fff}
    .opening-event-copy p{margin:0;color:#fff4df;line-height:1.6}
    .opening-event-actions{display:flex;align-items:center;gap:14px;flex:0 0 auto}.opening-event-actions span{font-size:13px;color:#ffe5bd}
    .opening-event-actions button{border:1px solid #fff;background:#fff;color:#9a350b;border-radius:999px;padding:13px 22px;font:inherit;font-weight:900;cursor:pointer;box-shadow:0 10px 25px rgba(73,21,5,.2);white-space:nowrap}
    .opening-event-actions button:hover{transform:translateY(-1px)}.opening-event-actions button:disabled{background:#f3dfc9;border-color:#f3dfc9;color:#7c5b49;cursor:default;transform:none}
    @media(max-width:760px){.opening-event-inner{align-items:flex-start;flex-direction:column;gap:14px}.opening-event-actions{width:100%;justify-content:space-between}.opening-event-actions button{padding:12px 17px}}
    @media(max-width:460px){.opening-event-actions{align-items:stretch;flex-direction:column}.opening-event-actions button{width:100%}}
  `;
  document.head.appendChild(style);

  function safeGrants() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCESS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function claimed() {
    return localStorage.getItem(CLAIM_KEY) === 'yes';
  }

  function expired() {
    return Date.now() > EVENT_END_AT;
  }

  function updateButton() {
    if (expired()) {
      button.disabled = true;
      button.textContent = '이벤트 종료';
      return;
    }
    if (!claimed()) return;
    button.disabled = true;
    button.textContent = '5회 이용권 발급 완료';
  }

  button.addEventListener('click', () => {
    if (expired()) {
      window.ONGIL?.toast('오픈 이벤트가 종료되었습니다.');
      updateButton();
      return;
    }
    if (claimed()) {
      window.ONGIL?.toast('이미 오픈 이벤트 이용권을 받았습니다.');
      updateButton();
      return;
    }

    const now = new Date().toISOString();
    const grant = {
      paymentId: `ongil_open_event_${Date.now()}`,
      txId: 'OPENING_EVENT_FREE_5',
      serviceIds: services,
      amount: 0,
      promotion: 'opening-event-5-20260804-20260903',
      savedAt: now
    };
    const grants = safeGrants();
    grants.unshift(grant);
    localStorage.setItem(ACCESS_KEY, JSON.stringify(grants.slice(0, 30)));
    localStorage.setItem(CLAIM_KEY, 'yes');
    updateButton();
    window.ONGIL?.toast('상세 서비스 5회 무료 이용권이 발급되었습니다.');
    window.setTimeout(() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }), 500);
  });

  updateButton();
})();
