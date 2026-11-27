"""Builds js/teams-data.js: every team a reader can follow, grouped the way each sport is organized.

Run:  python scripts/build_teams_data.py
Source: ESPN's public standings feed (the same data the Standings page reads), so the groups here
match the Standings page. Rerun once a year (or after realignment) to pick up new teams.

Team ids (abbr) stay what they have always been, so readers' saved teams keep matching:
  pro leagues -> ESPN abbreviation, lowercase (chi, gs, wsh)
  college and soccer -> ESPN team number (333 = Alabama)
"""
import json
import os
import urllib.request

API = 'https://site.api.espn.com/apis/v2/sports/'
OUT = os.path.join(os.path.dirname(__file__), '..', 'js', 'teams-data.js')

# key: (label, espn path, how ids work, sources)
# each source: (level name or None, query string)
SPORTS = [
    ('NFL', 'NFL', 'football/nfl', 'abbr', [(None, 'level=3')]),
    ('NBA', 'NBA', 'basketball/nba', 'abbr', [(None, 'level=3')]),
    ('MLB', 'MLB', 'baseball/mlb', 'abbr', [(None, 'level=3')]),
    ('NHL', 'NHL', 'hockey/nhl', 'abbr', [(None, 'level=3')]),
    ('WNBA', 'WNBA', 'basketball/wnba', 'abbr', [(None, 'level=2')]),
    ('NCAAF', 'NCAAF', 'football/college-football', 'id', [
        ('FBS', 'group=80&level=3'),
        ('FCS', 'group=81&level=3'),
        ('Division II', 'group=57&level=3'),
        ('Division III', 'group=58&level=3'),
    ]),
    ('NCAAB', 'NCAAM', 'basketball/mens-college-basketball', 'id', [('Division I', 'group=50&level=3')]),
    ('NCAAW', 'NCAAW', 'basketball/womens-college-basketball', 'id', [('Division I', 'group=50&level=3')]),
]
SOCCER = [
    ('usa.1', 'MLS'), ('usa.nwsl', 'NWSL'), ('eng.1', 'Premier League'), ('eng.2', 'EFL Championship'),
    ('esp.1', 'La Liga'), ('ita.1', 'Serie A'), ('ger.1', 'Bundesliga'), ('fra.1', 'Ligue 1'),
    ('mex.1', 'Liga MX'),
]
LOGO = {
    'NFL': 'nfl', 'NBA': 'nba', 'MLB': 'mlb', 'NHL': 'nhl', 'WNBA': 'wnba',
    'NCAAF': 'ncaa', 'NCAAB': 'ncaa', 'NCAAW': 'ncaa', 'Soccer': 'soccer',
}
# Ids saved on readers' accounts before a team moved, renamed, or before the list was rebuilt.
# old id -> current id. Readers who picked the old one still match the current team.
ALIASES = {
    'MLB': {'oak': 'ath'},
    'NHL': {'utah': 'uta'},
    'WNBA': {'conn': 'con'},
    'Soccer': {'1138': '362', '18594': '18418', '18924': '18966', '32783': '20232', '528': '187', '10740': '9723'},
}
SHORT_GROUP = {  # conference names as fans say them
    'American Football Conference': 'AFC', 'National Football Conference': 'NFC',
    'American League': 'AL', 'National League': 'NL',
    'Eastern Conference': 'East', 'Western Conference': 'West',
}


