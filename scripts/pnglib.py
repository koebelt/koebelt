"""
Minimal PNG decode/encode for the build scripts.

Only what this project needs: 8-bit non-interlaced PNGs, decoded to RGBA and
written back as RGBA or greyscale. Doing it here keeps the image pipeline in the
standard library, which matters more than it sounds — these scripts run rarely
and their outputs are committed, so a dependency would be pure carrying cost.
"""

import struct
import zlib

CHANNELS = {0: 1, 2: 3, 4: 2, 6: 4}


def read_rgba(path):
    """Decode a PNG to (width, height, bytearray of RGBA)."""
    data = path.read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", f"{path} is not a PNG"

    idat = b""
    width = height = colour = None
    i = 8
    while i < len(data):
        (length,) = struct.unpack(">I", data[i : i + 4])
        kind = data[i + 4 : i + 8]
        body = data[i + 8 : i + 8 + length]
        if kind == b"IHDR":
            width, height, depth, colour, _, _, interlace = struct.unpack(">IIBBBBB", body)
            assert depth == 8, f"{path}: expected 8-bit, got {depth}"
            assert colour in CHANNELS, f"{path}: unsupported colour type {colour}"
            assert interlace == 0, f"{path}: interlaced PNG not supported"
        elif kind == b"IDAT":
            idat += body
        i += 12 + length

    ch = CHANNELS[colour]
    raw = zlib.decompress(idat)
    stride = width * ch
    planes = bytearray(width * height * ch)
    prev = bytearray(stride)

    pos = 0
    for y in range(height):
        filt = raw[pos]
        pos += 1
        line = bytearray(raw[pos : pos + stride])
        pos += stride
        if filt:
            for x in range(stride):
                a = line[x - ch] if x >= ch else 0
                b = prev[x]
                c = prev[x - ch] if x >= ch else 0
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
        planes[y * stride : (y + 1) * stride] = line
        prev = line

    # Normalise everything to RGBA so callers only handle one layout.
    if ch == 4:
        return width, height, planes
    out = bytearray(width * height * 4)
    for p in range(width * height):
        if ch == 3:
            out[p * 4 : p * 4 + 3] = planes[p * 3 : p * 3 + 3]
            out[p * 4 + 3] = 255
        elif ch == 1:
            v = planes[p]
            out[p * 4 : p * 4 + 4] = bytes((v, v, v, 255))
        else:  # grey + alpha
            v, a = planes[p * 2], planes[p * 2 + 1]
            out[p * 4 : p * 4 + 4] = bytes((v, v, v, a))
    return width, height, out


def _chunk(kind, body):
    return (
        struct.pack(">I", len(body))
        + kind
        + body
        + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
    )


def write(path, width, height, pixels, greyscale=False):
    """Write RGBA pixels as a PNG, optionally collapsing to a greyscale plane."""
    ch = 1 if greyscale else 4
    colour = 0 if greyscale else 6

    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter: none
        base = y * width * 4
        if greyscale:
            # Rec. 601 luma rather than the red channel alone, so a source that
            # is only nearly grey collapses without shifting in brightness.
            raw += bytes(
                (
                    pixels[base + x * 4] * 299
                    + pixels[base + x * 4 + 1] * 587
                    + pixels[base + x * 4 + 2] * 114
                )
                // 1000
                for x in range(width)
            )
        else:
            raw += pixels[base : base + width * 4]

    png = b"\x89PNG\r\n\x1a\n"
    png += _chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, colour, 0, 0, 0))
    png += _chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += _chunk(b"IEND", b"")
    path.write_bytes(png)
    return len(png)


def is_greyscale(pixels, count, tolerance=12):
    """
    True when no sampled pixel's channels differ by more than `tolerance`.

    A tolerance rather than an equality test because a render that is visually
    black-and-white still carries a point or two of colour noise, and paying for
    three colour planes to preserve noise is the wrong trade.
    """
    step = max(1, count // 40000)
    for p in range(0, count, step):
        i = p * 4
        if max(pixels[i], pixels[i + 1], pixels[i + 2]) - min(pixels[i], pixels[i + 1], pixels[i + 2]) > tolerance:
            return False
    return True


def box_sample(src, sw, sh, x0, y0, x1, y1):
    """Average a source box into one RGBA pixel — a box-filter downscale."""
    x0, y0 = max(0, int(x0)), max(0, int(y0))
    x1 = min(sw, max(x0 + 1, int(x1 + 0.5)))
    y1 = min(sh, max(y0 + 1, int(y1 + 0.5)))
    r = g = b = a = n = 0
    for y in range(y0, y1):
        row = y * sw * 4
        for x in range(x0, x1):
            i = row + x * 4
            r += src[i]
            g += src[i + 1]
            b += src[i + 2]
            a += src[i + 3]
            n += 1
    return (r // n, g // n, b // n, a // n) if n else (0, 0, 0, 0)
