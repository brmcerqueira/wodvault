/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { createRoot } from "$react-dom/client";
import { HashRouter, Route, Routes } from "$react-router";
import { dialogRef } from "./dialog/dialog.ts";
import { DialogModal } from "./dialog/dialogModal.tsx";
import { Home } from "./home.tsx";
import { readCookieAndSaveLocalStorage } from "./services/discordService.ts";
import { Vampire } from "./vampire.tsx";
import { Werewolf } from "./werewolf.tsx";

readCookieAndSaveLocalStorage("discord:token", "discord:user");

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("serviceWorker.min.js");
      console.info("✅ Service Worker registered.");
    } catch (error) {
      console.error("❌ Service Worker registration failed.", error);
    }
  }
}

registerServiceWorker();

createRoot(document.getElementById("root")!).render(<><DialogModal ref={dialogRef} /><HashRouter>
  <Routes>
    <Route path="/vampire" element={<Vampire />} />
    <Route path="/werewolf" element={<Werewolf />} />
    <Route path="/" element={<Home />} />
  </Routes>
</HashRouter></>);