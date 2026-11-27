# Fodder-Sports
## Sections for every sport

Each sport has a section page with the same tabs as the NFL (all stories, power rankings, previews, recaps, trades, breaking news):
`/nba/`, `/mlb/`, `/nhl/`, `/cfb/`, `/ncaam/`, `/ncaaw/`, `/wnba/`, `/soccer/`. The NFL keeps `/nfl/index.html`.

Stories for a sport go in `data/<slug>/feed.json` (same item format as `data/nfl/feed.json`; `type` is preview, recap, trade, or breaking).
Until a feed has items, the page says coverage is coming and points to that sport's standings, stats, and team pages.
Standings (`/standings?sport=nba`), Stats (`/stats?sport=nba`), Teams (`/teams?sport=nba`), and team pages (`/team?sport=nba&t=chi`) read ESPN live.
The full team list is `js/teams-data.js`, built by `python scripts/build_teams_data.py`.
