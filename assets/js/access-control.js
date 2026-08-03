(() => {
  'use strict';

  const ACCESS_KEY = 'ongil_paid_access_v1';
  const USED_KEY = 'ongil_paid_service_uses_v1';
  const CONFIG_SRC = 'assets/js/payment-config.js?v=20260803-one-use-v1';

  const serviceLabels = {
    naming: '작명·개명',
    analysis: '이름풀이',
    date: '좋은 날 택일',
    jibang: '제사지방',
    chukmun: '축문',
    compatibility: '궁합',
    tarot: '타로',
    face: '관상',
    lotto: '오늘의 로또'
  };

  const formServices = {
    namingForm: 'naming',
    analysisForm: 'analysis',
    dateForm: 'date',
    jibangForm: 'jibang',
    chukmunForm: 'chukmun',
    compatibilityForm: 'compatibility',
    tarotForm: 'tarot',
    faceForm: 'face',
    lottoForm: 'lotto'
  };

  let pendingUse = null;
  let pendingTimer = 0;

  const toast = message => {
    if (window.ONGIL?.toast) window.ONGIL.toast(message);
    else window.alert(message);
  };

  function safeArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function safeObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function usageKey(paymentId, serviceId) {
    return `${paymentId}:${serviceId}`;
  }

  function findGrant(serviceId) {
    const used = safeObject(USED_KEY);
    const grants = safeArray(ACCESS_KEY);

    return grants.find(grant => {
      if (!grant?.paymentId || !Array.isArray(grant.serviceIds)) return false;
      if (!grant.serviceIds.includes(serviceId)) return false;
      return !used[usageKey(grant.paymentId, serviceId)];
    }) || null;
  }

  function hasPurchased(serviceId) {
    return safeArray(ACCESS_KEY).some(grant =>
      grant?.paymentId && Array.isArray(grant.serviceIds) && grant.serviceIds.includes(serviceId)
    );
  }

  function markUsed(grant, serviceId) {
    const used = safeObject(USED_KEY);
    const key = usageKey(grant.paymentId, serviceId);
    if (used[key]) return false;

    used[key] = {
      paymentId: grant.paymentId,
      serviceId,
      usedAt: new Date().toISOString()
    };
    localStorage.setItem(USED_KEY, JSON.stringify(used));
    return true;
  }

  function loadConfig() {
    if (window.ONGIL_PAYMENT_CONFIG) return Promise.resolve(window.ONGIL_PAYMENT_CONFIG);

    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src.includes('payment-config.js'));
      if (existing) {
        existing.addEventListener('load', () => resolve(window.ONGIL_PAYMENT_CONFIG), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = CONFIG_SRC;
      script.async = true;
      script.onload = () => resolve(window.ONGIL_PAYMENT_CONFIG);
      script.onerror = () => reject(new Error('결제 설정을 불러오지 못했습니다.'));
      document.head.appendChild(script);
    });
  }

  function isEnforced() {
    const config = window.ONGIL_PAYMENT_CONFIG;
    return Boolean(config?.enabled && Number(config?.usageLimitPerService) === 1);
  }

  function scrollToPayment(serviceId) {
    const checkbox = document.querySelector(`#paymentServiceGrid input[value="${serviceId}"]`);
    if (checkbox && !checkbox.checked) {
      const selected = document.querySelectorAll('#paymentServiceGrid input:checked').length;
      const max = Number(window.ONGIL_PAYMENT_CONFIG?.maxQuantity || 5);
      if (selected < max) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    document.querySelector('#payment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function installStyles() {
    if (document.querySelector('#ongilAccessStyles')) return;
    const style = document.createElement('style');
    style.id = 'ongilAccessStyles';
    style.textContent = `
      .ongil-access-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:5px 8px;border-radius:999px;font-size:11px;font-weight:800;line-height:1;background:#eee;color:#555;vertical-align:middle}
      .ongil-access-badge.available{background:#e4f3e9;color:#17633a}
      .ongil-access-badge.used{background:#f2e7e3;color:#8b3a2d}
      .ongil-access-badge.locked{background:#f1eadb;color:#72541e}
    `;
    document.head.appendChild(style);
  }

  function serviceState(serviceId) {
    if (findGrant(serviceId)) return ['available', '1회 사용 가능'];
    if (hasPurchased(serviceId)) return ['used', '사용 완료'];
    return ['locked', '이용권 필요'];
  }

  function renderBadges() {
    if (!isEnforced()) return;

    Object.keys(serviceLabels).forEach(serviceId => {
      const panel = document.querySelector(`[data-panel="${serviceId}"]`);
      const head = panel?.querySelector('.panel-head h3, .panel-head h2');
      if (!head) return;

      let badge = head.querySelector('.ongil-access-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ongil-access-badge';
        head.appendChild(badge);
      }

      const [state, label] = serviceState(serviceId);
      badge.className = `ongil-access-badge ${state}`;
      badge.textContent = label;
    });
  }

  function updatePaymentNotices() {
    if (!isEnforced()) return;

    const notice = document.querySelector('.notice-bar');
    if (notice) {
      const title = notice.querySelector('span');
      const copy = notice.querySelector('p');
      if (title) title.textContent = '서비스 이용권 결제';
      if (copy) copy.textContent = '결제한 서비스는 각 1회 이용할 수 있습니다. 필요한 서비스만 선택해 결제하세요.';
    }

    const footerStatus = document.querySelector('.footer-bottom span:last-child');
    if (footerStatus) footerStatus.textContent = 'NHN KCP 안전결제를 지원합니다.';
  }

  function clearPending() {
    pendingUse = null;
    clearTimeout(pendingTimer);
    pendingTimer = 0;
  }

  function beginPending(serviceId, grant) {
    clearPending();
    const resultZone = document.querySelector('#resultZone');
    pendingUse = {
      serviceId,
      grant,
      before: resultZone?.innerHTML || '',
      startedAt: Date.now()
    };
    pendingTimer = window.setTimeout(clearPending, 5000);
  }

  function installSubmitGate() {
    document.addEventListener('submit', event => {
      if (!isEnforced()) return;

      const form = event.target;
      const serviceId = formServices[form?.id];
      if (!serviceId) return;

      const grant = findGrant(serviceId);
      if (!grant) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const message = hasPurchased(serviceId)
          ? `${serviceLabels[serviceId]} 1회 이용권을 이미 사용했습니다.`
          : `${serviceLabels[serviceId]} 이용권 결제가 필요합니다.`;
        toast(message);
        scrollToPayment(serviceId);
        return;
      }

      beginPending(serviceId, grant);
    }, true);
  }

  function installResultObserver() {
    const resultZone = document.querySelector('#resultZone');
    if (!resultZone) return;

    const observer = new MutationObserver(() => {
      if (!pendingUse || !isEnforced()) return;
      if (resultZone.innerHTML === pendingUse.before) return;
      if (!resultZone.querySelector('.result-head')) return;

      const { serviceId, grant } = pendingUse;
      if (markUsed(grant, serviceId)) {
        toast(`${serviceLabels[serviceId]} 이용권 1회가 사용되었습니다.`);
      }
      clearPending();
      renderBadges();
    });

    observer.observe(resultZone, { childList: true, subtree: true });
  }

  async function init() {
    installStyles();
    await loadConfig();
    updatePaymentNotices();
    renderBadges();
    installSubmitGate();
    installResultObserver();

    const bodyObserver = new MutationObserver(() => renderBadges());
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    window.setInterval(renderBadges, 1500);
  }

  init().catch(error => console.error('[ONGIL access]', error));
})();
