import { APP_SHELL_FILES, CACHE_NAME } from "./constants.ts";

declare const self: ServiceWorkerGlobalScope;

async function cacheResponse(
  request: Request,
  response: Response,
): Promise<void> {
  const isCacheable = response.status === 200 &&
    (response.type === "basic" || response.type === "cors");

  if (!isCacheable) {
    return;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  } catch (error) {
    console.error("[ServiceWorker] Cache error:", {
      url: request.url,
      error,
    });
  }
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);

    await cacheResponse(request, response);

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

async function cacheFirst(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  await cacheResponse(request, response);

  return response;
}

self.addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isSSE = request.headers
    .get("Accept")
    ?.includes("text/event-stream");

  if (isSSE) {
    return;
  }

  const isAppShellRequest = APP_SHELL_FILES.includes(
    requestUrl.pathname,
  );

  event.respondWith(
    isAppShellRequest ? networkFirst(request) : cacheFirst(request),
  );
});
