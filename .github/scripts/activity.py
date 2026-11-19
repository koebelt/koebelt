"""Renders assets/activity.svg: the contribution calendar, streaks and languages,
drawn in the KOEBELT design system. Standard library only; runs nightly in CI.

    GITHUB_TOKEN=... python .github/scripts/activity.py
"""
import datetime as dt
import json
import os
import urllib.request

LOGIN = os.environ.get('GITHUB_LOGIN', 'koebelt')
TOKEN = os.environ['GITHUB_TOKEN']
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'assets', 'activity.svg')

INK900, INK800, INK600 = '#0D0C0C', '#161415', '#262324'
WHITE, INK100, INK200 = '#FFFFFF', '#B8B3B1', '#8C8685'
LIME = '#DCFB47'
HAIR = 'rgba(255,255,255,.12)'
EASE = 'cubic-bezier(.2,.8,.2,1)'
WIDTHS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts.json')))['widths_m']
LANG_RAMP = [LIME, '#F4F2F1', '#B8B3B1', '#8C8685', '#625C5B', '#443F40', '#2E2B2C']
SKIP_LANGS = {'HTML', 'CSS', 'SCSS', 'Makefile', 'CMake', 'Dockerfile', 'Shell', 'Batchfile', 'Roff'}

QUERY = '''
query($login: String!) {
  user(login: $login) {
    createdAt
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
      totalCount
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name } }
        }
      }
    }
  }
}'''


def fetch():
    req = urllib.request.Request(
        'https://api.github.com/graphql',
        data=json.dumps({'query': QUERY, 'variables': {'login': LOGIN}}).encode(),
        headers={'Authorization': f'bearer {TOKEN}', 'Content-Type': 'application/json',
                 'User-Agent': 'profile-activity-card'})
    with urllib.request.urlopen(req, timeout=30) as r:
        payload = json.load(r)
    if 'errors' in payload:
        raise SystemExit(payload['errors'])
    return payload['data']['user']


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def text(x, y, s, cls, size, fill, anchor='start', delay=None):
    anim = f' class="{cls} r" style="animation-delay:{delay}ms"' if delay is not None else f' class="{cls}"'
    return (f'<text x="{x}" y="{y}"{anim} font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}">{esc(s)}</text>')


def mono_width(s, size):
    return len(s) * size * (0.6 + 0.14)


def streaks(days):
    longest = run = 0
    for d in days:
        run = run + 1 if d['contributionCount'] else 0
        longest = max(longest, run)
    current = 0
    # Today's square may still be empty early in the day; do not break the streak on it.
    tail = days[:-1] if days and not days[-1]['contributionCount'] else days
    for d in reversed(tail):
        if not d['contributionCount']:
            break
        current += 1
    return longest, current


