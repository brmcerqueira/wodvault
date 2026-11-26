import { CACHE_NAME } from "./constants.ts";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey)),
      );
    })(),
  );
  void self.clients.claim();
});
