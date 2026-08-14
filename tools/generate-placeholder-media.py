"""Generate neutral editorial placeholder imagery for the Maison Atelier showroom.

These are intentionally minimal, tonal garment studies in the brand palette so the
layout can be reviewed with real image weight before production photography lands.
"""
import json
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "media")
os.makedirs(OUT, exist_ok=True)
random.seed(7)

SS = 3  # supersample factor

PALETTE = {
    "black": (16, 16, 16),
    "ink": (26, 26, 24),
    "charcoal": (47, 47, 44),
    "slate": (74, 82, 89),
    "stone": (140, 136, 126),
    "sand": (200, 183, 154),
    "camel": (176, 141, 95),
    "cream": (237, 230, 216),
    "ecru": (222, 213, 196),
    "ivory": (243, 239, 231),
    "olive": (90, 95, 74),
    "indigo": (44, 51, 72),
    "clay": (160, 100, 75),
    "bone": (229, 222, 209),
}

BACKDROPS = [
    ((247, 244, 239), (232, 226, 216)),
    ((243, 239, 231), (226, 219, 207)),
    ((238, 233, 224), (220, 212, 199)),
    ((245, 241, 234), (229, 221, 209)),
]


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def backdrop(w, h, pair, light=(0.5, 0.38), spread=0.85):
    """Vertical gradient + soft light pool + vignette."""
    top, bottom = pair
    ys = np.linspace(0, 1, h)[:, None]
    base = np.zeros((h, w, 3), dtype=np.float64)
    for c in range(3):
        base[:, :, c] = top[c] + (bottom[c] - top[c]) * (ys ** 1.15)

    xx, yy = np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))
    d = np.sqrt(((xx - light[0]) / spread) ** 2 + ((yy - light[1]) / (spread * 1.1)) ** 2)
    pool = np.clip(1.0 - d, 0, 1) ** 2.2
    base += (pool * 14.0)[:, :, None]

    vd = np.sqrt((xx - 0.5) ** 2 + (yy - 0.5) ** 2) / 0.78
    base -= (np.clip(vd - 0.45, 0, 1) ** 1.7 * 26.0)[:, :, None]
    return base


def grain(arr, amount=3.2):
    h, w, _ = arr.shape
    n = np.random.normal(0, amount, (h, w, 1))
    n = np.repeat(n, 3, axis=2)
    return arr + n


def finish(arr):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


# ---------------------------------------------------------------- silhouettes
def _body(cx, cy, s, hem_flare=0.0, shoulder_w=1.00, height=1.00):
    """Torso polygon plus the anchor points a sleeve attaches to."""
    bw = 0.30 * s * shoulder_w        # shoulder half width
    bh = 0.60 * s * height
    top = cy - bh * 0.52
    bot = cy + bh * 0.52
    neck = bw * 0.40
    hem = bw * (0.94 + hem_flare)
    arm_y = top + 0.115 * s * height
    pts = [
        (cx - neck, top),
        (cx - bw, top + 0.030 * s),
        (cx - bw * 0.90, arm_y),
        (cx - hem, bot),
        (cx + hem, bot),
        (cx + bw * 0.90, arm_y),
        (cx + bw, top + 0.030 * s),
        (cx + neck, top),
    ]
    left = ((cx - bw, top + 0.030 * s), (cx - bw * 0.90, arm_y))
    right = ((cx + bw, top + 0.030 * s), (cx + bw * 0.90, arm_y))
    return pts, top, bot, bw, neck, left, right


def _sleeve(shoulder, armpit, length, side, angle_deg=14.0, width=0.20, cuff=0.80):
    """Quad running from the shoulder seam down to a slightly tapered cuff."""
    mx = (shoulder[0] + armpit[0]) * 0.5
    my = (shoulder[1] + armpit[1]) * 0.5
    ex, ey = armpit[0] - shoulder[0], armpit[1] - shoulder[1]
    elen = max(1e-6, math.hypot(ex, ey))
    ux, uy = ex / elen, ey / elen
    half = max(elen, width) * 0.5
    a1 = (mx - ux * half, my - uy * half)
    a2 = (mx + ux * half, my + uy * half)

    th = math.radians(angle_deg)
    dx, dy = math.sin(th) * side, math.cos(th)
    b1 = (a1[0] + dx * length, a1[1] + dy * length)
    b2 = (a2[0] + dx * length, a2[1] + dy * length)
    bmx, bmy = (b1[0] + b2[0]) * 0.5, (b1[1] + b2[1]) * 0.5
    b1 = (bmx + (b1[0] - bmx) * cuff, bmy + (b1[1] - bmy) * cuff)
    b2 = (bmx + (b2[0] - bmx) * cuff, bmy + (b2[1] - bmy) * cuff)
    return [a1, b1, b2, a2]


