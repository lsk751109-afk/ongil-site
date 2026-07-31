from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")

css_link = '<link rel="stylesheet" href="assets/css/main-landing.css">'
if css_link not in html:
    marker = '<link rel="stylesheet" href="assets/css/mystic-theme.css">'
    html = html.replace(marker, marker + "\n  " + css_link, 1)

start = html.find('    <section class="hero">')
end = html.find('    <section class="section services" id="services">')
if start != -1 and end != -1:
    landing = '''    <section class="ongil-landing" aria-labelledby="ongilMainTitle">
      <div class="shell ongil-landing-grid">
        <article class="ongil-intro-card">
          <div class="ongil-intro-copy">
            <p class="ongil-kicker">TODAY · NAME · PATH</p>
            <h1 id="ongilMainTitle">오늘을 읽고,<span>나만의 길을 찾는 온길</span></h1>
            <p>작명과 이름풀이, 궁합, 타로, 좋은 날 택일, 제례문서까지 필요한 서비스를 한곳에서 차분하게 이용하세요.</p>
            <div class="ongil-intro-actions">
              <a class="ongil-glow-btn" href="#workspace">나의 온길 시작하기</a>
              <a class="ongil-outline-btn" href="#services">전체 서비스 보기</a>
            </div>
          </div>
          <div class="ongil-intro-meta"><span>결과 6개 제공</span><span>브라우저 저장</span><span>모바일·인쇄 지원</span></div>
          <div class="ongil-orb-scene" aria-hidden="true"><span class="ongil-orb"></span><span class="ongil-orb-line"></span></div>
        </article>

        <div class="ongil-feature-stack" aria-label="주요 서비스">
          <button class="ongil-feature-card" type="button" data-service="naming">
            <span class="ongil-feature-art" aria-hidden="true"><span>名</span></span>
            <small>NAME PATH</small><h2>작명·이름풀이</h2><p>이름 후보 6개와 분야별 상세풀이</p>
          </button>
          <button class="ongil-feature-card" type="button" data-service="compatibility">
            <span class="ongil-feature-art" aria-hidden="true"><span>緣</span></span>
            <small>RELATION PATH</small><h2>궁합 종합풀이</h2><p>감정·생활·재물·친밀감의 균형 확인</p>
          </button>
          <button class="ongil-feature-card" type="button" data-service="tarot">
            <span class="ongil-feature-art" aria-hidden="true"><span>✦</span></span>
            <small>TAROT PATH</small><h2>직접 뽑는 타로</h2><p>1장 또는 3장 카드로 현재 흐름 살펴보기</p>
          </button>
          <button class="ongil-feature-card" type="button" data-service="date">
            <span class="ongil-feature-art" aria-hidden="true"><span>日</span></span>
            <small>DATE PATH</small><h2>좋은 날 택일</h2><p>결혼·이사·개업·계약·행사 후보 6일</p>
          </button>
        </div>
      </div>
    </section>

'''
    html = html[:start] + landing + html[end:]

index_path.write_text(html, encoding="utf-8")
