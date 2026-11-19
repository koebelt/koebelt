"""Generates the static KOEBELT-styled SVG cards in assets/ (everything but activity.svg).

    pip install fonttools brotli
    FONTS_DIR=<dir with Archivo.ttf and JBM.ttf from google/fonts> \
    PORTFOLIO=<koebelt portfolio checkout>/public/projects \
    python .github/scripts/cards.py assets
"""
import base64, io, math, os, re, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
PORTFOLIO = os.environ.get('PORTFOLIO', '../koebelt/public/projects')
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- tokens
INK800, INK900, INK700, INK600 = '#161415', '#0D0C0C', '#1D1A1B', '#262324'
WHITE, INK100, INK200, INK300 = '#FFFFFF', '#B8B3B1', '#8C8685', '#625C5B'
LIME = '#DCFB47'
HAIR = 'rgba(255,255,255,.12)'
EASE = 'cubic-bezier(.2,.8,.2,1)'

# ---------------------------------------------------------------- fonts
CHARS = ''.join(chr(c) for c in range(0x20, 0x7f)) + 'àéèêçôÀÉ·—–→↗←↓●°’…×✓'
FONTS = {}  # key -> (family, b64, TTFont instance)

def load(key, src, axes):
    f = instantiateVariableFont(TTFont(os.path.join(os.environ.get('FONTS_DIR', os.path.join(HERE, 'fonts')), src)), axes)
    measure = TTFont(); measure = f  # widths read before subsetting
    cmap = f.getBestCmap(); hmtx = f['hmtx']; upm = f['head'].unitsPerEm
    widths = {ch: hmtx[cmap[ord(ch)]][0] / upm for ch in CHARS if ord(ch) in cmap}
    g = instantiateVariableFont(TTFont(os.path.join(os.environ.get('FONTS_DIR', os.path.join(HERE, 'fonts')), src)), axes)
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga']
    s = subset.Subsetter(opts); s.populate(text=CHARS); s.subset(g)
    g.flavor = 'woff2'; b = io.BytesIO(); g.save(b)
    FONTS[key] = ('K' + key, base64.b64encode(b.getvalue()).decode(), widths)

load('d', 'Archivo.ttf', {'wght': 800, 'wdth': 100})
load('b', 'Archivo.ttf', {'wght': 400, 'wdth': 100})
load('m', 'Archivo.ttf', {'wght': 600, 'wdth': 100})
load('c', 'JBM.ttf', {'wght': 500})

import json as _j
_j.dump({**{k: v[1] for k, v in FONTS.items()}, 'widths_m': {c: round(w, 4) for c, w in FONTS['m'][2].items()}}, open(os.path.join(OUT, '..', '.github', 'scripts', 'fonts.json'), 'w'))

TRACK = {'d': -0.035, 'b': 0, 'm': -0.01, 'c': 0.14}

def width(text, key, size):
    w = FONTS[key][2]
    return sum(w.get(ch, 0.5) for ch in text) * size + len(text) * TRACK[key] * size

def wrap(text, key, size, maxw):
    lines, cur = [], ''
    for word in text.split(' '):
        trial = (cur + ' ' + word).strip()
        if width(trial, key, size) <= maxw or not cur:
            cur = trial
        else:
            lines.append(cur); cur = word
    if cur: lines.append(cur)
    return lines

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# ---------------------------------------------------------------- svg shell
def svg(w, h, body, css='', label='', fonts='dbmc'):
    faces = ''.join(
        f"@font-face{{font-family:{FONTS[k][0]};src:url(data:font/woff2;base64,{FONTS[k][1]}) format('woff2')}}"
        for k in fonts)
    base = (
        f".d{{font-family:Kd,Archivo,Helvetica,Arial,sans-serif;letter-spacing:-.035em}}"
        f".b{{font-family:Kb,Archivo,Helvetica,Arial,sans-serif}}"
        f".m{{font-family:Km,Archivo,Helvetica,Arial,sans-serif;letter-spacing:-.01em}}"
        f".c{{font-family:Kc,'JetBrains Mono',ui-monospace,Menlo,monospace;letter-spacing:.14em}}"
        f".r{{opacity:0;animation:rise .64s {EASE} forwards}}"
        f"@keyframes rise{{from{{opacity:0;transform:translateY(16px)}}to{{opacity:1;transform:none}}}}"
        f"@keyframes blink{{0%,100%{{opacity:1}}50%{{opacity:.25}}}}"
        f".pulse{{animation:blink 2.4s ease-in-out infinite}}"
        f"@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}.r{{opacity:1}}}}"
    )
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="{esc(label)}"><title>{esc(label)}</title>'
            f'<style>{faces}{base}{css}</style>{body}</svg>')

