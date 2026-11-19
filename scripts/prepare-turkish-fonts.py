"""Build tiny Turkish extensions from the existing licensed local WOFF2 fonts.
Install the optional build dependency with pip install -r scripts/font-requirements.txt.
Original fonts, variation axes, and licensing metadata are retained.
"""
import json
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]
codepoints=[0x11E,0x11F,0x130,0x15E,0x15F]
report=[]
for name in ['manrope','cormorant-garamond','cormorant-garamond-italic']:
    family=name.removesuffix('-italic');style='-italic' if name.endswith('-italic') else ''
    source=root/f'public/fonts/{family}-latin-ext{style}.woff2'
    target=root/f'public/fonts/{family}-turkish{style}.woff2'
    font=TTFont(source);options=subset.Options();options.flavor='woff2'
    options.name_IDs=['*'];options.name_languages=['*']
    builder=subset.Subsetter(options=options);builder.populate(unicodes=codepoints);builder.subset(font)
    assert all(c in font.getBestCmap() for c in codepoints)
    font.save(target)
    report.append({'source':source.name,'output':target.name,'sourceBytes':source.stat().st_size,'bytes':target.stat().st_size,'codepoints':[hex(c) for c in codepoints]})
(root/'reports/turkish-font-manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
