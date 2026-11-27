"""Rewrites the source labels on article pages to the publication's name.

Run:  python scripts/clean_source_labels.py
- drops feed-plumbing notes such as "(RSS-Bridge)"
- turns a web address ("jaguars.com", "sun-sentinel.com/sports/nfl/miami-dolphins") into the name in data/publications.json
- a feed host ("feeds.feedburner.com") is named from the article link instead
Labels already written as names are left alone. Prints any web address it could not name, so it can be added to the list.
"""
import glob
import html
import json
import os
import re
from urllib.parse import urlparse

ROOT = os.path.join(os.path.dirname(__file__), '..')
NAMES = {k.lower(): v for k, v in json.load(open(os.path.join(ROOT, 'data', 'publications.json'), encoding='utf-8')).items() if not k.startswith('_')}
FEED_HOSTS = {'feeds.feedburner.com', 'feedproxy.google.com', 'rss.app', 'feeds.megaphone.fm'}
PLUMBING = re.compile(r'\s*\((?:rss[\s-]*bridge|rss|feed|feedburner)\)\s*', re.I)
# <a href="URL" ...>headline</a> <span class="src-out">- LABEL</span>
PAIR = re.compile(r'(<a\b[^>]*href="([^"]*)"[^>]*>(?:(?!</a>).)*</a>\s*<span class="src-out">- )([^<]*)(</span>)', re.S)
LONE = re.compile(r'(<span class="src-out">- )([^<]*)(</span>)')


def looks_like_address(s):
    return ' ' not in s and '.' in s


def name_for(label, href=''):
    raw = html.unescape(label)
    clean = PLUMBING.sub('', raw).strip()
    key = clean.lower().removeprefix('www.')
    if key in NAMES:
        return NAMES[key]
    if looks_like_address(key):
        if key in FEED_HOSTS or key.split('/')[0] in NAMES:
            host = urlparse(href).netloc.lower().removeprefix('www.') if href else ''
            for k in (host, key.split('/')[0]):
                if k and k in NAMES:
                    return NAMES[k]
        unknown.add(key)
    return clean


unknown = set()


def fix(text):
    def pair(m):
        new = name_for(m.group(3), m.group(2))
        return m.group(1) + html.escape(new, quote=False) + m.group(4)
    text = PAIR.sub(pair, text)
    return LONE.sub(lambda m: m.group(1) + html.escape(name_for(m.group(2)), quote=False) + m.group(3), text)


if __name__ == '__main__':
    changed = 0
    for path in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
        src = open(path, encoding='utf-8').read()
        if 'src-out' not in src:
            continue
        out = fix(src)
        if out != src:
            open(path, 'w', encoding='utf-8').write(out)
            changed += 1
    print('pages changed:', changed)
    if unknown:
        print('web addresses with no name yet (add to data/publications.json):', ', '.join(sorted(unknown)))
