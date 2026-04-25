/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  console.info("✅ Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.info("🟢 Service Worker activated.");
});

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});
