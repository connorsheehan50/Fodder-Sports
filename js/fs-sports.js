/* Fodder Sports: shared setup for the Standings, Stats, Teams, and team pages.
   Data comes live from ESPN's public data feed (the same one behind ESPN.com), read in the
   visitor's browser, so standings and stats are always current with no script to run.
   Needs js/teams-data.js loaded first. */
(function () {
  var API = 'https://site.api.espn.com/apis/';
  var WEB = 'https://site.web.api.espn.com/apis/';

  // ── Column helpers ─────────────────────────────────────────
  // s('wins') = a main stat; r('home') = a record split (W-L). Each returns {d: shown, v: sort value}.
  function num(x) {
    if (x === null || x === undefined) return null;
    var n = parseFloat(String(x).replace(/,/g, '').replace(/^\+/, ''));
    return isNaN(n) ? null : n;
  }
  function recPct(rec) {
    var p = String(rec || '').split(/[-\s,]/).map(Number);
    if (!p.length || isNaN(p[0]) || isNaN(p[1])) return null;
    var g = p[0] + p[1] + (isNaN(p[2]) ? 0 : p[2]);
    return g ? (p[0] + (isNaN(p[2]) ? 0 : p[2]) / 2) / g : 0;
  }
  function s(name, label, title, fmt) {
    return { label: label, title: title, get: function (row) {
      var st = row.m[name];
      if (!st) return null;
      var d = st.displayValue;
      if (fmt === 'streak') {
        var m = /^([WLTD])(\d+)/.exec(d || '');
        return { d: d, v: m ? (m[1] === 'W' ? 1 : m[1] === 'L' ? -1 : 0) * +m[2] : null };
      }
      if (fmt === 'gb') return { d: d, v: d === '-' ? 0 : num(d) };
      var v = typeof st.value === 'number' ? st.value : num(d);
      return { d: d, v: v };
    } };
  }
  function r(type, label, title) {
    return { label: label, title: title, get: function (row) {
      var st = row.r[type];
      return st ? { d: st.summary, v: recPct(st.summary) } : null;
    } };
  }
  var GB = function (label) { return s('gamesBehind', label || 'GB', 'Games behind', 'gb'); };
  var STRK = s('streak', 'STRK', 'Current streak', 'streak');

  var BASKETBALL = [s('wins', 'W', 'Wins'), s('losses', 'L', 'Losses'), s('winPercent', 'PCT', 'Win percentage'), GB(),
    r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'), r('div', 'DIV', 'Division record'),
    r('conf', 'CONF', 'Conference record'), s('avgPointsFor', 'PPG', 'Points per game'),
    s('avgPointsAgainst', 'OPP PPG', 'Opponent points per game'), s('differential', 'DIFF', 'Average point differential'),
    STRK, r('l10', 'L10', 'Last 10 games')];
  var COLLEGE_HOOPS = [r('conf', 'CONF', 'Conference record'), r('ovr', 'OVR', 'Overall record'),
    s('winPercent', 'PCT', 'Overall win percentage'), r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'),
    s('avgPointsFor', 'PPG', 'Points per game'), s('avgPointsAgainst', 'OPP PPG', 'Opponent points per game'), STRK];

  // ── Sports ─────────────────────────────────────────────────
  // views: label + ESPN level (1 = whole league, 2 = conference/league, 3 = division)
  // playoff: how the Playoff tab groups and where the line goes
  // leaders: the leaderboards shown first on the Stats page (ESPN leader names)
  var SPORTS = {
    NFL: {
      path: 'football/nfl', short: 'NFL', splitYear: false,
      views: [['League', 1], ['Conference', 2], ['Division', 3]], view: 3,
      cols: [s('wins', 'W', 'Wins'), s('losses', 'L', 'Losses'), s('ties', 'T', 'Ties'), s('winPercent', 'PCT', 'Win percentage'),
        r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'), r('div', 'DIV', 'Division record'),
        r('conf', 'CONF', 'Conference record'), s('pointsFor', 'PF', 'Points for'), s('pointsAgainst', 'PA', 'Points against'),
        s('differential', 'DIFF', 'Point differential'), STRK],
      playoff: { level: 2, cut: 7, note: 'Top seven in each conference make the playoffs. The No. 1 seed gets a bye.' },
      leaders: ['passingYards', 'rushingYards', 'receivingYards', 'passingTouchdowns', 'receptions', 'totalTackles', 'sacks', 'interceptions']
    },
    NBA: {
      path: 'basketball/nba', short: 'NBA', splitYear: true,
      views: [['League', 1], ['Conference', 2], ['Division', 3]], view: 2,
      cols: BASKETBALL,
      playoff: { level: 2, cut: 6, playIn: 10, note: 'Top six in each conference make the playoffs. Seven through 10 go to the play-in.' },
      leaders: ['pointsPerGame', 'reboundsPerGame', 'assistsPerGame', 'stealsPerGame', 'blocksPerGame', 'fieldGoalPercentage', '3PointsMadePerGame', 'FreeThrowPct']
    },
    MLB: {
      path: 'baseball/mlb', short: 'MLB', splitYear: false,
      views: [['Overall', 1], ['League', 2], ['Division', 3]], view: 3,
      cols: [s('wins', 'W', 'Wins'), s('losses', 'L', 'Losses'), s('winPercent', 'PCT', 'Win percentage'), GB(),
        r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'), s('pointsFor', 'RS', 'Runs scored'),
        s('pointsAgainst', 'RA', 'Runs allowed'), s('pointDifferential', 'DIFF', 'Run differential'), STRK, r('l10', 'L10', 'Last 10 games')],
      playoff: { level: 2, cut: 6, note: 'Six teams in each league make the playoffs: three division winners and three wild cards.' },
      leaders: ['avg', 'homeRuns', 'RBIs', 'OPS', 'ERA', 'wins', 'strikeouts', 'saves']
    },
    NHL: {
      path: 'hockey/nhl', short: 'NHL', splitYear: true,
      views: [['League', 1], ['Conference', 2], ['Division', 3]], view: 3,
      cols: [s('gamesPlayed', 'GP', 'Games played'), s('wins', 'W', 'Wins'), s('losses', 'L', 'Losses'), s('otLosses', 'OTL', 'Overtime losses'),
        s('points', 'PTS', 'Points'), s('regWins', 'RW', 'Regulation wins'), s('rotWins', 'ROW', 'Regulation and overtime wins'),
        r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'), s('pointsFor', 'GF', 'Goals for'),
        s('pointsAgainst', 'GA', 'Goals against'), s('pointDifferential', 'DIFF', 'Goal differential'), r('l10', 'L10', 'Last 10 games'), STRK],
      playoff: { level: 2, cut: 8, note: 'Eight teams in each conference make the playoffs: the top three in each division plus two wild cards.' },
      leaders: ['goals', 'assists', 'points', 'plusMinus', 'penaltyMinutes', 'wins', 'savePct', 'avgGoalsAgainst']
    },
    NCAAF: {
      path: 'football/college-football', short: 'CFB', splitYear: false, college: true,
      levels: [['FBS', 80], ['FCS', 81], ['Division II', 57], ['Division III', 58]],
      views: [['Conference', 3]], view: 3,
      cols: [r('conf', 'CONF', 'Conference record'), r('ovr', 'OVR', 'Overall record'), s('pointsFor', 'PF', 'Points for'),
        s('pointsAgainst', 'PA', 'Points against'), r('home', 'HOME', 'Home record'), r('away', 'AWAY', 'Road record'),
        r('ap', 'VS AP', 'Record against AP Top 25 teams'), STRK],
      leaders: ['passingYards', 'rushingYards', 'receivingYards', 'passingTouchdowns', 'rushingTouchdowns', 'totalTackles', 'sacks', 'interceptions']
    },
    NCAAB: {
      path: 'basketball/mens-college-basketball', short: 'NCAAM', splitYear: true, college: true,
      levels: [['Division I', 50]], views: [['Conference', 3]], view: 3, cols: COLLEGE_HOOPS,
      leaders: ['pointsPerGame', 'reboundsPerGame', 'assistsPerGame', 'stealsPerGame', 'blocksPerGame', 'fieldGoalPercentage', '3PointsMadePerGame', 'FreeThrowPct']
    },
    NCAAW: {
      path: 'basketball/womens-college-basketball', short: 'NCAAW', splitYear: true, college: true,
      levels: [['Division I', 50]], views: [['Conference', 3]], view: 3, cols: COLLEGE_HOOPS,
      leaders: ['pointsPerGame', 'reboundsPerGame', 'assistsPerGame', 'stealsPerGame', 'blocksPerGame', 'fieldGoalPercentage', '3PointsMadePerGame', 'FreeThrowPct']
    },
    WNBA: {
      path: 'basketball/wnba', short: 'WNBA', splitYear: false,
      views: [['League', 1], ['Conference', 2]], view: 2, cols: BASKETBALL,
      playoff: { level: 1, cut: 8, note: 'The top eight teams in the league make the playoffs.' },
      leaders: ['pointsPerGame', 'reboundsPerGame', 'assistsPerGame', 'stealsPerGame', 'blocksPerGame', 'fieldGoalPercentage', '3PointsMadePerGame', 'FreeThrowPct']
    },
    Soccer: {
      path: 'soccer', short: 'Soccer', splitYear: true, soccer: true,
      leagues: [['usa.1', 'MLS'], ['usa.nwsl', 'NWSL'], ['eng.1', 'Premier League'], ['eng.2', 'EFL Championship'],
        ['esp.1', 'La Liga'], ['ita.1', 'Serie A'], ['ger.1', 'Bundesliga'], ['fra.1', 'Ligue 1'], ['mex.1', 'Liga MX']],
      views: [['Table', 0]], view: 0,
      cols: [s('gamesPlayed', 'GP', 'Games played'), s('wins', 'W', 'Wins'), s('ties', 'D', 'Draws'), s('losses', 'L', 'Losses'),
        s('pointsFor', 'F', 'Goals for'), s('pointsAgainst', 'A', 'Goals against'), s('pointDifferential', 'GD', 'Goal difference'),
        s('points', 'P', 'Points')]
    }
  };
  // Keys readers see in links (?sport=nfl) -> the keys the site uses everywhere else
  var URL_KEYS = { nfl: 'NFL', nba: 'NBA', mlb: 'MLB', nhl: 'NHL', ncaaf: 'NCAAF', cfb: 'NCAAF', ncaab: 'NCAAB', ncaam: 'NCAAB',
    ncaaw: 'NCAAW', wnba: 'WNBA', soccer: 'Soccer' };
  var LABEL = { NCAAB: 'NCAAM' };

  var cache = {};
  function json(url) {
    if (!cache[url]) {
      cache[url] = fetch(url).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }).catch(function (e) { delete cache[url]; throw e; });
    }
    return cache[url];
  }

  function esc(x) {
    return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Splits a standings entry into main stats (m) and records (r: ovr, home, away, div, conf, l10, ap)
  var REC = { total: 'ovr', home: 'home', homerecord: 'home', road: 'away', awayrecord: 'away', vsdiv: 'div', vsdivision: 'div',
    intradivision: 'div', vsconf: 'conf', intraleague: 'conf', lasttengames: 'l10', vsaprankedteams: 'ap' };
  function parseEntry(e) {
    var m = {}, rec = {};
    (e.stats || []).forEach(function (st) {
      if ('summary' in st) {
        var k = REC[st.type];
        if (k && !rec[k]) rec[k] = st;
        return;
      }
      var key = st.name || st.type;
      if (key && !(key in m)) m[key] = st;   // first one wins: the overall numbers come before the splits
    });
    if (!rec.ovr && m.wins && m.losses) {
      var t = m.ties && +m.ties.value ? '-' + m.ties.displayValue : '';
      rec.ovr = { summary: m.wins.displayValue + '-' + m.losses.displayValue + t };
    }
    return { team: e.team, m: m, r: rec, note: e.note || null };
  }

  function teamAbbr(sport, team) {
    var cfg = window.FS_SPORTS && window.FS_SPORTS[sport];
    var pro = !(SPORTS[sport].college || SPORTS[sport].soccer);
    var a = pro ? String(team.abbreviation || '').toLowerCase() : String(team.id);
    if (cfg && window.fsFindTeam) { var f = window.fsFindTeam(sport, a); if (f) return f.abbr; }
    return a;
  }
  function teamUrl(sport, abbr) {
    return '/team?sport=' + sport.toLowerCase() + '&t=' + encodeURIComponent(abbr);
  }
  function logoOf(team) {
    if (team.logos && team.logos.length) return team.logos[0].href;
    return team.logo || '';
  }
  // league: soccer league slug. MLS and NWSL run inside one calendar year; European leagues span two.
  function seasonLabel(sport, year, league) {
    var split = SPORTS[sport].splitYear && !(league && /^usa\./.test(league));
    return split ? (year - 1) + '-' + String(year).slice(2) : String(year);
  }

  // Teams the signed-in reader follows, as "SPORT:abbr"
  function myTeams() {
    var out = {};
    try {
      var acc = JSON.parse(localStorage.getItem('fs_account') || 'null');
      var t = acc && acc.teams ? (window.fsNormalizeTeams ? window.fsNormalizeTeams(acc.teams) : acc.teams) : {};
      Object.keys(t).forEach(function (sp) { (t[sp] || []).forEach(function (x) { out[sp + ':' + x.abbr] = true; }); });
    } catch (e) {}
    return out;
  }

  // Sortable table header: click a column to sort; click again to flip
  function sortRows(rows, col, dir) {
    return rows.slice().sort(function (a, b) {
      var x = col.get(a), y = col.get(b);
      var xv = x ? x.v : null, yv = y ? y.v : null;
      if (xv === null || xv === undefined || isNaN(xv)) return 1;
      if (yv === null || yv === undefined || isNaN(yv)) return -1;
      if (typeof xv === 'string') return dir * String(xv).localeCompare(String(yv));
      return dir * (xv - yv);
    });
  }

  function sportFromUrl() {
    var q = new URLSearchParams(location.search).get('sport') || 'nfl';
    return URL_KEYS[q.toLowerCase()] || 'NFL';
  }

  // Standings | Stats | Teams links for one sport (the hover menus are not there on phones)
  function subnav(sport, cur) {
    var el = document.getElementById('sp-sub');
    if (!el) return;
    var q = 'sport=' + (sport === 'NCAAB' ? 'ncaam' : sport.toLowerCase());
    el.innerHTML = [['standings', 'Standings'], ['stats', 'Stats'], ['teams', 'Teams']].map(function (x) {
      return '<a href="/' + x[0] + '?' + q + '"' + (x[0] === cur ? ' class="on" aria-current="page"' : '') + '>' + x[1] + '</a>';
    }).join('');
  }

  window.FS = {
    subnav: subnav,
    API: API, WEB: WEB, sports: SPORTS, label: function (k) { return LABEL[k] || k; },
    json: json, esc: esc, num: num, parseEntry: parseEntry, teamAbbr: teamAbbr, teamUrl: teamUrl, logoOf: logoOf,
    seasonLabel: seasonLabel, myTeams: myTeams, sortRows: sortRows, sportFromUrl: sportFromUrl, urlKeys: URL_KEYS
  };
})();
