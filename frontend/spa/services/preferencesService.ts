if (localStorage.getItem("myId") == null) {
  localStorage.setItem("myId", crypto.randomUUID());
}

export const myId = localStorage.getItem("myId") as string;

let _dark = getBoolean("dark");

if (_dark) {
  makeDark();
}

export function isDark(): boolean {
  return _dark;
}

export function setDark(value: boolean) {
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

  if (value === null) {
    return false;
  }

  try {
    return JSON.parse(value) === true;
  } catch {
    localStorage.removeItem(key);
    return false;
  }
}

function makeDark() {
  document.body.setAttribute("data-bs-theme", "dark");
}

function makeWhite() {
  document.body.removeAttribute("data-bs-theme");
}
