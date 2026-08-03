(() => {
  'use strict';

  const installButton = document.querySelector('#installOngilApp');
  const downloadButton = document.querySelector('#downloadOngilShortcut');
  let installPrompt = null;

  const style = document.createElement('style');
  style.textContent = `
    .shortcut-install{background:#fff8ec;border-bottom:1px solid #ead9bf}
    .shortcut-install-inner{display:flex;align-items:center;justify-content:space-between;gap:28px;padding-top:22px;padding-bottom:22px}
    .shortcut-install small{display:block;color:#a45a19;font-weight:900;letter-spacing:.14em;margin-bottom:4px}
    .shortcut-install h2{margin:0 0 5px;color:#3b271b;font-size:clamp(20px,2.5vw,28px)}
    .shortcut-install p{margin:0;color:#78695f;font-size:14px}
    .shortcut-install-actions{display:flex;gap:10px;flex:0 0 auto}
    .shortcut-install-actions button{border:1px solid #a65619;background:#a65619;color:#fff;border-radius:999px;padding:12px 19px;font:inherit;font-weight:850;cursor:pointer;white-space:nowrap}
    .shortcut-install-actions button+button{background:#fff;color:#8d4515}
    .shortcut-install-actions button:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(112,55,16,.14)}
    @media(max-width:760px){.shortcut-install-inner{align-items:flex-start;flex-direction:column}.shortcut-install-actions{width:100%}.shortcut-install-actions button{flex:1}}
    @media(max-width:480px){.shortcut-install-actions{flex-direction:column}.shortcut-install-actions button{width:100%}}
  `;
  document.head.appendChild(style);

  const toast = message => window.ONGIL?.toast(message) || window.alert(message);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent || '');

  function showInstallGuide() {
    let dialog = document.querySelector('#ongilInstallGuide');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'ongilInstallGuide';
      dialog.innerHTML = `<div class="dialog-head"><h2>온길 홈 화면 설치</h2><button type="button" aria-label="닫기">×</button></div><div class="dialog-body"><h3>아이폰·아이패드</h3><p>Safari 하단의 공유 아이콘을 누른 뒤 <b>홈 화면에 추가</b>를 선택하고 오른쪽 위 <b>추가</b>를 누르세요.</p><h3>안드로이드</h3><p>Chrome 오른쪽 위 메뉴(⋮)에서 <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 선택하세요.</p><h3>설치가 보이지 않을 때</h3><p>카카오톡·네이버 앱 안에서 열었다면 메뉴에서 <b>기본 브라우저로 열기</b>를 선택한 뒤 다시 시도하세요.</p></div>`;
      document.body.appendChild(dialog);
      dialog.querySelector('button').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    }
    dialog.showModal();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.textContent = '온길 앱 설치';
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    if (installButton) {
      installButton.textContent = '온길 설치 완료';
      installButton.disabled = true;
    }
    toast('온길 앱 설치가 완료되었습니다.');
  });

  installButton?.addEventListener('click', async () => {
    if (isStandalone()) {
      toast('온길이 이미 앱으로 실행 중입니다.');
      return;
    }

    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installPrompt = null;
      if (choice.outcome !== 'accepted') toast('설치를 취소했습니다. 언제든 다시 설치할 수 있습니다.');
      return;
    }

    showInstallGuide();
  });

  downloadButton?.addEventListener('click', () => {
    const content = `[InternetShortcut]\r\nURL=https://ongil.io.kr/\r\nIconFile=https://ongil.io.kr/assets/img/favicon.svg\r\nIconIndex=0\r\n`;
    const blob = new Blob([content], { type: 'application/internet-shortcut;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '온길-바로가기.url';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    toast('온길 바로가기 파일을 다운로드했습니다.');
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(error => console.error('Service worker registration failed:', error));
    });
  }

  if (isIOS() && installButton) installButton.textContent = '아이폰 홈 화면 설치';
})();
