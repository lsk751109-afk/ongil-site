from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")

css_link = '<link rel="stylesheet" href="assets/css/face-ai.css">'
if css_link not in html:
    marker = '<link rel="stylesheet" href="assets/css/extended-services.css">'
    html = html.replace(marker, marker + "\n  " + css_link, 1)

html = html.replace(
    '<button class="service-card mobile-only-service" type="button" data-service="face"><span>08</span><i>相</i><h3>관상</h3><p>사진은 기기에만 두는 모바일 풀이</p><small class="service-badge">모바일 전용</small></button>',
    '<button class="service-card mobile-only-service" type="button" data-service="face"><span>08</span><i>相</i><h3>관상</h3><p>사진을 기기 안에서 AI 자동 판독</p><small class="service-badge">모바일 AI</small></button>'
)
html = html.replace(
    '<div class="panel-head"><div><small>MOBILE FACE READING</small><h3>모바일 관상 참고풀이</h3></div><span class="panel-badge">사진 미전송</span></div>',
    '<div class="panel-head"><div><small>ON-DEVICE AI FACE READING</small><h3>모바일 AI 관상 참고풀이</h3></div><span class="panel-badge">AI 자동 판독</span></div>'
)

old_camera = '''                <div class="face-preview" id="facePreview"></div>
                <p class="face-local-note"><b>개인정보 보호:</b> 사진은 현재 휴대폰 화면의 미리보기에만 사용하며 서버·저장함·백업 파일에 포함하지 않습니다.</p>'''
new_camera = '''                <div class="face-preview" id="facePreview"></div>
                <div class="face-ai-action">
                  <button class="button ghost" type="button" id="faceAiAnalyzeBtn">사진 AI 자동 판독</button>
                  <div class="face-ai-status" id="faceAiStatus" role="status" aria-live="polite">정면 사진을 촬영하면 AI가 자동 판독합니다.</div>
                </div>
                <div class="face-ai-summary" id="faceAiSummary"></div>
                <p class="face-ai-privacy"><strong>기기 내 처리:</strong> 얼굴 사진은 서버로 업로드하지 않습니다. 브라우저에서 얼굴 기준점과 비율만 측정하며 저장 결과에는 사진이 포함되지 않습니다.</p>'''
html = html.replace(old_camera, new_camera)

for title in ["얼굴형", "눈매", "눈썹", "코의 인상", "입매"]:
    html = html.replace(f'<label><span>{title}</span>', f'<label class="face-manual-field"><span>{title}</span>', 1)

html = html.replace('>모바일 관상 풀이</button>', '>AI 관상 결과 보기</button>', 1)

script_link = '<script src="assets/js/face-ai.js"></script>'
if script_link not in html:
    marker = '<script src="assets/js/extended-services.js"></script>'
    html = html.replace(marker, marker + "\n  " + script_link, 1)

index_path.write_text(html, encoding="utf-8")
