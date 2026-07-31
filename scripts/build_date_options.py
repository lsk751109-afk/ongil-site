from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")

old = '<option>결혼</option><option>이사</option><option>개업</option><option>계약</option><option>행사</option><option>제사</option>'
new = '<option>결혼</option><option>이사</option><option>개업</option><option>계약</option><option>행사</option>'

if old in html:
    html = html.replace(old, new, 1)

index_path.write_text(html, encoding="utf-8")