def render(user):
    cal = user['contributionsCollection']['contributionCalendar']
    weeks = cal['weeks']
    days = [d for w in weeks for d in w['contributionDays']]
    total = cal['totalContributions']
    longest, current = streaks(days)
    best = max(days, key=lambda d: d['contributionCount'])
    active = sum(1 for d in days if d['contributionCount'])
    since = dt.datetime.fromisoformat(user['createdAt'].replace('Z', '+00:00')).year

    sizes = {}
    for repo in user['repositories']['nodes']:
        for e in repo['languages']['edges']:
            name = e['node']['name']
            if name not in SKIP_LANGS:
                sizes[name] = sizes.get(name, 0) + e['size']
    langs = sorted(sizes.items(), key=lambda kv: -kv[1])
    total_bytes = sum(v for _, v in langs) or 1
    top = langs[:6]
    other = total_bytes - sum(v for _, v in top)
    if other > 0:
        top.append(('Other', other))

    counts = sorted(d['contributionCount'] for d in days if d['contributionCount'])
    def q(p):
        return counts[min(len(counts) - 1, int(p * len(counts)))] if counts else 1
    edges = [q(.25), q(.5), q(.75)]

    def level(c):
        if not c:
            return 0
        return 1 + sum(c > e for e in edges)

    W = 1200
    cell, gap = 16, 4
    gx, gy = 64, 330
    H = 640
    fills = {0: INK600, 1: 'rgba(220,251,71,.22)', 2: 'rgba(220,251,71,.45)',
             3: 'rgba(220,251,71,.72)', 4: LIME}

    out = [f'<rect x=".5" y=".5" width="{W-1}" height="{H-1}" rx="8" fill="{INK800}" stroke="{HAIR}"/>',
           text(64, 84, '06 / ACTIVITY', 'c', 16, LIME, delay=0),
           text(61, 152, f'{total:,} contributions in the last year'.replace(',', ' '), 'd', 60, WHITE, delay=80)]

    stats = [(f'{longest}', 'Longest streak, days'), (f'{current}', 'Current streak, days'),
             (f'{active}', 'Active days'), (f'{best["contributionCount"]}', 'On the busiest day'),
             (f'{since}', 'On GitHub since')]
    for i, (num, lab) in enumerate(stats):
        x = 64 + i * 214
        out.append(text(x - 2, 232, num, 'd', 44, WHITE, delay=160 + i * 60))
        out.append(text(x, 264, lab.upper(), 'c', 12, INK200, delay=160 + i * 60))

    # month labels
    last_month = None
    for wi, w in enumerate(weeks):
        first = dt.date.fromisoformat(w['contributionDays'][0]['date'])
        if first.month != last_month and first.day <= 7 and wi < len(weeks) - 2:
            out.append(text(gx + wi * (cell + gap), gy - 14, first.strftime('%b').upper(), 'c', 11, INK200))
        last_month = first.month

    cells = []
    for wi, w in enumerate(weeks):
        for d in w['contributionDays']:
            wd = (dt.date.fromisoformat(d['date']).weekday() + 1) % 7  # Sunday first, as GitHub draws it
            lv = level(d['contributionCount'])
            delay = 300 + (wi + wd) * 14
            cells.append(f'<rect x="{gx + wi * (cell + gap)}" y="{gy + wd * (cell + gap)}" width="{cell}" '
                         f'height="{cell}" rx="2" fill="{fills[lv]}" class="cell" '
                         f'style="animation-delay:{delay}ms"><title>{d["date"]}: '
                         f'{d["contributionCount"]}</title></rect>')
    out.append('<g>' + ''.join(cells) + '</g>')

    ly = gy + 7 * (cell + gap) + 22
    lx = gx + len(weeks) * (cell + gap) - gap
    out.append(text(lx, ly + 12, 'MORE', 'c', 11, INK200, 'end'))
    for i in range(4, -1, -1):
        lx2 = lx - mono_width('MORE', 11) - 14 - (4 - i) * (12 + 4) - 12
        out.append(f'<rect x="{lx2:.1f}" y="{ly + 2}" width="12" height="12" rx="2" fill="{fills[i]}"/>')
    out.append(text(lx - mono_width('MORE', 11) - 14 - 5 * 16 - 8, ly + 12, 'LESS', 'c', 11, INK200, 'end'))

    # languages
    by = 560
    out.append(f'<line x1="64" y1="{by - 44}" x2="{W - 64}" y2="{by - 44}" stroke="{HAIR}"/>')
    out.append(text(64, by - 12, 'LANGUAGES, OWN REPOSITORIES', 'c', 12, INK200))
    x = 64.0
    span = W - 128
    for i, (name, size) in enumerate(top):
        w = span * size / total_bytes
        out.append(f'<rect x="{x:.1f}" y="{by}" width="{max(w - 3, 1):.1f}" height="10" rx="1" '
                   f'fill="{LANG_RAMP[min(i, len(LANG_RAMP) - 1)]}" class="bar" '
                   f'style="animation-delay:{900 + i * 80}ms"/>')
        x += w
    lx = 64
    for i, (name, size) in enumerate(top):
        pct = f'{100 * size / total_bytes:.1f}%'
        color = LANG_RAMP[min(i, len(LANG_RAMP) - 1)]
        out.append(f'<rect x="{lx}" y="{by + 38}" width="10" height="10" rx="1" fill="{color}"/>')
        out.append(text(lx + 20, by + 48, name, 'm', 20, WHITE))
        nw = sum(WIDTHS.get(ch, .56) for ch in name) * 20 - .01 * 20 * len(name)
        out.append(text(lx + 28 + nw, by + 48, pct, 'c', 12, INK200))
        lx += 20 + nw + 8 + mono_width(pct, 12) + 30
        if lx > W - 200:
            break

    out.append(text(W - 64, 84, f'UPDATED {dt.date.today().isoformat()}', 'c', 12, INK200, 'end'))

    fonts = json.load(open(os.path.join(os.path.dirname(__file__), 'fonts.json')))
    faces = ''.join(f"@font-face{{font-family:K{k};src:url(data:font/woff2;base64,{fonts[k]}) format('woff2')}}"
                    for k in 'dmc')
    css = (faces +
           ".d{font-family:Kd,Archivo,Helvetica,Arial,sans-serif;letter-spacing:-.035em}"
           ".m{font-family:Km,Archivo,Helvetica,Arial,sans-serif;letter-spacing:-.01em}"
           ".c{font-family:Kc,'JetBrains Mono',ui-monospace,Menlo,monospace;letter-spacing:.14em}"
           f".r{{opacity:0;animation:rise .64s {EASE} forwards}}"
           "@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}"
           f".cell{{opacity:0;animation:pop .5s {EASE} forwards}}"
           "@keyframes pop{from{opacity:0}to{opacity:1}}"
           f".bar{{transform-box:fill-box;transform-origin:left;transform:scaleX(0);animation:grow .9s {EASE} forwards}}"
           "@keyframes grow{to{transform:scaleX(1)}}"
           "@media (prefers-reduced-motion:reduce){*{animation:none!important}.r,.cell{opacity:1}.bar{transform:none}}")
    label = f'{total} contributions in the last year; longest streak {longest} days.'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
           f'role="img" aria-label="{esc(label)}"><title>{esc(label)}</title><style>{css}</style>'
           + ''.join(out) + '</svg>')
    with open(OUT, 'w') as f:
        f.write(svg)
    print(f'wrote {OUT}: {total} contributions, {len(langs)} languages')


if __name__ == '__main__':
    render(fetch())
