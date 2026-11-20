/* ============================================================
   FODDER SPORTS — Shared auth (Supabase)
   Loaded on every page. Checks for a real Supabase session and
   mirrors it into localStorage 'fs_account', which each page's
   existing header code (applyAccountState) already reads.
   ============================================================ */
(function () {
  var SUPABASE_URL = 'https://sqxwiiqfnmdwuknbsskr.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Dz3z6XgHueHoemn4XP4T3Q_tqzGvwfr';
  var CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  function loadSupabase(cb) {
    if (window.supabase && window.supabase.createClient) return cb();
    var s = document.createElement('script');
    s.src = CDN;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function firstNflTeam(teams) {
    var nfl = teams && teams.NFL;
    return nfl && nfl.length ? nfl[0].name : '';
  }

  function buildAccount(user) {
    var meta = user.user_metadata || {};
    var teams = meta.teams || {};
    var nflTeam = firstNflTeam(teams);
    var name = meta.full_name || meta.name || '';
    return {
      id: user.id,
      email: user.email,
      name: name,
      method: 'supabase',
      teams: teams,
      allTeams: Object.keys(teams).reduce(function (a, k) { return a.concat(teams[k] || []); }, []),
      team: nflTeam,       // used by index.html / nfl/index.html
      nfl_team: nflTeam    // used by article pages
    };
  }

  function refreshHeader(acc) {
    if (typeof window.applyAccountState === 'function') {
      try { window.applyAccountState(); } catch (e) {}
    }
    if (typeof window.applyFeedFilter === 'function') {
      try { window.applyFeedFilter(); } catch (e) {}
    }
    var label = document.getElementById('account-label');
    if (label && acc) {
      label.textContent = acc.name ? acc.name.split(' ')[0] : acc.email.split('@')[0];
    }
  }

  function sync(session) {
    var before = localStorage.getItem('fs_account');
    var acc = null;
    if (session && session.user) {
      acc = buildAccount(session.user);
      localStorage.setItem('fs_account', JSON.stringify(acc));
    } else {
      // No real session: clear any leftover account from the old fake sign-up
      localStorage.removeItem('fs_account');
    }
    var after = localStorage.getItem('fs_account');
    refreshHeader(acc);
    // If the signed-in state changed after the page already rendered the
    // feed, re-run the page so My Feed filtering picks it up.
    if (before !== after && /tab=myfeed/.test(location.search) && !window.__fsReloaded) {
      window.__fsReloaded = true;
      location.reload();
    }
  }

  function start() {
    loadSupabase(function () {
      var sb = window.fsSupabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      window.fsSupabase = sb;

      sb.auth.getSession().then(function (res) { sync(res.data.session); });
      sb.auth.onAuthStateChange(function (_evt, session) { sync(session); });

      // Real sign-out replaces each page's localStorage-only version
      window.signOut = function () {
        sb.auth.signOut().finally(function () {
          localStorage.removeItem('fs_account');
          location.href = '/';
        });
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
