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