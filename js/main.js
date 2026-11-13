/* ============================================================
   FODDER SPORTS — Main JS
   Data-driven rendering. Claude skills write JSON to /data/.
   This file only reads and renders — never modified by skills.
   ============================================================ */

// ── Helpers ──────────────────────────────────────────────────

function dataPath(path) {
  // Works from any subdirectory depth
  const depth = window.location.pathname.split('/').filter(p => p && !p.endsWith('.html')).length;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return prefix + path;
}

async function fetchJSON(path) {
  try {
    const r = await fetch(dataPath(path) + '?t=' + Date.now());
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function typeLabel(type) {
  const map = {
    preview:  { label: 'Game Preview',  cls: 'type-preview'  },
    recap:    { label: 'Game Recap',     cls: 'type-recap'    },
    trade:    { label: 'Trade',          cls: 'type-trade'    },
    breaking: { label: 'Breaking',       cls: 'type-breaking' },
    story:    { label: 'Story',          cls: 'type-story'    },
    rankings: { label: 'Rankings',       cls: 'type-rankings' },
  };
  return map[type] || { label: type, cls: 'type-story' };
}

// ── Feed Card ────────────────────────────────────────────────

function buildCard(item) {
  const t = typeLabel(item.type);
  const teamA = item.teams ? item.teams[0] : '';
  const teamB = item.teams ? item.teams[1] : '';
  const because = item.because ? `<div class="card-because">${escHtml(item.because)}</div>` : '';
  const desc = item.desc ? `<div class="card-desc">${escHtml(item.desc)}</div>` : '';

  // ESPN logo CDN — WAS uses 'wsh'
  const espnAbbr = { 'WAS': 'wsh' };
  function logoUrl(abbr) {
    return `https://a.espncdn.com/i/teamlogos/nfl/500/${(espnAbbr[abbr] || abbr).toLowerCase()}.png`;
  }

  const thumbBg = { preview: '#0d1a2e', recap: '#0a1a10', trade: '#1a0d00', breaking: '#1a0505', story: '#0d0a1a', rankings: '#000d1a' }[item.type] || '#0d0d0d';
  const bannerBg = { preview: '#1a4a8c', recap: '#0D3B1E', trade: '#5a3500', breaking: '#7A1E00', story: '#2D1050', rankings: '#0A2660' }[item.type] || '#333';
  const bannerHtml = `<div style="position:absolute;top:0;left:0;font-family:var(--font-head);font-size:7px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:${bannerBg};padding:3px 6px;z-index:3;">${t.label}</div>`;

  function logoCircle(abbr, sz) {
    return `<div style="position:relative;width:${sz}px;height:${sz}px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at center,rgba(255,255,255,.18) 0%,rgba(255,255,255,.07) 45%,transparent 72%);"></div>
      <img src="${logoUrl(abbr)}" alt="${escHtml(abbr)}" style="position:relative;width:${sz - 6}px;height:${sz - 6}px;object-fit:contain;filter:drop-shadow(0 1px 4px rgba(0,0,0,.55));z-index:1;" onerror="this.style.display='none'">
    </div>`;
  }

  let thumbInner;
  if (teamA && teamB) {
    thumbInner = `<div style="display:flex;align-items:center;justify-content:center;gap:4px;padding-top:6px;">${logoCircle(teamA, 40)}<div style="font-family:var(--font-head);font-size:7px;font-weight:900;color:rgba(255,255,255,.3);letter-spacing:.1em;">AT</div>${logoCircle(teamB, 40)}</div>`;
  } else if (teamA) {
    thumbInner = `<div style="display:flex;align-items:center;justify-content:center;padding-top:6px;">${logoCircle(teamA, 50)}</div>`;
  } else {
    thumbInner = `<div style="font-family:var(--font-head);font-size:11px;font-weight:800;color:rgba(255,255,255,.3);text-align:center;letter-spacing:.06em;">NFL</div>`;
  }

  return `
    <a href="${escHtml(item.url || '#')}" class="card">
      <div class="card-thumb" style="background:${thumbBg};padding:14px 8px 10px;position:relative;">
        ${bannerHtml}
        ${thumbInner}
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-type ${t.cls}">${t.label}</span>
          <span class="card-date">${escHtml(item.date || '')}</span>
          ${item.teams_full ? item.teams_full.map(tf => `<span style="font-family:var(--font-head);font-size:10px;font-weight:800;background:var(--ink);color:var(--off-white);padding:2px 6px;border-radius:2px;">${escHtml(tf)}</span>`).join('') : ''}
        </div>
        ${because}
        <div class="card-title">${escHtml(item.title)}</div>
        ${desc}
      </div>
    </a>`;
}

// ── Sentiment Bar ────────────────────────────────────────────

function buildSentimentRows(rows, teamColor) {
  return rows.map(row => {
    const val = row.value || 0; // -2 to +2
    const pct = Math.abs(val) / 2 * 40; // max 40% of half-track
    const cls = val > 0 ? (teamColor === 'blue' ? 'positive blue-team' : 'positive')
              : val < 0 ? 'negative' : 'neutral-pos';
    const verdict = val > 0.5 ? 'Positive' : val < -0.5 ? 'Critical' : 'Neutral';
    return `
      <div class="sentiment-row">
        <span class="sentiment-market">${escHtml(row.market)}</span>
        <div class="sentiment-track">
          <div class="sentiment-center-line"></div>
          <div class="sentiment-fill ${cls}" style="width:${pct}%;"></div>
        </div>
        <span class="sentiment-verdict">${verdict}</span>
      </div>`;
  }).join('');
}

function buildSentimentBlock(data) {
  if (!data) return '';
  const teams = data.teams || [];
  const groups = teams.map((t, i) => `
    <div class="sentiment-group">
      <div class="sentiment-group-label ${i === 0 ? 'orange' : 'blue'}">${escHtml(t.name)}</div>
      ${buildSentimentRows(t.rows, i === 0 ? 'orange' : 'blue')}
      ${t.first_reading ? `<div class="sentiment-first-reading">· <strong>First reading.</strong> ${escHtml(t.first_reading)}</div>` : ''}
    </div>`).join('');

  return `
    <div class="sentiment-block">
      <div class="sentiment-block-title">How the Coverage Feels</div>
      <div class="sentiment-desc">${escHtml(data.desc || 'How each market feels about each team, read from all the coverage we could find.')}</div>
      ${groups}
      <div class="sentiment-axis">
        <span>Harsh</span><span>Neutral</span><span>Glowing</span>
      </div>
      <p class="sentiment-note">Each bar shows the overall tone of that group's coverage toward the team. Bars to the right of center are favorable, bars to the left are critical. "No coverage" means that group published nothing about the team in this window.</p>
    </div>`;
}

// ── Power Rankings Widget ─────────────────────────────────────

function buildRankingsWidget(rankings) {
  if (!rankings || !rankings.teams) {
    return '<div style="padding:16px;font-family:var(--font-body);font-size:13px;color:var(--slate);">No rankings yet.</div>';
  }
  const note = rankings.note ? `<div style="padding:8px 16px 0;font-family:var(--font-body);font-size:11px;color:var(--slate-light);">${escHtml(rankings.note)}</div>` : '';
  const rows = rankings.teams.slice(0, 10).map((t, i) => {
    const move = t.move > 0 ? '↑' : t.move < 0 ? '↓' : '—';
    const moveColor = t.move > 0 ? '#1A6B3A' : t.move < 0 ? '#9B1C1C' : 'var(--slate)';
    return `
    <div class="ranking-row">
      <span class="rank-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="rank-team">${escHtml(t.name)}</span>
      <span class="rank-arrow" style="color:${moveColor};">${move}</span>
    </div>`;
  }).join('');
  return note + rows;
}

// ── Schedule Widget ───────────────────────────────────────────

function buildScheduleWidget(games) {
  if (!games || !games.length) {
    return '<div style="padding:16px;font-family:var(--font-body);font-size:13px;color:var(--slate);">No games scheduled.</div>';
  }
  return games.map(g => `
    <a href="${escHtml(g.url || '#')}" style="display:block;padding:12px 16px;border-bottom:1px solid var(--rule);transition:background 0.1s;" onmouseover="this.style.background='rgba(0,0,0,.02)'" onmouseout="this.style.background=''">
      <div style="font-family:var(--font-head);font-size:11px;font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px;">${escHtml(g.date || '')}</div>
      <div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:var(--ink);">${escHtml(g.away)} <span style="color:var(--slate);font-weight:600;">at</span> ${escHtml(g.home)}</div>
      ${g.time ? `<div style="font-family:var(--font-body);font-size:12px;color:var(--slate);">${escHtml(g.time)}${g.tv ? ' · ' + escHtml(g.tv) : ''}</div>` : ''}
    </a>`).join('');
}

// ── Team Selector ─────────────────────────────────────────────

const NFL_TEAMS = [
  'Arizona Cardinals','Atlanta Falcons','Baltimore Ravens','Buffalo Bills',
  'Carolina Panthers','Chicago Bears','Cincinnati Bengals','Cleveland Browns',
  'Dallas Cowboys','Denver Broncos','Detroit Lions','Green Bay Packers',
  'Houston Texans','Indianapolis Colts','Jacksonville Jaguars','Kansas City Chiefs',
  'Las Vegas Raiders','Los Angeles Chargers','Los Angeles Rams','Miami Dolphins',
  'Minnesota Vikings','New England Patriots','New Orleans Saints','New York Giants',
  'New York Jets','Philadelphia Eagles','Pittsburgh Steelers','San Francisco 49ers',
  'Seattle Seahawks','Tampa Bay Buccaneers','Tennessee Titans','Washington Commanders'
];

function buildTeamSelector(selectEl, currentTeam) {
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="">All Teams</option>' +
    NFL_TEAMS.map(t => `<option value="${t}"${t === currentTeam ? ' selected' : ''}>${t}</option>`).join('');
  selectEl.addEventListener('change', () => {
    const team = selectEl.value;
    if (team) {
      window.location.href = `index.html?team=${encodeURIComponent(team)}`;
    } else {
      window.location.href = 'index.html';
    }
  });
}

// ── Escape HTML ───────────────────────────────────────────────

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Page Init ─────────────────────────────────────────────────

async function init() {
  const params = new URLSearchParams(window.location.search);
  const teamFilter = params.get('team') || '';
  const tabFilter = params.get('tab') || '';

  // Load feed
  const feedEl = document.getElementById('nfl-feed') || document.getElementById('homepage-feed');
  if (feedEl) {
    const feedData = await fetchJSON('data/nfl/feed.json');
    if (feedData && feedData.items && feedData.items.length) {
      let items = feedData.items;
      if (teamFilter) items = items.filter(i => i.teams_full && i.teams_full.includes(teamFilter));
      if (tabFilter && tabFilter !== 'all') items = items.filter(i => i.type === tabFilter);
      feedEl.innerHTML = items.length
        ? items.map(buildCard).join('')
        : '<div style="font-family:var(--font-body);font-size:14px;color:var(--slate);padding:20px 0;">No stories yet. Check back after the next skill run.</div>';
    } else {
      feedEl.innerHTML = '<div style="font-family:var(--font-body);font-size:14px;color:var(--slate);padding:20px 0;">No feed data yet.</div>';
    }
  }

  // Load power rankings widget
  const rankEl = document.getElementById('rankings-widget');
  if (rankEl) {
    const rankData = await fetchJSON('data/nfl/power-rankings.json');
    rankEl.innerHTML = buildRankingsWidget(rankData);
  }

  // Load schedule widget
  const schedEl = document.getElementById('schedule-widget');
  if (schedEl) {
    const schedData = await fetchJSON('data/nfl/schedule.json');
    schedEl.innerHTML = buildScheduleWidget(schedData ? schedData.games : []);
  }

  // Team selector
  const teamSelect = document.getElementById('team-select');
  if (teamSelect) buildTeamSelector(teamSelect, teamFilter);

  // Update page title if team selected
  const titleEl = document.getElementById('page-title');
  if (titleEl && teamFilter) {
    titleEl.textContent = teamFilter;
    document.title = `${teamFilter} — Fodder Sports`;
  }

  // Tab active state
  document.querySelectorAll('.content-tab[data-tab]').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const t = tab.dataset.tab;
      const base = window.location.pathname.split('?')[0];
      window.location.href = base + (t !== 'all' ? `?tab=${t}` : '') + (teamFilter ? `${t !== 'all' ? '&' : '?'}team=${encodeURIComponent(teamFilter)}` : '');
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
