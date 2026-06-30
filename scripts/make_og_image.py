"""Generate a 1200x630 Open Graph social-preview image for Giacomo's portfolio.
Dark cosmic theme matching the site, portrait on the left, text on the right.
Output: /app/frontend/public/og-image.png
"""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

W, H = 1200, 630
img = Image.new("RGB", (W, H), (6, 6, 8))
draw = ImageDraw.Draw(img)

# --- Background: vertical dark gradient + bottom blue "atmosphere" glow ---
top = (8, 9, 14)
bottom = (4, 4, 6)
for y in range(H):
    t = y / H
    r = int(top[0] + (bottom[0] - top[0]) * t)
    g = int(top[1] + (bottom[1] - top[1]) * t)
    b = int(top[2] + (bottom[2] - top[2]) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Atmosphere glow at the bottom-center (blue), drawn on a separate layer + blur
glow = Image.new("RGB", (W, H), (0, 0, 0))
gd = ImageDraw.Draw(glow)
cx, cy = W // 2, H + 120
max_r = 700
for rr in range(max_r, 0, -6):
    a = (rr / max_r)
    col = (int(40 * (1 - a) + 12), int(80 * (1 - a) + 18), int(150 * (1 - a) + 30))
    gd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=col)
glow = glow.filter(ImageFilter.GaussianBlur(60))
img = Image.blend(img, ImageMip := Image.composite(glow, img, Image.new("L", (W, H), 90)), 0.0)
# simpler: screen-add the glow
base = img.copy()
img = ImageOps.colorize(Image.new("L", (W, H), 0), (0, 0, 0), (0, 0, 0))  # placeholder
img = base
# additive blend of glow
import numpy as np
arr = np.asarray(base).astype(np.int16)
garr = np.asarray(glow).astype(np.int16)
out = np.clip(arr + (garr * 0.55).astype(np.int16), 0, 255).astype(np.uint8)
img = Image.fromarray(out, "RGB")
draw = ImageDraw.Draw(img)

# Scatter a few faint stars
import random
random.seed(7)
for _ in range(70):
    x = random.randint(0, W)
    y = random.randint(0, int(H * 0.7))
    s = random.choice([1, 1, 1, 2])
    op = random.randint(60, 170)
    draw.ellipse([x, y, x + s, y + s], fill=(op, op, op))

# --- Portrait on the left ---
try:
    photo = Image.open("/app/frontend/public/assets/giacomo.jpeg").convert("RGB")
    pw, ph = 380, 470
    photo = ImageOps.fit(photo, (pw, ph), Image.LANCZOS)
    # rounded corners
    radius = 36
    mask = Image.new("L", (pw, ph), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, pw, ph], radius=radius, fill=255)
    px, py = 96, (H - ph) // 2
    # subtle aurora ring behind photo
    ring = Image.new("RGB", (W, H), (0, 0, 0))
    rd = ImageDraw.Draw(ring)
    rd.rounded_rectangle([px - 14, py - 14, px + pw + 14, py + ph + 14], radius=radius + 10,
                         fill=(70, 90, 200))
    ring = ring.filter(ImageFilter.GaussianBlur(40))
    rarr = np.asarray(ring).astype(np.int16)
    iarr = np.asarray(img).astype(np.int16)
    out2 = np.clip(iarr + (rarr * 0.5).astype(np.int16), 0, 255).astype(np.uint8)
    img = Image.fromarray(out2, "RGB")
    img.paste(photo, (px, py), mask)
    draw = ImageDraw.Draw(img)
    # thin border
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=radius, outline=(255, 255, 255), width=2)
except Exception as e:
    print("photo err", e)

# --- Text on the right ---
def font(path, size):
    return ImageFont.truetype(path, size)

F = "/usr/share/fonts/truetype/liberation/"
f_name = font(F + "LiberationSans-Bold.ttf", 60)
f_role = font(F + "LiberationSerif-Italic.ttf", 44)
f_body = font(F + "LiberationSans-Regular.ttf", 28)
f_small = font(F + "LiberationSans-Regular.ttf", 24)

tx = 560
# badge
draw.rounded_rectangle([tx, 150, tx + 168, 192], radius=21, outline=(255, 255, 255), width=1)
draw.text((tx + 20, 159), "AI ENGINEER", font=f_small, fill=(220, 225, 240))

draw.text((tx, 215), "Giacomo", font=f_name, fill=(255, 255, 255))
draw.text((tx, 282), "Reggianini", font=f_name, fill=(255, 255, 255))
draw.text((tx, 360), "crafting intelligent solutions", font=f_role, fill=(150, 180, 255))

# divider
draw.line([(tx, 425), (tx + 380, 425)], fill=(80, 90, 120), width=1)

draw.text((tx, 448), "RAG Systems  ·  Computer Vision  ·  Enterprise AI", font=f_body, fill=(190, 198, 215))
draw.text((tx, 492), "Modena, Italy  ·  Master AI @ UNIMORE", font=f_body, fill=(150, 158, 180))

img.save("/app/frontend/public/og-image.png", "PNG", optimize=True)
# Also produce a jpg fallback (smaller)
img.convert("RGB").save("/app/frontend/public/og-image.jpg", "JPEG", quality=86, optimize=True)
print("Saved og-image.png and og-image.jpg")