def frame(w, h, fill=INK800):
    return (f'<rect x=".5" y=".5" width="{w-1}" height="{h-1}" rx="8" fill="{fill}" '
            f'stroke="{HAIR}"/>')

def t(x, y, s, cls, size, fill, anchor='start', delay=None, extra=''):
    st = f' style="animation-delay:{delay}ms"' if delay is not None else ''
    rc = ' r' if delay is not None else ''
    return (f'<text x="{x}" y="{y}" class="{cls}{rc}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}"{st}{extra}>{esc(s)}</text>')

def para(x, y, text, key, size, fill, maxw, lh, delay=None, step=40):
    out = []
    for i, line in enumerate(wrap(text, key, size, maxw)):
        out.append(t(x, y + i * lh, line, key, size, fill,
                     delay=None if delay is None else delay + i * step))
    return ''.join(out), len(wrap(text, key, size, maxw))

def eyebrow(x, y, s, delay=None):
    return t(x, y, s.upper(), 'c', 16, LIME, delay=delay)

def pill(x, y, s, size=13, color=INK100, border='rgba(255,255,255,.2)'):
    s = s.upper(); w = width(s, 'c', size) + 26; h = size + 17
    return (f'<rect x="{x}" y="{y}" width="{w:.1f}" height="{h}" rx="{h/2}" fill="none" stroke="{border}"/>'
            + t(x + 13, y + h / 2 + size * 0.36, s, 'c', size, color)), w

def save(name, content):
    with open(os.path.join(OUT, name), 'w') as f: f.write(content)
    print(f'{name:28s} {len(content)/1024:7.1f} KB')

