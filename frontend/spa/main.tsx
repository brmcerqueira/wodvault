import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { dialogRef } from "./dialog/dialog.ts";
import { DialogModal } from "./dialog/dialogModal.tsx";
import { Home } from "./home.tsx";
import { startRegistration } from "./services/serviceWorkerService.ts";
import { Vampire } from "./vampire.tsx";
import { Werewolf } from "./werewolf.tsx";

await startRegistration();

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
