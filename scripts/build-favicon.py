#!/usr/bin/env python3
"""
Builds the site favicons from the design system's logo mark.

The mark ships as white on transparent, which disappears against a light browser
tab bar, so it is composited onto the brand's ink surface here and written out at
the sizes browsers actually ask for.

Run with: npm run build:favicon
Sources design_system/assets/logo-mark-white.png; writes into public/.
Pure standard library — decoding and re-encoding a plain 8-bit RGBA PNG is a
few dozen lines and not worth a dependency.
"""

import base64
import pathlib
import struct
import zlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "design_system/assets/logo-mark-white.png"
OUT = ROOT / "public"

# --surface-raised: one step up from the page, so the tile reads as an object.
BACKGROUND = (0x1D, 0x1A, 0x1B)
# Fraction of the tile left clear around the mark on each side.
PADDING = 0.16


def read_png(path):
    data = path.read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"

    idat = b""
    width = height = None
    i = 8
    while i < len(data):
        (length,) = struct.unpack(">I", data[i : i + 4])
        kind = data[i + 4 : i + 8]
        body = data[i + 8 : i + 8 + length]
        if kind == b"IHDR":
            width, height, depth, colour, _, _, interlace = struct.unpack(">IIBBBBB", body)
            assert depth == 8 and colour == 6, f"expected 8-bit RGBA, got depth={depth} colour={colour}"
            assert interlace == 0, "interlaced PNG not supported"
        elif kind == b"IDAT":
            idat += body
        i += 12 + length

    raw = zlib.decompress(idat)
    stride = width * 4
    out = bytearray(width * height * 4)
    prev = bytearray(stride)

    pos = 0
    for y in range(height):
        filt = raw[pos]
        pos += 1
        line = bytearray(raw[pos : pos + stride])
        pos += stride
        for x in range(stride):
            a = line[x - 4] if x >= 4 else 0
            b = prev[x]
            c = prev[x - 4] if x >= 4 else 0
            if filt == 1:
                line[x] = (line[x] + a) & 0xFF
            elif filt == 2:
                line[x] = (line[x] + b) & 0xFF
            elif filt == 3:
                line[x] = (line[x] + (a + b) // 2) & 0xFF
            elif filt == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pred) & 0xFF
        out[y * stride : (y + 1) * stride] = line
        prev = line

    return width, height, out


def write_png(path, width, height, pixels):
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # filter: none
        raw += pixels[y * stride : (y + 1) * stride]

    def chunk(kind, body):
        return (
            struct.pack(">I", len(body))
            + kind
            + body
            + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    path.write_bytes(png)
    return len(png)


def sample(src, sw, sh, x0, y0, x1, y1):
    """Average the source box into one RGBA pixel — a box filter downscale."""
    x0, y0 = max(0, int(x0)), max(0, int(y0))
    x1, y1 = min(sw, max(x0 + 1, int(x1 + 0.5))), min(sh, max(y0 + 1, int(y1 + 0.5)))
    r = g = b = a = n = 0
    for y in range(y0, y1):
        row = (y * sw) * 4
        for x in range(x0, x1):
            i = row + x * 4
            r += src[i]
            g += src[i + 1]
            b += src[i + 2]
            a += src[i + 3]
            n += 1
    return (r // n, g // n, b // n, a // n) if n else (0, 0, 0, 0)


def render(src, sw, sh, size):
    """Scale the mark into a padded tile and composite it over the brand ink."""
    inner = size * (1 - 2 * PADDING)
    offset = (size - inner) / 2
    scale = sw / inner

    out = bytearray(size * size * 4)
    for y in range(size):
        for x in range(size):
            i = (y * size + x) * 4
            fx, fy = (x - offset) * scale, (y - offset) * scale
            if 0 <= fx < sw and 0 <= fy < sh:
                r, g, b, a = sample(src, sw, sh, fx, fy, fx + scale, fy + scale)
            else:
                r = g = b = a = 0
            # Source over the background; the mark's own colour is premultiplied
            # by its coverage so antialiased edges blend cleanly.
            alpha = a / 255
            out[i] = round(r * alpha + BACKGROUND[0] * (1 - alpha))
            out[i + 1] = round(g * alpha + BACKGROUND[1] * (1 - alpha))
            out[i + 2] = round(b * alpha + BACKGROUND[2] * (1 - alpha))
            out[i + 3] = 255
    return out


def main():
    sw, sh, src = read_png(SRC)
    print(f"source {SRC.name}: {sw}x{sh}")

    tiles = {}
    for size, name in ((32, "favicon-32.png"), (180, "apple-touch-icon.png")):
        pixels = render(src, sw, sh, size)
        tiles[size] = pixels
        n = write_png(OUT / name, size, size, pixels)
        print(f"wrote public/{name} ({size}x{size}, {n} bytes)")

    # An SVG favicon is what modern browsers prefer, and it stays crisp at any
    # size. The mark is embedded rather than traced: it ships as a raster.
    embedded = base64.b64encode((OUT / "apple-touch-icon.png").read_bytes()).decode()
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">'
        f'<image width="180" height="180" href="data:image/png;base64,{embedded}"/>'
        "</svg>"
    )
    (OUT / "favicon.svg").write_text(svg)
    print(f"wrote public/favicon.svg ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
