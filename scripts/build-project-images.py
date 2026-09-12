#!/usr/bin/env python3
"""
Prepares the project illustrations for the web.

The originals are ~1 MB each, which is eight times the weight of the entire rest
of the page. They are also line art on black — greyscale in everything but the
file header — so most of that is three identical colour planes compressed badly
at a resolution nothing ever displays.

Each one is cropped to the card's 4:3 frame, scaled to a size that covers a
retina card, and written back as a greyscale PNG. The wordmark is handled
differently: it is transparent and very wide, so object-fit: cover would crop it
to nothing, and it is instead centred on a brand-ink field at the same ratio.

Run with: npm run build:images
Sources public/_originals/*.png; writes public/projects/*.png
"""

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import pnglib  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public/_originals"
OUT = ROOT / "public/projects"

# The cards render at ~380px wide; 1000px covers a 2x display with room to spare.
TARGET_W = 1000
RATIO = 4 / 3
# --surface-sunken, which is what MediaFrame puts behind its content.
INK = (0x0D, 0x0C, 0x0C)
# Fraction of the frame the wordmark is allowed to occupy.
WORDMARK_SCALE = 0.72

# Which source belongs to which project slug, and how to fit it.
JOBS = [
    ("drone.png", "quadcopter.png", "cover"),
    ("controller.png", "drone-controller.png", "cover"),
    ("robotarm.png", "robotic-arm.png", "cover"),
    ("cbienla.png", "cbienla.png", "contain"),
]


def cover(src, sw, sh, tw, th):
    """Scale to fill the frame, cropping the overflowing axis — object-fit: cover."""
    scale = max(tw / sw, th / sh)
    # Source rectangle that maps onto the whole frame, centred.
    cw, ch = tw / scale, th / scale
    ox, oy = (sw - cw) / 2, (sh - ch) / 2
    step = cw / tw

    out = bytearray(tw * th * 4)
    for y in range(th):
        fy = oy + y * (ch / th)
        for x in range(tw):
            fx = ox + x * step
            r, g, b, _ = pnglib.box_sample(src, sw, sh, fx, fy, fx + step, fy + ch / th)
            i = (y * tw + x) * 4
            out[i], out[i + 1], out[i + 2], out[i + 3] = r, g, b, 255
    return out


def contain(src, sw, sh, tw, th):
    """Centre the whole image on an ink field — object-fit: contain, pre-composited."""
    inner_w = tw * WORDMARK_SCALE
    scale = inner_w / sw
    dw, dh = inner_w, sh * scale
    ox, oy = (tw - dw) / 2, (th - dh) / 2
    step = sw / dw

    out = bytearray(tw * th * 4)
    for y in range(th):
        for x in range(tw):
            i = (y * tw + x) * 4
            fx, fy = (x - ox) * step, (y - oy) * step
            if 0 <= fx < sw and 0 <= fy < sh:
                r, g, b, a = pnglib.box_sample(src, sw, sh, fx, fy, fx + step, fy + step)
            else:
                r = g = b = a = 0
            alpha = a / 255
            out[i] = round(r * alpha + INK[0] * (1 - alpha))
            out[i + 1] = round(g * alpha + INK[1] * (1 - alpha))
            out[i + 2] = round(b * alpha + INK[2] * (1 - alpha))
            out[i + 3] = 255
    return out


def main():
    if not SRC.is_dir():
        sys.exit(f"no originals at {SRC.relative_to(ROOT)} — move the source PNGs there first")
    OUT.mkdir(parents=True, exist_ok=True)

    tw, th = TARGET_W, round(TARGET_W / RATIO)
    total_before = total_after = 0

    for src_name, out_name, fit in JOBS:
        path = SRC / src_name
        if not path.exists():
            print(f"  skip {src_name} (missing)")
            continue

        before = path.stat().st_size
        sw, sh, pixels = pnglib.read_rgba(path)
        framed = (cover if fit == "cover" else contain)(pixels, sw, sh, tw, th)

        grey = pnglib.is_greyscale(framed, tw * th)
        after = pnglib.write(OUT / out_name, tw, th, framed, greyscale=grey)

        total_before += before
        total_after += after
        kind = "greyscale" if grey else "colour"
        print(
            f"  {src_name:<16} {sw}x{sh} {before // 1024:>5} kB"
            f"  ->  projects/{out_name:<20} {tw}x{th} {after // 1024:>4} kB  ({fit}, {kind})"
        )

    if total_before:
        saved = 100 - (total_after * 100 // total_before)
        print(f"\n  {total_before // 1024} kB -> {total_after // 1024} kB  ({saved}% smaller)")


if __name__ == "__main__":
    main()
