/**
 * Service Worker utilizing Workbox for offline-first support.
 * Core prayer times and school calculations run purely offline/locally,
 * and this Service Worker caches the app's files to enable complete offline access.
 */

// Import Workbox from Google CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (self.workbox) {
  console.log('Workbox loaded successfully.');

  // Set up cache names
  const CACHE_NAMES = {
    pages: 'shibir-pages-v1',
    assets: 'shibir-assets-v1',
    images: 'shibir-images-v1',
    fonts: 'shibir-fonts-v1',
    external: 'shibir-external-v1'
  };

  // Configure workbox to use custom cache names
  self.workbox.core.setCacheNameDetails({
    prefix: 'shibir-bd',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime'
  });

  // Force self-updates immediately when ready
  self.skipWaiting();
  self.workbox.core.clientsClaim();

  // 1. Navigation Route (index.html / root / paths)
  // Ensure the page itself loads offline using a NetworkFirst pattern with a timeout.
  self.workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new self.workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.pages,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
      networkTimeoutSeconds: 3, // fast fallback to cache if slow network
    })
  );

  // 2. Static Assets (Vite CSS, JS)
  // Use CacheFirst for fingerprinted and built assets.
  self.workbox.routing.registerRoute(
    ({ request, url }) => {
      return (
        request.destination === 'script' ||
        request.destination === 'style' ||
        url.pathname.includes('/assets/')
      );
    },
    new self.workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.assets,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 3. Images & SVGs
  // Use StaleWhileRevalidate so logos and icons update but display immediately
  self.workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAMES.images,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 4. Web Fonts (Google Fonts, local fonts)
  self.workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new self.workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.fonts,
      plugins: [
        new self.workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
        }),
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 5. Caching external resources (such as Google Maps or other static CDNs)
  self.workbox.routing.registerRoute(
    ({ url }) => url.origin.includes('googleapis.com') || url.origin.includes('gstatic.com'),
    new self.workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAMES.external,
      plugins: [
        new self.workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

} else {
  console.log('Workbox failed to load.');
}
