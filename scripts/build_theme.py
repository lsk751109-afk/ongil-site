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


base_css = '<link rel="stylesheet" href="assets/css/styles.css">'
css_links = [
    '<link rel="stylesheet" href="assets/css/mystic-theme.css">',
    '<link rel="stylesheet" href="assets/css/extended-services.css">',
    '<link rel="stylesheet" href="assets/css/business-info.css">',
]
for css_link in css_links:
    if css_link not in html:
        html = html.replace(base_css, f"{base_css}\n  {css_link}", 1)

replacements = {
    "온길은 작명·개명·이름풀이·택일·제사지방·축문 작성을 한곳에서 돕는 생활문화 서비스입니다.": "온길은 작명·이름풀이·궁합·타로·택일·제례문서와 모바일 관상을 한곳에서 제공하는 생활문화 서비스입니다.",
    "작명·개명·이름풀이·택일·제사지방·축문 작성과 기록 보관": "작명·궁합·타로·택일·제례문서·모바일 관상과 기록 보관",
    "ONGIL · 이름과 예를 잇는 길": "ONGIL · 오늘의 길을 밝히는 빛",
    "결제 연동 준비 중": "온길 무료 이용",
    "현재 모든 작성 기능을 무료 체험으로 제공합니다. 결제정보는 수집하지 않습니다.": "현재 결제 기능을 제외한 모든 작성 기능을 무료로 이용할 수 있습니다.",
    "NAME · DATE · RITE": "TODAY · PATH · LIGHT",
    "소중한 이름과<br><em>마음을 바르게 잇는 길</em>": "오늘의 길을 비추는<br><em>당신만의 온길</em>",
    "작명과 이름풀이부터 좋은 날 선택, 제사지방과 축문 작성까지. 필요한 내용을 차분하게 입력하고 결과를 저장·인쇄할 수 있습니다.": "작명과 궁합부터 타로, 좋은 날 선택, 제례문서까지 한곳에서 살펴보세요. 모바일에서는 사진을 기기에만 두고 관상 참고풀이도 이용할 수 있습니다.",
    "무료로 작성하기": "나의 온길 시작하기",
    "서비스 살펴보기": "기능 살펴보기",
    "추천 결과 6개 제공": "결과 6개 제공",
    "PC·모바일 자동 저장": "브라우저 안전 저장",
    "인쇄용 문서 지원": "모바일·인쇄 지원",
    "오늘의 온길": "오늘의 길",
    "마음을 담아<br>한 걸음씩": "빛을 따라<br>한 걸음씩",
    "필요한 일을 한곳에서": "오늘 필요한 길을 선택하세요",
    "각 서비스는 독립적으로 작성할 수 있으며 결과는 저장함에서 다시 열 수 있습니다.": "작명·궁합·타로·택일·제례문서를 간결한 흐름으로 작성하고 저장함에서 다시 확인할 수 있습니다.",
}
for old, new in replacements.items():
    html = html.replace(old, new)

service_marker = '<button class="service-card" type="button" data-service="chukmun"><span>05</span><i>祝</i><h3>축문</h3><p>기제사·차례에 맞춘 문안 자동 작성</p></button>'
service_addition = '''
          <button class="service-card" type="button" data-service="compatibility"><span>06</span><i>緣</i><h3>궁합</h3><p>감정·생활·재물·속궁합 종합풀이</p><small class="service-badge">성인 속궁합</small></button>
          <button class="service-card" type="button" data-service="tarot"><span>07</span><i>星</i><h3>타로</h3><p>오늘·연애·재물·사업 흐름 카드</p></button>
          <button class="service-card mobile-only-service" type="button" data-service="face"><span>08</span><i>相</i><h3>관상</h3><p>사진은 기기에만 두는 모바일 풀이</p><small class="service-badge">모바일 전용</small></button>'''
html = inject_after(html, service_marker, service_addition)

