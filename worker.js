// Forwards /ingest/* to PostHog (US). Everything else is served from the static files.
const API_HOST = 'us.i.posthog.com';
const ASSET_HOST = 'us-assets.i.posthog.com';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
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
