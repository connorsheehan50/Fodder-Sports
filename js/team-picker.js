/* Team picker shared by signup and account: level choice (FBS/FCS/..., MLS/Premier League/...),
   teams grouped by conference or division, and a search that looks across every level. Needs js/teams-data.js. */
(function () {
  var chosen = {};   // sport -> level the reader is looking at
  function esc(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function jsq(x) { return String(x).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

  function level(sport) {
    var S = window.FS_SPORTS[sport];
    if (!S.levels) return null;
    if (!chosen[sport] || S.levels.indexOf(chosen[sport]) < 0) chosen[sport] = S.levels[0];
    return chosen[sport];
  }

  var css = document.createElement('style');
  css.textContent =
    '.tp-levels{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}' +
    '.tp-level{font-family:var(--font-head);font-size:12px;font-weight:800;letter-spacing:.04em;color:var(--slate);background:var(--card-bg);border:1px solid var(--rule);border-radius:4px;padding:5px 10px;cursor:pointer;}' +
    '.tp-level.on{background:var(--orange);border-color:var(--orange);color:#fff;}' +
    '.tp-search{width:100%;font-family:var(--font-body);font-size:14px;padding:9px 12px;border:1px solid var(--rule);border-radius:6px;background:var(--card-bg);color:var(--ink);margin-bottom:10px;}' +
    '.tp-head{grid-column:1/-1;font-family:var(--font-head);font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--slate);padding:10px 2px 2px;border-bottom:1px solid var(--rule);}' +
    '.tp-head:first-child{padding-top:0;}' +
    '.tp-none{grid-column:1/-1;font-family:var(--font-body);font-size:14px;color:var(--slate);padding:10px 2px;}';
  document.head.appendChild(css);

  window.fsPicker = {
    setLevel: function (sport, lv) { chosen[sport] = lv; },
    // buttons for each level; onPick is the page's function name, called as onPick(sport, level)
    levelsHtml: function (sport, onPick, filter) {
      var S = window.FS_SPORTS[sport];
      if (!S.levels || S.levels.length < 2 || filter) return '';
      var cur = level(sport);
      return S.levels.map(function (lv) {
        return '<button type="button" class="tp-level' + (lv === cur ? ' on' : '') + '" aria-pressed="' + (lv === cur) + '" onclick="' + onPick + '(\'' + jsq(sport) + '\',\'' + jsq(lv) + '\')">' + esc(lv) + '</button>';
      }).join('');
    },
    // the grid: group headers, then team buttons. click(t) returns the onclick code for a team.
    gridHtml: function (sport, selected, filter, click) {
      var S = window.FS_SPORTS[sport], q = String(filter || '').trim().toLowerCase(), lv = level(sport);
      var teams = S.teams.filter(function (t) {
        if (q) return (t.name + ' ' + (t.short || '') + ' ' + t.g + ' ' + (t.lv || '')).toLowerCase().indexOf(q) >= 0;
        return !lv || t.lv === lv;
      });
      if (!teams.length) return '<div class="tp-none">No teams match “' + esc(filter) + '”.</div>';
      var out = [], last = null;
      teams.forEach(function (t) {
        var g = (q && t.lv && t.lv !== t.g ? t.lv + ' · ' : '') + t.g;
        if (g !== last) { out.push('<div class="tp-head">' + esc(g) + '</div>'); last = g; }
        var on = selected.indexOf(t.abbr) >= 0;
        out.push('<button type="button" class="team-btn' + (on ? ' selected' : '') + '" aria-pressed="' + on + '" onclick="' + esc(click(t)) + '">' +
          '<img src="' + esc(S.logo(t.abbr)) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
          '<span class="team-btn-name">' + esc(t.name) + '</span></button>');
      });
      return out.join('');
    },
    jsq: jsq
  };
})();