tab_marker = '<button type="button" data-service="chukmun">축문</button>'
tab_addition = '<button type="button" data-service="compatibility">궁합</button><button type="button" data-service="tarot">타로</button><button class="mobile-only-tab" type="button" data-service="face">관상</button>'
html = inject_after(html, tab_marker, tab_addition)

panels = '''
          <section class="service-panel" id="panel-compatibility" data-panel="compatibility">
            <div class="panel-head"><div><small>RELATIONSHIP COMPATIBILITY</small><h3>궁합·속궁합 종합풀이</h3></div><span class="panel-badge">성인 전용 항목 포함</span></div>
            <form id="compatibilityForm" class="form-grid">
              <label><span>첫 번째 이름</span><input name="nameA" maxlength="8" placeholder="예: 김하늘" required></label>
              <label><span>첫 번째 생년월일</span><input name="birthA" type="date" required></label>
              <label><span>첫 번째 태어난 시각</span><input name="timeA" type="time"><small>모르면 비워둘 수 있습니다.</small></label>
              <label><span>두 번째 이름</span><input name="nameB" maxlength="8" placeholder="예: 이바다" required></label>
              <label><span>두 번째 생년월일</span><input name="birthB" type="date" required></label>
              <label><span>두 번째 태어난 시각</span><input name="timeB" type="time"><small>모르면 비워둘 수 있습니다.</small></label>
              <label><span>관계 유형</span><select name="relationship"><option>연인</option><option>부부</option><option>썸·소개</option><option>사업 동반자</option><option>친구</option><option>가족</option></select></label>
              <label><span>애정 표현 방식</span><select name="affection"><option>말과 대화</option><option>스킨십과 친밀감</option><option>행동과 배려</option><option>함께 보내는 시간</option><option>서로의 개인시간 존중</option></select></label>
              <label><span>친밀감의 속도</span><select name="pace"><option>천천히 신뢰를 쌓는 편</option><option>자연스럽고 균형 있게</option><option>감정을 적극적으로 표현하는 편</option><option>상황과 상대에 맞추는 편</option></select></label>
              <label class="span-2 checkbox-label"><input type="checkbox" name="adultConfirm" value="yes" required><span>속궁합 풀이를 위해 두 사람 모두 만 19세 이상 성인임을 확인합니다. 결과는 상호 동의와 소통을 대신하지 않습니다.</span></label>
              <div class="form-actions span-2"><button class="button primary" type="submit">궁합·속궁합 확인</button><button class="button text" type="reset">입력 초기화</button></div>
            </form>
          </section>

          <section class="service-panel" id="panel-tarot" data-panel="tarot">
            <div class="panel-head"><div><small>MYSTIC TAROT</small><h3>오늘의 타로</h3></div><span class="panel-badge">1장·3장 선택</span></div>
            <form id="tarotForm" class="form-grid">
              <label><span>분야</span><select name="topic"><option>오늘의 흐름</option><option>연애운</option><option>재물운</option><option>사업·직장운</option><option>관계의 흐름</option><option>선택과 결정</option></select></label>
              <label><span>카드 배열</span><select name="spread"><option value="one">카드 1장</option><option value="three">카드 3장</option></select></label>
              <label class="span-2"><span>궁금한 내용</span><textarea name="question" rows="3" maxlength="180" placeholder="예: 지금 준비 중인 일이 어떤 흐름으로 이어질까요?"></textarea></label>
              <div class="form-actions span-2"><button class="button primary" type="submit">카드 섞고 뽑기</button><button class="button text" type="reset">다시 준비</button></div>
            </form>
          </section>

          <section class="service-panel mobile-only-panel" id="panel-face" data-panel="face">
            <div class="panel-head"><div><small>MOBILE FACE READING</small><h3>모바일 관상 참고풀이</h3></div><span class="panel-badge">사진 미전송</span></div>
            <form id="faceForm" class="form-grid">
              <div class="face-camera-box span-2">
                <label><span>정면 사진 촬영·선택</span><input id="facePhoto" name="facePhoto" type="file" accept="image/*" capture="user"></label>
                <div class="face-preview" id="facePreview"></div>
                <p class="face-local-note"><b>개인정보 보호:</b> 사진은 현재 휴대폰 화면의 미리보기에만 사용하며 서버·저장함·백업 파일에 포함하지 않습니다.</p>
              </div>
              <label><span>별칭</span><input name="nickname" maxlength="10" placeholder="예: 나의 인상"></label>
              <label><span>얼굴형</span><select name="faceShape"><option value="oval">타원형·균형형</option><option value="round">둥근형</option><option value="long">긴형</option><option value="square">각진형</option><option value="heart">하트형·역삼각형</option></select></label>
              <label><span>눈매</span><select name="eyes"><option value="soft">부드러운 눈매</option><option value="clear">또렷한 눈매</option><option value="up">올라간 눈매</option><option value="down">내려간 눈매</option></select></label>
              <label><span>눈썹</span><select name="brows"><option value="straight">일자형</option><option value="arched">아치형</option><option value="thick">짙고 굵은형</option><option value="soft">부드럽고 옅은형</option></select></label>
              <label><span>코의 인상</span><select name="nose"><option value="balanced">균형형</option><option value="high">높고 곧은형</option><option value="round">둥글고 넓은형</option><option value="small">작고 섬세한형</option></select></label>
              <label><span>입매</span><select name="mouth"><option value="balanced">균형 잡힌 입매</option><option value="full">도톰한 입술</option><option value="thin">얇고 단정한 입술</option><option value="up">입꼬리가 올라간형</option></select></label>
              <div class="form-actions span-2"><button class="button primary" type="submit">모바일 관상 풀이</button><button class="button text" type="reset">다시 촬영</button></div>
            </form>
          </section>

'''
result_marker = '          <section class="result-zone" id="resultZone" aria-live="polite">'
html = inject_before(html, result_marker, panels)

