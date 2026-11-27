/* Teams directory: /teams?sport=nfl. Every team, grouped the way the sport is organized, with a search box. */
(function () {
  var F = window.FS, E = F.esc;
  var SPORT = F.sportFromUrl(), S = window.FS_SPORTS[SPORT];
  var levels = S.levels || [null];
  var state = { level: levels[0], q: '' };
  function $(id) { return document.getElementById(id); }

  $('sp-sports').innerHTML = Object.keys(F.sports).map(function (k) {
    return '<a href="/teams?sport=' + (k === 'NCAAB' ? 'ncaam' : k.toLowerCase()) + '" class="' + (k === SPORT ? 'on' : '') + '">' + E(F.label(k)) + '</a>';
  }).join('');
  $('sp-title').textContent = F.label(SPORT) + ' Teams';
  document.title = F.label(SPORT) + ' Teams | Fodder Sports';

  function controls() {
    if (levels.length < 2 || state.q) { $('sp-controls').innerHTML = ''; return; }
    $('sp-controls').innerHTML = levels.length > 4
      ? '<select class="sp-select" id="td-level" aria-label="League">' + levels.map(function (l) {
          return '<option' + (state.level === l ? ' selected' : '') + '>' + E(l) + '</option>';
        }).join('') + '</select>'
      : '<div class="sp-seg" role="group" aria-label="Division">' + levels.map(function (l) {
          return '<button type="button" data-level="' + E(l) + '" class="' + (state.level === l ? 'on' : '') + '" aria-pressed="' + (state.level === l) + '">' + E(l) + '</button>';
        }).join('') + '</div>';
  }

  function draw() {
    var q = state.q.toLowerCase();
    // a search looks across every level; otherwise show the chosen level
    var teams = S.teams.filter(function (t) {
      if (q) return (t.name + ' ' + t.short + ' ' + t.g).toLowerCase().indexOf(q) >= 0;
      return !t.lv || !state.level || t.lv === state.level;
    });
    var groups = [], by = {};
    teams.forEach(function (t) {
      var k = (q && t.lv ? t.lv + ' · ' : '') + t.g;
      if (!by[k]) { by[k] = []; groups.push(k); }
      by[k].push(t);
    });
    var mine = F.myTeams();
    $('sp-body').innerHTML = teams.length ? '<div class="td-groups">' + groups.map(function (g) {
      return '<div class="td-group"><h3>' + E(g) + '</h3>' + by[g].map(function (t) {
        return '<a href="' + F.teamUrl(SPORT, t.abbr) + '"><img src="' + E(S.logo(t.abbr)) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
          E(t.name) + (mine[SPORT + ':' + t.abbr] ? '<span class="fs-fav-tag" style="--fav:var(--orange);--fav-text:#fff">Yours</span>' : '') + '</a>';
      }).join('') + '</div>';
    }).join('') + '</div>' : '<div class="sp-msg">No teams match “' + E(state.q) + '”.</div>';
    controls();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-level]');
    if (b) { state.level = b.dataset.level; draw(); }
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'td-level') { state.level = e.target.value; draw(); } });
  $('td-search').addEventListener('input', function (e) { state.q = e.target.value.trim(); draw(); });
  draw();
  F.subnav(SPORT, 'teams');
})();
