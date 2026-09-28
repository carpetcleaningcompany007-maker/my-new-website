"""Run with Python to guard restored pages and internal navigation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.thecarpetcleaningcrew.co.uk/'


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []
        self.redirect = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' or (tag == 'link' and attrs.get('rel') == 'stylesheet'):
            self.targets.append(attrs.get('href', ''))
        if tag == 'script':
            self.targets.append(attrs.get('src', ''))
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            self.redirect = True


errors = []
pages = list(ROOT.rglob('*.html'))
for page in pages:
    relative = page.relative_to(ROOT).as_posix()
    parser = Links()
    parser.feed(page.read_text(encoding='utf-8'))
    # Ludlow's existing alias forwards to its real local page, not the homepage.
    if relative.startswith('pages/') and relative != 'pages/local/ludlow.html' and parser.redirect:
        errors.append(f'{relative}: genuine page contains a redirect')
    for target in parser.targets:
        url = urlparse(urljoin(ORIGIN + relative, target))
        if url.netloc != urlparse(ORIGIN).netloc or url.scheme not in ('http', 'https'):
            continue
        resolved = ROOT / unquote(url.path).lstrip('/')
        if not resolved.exists():
            errors.append(f'{relative}: missing target {target}')

for file in ('assets/app.js', 'assets/location-landing.js'):
    source = (ROOT / file).read_text(encoding='utf-8')
    if 'location.replace' in source or 'setAttribute(\"href\"' in source or "setAttribute('href'" in source:
        errors.append(f'{file}: shared script rewrites navigation')

areas = (ROOT / 'pages/service-areas.html').read_text(encoding='utf-8')
if 'href="local/shrewsbury-carpet-cleaning.html"' in areas or '/pages/landing-shrewsbury.html' not in areas:
    errors.append('Areas must link to the current Shrewsbury page')

assert not errors, '\n'.join(errors)
print(f'PASS: {len(pages)} HTML files; internal links, scripts and styles exist; genuine pages stay accessible.')
