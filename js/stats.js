/* Stats page: league leaders, player stats, team stats. Tabs, season, and sorting change in place (no new URL). */
(function () {
  var F = window.FS, E = F.esc;
  var SPORT = F.sportFromUrl(), C = F.sports[SPORT];

  // Player tables. cols: 'cat' = every column in that ESPN category; ['cat','name'] = one column.
  // sort = the column ESPN ranks by first ("cat.name"), asc = lower is better.
  var HOOPS = [
    { label: 'Per game', sort: 'offensive.avgPoints', cols: [['general', 'gamesPlayed'], ['general', 'avgMinutes'], ['offensive', 'avgPoints'],
      ['general', 'avgRebounds'], ['offensive', 'avgAssists'], ['defensive', 'avgSteals'], ['defensive', 'avgBlocks'], ['offensive', 'avgTurnovers'],
      ['offensive', 'fieldGoalPct'], ['offensive', 'avgThreePointFieldGoalsMade'], ['offensive', 'threePointFieldGoalPct'], ['offensive', 'freeThrowPct'],
      ['general', 'doubleDouble']] },
    { label: 'Totals', sort: 'offensive.points', cols: [['general', 'gamesPlayed'], ['general', 'minutes'], ['offensive', 'points'], ['general', 'rebounds'],
      ['offensive', 'assists'], ['defensive', 'steals'], ['defensive', 'blocks'], ['offensive', 'turnovers'], ['offensive', 'fieldGoalsMade'],
      ['offensive', 'fieldGoalsAttempted'], ['offensive', 'threePointFieldGoalsMade'], ['offensive', 'threePointFieldGoalsAttempted'],
      ['offensive', 'freeThrowsMade'], ['offensive', 'freeThrowsAttempted']] }
  ];
  var FOOTBALL = [
    { label: 'Passing', param: 'offense:passing', sort: 'passing.passingYards', cols: [['general', 'gamesPlayed'], 'passing'] },
    { label: 'Rushing', param: 'offense:rushing', sort: 'rushing.rushingYards', cols: [['general', 'gamesPlayed'], 'rushing'] },
    { label: 'Receiving', param: 'offense:receiving', sort: 'receiving.receivingYards', cols: [['general', 'gamesPlayed'], 'receiving'] },
    { label: 'Defense', param: 'defense:defensive', sort: 'defensive.totalTackles', cols: [['general', 'gamesPlayed'], 'defensive', 'defensiveinterceptions'] },
    { label: 'Kicking', param: 'specialTeams:kicking', sort: 'kicking.fieldGoalsMade', cols: [['general', 'gamesPlayed'], 'kicking'] },
    { label: 'Punting', param: 'specialTeams:punting', sort: 'punting.punts', cols: [['general', 'gamesPlayed'], 'punting'] }
  ];
  var GROUPS = {
    NFL: FOOTBALL, NCAAF: FOOTBALL.slice(0, 4),
    NBA: HOOPS, WNBA: HOOPS.slice(0, 1), NCAAB: HOOPS, NCAAW: HOOPS,
    MLB: [
      { label: 'Batting', param: 'batting', sort: 'batting.avg', cols: ['batting'] },
      { label: 'Pitching', param: 'pitching', sort: 'pitching.ERA', asc: true, cols: ['pitching'] }
    ],
    NHL: [
      { label: 'Skaters', param: 'skaters', sort: 'offensive.points', cols: [['general', 'games'], ['offensive', 'goals'], ['offensive', 'assists'],
        ['offensive', 'points'], ['general', 'plusMinus'], ['penalties', 'penaltyMinutes'], ['offensive', 'powerPlayGoals'], ['offensive', 'powerPlayAssists'],
        ['offensive', 'shotsTotal'], ['offensive', 'shootingPct'], ['offensive', 'gameWinningGoals'], ['offensive', 'faceoffPercent'], ['general', 'timeOnIcePerGame']] },
      { label: 'Goalies', param: 'goalies', sort: 'defensive.savePct', cols: [['general', 'games'], ['general', 'wins'], ['general', 'losses'],
        ['defensive', 'overtimeLosses'], ['defensive', 'avgGoalsAgainst'], ['defensive', 'shotsAgainst'], ['defensive', 'goalsAgainst'],
        ['defensive', 'saves'], ['defensive', 'savePct'], ['defensive', 'shutouts']] }
    ],
    Soccer: [{ label: 'Goals', key: 'goalsLeaders' }, { label: 'Assists', key: 'assistsLeaders' }]
  };
  var LOWER_BETTER = /^(ERA|WHIP|GAA|L|LOSSES|TO|PF|INT|BB|ER|GA|E|H|HR|SACK|OTL)$/;   // first click sorts these low-to-high

  var state = {
    tab: 'leaders', group: 0, side: 0, teamCat: null,
    league: C.leagues ? C.leagues[0][0] : null,
    year: null, type: null, sort: null, dir: -1, showAll: false
  };
  function $(id) { return document.getElementById(id); }
  function path() { return C.soccer ? 'soccer/' + state.league : C.path; }
  function q(extra) {
    var a = [];
    if (state.year) a.push('season=' + state.year);
    if (state.type) a.push('seasontype=' + state.type);
    return a.concat(extra || []).join('&');
  }
  function leagueName() { return (C.leagues.filter(function (l) { return l[0] === state.league; })[0] || [])[1] || ''; }

  // ── Team link from a player or leader entry ────────────────
  function teamBits(t) {
    // t: {abbreviation, id, logo} in any of ESPN's shapes
    if (!t || (!t.abbreviation && !t.id)) return { link: '', abbr: '' };
    var pro = !(C.college || C.soccer);
    var key = pro ? String(t.abbreviation || '').toLowerCase() : String(t.id);
    if (window.fsFindTeam) { var f = window.fsFindTeam(SPORT, key); if (f) key = f.abbr; }
    var label = t.abbreviation || t.shortDisplayName || '';
    return { abbr: label, link: '<a href="' + F.teamUrl(SPORT, key) + '">' + E(label) + '</a>' };
  }

  // ── Leaders ────────────────────────────────────────────────
  function leadersUrl() {
    if (C.soccer) return F.API + 'site/v2/sports/' + path() + '/statistics' + (state.year ? '?season=' + state.year : '');
    return F.WEB + 'site/v3/sports/' + path() + '/leaders?limit=5' + (q() ? '&' + q() : '');
  }
  function leaderVal(l, soccerKey) {
    if (soccerKey) return l.value != null ? String(l.value) : (/(\d+)\s*$/.exec(l.displayValue || '') || [])[1] || '';
    var d = l.displayValue;
    return /^\d{4,}$/.test(d || '') ? Number(d).toLocaleString('en-US') : d;
  }
  function card(title, list, soccerKey) {
    list = list.slice(0, 5);
    if (!list.length) return '';
    var top = list[0], a = top.athlete || {}, tb = teamBits(top.team || a.team);
    var hs = a.headshot && a.headshot.href ? a.headshot.href : '';
    return '<div class="ld-card"><h3>' + E(title) + '</h3>' +
      '<div class="ld-top">' + (hs ? '<img class="hs" src="' + E(hs) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' : '') +
      '<div class="who"><div class="nm">' + E(a.displayName || '') + '</div><div class="tm">' + tb.link +
      (a.position && a.position.abbreviation ? ' · ' + E(a.position.abbreviation) : '') + '</div></div>' +
      '<div class="val">' + E(leaderVal(top, soccerKey)) + '</div></div>' +
      list.slice(1).map(function (l, i) {
        var la = l.athlete || {}, t = teamBits(l.team || la.team);
        return '<div class="ld-row"><span class="rk">' + (i + 2) + '</span><span class="nm">' + E(la.displayName || '') + '</span>' +
          '<span class="tm">' + t.link + '</span><span class="val">' + E(leaderVal(l, soccerKey)) + '</span></div>';
      }).join('') + '</div>';
  }
  function renderLeaders(d) {
    if (C.soccer) {
      var st = d.stats || [];
      var h = st.map(function (s) { return card(s.displayName || s.name, s.leaders || [], s.name); }).join('');
      return h ? '<div class="ld-grid">' + h + '</div>' : '<div class="sp-msg">No leaders for this season yet.</div>';
    }
    var cats = ((d.leaders && d.leaders.categories) || []);
    var by = {}; cats.forEach(function (c) { by[c.name] = c; });
    var order = (C.leaders || []).filter(function (n) { return by[n]; });
    if (!order.length) order = cats.slice(0, 8).map(function (c) { return c.name; });
    var h2 = order.map(function (n) { return card(by[n].displayName, by[n].leaders || []); }).join('');
    return h2 ? '<div class="ld-grid">' + h2 + '</div>' : '<div class="sp-msg">No leaders for this season yet.</div>';
  }

  // ── Player tables ──────────────────────────────────────────
  function playersUrl(g) {
    var sort = state.sort || (g.sort + ':' + (g.asc ? 'asc' : 'desc'));
    var extra = ['region=us', 'lang=en', 'contentorigin=espn', 'isqualified=true', 'limit=100', 'sort=' + sort];
    if (g.param) extra.push('category=' + g.param);
    return F.WEB + 'common/v3/sports/' + path() + '/statistics/byathlete?' + q(extra);
  }
  function buildCols(d, g) {
    var idx = {};
    (d.categories || []).forEach(function (c) { if (c.labels && c.labels.length && !idx[c.name]) idx[c.name] = c; });
    var cols = [];
    g.cols.forEach(function (spec) {
      if (typeof spec === 'string') {
        var c = idx[spec]; if (!c) return;
        c.names.forEach(function (n, i) { cols.push({ cat: spec, name: n, label: c.labels[i], title: (c.displayNames || [])[i] || '' }); });
      } else {
        var c2 = idx[spec[0]]; if (!c2) return;
        var i2 = c2.names.indexOf(spec[1]); if (i2 < 0) return;
        cols.push({ cat: spec[0], name: spec[1], label: c2.labels[i2], title: (c2.displayNames || [])[i2] || '' });
      }
    });
    // ESPN repeats some columns inside a category (two AVG for returns); keep them but drop exact duplicates
    var seen = {};
    return cols.filter(function (c) { var k = c.cat + '.' + c.name; if (seen[k]) return false; seen[k] = 1; return true; });
  }
  function val(entry, col, catIdx) {
    var c = (entry.categories || []).filter(function (x) { return x.name === col.cat; })[0];
    if (!c) return '-';
    var i = catIdx[col.cat].names.indexOf(col.name);
    return c.totals && c.totals[i] != null ? c.totals[i] : '-';
  }
  function renderPlayers(d, g) {
    var cols = buildCols(d, g);
    var catIdx = {};
    (d.categories || []).forEach(function (c) { if (c.labels && c.labels.length && !catIdx[c.name]) catIdx[c.name] = c; });
    var rows = d.athletes || [];
    if (!rows.length || !cols.length) return '<div class="sp-msg">No player stats for this season yet.</div>';
    var curSort = state.sort || (g.sort + ':' + (g.asc ? 'asc' : 'desc'));
    var shown = state.showAll ? rows : rows.slice(0, 50);
    var h = '<div class="sp-scroll"><table class="sp-table sp-stats"><thead><tr><th class="rk">#</th><th class="team-col" scope="col">Player</th>' +
      cols.map(function (c, i) {
        var key = c.cat + '.' + c.name, on = curSort.indexOf(key + ':') === 0, asc = /:asc$/.test(curSort);
        return '<th scope="col" class="sort' + (on ? ' sorted' + (asc ? ' asc' : '') : '') + '" data-pcol="' + i + '" tabindex="0" title="' + E(c.title + ' (click to sort)') +
          '" aria-sort="' + (on ? (asc ? 'ascending' : 'descending') : 'none') + '">' + E(c.label) + '</th>';
      }).join('') + '</tr></thead><tbody>' +
      shown.map(function (e, r) {
        var a = e.athlete || {};
        var t = teamBits({ abbreviation: a.teamShortName, id: a.teamId });
        return '<tr><td class="rk">' + (r + 1) + '</td><td class="team-col pl">' + E(a.displayName) +
          '<span class="tm">' + t.link + (a.position && a.position.abbreviation ? ' · ' + E(a.position.abbreviation) : '') + '</span></td>' +
          cols.map(function (c) {
            var key = c.cat + '.' + c.name;
            return '<td class="' + (curSort.indexOf(key + ':') === 0 ? 'sorted' : '') + '">' + E(val(e, c, catIdx)) + '</td>';
          }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    if (!state.showAll && rows.length > 50) h += '<button type="button" class="sp-reset" id="st-more">Show all ' + rows.length + '</button>';
    state.cols = cols;
    return h;
  }
  function renderSoccerPlayers(d, g) {
    var s = (d.stats || []).filter(function (x) { return x.name === g.key; })[0];
    var list = (s && s.leaders) || [];
    if (!list.length) return '<div class="sp-msg">No player stats for this season yet.</div>';
    return '<div class="sp-scroll"><table class="sp-table sp-stats"><thead><tr><th class="rk">#</th><th class="team-col" scope="col">Player</th><th>Team</th><th>' + E(g.label) + '</th><th>Matches</th></tr></thead><tbody>' +
      list.map(function (l, i) {
        var a = l.athlete || {}, t = teamBits(l.team || a.team);
        var m = /Matches:\s*(\d+)/.exec(l.displayValue || '');
        return '<tr><td class="rk">' + (i + 1) + '</td><td class="team-col pl">' + E(a.displayName) + '</td><td>' + t.link + '</td><td><b>' + E(leaderVal(l, true)) + '</b></td><td>' + (m ? m[1] : '-') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  // ── Team tables ────────────────────────────────────────────
  function teamsUrl() {
    return F.WEB + 'common/v3/sports/' + path() + '/statistics/byteam?' + q(['region=us', 'lang=en', 'contentorigin=espn', 'limit=400']);
  }
  function renderTeams(d) {
    var cats = (d.categories || []).filter(function (c) { return c.labels && c.labels.length; });
    var seen = {}; cats = cats.filter(function (c) { if (seen[c.name]) return false; seen[c.name] = 1; return true; });
    if (!cats.length || !(d.teams || []).length) return '<div class="sp-msg">No team stats for this season yet.</div>';
    if (!state.teamCat || !seen[state.teamCat]) {
      var pref = ['offensive', 'passing', 'batting'].filter(function (n) { return seen[n]; })[0];
      state.teamCat = pref || (cats.filter(function (c) { return c.name !== 'general'; })[0] || cats[0]).name;
    }
    var cat = cats.filter(function (c) { return c.name === state.teamCat; })[0];
    var hasOpp = (d.teams[0].categories || []).some(function (c) { return /^Opponent/.test(c.displayName || ''); });
    var rows = d.teams.map(function (t) {
      var mine = (t.categories || []).filter(function (c) { return c.name === cat.name; });
      var pick = hasOpp ? mine.filter(function (c) { return state.side ? /^Opponent/.test(c.displayName || '') : !/^Opponent/.test(c.displayName || ''); })[0] : mine[0];
      return { team: t.team, vals: (pick && pick.totals) || [] };
    });
    var count = {}; cat.labels.forEach(function (l) { count[l] = (count[l] || 0) + 1; });
    var cols = cat.labels.map(function (l, i) {
      var nm = (cat.names || [])[i] || '';
      if (count[l] > 1 && /^avg/.test(nm) && !/\/G$/.test(l)) l = l + '/G';
      return { label: l, title: (cat.displayNames || [])[i] || '', get: function (r) { var v = r.vals[i]; return v == null ? null : { d: v, v: F.num(v) }; } };
    });
    if (state.sort !== null) rows = F.sortRows(rows, cols[state.sort], state.dir);
    var h = '<div class="sp-cats" id="st-teamcats">' + cats.map(function (c) {
      return '<button type="button" data-tcat="' + E(c.name) + '" class="' + (c.name === cat.name ? 'on' : '') + '">' + E(catName(c.name)) + '</button>';
    }).join('') + '</div>';
    if (hasOpp) {
      h = '<div class="sp-controls" style="margin-bottom:12px"><div class="sp-seg" role="group" aria-label="Side">' +
        ['Offense', 'Defense'].map(function (x, i) { return '<button type="button" data-side="' + i + '" class="' + (state.side === i ? 'on' : '') + '">' + x + '</button>'; }).join('') +
        '</div><span class="sp-note" style="margin:0">' + (state.side ? 'What opponents did against each team.' : 'What each team did.') + '</span></div>' + h;
    }
    h += '<div class="sp-scroll"><table class="sp-table sp-stats"><thead><tr><th class="rk">#</th><th class="team-col" scope="col">Team</th>' +
      cols.map(function (c, i) {
        var on = state.sort === i;
        return '<th scope="col" class="sort' + (on ? ' sorted' + (state.dir > 0 ? ' asc' : '') : '') + '" data-col="' + i + '" tabindex="0" title="' + E(c.title + ' (click to sort)') + '" aria-sort="' + (on ? (state.dir > 0 ? 'ascending' : 'descending') : 'none') + '">' + E(c.label) + '</th>';
      }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r, n) {
        var t = r.team, key = F.teamAbbr(SPORT, t);
        return '<tr><td class="rk">' + (n + 1) + '</td><td class="team-col"><a class="sp-team" href="' + F.teamUrl(SPORT, key) + '"><img src="' + E(F.logoOf(t)) +
          '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'"><span class="sp-team-name"><span class="full">' + E(t.displayName) + '</span><span class="short">' + E(t.abbreviation) + '</span></span></a></td>' +
          cols.map(function (c, i) { var v = c.get(r); return '<td class="' + (state.sort === i ? 'sorted' : '') + '">' + E(v ? v.d : '-') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    state.tcols = cols;
    return h;
  }
  function catName(n) {
    var M = { defensiveinterceptions: 'Interceptions', miscellaneous: 'Downs & penalties', returning: 'Returns', general: 'General', offensive: 'Offense', defensive: 'Defense', differential: 'Differential' };
    return M[n] || n.charAt(0).toUpperCase() + n.slice(1);
  }

  // ── Draw ───────────────────────────────────────────────────
  function tabs() {
    var t = [['leaders', 'Leaders'], ['players', 'Players']];
    if (!C.soccer) t.push(['teams', 'Teams']);
    return t;
  }
  function renderTabs() {
    $('sp-tabs').innerHTML = tabs().map(function (t) {
      return '<button type="button" role="tab" class="sp-tab' + (state.tab === t[0] ? ' on' : '') + '" aria-selected="' + (state.tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
    }).join('');
  }
  function years() {
    var now = new Date(), y = now.getFullYear();
    var cur = state.curYear || y, out = [];
    for (var i = 0; i < 10; i++) out.push(cur - i);
    return out;
  }
  function renderControls() {
    var h = '';
    if (C.leagues) h += '<select class="sp-select" id="sp-league" aria-label="League">' + C.leagues.map(function (l) {
      return '<option value="' + l[0] + '"' + (state.league === l[0] ? ' selected' : '') + '>' + l[1] + '</option>';
    }).join('') + '</select>';
    h += '<select class="sp-select" id="sp-year" aria-label="Season">' + years().map(function (y) {
      return '<option value="' + y + '"' + (y == (state.year || state.curYear) ? ' selected' : '') + '>' + F.seasonLabel(SPORT, y, state.league) + '</option>';
    }).join('') + '</select>';
    if (!C.soccer) {
      h += '<select class="sp-select" id="sp-type" aria-label="Season type">' + [['2', 'Regular Season'], ['3', 'Postseason'], ['1', 'Preseason']].map(function (t) {
        return '<option value="' + t[0] + '"' + ((state.type || '2') == t[0] ? ' selected' : '') + '>' + t[1] + '</option>';
      }).join('') + '</select>';
    }
    $('sp-controls').innerHTML = h;
    var groups = GROUPS[SPORT] || [];
    $('st-groups').innerHTML = state.tab === 'players' && groups.length > 1 ? groups.map(function (g, i) {
      return '<button type="button" data-group="' + i + '" class="' + (state.group === i ? 'on' : '') + '">' + E(g.label) + '</button>';
    }).join('') : '';
  }

  var reqId = 0;
  function load() {
    var my = ++reqId, body = $('sp-body'), g = (GROUPS[SPORT] || [])[state.group];
    body.classList.add('sp-loading');
    var u = state.tab === 'leaders' || (state.tab === 'players' && C.soccer) ? leadersUrl() : state.tab === 'players' ? playersUrl(g) : teamsUrl();
    renderControls();
    F.json(u).then(function (d) {
      if (my !== reqId) return;
      var cy = (d.currentSeason && d.currentSeason.year) || (d.requestedSeason && d.requestedSeason.year) || (d.season && d.season.year);
      if (!state.curYear && cy) { state.curYear = cy; renderControls(); }
      var html = state.tab === 'leaders' ? renderLeaders(d) : state.tab === 'players' ? (C.soccer ? renderSoccerPlayers(d, g) : renderPlayers(d, g)) : renderTeams(d);
      body.innerHTML = html;
      body.classList.remove('sp-loading');
      var who = C.soccer ? leagueName() : F.label(SPORT);
      var yr = F.seasonLabel(SPORT, state.year || state.curYear || new Date().getFullYear(), state.league);
      $('sp-title').textContent = who + ' Stats ' + yr;
      document.title = who + ' Stats ' + yr + ' | Fodder Sports';
    }).catch(function () {
      if (my !== reqId) return;
      body.classList.remove('sp-loading');
      body.innerHTML = '<div class="sp-msg">Stats did not load for this selection. Try another season, or check your connection.</div>';
    });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b && b.closest('#sp-tabs')) { state.tab = b.dataset.tab; state.sort = null; state.showAll = false; renderTabs(); load(); return; }
    if ((b = e.target.closest('[data-group]'))) { state.group = +b.dataset.group; state.sort = null; state.showAll = false; load(); return; }
    if ((b = e.target.closest('[data-tcat]'))) { state.teamCat = b.dataset.tcat; state.sort = null; load(); return; }
    if ((b = e.target.closest('[data-side]'))) { state.side = +b.dataset.side; state.sort = null; load(); return; }
    if ((b = e.target.closest('th[data-pcol]'))) { sortPlayers(+b.dataset.pcol); return; }
    if ((b = e.target.closest('th[data-col]'))) { sortTeams(+b.dataset.col); return; }
    if (e.target.id === 'st-more') { state.showAll = true; load(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var th = e.target.closest && e.target.closest('th[data-pcol],th[data-col]');
    if (!th) return;
    e.preventDefault();
    if (th.dataset.pcol) sortPlayers(+th.dataset.pcol); else sortTeams(+th.dataset.col);
  });
  function sortPlayers(i) {
    // ESPN ranks the whole league by that column, so the top of the list is right, not just a re-sort of what is shown
    var c = state.cols[i], key = c.cat + '.' + c.name, g = GROUPS[SPORT][state.group];
    var cur = state.sort || (g.sort + ':' + (g.asc ? 'asc' : 'desc'));
    var dir = cur.indexOf(key + ':') === 0 ? (/:asc$/.test(cur) ? 'desc' : 'asc') : (LOWER_BETTER.test(c.label) ? 'asc' : 'desc');
    state.sort = key + ':' + dir;
    load();
  }
  function sortTeams(i) {
    var c = state.tcols[i];
    if (state.sort === i) state.dir = -state.dir; else { state.sort = i; state.dir = LOWER_BETTER.test(c.label) ? 1 : -1; }
    load();
  }
  document.addEventListener('change', function (e) {
    var id = e.target.id;
    if (id === 'sp-year') state.year = e.target.value;
    else if (id === 'sp-type') state.type = e.target.value;
    else if (id === 'sp-league') { state.league = e.target.value; state.year = null; state.curYear = null; }
    else return;
    state.sort = null; state.showAll = false;
    load();
  });

  $('sp-sports').innerHTML = Object.keys(F.sports).map(function (k) {
    return '<a href="/stats?sport=' + (k === 'NCAAB' ? 'ncaam' : k.toLowerCase()) + '" class="' + (k === SPORT ? 'on' : '') + '">' + E(F.label(k)) + '</a>';
  }).join('');
  renderTabs(); load();
  F.subnav(SPORT, 'stats');
})();
