"""Prepares the CV's assets from the site's own source.

Two jobs, both so the CV cannot drift from the site:

  fonts  the three faces exist here only as woff2 under node_modules, and
         Typst reads TTF, so they are converted on demand rather than checked
         in a second time.
  icons  the GitHub and LinkedIn marks are lifted out of the same
         components the site renders, so there is one copy of each path.

Typst cannot recolour an image, so the fill is baked in here. Both colours are
chosen to hold up on the header band rather than to match the brand exactly:
GitHub's mark is black on white and would vanish, and LinkedIn's #0A66C2 sits
at about 2.9:1 against pine, which is muddy. These are the marks' own dark mode
colours.
"""

import re
import sys
from pathlib import Path

from fontTools.ttLib.woff2 import decompress

FACES = [
    "fraunces/files/fraunces-latin-full-normal",
    "fraunces/files/fraunces-latin-full-italic",
    "inter/files/inter-latin-wght-normal",
    "jetbrains-mono/files/jetbrains-mono-latin-wght-normal",
]

ICONS = {
    # component name: (viewBox, fill)
    "GithubIcon": ("0 0 16 16", "#e7dcc4"),
    "LinkedInIcon": ("0 0 24 24", "#70b5f9"),
    # Sits inside the rust pill, so it takes the pill's dark text colour.
    "ArrowUpRightIcon": ("0 0 20 20", "#141d17"),
}

# The site links out but never mails, so it has no envelope to borrow. This one
# is drawn here rather than added to icons.tsx, which would leave the site
# carrying an export nothing renders.
LOCAL_ICONS = {
    "mail": (
        "0 0 24 24",
        "#e7dcc4",
        "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6"
        "c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    ),
}

root = Path(sys.argv[1])

fonts = root / "scripts/resume/fonts"
fonts.mkdir(parents=True, exist_ok=True)
for face in FACES:
    source = root / "node_modules/@fontsource-variable" / f"{face}.woff2"
    target = fonts / f"{source.stem}.ttf"
    if not source.exists():
        raise SystemExit(f"missing {source}, run npm install first")
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
        decompress(str(source), str(target))
        print(f"  converted {source.name}")

icons = root / "scripts/resume/icons"
icons.mkdir(parents=True, exist_ok=True)
components = (root / "src/components/icons.tsx").read_text()
for name, (view_box, fill) in ICONS.items():
    block = re.search(rf"export const {name} =.*?\n\)\n", components, re.S)
    if not block:
        raise SystemExit(f"no {name} in src/components/icons.tsx")
    # `d` is not always the first attribute: the arrow puts fillRule ahead of it.
    path = re.search(r'<path\b[^>]*?\bd="([^"]+)"', block.group(0), re.S)
    if not path:
        raise SystemExit(f"no path data in {name}")
    target = icons / f"{name.replace('Icon', '').lower()}.svg"
    target.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" fill="{fill}">'
        f'<path d="{path.group(1)}"/></svg>\n'
    )
    print(f"  wrote {target.name}")

for name, (view_box, fill, path_data) in LOCAL_ICONS.items():
    target = icons / f"{name}.svg"
    target.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" fill="{fill}">'
        f'<path d="{path_data}"/></svg>\n'
    )
    print(f"  wrote {target.name}")
