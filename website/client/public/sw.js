// ViP Yemen Service Worker - Enhanced for Offline & Auto-Update
const CACHE_NAME = "vipyemen-v4.9.0";
const CACHE_VERSION = "4.9.0";

// Resolve relative to the service worker's own location
const BASE = self.registration.scope;

// Assets to cache on install
const PRECACHE_ASSETS = [
  "./",
  "./manifest.json",
  "./images/vip-logo.svg",
  "./privacy-policy.html",
  "./downloads.html",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "SW_UPDATED", version: CACHE_VERSION });
          });
        });
        return self.clients.claim();
      })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Skip external requests
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Skip API calls
  if (url.pathname.startsWith("/api/")) return;

  // For navigation requests (HTML pages), try network first
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("./");
          });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images), use stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Message handler
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "تحديث جديد - ViP Yemen";
  const options = {
    body: data.body || "إصدار جديد متاح للتحميل",
    icon: "./images/vip-logo.svg",
    badge: "./images/vip-logo.svg",
    vibrate: [100, 50, 100],
    data: { url: data.url || "./downloads.html" },
    actions: [
      { action: "download", title: "تحميل", icon: "./images/vip-logo.svg" },
      { action: "dismiss", title: "لاحقاً", icon: "./images/vip-logo.svg" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        client.focus();
        client.navigate(event.notification.data?.url || "./downloads.html");
        return;
      }
      clients.openWindow(event.notification.data?.url || "./downloads.html");
    })
  );
});
