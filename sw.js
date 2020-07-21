importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Precahce manifest
// workbox.precaching.precacheAndRoute([{ url: "/", revision: null }]);

workbox.routing.registerRoute(
  /.*\.(json)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "manifest-file-cache",
  })
);

// 目前因為語系導致頁面變化，改採用 NetworkFirst
workbox.routing.registerRoute(
  /.*\.(html)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: "page-cache",
  })
);

workbox.routing.registerRoute(
  /.*\.(jpg|gif|png|js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-file-cache",
  })
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.precaching.cleanupOutdatedCaches();