def draw_garment(d, kind, cx, cy, s, fill, shade, line):
    """Draw a tonal garment study. d = ImageDraw on the supersampled canvas."""
    lw = max(1, int(2.2 * SS))

    if kind in ("tshirt", "top", "shirt", "hoodie", "jacket", "coat"):
        cfg = {
            "tshirt": dict(flare=0.05, sw=1.00, hgt=1.00, sleeve=0.20, ang=26, wid=0.150),
            "top":    dict(flare=-0.02, sw=0.86, hgt=0.94, sleeve=0.00, ang=0, wid=0.0),
            "shirt":  dict(flare=0.04, sw=1.02, hgt=1.06, sleeve=0.56, ang=15, wid=0.135),
            "hoodie": dict(flare=0.02, sw=1.08, hgt=1.02, sleeve=0.54, ang=17, wid=0.150),
            "jacket": dict(flare=0.03, sw=1.06, hgt=1.08, sleeve=0.58, ang=15, wid=0.140),
            "coat":   dict(flare=0.10, sw=1.04, hgt=1.42, sleeve=0.74, ang=12, wid=0.150),
        }[kind]
        pts, top, bot, bw, neck, la, ra = _body(
            cx, cy, s, hem_flare=cfg["flare"], shoulder_w=cfg["sw"], height=cfg["hgt"])

        # hood sits behind the shoulders
        if kind == "hoodie":
            d.chord([cx - bw * 0.80, top - 0.085 * s, cx + bw * 0.80, top + 0.115 * s],
                    180, 360, fill=shade)

        if cfg["sleeve"] > 0:
            L = cfg["sleeve"] * s
            wdt = cfg["wid"] * s
            d.polygon(_sleeve(la[0], la[1], L, -1, cfg["ang"], wdt), fill=fill)
            d.polygon(_sleeve(ra[0], ra[1], L, +1, cfg["ang"], wdt), fill=fill)

        d.polygon(pts, fill=fill)

        # neckline
        if kind in ("tshirt", "top", "hoodie"):
            d.chord([cx - neck * 1.15, top - 0.022 * s, cx + neck * 1.15, top + 0.045 * s],
                    0, 180, fill=shade)
        elif kind == "shirt":
            d.polygon([(cx - neck * 1.5, top - 0.012 * s), (cx + neck * 1.5, top - 0.012 * s),
                       (cx + neck * 0.9, top + 0.055 * s), (cx, top + 0.085 * s),
                       (cx - neck * 0.9, top + 0.055 * s)], fill=shade)
            d.line([(cx, top + 0.075 * s), (cx, bot)], fill=shade, width=lw)
        elif kind in ("jacket", "coat"):
            # lapels reading as a soft V, then the centre opening
            d.polygon([(cx - neck * 1.35, top), (cx - 0.006 * s, top + 0.19 * s),
                       (cx + neck * 0.10, top + 0.05 * s), (cx + neck * 0.55, top)], fill=shade)
            d.polygon([(cx + neck * 1.35, top), (cx + 0.006 * s, top + 0.19 * s),
                       (cx - neck * 0.10, top + 0.05 * s), (cx - neck * 0.55, top)], fill=shade)
            d.line([(cx, top + 0.19 * s), (cx, bot)], fill=line, width=lw)

        if kind == "hoodie":
            d.rounded_rectangle([cx - bw * 0.46, bot - 0.24 * s, cx + bw * 0.46, bot - 0.10 * s],
                                radius=int(0.012 * s), outline=shade, width=lw)
            d.line([(cx - neck * 0.5, top + 0.05 * s), (cx - neck * 0.5, top + 0.16 * s)],
                   fill=line, width=lw)
            d.line([(cx + neck * 0.5, top + 0.05 * s), (cx + neck * 0.5, top + 0.16 * s)],
                   fill=line, width=lw)
        if kind == "top":
            d.line([(cx - bw * 0.30, bot - 0.30 * s), (cx - bw * 0.18, bot - 0.06 * s)],
                   fill=shade, width=lw)

    elif kind in ("pants", "jeans"):
        wide = 1.0 if kind == "pants" else 1.06
        hw = 0.235 * s * wide
        top = cy - 0.60 * s
        bot = cy + 0.66 * s
        crotch = top + 0.40 * s
        gap = 0.028 * s
        d.polygon([(cx - hw, top), (cx + hw, top), (cx + hw * 0.92, bot),
                   (cx + gap, bot), (cx, crotch), (cx - gap, bot), (cx - hw * 0.92, bot)], fill=fill)
        d.rectangle([cx - hw, top, cx + hw, top + 0.055 * s], fill=shade)
        d.line([(cx, crotch), (cx, top + 0.06 * s)], fill=shade, width=int(2 * SS))
        if kind == "jeans":
            d.arc([cx - hw * 0.92, top + 0.05 * s, cx - hw * 0.10, top + 0.24 * s], 300, 20, fill=shade, width=int(2.4 * SS))
            d.arc([cx + hw * 0.10, top + 0.05 * s, cx + hw * 0.92, top + 0.24 * s], 160, 240, fill=shade, width=int(2.4 * SS))

    elif kind == "dress":
        bw = 0.245 * s
        top = cy - 0.66 * s
        waist = cy - 0.10 * s
        bot = cy + 0.72 * s
        d.polygon([(cx - bw * 0.62, top), (cx - bw * 1.00, top + 0.10 * s), (cx - bw * 0.80, waist),
                   (cx - bw * 1.70, bot), (cx + bw * 1.70, bot), (cx + bw * 0.80, waist),
                   (cx + bw * 1.00, top + 0.10 * s), (cx + bw * 0.62, top)], fill=fill)
        d.line([(cx - bw * 0.80, waist), (cx + bw * 0.80, waist)], fill=shade, width=int(2.2 * SS))
        d.chord([cx - bw * 0.64, top - 0.04 * s, cx + bw * 0.64, top + 0.07 * s], 0, 180, fill=shade)

    elif kind == "skirt":
        top = cy - 0.34 * s
        bot = cy + 0.52 * s
        d.polygon([(cx - 0.215 * s, top), (cx + 0.215 * s, top),
                   (cx + 0.40 * s, bot), (cx - 0.40 * s, bot)], fill=fill)
        d.rectangle([cx - 0.215 * s, top, cx + 0.215 * s, top + 0.052 * s], fill=shade)
        for k in (-2, -1, 1, 2):
            x0 = cx + k * 0.075 * s
            x1 = cx + k * 0.135 * s
            d.line([(x0, top + 0.06 * s), (x1, bot)], fill=shade, width=int(2 * SS))


