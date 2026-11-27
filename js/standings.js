/* Standings page. Everything after the sport (tab, view, year, season type, sort) changes in place: no new URL. */
(function () {
  var F = window.FS, E = F.esc;
  var SPORT = F.sportFromUrl(), C = F.sports[SPORT];
  var CLINCH = { z: 'Clinched first-round bye or home field', y: 'Clinched division', x: 'Clinched playoff spot',
    w: 'Clinched wild card', '*': 'Clinched top seed', e: 'Eliminated', p: 'Clinched Presidents\' Trophy' };

  var state = {
    tab: 'standings',
    view: C.view,
    level: C.levels ? C.levels[0][1] : null,       // college: FBS, FCS, ...
    league: C.leagues ? C.leagues[0][0] : null,    // soccer: MLS, Premier League, ...
    year: null, type: null,                         // null = whatever ESPN calls current
    sort: null, dir: -1,                            // sort = column index
    data: null, seasons: null
  };

  function $(id) { return document.getElementById(id); }

  function path() { return C.soccer ? 'soccer/' + state.league : C.path; }
  function views() {
    if (C.soccer) return state.league === 'usa.1' ? [['Conference', 2], ['Overall', 1]] : [['Table', 0]];
    return C.views;
  }

  function url(level) {
    var q = [];
    if (state.year) q.push('season=' + state.year);
    if (state.type) q.push('seasontype=' + state.type);
    if (level) q.push('level=' + level);
    if (state.level) q.push('group=' + state.level);
    return F.API + 'v2/sports/' + path() + '/standings' + (q.length ? '?' + q.join('&') : '');
  }

  // Every group that lists teams, with the names above it
  function leaves(node, trail, out) {
    var entries = (node.standings && node.standings.entries) || [];
    if (entries.length) out.push({ trail: trail, name: node.name || node.abbreviation || '', entries: entries });
    (node.children || []).forEach(function (c) { leaves(c, trail.concat([c.name || c.abbreviation || '']), out); });
    return out;
  }

  // ── Controls ───────────────────────────────────────────────
  function renderControls() {
    var h = '';
    if (state.tab === 'standings') {
      var v = views();
      if (v.length > 1) {
        h += '<div class="sp-seg" role="group" aria-label="Group by">' + v.map(function (x) {
          return '<button type="button" data-view="' + x[1] + '" class="' + (state.view === x[1] ? 'on' : '') + '" aria-pressed="' + (state.view === x[1]) + '">' + x[0] + '</button>';
        }).join('') + '</div>';
      }
    }
    if (C.levels && C.levels.length > 1) {
      h += '<select class="sp-select" id="sp-level" aria-label="Division">' + C.levels.map(function (l) {
        return '<option value="' + l[1] + '"' + (state.level == l[1] ? ' selected' : '') + '>' + l[0] + '</option>';
      }).join('') + '</select>';
    }
    if (C.leagues) {
      h += '<select class="sp-select" id="sp-league" aria-label="League">' + C.leagues.map(function (l) {
        return '<option value="' + l[0] + '"' + (state.league === l[0] ? ' selected' : '') + '>' + l[1] + '</option>';
      }).join('') + '</select>';
    }
    var seasons = state.seasons || [];
    if (seasons.length) {
      h += '<select class="sp-select" id="sp-year" aria-label="Season">' + seasons.slice(0, 12).map(function (s) {
        return '<option value="' + s.year + '"' + (s.year == state.year ? ' selected' : '') + '>' + E(yearsOf(s)) + '</option>';
      }).join('') + '</select>';
      var cur = seasons.filter(function (s) { return s.year == state.year; })[0];
      var types = ((cur && cur.types) || []).filter(function (t) { return t.hasStandings; });
      if (types.length > 1) {
        h += '<select class="sp-select" id="sp-type" aria-label="Season type">' + types.map(function (t) {
          return '<option value="' + t.id + '"' + (t.id == state.type ? ' selected' : '') + '>' + E(t.name) + '</option>';
        }).join('') + '</select>';
      }
    }
    if (state.sort !== null && state.tab === 'standings') h += '<button type="button" class="sp-reset" id="sp-reset">Back to standings order</button>';
    $('sp-controls').innerHTML = h;
  }

  // ── Tables ─────────────────────────────────────────────────
  var MINE = {};
  function teamCell(row, extra) {
    var t = row.team, abbr = F.teamAbbr(SPORT, t);
    var fav = MINE[SPORT + ':' + abbr] ? '<span class="fs-fav-tag">Your team</span>' : '';
    return '<td class="team-col">' + (extra || '') + '<a class="sp-team" href="' + F.teamUrl(SPORT, abbr) + '">' +
      '<img src="' + E(F.logoOf(t)) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
      '<span class="sp-team-name"><span class="full">' + E(t.displayName) + '</span><span class="short">' + E(t.abbreviation || t.shortDisplayName) + '</span></span></a>' +
      (row.m.clincher && row.m.clincher.displayValue ? '<span class="sp-clinch" title="' + E(CLINCH[row.m.clincher.displayValue] || '') + '">' + E(row.m.clincher.displayValue) + '</span>' : '') +
      fav + '</td>';
  }
  function rowAttrs(row, cls) {
    var abbr = F.teamAbbr(SPORT, row.team), a = '', st = '';
    var fav = MINE[SPORT + ':' + abbr];
    if (SPORT === 'NFL') a += ' data-team="' + E(abbr.toUpperCase()) + '"';   // the header script colors NFL rows in team colors
    if (fav) { cls += ' is-fav'; if (SPORT !== 'NFL') st += '--fav:var(--orange);--fav-text:#fff;'; }
    if (row.note && row.note.color && C.soccer) st += '--zone:' + E(row.note.color) + ';';
    return ' class="' + cls.trim() + '"' + a + (st ? ' style="' + st + '"' : '');
  }
  function cell(col, row, i) {
    var v = col.get(row), d = v ? v.d : '-';
    var cls = state.sort === i ? 'sorted' : '';
    if (/DIFF|GD/.test(col.label) && v && v.v) cls += v.v > 0 ? ' pos' : ' neg';
    return '<td class="' + cls + '">' + E(d === undefined || d === null || d === '' ? '-' : d) + '</td>';
  }
  function header(first, cols, sortable, extraHead) {
    return '<thead><tr>' + (extraHead || '') + '<th class="team-col" scope="col">' + E(first) + '</th>' + cols.map(function (c, i) {
      if (!sortable) return '<th scope="col" title="' + E(c.title || '') + '">' + E(c.label) + '</th>';
      var on = state.sort === i, sortAttr = on ? (state.dir > 0 ? 'ascending' : 'descending') : 'none';
      return '<th scope="col" class="sort' + (on ? ' sorted' + (state.dir > 0 ? ' asc' : '') : '') + '" data-col="' + i + '" title="' + E((c.title || '') + ' (click to sort)') + '" aria-sort="' + sortAttr + '" tabindex="0">' + E(c.label) + '</th>';
    }).join('') + '</tr></thead>';
  }
  function usedCols(rows) {
    // drop columns this sport/season has no data for (WNBA has no divisions, preseason has no splits...)
    return C.cols.filter(function (c) { return rows.some(function (r) { return c.get(r); }); });
  }

  function renderStandings(d) {
    var groups = leaves(d, [], []);
    if (!groups.length) return '<div class="sp-msg">No standings for this season yet.</div>';
    var all = [];
    groups.forEach(function (g) { g.rows = F.orderEntries(SPORT, state.view, g.entries).map(F.parseEntry); all = all.concat(g.rows); });
    var cols = usedCols(all);
    state.cols = cols;
    var h = '', lastTop = null, zones = {};
    groups.forEach(function (g) {
      var top = g.trail.length > 1 ? g.trail[0] : null;
      if (top && top !== lastTop) { h += '<h2 class="sp-group">' + E(top) + '</h2>'; lastTop = top; }
      var rows = state.sort === null ? g.rows : F.sortRows(g.rows, cols[state.sort], state.dir);
      var title = g.trail.length ? g.name : (C.soccer ? leagueName() : F.label(SPORT));
      h += '<div class="sp-scroll"><table class="sp-table">' + header(title, cols, true) + '<tbody>' + rows.map(function (row) {
        if (row.note && row.note.description && C.soccer) zones[row.note.color] = row.note.description;
        var pos = C.soccer && state.sort === null ? '<span class="sp-pos">' + (g.rows.indexOf(row) + 1) + '</span>' : '';
        return '<tr' + rowAttrs(row, row.note && row.note.color && C.soccer ? 'sp-zone' : '') + '>' + teamCell(row, pos) + cols.map(function (c, i) { return cell(c, row, i); }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    });
    var zk = Object.keys(zones);
    if (zk.length) h += '<div class="sp-legend">' + zk.map(function (c) { return '<span><i style="background:' + E(c) + '"></i>' + E(zones[c]) + '</span>'; }).join('') + '</div>';
    return h + clinchLegend(all);
  }

  function clinchLegend(rows) {
    var seen = {};
    rows.forEach(function (r) { var c = r.m.clincher && r.m.clincher.displayValue; if (c && CLINCH[c]) seen[c] = 1; });
    var k = Object.keys(seen);
    return k.length ? '<div class="sp-legend">' + k.map(function (c) { return '<span><b>' + E(c) + '</b>' + E(CLINCH[c]) + '</span>'; }).join('') + '</div>' : '';
  }

  function renderPlayoff(d) {
    var P = C.playoff, groups = leaves(d, [], []);
    if (!groups.length) return '<div class="sp-msg">No playoff picture for this season yet.</div>';
    var all = [];
    var cols = C.cols.filter(function (c) { return ['W', 'L', 'T', 'OTL', 'PTS', 'PCT', 'GB', 'DIV', 'CONF', 'STRK'].indexOf(c.label) >= 0; });
    var h = '<p class="sp-note">' + E(P.note) + '</p>';
    groups.forEach(function (g) {
      var rows = g.entries.map(F.parseEntry);
      all = all.concat(rows);
      cols = cols.filter(function (c) { return rows.some(function (r) { return c.get(r); }); });
      rows.sort(function (a, b) {
        var x = a.m.playoffSeed ? +a.m.playoffSeed.value : 99, y = b.m.playoffSeed ? +b.m.playoffSeed.value : 99;
        return (x || 99) - (y || 99);
      });
      h += '<div class="sp-scroll"><table class="sp-table">' + header(g.name || F.label(SPORT), cols, false, '<th scope="col" class="sp-seed">Seed</th>') +
        '<tbody>' + rows.map(function (row, i) {
          var seed = row.m.playoffSeed ? +row.m.playoffSeed.value : 0;
          var cls = (i + 1 === P.cut ? 'cut ' : '') + (P.playIn && i + 1 > P.cut && i + 1 <= P.playIn ? 'playin' : '');
          if (P.playIn && i + 1 === P.playIn) cls += ' cut';
          return '<tr' + rowAttrs(row, cls) + '><td class="sp-seed">' + (seed || '-') + '</td>' + teamCell(row) +
            cols.map(function (c) { var v = c.get(row); return '<td>' + E(v ? v.d : '-') + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    });
    if (P.playIn) h += '<div class="sp-legend"><span><i style="background:#fbf6ea;border:1px solid var(--rule)"></i>Play-in tournament</span></div>';
    return h + clinchLegend(all);
  }

  // ── Load and draw ──────────────────────────────────────────
  var reqId = 0;
  function load() {
    var my = ++reqId, body = $('sp-body');
    body.classList.add('sp-loading');
    var level = state.tab === 'playoff' ? C.playoff.level : state.view;
    F.json(url(level)).then(function (d) {
      if (my !== reqId) return;
      if (!state.seasons) state.seasons = (d.seasons || []).slice();
      if (!state.seasons.length && d.season) state.seasons = [d.season];
      if (!state.year) {
        var y = d.season && d.season.year;
        var listed = state.seasons.some(function (x) { return x.year == y; });
        state.year = listed ? y : (state.seasons[0] && state.seasons[0].year) || y;
      }
      if (!state.type) {
        var cur = state.seasons.filter(function (s) { return s.year == state.year; })[0];
        var t = ((cur && cur.types) || []).filter(function (x) { return x.hasStandings; });
        var now = Date.now(), pick = t.filter(function (x) { return new Date(x.startDate) <= now; }).pop() || t[t.length - 1];
        // regular season once it has started, otherwise the latest type with standings
        var reg = t.filter(function (x) { return x.id == '2'; })[0];
        if (reg && new Date(reg.startDate) <= now) pick = reg;
        state.type = pick ? pick.id : null;
      }
      MINE = F.myTeams();
      var who = C.soccer ? leagueName() : F.label(SPORT);
      $('sp-title').textContent = who + (state.tab === 'playoff' ? ' Playoff Picture ' : ' Standings ') + seasonName();
      document.title = who + ' Standings ' + seasonName() + ' | Fodder Sports';
      body.innerHTML = state.tab === 'playoff' ? renderPlayoff(d) : renderStandings(d);
      body.classList.remove('sp-loading');
      renderControls();
    }).catch(function () {
      if (my !== reqId) return;
      body.classList.remove('sp-loading');
      body.innerHTML = '<div class="sp-msg">Standings did not load. Check your connection and try again.</div>';
    });
  }
  function leagueName() { return (C.leagues.filter(function (l) { return l[0] === state.league; })[0] || [])[1] || ''; }
  function yearsOf(s) {
    var m = /^\d{4}(-\d{2})?/.exec((s && s.displayName) || '');
    return m ? m[0] : (s ? F.seasonLabel(SPORT, s.year) : '');
  }
  function seasonName() {
    var s = (state.seasons || []).filter(function (x) { return x.year == state.year; })[0];
    return s ? yearsOf(s) : (state.year ? F.seasonLabel(SPORT, state.year) : '');
  }

  function renderTabs() {
    var tabs = [['standings', 'Standings']].concat(C.playoff ? [['playoff', 'Playoff']] : []);
    $('sp-tabs').innerHTML = tabs.map(function (t) {
      return '<button type="button" role="tab" class="sp-tab' + (state.tab === t[0] ? ' on' : '') + '" aria-selected="' + (state.tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
    }).join('');
  }

  function sportsRow() {
    $('sp-sports').innerHTML = Object.keys(F.sports).map(function (k) {
      return '<a href="/standings?sport=' + (k === 'NCAAB' ? 'ncaam' : k.toLowerCase()) + '" class="' + (k === SPORT ? 'on' : '') + '">' + E(F.label(k)) + '</a>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b && b.closest('#sp-tabs')) { state.tab = b.dataset.tab; state.sort = null; renderTabs(); load(); return; }
    b = e.target.closest('[data-view]');
    if (b) { state.view = +b.dataset.view; state.sort = null; load(); return; }
    b = e.target.closest('th[data-col]');
    if (b) { sortBy(+b.dataset.col); return; }
    if (e.target.id === 'sp-reset') { state.sort = null; load(); }
  });
  document.addEventListener('keydown', function (e) {
    var th = e.target.closest && e.target.closest('th[data-col]');
    if (th && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sortBy(+th.dataset.col); }
  });
  function sortBy(i) {
    if (state.sort === i) state.dir = -state.dir; else { state.sort = i; state.dir = -1; }
    load();   // cached, so this only redraws
  }
  document.addEventListener('change', function (e) {
    var id = e.target.id;
    if (id === 'sp-year') { state.year = e.target.value; state.type = null; }
    else if (id === 'sp-type') state.type = e.target.value;
    else if (id === 'sp-level') state.level = e.target.value;
    else if (id === 'sp-league') { state.league = e.target.value; state.seasons = null; state.year = null; state.type = null; state.view = views()[0][1]; }
    else return;
    state.sort = null;
    load();
  });
  window.addEventListener('fs-account', function () { if (state.data !== undefined) load(); });

  if (C.soccer) state.view = views()[0][1];
  sportsRow(); renderTabs(); renderControls(); load();
  F.subnav(SPORT, 'standings');
})();
