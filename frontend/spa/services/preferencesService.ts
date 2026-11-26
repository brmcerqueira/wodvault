import { storage } from "../../storage/mod.ts";

export const myId = await storage.preferences.myId();

let dark = await storage.preferences.isDark();

if (dark) {
  makeDark();
}

export function isDark(): boolean {
  return dark;
}

export async function setDark(value: boolean): Promise<void> {
  dark = value;

  await storage.preferences.setDark(value);

  if (value) {
    makeDark();
  } else {
    makeWhite();
  }
}

function makeDark() {
  document.body.setAttribute("data-bs-theme", "dark");
}

function makeWhite() {
  document.body.removeAttribute("data-bs-theme");
}
