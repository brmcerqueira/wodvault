let _bot = getBoolean("bot");
let _dark = getBoolean("dark");

class BotAlive {
  private id: number | undefined;

  alive() {
    fetch("api/bot", {
      method: "GET",
    });
  }

  run() {
    this.clear();
    this.id = setInterval(this.alive, 9000);
  }

  clear() {
    clearInterval(this.id);
  }
}

const botAlive = new BotAlive();

if (_bot) {
  botAlive.alive();
  botAlive.run();
}

if (_dark) {
  makeDark();
}

export function isBot(): boolean {
  return _bot;
}

export function bot(value: boolean) {
  _bot = value;
  localStorage.setItem("bot", JSON.stringify(value));

  if (value) {
    botAlive.alive();
    botAlive.run();
  } else {
    botAlive.clear();
  }
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