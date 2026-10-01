const CACHE_NAME = "unicyclehk-shell-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/bootstrap.min.css",
  "./assets/bootstrap.bundle.min.js",
  "./assets/products/01-table.webp",
  "./assets/products/02-kettle.webp",
  "./assets/products/03-office-chair.webp",
  "./assets/products/04-yoga-mat.webp",
  "./assets/products/05-induction-cooker.webp",
  "./assets/products/06-floor-lamp.webp",
  "./assets/products/07-microwave.webp",
  "./assets/products/08-standing-mirror.webp",
  "./assets/products/09-drying-rack.webp",
  "./assets/products/10-bedside-cabinet.webp",
  "./assets/products/11-desk-fan.webp",
  "./assets/products/12-storage-trolley.webp",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("unicyclehk-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const requestUrl = new URL(request.url);
          const scopePath = new URL(self.registration.scope).pathname;
          const isAppEntry = requestUrl.pathname === scopePath || requestUrl.pathname === `${scopePath}index.html`;
          if (response.ok && isAppEntry) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const update = fetch(request).then((response) => {
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        return response;
      }).catch((error) => { if (cached) return cached; throw error; });
      return cached || update;
    })
  );
});