# ================================================================ hero
def hero():
    W, H = 1200, 620
    cx, cy, R = 975, 300, 300
    T = 56.0  # seconds per revolution
    rings, steps = 34, 36
    css = [f'@keyframes in{{from{{opacity:0}}to{{opacity:1}}}}.sphere{{animation:in 2.4s {EASE} .2s both}}']
    pts = []
    niort_ring = min(range(rings), key=lambda i: abs((-90 + (i + .5) * 180 / rings) - 46.3))
    for i in range(rings):
        lat = math.radians(-90 + (i + .5) * 180 / rings)
        A = R * math.cos(lat); y = cy - R * math.sin(lat)
        n = max(6, round(math.cos(lat) * 78))
        frames = []
        for k in range(steps + 1):
            p = k / steps; a = 2 * math.pi * p
            x = A * math.sin(a); z = math.cos(a)
            op = 0.10 + 0.90 * ((z + 1) / 2) ** 1.6
            sc = 0.55 + 0.45 * (z + 1) / 2
            frames.append(f'{p*100:.2f}%{{transform:translateX({x:.1f}px) scale({sc:.2f});opacity:{op:.2f}}}')
        css.append(f'@keyframes s{i}{{{"".join(frames)}}}.s{i}{{animation:s{i} {T}s linear infinite}}')
        off = (i * 0.618034) % 1
        pts.append(f'<g transform="translate({cx} {y:.1f})">')
        for j in range(n):
            ph = (j / n + off) % 1
            a = 2 * math.pi * ph; z = math.cos(a)
            st = (f'transform:translateX({A*math.sin(a):.1f}px) scale({0.55+0.45*(z+1)/2:.2f});'
                  f'opacity:{0.10+0.90*((z+1)/2)**1.6:.2f};')
            pts.append(f'<circle r="2.1" class="s{i}" style="{st}animation-delay:-{ph*T:.2f}s"/>')
        if i == niort_ring:
            ph = 0.03
            a = 2 * math.pi * ph
            pts.append(f'<g class="s{i}" style="transform:translateX({A*math.sin(a):.1f}px);animation-delay:-{ph*T:.2f}s">'
                       f'<circle r="11" fill="none" stroke="{LIME}" stroke-width="1.4" class="halo"/>'
                       f'<circle r="4.2" fill="{LIME}"/></g>')
        pts.append('</g>')
    css.append('@keyframes halo{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.2);opacity:0}}'
               '.halo{animation:halo 2.4s ease-out infinite}')
    sphere = (f'<g class="sphere" fill="#EDEAE8"><g transform="rotate(-16 {cx} {cy})">'
              + ''.join(pts) + '</g></g>')

    x0 = 76
    name_size = 112
    body = [frame(W, H, INK900),
            f'<clipPath id="clip"><rect x="1" y="1" width="{W-2}" height="{H-2}" rx="8"/></clipPath>',
            f'<g clip-path="url(#clip)">{sphere}</g>',
            f'<g class="r" style="animation-delay:150ms"><circle cx="{x0+6}" cy="152" r="6" fill="{LIME}" class="pulse"/></g>',
            t(x0 + 24, 158, 'OPEN TO NEW ROLES', 'c', 17, LIME, delay=150),
            t(x0 - 6, 270, 'Thomas Koebel', 'd', name_size, '#F4F2F1', delay=260),
            t(x0 - 6, 378, 'Software engineer', 'd', name_size, '#A19C99', delay=360)]
    p, n = para(x0, 446, 'Full-stack engineer for web and mobile, from the interface to the services behind it. I also build my own hardware.',
                'b', 25, INK100, 640, 36, delay=480)
    body.append(p)
    body.append(f'<line x1="{x0}" y1="540" x2="{x0+640}" y2="540" stroke="{HAIR}" class="r" style="animation-delay:640ms"/>')
    body.append(t(x0, 574, 'KOEBELT.COM', 'c', 15, WHITE, delay=700))
    body.append(t(x0 + 190, 574, 'NIORT, FRANCE  ·  46.32°N 0.46°W', 'c', 15, INK200, delay=760))
    save('hero.svg', svg(W, H, ''.join(body), ''.join(css),
                         'Thomas Koebel, software engineer. Full-stack engineer for web and mobile, based in Niort, France.'))

# ================================================================ marquee
def marquee():
    W, H = 1200, 64
    words = ['Flutter', 'React', 'TypeScript', 'C / C++', 'Node.js', 'Firebase', 'AWS',
             'Nuxt', 'Three.js / GLSL', 'Python', 'STM32', 'ROS 2', 'Rust', 'Docker']
    size = 16
    items, x = [], 0
    for w in words:
        s = w.upper()
        items.append(t(x, 38, s, 'c', size, INK100))
        x += width(s, 'c', size) + 26
        items.append(f'<rect x="{x:.1f}" y="29" width="6" height="6" fill="{LIME}" transform="rotate(45 {x+3:.1f} 32)"/>')
        x += 32
    run = x
    copies = math.ceil(W / run) + 1
    group = ''.join(f'<g transform="translate({c*run:.1f} 0)">{"".join(items)}</g>' for c in range(copies))
    css = (f'@keyframes mq{{from{{transform:translateX(0)}}to{{transform:translateX(-{run:.1f}px)}}}}'
           f'.mq{{animation:mq {run/38:.1f}s linear infinite}}')
    body = (frame(W, H, INK900)
            + f'<clipPath id="c"><rect x="1" y="1" width="{W-2}" height="{H-2}" rx="8"/></clipPath>'
            + f'<g clip-path="url(#c)"><g class="mq">{group}</g></g>'
            + f'<rect x="1" y="1" width="80" height="{H-2}" fill="url(#fl)"/><rect x="{W-81}" y="1" width="80" height="{H-2}" fill="url(#fr)"/>'
            + f'<linearGradient id="fl"><stop offset="0" stop-color="{INK900}"/><stop offset="1" stop-color="{INK900}" stop-opacity="0"/></linearGradient>'
            + f'<linearGradient id="fr"><stop offset="0" stop-color="{INK900}" stop-opacity="0"/><stop offset="1" stop-color="{INK900}"/></linearGradient>')
    save('marquee.svg', svg(W, H, body, css, 'Flutter, React, TypeScript, C and C++, Node.js, Firebase, AWS, Nuxt, Three.js, Python, STM32, ROS 2, Rust, Docker', fonts='c'))