archive_marker = '<option value="chukmun">축문</option>'
archive_addition = '<option value="compatibility">궁합</option><option value="tarot">타로</option><option value="face">관상</option>'
html = inject_after(html, archive_marker, archive_addition)

old_business = '<div><b>사업자 정보</b><span>상호: 마켓하우스</span><span>대표전화: 031-868-2436</span><span>사업자번호·주소는 결제 재개 전 최종 반영</span></div>'
new_business = '<div><b>사업자 정보</b><span>상호: 마켓하우스</span><span>대표전화: 031-868-2436</span><span>사업장 주소: 인천광역시 옹진군 영흥면 선재로265번길 35, 나동 117호</span><span>통신판매업 신고번호: 제2023-인천옹진-0040호</span></div>'
html = html.replace(old_business, new_business)

extended_script = '<script src="assets/js/extended-services.js"></script>'
if extended_script not in html:
    html = html.replace('<script src="assets/js/app.js"></script>', '<script src="assets/js/app.js"></script>\n  ' + extended_script, 1)

index_path.write_text(html, encoding="utf-8")

app_path = Path("assets/js/app.js")
app = app_path.read_text(encoding="utf-8")
app = app.replace(
    "const typeLabels={naming:'작명·개명',analysis:'이름풀이',date:'택일',jibang:'제사지방',chukmun:'축문'};",
    "const typeLabels={naming:'작명·개명',analysis:'이름풀이',date:'택일',jibang:'제사지방',chukmun:'축문',compatibility:'궁합',tarot:'타로',face:'관상'};"
)
api_export = "window.ONGIL={resultShell,saveCurrent,renderArchive,toast,serviceSwitch,esc,formObject};\nrenderArchive();\n})();"
if "window.ONGIL=" not in app:
    app = app.replace("renderArchive();\n})();", api_export)
app_path.write_text(app, encoding="utf-8")