def luminance(rgb):
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]


def draw_contour(d, kind, cx, cy, s, fill):
    """Halo behind pale garments so they separate from the warm backdrop."""
    if luminance(fill) < 196:
        return
    edge = lerp(fill, (60, 56, 50), 0.30)
    for grow in (1.018, 1.010):
        draw_garment(d, kind, cx, cy, s * grow, edge + (255,), edge + (255,), edge + (255,))


# per-kind visual weight so every garment reads at a comparable size in the grid,
# plus where its hem sits (in units of s) for shadow placement
KIND_FIT = {
    "tshirt": (1.34, 0.31), "top": (1.44, 0.29), "shirt": (1.16, 0.33),
    "hoodie": (1.16, 0.32), "jacket": (1.12, 0.34), "coat": (0.94, 0.44),
    "pants": (1.00, 0.66), "jeans": (1.00, 0.66), "dress": (0.94, 0.72),
    "skirt": (1.16, 0.52),
}


def garment_image(path, kind, color_key, w=900, h=1200, variant=0, scale=1.0):
    pair = BACKDROPS[variant % len(BACKDROPS)]
    arr = backdrop(w, h, pair, light=(0.5, 0.34 + 0.04 * variant))
    base = finish(grain(arr, 2.4))

    W, H = w * SS, h * SS
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    fill = PALETTE[color_key]
    shade = lerp(fill, (0, 0, 0), 0.16) if sum(fill) > 300 else lerp(fill, (255, 255, 255), 0.13)
    line = lerp(fill, (0, 0, 0), 0.30) if sum(fill) > 300 else lerp(fill, (255, 255, 255), 0.24)

    kscale, hem = KIND_FIT[kind]
    s = min(W, H) * 0.72 * scale * kscale
    cx, cy = W * 0.5, H * 0.50 - s * (hem - 0.42) * 0.35
    draw_contour(d, kind, cx, cy, s, fill)
    draw_garment(d, kind, cx, cy, s, fill + (255,), shade + (255,), line + (255,))

    # soft contact shadow
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).ellipse([cx - s * 0.36, cy + s * (hem + 0.03), cx + s * 0.36,
                                cy + s * (hem + 0.17)], fill=76)
    sh = sh.filter(ImageFilter.GaussianBlur(radius=W * 0.022))
    shadow = Image.new("RGBA", (W, H), (60, 55, 48, 0))
    shadow.putalpha(sh)

    layer = layer.filter(ImageFilter.GaussianBlur(radius=SS * 0.6))
    comp = Image.alpha_composite(shadow, layer).resize((w, h), Image.LANCZOS)
    base = base.convert("RGBA")
    base.alpha_composite(comp)
    out = np.asarray(base.convert("RGB"), dtype=np.float64)
    out = grain(out, 1.6)
    finish(out).save(path, "JPEG", quality=88, optimize=True, progressive=True)


