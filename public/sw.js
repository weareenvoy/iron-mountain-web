// Simple service worker for kiosk/offline-first
// Receives config from the app via postMessage: { type: 'CONFIG', apiBase: string, offlineFirst: boolean }

const VERSION = 'v6';
const PRECACHE = `precache-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

// Precache all static routes, API data, fonts, and fallback videos
const PRECACHE_URLS = [
  // Routes - displays
  '/',
  '/basecamp/',
  '/overlook/',
  '/welcome-wall/',
  '/summit/',
  '/summit/print/',
  '/summit/slides/',
  '/kiosk-1/',
  '/kiosk-2/',
  '/kiosk-3/',
  // Routes - tablets
  '/docent/',
  '/docent/schedule/',
  // Static API data (offline fallback)
  '/api/basecamp.json',
  '/api/docent_initial.json',
  '/api/kiosk_1.json',
  '/api/kiosk_2.json',
  '/api/kiosk_3.json',
  '/api/summit_room.json',
  '/api/tours.json',
  '/api/welcome_wall.json',
  // Fonts
  '/fonts/Geometria.woff2',
  '/fonts/Interstate-Light.woff2',
  '/fonts/InterstateRegular.woff2',
  // Fallback Images
  '/images/binary-code-circle.png',
  // Fallback videos
  '/videos/basecamp_fallback.webm',
  '/videos/summit_fallback.webm',
  // Other
  '/favicon.ico',
  'logo.svg'
];

self.__CONFIG = {
  apiBase: '',
  offlineFirst: true,
};

self.addEventListener('message', event => {
  const data = event?.data;
  if (data && data.type === 'CONFIG') {
    self.__CONFIG.apiBase = data.apiBase || '';
    self.__CONFIG.offlineFirst = Boolean(data.offlineFirst);
  }
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache =>
        Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn(`Service Worker: Failed to cache ${url}:`, err);
              return null;
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = new Set([PRECACHE, RUNTIME]);
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => !currentCaches.has(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      const copy = response.clone();
      caches.open(RUNTIME).then(cache => cache.put(request, copy));
      return response;
    });
  });
}

function networkFirstWithTimeout(request, timeoutMs = 4000) {
  return new Promise(resolve => {
    let settled = false;
    const timer = setTimeout(async () => {
      if (settled) return;
      const cached = await caches.match(request);
      if (cached) {
        settled = true;
        resolve(cached);
      }
    }, timeoutMs);

    fetch(request)
      .then(response => {
        if (!settled) {
          clearTimeout(timer);
          const copy = response.clone();
          caches.open(RUNTIME).then(cache => cache.put(request, copy));
          settled = true;
          resolve(response);
        }
      })
      .catch(async () => {
        if (!settled) {
          clearTimeout(timer);
          const cached = await caches.match(request);
          settled = true;
          resolve(cached || Response.error());
        }
      });
  });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then(cached => {
    const network = fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(RUNTIME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(() => undefined);
    return cached || network || fetch(request);
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Navigation: prefer network with a timeout, fall back to cache
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstWithTimeout(req, 4000));
    return;
  }

  // Same-origin static assets: cache-first
  if (url.origin === self.location.origin) {
    const isStatic =
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.startsWith('/api/');
    if (isStatic) {
      event.respondWith(cacheFirst(req));
      return;
    }
  }

  // External API: SWR if offlineFirst, else network-first with fallback
  if (self.__CONFIG.apiBase && url.href.startsWith(self.__CONFIG.apiBase)) {
    if (self.__CONFIG.offlineFirst) {
      event.respondWith(staleWhileRevalidate(req));
    } else {
      event.respondWith(networkFirstWithTimeout(req, 3500));
    }
    return;
  }
});