# ================================================================ profile
def profile():
    W, H = 1200, 470
    x0 = 64
    body = [None, eyebrow(x0, 84, '01 / Profile', 0),
            t(x0 - 3, 152, 'Profile', 'd', 60, WHITE, delay=80)]
    text = ("I'm a full-stack engineer focused on web and mobile: Flutter apps, React and Nuxt front ends, "
            "and the Node.js, Firebase or AWS services behind them. I have co-founded two products, delivered "
            "client systems as a consultant at Nagarro and mentored students at EPITECH. Outside work I build "
            "hardware, from a flight controller to a robotic arm, which is where my attention to what runs "
            "underneath comes from.")
    p, n = para(x0, 214, text, 'b', 23, INK100, 610, 35, delay=160, step=30)
    body.append(p)
    H = max(H, 214 + (n - 1) * 35 + 64)
    body[0] = frame(W, H)
    fx = 760
    body.append(f'<line x1="{fx-40}" y1="64" x2="{fx-40}" y2="{H-64}" stroke="{HAIR}"/>')
    facts = [('Based in', 'Niort, France'), ('Now', 'Co-founder, Cbienlà'),
             ('Degree', "Master's, EPITECH"), ('Languages', 'French · English · German'),
             ('Status', 'Open to new roles')]
    for i, (k, v) in enumerate(facts):
        y = 92 + i * 68
        d = 200 + i * 60
        body.append(t(fx, y, k.upper(), 'c', 14, INK200, delay=d))
        if k == 'Status':
            body.append(f'<circle cx="{fx+6}" cy="{y+29}" r="6" fill="{LIME}" class="pulse"/>')
            body.append(t(fx + 22, y + 36, v, 'm', 24, LIME, delay=d))
        else:
            body.append(t(fx, y + 36, v, 'm', 24, WHITE, delay=d))
    save('profile.svg', svg(W, H, ''.join(body), '', 'Profile: full-stack engineer for web and mobile, based in Niort, France.'))

# ================================================================ section heading
def heading(name, idx, title, desc, label):
    W = 1200
    lines = wrap(desc, 'b', 23, 900)
    H = 196 + len(lines) * 35
    body = [frame(W, H), eyebrow(64, 84, idx, 0), t(61, 152, title, 'd', 60, WHITE, delay=80)]
    p, _ = para(64, 214, desc, 'b', 23, INK100, 900, 35, delay=160)
    body.append(p)
    save(name, svg(W, H, ''.join(body), '', label))

# ================================================================ projects
def figure(slug, x, y, w):
    s = open(os.path.join(PORTFOLIO, slug + '.svg')).read()
    h = w * 480 / 640
    s = re.sub(r'<svg ', f'<svg x="{x}" y="{y}" width="{w}" height="{h:.1f}" ', s, count=1)
    s = re.sub(r'<\?xml[^>]*\?>', '', s)
    return s

PROJECTS = [
    ('cbienla', 'Cbienlà.fr', '2025–', ['Co-founder', 'Flutter', 'Nuxt.js', 'Firebase'],
     'A real-estate listing platform I co-founded in 2025, now live: a Flutter app and a Nuxt.js site on a shared Firebase backend.'),
    ('facix', 'Facix', '2023–25', ['Co-founder', 'Flutter', 'AWS', 'Stripe'],
     'An activity booking app for French associations, taken to a beta with pilot associations: Flutter, in-app payments and a serverless AWS backend.'),
    ('quadcopter', 'Stabilised quadcopter', 'Hardware', ['C / C++', 'STM32', 'KiCad'],
     'Built end to end, from part selection and PCB design to flight-control firmware, holding a stable attitude in manual flight.'),
    ('robotic-arm', 'Robotic arm', 'Hardware', ['C++', 'Kinematics', 'Flutter'],
     'A robotic arm driven wirelessly from a mobile app: the phone sets the destination, the firmware works out the motion.'),
    ('drone-controller', 'Drone remote controller', 'Hardware', ['C++', 'CAD', '3D printing'],
     'A radio controller for the quadcopter, designed and 3D printed from scratch, that shows live telemetry on its own screen.'),
    ('portfolio', 'This portfolio', 'Web', ['React', 'TypeScript', 'WebGL'],
     'koebelt.com: a React front end with a hand-written WebGL particle engine that changes shape for every section.'),
]

