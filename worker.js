// Forwards /ingest/* to PostHog (US) and /espn/* to ESPN's public data feed. Everything else is served from the static files.
const API_HOST = 'us.i.posthog.com';
const ASSET_HOST = 'us-assets.i.posthog.com';
// Standings/stats pages read ESPN directly; when ESPN refuses a browser request they retry here.
const ESPN_HOSTS = { site: 'site.api.espn.com', web: 'site.web.api.espn.com' };

async function espn(request, url, ctx) {
  const m = /^\/espn\/(site|web)(\/apis\/.*)$/.exec(url.pathname);
  if (!m || request.method !== 'GET') return new Response('Not found', { status: 404 });
  const cache = caches.default;
  const key = new Request(url.toString(), { method: 'GET' });
  let res = await cache.match(key);
  if (res) return res;
  const upstream = await fetch('https://' + ESPN_HOSTS[m[1]] + m[2] + url.search, { headers: { 'User-Agent': 'FodderSports/1.0', 'Accept': 'application/json' } });
  res = new Response(upstream.body, { status: upstream.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' } });
  if (upstream.ok) ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/espn/')) return espn(request, url, ctx);
    if (!url.pathname.startsWith('/ingest')) return env.ASSETS.fetch(request);

    const path = url.pathname.replace(/^\/ingest/, '') || '/';
    const isAsset = path.startsWith('/static/') || path.startsWith('/array/');
    const target = 'https://' + (isAsset ? ASSET_HOST : API_HOST) + path + url.search;

    if (isAsset) {
      const cache = caches.default;
      let res = await cache.match(request);
      if (!res) {
        res = await fetch(target);
        if (res.ok) ctx.waitUntil(cache.put(request, res.clone()));
      }
      return res;
    }

    const headers = new Headers(request.headers);
    headers.delete('cookie');
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) headers.set('X-Forwarded-For', ip);   // keeps visitor location accurate
    return fetch(new Request(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'follow'
    }));
  }
};