def editorial_image(path, kind, color_key, w=1600, h=2000, warm=0, horizon=0.72, scale=1.0,
                    cx_frac=0.5, group=None):
    pair = BACKDROPS[warm % len(BACKDROPS)]
    arr = backdrop(w, h, pair, light=(0.46, 0.30), spread=1.05)

    # floor plane
    ys = np.arange(h)[:, None]
    hy = int(h * horizon)
    floor = np.clip((ys - hy) / max(1, (h - hy)), 0, 1)
    arr -= (floor * 16.0)[:, :, None]
    arr = grain(arr, 2.8)
    base = finish(arr)

    W, H = w * SS, h * SS
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    sh = Image.new("L", (W, H), 0)
    dsh = ImageDraw.Draw(sh)

    items = group or [(kind, color_key, cx_frac, 1.0)]
    for g_kind, g_color, g_cx, g_scale in items:
        fill = PALETTE[g_color]
        bright = sum(fill) > 300
        shade = lerp(fill, (0, 0, 0), 0.14) if bright else lerp(fill, (255, 255, 255), 0.12)
        line = lerp(fill, (0, 0, 0), 0.26) if bright else lerp(fill, (255, 255, 255), 0.20)
        kscale, hem = KIND_FIT[g_kind]
        s = min(W, H) * 0.80 * scale * g_scale * kscale
        cx, cy = W * g_cx, H * 0.50 - s * (hem - 0.42) * 0.30
        draw_contour(d, g_kind, cx, cy, s, fill)
        draw_garment(d, g_kind, cx, cy, s, fill + (255,), shade + (255,), line + (255,))
        dsh.ellipse([cx - s * 0.40, cy + s * (hem + 0.03), cx + s * 0.40,
                     cy + s * (hem + 0.19)], fill=88)

    sh = sh.filter(ImageFilter.GaussianBlur(radius=W * 0.018))
    shadow = Image.new("RGBA", (W, H), (58, 52, 45, 0))
    shadow.putalpha(sh)

    layer = layer.filter(ImageFilter.GaussianBlur(radius=SS * 0.7))
    comp = Image.alpha_composite(shadow, layer).resize((w, h), Image.LANCZOS)
    base = base.convert("RGBA")
    base.alpha_composite(comp)
    out = grain(np.asarray(base.convert("RGB"), dtype=np.float64), 1.8)
    finish(out).save(path, "JPEG", quality=86, optimize=True, progressive=True)


