"""Check site/ for broken local links and translation keys that drifted.

    python tools/check_site.py

Every local href, src, poster, srcset and CSS url() under site/ is resolved
the way the server resolves it (deploy/Caddyfile: /foo serves foo.html, a
folder serves its index.html), and a #fragment has to exist as an id on the
page it points at. Links written as https://www.jhorro.com/... are checked
too, which covers canonical tags, Open Graph images and sitemap.xml.

The en/pt/ja dictionaries in i18n-data.js have to carry the same keys, and
every data-i18n key in the portfolio markup has to exist. Exits 1 on a miss.
"""
import io
import posixpath
import re
import sys
import urllib.parse
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
ORIGIN = "https://www.jhorro.com"

# Linked on purpose before the file exists. Reported, but not a failure.
PENDING = {
    "/jhonnatan/docs/GDD_IdleCyberpunkCityClicker_JhonnatanBarbosa.pdf",
    "/jhonnatan/docs/GDD_IdleKingdomBuilder_JhonnatanBarbosa.pdf",
}

ATTR = re.compile(r"""\b(?:href|src|poster)\s*=\s*["']([^"']*)["']""")
SRCSET = re.compile(r"""\bsrcset\s*=\s*["']([^"']*)["']""")
CSS_URL = re.compile(r"""url\(\s*["']?([^"')]+)["']?\s*\)""")
LOC = re.compile(r"<loc>([^<]+)</loc>")
ID = re.compile(r"""\b(?:id|name)\s*=\s*["']([^"']+)["']""")

problems = []
pending = set()
texts = {}


def read(path):
    if path not in texts:
        texts[path] = path.read_text(encoding="utf-8")
    return texts[path]


def resolve(url_path):
    """Map a URL path to the file the server would send, or None."""
    target = SITE / url_path.lstrip("/")
    if url_path.endswith("/") or target.is_dir():
        target = target / "index.html"
        return target if target.is_file() else None
    if target.is_file():
        return target
    target = target.with_name(target.name + ".html")
    return target if target.is_file() else None


def check(page, ref):
    ref = ref.strip()
    if ref.startswith(ORIGIN):
        ref = ref[len(ORIGIN):] or "/"
    if not ref or ref.startswith("//") or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", ref):
        return
    path, _, fragment = ref.partition("#")
    path = urllib.parse.unquote(path.partition("?")[0])
    here = "/" + page.relative_to(SITE).as_posix()
    if not path:
        target = page
    else:
        joined = posixpath.normpath(posixpath.join(posixpath.dirname(here), path))
        if path.endswith("/") and joined != "/":
            joined += "/"
        target = resolve(joined)
        if target is None:
            if joined in PENDING:
                pending.add(joined)
            else:
                problems.append("%s: nothing at %s" % (here, ref))
            return
    if fragment and target.suffix == ".html" and fragment not in ID.findall(read(target)):
        problems.append("%s: no #%s on %s" % (here, fragment, "/" + target.relative_to(SITE).as_posix()))


count = 0
for page in sorted(SITE.rglob("*")):
    if page.suffix not in (".html", ".css", ".xml"):
        continue
    text = read(page)
    refs = []
    if page.suffix == ".html":
        refs += ATTR.findall(text)
        for srcset in SRCSET.findall(text):
            refs += [part.split()[0] for part in srcset.split(",") if part.strip()]
    if page.suffix in (".html", ".css"):
        # "#g" and "%23g" point at a gradient or filter inside an inline SVG.
        refs += [u for u in CSS_URL.findall(text) if not u.startswith(("data:", "#", "%23"))]
    if page.suffix == ".xml":
        refs += LOC.findall(text)
    for ref in refs:
        check(page, ref)
    count += len(refs)

# ── i18n ────────────────────────────────────────────────────
keys, lang = {}, None
for line in read(SITE / "jhonnatan" / "i18n-data.js").splitlines():
    start = re.match(r"([a-z]{2}): \{\s*$", line)
    if start:
        lang = start.group(1)
        keys[lang] = set()
    elif lang:
        key = re.match(r"\s{2}([A-Za-z0-9_]+):\s", line)
        if key:
            keys[lang].add(key.group(1))

for lang in keys:
    for missing in sorted(keys["en"] - keys[lang]):
        problems.append("i18n: %s has no %s" % (lang, missing))
    for extra in sorted(keys[lang] - keys["en"]):
        problems.append("i18n: %s has %s, en does not" % (lang, extra))

used = set(re.findall(r'data-i18n(?:-html|-aria)?="([^"]+)"', read(SITE / "jhonnatan" / "index.html")))
for missing in sorted(used - keys["en"]):
    problems.append("i18n: markup uses %s, dictionary has no such key" % missing)

for path in sorted(pending):
    print("pending, not uploaded yet: %s" % path)
for path in sorted(PENDING - pending):
    print("no longer pending, remove from PENDING: %s" % path)
for line in problems:
    print(line)
print("%d references checked, %s keys per language, %d problem%s" % (
    count, "/".join(str(len(keys[k])) for k in keys), len(problems), "" if len(problems) == 1 else "s"))
sys.exit(1 if problems else 0)
