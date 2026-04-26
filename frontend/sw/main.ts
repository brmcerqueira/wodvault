declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "wodvault-sw-v1";
const APP_SHELL_FILES: string[] = [
  "/",
  "/manifest.json",
  "/styles.css",
  "/main.min.js",
];

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_FILES)),
  );
  void self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey)),
      )
    ),
  );
  void self.clients.claim();
});

self.addEventListener("fetch", (event: FetchEvent) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const isCacheable =
          networkResponse.status === 200 && networkResponse.type === "basic";

        if (isCacheable) {
          const responseClone = networkResponse.clone();
          void caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
        }

        return networkResponse;
      });
    }),
  );
});