# ------------------------------------------------------------------- catalogue
PRODUCTS = [
    ("essential-cotton-tee", "tshirt", "ivory", "charcoal"),
    ("heavyweight-boxy-tee", "tshirt", "charcoal", "bone"),
    ("oxford-relaxed-shirt", "shirt", "ivory", "slate"),
    ("linen-camp-shirt", "shirt", "sand", "cream"),
    ("pleated-wool-trouser", "pants", "charcoal", "stone"),
    ("tapered-cotton-chino", "pants", "sand", "olive"),
    ("selvedge-straight-jean", "jeans", "indigo", "slate"),
    ("washed-relaxed-jean", "jeans", "slate", "stone"),
    ("brushed-fleece-hoodie", "hoodie", "ecru", "charcoal"),
    ("zip-through-hoodie", "hoodie", "olive", "black"),
    ("wool-blend-overshirt", "jacket", "charcoal", "camel"),
    ("suede-bomber-jacket", "jacket", "clay", "ink"),
    ("fine-rib-tee", "tshirt", "ivory", "black"),
    ("draped-silk-top", "top", "ecru", "stone"),
    ("poplin-oversized-shirt", "shirt", "ivory", "sand"),
    ("high-rise-wide-trouser", "pants", "black", "cream"),
    ("straight-leg-jean", "jeans", "indigo", "bone"),
    ("bias-cut-midi-dress", "dress", "stone", "ivory"),
    ("knit-column-dress", "dress", "charcoal", "camel"),
    ("pleated-midi-skirt", "skirt", "sand", "charcoal"),
    ("tailored-wool-blazer", "jacket", "charcoal", "ecru"),
    ("quilted-liner-jacket", "jacket", "olive", "ink"),
    ("merino-crew-knit", "tshirt", "camel", "ecru"),
    ("cropped-cotton-top", "top", "cream", "clay"),
]

for i, (slug, kind, c1, c2) in enumerate(PRODUCTS):
    garment_image(f"{OUT}/{slug}-1.jpg", kind, c1, variant=i % 4)
    garment_image(f"{OUT}/{slug}-2.jpg", kind, c2, variant=(i + 2) % 4, scale=0.94)

HERO_RAIL = [
    ("coat", "charcoal", 0.50, 1.00),
    ("dress", "bone", 0.685, 0.84),
    ("shirt", "ivory", 0.855, 0.76),
]
CAMPAIGN_RAIL = [
    ("coat", "camel", 0.545, 1.00),
    ("jeans", "indigo", 0.715, 0.82),
    ("hoodie", "ecru", 0.875, 0.76),
]

EDITORIAL = [
    ("hero", "coat", "charcoal", 2400, 1500, 0, 0.80, 0.62, 0.70, HERO_RAIL),
    ("hero-mobile", "coat", "charcoal", 1100, 1500, 0, 0.80, 0.86, 0.52, None),
    ("editorial-men", "jacket", "ink", 1400, 1750, 1, 0.76, 0.92, 0.50, None),
    ("editorial-women", "dress", "bone", 1400, 1750, 2, 0.76, 0.92, 0.50, None),
    ("campaign-autumn", "coat", "camel", 2000, 1250, 3, 0.82, 0.60, 0.66, CAMPAIGN_RAIL),
    ("brand-story", "shirt", "ivory", 1400, 1600, 0, 0.78, 0.88, 0.50, None),
    ("cat-men-tshirts", "tshirt", "bone", 900, 1200, 1, 0.78, 0.84, 0.50, None),
    ("cat-men-shirts", "shirt", "stone", 900, 1200, 2, 0.78, 0.84, 0.50, None),
    ("cat-men-jeans", "jeans", "indigo", 900, 1200, 3, 0.78, 0.84, 0.50, None),
    ("cat-men-outerwear", "jacket", "charcoal", 900, 1200, 0, 0.78, 0.84, 0.50, None),
    ("cat-women-dresses", "dress", "ecru", 900, 1200, 1, 0.78, 0.84, 0.50, None),
    ("cat-women-tops", "top", "ivory", 900, 1200, 2, 0.78, 0.84, 0.50, None),
    ("cat-women-jeans", "jeans", "slate", 900, 1200, 3, 0.78, 0.84, 0.50, None),
    ("cat-women-skirts", "skirt", "sand", 900, 1200, 0, 0.78, 0.84, 0.50, None),
]

for name, kind, color, w, h, warm, hz, sc, cxf, grp in EDITORIAL:
    editorial_image(f"{OUT}/{name}.jpg", kind, color, w, h, warm, hz, sc, cxf, grp)

print(json.dumps({"products": len(PRODUCTS) * 2, "editorial": len(EDITORIAL)}))
