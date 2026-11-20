"""Build every NFL power rankings page from one template.

Input:  data/nfl/power-rankings-history.json  (every week, every team)
Output: nfl/power-rankings-w1.html ... w{N-1}.html, and nfl/power-rankings.html for the latest week.

Each page carries its own week's data inside the page, so an old week never changes
when a new week is published. To add a week: append it to the history file and rerun:
    python3 scripts/build_power_rankings.py
"""
import json, re, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "power-rankings-template.html"
HISTORY = ROOT / "data" / "nfl" / "power-rankings-history.json"

hist = json.loads(HISTORY.read_text())
weeks = sorted(int(w) for w in hist["weeks"])
latest = weeks[-1]
tpl = TEMPLATE.read_text()


def page_name(w):
    return "power-rankings.html" if w == latest else f"power-rankings-w{w}.html"


def nav(w):
    links = []
    for x in weeks:
        cls = ' class="current"' if x == w else ""
        links.append(f'      <a href="{page_name(x)}"{cls}>Week {x}</a>')
    return "\n".join(links)


for w in weeks:
    wk = hist["weeks"][str(w)]
    title = wk["title"]
    history = {}
    for x in weeks:
        if x > w:
            break
        for t in hist["weeks"][str(x)]["teams"]:
            history.setdefault(t["abbr"], {})[str(x)] = t["rank"]
    top4 = [t["abbr"] for t in sorted(wk["teams"], key=lambda t: t["rank"])[:4]]
    data = {"updated": wk["updated"], "week": w, "teams": sorted(wk["teams"], key=lambda t: t["rank"])}

    out = tpl
    out = out.replace("{{TITLE_TAG}}", html.escape(f"{title} — NFL Power Rankings, Week {w} — Fodder Sports"))
    out = out.replace("{{WEEK}}", str(w))
    out = out.replace("{{H1}}", html.escape(title))
    out = out.replace("{{WEEK_NAV}}", nav(w))
    out = out.replace("{{RANK_HISTORY}}", json.dumps(history))
    out = out.replace("{{WEEKS}}", json.dumps(list(range(1, w + 1))))
    out = out.replace("{{DEFAULT_TEAMS}}", json.dumps(top4))
    out = out.replace("{{WEEK_DATA}}", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    if w == 1:  # one week of data has no line to draw
        out = out.replace('<div class="chart-container">', '<div class="chart-container" style="display:none">', 1)
    assert "{{" not in out, re.findall(r"\{\{\w+\}\}", out)
    (ROOT / "nfl" / page_name(w)).write_text(out)
    print("wrote", page_name(w), "-", title)
