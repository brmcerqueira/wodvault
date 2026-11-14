import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { dialogRef } from "./dialog/dialog.ts";
import { DialogModal } from "./dialog/dialogModal.tsx";
import { Home } from "./home.tsx";
import { Vampire } from "./vampire.tsx";
import { Werewolf } from "./werewolf.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <DialogModal ref={dialogRef} />
    <HashRouter>
      <Routes>
        <Route path="/vampire" element={<Vampire />} />
        <Route path="/werewolf" element={<Werewolf />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  </>,
);

if ("serviceWorker" in navigator) {
  globalThis.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("serviceWorker.min.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
