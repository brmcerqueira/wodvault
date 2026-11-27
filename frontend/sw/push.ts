import { loadStorage, treatCharacterUpdate } from "../storage/mod.ts";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      await loadStorage();
      await treatCharacterUpdate(event.data!.json());
    })(),
  );
});
