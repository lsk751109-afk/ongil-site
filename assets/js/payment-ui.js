(() => {
  'use strict';

  const CONFIG_SRC = 'assets/js/payment-config.js?v=20260803-pricing-v1';
  const PORTONE_SRC = 'https://cdn.portone.io/v2/browser-sdk.js';
  const ACCESS_KEY = 'ongil_paid_access_v1';

  const services = [
    ['fortune', '운세 상세풀이', 'fortune'],
    ['analysis', '이름 상세풀이', 'analysis'],
    ['tarot', '타로 심층해석', 'tarot'],
    ['lotto', '로또 20세트', 'lotto'],
    ['dream', '꿈해몽 상세풀이', 'face'],
    ['annual', '2027 신년운세 · 5,000원', 'annual'],
    ['lifetime', '정통사주·평생운세', 'lifetime'],
    ['wealth', '재물·사업운', 'wealth'],
    ['child', '태몽·자녀운', 'child'],
    ['naming', '작명·개명', 'naming'],
    ['date', '좋은 날 택일', 'date'],
    ['jibang', '제사지방', 'jibang'],
    ['chukmun', '축문', 'chukmun'],
    ['compatibility', '궁합', 'compatibility']
  ];

  const won = value => new Intl.NumberFormat('ko-KR').format(Number(value || 0)) + '원';
  const toast = message => {
    if (window.ONGIL?.toast) window.ONGIL.toast(message);
    else window.alert(message);
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === new URL(src, location.href).href);
      if (existing) {
        if (src.includes('browser-sdk') && window.PortOne) return resolve();
        if (src.includes('payment-config') && window.ONGIL_PAYMENT_CONFIG) return resolve();
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`스크립트를 불러오지 못했습니다: ${src}`));
      document.head.appendChild(script);
    });
  }

  function installStyles() {
    if (document.querySelector('#ongilPaymentStyles')) return;
    const style = document.createElement('style');
    style.id = 'ongilPaymentStyles';
    style.textContent = `
      .ongil-payment{background:#f5f1e8;border-top:1px solid rgba(23,63,53,.12);border-bottom:1px solid rgba(23,63,53,.12)}
      .ongil-payment .payment-wrap{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.75fr);gap:32px;align-items:start}
      .payment-title small{display:block;color:#8d6e42;font-weight:800;letter-spacing:.12em;margin-bottom:8px}
      .payment-title h2{margin:0 0 10px;color:#173f35;font-size:clamp(28px,4vw,44px)}
      .payment-title>p{margin:0 0 22px;color:#59635f;line-height:1.7}
      .payment-service-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .payment-groups{display:grid;gap:20px}.payment-group{background:rgba(255,255,255,.42);border:1px solid rgba(23,63,53,.1);border-radius:18px;padding:16px}.payment-group-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.payment-group-head strong{color:#173f35;font-size:16px}.payment-group-head small{color:#7b7062}.payment-group .payment-service-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .payment-service{display:flex;align-items:center;gap:10px;padding:14px 15px;background:#fff;border:1px solid rgba(23,63,53,.16);border-radius:14px;cursor:pointer;transition:.18s ease;font-weight:700;color:#25473e}
      .payment-service:hover{border-color:#8d6e42;transform:translateY(-1px)}
      .payment-service:has(input:checked){background:#173f35;color:#fff;border-color:#173f35;box-shadow:0 10px 24px rgba(23,63,53,.16)}
      .payment-service input{width:18px;height:18px;accent-color:#c79b51}
      .payment-tier-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
      .payment-tier-list span{background:rgba(255,255,255,.72);border:1px solid rgba(23,63,53,.12);padding:8px 10px;border-radius:999px;font-size:13px;color:#44534e}
      .payment-summary{position:sticky;top:90px;background:#173f35;color:#fff;border-radius:22px;padding:24px;box-shadow:0 18px 42px rgba(23,63,53,.2)}
      .payment-summary h3{margin:0 0 18px;font-size:22px}
      .payment-count-row,.payment-total-row{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.14)}
      .payment-total-row{border-bottom:0;padding-top:18px}
      .payment-total-row strong{font-size:30px;color:#f5d692}
      .payment-selected{min-height:46px;margin:12px 0 18px;color:#d7e1dd;font-size:14px;line-height:1.55}
      .payment-customer{display:grid;gap:10px;margin-bottom:14px}
      .payment-customer input{width:100%;box-sizing:border-box;border:0;border-radius:10px;padding:12px 13px;font:inherit}
      .payment-agree{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.45;color:#d7e1dd;margin:12px 0}
      .payment-agree input{margin-top:3px;accent-color:#c79b51}
      .payment-button{width:100%;border:0;border-radius:12px;padding:15px 16px;background:#c79b51;color:#102f27;font-size:17px;font-weight:900;cursor:pointer}
      .payment-button:disabled{opacity:.45;cursor:not-allowed}
      .payment-status{margin:12px 0 0;font-size:12px;line-height:1.55;color:#c9d4d0}
      .payment-business{margin:14px 0 0;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);font-size:11px;line-height:1.7;color:#aebdb7}
      @media(max-width:900px){.ongil-payment .payment-wrap{grid-template-columns:1fr}.payment-summary{position:static}.payment-service-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:520px){.payment-service-grid,.payment-group .payment-service-grid{grid-template-columns:1fr}.payment-summary{padding:20px}.payment-group-head{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);
  }

  function buildSection(config) {
    if (document.querySelector('#payment')) return document.querySelector('#payment');
    const section = document.createElement('section');
    section.className = 'section ongil-payment';
    section.id = 'payment';
    section.innerHTML = `
      <div class="shell payment-wrap">
        <div class="payment-title">
          <small>ONGIL SERVICE PASS</small>
          <h2>필요한 서비스만 선택하세요</h2>
          <p>최대 5개까지 선택할 수 있으며 선택 개수에 따라 이용권 금액이 자동 계산됩니다.</p>
          <div class="payment-groups" id="paymentServiceGrid">
            <div class="payment-group"><div class="payment-group-head"><strong>무료 서비스 상세 이용</strong><small>기본은 무료 · 상세만 결제</small></div><div class="payment-service-grid">
              ${services.slice(0,5).map(([id, label]) => `<label class="payment-service"><input type="checkbox" value="${id}"><span>${label}</span></label>`).join('')}
            </div></div>
            <div class="payment-group"><div class="payment-group-head"><strong>전문 유료 서비스</strong><small>필요한 서비스만 선택</small></div><div class="payment-service-grid">
              ${services.slice(5).map(([id, label]) => `<label class="payment-service"><input type="checkbox" value="${id}"><span>${label}</span></label>`).join('')}
            </div></div>
          </div>
        </div>
        <aside class="payment-summary">
          <h3>서비스 이용권</h3>
          <div class="payment-count-row"><span>선택 서비스</span><strong id="paymentCount">0개</strong></div>
          <div class="payment-selected" id="paymentSelected">서비스를 1개 이상 선택해 주세요.</div>
          <div class="payment-customer">
            <input id="paymentCustomerName" autocomplete="name" maxlength="30" placeholder="결제자 이름">
            <input id="paymentCustomerPhone" autocomplete="tel" inputmode="tel" maxlength="13" placeholder="휴대전화 번호">
            <input id="paymentCustomerEmail" autocomplete="email" type="email" maxlength="80" placeholder="이메일(선택)">
          </div>
          <label class="payment-agree"><input id="paymentAgree" type="checkbox"><span>구매할 서비스와 결제금액을 확인했으며 이용약관 및 환불정책에 동의합니다.</span></label>
          <div class="payment-total-row"><span>총 결제금액</span><strong id="paymentTotal">0원</strong></div>
          <button class="payment-button" id="paymentButton" type="button" disabled>서비스 선택 후 결제하기</button>
          <p class="payment-status" id="paymentStatus">결제 승인 후 서버에서 결제 상태와 금액을 확인해야 이용권이 활성화됩니다.</p>
          <p class="payment-business">판매자: 마켓하우스<br>사업자등록번호: 203-31-37605<br>통신판매업 신고번호: 제2023-인천옹진-0040호<br>사업장 주소: 인천광역시 옹진군 선재로265번길 51 나동117</p>
        </aside>
      </div>`;
    const archive = document.querySelector('#archive');
    if (archive) archive.before(section);
    else document.querySelector('main')?.appendChild(section);

    const nav = document.querySelector('.main-nav');
    if (nav && !nav.querySelector('a[href="#payment"]')) {
      const link = document.createElement('a');
      link.href = '#payment';
      link.textContent = '이용권';
      nav.appendChild(link);
    }
    return section;
  }

  function normalizePhone(value) {
    return String(value || '').replace(/[^0-9]/g, '');
  }

  function saveGrant(payload) {
    const existing = JSON.parse(localStorage.getItem(ACCESS_KEY) || '[]');
    existing.unshift({ ...payload, savedAt: new Date().toISOString() });
    localStorage.setItem(ACCESS_KEY, JSON.stringify(existing.slice(0, 30)));
  }

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || `서버 요청 실패 (${response.status})`);
    return payload;
  }

  async function init() {
    installStyles();
    await loadScript(CONFIG_SRC);
    const config = window.ONGIL_PAYMENT_CONFIG;
    if (!config) throw new Error('결제 설정을 불러오지 못했습니다.');

    const section = buildSection(config);
    const checkboxes = [...section.querySelectorAll('#paymentServiceGrid input[type="checkbox"]')];
    const countEl = section.querySelector('#paymentCount');
    const selectedEl = section.querySelector('#paymentSelected');
    const totalEl = section.querySelector('#paymentTotal');
    const button = section.querySelector('#paymentButton');
    const agree = section.querySelector('#paymentAgree');
    const status = section.querySelector('#paymentStatus');
    const nameInput = section.querySelector('#paymentCustomerName');
    const phoneInput = section.querySelector('#paymentCustomerPhone');
    const emailInput = section.querySelector('#paymentCustomerEmail');

    const selectedIds = () => checkboxes.filter(input => input.checked).map(input => input.value);
    const amountFor = ids => ids.includes('annual') ? 5000 : (config.priceTiers[ids.length] || 0);
    const labelsFor = ids => ids.map(id => services.find(item => item[0] === id)?.[1] || id);
    const backendIdsFor = ids => ids.map(id => services.find(item => item[0] === id)?.[2] || id);

    function refresh() {
      const ids = selectedIds();
      const count = ids.length;
      const amount = amountFor(ids);
      countEl.textContent = `${count}개`;
      selectedEl.textContent = count ? labelsFor(ids).join(' · ') : '서비스를 1개 이상 선택해 주세요.';
      totalEl.textContent = won(amount);
      button.disabled = count < config.minQuantity || count > config.maxQuantity;
      button.textContent = count ? `${won(amount)} 결제하기` : '서비스 선택 후 결제하기';
    }

    checkboxes.forEach(input => input.addEventListener('change', event => {
      if (event.currentTarget.value === 'annual' && event.currentTarget.checked) {
        checkboxes.forEach(other => { if (other !== event.currentTarget) other.checked = false; });
      } else if (event.currentTarget.checked) {
        const annual = checkboxes.find(other => other.value === 'annual');
        if (annual) annual.checked = false;
      }
      if (selectedIds().length > config.maxQuantity) {
        event.currentTarget.checked = false;
        toast(`서비스는 최대 ${config.maxQuantity}개까지 선택할 수 있습니다.`);
      }
      refresh();
    }));

    phoneInput.addEventListener('input', () => {
      const digits = normalizePhone(phoneInput.value).slice(0, 11);
      phoneInput.value = digits.length > 7 ? digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3') : digits.length > 3 ? digits.replace(/(\d{3})(\d+)/, '$1-$2') : digits;
    });

    button.addEventListener('click', async () => {
      const ids = selectedIds();
      const count = ids.length;
      const displayAmount = Number(amountFor(ids));
      const customerName = nameInput.value.trim();
      const phoneNumber = normalizePhone(phoneInput.value);
      const email = emailInput.value.trim();

      if (!count || count > config.maxQuantity) return toast('결제할 서비스를 다시 선택해 주세요.');
      if (!customerName) return toast('결제자 이름을 입력해 주세요.');
      if (phoneNumber.length < 10) return toast('휴대전화 번호를 정확히 입력해 주세요.');
      if (!agree.checked) return toast('이용약관과 환불정책에 동의해 주세요.');
      if (!config.enabled || !config.apiBaseUrl) {
        status.textContent = '결제 채널은 등록됐지만 결제 검증 서버 주소가 아직 연결되지 않았습니다.';
        return toast('결제 검증 서버 연결 후 실결제가 활성화됩니다.');
      }

      button.disabled = true;
      button.textContent = '결제 준비 중...';
      status.textContent = '주문정보를 안전하게 생성하고 있습니다.';

      try {
        const backendIds = backendIdsFor(ids);
        const prepared = await postJson(`${config.apiBaseUrl}/payments/prepare`, {
          serviceIds: backendIds,
          customer: { fullName: customerName, phoneNumber, email: email || undefined }
        });

        if (!prepared.paymentId || prepared.totalAmount !== displayAmount) {
          throw new Error('서버에서 생성한 결제금액이 화면 금액과 일치하지 않습니다.');
        }

        await loadScript(PORTONE_SRC);
        if (!window.PortOne?.requestPayment) throw new Error('포트원 결제 모듈을 불러오지 못했습니다.');

        status.textContent = 'NHN KCP 결제창을 여는 중입니다.';
        const response = await window.PortOne.requestPayment({
          storeId: config.storeId,
          channelKey: config.channelKey,
          paymentId: prepared.paymentId,
          orderName: prepared.orderName || `온길 서비스 이용권 ${count}개`,
          totalAmount: prepared.totalAmount,
          currency: config.currency,
          payMethod: config.payMethod,
          customer: {
            fullName: customerName,
            phoneNumber,
            ...(email ? { email } : {})
          }
        });

        if (response?.code) throw new Error(response.message || '결제가 취소되었거나 실패했습니다.');
        if (!response?.paymentId) throw new Error('결제 결과를 확인하지 못했습니다.');

        status.textContent = '결제 상태와 금액을 서버에서 최종 확인하고 있습니다.';
        const verified = await postJson(`${config.apiBaseUrl}/payments/verify`, {
          paymentId: response.paymentId,
          txId: response.txId,
          serviceIds: backendIds
        });
        if (!verified.paid) throw new Error(verified.message || '결제 검증에 실패했습니다.');

        saveGrant({ paymentId: response.paymentId, txId: response.txId, serviceIds: ids, amount: prepared.totalAmount });
        status.textContent = '결제가 확인되었습니다. 선택한 서비스 이용권이 활성화되었습니다.';
        toast('결제가 완료되어 이용권이 활성화되었습니다.');
      } catch (error) {
        console.error(error);
        status.textContent = error.message || '결제 처리 중 오류가 발생했습니다.';
        toast(error.message || '결제 처리 중 오류가 발생했습니다.');
      } finally {
        refresh();
      }
    });

    refresh();
  }

  init().catch(error => {
    console.error('[ONGIL payment]', error);
  });
})();
