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
    landing = '''    <section class="answer-landing" aria-labelledby="answerLandingTitle">
      <div class="shell answer-landing-shell">
        <div class="answer-heading">
          <p>오늘 필요한 답을 온길에서 확인하세요</p>
          <h1 id="answerLandingTitle">당신의 오늘에<br><strong>답을 드립니다.</strong></h1>
          <span>오늘의 운세와 로또는 무료로 이용할 수 있습니다.</span>
        </div>

        <div class="answer-card-grid" aria-label="온길 주요 무료·추천 서비스">
          <button class="answer-card answer-card-fortune" type="button" data-service="daily">
            <div class="answer-card-copy"><small>무료</small><h2>오늘의 운세</h2><p>오늘 하루의 총운·재물·사업·애정·건강 흐름을 확인하세요.</p><span class="answer-card-button">무료로 보기</span></div>
            <div class="answer-fortune-art" aria-hidden="true"><span class="answer-moon"></span><span class="answer-cloud cloud-a"></span><span class="answer-cloud cloud-b"></span><span class="answer-hand hand-a"></span><span class="answer-hand hand-b"></span></div>
          </button>

          <button class="answer-card answer-card-lotto" type="button" data-service="lotto">
            <div class="answer-card-copy"><small>무료</small><h2>오늘의 로또</h2><p>날짜와 선택 조건을 기준으로 6/45 추천 조합을 만들어보세요.</p><span class="answer-card-button">번호 확인하기</span></div>
            <div class="answer-lotto-art" aria-hidden="true"><span>7</span><span>21</span><span>34</span><b>45</b></div>
          </button>

          <button class="answer-card answer-card-tarot" type="button" data-service="tarot">
            <div class="answer-card-copy"><small>추천</small><h2>타로카드</h2><p>마음이 가는 카드를 직접 선택하고 현재의 흐름을 살펴보세요.</p><span class="answer-card-button">카드 뽑기</span></div>
            <div class="answer-tarot-art" aria-hidden="true"><span class="tarot-left">✦</span><span class="tarot-center">☾</span><span class="tarot-right">◎</span></div>
          </button>
        </div>
      </div>
    </section>

'''
    html = html[:start] + landing + html[end:]

index_path.write_text(html, encoding="utf-8")
