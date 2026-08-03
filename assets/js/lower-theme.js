(() => {
  'use strict';

  if (document.querySelector('#ongilLowerThemeStyles')) return;
  const style = document.createElement('style');
  style.id = 'ongilLowerThemeStyles';
  style.textContent = `
    :root{--ongil-orange:#e86f12;--ongil-orange-dark:#b94f08;--ongil-ivory:#fffaf0;--ongil-cream:#f8ecd7;--ongil-gold:#d6ad62;--ongil-ink:#2b231d}

    .notice-bar{background:#9d4b18!important;color:#fff8ec!important}
    .notice-bar span{background:#fff3df!important;color:#9d4b18!important}

    .services{background:linear-gradient(180deg,#f8edda 0%,#fffaf2 100%)!important}
    .section-no{color:#c96922!important}
    .section-head h2{color:var(--ongil-ink)!important}
    .section-head>p{color:#75675a!important}
    .services .service-card,
    .services .service-card:first-child,
    .services .service-card:not(:first-child){
      border:1px solid rgba(190,110,40,.13)!important;
      background:rgba(255,252,245,.94)!important;
      color:#31271f!important;
      box-shadow:0 15px 38px rgba(137,78,30,.07)!important
    }
    .services .service-card:hover,
    .services .service-card.active,
    .services .service-card:first-child:hover,
    .services .service-card:first-child.active{
      color:#fff!important;
      background:linear-gradient(145deg,#ef7c20,#c95b0d)!important;
      box-shadow:0 22px 46px rgba(213,94,14,.22)!important
    }
    .services .service-card i,
    .services .service-card:first-child i,
    .services .service-card:not(:first-child) i{
      color:#b7550f!important;background:#fff0d6!important
    }
    .services .service-card:hover i,
    .services .service-card.active i{color:#c65a0c!important;background:#fff!important}
    .services .service-card p{color:#7d7064!important}
    .services .service-card:hover p,.services .service-card.active p{color:#fff1e5!important}

    .workspace{background:linear-gradient(180deg,#fffaf2,#f7ead5)!important}
    .workspace:before{color:#3a2b21!important}
    .workspace-side{
      color:#fff!important;
      background:linear-gradient(155deg,#d86612,#a84608)!important;
      border-color:rgba(255,255,255,.18)!important;
      box-shadow:0 25px 58px rgba(180,75,9,.2)!important
    }
    .workspace-side>p,.privacy-note p{color:#ffe8d2!important}
    .step-list span{color:#f4c9a7!important}
    .step-list .on{color:#fff!important}
    .step-list .on b{background:#fff4e7!important;color:#b94f08!important}
    .workspace-tabs{background:#f2dfc1!important;border-color:rgba(180,90,20,.11)!important}
    .workspace-tabs button{color:#7d4b27!important}
    .workspace-tabs button.active{background:#e86f12!important;color:#fff!important;box-shadow:0 8px 20px rgba(232,111,18,.18)!important}
    .service-panel,.result-zone{background:#fffdf8!important;border-color:rgba(184,98,29,.11)!important;box-shadow:0 20px 50px rgba(136,75,27,.07)!important}
    .panel-head small,.result-head small{color:#c76720!important}
    .panel-head h3,.result-head h3{color:#34261d!important}
    .panel-badge{background:#fff0db!important;color:#b9560f!important}
    .form-grid input,.form-grid select,.form-grid textarea{background:#fffaf2!important;border-color:#decbb5!important}
    .form-grid input:focus,.form-grid select:focus,.form-grid textarea:focus{border-color:#e86f12!important;box-shadow:0 0 0 3px rgba(232,111,18,.1)!important}
    .button.primary,.result-actions .save{background:#e86f12!important;border-color:#e86f12!important;color:#fff!important}
    .button.ghost{color:#b7540e!important;border-color:#d78a50!important}
    .name-card,.detail-card,.date-item{background:#fffaf3!important;border-color:#ead8c3!important}
    .name-card strong,.detail-card h4,.date-item strong{color:#b95510!important}

    .ongil-payment{background:linear-gradient(180deg,#f7ead4,#fff8ec)!important;border-color:rgba(196,107,31,.14)!important}
    .payment-title small{color:#c35f17!important}
    .payment-title h2{color:#3a2a20!important}
    .payment-title>p{color:#78695d!important}
    .payment-service{border-color:rgba(190,105,35,.18)!important;color:#71421f!important;background:#fffdf8!important}
    .payment-service:has(input:checked){background:#e86f12!important;color:#fff!important;border-color:#e86f12!important;box-shadow:0 10px 24px rgba(232,111,18,.19)!important}
    .payment-summary{background:linear-gradient(155deg,#b94f08,#7e3508)!important;box-shadow:0 18px 42px rgba(158,64,7,.22)!important}
    .payment-total-row strong{color:#ffe0a3!important}
    .payment-button{background:#ffc06d!important;color:#6c2b00!important}

    .archive{background:linear-gradient(180deg,#fff9ef,#f4e5ce)!important}
    .archive-toolbar{background:#fffdf8!important;border:1px solid rgba(184,97,27,.1)!important}
    .archive-item{background:#fffaf3!important;border-color:#ead6bd!important}
    .archive-type{background:#fff0da!important;color:#b95710!important}
    .archive-summary b{color:#c75d11!important}

    .guide{background:linear-gradient(145deg,#7d3508,#b84e09)!important}
    .guide .section-no{color:#ffd095!important}
    .guide-cards article{background:rgba(255,255,255,.09)!important;border-color:rgba(255,255,255,.16)!important}
    .guide-cards b{color:#ffd08b!important}
    .guide-cards p,.guide-grid>div>p:last-child{color:#ffe6cf!important}

    .site-footer{background:#21150f!important;color:#f5e9dd!important}
    .site-footer a{color:#ead8c7!important}
    .footer-brand p,.footer-bottom{color:#aa9585!important}
    .brand-seal.small{border-color:#d8ad65!important;background:transparent!important;color:#e86f12!important}

    .lotto-set,.lotto-summary-card{border-color:#ead3b8!important;background:#fffaf1!important}
    .lotto-set-label,.lotto-summary-card h4{color:#bd5a15!important}

    @media(max-width:700px){
      .section{padding-top:82px!important;padding-bottom:82px!important}
      .workspace-side{position:static!important}
    }
  `;
  document.head.appendChild(style);
})();