def card(i, slug, title, kind, tags, summary):
    W, H = 600, 740
    body = [frame(W, H), f'<rect x="1" y="1" width="{W-2}" height="452" rx="8" fill="{INK900}"/>',
            f'<line x1="1" y1="453" x2="{W-1}" y2="453" stroke="{HAIR}"/>',
            figure(slug, 12, 6, 576)]
    body.append(t(40, 500, f'{i:02d}', 'c', 15, LIME))
    body.append(t(W - 40, 500, kind.upper(), 'c', 15, INK200, 'end'))
    body.append(t(38, 552, title, 'd', 40, WHITE))
    p, n = para(40, 594, summary, 'b', 21, INK100, 520, 31)
    body.append(p)
    x = 40
    for tag in tags:
        g, w = pill(x, 668, tag, 12)
        body.append(g); x += w + 8
    body.append(t(W - 40, 691, '→', 'b', 24, WHITE, 'end'))
    save(f'work-{slug}.svg', svg(W, H, ''.join(body), '', f'{title}: {summary}'))

def feature():
    W, H = 1200, 640
    body = [frame(W, H), f'<rect x="1" y="1" width="680" height="{H-2}" rx="8" fill="{INK900}"/>',
            f'<line x1="681" y1="1" x2="681" y2="{H-1}" stroke="{HAIR}"/>',
            figure('koebelt-dash', 10, 70, 660)]
    x0 = 728
    body.append(t(40, 60, 'FEATURED · OPEN SOURCE', 'c', 15, LIME, delay=0))
    body.append(t(40, H - 40, 'v1.4.0 · MACOS · WINDOWS · LINUX · ANDROID · IOS', 'c', 13, INK200, delay=100))
    body.append(t(x0 - 3, 128, 'koebelt/dash', 'd', 60, WHITE, delay=100))
    p, n = para(x0, 186, 'One app for drones, planes, rovers, boats, legged robots, robot arms and test benches, '
                'and the library that connects a board to it. The device describes itself; the app builds the '
                'screens, the controls and the safety around it.', 'b', 21, INK100, 420, 31, delay=180, step=30)
    body.append(p)
    y = 186 + n * 31 + 22
    x = x0
    for tag in ['Flutter', 'C++', 'Rust', 'ROS 2', 'MAVLink']:
        g, w = pill(x, y, tag, 12)
        if x + w > W - 40:
            x = x0; y += 40; g, w = pill(x, y, tag, 12)
        body.append(g); x += w + 8
    sy = 500
    body.append(f'<line x1="{x0}" y1="{sy-62}" x2="{W-48}" y2="{sy-62}" stroke="{HAIR}"/>')
    stats = [('5', 'Platforms'), ('7', 'Languages'), ('1.8 s', 'To failsafe')]
    for k, (num, lab) in enumerate(stats):
        sx = x0 + k * 148
        body.append(t(sx - 2, sy, num, 'd', 46, WHITE, delay=400 + k * 80))
        body.append(t(sx, sy + 34, lab.upper(), 'c', 12, INK200, delay=400 + k * 80))
    body.append(t(x0, H - 40, 'CASE STUDY, SOURCE AND DOWNLOADS BELOW ↓', 'c', 13, INK200))
    save('work-koebelt-dash.svg', svg(W, H, ''.join(body), '',
         'koebelt/dash: an open-source app and library for drones, rovers, robot arms and test benches.'))