def get(path, qs):
    req = urllib.request.Request(API + path + '/standings?' + qs, headers={'User-Agent': 'FodderSports/1.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def leaves(node, trail):
    """Yields (trail of group names, entries) for every group that lists teams."""
    entries = (node.get('standings') or {}).get('entries') or []
    if entries:
        yield trail, entries
    for child in node.get('children') or []:
        yield from leaves(child, trail + [child.get('name') or child.get('abbreviation') or ''])


def team_row(entry, id_mode):
    t = entry['team']
    abbr = (t.get('abbreviation') or '').lower() if id_mode == 'abbr' else str(t['id'])
    row = {'name': t.get('displayName') or t.get('name'), 'abbr': abbr,
           'short': t.get('shortDisplayName') or t.get('name') or ''}
    if abbr != str(t['id']):
        row['id'] = str(t['id'])   # ESPN number, needed for data calls; omitted when it equals abbr
    return row


def build():
    out = {}
    for key, label, path, id_mode, sources in SPORTS:
        teams, seen = [], set()
        for level, qs in sources:
            for trail, entries in leaves(get(path, qs), []):
                # trail is e.g. ['American Football Conference', 'AFC East'] or ['Big Ten Conference']
                group = trail[-1] if trail else label
                parent = SHORT_GROUP.get(trail[0], trail[0]) if len(trail) > 1 else ''
                for e in entries:
                    row = team_row(e, id_mode)
                    if row['abbr'] in seen:
                        continue
                    seen.add(row['abbr'])
                    row['g'] = group
                    if parent:
                        row['p'] = parent
                    if level:
                        row['lv'] = level
                    teams.append(row)
        # sort teams by name inside each group, keep the group order ESPN uses
        order = []
        for t in teams:
            k = (t.get('lv', ''), t['g'])
            if k not in order:
                order.append(k)
        teams.sort(key=lambda t: (order.index((t.get('lv', ''), t['g'])), t['name']))
        out[key] = {'label': label, 'path': path, 'teams': teams,
                    'levels': [s[0] for s in sources] if sources[0][0] else None}
        print(f'{key}: {len(teams)} teams')

    soccer, seen = [], set()
    for slug, name in SOCCER:
        for trail, entries in leaves(get('soccer/' + slug, ''), []):
            for e in entries:
                row = team_row(e, 'id')
                key = (slug, row['abbr'])
                if key in seen:
                    continue
                seen.add(key)
                row['g'] = name
                row['lv'] = name
                row['lg'] = slug
                soccer.append(row)
    soccer.sort(key=lambda t: ([n for _, n in SOCCER].index(t['lv']), t['name']))
    out['Soccer'] = {'label': 'Soccer', 'path': 'soccer', 'teams': soccer, 'levels': [n for _, n in SOCCER]}
    print(f'Soccer: {len(soccer)} teams')
    return out


def write(data):
    lines = [
        '/* Fodder Sports: every team a reader can follow, by sport.',
        '   Built by scripts/build_teams_data.py from ESPN. Do not edit by hand; rerun the script.',
        '   abbr = the id saved on a reader\'s account (pro: ESPN abbreviation; college/soccer: ESPN team number).',
        '   g = division/conference/league the team plays in, p = the group above it, lv = level (FBS, Premier League...). */',
        'window.FS_SPORTS = {',
    ]
    keys = list(data)
    for i, key in enumerate(keys):
        s = data[key]
        logo = LOGO[key]
        lines.append(f'  {key}: {{')
        lines.append(f'    label: {json.dumps(s["label"])}, path: {json.dumps(s["path"])}, levels: {json.dumps(s["levels"])},')
        lines.append(f'    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/{logo}/500/${{abbr}}.png`,')
        lines.append('    teams: [')
        rows = [json.dumps(t, ensure_ascii=False, separators=(',', ':')) for t in s['teams']]
        lines.append('      ' + ',\n      '.join(rows))
        lines.append('    ]')
        lines.append('  }' + (',' if i < len(keys) - 1 else ''))
    lines.append('};')
    lines.append('window.FS_TEAM_ALIASES = ' + json.dumps(ALIASES, separators=(',', ':')) + ';')
    lines.append('''/* Find a team by sport and saved id (old ids are mapped forward). */
window.fsFindTeam = function (sport, abbr) {
  var s = window.FS_SPORTS[sport]; if (!s) return null;
  var a = String(abbr || '').toLowerCase(), al = (window.FS_TEAM_ALIASES[sport] || {})[a];
  if (al) a = al;
  for (var i = 0; i < s.teams.length; i++) if (s.teams[i].abbr === a) return s.teams[i];
  return null;
};
/* Saved picks with old ids, brought up to date. */
window.fsNormalizeTeams = function (teams) {
  var out = {};
  Object.keys(teams || {}).forEach(function (sp) {
    out[sp] = (teams[sp] || []).map(function (t) {
      var f = window.fsFindTeam(sp, t.abbr);
      return f ? { abbr: f.abbr, name: f.name, sport: sp } : t;
    });
  });
  return out;
};''')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print('wrote', os.path.normpath(OUT), os.path.getsize(OUT), 'bytes')


if __name__ == '__main__':
    write(build())
