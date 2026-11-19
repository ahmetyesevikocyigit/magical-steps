"""Partition local Latin fonts without dropping glyph coverage or changing weights.

The common Latin/Turkish alphabet loads first. Additional Latin glyphs retain a
separate unicode-range subset, requested only by pages that actually use them.
Original licensed WOFF2 files remain untouched.
"""
import json
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
common = set(range(0x20, 0x7f)) | set(map(ord, " ©®°·ÇçÖöÜüâîûı–—‘’‚“”„…€£™"))
report, rules = [], []
for family, style, weight in [("manrope", "", "200 800"), ("cormorant-garamond", "", "300 700"), ("cormorant-garamond", "-italic", "300 700")]:
    source = root / f"public/fonts/{family}-latin{style}.woff2"
    original = set(TTFont(source).getBestCmap())
    coverage = set()
    for suffix, chars in [("core", original & common), ("additional", original - common)]:
        font = TTFont(source)
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["kern", "liga", "clig", "calt", "locl"]
        options.name_IDs = ["*"]
        options.name_languages = ["*"]
        builder = subset.Subsetter(options=options)
        builder.populate(unicodes=chars)
        builder.subset(font)
        assert set(font.getBestCmap()) == chars
        coverage |= chars
        target = root / f"public/fonts/{family}-{suffix}{style}.woff2"
        font.save(target)
        name = "Manrope" if family == "manrope" else "Cormorant Garamond"
        unicode_range = ",".join(f"U+{code:04X}" for code in sorted(chars))
        rules.append(f'@font-face {{\n  font-family: "{name}";\n  font-style: {"italic" if style else "normal"};\n  font-weight: {weight};\n  font-display: swap;\n  src: url("/fonts/{target.name}") format("woff2");\n  unicode-range: {unicode_range};\n}}')
        report.append({"source": source.name, "output": target.name, "sourceBytes": source.stat().st_size, "bytes": target.stat().st_size, "glyphCodepoints": len(chars)})
    assert coverage == original
css = root / "src/app/globals.css"
marker = "/* Generated Latin font partitions. */"
base = css.read_text().split(marker)[0].rstrip()
css.write_text(base + "\n\n" + marker + "\n" + "\n".join(rules) + "\n")
(root / "reports/core-font-manifest.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
