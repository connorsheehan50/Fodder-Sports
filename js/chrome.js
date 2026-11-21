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
  var CSS = "/* \u2500\u2500 Header Buttons \u2500\u2500 */\n    .header-actions {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      flex-shrink: 0;\n    }\n    .btn-signin {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--slate-light);\n      padding: 6px 14px;\n      border: 1px solid #333;\n      border-radius: 3px;\n      cursor: pointer;\n      background: none;\n      transition: color 0.15s, border-color 0.15s;\n    }\n    .btn-signin:hover { color: var(--off-white); border-color: #666; }\n    .btn-signup {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 800;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: #fff;\n      padding: 7px 16px;\n      background: var(--orange);\n      border: none;\n      border-radius: 3px;\n      cursor: pointer;\n      transition: opacity 0.15s;\n    }\n    .btn-signup:hover { opacity: 0.85; }\n    .btn-account {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--off-white);\n      padding: 6px 14px;\n      border: 1px solid #444;\n      border-radius: 3px;\n      cursor: pointer;\n      background: none;\n      display: none;\n      align-items: center;\n      gap: 7px;\n      transition: border-color 0.15s;\n      white-space: nowrap;\n    }\n    .btn-account:hover { border-color: var(--orange); }\n    .btn-account .account-dot {\n      width: 7px; height: 7px;\n      background: var(--orange);\n      border-radius: 50%;\n      display: inline-block;\n    }\n    @media (max-width: 540px) {\n      .btn-signin { display: none; }\n    }\n\n    /* \u2500\u2500 Primary Nav \u2500\u2500 */\n    .primary-nav {\n      background: var(--off-white);\n      border-bottom: 1px solid var(--rule);\n      position: sticky;\n      top: 60px;\n      z-index: 90;\n    }\n    .primary-nav-inner {\n      display: flex;\n      align-items: center;\n      gap: 0;\n      overflow-x: auto;\n      scrollbar-width: none;\n    }\n    .primary-nav-inner::-webkit-scrollbar { display: none; }\n    .nav-item {\n      position: relative;\n      flex-shrink: 0;\n    }\n    .nav-link {\n      display: flex;\n      align-items: center;\n      gap: 4px;\n      font-family: var(--font-head);\n      font-size: 13px;\n      font-weight: 700;\n      letter-spacing: 0.08em;\n      text-transform: uppercase;\n      color: var(--slate);\n      padding: 14px 18px;\n      border-bottom: 3px solid transparent;\n      cursor: pointer;\n      white-space: nowrap;\n      transition: color 0.15s, border-color 0.15s;\n      text-decoration: none;\n      background: none;\n      border-top: none;\n      border-left: none;\n      border-right: none;\n      font-family: var(--font-head);\n    }\n    .nav-link:hover { color: var(--ink); }\n    .nav-link.active {\n      color: var(--ink);\n      border-bottom-color: var(--orange);\n    }\n    .nav-link .nav-badge {\n      font-size: 9px;\n      font-weight: 800;\n      letter-spacing: 0.05em;\n      color: var(--slate-light);\n      margin-left: 2px;\n    }\n    .nav-link .caret {\n      font-size: 8px;\n      color: var(--slate-light);\n      margin-left: 1px;\n      transition: transform 0.15s;\n    }\n    .nav-item:hover .caret { transform: rotate(180deg); }\n\n    /* Dropdown */\n    .nav-dropdown {\n      position: absolute;\n      top: 100%;\n      left: 0;\n      background: var(--card-bg);\n      border: 1px solid var(--rule);\n      border-top: 2px solid var(--orange);\n      border-radius: 0 0 var(--radius-lg) var(--radius-lg);\n      min-width: 190px;\n      box-shadow: 0 8px 24px rgba(0,0,0,.12);\n      display: none;\n      z-index: 200;\n      flex-direction: column;\n      padding: 6px 0;\n    }\n    .nav-item:hover .nav-dropdown { display: flex; }\n    .nav-dropdown a {\n      display: block;\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      letter-spacing: 0.07em;\n      text-transform: uppercase;\n      color: var(--slate);\n      padding: 10px 18px;\n      transition: background 0.1s, color 0.1s;\n    }\n    .nav-dropdown a:hover { background: var(--page-bg); color: var(--ink); }\n    .nav-dropdown .dropdown-divider {\n      height: 1px;\n      background: var(--rule);\n      margin: 4px 12px;\n    }\n\n    /* \u2500\u2500 Trending Strip \u2500\u2500 */\n    .trending-strip {\n      background: var(--ink);\n      padding: 0;\n      border-bottom: 1px solid #222;\n      overflow: hidden;\n    }\n    .trending-inner {\n      display: flex;\n      align-items: center;\n      overflow-x: auto;\n      scrollbar-width: none;\n      gap: 0;\n    }\n    .trending-inner::-webkit-scrollbar { display: none; }\n    .trending-label {\n      font-family: var(--font-head);\n      font-size: 10px;\n      font-weight: 800;\n      letter-spacing: 0.15em;\n      text-transform: uppercase;\n      color: var(--orange);\n      padding: 10px 16px 10px var(--gutter);\n      white-space: nowrap;\n      flex-shrink: 0;\n      border-right: 1px solid #333;\n    }\n    .trending-items {\n      display: flex;\n      align-items: center;\n      gap: 0;\n      overflow-x: auto;\n      scrollbar-width: none;\n      flex: 1;\n      animation: ticker 40s linear infinite;\n    }\n    .trending-items::-webkit-scrollbar { display: none; }\n    .trending-item {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 10px 20px;\n      cursor: pointer;\n      text-decoration: none;\n      white-space: nowrap;\n      border-right: 1px solid #222;\n      transition: background 0.1s;\n    }\n    .trending-item:hover { background: #111; }\n    .trending-item-badge {\n      font-family: var(--font-head);\n      font-size: 8px;\n      font-weight: 800;\n      letter-spacing: 0.1em;\n      text-transform: uppercase;\n      padding: 2px 6px;\n      border-radius: 2px;\n      flex-shrink: 0;\n    }\n    .badge-breaking { background: var(--orange); color: #fff; }\n    .badge-hot { background: #c0392b; color: #fff; }\n    .badge-rankings { background: var(--blue); color: #fff; }\n    .trending-item-text {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--off-white);\n      letter-spacing: 0.03em;\n    }\n\n    \n/* \u2500\u2500 Account Dropdown \u2500\u2500 */\n    .account-menu {\n      position: absolute;\n      top: calc(100% + 8px);\n      right: 0;\n      background: var(--card-bg);\n      border: 1px solid var(--rule);\n      border-radius: var(--radius-lg);\n      box-shadow: 0 8px 24px rgba(0,0,0,.12);\n      min-width: 200px;\n      display: none;\n      z-index: 300;\n      padding: 8px 0;\n    }\n    .account-menu.open { display: block; }\n    .account-menu-header {\n      padding: 12px 16px 10px;\n      border-bottom: 1px solid var(--rule);\n    }\n    .account-menu-email {\n      font-family: var(--font-body);\n      font-size: 13px;\n      color: var(--slate);\n    }\n    .account-menu-team {\n      font-family: var(--font-head);\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--ink);\n      margin-top: 2px;\n    }\n    .account-menu a, .account-menu button {\n      display: block;\n      width: 100%;\n      text-align: left;\n      padding: 10px 16px;\n      font-family: var(--font-body);\n      font-size: 14px;\n      color: var(--ink);\n      background: none;\n      border: none;\n      cursor: pointer;\n      transition: background 0.1s;\n    }\n    .account-menu a:hover, .account-menu button:hover { background: var(--page-bg); }\n    .account-menu .sign-out { color: #c0392b; }\n    .account-wrapper {\n      position: relative;\n    }\n  " + [
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
    '.site-top .header-actions{margin-left:0;}',
    '.fs-search{position:relative;margin-left:auto;flex-shrink:0;}',
    '.fs-search-box{display:flex;align-items:center;gap:8px;border:1px solid var(--rule);border-radius:4px;background:var(--page-bg);padding:0 10px;height:38px;width:240px;transition:width .2s,border-color .2s;color:var(--slate);}',
    '.fs-search-box:focus-within{width:300px;border-color:var(--ink);background:var(--card-bg);}',
    '.fs-search-box input{border:none;background:none;outline:none;font-family:var(--font-body);font-size:14px;color:var(--ink);width:100%;min-width:0;}',
    '.fs-search-toggle{display:none;background:none;border:1px solid var(--rule);border-radius:4px;width:38px;height:38px;align-items:center;justify-content:center;color:var(--ink);cursor:pointer;}',
    '.fs-search-results{display:none;position:absolute;top:calc(100% + 8px);right:0;width:420px;max-width:calc(100vw - 32px);background:var(--card-bg);border:1px solid var(--rule);border-top:2px solid var(--orange);border-radius:0 0 8px 8px;box-shadow:0 10px 30px rgba(0,0,0,.14);z-index:400;max-height:70vh;overflow-y:auto;}',
    '.fs-search-results.open{display:block;}',
    '.fs-sr-group{font-family:var(--font-head);font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--slate);padding:10px 14px 4px;}',
    '.fs-sr{display:block;padding:9px 14px;text-decoration:none;color:inherit;border-bottom:1px solid var(--rule);}',
    '.fs-sr:hover,.fs-sr.sel{background:var(--page-bg);}',
    '.fs-sr-meta{font-family:var(--font-head);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--slate);}',
    '.fs-sr-meta b{color:var(--orange);font-weight:900;}',
    '.fs-sr-title{font-family:var(--font-head);font-size:15px;font-weight:800;color:var(--ink);line-height:1.25;margin-top:2px;}',
    '.fs-sr-all{display:block;padding:11px 14px;font-family:var(--font-head);font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--orange);text-decoration:none;}',
    '.fs-sr-empty{padding:14px;font-family:var(--font-body);font-size:13px;color:var(--slate);}',
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
      '.fs-search{margin-left:auto;position:static;}' +
      '.fs-search-toggle{display:flex;}' +
      '.fs-search .fs-search-box{display:none;}' +
      '.fs-search.open .fs-search-box{display:flex;position:absolute;left:16px;right:16px;top:8px;width:auto;z-index:401;background:var(--card-bg);height:44px;}' +
      '.fs-search .fs-search-results{top:58px;left:16px;right:16px;width:auto;max-width:none;}' +
      '.site-top .fs-bar-inner{position:relative;}' +
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
    location.href = '/account.html#teams';
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
    var acc = getAcc() || {};
    var types = acc.feed_types && acc.feed_types.length ? acc.feed_types : null;
    return (items || []).filter(function (i) {
      if (types && types.indexOf(i.type) < 0) return false;
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

  var SEARCH_ICON = '<svg class="fs-search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

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
        '<form class="fs-search" id="fs-search" role="search" action="/search.html" onsubmit="return fsSearchSubmit(event)">' +
          '<button type="button" class="fs-search-toggle" aria-label="Search" onclick="fsSearchOpen()">' + SEARCH_ICON + '</button>' +
          '<div class="fs-search-box">' + SEARCH_ICON +
            '<input type="search" name="q" id="fs-search-input" placeholder="Search teams, trades, rankings" autocomplete="off" aria-label="Search Fodder Sports">' +
          '</div>' +
          '<div class="fs-search-results" id="fs-search-results" role="listbox"></div>' +
        '</form>' +
        '<div class="header-actions">' +
          '<button class="btn-signin" onclick="fsGoSignup()">Sign In</button>' +
          '<button class="btn-signup" id="btn-signup-header" onclick="fsGoSignup()">Sign Up Free</button>' +
          '<div class="account-wrapper">' +
            '<button class="btn-account" id="btn-account" onclick="toggleAccountMenu()"><span class="account-dot"></span><span id="account-label">My Account</span></button>' +
            '<div class="account-menu" id="account-menu">' +
              '<div class="account-menu-header"><div class="account-menu-email" id="account-email"></div><div class="account-menu-team" id="account-team-display"></div></div>' +
              '<a href="/?tab=myfeed">My Feed</a>' +
              '<a href="/account.html#teams">My Teams</a>' +
              '<a href="/account.html#profile">Account Settings</a>' +
              '<a href="/account.html#email">Email Preferences</a>' +
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

  // Feed dates are written like "Nov. 10" or "Sun, Nov. 8 · SNF"; the year is the feed's season.
  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function itemTime(item, season) {
    var m = String(item.date || '').toLowerCase().match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})/);
    if (m) {
      var mon = MONTHS[m[1]];
      var yr = season + (mon <= 2 ? 1 : 0);   // Jan-Mar games belong to the next calendar year
      return new Date(yr, mon, Number(m[2]), 12).getTime();
    }
    var u = String(item.url || '').match(/(20\d\d)(\d\d)(\d\d)/);
    return u ? new Date(Number(u[1]), Number(u[2]) - 1, Number(u[3]), 12).getTime() : 0;
  }
  window.fsItemTime = itemTime;

  var rankPromise = null;
  function loadRankingsMeta() {
    if (!rankPromise) {
      rankPromise = fetch('/data/nfl/power-rankings-history.json?t=' + Date.now())
        .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }
    return rankPromise;
  }

  // Every rankings week as a searchable item; the latest week points at the current page.
  function rankingsItems(hist) {
    if (!hist || !hist.weeks) return [];
    var weeks = Object.keys(hist.weeks).map(Number).sort(function (a, b) { return a - b; });
    var latest = weeks[weeks.length - 1];
    return weeks.map(function (w) {
      var wk = hist.weeks[String(w)];
      var title = wk.title || ('Week ' + w + ' Power Rankings');
      if (!/week\s*\d+/i.test(title)) title = 'Week ' + w + ' Power Rankings: ' + title;
      var t = Date.parse(wk.updated) || 0;
      return {
        id: 'rankings-w' + w, type: 'rankings', week: w, current: w === latest,
        title: title, desc: 'Consensus NFL power rankings from the national outlets, Week ' + w + '.',
        teams: [], teams_full: [], time: t,
        date: t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        url: w === latest ? '/nfl/power-rankings.html' : '/nfl/power-rankings-w' + w + '.html'
      };
    });
  }
  window.fsRankingsItems = function () { return loadRankingsMeta().then(rankingsItems); };

  var TRENDING_DAYS = 14;
  function fillTrending() {
    Promise.all([loadFeed(), loadRankingsMeta()]).then(function (res) {
      var d = res[0], hist = res[1];
      var el = document.getElementById('trending-items');
      if (!el) return;
      var season = (d && d.season) || new Date().getFullYear();
      var now = Date.now(), cutoff = now - TRENDING_DAYS * 864e5;
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var items = ((d && d.items) || []).filter(function (i) {
        if (!i.url || i.url === '#') return false;
        if (i.type === 'rankings') return false;               // only the current week, added below
        var t = itemTime(i, season);
        if (!t || t < cutoff || t > now + 7 * 864e5) return false;
        if (i.type === 'preview' && t < today.getTime()) return false;   // game already played
        return true;
      }).sort(function (a, b) { return itemTime(b, season) - itemTime(a, season); });
      var current = rankingsItems(hist).filter(function (r) { return r.current; })[0];
      if (current) items.unshift(current);
      items = items.slice(0, 8);
      el.innerHTML = items.map(function (item) {
        var cls = item.type === 'breaking' ? 'badge-breaking' : item.type === 'rankings' ? 'badge-rankings' : 'badge-hot';
        var lbl = item.type === 'breaking' ? 'Breaking' : item.type === 'rankings' ? 'Rankings' : 'NFL';
        return '<a href="' + esc(item.url) + '" class="trending-item" data-fs-track="trending"><span class="trending-item-badge ' + cls + '">' + lbl +
          '</span><span class="trending-item-text">' + esc(item.title) + '</span></a>';
      }).join('');
    });
  }

  // ── Search ─────────────────────────────────────────────────────
  var TYPE_WORDS = {
    trade: 'trade trades traded deal acquire acquires acquired move',
    preview: 'preview game preview matchup pregame',
    recap: 'recap result final postgame game recap',
    rankings: 'power rankings rankings ranking poll consensus',
    breaking: 'breaking news',
    story: 'story news'
  };
  var STOP = { the: 1, a: 1, an: 1, of: 1, in: 1, on: 1, at: 1, for: 1, and: 1, to: 1, vs: 1, v: 1, with: 1, about: 1 };
  function norm(t) { return String(t || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

  var indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = Promise.all([loadFeed(), loadRankingsMeta()]).then(function (res) {
        var d = res[0], season = (d && d.season) || new Date().getFullYear();
        var feed = ((d && d.items) || []).filter(function (i) { return i.url && i.url !== '#' && i.type !== 'rankings'; })
          .map(function (i) { var c = Object.assign({}, i); c.time = itemTime(i, season); return c; });
        // Trade deadline: the latest trade story that mentions "deadline" marks the day;
        // trades in the week before it (and the day after) count as deadline moves.
        var deadline = 0;
        feed.forEach(function (i) {
          if ((i.type === 'trade' || i.type === 'breaking') && /deadline/i.test(i.title + ' ' + i.desc) && i.time > deadline) deadline = i.time;
        });
        feed.forEach(function (i) {
          if (deadline && (i.type === 'trade' || (i.type === 'breaking' && /trade/i.test(i.title))) &&
              i.time >= deadline - 7 * 864e5 && i.time <= deadline + 864e5) i.deadline = true;
        });
        return feed.concat(rankingsItems(res[1])).map(function (i) {
          var yr = String(new Date(i.time || Date.now()).getFullYear());
          var f = {
            title: norm(i.title),
            teams: norm((i.teams_full || []).join(' ') + ' ' + (i.teams || []).join(' ')),
            type: norm((TYPE_WORDS[i.type] || i.type) + ' nfl football ' + season + ' ' + yr + (i.week ? ' week ' + i.week : '') + (i.deadline ? ' trade deadline deadline day' : '')),
            desc: norm((i.desc || '') + ' ' + (i.because || ''))
          };
          // joined-up text, so "tradedeadline" or "powerrankings" still match
          f.compact = [f.title, f.teams, f.type, f.desc].join(' ').replace(/ /g, '');
          return { item: i, f: f };
        });
      });
    }
    return indexPromise;
  }

  function scoreDoc(doc, tokens) {
    var score = 0, hits = 0, W = { title: 3, teams: 3, type: 2, desc: 1 };
    tokens.forEach(function (tok) {
      var best = 0;
      Object.keys(W).forEach(function (k) {
        var words = doc.f[k].split(' ');
        var hit = words.indexOf(tok) >= 0 ? 1 : (tok.length >= 3 && words.some(function (w) { return w.indexOf(tok) === 0; }) ? 0.7 : 0);
        if (hit * W[k] > best) best = hit * W[k];
      });
      if (!best && tok.length >= 5 && doc.f.compact.indexOf(tok) >= 0) best = 1.5;
      if (best) { hits++; score += best; }
    });
    return { score: score, hits: hits };
  }

  function isFavItem(item, favNames, hasNfl) {
    if (item.type === 'rankings') return hasNfl;
    return (item.teams_full || []).some(function (n) { return favNames.indexOf(n) >= 0; });
  }

  window.fsSearch = function (q) {
    var tokens = norm(q).split(' ').filter(function (t) { return t && !STOP[t]; });
    return loadIndex().then(function (docs) {
      if (!tokens.length) return { results: [], partial: false, tokens: tokens };
      var favs = favorites(), favNames = favs.map(function (f) { return f.name; });
      var hasNfl = favs.some(function (f) { return f.sport === 'NFL'; });
      var scored = docs.map(function (d) { var r = scoreDoc(d, tokens); r.item = d.item; return r; })
        .filter(function (r) { return r.hits > 0; });
      var full = scored.filter(function (r) { return r.hits === tokens.length; });
      var partial = !full.length;
      var list = partial ? scored.filter(function (r) { return r.hits >= Math.max(1, tokens.length - 1); }) : full;
      list.forEach(function (r) { r.fav = isFavItem(r.item, favNames, hasNfl) ? 1 : 0; });
      list.sort(function (a, b) {
        return (b.fav - a.fav) || (b.hits - a.hits) || (b.score - a.score) || ((b.item.time || 0) - (a.item.time || 0));
      });
      return { results: list, partial: partial, tokens: tokens };
    });
  };

  var TYPE_LABEL = { trade: 'Trade', preview: 'Game Preview', recap: 'Game Recap', rankings: 'Power Rankings', breaking: 'Breaking', story: 'Story' };
  window.fsTypeLabel = function (t) { return TYPE_LABEL[t] || t; };

  var searchTimer = null, searchSel = -1;
  function renderDropdown(q) {
    var box = document.getElementById('fs-search-results');
    if (!box) return;
    if (!q.trim()) { box.classList.remove('open'); box.innerHTML = ''; return; }
    window.fsSearch(q).then(function (res) {
      var input = document.getElementById('fs-search-input');
      if (!input || input.value !== q) return;   // a newer query is on screen
      var top = res.results.slice(0, 6);
      var html = '';
      if (!top.length) {
        html = '<div class="fs-sr-empty">No matches for “' + esc(q) + '” yet. Try a team, a player, or a word like “trade”.</div>';
      } else {
        var lastGroup = null;
        top.forEach(function (r, i) {
          var group = r.fav ? 'From your teams' : (res.partial ? 'Closest matches' : 'Results');
          if (group !== lastGroup) { html += '<div class="fs-sr-group">' + group + '</div>'; lastGroup = group; }
          html += '<a class="fs-sr" role="option" data-fs-track="search_result" data-q="' + esc(q) + '" href="' + esc(r.item.url) + '">' +
            '<div class="fs-sr-meta"><b>' + esc(TYPE_LABEL[r.item.type] || r.item.type) + '</b> · ' + esc(r.item.date || '') +
            ((r.item.teams_full || []).length ? ' · ' + esc(r.item.teams_full.join(', ')) : '') + '</div>' +
            '<div class="fs-sr-title">' + esc(r.item.title) + '</div></a>';
        });
        html += '<a class="fs-sr-all" href="/search.html?q=' + encodeURIComponent(q) + '">See all ' + res.results.length + ' result' + (res.results.length === 1 ? '' : 's') + ' →</a>';
      }
      box.innerHTML = html;
      box.classList.add('open');
      searchSel = -1;
      clearTimeout(window.__fsSearchTrack);
      window.__fsSearchTrack = setTimeout(function () { track('search', { query: q, results: res.results.length, partial: res.partial }); }, 1200);
    });
  }

  window.fsSearchSubmit = function (e) {
    e.preventDefault();
    var input = document.getElementById('fs-search-input');
    var q = input ? input.value.trim() : '';
    var sel = document.querySelector('#fs-search-results .fs-sr.sel');
    if (sel) { location.href = sel.getAttribute('href'); return false; }
    if (q) location.href = '/search.html?q=' + encodeURIComponent(q);
    return false;
  };
  window.fsSearchOpen = function () {
    var f = document.getElementById('fs-search');
    if (!f) return;
    f.classList.toggle('open');
    if (f.classList.contains('open')) { var i = document.getElementById('fs-search-input'); if (i) i.focus(); }
  };

  function wireSearch() {
    var input = document.getElementById('fs-search-input');
    if (!input) return;
    var q0 = new URLSearchParams(location.search).get('q');
    if (q0 && /\/search(\.html)?$/.test(location.pathname)) input.value = q0;
    input.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = input.value;
      searchTimer = setTimeout(function () { renderDropdown(q); }, 120);
    });
    input.addEventListener('focus', function () { if (input.value.trim()) renderDropdown(input.value); });
    input.addEventListener('keydown', function (e) {
      var rows = document.querySelectorAll('#fs-search-results .fs-sr');
      if (e.key === 'Escape') {
        document.getElementById('fs-search-results').classList.remove('open');
        var f = document.getElementById('fs-search'); if (f) f.classList.remove('open');
        input.blur(); return;
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && rows.length) {
        e.preventDefault();
        searchSel = (searchSel + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
        rows.forEach(function (r, i) { r.classList.toggle('sel', i === searchSel); });
      }
    });
    document.addEventListener('click', function (e) {
      var f = document.getElementById('fs-search');
      if (f && !f.contains(e.target)) {
        var b = document.getElementById('fs-search-results'); if (b) b.classList.remove('open');
        f.classList.remove('open');
      }
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
      if (label) label.textContent = acc.display_name || (acc.name ? acc.name.split(' ')[0] : acc.email.split('@')[0]);
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
    track('signup_prompt_dismissed');
    el.classList.remove('show');
    document.removeEventListener('keydown', popKeys);
    setTimeout(function () { el.remove(); }, 250);
  }
  function popKeys(e) { if (e.key === 'Escape') closePop(); }
  window.fsClosePop = closePop;
  function showPop() {
    var acc = getAcc();
    if ((acc && acc.email) || popDismissedRecently() || document.getElementById('fs-pop')) return;
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) { setTimeout(showPop, 8000); return; }   // don't interrupt typing
    var el = document.createElement('div');
    el.className = 'fs-pop';
    el.id = 'fs-pop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'fs-pop-title');
    el.innerHTML = '<div class="fs-pop-card">' +
      '<button class="fs-pop-x" aria-label="Close" onclick="fsClosePop()">×</button>' +
      '<img src="/img/fodder-logo-header.png" alt="Fodder Sports">' +
      '<div class="fs-pop-title" id="fs-pop-title">Every side of your team\u2019s story.</div>' +
      '<div class="fs-pop-sub">Your team\u2019s beat writers, the writers covering this week\u2019s opponent, and the national media rarely see a game the same way. We sift through the noise and bring it into one view, so you can see where the consensus lands and which coverage is worth your time.</div>' +
      '<div class="fs-pop-sub" style="margin-top:-10px;font-size:13px;">Free. Every team you follow, across every sport.</div>' +
      '<button class="fs-pop-cta" onclick="fsGoSignup()">Build My Free Feed</button>' +
      '<button class="fs-pop-later" onclick="fsClosePop()">Maybe later</button>' +
      '</div>';
    el.addEventListener('click', function (e) { if (e.target === el) closePop(); });
    el.querySelector('.fs-pop-cta').addEventListener('click', function () { track('signup_prompt_clicked'); });
    document.body.appendChild(el);
    track('signup_prompt_shown');
    document.addEventListener('keydown', popKeys);
    requestAnimationFrame(function () { el.classList.add('show'); });
    var cta = el.querySelector('.fs-pop-cta');
    if (cta) cta.focus();
  }
  if (section() === 'home') setTimeout(showPop, 10000);

  // ── Analytics (PostHog) ────────────────────────────────────────
  // Paste the PostHog project API key (starts with phc_) to switch tracking on.
  // It is a public key, meant to live in the page.
  var PH_KEY = 'phc_rwTfRCGjX9tHw8pP9acmqbrxHd8K3JtoDXmsYQ9L3QXC';
  var PH_HOST = 'https://us.i.posthog.com';
  var phReady = false;
  function track(event, props) {
    if (phReady && window.posthog && window.posthog.capture) window.posthog.capture(event, props || {});
  }
  window.fsTrack = track;

  function pageContext() {
    var p = location.pathname, ctx = { page_type: 'other', sport: '' };
    if (p === '/' || /^\/index(\.html)?$/.test(p)) ctx.page_type = isMyFeed() ? 'my_feed' : 'home';
    else if (/^\/search/.test(p)) ctx.page_type = 'search';
    else if (/^\/account/.test(p)) ctx.page_type = 'account';
    else if (/^\/nfl\/power-rankings/.test(p)) { ctx.page_type = 'rankings'; ctx.sport = 'NFL'; }
    else if (/^\/nfl\/?(index(\.html)?)?$/.test(p)) { ctx.page_type = 'section'; ctx.sport = 'NFL'; }
    else if (/^\/nfl\/pages\//.test(p)) {
      ctx.sport = 'NFL';
      ctx.page_type = /trade/.test(p) ? 'trade' : /recap/.test(p) ? 'recap' : 'preview';
    }
    return ctx;
  }

  // The teams an article is about, from the feed entry for this page.
  function registerPageTeams() {
    loadFeed().then(function (d) {
      var item = ((d && d.items) || []).find(function (i) { return i.url === location.pathname; });
      if (item && phReady) window.posthog.register({ page_teams: item.teams_full || [], content_type: item.type });
    });
  }

  function cardInfo(a) {
    var href = a.getAttribute('href') || '';
    var t = a.querySelector('.card-title') || a.querySelector('.trending-item-text') || a.querySelector('.fs-sr-title') || a;
    var teams = Array.prototype.map.call(a.querySelectorAll('.card-meta span[style]'), function (x) { return x.textContent.trim(); });
    var type = a.querySelector('.card-type');
    var pos = a.parentNode ? Array.prototype.indexOf.call(a.parentNode.children, a) + 1 : 0;
    return { url: href, title: t.textContent.trim().slice(0, 140), teams: teams, content_type: type ? type.textContent.trim() : '', position: pos };
  }

  function wireTracking() {
    var ctx = pageContext();
    // story cards seen on screen vs. clicked = click-through rate
    if ('IntersectionObserver' in window) {
      var seen = new WeakSet();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !seen.has(e.target)) {
            seen.add(e.target);
            io.unobserve(e.target);
            track('card_impression', Object.assign(cardInfo(e.target), { list: ctx.page_type }));
          }
        });
      }, { threshold: 0.5 });
      var watch = function () { document.querySelectorAll('a.card').forEach(function (c) { if (!seen.has(c)) io.observe(c); }); };
      watch();
      new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      if (a.classList.contains('card')) track('card_click', Object.assign(cardInfo(a), { list: ctx.page_type }));
      else if (a.dataset.fsTrack === 'trending') track('trending_click', cardInfo(a));
      else if (a.dataset.fsTrack === 'search_result') track('search_result_click', Object.assign(cardInfo(a), { query: a.dataset.q }));
      else if (a.classList.contains('fs-sched-row')) track('schedule_click', { url: a.getAttribute('href') });
      else if (a.host && a.host !== location.host) track('outbound_click', { url: a.href, domain: a.host });
    }, true);
    // how far down a page people read
    var marks = [25, 50, 75, 100], hit = {};
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      if (h <= 0) return;
      var pct = Math.round(scrollY / h * 100);
      marks.forEach(function (m) { if (pct >= m && !hit[m]) { hit[m] = 1; track('scroll_depth', { percent: m }); } });
    }, { passive: true });
  }

  function identify() {
    if (!phReady || !window.posthog) return;
    var acc = getAcc();
    if (!acc || !acc.id) return;
    var favs = favorites(acc), sports = {};
    favs.forEach(function (f) { sports[f.sport] = 1; });
    window.posthog.identify(acc.id, {
      email: acc.email,
      name: acc.name || '',
      favorite_teams: favs.map(function (f) { return f.name; }),
      favorite_team_keys: favs.map(function (f) { return f.sport + ':' + f.name; }),
      favorite_sports: Object.keys(sports),
      team_count: favs.length,
      email_prefs: acc.email_prefs || {}
    });
  }
  window.addEventListener('fs-account', identify);

  function startAnalytics() {
    if (!PH_KEY) return;
    /* PostHog loader snippet */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    // Sent through our own domain (see worker.js) so ad blockers don't drop it; localhost goes direct.
    var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    window.posthog.init(PH_KEY, {
      api_host: local ? PH_HOST : location.origin + '/ingest',
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,     // time on page and exit pages
      capture_performance: true,   // page speed
      autocapture: true
    });
    phReady = true;
    window.posthog.register(pageContext());
    registerPageTeams();
    identify();
    try {
      if (localStorage.getItem('fs_just_signed_up')) {
        localStorage.removeItem('fs_just_signed_up');
        track('signed_up', { team_count: favorites().length });
      }
    } catch (e) {}
    wireTracking();
  }

  // ── Boot ───────────────────────────────────────────────────────
  mountTop();
  wrapPageFunctions();
  renderAccount();
  fillTrending();
  wireSearch();
  startAnalytics();
  document.addEventListener('DOMContentLoaded', renderAccount);
  window.addEventListener('load', renderAccount);
  window.addEventListener('fs-account', renderAccount);
})();
