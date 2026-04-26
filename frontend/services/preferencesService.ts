if (localStorage.getItem("myId") == null) {
  localStorage.setItem("myId", crypto.randomUUID());
}

export const myId = localStorage.getItem("myId") as string;

export function hostId(): string | null {
  return localStorage.getItem("hostId");
}

export function setHostId(id: string | null): void {
  if (id === null) {
    localStorage.removeItem("hostId");
  } else {
    localStorage.setItem("hostId", id);
  }
}

let _dark = getBoolean("dark");

if (_dark) {
  makeDark();
}

export function isDark(): boolean {
  return _dark;
}

export function dark(value: boolean) {
  _dark = value;
  localStorage.setItem("dark", JSON.stringify(value));

  if (value) {
    makeDark();
  } else {
    makeWhite();
  }
}

function getBoolean(key: string): boolean {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : false;
}

function makeDark() {
  document.body.setAttribute("data-bs-theme", "dark");
}

function makeWhite() {
  document.body.removeAttribute("data-bs-theme");
}