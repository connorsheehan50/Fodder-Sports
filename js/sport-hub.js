/* Section page for each sport other than the NFL (/nba/, /mlb/, /nhl/, /cfb/, /ncaam/, /ncaaw/, /wnba/, /soccer/).
   Same tabs as the NFL page. Stories come from data/<slug>/feed.json (same format as data/nfl/feed.json),
   so the publishing skills can start filling a sport just by adding items there. */
(function () {
  var F = window.FS, E = F.esc;
  var SLUG = location.pathname.split('/').filter(Boolean)[0];
  var SPORT = F.sportFromUrl(), C = F.sports[SPORT], S = window.FS_SPORTS[SPORT];
  var LABEL = F.label(SPORT), q = new URLSearchParams(location.search), TAB = q.get('tab') || 'all';
  var NAMES = { preview: 'game previews', recap: 'game recaps', trade: 'trades', breaking: 'breaking news' };
  var sportQ = 'sport=' + SLUG;
  function $(id) { return document.getElementById(id); }

  document.title = LABEL + ' | Fodder Sports';
  $('page-title').textContent = LABEL;
  $('crumb').textContent = 'Fodder Sports / ' + LABEL;
  $('rk-label').textContent = LABEL + ' / Standings';
  $('footer-note').textContent = 'Summaries written from published coverage. Not affiliated with any league or team.';

  // Tabs: same set and order as the NFL page
  var tabs = [['all', 'All stories'], ['rankings', 'Power rankings'], ['preview', 'Game Previews'], ['recap', 'Recaps'], ['trade', 'Trades'], ['breaking', 'Breaking news']];
  $('tabs').innerHTML = tabs.map(function (t) {
    return '<a href="/' + SLUG + '/' + (t[0] === 'all' ? '' : '?tab=' + t[0]) + '" class="content-tab' + (TAB === t[0] ? ' active' : '') + '">' + t[1] + '</a>';
  }).join('');
  $('feed-note').textContent = TAB === 'all' ? 'All teams · all types' : (tabs.filter(function (t) { return t[0] === TAB; })[0] || [, ''])[1];

  // Team menu: jumps to the team's page
  var groups = [], by = {};
  S.teams.forEach(function (t) {
    var g = (t.lv && t.lv !== t.g ? t.lv + ' · ' : '') + t.g;
    if (!by[g]) { by[g] = []; groups.push(g); }
    by[g].push(t);
  });
  $('hub-team-select').innerHTML = '<option value="">All Teams</option>' + groups.map(function (g) {
    return '<optgroup label="' + E(g) + '">' + by[g].map(function (t) { return '<option value="' + E(t.abbr) + '">' + E(t.name) + '</option>'; }).join('') + '</optgroup>';
  }).join('');
  $('hub-team-select').addEventListener('change', function (e) { if (e.target.value) location.href = F.teamUrl(SPORT, e.target.value); });

  // Stories
  var live = '<a href="/standings?' + sportQ + '">standings</a>, <a href="/stats?' + sportQ + '">stats</a>, and <a href="/teams?' + sportQ + '">every team page</a>';
  function empty(msg) {
    return '<div style="font-family:var(--font-body);font-size:15px;line-height:1.55;color:var(--slate);padding:18px 0;">' + msg +
      ' In the meantime, ' + LABEL + ' ' + live + ' are live.</div>';
  }
  if (TAB === 'rankings') {
    $('feed').innerHTML = empty(LABEL + ' power rankings are coming.');
  } else {
    F.json('/data/' + SLUG + '/feed.json?t=' + Date.now()).catch(function () { return { items: [] }; }).then(function (feed) {
      var items = (feed && feed.items) || [];
      if (TAB !== 'all') items = items.filter(function (i) { return i.type === TAB; });
      $('feed').innerHTML = items.length && window.buildCard ? items.map(window.buildCard).join('')
        : empty('No ' + LABEL + ' ' + (TAB === 'all' ? 'stories' : NAMES[TAB] || 'stories') + ' yet. Fodder Sports ' + LABEL + ' coverage is coming.');
    });
  }

  // Sidebar: current standings, top of each conference or league
  function widget() {
    var el = $('standings-widget');
    if (C.college) { el.innerHTML = '<p style="padding:14px 16px;font-family:var(--font-body);font-size:14px;color:var(--slate);">Conference standings for every ' + LABEL + ' team are on the standings page.</p>'; return; }
    var path = C.soccer ? 'soccer/' + C.leagues[0][0] : C.path;
    var lv = C.soccer ? '' : '?level=' + (C.views.filter(function (v) { return v[1] === 2; })[0] ? 2 : 1);
    F.json(F.API + 'v2/sports/' + path + '/standings' + lv).then(function (d) {
      var leaves = [];
      var level = C.soccer ? 0 : (C.views.filter(function (v) { return v[1] === 2; })[0] ? 2 : 1);
      (function walk(n) { var en = (n.standings && n.standings.entries) || []; if (en.length) leaves.push({ name: n.name, en: F.orderEntries(SPORT, level, en) }); (n.children || []).forEach(walk); })(d);
      var cols = C.cols.filter(function (c) { return (C.soccer ? ['GP', 'P'] : ['W', 'L', 'OTL', 'PTS']).indexOf(c.label) >= 0; });
      var mine = F.myTeams();
      el.innerHTML = leaves.slice(0, 2).map(function (g) {
        return '<div style="padding:10px 16px 2px;font-family:var(--font-head);font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--slate)">' + E(g.name) + '</div>' +
          '<table class="sp-table" style="min-width:0;table-layout:auto;font-size:13px"><tbody>' + g.en.slice(0, 8).map(function (e, i) {
            var r = F.parseEntry(e), ab = F.teamAbbr(SPORT, e.team), fav = mine[SPORT + ':' + ab];
            return '<tr' + (fav ? ' class="is-fav"' : '') + '><td style="width:22px;color:var(--slate)">' + (i + 1) + '</td><td class="team-col" style="width:auto;border-right:none"><a class="sp-team" href="' + F.teamUrl(SPORT, ab) + '"><img src="' + E(F.logoOf(e.team)) + '" alt="" loading="lazy"><span class="sp-team-name">' + E(e.team.shortDisplayName || e.team.displayName) + '</span></a></td>' +
              cols.map(function (c) { var v = c.get(r); return '<td>' + E(v ? v.d : '-') + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table>';
      }).join('');
    }).catch(function () { el.innerHTML = ''; });
  }
  widget();
  $('widget-links').innerHTML = '<a href="/standings?' + sportQ + '">Full standings →</a><a href="/stats?' + sportQ + '">Stats →</a><a href="/teams?' + sportQ + '">All teams →</a>';
})();
