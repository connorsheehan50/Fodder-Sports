/* Team page: /team?sport=nfl&t=chi. Fodder Sports stories about the team, its schedule and results, and where it sits in its group. */
(function () {
  var F = window.FS, E = F.esc;
  var qs = new URLSearchParams(location.search);
  var SPORT = F.sportFromUrl(), C = F.sports[SPORT];
  var team = window.fsFindTeam(SPORT, qs.get('t') || '');
  function $(id) { return document.getElementById(id); }

  if (!team) {
    $('tm-hero').innerHTML = '<h1 class="sp-title">Team not found</h1><p class="sp-note">Pick a team from the <a href="/teams?sport=' + SPORT.toLowerCase() + '">' + E(F.label(SPORT)) + ' teams list</a>.</p>';
    document.querySelector('.tm-layout').style.display = 'none';
    return;
  }
  var path = C.soccer ? 'soccer/' + team.lg : C.path;
  var espnId = team.id || team.abbr;
  var logo = window.FS_SPORTS[SPORT].logo(team.abbr);
  var group = team.g + (team.lv && team.lv !== team.g ? ' · ' + team.lv : '');
  var sportQ = 'sport=' + SPORT.toLowerCase();
  document.title = team.name + ' | Fodder Sports';

  function hero(t) {
    var color = (t && t.color) || '0A0A0A';
    var rgb = [0, 2, 4].map(function (i) { return parseInt(color.substr(i, 2), 16); });
    var light = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.6;
    var rec = t && t.record && t.record.items && t.record.items[0] ? t.record.items[0].summary : '';
    $('tm-hero').innerHTML = '<div class="tm-hero" style="--tc:#' + E(color) + ';--tt:' + (light ? '#0A0A0A' : '#fff') + '">' +
      '<img src="' + E(logo) + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
      '<div><div class="kicker">' + E(F.label(SPORT)) + ' · ' + E(group) + '</div><h1>' + E(team.name) + '</h1>' +
      (rec ? '<div class="rec">' + E(rec) + (t.standingSummary ? ' · ' + E(t.standingSummary) : '') + '</div>' : '') +
      '<div class="tm-links"><a href="/standings?' + sportQ + '">Standings</a><a href="/stats?' + sportQ + '">Stats</a>' +
      '<a href="/teams?' + sportQ + '">All ' + E(F.label(SPORT)) + ' teams</a>' +
      followButton() +
      '</div></div></div>';
  }
  // ── Follow / unfollow, saved to the reader's account right away ──
  var busy = false;
  function following() { return !!F.myTeams()[SPORT + ':' + team.abbr]; }
  function followButton() {
    var on = following();
    return '<button type="button" class="tm-follow' + (on ? ' on' : '') + '" id="tm-follow" aria-pressed="' + on + '"' + (busy ? ' disabled' : '') + '>' +
      (busy ? 'Saving…' : on ? '<span class="is">✓ Following</span><span class="un">Unfollow</span>' : '+ Follow') + '</button>';
  }
  function redrawButton() { var b = $('tm-follow'); if (b) b.outerHTML = followButton(); }
  function withClient() {
    return new Promise(function (res, rej) {
      if (window.fsSupabase) return res(window.fsSupabase);
      var t = setTimeout(function () { rej(new Error('Sign-in did not load')); }, 10000);
      window.addEventListener('fs-supabase-ready', function () { clearTimeout(t); res(window.fsSupabase); }, { once: true });
    });
  }
  function setFollow(want) {
    busy = true; redrawButton();
    return withClient().then(function (sb) {
      return sb.auth.getUser().then(function (r) {
        var user = r.data && r.data.user;
        if (!user) throw new Error('signed out');
        var teams = window.fsNormalizeTeams((user.user_metadata || {}).teams || {});
        var list = (teams[SPORT] || []).filter(function (t) { return t.abbr !== team.abbr; });
        if (want) list.push({ abbr: team.abbr, name: team.name, sport: SPORT });
        if (list.length) teams[SPORT] = list; else delete teams[SPORT];
        return sb.auth.updateUser({ data: { teams: teams } }).then(function (u) {
          if (u.error) throw u.error;
          // keep the copy every page reads in step right away
          try {
            var acc = JSON.parse(localStorage.getItem('fs_account') || '{}');
            acc.teams = teams;
            acc.allTeams = Object.keys(teams).reduce(function (a, k) { return a.concat(teams[k]); }, []);
            localStorage.setItem('fs_account', JSON.stringify(acc));
            window.dispatchEvent(new CustomEvent('fs-account', { detail: acc }));
          } catch (e) {}
          if (window.fsTrack) window.fsTrack(want ? 'team_followed' : 'team_unfollowed', { sport: SPORT, team: team.name, team_key: SPORT + ':' + team.name });
        });
      });
    }).catch(function (e) {
      if (e && e.message === 'signed out') { goSignup(); return; }
      alertMsg('Could not save. Check your connection and try again.');
    }).then(function () { busy = false; redrawButton(); });
  }
  function goSignup() {
    var back = location.pathname + '?' + sportQ + '&t=' + encodeURIComponent(team.abbr) + '&follow=1';
    location.href = '/signup?next=' + encodeURIComponent(back);
  }
  function alertMsg(m) {
    var b = $('tm-follow'); if (!b) return;
    var n = document.createElement('div'); n.className = 'tm-follow-msg'; n.textContent = m;
    b.parentNode.appendChild(n); setTimeout(function () { n.remove(); }, 5000);
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#tm-follow') || busy) return;
    if (!localStorage.getItem('fs_account')) { goSignup(); return; }
    setFollow(!following());
  });
  // back from sign-up with ?follow=1: finish the follow once the account is known
  if (qs.get('follow') === '1') {
    history.replaceState(null, '', location.pathname + '?' + sportQ + '&t=' + encodeURIComponent(team.abbr));
    var tries = 0;
    (function wait() {
      if (localStorage.getItem('fs_account')) { if (!following()) setFollow(true); return; }
      if (++tries < 20) setTimeout(wait, 500);
    })();
  }
  window.addEventListener('fs-account', function () { if (!busy) redrawButton(); });

  hero(null);
  F.json(F.API + 'site/v2/sports/' + path + '/teams/' + espnId).then(function (d) { if (d && d.team) hero(d.team); }).catch(function () {});

  // ── Fodder Sports stories ──────────────────────────────────
  var FEEDS = { NFL: '/data/nfl/feed.json' };
  function stories() {
    var el = $('tm-feed');
    if (!FEEDS[SPORT]) {
      el.innerHTML = '<div class="tm-box"><p class="tm-empty">Fodder Sports ' + E(C.soccer ? 'soccer' : F.label(SPORT)) + ' stories are coming. The ' + E(team.name) + ' schedule, results, and standings on this page are live now.</p></div>';
      return;
    }
    var code = team.abbr.toUpperCase(), alt = { WSH: 'WAS' }[code] || code;
    F.json(FEEDS[SPORT]).then(function (feed) {
      var items = (feed.items || []).filter(function (i) {
        return (i.teams || []).some(function (x) { x = String(x).toUpperCase(); return x === code || x === alt; }) ||
          (i.teams_full || []).indexOf(team.name) >= 0;
      });
      if (!items.length) { el.innerHTML = '<div class="tm-box"><p class="tm-empty">No Fodder Sports stories on the ' + E(team.short || team.name) + ' yet.</p></div>'; return; }
      el.innerHTML = window.buildCard ? items.map(window.buildCard).join('') : items.map(function (i) {
        return '<a class="tm-box" style="display:block;text-decoration:none;color:inherit" href="' + E(i.url) + '"><b>' + E(i.title) + '</b><br><span class="tm-empty">' + E(i.desc || '') + '</span></a>';
      }).join('');
    }).catch(function () { el.innerHTML = '<p class="tm-empty">Stories did not load.</p>'; });
  }

  // ── Schedule and results ───────────────────────────────────
  function schedule() {
    var el = $('tm-sched');
    F.json(F.API + 'site/v2/sports/' + path + '/teams/' + espnId + '/schedule').then(function (d) {
      var ev = (d.events || []).slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      if (!ev.length) { el.innerHTML = '<p class="tm-empty">No games on the schedule right now.</p>'; return; }
      // results first, newest at the bottom, then upcoming; long college hoops or MLB schedules show the 8 most recent and next 8
      var done = ev.filter(function (e) { return e.competitions[0].status.type.completed; });
      var next = ev.filter(function (e) { return !e.competitions[0].status.type.completed; });
      var list = ev.length <= 20 ? ev : done.slice(-8).concat(next.slice(0, 8));   // football: the whole season
      if (d.season && d.season.displayName) $('tm-sched-h').textContent = 'Schedule & results';
      el.innerHTML = list.map(function (e) {
        var c = e.competitions[0], me = null, opp = null;
        c.competitors.forEach(function (x) { if (String(x.team.id) === String(espnId) || String(x.team.abbreviation).toLowerCase() === team.abbr) me = x; else opp = x; });
        if (!me) { me = c.competitors[0]; opp = c.competitors[1]; }
        var dt = new Date(e.date), st = c.status.type;
        var when = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        var res = '';
        if (st.completed) {
          var ms = me.score && (me.score.displayValue || me.score), os = opp.score && (opp.score.displayValue || opp.score);
          var wl = me.winner ? 'W' : opp.winner ? 'L' : 'T';
          res = '<span class="res ' + wl + '">' + wl + ' ' + E(ms) + '-' + E(os) + '</span>';
        } else {
          res = '<span class="res">' + E(/TBD/.test(st.shortDetail || '') ? 'TBD' : dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }) + ' ET') + '</span>';
        }
        var ot = opp.team, oAbbr = F.teamAbbr(SPORT, ot), oLogo = (ot.logos && ot.logos[0] && ot.logos[0].href) || ot.logo || '';
        var known = window.fsFindTeam(SPORT, oAbbr);
        var name = '<span>' + (me.homeAway === 'away' ? '@ ' : 'vs ') + E(ot.shortDisplayName || ot.displayName) + '</span>';
        return '<div class="tm-game"><span class="dt">' + E(when) + '</span><span class="opp">' + (oLogo ? '<img src="' + E(oLogo) + '" alt="" loading="lazy">' : '') +
          (known ? '<a href="' + F.teamUrl(SPORT, known.abbr) + '" style="color:inherit;text-decoration:none;min-width:0;display:flex">' + name + '</a>' : name) + '</span>' + res + '</div>';
      }).join('');
    }).catch(function () { el.innerHTML = '<p class="tm-empty">Schedule did not load.</p>'; });
  }

  // ── Where the team sits ────────────────────────────────────
  function standing() {
    var el = $('tm-standing');
    var q = C.soccer ? '' : C.college ? '?level=3&group=' + ((C.levels.filter(function (l) { return l[0] === team.lv; })[0] || C.levels[0])[1]) : '?level=' + (C.views[C.views.length - 1][1]);
    F.json(F.API + 'v2/sports/' + path + '/standings' + q).then(function (d) {
      var found = null;
      (function walk(n) {
        var en = (n.standings && n.standings.entries) || [];
        if (en.some(function (e) { return String(e.team.id) === String(espnId); })) found = { name: n.name, entries: F.orderEntries(SPORT, 3, en) };
        (n.children || []).forEach(walk);
      })(d);
      if (!found) { el.innerHTML = '<p class="tm-empty">Not in this season\'s standings yet.</p>'; return; }
      var cols = C.cols.slice(0, C.soccer ? 8 : 3).filter(function (c) { return found.entries.some(function (e) { return c.get(F.parseEntry(e)); }); });
      if (C.soccer) cols = cols.filter(function (c) { return ['GP', 'GD', 'P'].indexOf(c.label) >= 0; });
      el.innerHTML = '<div style="font-family:var(--font-head);font-weight:800;color:var(--slate);font-size:13px;margin-bottom:6px">' + E(C.soccer ? team.lv : (found.name || group)) + '</div>' +
        '<table class="sp-table" style="min-width:0;table-layout:auto"><thead><tr><th class="team-col" style="width:auto">Team</th>' + cols.map(function (c) { return '<th>' + E(c.label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        found.entries.map(function (e) {
          var r = F.parseEntry(e), me = String(e.team.id) === String(espnId), ab = F.teamAbbr(SPORT, e.team);
          return '<tr' + (me ? ' class="is-fav" style="--fav:var(--orange)"' : '') + '><td class="team-col" style="width:auto"><a class="sp-team" href="' + F.teamUrl(SPORT, ab) + '"><img src="' + E(F.logoOf(e.team)) + '" alt="" loading="lazy"><span class="sp-team-name">' + E(e.team.shortDisplayName || e.team.displayName) + '</span></a></td>' +
            cols.map(function (c) { var v = c.get(r); return '<td>' + E(v ? v.d : '-') + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table><p style="margin-top:10px"><a class="sp-reset" style="padding:0" href="/standings?' + sportQ + '">Full standings</a></p>';
    }).catch(function () { el.innerHTML = '<p class="tm-empty">Standings did not load.</p>'; });
  }

  document.addEventListener('DOMContentLoaded', function () { stories(); schedule(); standing(); });
  if (document.readyState !== 'loading') { stories(); schedule(); standing(); }
})();