def button(name, label, primary=False):
    size = 15; s = label.upper()
    w = round(width(s, 'c', size) + 56); h = 52
    fill = LIME if primary else INK900
    fg = INK800 if primary else WHITE
    stroke = LIME if primary else 'rgba(255,255,255,.2)'
    body = (f'<rect x=".5" y=".5" width="{w-1}" height="{h-1}" rx="3" fill="{fill}" stroke="{stroke}"/>'
            + t(28, h / 2 + 5.5, s, 'c', size, fg))
    save(f'btn-{name}.svg', svg(w, h, body, '', label, fonts='c'))

# ================================================================ stack
def stack():
    W = 1200
    groups = [('Languages', ['TypeScript', 'Dart', 'C / C++', 'Python', 'SQL', 'Bash', 'Java', 'Rust', 'Haskell']),
              ('Web', ['React', 'Node.js', 'Vue', 'Nuxt', 'Angular', 'Spring', 'Three.js']),
              ('Mobile', ['Flutter', 'React Native', 'Stripe', 'BLE']),
              ('Cloud & infra', ['Firebase', 'GCP', 'AWS', 'Docker', 'Linux', 'CI']),
              ('Hardware', ['STM32', 'Arduino', 'KiCad', 'ROS 2', 'MAVLink', 'nRF24'])]
    colw = (W - 128) / len(groups)
    H = 270 + 68 + 8 * 36 + 60
    body = [frame(W, H), eyebrow(64, 84, '03 / Stack', 0), t(61, 152, 'Technical skills', 'd', 60, WHITE, delay=80)]
    p, _ = para(64, 210, 'Languages at the base, four domains built on top of them.', 'b', 23, INK100, 900, 35, delay=160)
    body.append(p)
    top = 270
    for gi, (g, items) in enumerate(groups):
        x = 64 + gi * colw
        if gi:
            body.append(f'<line x1="{x-16:.1f}" y1="{top-6}" x2="{x-16:.1f}" y2="{H-56}" stroke="{HAIR}"/>')
        body.append(t(x, top + 12, g.upper(), 'c', 14, INK200, delay=220 + gi * 60))
        body.append(f'<line x1="{x:.1f}" y1="{top+30}" x2="{x+colw-40:.1f}" y2="{top+30}" stroke="{HAIR}"/>')
        for k, it in enumerate(items):
            y = top + 68 + k * 36
            body.append(t(x, y, it, 'm', 22, WHITE if k < 3 else INK100, delay=260 + gi * 60 + k * 30))
    save('stack.svg', svg(W, H, ''.join(body), '', 'Technical skills: languages, web, mobile, cloud and hardware.'))

