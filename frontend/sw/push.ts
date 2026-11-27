import { clockAdjust } from "../../timestamp.ts";
import { loadStorage, treatCharacterUpdate } from "../storage/mod.ts";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      await clockAdjust();
      await loadStorage();
      await treatCharacterUpdate(event.data!.json());
    })(),
  );
});
