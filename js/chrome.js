/* ============================================================
   FODDER SPORTS — Shared site chrome
   Loaded on every page (before auth.js). Gives every page the
   same header, nav, and trending strip, frozen together at the
   top while scrolling, and owns everything personalized:
   account menu, My Feed filtering, the favorite-teams schedule.
   Generated once from index.html styles; edit this file directly.
   ============================================================ */
(function () {
  if (window.__fsChrome) return;
  window.__fsChrome = true;

  // ── Styles (from the homepage, so every page matches) ──────────
  var CSS = "    /* \u2500\u2500 Header Buttons \u2500\u2500 */\n    .header-actions {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      flex-shrink: 0;\n    }\n    .btn-signin {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--slate-light);\n      padding: 6px 14px;\n      border: 1px solid #333;\n      border-radius: 3px;\n      cursor: pointer;\n      background: none;\n      transition: color 0.15s, border-color 0.15s;\n    }\n    .btn-signin:hover { color: var(--off-white); border-color: #666; }\n    .btn-signup {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 800;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: #fff;\n      padding: 7px 16px;\n      background: var(--orange);\n      border: none;\n      border-radius: 3px;\n      cursor: pointer;\n      transition: opacity 0.15s;\n    }\n    .btn-signup:hover { opacity: 0.85; }\n    .btn-account {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--off-white);\n      padding: 6px 14px;\n      border: 1px solid #444;\n      border-radius: 3px;\n      cursor: pointer;\n      background: none;\n      display: none;\n      align-items: center;\n      gap: 7px;\n      transition: border-color 0.15s;\n      white-space: nowrap;\n    }\n    .btn-account:hover { border-color: var(--orange); }\n    .btn-account .account-dot {\n      width: 7px; height: 7px;\n      background: var(--orange);\n      border-radius: 50%;\n      display: inline-block;\n    }\n    @media (max-width: 540px) {\n      .btn-signin { display: none; }\n    }\n\n    /* \u2500\u2500 Primary Nav \u2500\u2500 */\n    .primary-nav {\n      background: var(--off-white);\n      border-bottom: 1px solid var(--rule);\n      position: sticky;\n      top: 60px;\n      z-index: 90;\n    }\n    .primary-nav-inner {\n      display: flex;\n      align-items: center;\n      gap: 0;\n      overflow-x: auto;\n      scrollbar-width: none;\n    }\n    .primary-nav-inner::-webkit-scrollbar { display: none; }\n    .nav-item {\n      position: relative;\n      flex-shrink: 0;\n    }\n    .nav-link {\n      display: flex;\n      align-items: center;\n      gap: 4px;\n      font-family: var(--font-head);\n      font-size: 13px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--slate);\n      padding: 14px 18px;\n      border-bottom: 3px solid transparent;\n      cursor: pointer;\n      white-space: nowrap;\n      transition: color 0.15s, border-color 0.15s;\n      text-decoration: none;\n      background: none;\n      border-top: none;\n      border-left: none;\n      border-right: none;\n      font-family: var(--font-head);\n    }\n    .nav-link:hover { color: var(--ink); }\n    .nav-link.active {\n      color: var(--ink);\n      border-bottom-color: var(--orange);\n    }\n    .nav-link .nav-badge {\n      font-size: 9px;\n      font-weight: 800;\n      letter-spacing: 0.05em;\n      color: var(--slate-light);\n      margin-left: 2px;\n    }\n    .nav-link .caret {\n      font-size: 8px;\n      color: var(--slate-light);\n      margin-left: 1px;\n      transition: transform 0.15s;\n    }\n    .nav-item:hover .caret { transform: rotate(180deg); }\n\n    /* Dropdown */\n    .nav-dropdown {\n      position: absolute;\n      top: 100%;\n      left: 0;\n      background: var(--card-bg);\n      border: 1px solid var(--rule);\n      border-top: 2px solid var(--orange);\n      border-radius: 0 0 var(--radius-lg) var(--radius-lg);\n      min-width: 190px;\n      box-shadow: 0 8px 24px rgba(0,0,0,.12);\n      display: none;\n      z-index: 200;\n      flex-direction: column;\n      padding: 6px 0;\n    }\n    .nav-item:hover .nav-dropdown { display: flex; }\n    .nav-dropdown a {\n      display: block;\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.07em;\n      text-transform: uppercase;\n      color: var(--slate);\n      padding: 10px 18px;\n      transition: background 0.1s, color 0.1s;\n    }\n    .nav-dropdown a:hover { background: var(--page-bg); color: var(--ink); }\n    .nav-dropdown .dropdown-divider {\n      height: 1px;\n      background: var(--rule);\n      margin: 4px 12px;\n    }\n\n    /* \u2500\u2500 Trending Strip \u2500\u2500 */\n    .trending-strip {\n      background: var(--ink);\n      padding: 0;\n      border-bottom: 1px solid #222;\n      overflow: hidden;\n    }\n    .trending-inner {\n      display: flex;\n      align-items: center;\n      overflow-x: auto;\n      scrollbar-width: none;\n      gap: 0;\n    }\n    .trending-inner::-webkit-scrollbar { display: none; }\n    .trending-label {\n      font-family: var(--font-head);\n      font-size: 10px;\n      font-weight: 800;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--orange);\n      padding: 10px 16px 10px var(--gutter);\n      white-space: nowrap;\n      flex-shrink: 0;\n      border-right: 1px solid #333;\n    }\n    .trending-items {\n      display: flex;\n      align-items: center;\n      gap: 0;\n      overflow-x: auto;\n      scrollbar-width: none;\n      flex: 1;\n      animation: ticker 40s linear infinite;\n    }\n    .trending-items::-webkit-scrollbar { display: none; }\n    .trending-item {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 10px 20px;\n      cursor: pointer;\n      text-decoration: none;\n      white-space: nowrap;\n      border-right: 1px solid #222;\n      transition: background 0.1s;\n    }\n    .trending-item:hover { background: #111; }\n    .trending-item-badge {\n      font-family: var(--font-head);\n      font-size: 8px;\n      font-weight: 800;\n      letter-spacing: 0.1em;\n      text-transform: uppercase;\n      padding: 2px 6px;\n      border-radius: 2px;\n      flex-shrink: 0;\n    }\n    .badge-breaking { background: var(--orange); color: #fff; }\n    .badge-hot { background: #c0392b; color: #fff; }\n    .badge-rankings { background: var(--blue); color: #fff; }\n    .trending-item-text {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--off-white);\n      letter-spacing: 0.03em;\n    }\n    /* \u2500\u2500 Account Dropdown \u2500\u2500 */\n    .account-menu {\n      position: absolute;\n      top: calc(100% + 8px);\n      right: 0;\n      background: var(--card-bg);\n      border: 1px solid var(--rule);\n      border-radius: var(--radius-lg);\n      box-shadow: 0 8px 24px rgba(0,0,0,.12);\n      min-width: 200px;\n      display: none;\n      z-index: 300;\n      padding: 8px 0;\n    }\n    .account-menu.open { display: block; }\n    .account-menu-header {\n      padding: 12px 16px 10px;\n      border-bottom: 1px solid var(--rule);\n    }\n    .account-menu-email {\n      font-family: var(--font-body);\n      font-size: 13px;\n      color: var(--slate);\n    }\n    .account-menu-team {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--ink);\n      margin-top: 2px;\n    }\n    .account-menu a, .account-menu button {\n      display: block;\n      width: 100%;\n      text-align: left;\n      padding: 10px 16px;\n      font-family: var(--font-body);\n      font-size: 14px;\n      color: var(--ink);\n      background: none;\n      border: none;\n      cursor: pointer;\n      transition: background 0.1s;\n    }\n    .account-menu a:hover, .account-menu button:hover { background: var(--page-bg); }\n    .account-menu .sign-out { color: #c0392b; }\n    .account-wrapper {\n      position: relative;\n    }\n" + [
    '.site-top{position:sticky;top:0;z-index:100;}',
    '.site-top .site-header,.site-top .primary-nav{position:static !important;top:auto !important;}',
    '.site-top .primary-nav{z-index:auto;}',
    '.site-top .trending-items{animation:none;}',
    // one light bar: logo, sections, account
    '.site-top .fs-bar{background:var(--card-bg,#fff);border-bottom:3px solid var(--orange);}',
    '.site-top .fs-bar-inner{height:72px;gap:28px;justify-content:flex-start;}',
    '.fs-logo{display:flex;align-items:center;flex-shrink:0;}',
    '.fs-logo img{height:56px;width:auto;display:block;}',
    '.fs-nav{display:flex;align-items:stretch;align-self:stretch;flex:1;min-width:0;}',
    '.fs-nav .nav-item{display:flex;}',
    '.fs-nav .nav-link{padding:0 14px;font-size:14px;border-bottom:3px solid transparent;margin-bottom:-3px;height:auto;color:var(--slate);}',
    '.fs-nav .nav-link:hover,.fs-nav .nav-link.active{color:var(--ink);}',
    '.fs-nav .nav-link.active{border-bottom-color:var(--ink);}',
    '.fs-nav .nav-soon{cursor:default;opacity:.7;}',
    '.fs-nav .nav-soon:hover{color:var(--slate);}',
    '.fs-nav .nav-dropdown{top:100%;margin-top:3px;}',
    '.fs-nav .nav-item:hover .nav-dropdown,.fs-nav .nav-item:focus-within .nav-dropdown{display:flex;}',
    '.site-top .header-actions{margin-left:auto;}',
    '.site-top .btn-signin{color:var(--ink);border-color:var(--rule);}',
    '.site-top .btn-signin:hover{color:var(--ink);border-color:var(--ink);}',
    '.site-top .btn-account{color:var(--ink);border-color:var(--rule);}',
    '@media (max-width:900px){' +
      '.site-top .fs-bar-inner{height:auto;flex-wrap:wrap;row-gap:0;padding-top:8px;}' +
      '.fs-logo img{height:44px;}' +
      '.fs-nav{order:3;flex-basis:100%;overflow-x:auto;scrollbar-width:none;margin:0 -4px;}' +
      '.fs-nav::-webkit-scrollbar{display:none;}' +
      '.fs-nav .nav-link{padding:12px 12px;white-space:nowrap;}' +
      '.fs-nav .nav-dropdown{display:none !important;}' +
    '}',
    // sign-up prompt
    '.fs-pop{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,10,10,.55);opacity:0;transition:opacity .25s;}',
    '.fs-pop.show{opacity:1;}',
    '.fs-pop-card{position:relative;background:var(--card-bg,#fff);border-radius:10px;border-top:4px solid var(--orange);max-width:440px;width:100%;padding:28px 28px 22px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;}',
    '.fs-pop-card img{height:64px;width:auto;margin:0 auto 14px;display:block;}',
    '.fs-pop-title{font-family:var(--font-head);font-size:26px;font-weight:900;line-height:1.15;color:var(--ink);margin-bottom:8px;}',
    '.fs-pop-sub{font-family:var(--font-body);font-size:15px;line-height:1.5;color:var(--slate);margin-bottom:20px;}',
    '.fs-pop-cta{display:block;width:100%;font-family:var(--font-head);font-size:15px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:var(--orange);border:none;border-radius:4px;padding:13px 16px;cursor:pointer;}',
    '.fs-pop-cta:hover{opacity:.9;}',
    '.fs-pop-later{margin-top:10px;background:none;border:none;font-family:var(--font-body);font-size:13px;color:var(--slate);cursor:pointer;text-decoration:underline;}',
    '.fs-pop-x{position:absolute;top:8px;right:10px;background:none;border:none;font-size:26px;line-height:1;color:var(--slate);cursor:pointer;padding:4px 8px;}',
    '.fs-sched-row{display:block;padding:12px 16px;border-bottom:1px solid var(--rule);color:inherit;text-decoration:none;}',
    'a.fs-sched-row:hover{background:rgba(0,0,0,.02);}',
    '.fs-sched-meta{display:flex;gap:8px;align-items:center;font-family:var(--font-head);font-size:11px;font-weight:700;color:var(--slate);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;}',
    '.fs-sched-league{font-size:9px;font-weight:900;color:#fff;background:var(--ink);padding:2px 5px;border-radius:2px;letter-spacing:.08em;}',
    '.fs-sched-teams{font-family:var(--font-head);font-size:15px;font-weight:700;color:var(--slate);}',
    '.fs-sched-teams b{color:var(--ink);font-weight:900;}',
    '.fs-sched-sub{font-family:var(--font-body);font-size:12px;color:var(--slate);margin-top:2px;}'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'fs-chrome-css';
  style.textContent = CSS;
  document.head.appendChild(style);

  // ── Account helpers ────────────────────────────────────────────
  function getAcc() {
    try { return JSON.parse(localStorage.getItem('fs_account') || 'null'); } catch (e) { return null; }
  }
  var SPORT_ORDER = ['NFL', 'NBA', 'MLB', 'NHL', 'NCAAF', 'NCAAB', 'NCAAW', 'WNBA', 'Soccer'];
  function favorites(acc) {
    acc = acc || getAcc();
    var teams = (acc && acc.teams) || {};
    var out = [];
    SPORT_ORDER.concat(Object.keys(teams).filter(function (k) { return SPORT_ORDER.indexOf(k) < 0; }))
      .forEach(function (sport) {
        (teams[sport] || []).forEach(function (t) {
          if (t && t.name) out.push({ sport: sport, abbr: String(t.abbr || ''), name: t.name });
        });
      });
    return out;
  }
  window.fsFavorites = favorites;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function here() { return location.pathname + location.search; }
  function isMyFeed() { return new URLSearchParams(location.search).get('tab') === 'myfeed'; }
  window.fsIsMyFeed = isMyFeed;

  window.fsEditPreferences = function () {
    location.href = '/signup.html?edit=1&next=' + encodeURIComponent(here());
  };
  window.fsGoSignup = function () {
    location.href = '/signup.html?next=' + encodeURIComponent(here());
  };
  window.fsMyFeedClick = function (e) {
    var acc = getAcc();
    if (!acc || !acc.email) {
      e.preventDefault();
      location.href = '/signup.html?next=' + encodeURIComponent('/?tab=myfeed');
      return false;
    }
    return true;
  };

  // ── My Feed filtering (all sports blend into one feed) ─────────
  window.fsFilterMyFeed = function (items) {
    var favs = favorites();
    var names = favs.map(function (f) { return f.name; });
    var hasNfl = favs.some(function (f) { return f.sport === 'NFL'; });
    return (items || []).filter(function (i) {
      if (i.type === 'rankings') return hasNfl;
      return (i.teams_full || []).some(function (n) { return names.indexOf(n) >= 0; });
    });
  };
  window.fsTeamSummary = function (max) {
    var favs = favorites();
    if (!favs.length) return '';
    max = max || 3;
    var shown = favs.slice(0, max).map(function (f) { return f.name; }).join(', ');
    return favs.length > max ? shown + ' +' + (favs.length - max) + ' more' : shown;
  };

  // ── Standard header + nav + trending ───────────────────────────
  function section() {
    var p = location.pathname;
    if (isMyFeed()) return 'myfeed';
    if (/^\/nfl(\/|$)/.test(p)) return 'nfl';
    if (p === '/' || /^\/index(\.html)?$/.test(p)) return 'home';
    return '';
  }

  function topHtml() {
    var s = section();
    function act(k) { return s === k ? ' active' : ''; }
    return '' +
      '<header class="site-header fs-bar"><div class="container"><div class="header-inner fs-bar-inner">' +
        '<a href="/" class="fs-logo" aria-label="Fodder Sports home"><img src="/img/fodder-logo-header.png" alt="Fodder Sports" width="113" height="56"></a>' +
        '<nav class="fs-nav" aria-label="Sections">' +
          '<div class="nav-item"><a href="/" class="nav-link' + act('home') + '">Home</a></div>' +
          '<div class="nav-item"><a href="/?tab=myfeed" class="nav-link' + act('myfeed') + '" id="nav-myfeed" onclick="return fsMyFeedClick(event)">My Feed</a></div>' +
          '<div class="nav-item"><a href="/nfl/index.html" class="nav-link' + act('nfl') + '" aria-haspopup="true">NFL <span class="caret">▾</span></a>' +
            '<div class="nav-dropdown">' +
              '<a href="/nfl/index.html">All NFL Stories</a><div class="dropdown-divider"></div>' +
              '<a href="/nfl/power-rankings.html">Power Rankings</a>' +
              '<a href="/nfl/index.html?tab=preview">Game Previews</a>' +
              '<a href="/nfl/index.html?tab=recap">Game Recaps</a>' +
              '<a href="/nfl/index.html?tab=trade">Trades</a>' +
              '<a href="/nfl/index.html?tab=breaking">Breaking News</a>' +
            '</div></div>' +
          '<div class="nav-item"><span class="nav-link nav-soon">NBA <span class="nav-badge">SOON</span></span></div>' +
          '<div class="nav-item"><span class="nav-link nav-soon">MLB <span class="nav-badge">SOON</span></span></div>' +
          '<div class="nav-item"><span class="nav-link nav-soon">NHL <span class="nav-badge">SOON</span></span></div>' +
          '<div class="nav-item"><span class="nav-link nav-soon">CFB <span class="nav-badge">SOON</span></span></div>' +
        '</nav>' +
        '<div class="header-actions">' +
          '<button class="btn-signin" onclick="fsGoSignup()">Sign In</button>' +
          '<button class="btn-signup" id="btn-signup-header" onclick="fsGoSignup()">Sign Up Free</button>' +
          '<div class="account-wrapper">' +
            '<button class="btn-account" id="btn-account" onclick="toggleAccountMenu()"><span class="account-dot"></span><span id="account-label">My Account</span></button>' +
            '<div class="account-menu" id="account-menu">' +
              '<div class="account-menu-header"><div class="account-menu-email" id="account-email"></div><div class="account-menu-team" id="account-team-display"></div></div>' +
              '<a href="/?tab=myfeed">My Feed</a>' +
              '<button onclick="fsEditPreferences()">Edit Preferences</button>' +
              '<button class="sign-out" onclick="signOut()">Sign Out</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div></header>' +
      '<div class="trending-strip"><div class="container"><div class="trending-inner">' +
        '<div class="trending-label">Trending</div>' +
        '<div class="trending-items" id="trending-items"></div>' +
      '</div></div></div>';
  }

  function mountTop() {
    var old = document.querySelectorAll('.site-header, .primary-nav, .trending-strip, .sport-nav');
    var top = document.createElement('div');
    top.className = 'site-top';
    top.id = 'site-top';
    top.innerHTML = topHtml();
    var anchor = old[0];
    if (anchor && anchor.parentNode === document.body) {
      document.body.insertBefore(top, anchor);
    } else {
      var banner = document.getElementById('signup-banner');
      if (banner && banner.parentNode === document.body) banner.after(top);
      else document.body.insertBefore(top, document.body.firstChild);
    }
    Array.prototype.forEach.call(old, function (el) { el.remove(); });
  }

  var feedPromise = null;
  function loadFeed() {
    if (!feedPromise) {
      feedPromise = fetch('/data/nfl/feed.json?t=' + Date.now())
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }
    return feedPromise;
  }
  window.fsLoadFeed = loadFeed;

  function fillTrending() {
    loadFeed().then(function (d) {
      var el = document.getElementById('trending-items');
      if (!el || !d || !d.items) return;
      el.innerHTML = d.items.filter(function (i) { return i.url && i.url !== '#'; }).slice(0, 8).map(function (item) {
        var cls = item.type === 'breaking' ? 'badge-breaking' : item.type === 'rankings' ? 'badge-rankings' : 'badge-hot';
        var lbl = item.type === 'breaking' ? 'Breaking' : item.type === 'rankings' ? 'Rankings' : 'NFL';
        return '<a href="' + esc(item.url) + '" class="trending-item"><span class="trending-item-badge ' + cls + '">' + lbl +
          '</span><span class="trending-item-text">' + esc(item.title) + '</span></a>';
      }).join('');
    });
  }

  // ── Account rendering (runs after each page's own version) ────
  function renderAccount() {
    var acc = getAcc();
    var signedIn = !!(acc && acc.email);
    var banner = document.getElementById('signup-banner');
    var su = document.getElementById('btn-signup-header');
    var si = document.querySelector('.site-top .btn-signin');
    var ac = document.getElementById('btn-account');
    if (banner) banner.classList.toggle('hidden', signedIn);
    if (su) su.style.display = signedIn ? 'none' : '';
    if (si) si.style.display = signedIn ? 'none' : '';
    if (ac) ac.style.display = signedIn ? 'flex' : 'none';
    if (signedIn) {
      var label = document.getElementById('account-label');
      if (label) label.textContent = acc.name ? acc.name.split(' ')[0] : acc.email.split('@')[0];
      var em = document.getElementById('account-email');
      if (em) em.textContent = acc.email;
      var td = document.getElementById('account-team-display');
      if (td) {
        var n = favorites(acc).length;
        td.textContent = n ? '★ ' + n + ' team' + (n === 1 ? '' : 's') + ': ' + window.fsTeamSummary(2) : 'No teams yet';
      }
    }
    var nf = document.getElementById('nav-myfeed');
    if (nf) nf.textContent = 'My Feed';
  }
  window.fsRenderAccount = renderAccount;

  function wrapPageFunctions() {
    var orig = window.applyAccountState;
    window.applyAccountState = function () {
      if (typeof orig === 'function') { try { orig(); } catch (e) {} }
      renderAccount();
    };
    // Every page's own sign-in/preferences modal is replaced by the real flow.
    window.openModal = function (panel) {
      if (panel === 'account') window.fsEditPreferences();
      else window.fsGoSignup();
    };
    window.handleMyFeedClick = function (e) { return window.fsMyFeedClick(e); };
    window.toggleAccountMenu = function () {
      var m = document.getElementById('account-menu');
      if (m) m.classList.toggle('open');
    };
  }

  document.addEventListener('click', function (e) {
    var w = document.querySelector('.site-top .account-wrapper');
    if (w && !w.contains(e.target)) {
      var m = document.getElementById('account-menu');
      if (m) m.classList.remove('open');
    }
  });

  // ── Favorite-teams schedule (My Feed) ──────────────────────────
  var ESPN = 'https://site.api.espn.com/apis/site/v2/sports/';
  var SPORT_PATH = {
    NFL: 'football/nfl', NBA: 'basketball/nba', MLB: 'baseball/mlb', NHL: 'hockey/nhl',
    NCAAF: 'football/college-football', NCAAB: 'basketball/mens-college-basketball',
    NCAAW: 'basketball/womens-college-basketball', WNBA: 'basketball/wnba', Soccer: 'soccer/all'
  };
  var LEAGUE_LABEL = { NCAAB: 'NCAAM' };

  function teamGames(fav) {
    var path = SPORT_PATH[fav.sport];
    if (!path || !fav.abbr) return Promise.resolve([]);
    var url = ESPN + path + '/teams/' + encodeURIComponent(fav.abbr) + '/schedule' + (fav.sport === 'Soccer' ? '?fixture=true' : '');
    var cutoff = Date.now() - 4 * 3600 * 1000;
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !d.events) return [];
      return d.events.map(function (e) {
        var c = (e.competitions || [])[0] || {};
        var st = (((c.status || e.status || {}).type) || {}).state;
        var comps = c.competitors || [];
        var home = comps.find(function (x) { return x.homeAway === 'home'; }) || comps[0] || {};
        var away = comps.find(function (x) { return x.homeAway === 'away'; }) || comps[1] || {};
        var b = (c.broadcasts || [])[0];
        return {
          id: fav.sport + ':' + e.id,
          sport: fav.sport,
          time: Date.parse(e.date),
          tbd: !!c.timeValid === false && c.timeValid !== undefined,
          state: st,
          home: (home.team || {}).shortDisplayName || (home.team || {}).displayName || '',
          away: (away.team || {}).shortDisplayName || (away.team || {}).displayName || '',
          homeFull: (home.team || {}).displayName || '',
          awayFull: (away.team || {}).displayName || '',
          neutral: !!c.neutralSite,
          tv: b ? ((b.media && b.media.shortName) || (b.names || [])[0] || '') : '',
          fav: fav.name
        };
      }).filter(function (g) {
        return g.state !== 'post' && g.time >= cutoff && g.home && g.away;
      }).sort(function (a, b) { return a.time - b.time; }).slice(0, 5);
    }).catch(function () { return []; });
  }

  // Rules: every favorite's next game; at least 3 games total. Short of 3,
  // fill with the soonest remaining games involving any favorite.
  function pickGames(lists) {
    var seen = {}, picked = [];
    lists.forEach(function (games) {
      for (var i = 0; i < games.length; i++) {
        if (!seen[games[i].id]) { seen[games[i].id] = 1; picked.push(games[i]); break; }
        // next game already listed (favorites playing each other): that counts
        if (seen[games[i].id]) break;
      }
    });
    if (picked.length < 3) {
      var pool = [];
      lists.forEach(function (g) { pool = pool.concat(g); });
      pool.sort(function (a, b) { return a.time - b.time; });
      for (var j = 0; j < pool.length && picked.length < 3; j++) {
        if (!seen[pool[j].id]) { seen[pool[j].id] = 1; picked.push(pool[j]); }
      }
    }
    return picked.sort(function (a, b) { return a.time - b.time; });
  }

  function fmtDate(t) {
    var d = new Date(t);
    var opts = { timeZone: 'America/New_York' };
    var day = d.toLocaleDateString('en-US', Object.assign({ weekday: 'short', month: 'short', day: 'numeric' }, opts));
    var tm = d.toLocaleTimeString('en-US', Object.assign({ hour: 'numeric', minute: '2-digit' }, opts));
    return { day: day, time: tm + ' ET' };
  }

  function previewUrl(g, feed) {
    if (!feed || !feed.items) return '';
    var hit = feed.items.find(function (i) {
      return i.type === 'preview' && i.url && i.url !== '#' && i.teams_full &&
        i.teams_full.indexOf(g.homeFull) >= 0 && i.teams_full.indexOf(g.awayFull) >= 0;
    });
    return hit ? hit.url : '';
  }

  window.fsRenderMySchedule = function (el) {
    var favs = favorites();
    if (!el || !favs.length) return Promise.resolve(false);
    var widget = el.closest('.sidebar-widget');
    var lbl = widget && widget.querySelector('.widget-label');
    var ttl = widget && widget.querySelector('.widget-title');
    if (lbl) lbl.textContent = 'Your Teams · Up Next';
    if (ttl) ttl.textContent = 'On the Schedule';
    el.innerHTML = '<div style="font-family:var(--font-body);font-size:13px;color:var(--slate);padding:16px;">Loading your teams’ games…</div>';
    return Promise.all([Promise.all(favs.map(teamGames)), loadFeed()]).then(function (res) {
      var games = pickGames(res[0]);
      var feed = res[1];
      var favNames = favs.map(function (f) { return f.name; });
      if (!games.length) {
        el.innerHTML = '<div style="font-family:var(--font-body);font-size:13px;color:var(--slate);padding:16px;">No upcoming games found for your teams.</div>';
        return true;
      }
      el.innerHTML = games.map(function (g) {
        var dt = fmtDate(g.time);
        function nm(short, full) {
          var mine = favNames.indexOf(full) >= 0 || favNames.some(function (n) { return full.indexOf(n) === 0; });
          return mine ? '<b>' + esc(short) + '</b>' : esc(short);
        }
        var url = previewUrl(g, feed);
        var tag = url ? 'a href="' + esc(url) + '"' : 'div';
        return '<' + tag + ' class="fs-sched-row">' +
          '<div class="fs-sched-meta"><span class="fs-sched-league">' + esc(LEAGUE_LABEL[g.sport] || g.sport) + '</span>' + esc(dt.day) + '</div>' +
          '<div class="fs-sched-teams">' + nm(g.away, g.awayFull) + ' <span style="font-weight:600;">' + (g.neutral ? 'vs' : 'at') + '</span> ' + nm(g.home, g.homeFull) + '</div>' +
          '<div class="fs-sched-sub">' + esc(dt.time) + (g.tv ? ' · ' + esc(g.tv) : '') + (url ? ' · <span style="color:var(--orange);font-weight:700;">Read the preview →</span>' : '') + '</div>' +
          '</' + (url ? 'a' : 'div') + '>';
      }).join('');
      return true;
    });
  };

  // ── Sign-up prompt (home page only) ────────────────────────────
  var POP_KEY = 'fs_signup_prompt_dismissed';
  function popDismissedRecently() {
    try {
      var t = Number(localStorage.getItem(POP_KEY) || 0);
      return t && (Date.now() - t) < 3 * 24 * 3600 * 1000;   // ask again after 3 days
    } catch (e) { return false; }
  }
  function closePop() {
    var el = document.getElementById('fs-pop');
    if (!el) return;
    try { localStorage.setItem(POP_KEY, String(Date.now())); } catch (e) {}
    el.classList.remove('show');
    document.removeEventListener('keydown', popKeys);
    setTimeout(function () { el.remove(); }, 250);
  }
  function popKeys(e) { if (e.key === 'Escape') closePop(); }
  window.fsClosePop = closePop;
  function showPop() {
    var acc = getAcc();
    if ((acc && acc.email) || popDismissedRecently() || document.getElementById('fs-pop')) return;
    var el = document.createElement('div');
    el.className = 'fs-pop';
    el.id = 'fs-pop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'fs-pop-title');
    el.innerHTML = '<div class="fs-pop-card">' +
      '<button class="fs-pop-x" aria-label="Close" onclick="fsClosePop()">×</button>' +
      '<img src="/img/fodder-logo-header.png" alt="Fodder Sports">' +
      '<div class="fs-pop-title" id="fs-pop-title">Your teams. Every market\u2019s take.</div>' +
      '<div class="fs-pop-sub">Build a free feed for every team you follow, across every sport. See how their local writers and the national media are covering them, all in one place.</div>' +
      '<button class="fs-pop-cta" onclick="fsGoSignup()">Build My Free Feed</button>' +
      '<button class="fs-pop-later" onclick="fsClosePop()">Maybe later</button>' +
      '</div>';
    el.addEventListener('click', function (e) { if (e.target === el) closePop(); });
    document.body.appendChild(el);
    document.addEventListener('keydown', popKeys);
    requestAnimationFrame(function () { el.classList.add('show'); });
    var cta = el.querySelector('.fs-pop-cta');
    if (cta) cta.focus();
  }
  if (section() === 'home') setTimeout(showPop, 10000);

  // ── Boot ───────────────────────────────────────────────────────
  mountTop();
  wrapPageFunctions();
  renderAccount();
  fillTrending();
  document.addEventListener('DOMContentLoaded', renderAccount);
  window.addEventListener('load', renderAccount);
  window.addEventListener('fs-account', renderAccount);
})();
