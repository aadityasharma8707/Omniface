import os
import glob

png_magic = b'\x89PNG\r\n\x1a\n'
iend = b'IEND\xaeB`\x82'

found = []
for p in glob.glob('.next/cache/**/*', recursive=True):
    if os.path.isfile(p):
        try:
            with open(p, 'rb') as f:
                data = f.read()
            start = 0
            while True:
                idx = data.find(png_magic, start)
                if idx == -1:
                    break
                end_idx = data.find(iend, idx)
                if end_idx != -1:
                    png_bytes = data[idx:end_idx + len(iend)]
                    found.append((p, idx, len(png_bytes), png_bytes))
                    print(f"Found PNG in {p} size {len(png_bytes)}")
                start = idx + 1
        except Exception as e:
            pass

for i, (p, idx, l, b) in enumerate(found):
    with open(f"/tmp/recovered_{i}_{l}.png", "wb") as out:
        out.write(b)
