from pathlib import Path

index_path = Path("index.html")
html = index_path.read_text(encoding="utf-8")

css_link = '<link rel="stylesheet" href="assets/css/tarot-cards.css">'
if css_link not in html:
    marker = '<link rel="stylesheet" href="assets/css/extended-services.css">'
    if marker in html:
        html = html.replace(marker, marker + "\n  " + css_link, 1)
    else:
        fallback = '<link rel="stylesheet" href="assets/css/styles.css">'
        html = html.replace(fallback, fallback + "\n  " + css_link, 1)

script_link = '<script src="assets/js/tarot-cards.js"></script>'
if script_link not in html:
    marker = '<script src="assets/js/extended-services.js"></script>'
    if marker in html:
        html = html.replace(marker, marker + "\n  " + script_link, 1)
    else:
        fallback = '<script src="assets/js/app.js"></script>'
        html = html.replace(fallback, fallback + "\n  " + script_link, 1)

index_path.write_text(html, encoding="utf-8")
