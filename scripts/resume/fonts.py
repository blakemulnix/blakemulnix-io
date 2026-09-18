"""Converts the site's webfonts to TTF, which is what Typst can read.

The CV is set in the same three faces as the site, and they only exist here as
woff2 under node_modules. Converting on demand keeps one copy of each font in
the repo rather than two, and guarantees the CV is set in the same files the
browser serves.
"""

import sys
from pathlib import Path

from fontTools.ttLib.woff2 import decompress

FACES = [
    "fraunces/files/fraunces-latin-full-normal",
    "fraunces/files/fraunces-latin-full-italic",
    "inter/files/inter-latin-wght-normal",
    "jetbrains-mono/files/jetbrains-mono-latin-wght-normal",
]

root = Path(sys.argv[1])
out = root / "scripts/resume/fonts"
out.mkdir(parents=True, exist_ok=True)

for face in FACES:
    source = root / "node_modules/@fontsource-variable" / f"{face}.woff2"
    target = out / f"{source.stem}.ttf"
    if not source.exists():
        raise SystemExit(f"missing {source}, run npm install first")
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
        decompress(str(source), str(target))
        print(f"  converted {source.name}")
