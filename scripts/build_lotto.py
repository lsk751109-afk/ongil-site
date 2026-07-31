from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")


def inject_after(source: str, marker: str, addition: str) -> str:
    if addition.strip() in source:
        return source
    return source.replace(marker, marker + addition, 1)


def inject_before(source: str, marker: str, addition: str) -> str:
    if addition.strip() in source:
        return source
    return source.replace(marker, addition + marker, 1)


css_link = '<link rel="stylesheet" href="assets/css/lotto.css">'
if css_link not in html:
    marker = '<link rel="stylesheet" href="assets/css/tarot-cards.css">'
    fallback = '<link rel="stylesheet" href="assets/css/extended-services.css">'
    target = marker if marker in html else fallback
    html = html.replace(target, target + "\n  " + css_link, 1)

service_marker = '<button class="service-card" type="button" data-service="tarot"><span>07</span><i>星</i><h3>타로</h3><p>오늘·연애·재물·사업 흐름 카드</p></button>'
service_addition = '''
          <button class="service-card" type="button" data-service="lotto"><span>09</span><i>福</i><h3>오늘의 로또</h3><p>날짜 기반 6/45 추천 조합</p><small class="service-badge">매일 갱신</small></button>'''
html = inject_after(html, service_marker, service_addition)

tab_marker = '<button type="button" data-service="tarot">타로</button>'
tab_addition = '<button type="button" data-service="lotto">오늘의 로또</button>'
html = inject_after(html, tab_marker, tab_addition)

panel = '''
          <section class="service-panel" id="panel-lotto" data-panel="lotto">
            <div class="panel-head"><div><small>DAILY LOTTO 6/45</small><h3>오늘의 로또 추천번호</h3></div><span class="panel-badge">오락용 번호 조합</span></div>
            <div class="lotto-panel-intro">
              <div><strong>날짜와 조건을 기준으로 번호를 구성합니다.</strong><p>같은 날짜와 조건에서는 동일한 기본 조합이 나오며, ‘다른 조합’ 버튼으로 새 조합을 확인할 수 있습니다.</p></div>
              <span class="lotto-date-chip" id="lottoDateChip">오늘 날짜</span>
            </div>
            <form id="lottoForm" class="form-grid lotto-options">
              <label><span>추천 기준 날짜</span><input name="lottoDate" type="date" required></label>
              <label><span>추천 세트 수</span><select name="setCount"><option value="1">1세트</option><option value="3">3세트</option><option value="5" selected>5세트</option><option value="10">10세트</option></select></label>
              <label><span>번호 구성 방식</span><select name="style"><option value="mixed">균형형 · 저수/고수 혼합</option><option value="low">낮은 번호 중심</option><option value="high">높은 번호 중심</option><option value="free">완전 자동</option></select></label>
              <label><span>반드시 포함할 번호</span><input name="includeNumbers" inputmode="numeric" placeholder="예: 7, 21"><small class="lotto-help">1~45 중 쉼표로 구분, 최대 6개</small></label>
              <label class="span-2"><span>제외할 번호</span><input name="excludeNumbers" inputmode="numeric" placeholder="예: 4, 13, 28"><small class="lotto-help">원하지 않는 번호를 쉼표로 구분해 입력하세요.</small></label>
              <div class="form-actions span-2"><button class="button primary" type="submit">오늘 번호 만들기</button><button class="button ghost" id="lottoRemixBtn" type="button">다른 조합</button><button class="button text" type="reset">조건 초기화</button></div>
            </form>
          </section>

'''
result_marker = '          <section class="result-zone" id="resultZone" aria-live="polite">'
html = inject_before(html, result_marker, panel)

archive_marker = '<option value="tarot">타로</option>'
archive_addition = '<option value="lotto">오늘의 로또</option>'
html = inject_after(html, archive_marker, archive_addition)

script_link = '<script src="assets/js/lotto.js"></script>'
if script_link not in html:
    marker = '<script src="assets/js/tarot-cards.js"></script>'
    fallback = '<script src="assets/js/extended-services.js"></script>'
    target = marker if marker in html else fallback
    html = html.replace(target, target + "\n  " + script_link, 1)

index_path.write_text(html, encoding="utf-8")

app_path = Path("assets/js/app.js")
app = app_path.read_text(encoding="utf-8")
app = app.replace(
    "const typeLabels={naming:'작명·개명',analysis:'이름풀이',date:'택일',jibang:'제사지방',chukmun:'축문',compatibility:'궁합',tarot:'타로',face:'관상'};",
    "const typeLabels={naming:'작명·개명',analysis:'이름풀이',date:'택일',jibang:'제사지방',chukmun:'축문',compatibility:'궁합',tarot:'타로',face:'관상',lotto:'오늘의 로또'};"
)
app_path.write_text(app, encoding="utf-8")
