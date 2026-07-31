from pathlib import Path
import re

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")


def add_after(marker: str, addition: str) -> None:
    global html
    if addition.strip() not in html and marker in html:
        html = html.replace(marker, marker + "\n  " + addition, 1)


add_after('<link rel="stylesheet" href="assets/css/lotto.css">', '<link rel="stylesheet" href="assets/css/daily-fortune.css">')
add_after('<link rel="stylesheet" href="assets/css/daily-fortune.css">', '<link rel="stylesheet" href="assets/css/tojeong.css">')

# Rebuild service-card order after all prior service injectors have run.
service_match = re.search(r'(<div class="service-grid">)(.*?)(\s*</div>)', html, re.S)
if service_match:
    cards = re.findall(r'<button class="service-card[^>]*data-service="([^"]+)".*?</button>', service_match.group(2), re.S)
    card_markup = {
        key: re.search(rf'<button class="service-card[^>]*data-service="{re.escape(key)}".*?</button>', service_match.group(2), re.S).group(0)
        for key in cards
    }
    card_markup['daily'] = '<button class="service-card" type="button" data-service="daily"><span>01</span><i>☾</i><h3>오늘의 운세</h3><p>오늘의 총운·재물·일·애정·건강</p><small class="service-badge">무료</small></button>'
    card_markup['lotto'] = re.sub(r'<small class="service-badge">.*?</small>', '<small class="service-badge">무료</small>', card_markup.get('lotto', '<button class="service-card" type="button" data-service="lotto"><span>02</span><i>福</i><h3>오늘의 로또</h3><p>날짜 기반 6/45 추천 조합</p><small class="service-badge">무료</small></button>'))
    card_markup['tojeong'] = '<button class="service-card" type="button" data-service="tojeong"><span>03</span><i>運</i><h3>띠별 토정비결</h3><p>총운과 1월~12월 월별 흐름</p></button>'
    order = ['daily','lotto','tojeong','tarot','naming','analysis','date','compatibility','jibang','chukmun','face']
    rebuilt = '\n          ' + '\n          '.join(card_markup[key] for key in order if key in card_markup) + '\n        '
    html = html[:service_match.start(2)] + rebuilt + html[service_match.end(2):]

# Rebuild tab order.
tabs_match = re.search(r'(<div class="workspace-tabs"[^>]*>)(.*?)(\s*</div>)', html, re.S)
if tabs_match:
    buttons = re.findall(r'<button[^>]*data-service="([^"]+)".*?</button>', tabs_match.group(2), re.S)
    tab_markup = {
        key: re.search(rf'<button[^>]*data-service="{re.escape(key)}".*?</button>', tabs_match.group(2), re.S).group(0)
        for key in buttons
    }
    tab_markup['daily'] = '<button type="button" data-service="daily">오늘의 운세 <b class="daily-free-badge">무료</b></button>'
    tab_markup['lotto'] = '<button type="button" data-service="lotto">오늘의 로또 <b class="daily-free-badge">무료</b></button>'
    tab_markup['tojeong'] = '<button type="button" data-service="tojeong">띠별 토정비결</button>'
    order = ['daily','lotto','tojeong','tarot','naming','analysis','date','compatibility','jibang','chukmun','face']
    rebuilt = '\n            ' + ''.join(tab_markup[key] for key in order if key in tab_markup) + '\n          '
    html = html[:tabs_match.start(2)] + rebuilt + html[tabs_match.end(2):]