# ================================================================ experience
def experience():
    W = 1200
    roles = [('01', 'Cbienlà.fr', 'Co-founder & software engineer', '2025–',
              'Real-estate listing and property management platform. Architecture, the Flutter app and the Nuxt.js site, on Firebase.', True),
             ('02', 'Nagarro', 'Software engineering consultant', '2024–25',
              'Node.js systems for industrial clients, including data from 300+ PLCs for Phoenix Contact.', False),
             ('03', 'Facix', 'Co-founder & mobile team lead', '2023–25',
              'Booking for French associations. Led the Flutter app and a small mobile team on serverless AWS.', False),
             ('04', 'EPITECH Strasbourg', 'Educational mentor, internship', '2023',
              'Six months mentoring a class of first-year students in web development.', False),
             ('05', 'ALE Enterprise', 'QA developer, internship', '2021–22',
              'Automated phone testing, designed a new Python test framework, built a Node.js VLAN tool.', False)]
    degrees = [('01', 'EPITECH Strasbourg', 'Master, software engineering', '2020–25'),
               ('02', 'HFT Stuttgart', 'Software technology, Erasmus exchange', '2023–24')]
    row = 112
    top = 196
    H = top + len(roles) * row + 150 + len(degrees) * 76 + 50
    body = [frame(W, H), eyebrow(64, 84, '04 / Experience', 0), t(61, 152, 'Five roles since 2021', 'd', 60, WHITE, delay=80)]
    for i, (idx, org, role, year, detail, now) in enumerate(roles):
        y = top + i * row
        d = 160 + i * 70
        body.append(f'<line x1="64" y1="{y}" x2="{W-64}" y2="{y}" stroke="{HAIR}"/>')
        body.append(t(64, y + 44, idx, 'c', 15, LIME if now else INK200, delay=d))
        body.append(t(128, y + 44, org, 'm', 28, WHITE, delay=d))
        ow = width(org, 'm', 28)
        body.append(t(128 + ow + 18, y + 44, role, 'b', 22, INK100, delay=d))
        if now:
            body.append(f'<circle cx="{W-64-width(year,"c",15)-20:.1f}" cy="{y+39}" r="5" fill="{LIME}" class="pulse"/>')
        body.append(t(W - 64, y + 44, year, 'c', 15, LIME if now else INK200, 'end', delay=d))
        body.append(t(128, y + 80, detail, 'b', 19, INK200, delay=d + 40))
    y = top + len(roles) * row
    body.append(f'<line x1="64" y1="{y}" x2="{W-64}" y2="{y}" stroke="{HAIR}"/>')
    y += 92
    body.append(eyebrow(64, y, '05 / Education', 600))
    y += 34
    for i, (idx, org, deg, year) in enumerate(degrees):
        yy = y + i * 76
        d = 660 + i * 70
        body.append(f'<line x1="64" y1="{yy}" x2="{W-64}" y2="{yy}" stroke="{HAIR}"/>')
        body.append(t(64, yy + 46, idx, 'c', 15, INK200, delay=d))
        body.append(t(128, yy + 46, org, 'm', 28, WHITE, delay=d))
        body.append(t(128 + width(org, 'm', 28) + 18, yy + 46, deg, 'b', 22, INK100, delay=d))
        body.append(t(W - 64, yy + 46, year, 'c', 15, INK200, 'end', delay=d))
    save('experience.svg', svg(W, H, ''.join(body), '', 'Experience: Cbienlà, Nagarro, Facix, EPITECH, ALE Enterprise. Education: EPITECH Strasbourg, HFT Stuttgart.'))

# ================================================================ contact
def contact():
    W, H = 1200, 360
    body = [frame(W, H, INK900), eyebrow(64, 84, '07 / Contact', 0), t(58, 178, 'Get in touch', 'd', 104, WHITE, delay=80)]
    p, _ = para(64, 240, 'I am looking for a permanent or fixed-term role in full-stack web and mobile engineering: '
                'remote, hybrid or on-site around Niort. Email is the quickest way to reach me.',
                'b', 23, INK100, 960, 35, delay=180)
    body.append(p)
    body.append(t(W - 64, 84, 'CONTACT@KOEBELT.COM', 'c', 15, INK200, 'end', delay=60))
    save('contact.svg', svg(W, H, ''.join(body), '', 'Get in touch: contact@koebelt.com'))

def footer():
    W, H = 1200, 72
    body = (t(0, 40, 'DESIGNED & BUILT BY THOMAS KOEBEL', 'c', 13, INK200)
            + t(W, 40, 'SAME SYSTEM AS KOEBELT.COM · ARCHIVO + JETBRAINS MONO · #DCFB47', 'c', 13, INK300, 'end'))
    save('footer.svg', svg(W, H, body, '', 'Designed and built by Thomas Koebel', fonts='c'))

hero(); marquee(); profile()
heading('work.svg', '02 / Selected work', 'Projects',
        'An open-source app for hardware builders, two products I co-founded, three hardware builds taken from part '
        'selection to firmware, and the site this page is styled after. Each one has a full case study on koebelt.com.',
        'Selected work')
feature()
for i, p in enumerate(PROJECTS, start=2):
    card(i, *p)
stack(); experience(); contact(); footer()
for n, l, p in [('email', 'Email me', True), ('site', 'koebelt.com ↗', False), ('linkedin', 'LinkedIn ↗', False),
                ('resume', 'Résumé (PDF) ↗', False), ('case', 'Case study ↗', True), ('source', 'Source ↗', False),
                ('appstore', 'App Store ↗', False), ('releases', 'Downloads ↗', False)]:
    button(n, l, p)
