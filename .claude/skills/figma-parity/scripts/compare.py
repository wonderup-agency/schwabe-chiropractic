"""Hojas lado a lado Figma | prod, una por section.
Uso: python3 compare.py fig.png prod.png pairs.json outdir
pairs.json = [["1hero", figY0, figY1, prodY0, prodY1], ...]  (px a escala 1)
Los rangos salen de get_metadata del frame (Figma) y del mapa que imprime shot.js (prod).
"""
import json, os, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
fig, prod, pairs, out = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
f = Image.open(fig).convert('RGB'); p = Image.open(prod).convert('RGB')
for n, a, b, c, d in json.load(open(pairs)):
    A = f.crop((0, a, f.size[0], b)); B = p.crop((0, c, p.size[0], min(d, p.size[1])))
    h = max(A.size[1], B.size[1]); im = Image.new('RGB', (A.size[0] + B.size[0] + 20, h), 'white')
    im.paste(A, (0, 0)); im.paste(B, (A.size[0] + 20, 0))
    im.resize((im.size[0] // 2, h // 2)).save(os.path.join(out, n + '.png'))
print('ok')