panels = '''
          <section class="service-panel" id="panel-daily" data-panel="daily">
            <div class="panel-head"><div><small>FREE DAILY FORTUNE</small><h3>오늘의 운세</h3></div><span class="daily-free-badge">항상 무료</span></div>
            <div class="daily-intro"><div><strong>오늘 하루의 흐름을 간단히 살펴보세요.</strong><p>총운·재물운·사업·애정·건강과 행운 시간, 색상, 번호를 한 화면에 정리합니다.</p></div><span class="daily-date-chip" id="dailyDateChip">오늘 날짜</span></div>
            <form id="dailyFortuneForm" class="form-grid">
              <label><span>별칭</span><input name="nickname" maxlength="10" placeholder="예: 온길님"></label>
              <label><span>생년월일</span><input name="birthDate" type="date" required></label>
              <label><span>성별</span><select name="gender"><option value="미입력">선택 안 함</option><option value="남">남</option><option value="여">여</option></select></label>
              <label><span>오늘의 관심 분야</span><select name="focus"><option>전체 흐름</option><option>재물과 소비</option><option>사업과 직장</option><option>애정과 인연</option><option>건강과 생활</option></select></label>
              <div class="form-actions span-2"><button class="button primary" type="submit">오늘의 운세 무료 보기</button><button class="button text" type="reset">입력 초기화</button></div>
            </form>
          </section>

          <section class="service-panel" id="panel-tojeong" data-panel="tojeong">
            <div class="panel-head"><div><small>ZODIAC YEARLY FORTUNE</small><h3>띠별 토정비결</h3></div><span class="panel-badge">1월~12월 월별 풀이</span></div>
            <div class="tojeong-intro"><div><strong>띠와 생년월일을 기준으로 한 해를 월별로 정리합니다.</strong><p>총운·재물·사업·애정·건강의 흐름과 좋은 달, 주의할 달을 함께 확인하세요.</p></div><div class="tojeong-zodiac-preview" id="tojeongZodiacPreview"><span>十二</span><small>띠 자동 계산</small></div></div>
            <form id="tojeongForm" class="form-grid">
              <label><span>별칭</span><input name="nickname" maxlength="10" placeholder="예: 온길님"></label>
              <label><span>생년월일</span><input name="birthDate" type="date" required></label>
              <label><span>태어난 시각</span><input name="birthTime" type="time"><small>모르면 비워둘 수 있습니다.</small></label>
              <label><span>성별</span><select name="gender"><option value="미입력">선택 안 함</option><option value="남">남</option><option value="여">여</option></select></label>
              <label><span>보고 싶은 해</span><select name="targetYear" required></select></label>
              <label><span>중점 분야</span><select name="focus"><option>전체 운세</option><option>재물운</option><option>사업·직장운</option><option>애정·인연운</option><option>건강운</option><option>가족운</option></select></label>
              <p class="tojeong-form-note span-2">음력 설 또는 입춘 이전 출생자는 실제 띠가 다를 수 있으므로 결과에서 안내를 확인하세요.</p>
              <div class="form-actions span-2"><button class="button primary" type="submit">월별 토정비결 보기</button><button class="button text" type="reset">입력 초기화</button></div>
            </form>
          </section>

'''
marker = '          <section class="service-panel active" id="panel-naming" data-panel="naming">'
if 'id="panel-daily"' not in html and marker in html:
    html = html.replace(marker, panels + marker, 1)

# Archive filter entries.
archive_marker = '<option value="all">전체 종류</option>'
archive_addition = '<option value="daily">오늘의 운세</option><option value="lotto">오늘의 로또</option><option value="tojeong">띠별 토정비결</option>'
if archive_addition not in html:
    html = html.replace(archive_marker, archive_marker + archive_addition, 1)

# Scripts.
script_marker = '<script src="assets/js/lotto.js"></script>'
script_addition = '<script src="assets/js/daily-fortune.js"></script>\n  <script src="assets/js/tojeong.js"></script>'
if script_addition not in html and script_marker in html:
    html = html.replace(script_marker, script_marker + '\n  ' + script_addition, 1)

index_path.write_text(html, encoding="utf-8")

# Extend result type labels.
app_path = Path("assets/js/app.js")
app = app_path.read_text(encoding="utf-8")
match = re.search(r'const typeLabels=\{([^}]*)\};', app)
if match:
    body = match.group(1)
    additions = []
    if "daily:'오늘의 운세'" not in body:
        additions.append("daily:'오늘의 운세'")
    if "lotto:'오늘의 로또'" not in body:
        additions.append("lotto:'오늘의 로또'")
    if "tojeong:'띠별 토정비결'" not in body:
        additions.append("tojeong:'띠별 토정비결'")
    if additions:
        new_body = body.rstrip(',') + ',' + ','.join(additions)
        app = app[:match.start()] + f'const typeLabels={{{new_body}}};' + app[match.end():]
app_path.write_text(app, encoding="utf-8")
