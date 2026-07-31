from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")

base_css = '<link rel="stylesheet" href="assets/css/styles.css">'
theme_css = '<link rel="stylesheet" href="assets/css/mystic-theme.css">'
if theme_css not in html:
    html = html.replace(base_css, f"{base_css}\n  {theme_css}")

replacements = {
    "ONGIL · 이름과 예를 잇는 길": "ONGIL · 오늘의 길을 밝히는 빛",
    "결제 연동 준비 중": "온길 무료 이용",
    "현재 모든 작성 기능을 무료 체험으로 제공합니다. 결제정보는 수집하지 않습니다.": "현재 결제 기능을 제외한 모든 작성 기능을 무료로 이용할 수 있습니다.",
    "NAME · DATE · RITE": "TODAY · PATH · LIGHT",
    "소중한 이름과<br><em>마음을 바르게 잇는 길</em>": "오늘의 길을 비추는<br><em>당신만의 온길</em>",
    "작명과 이름풀이부터 좋은 날 선택, 제사지방과 축문 작성까지. 필요한 내용을 차분하게 입력하고 결과를 저장·인쇄할 수 있습니다.": "이름과 삶의 흐름을 차분히 살피고, 필요한 문서를 한곳에서 작성하세요. 신비롭지만 복잡하지 않은 방식으로 오늘의 선택을 돕습니다.",
    "무료로 작성하기": "나의 온길 시작하기",
    "서비스 살펴보기": "기능 살펴보기",
    "추천 결과 6개 제공": "결과 6개 제공",
    "PC·모바일 자동 저장": "브라우저 안전 저장",
    "인쇄용 문서 지원": "모바일·인쇄 지원",
    "오늘의 온길": "오늘의 길",
    "마음을 담아<br>한 걸음씩": "빛을 따라<br>한 걸음씩",
    "필요한 일을 한곳에서": "오늘 필요한 길을 선택하세요",
    "각 서비스는 독립적으로 작성할 수 있으며 결과는 저장함에서 다시 열 수 있습니다.": "작명·이름풀이·택일·제례 문서를 간결한 흐름으로 작성하고 저장함에서 다시 확인할 수 있습니다.",
}

for old, new in replacements.items():
    html = html.replace(old, new)

index_path.write_text(html, encoding="utf-8")
