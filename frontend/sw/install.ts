import { APP_SHELL_FILES, CACHE_NAME } from "./constants.ts";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL_FILES);
    })(),
  );
  void self.skipWaiting();
});
