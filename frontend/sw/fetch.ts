import { APP_SHELL_FILES, CACHE_NAME } from "./constants.ts";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (event: FetchEvent) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isAppShellRequest = APP_SHELL_FILES.includes(requestUrl.pathname);

  event.respondWith(
    (async () => {
      if (isAppShellRequest) {
        try {
          const networkResponse = await fetch(event.request);

          const isCacheable = networkResponse.status === 200 &&
            networkResponse.type === "basic";

          if (isCacheable) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, networkResponse.clone());
          }

          return networkResponse;
        } catch {
          const cachedResponse = await caches.match(event.request);

          if (cachedResponse) {
            return cachedResponse;
          }

          throw new Error(
            "Network unavailable and no cache entry found.",
          );
        }
      }

      const cachedResponse = await caches.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(event.request);

      const isCacheable = networkResponse.status === 200 &&
        networkResponse.type === "basic";

      if (isCacheable) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, networkResponse.clone());
      }

      return networkResponse;
    })(),
  );
});
