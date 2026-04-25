import { discordClientId, DiscordToken, DiscordUser } from "../../../types.ts";
import { DiscordSDK } from "../deps.ts";

function isDiscordActivity(): boolean {
  if (globalThis.self === globalThis.top) return false;

  const params = new URLSearchParams(globalThis.location.search);
  return params.has("frame_id") || params.has("guild_id");
}

export const isActivity = isDiscordActivity();

const discordSdk = isActivity ? new DiscordSDK(discordClientId) : undefined;

if (!discordUser()) {
  await activitySignIn();
}

export async function activitySignIn() {
  if (discordSdk) {
    try {
      await discordSdk.ready();

      const { code } = await discordSdk.commands.authorize({
        client_id: discordClientId,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: [
          "identify",
          "guilds",
          "applications.commands",
        ],
      });

      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      const data: { token: DiscordToken; user: DiscordUser } = await response
        .json();

      const auth = await discordSdk.commands.authenticate({
        access_token: data.token.access_token,
      });

      if (auth !== null) {
        localStorage.setItem("discord:token", JSON.stringify(data.token));
        localStorage.setItem("discord:user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.info(
        "🔐 OAuth authorization was canceled or denied by the user",
        err,
      );
    }
  }
}

export async function authorizationHeaders(): Promise<HeadersInit | undefined> {
  let token = discordToken();

  if (token) {
    if (new Date(token.expires_at) < new Date()) {
      token = await refreshToken(token.refresh_token);
    }
  }

  return token
    ? {
      Authorization: `Bearer ${token.access_token}`,
    }
    : undefined;
}

export function readCookieAndSaveLocalStorage(...names: string[]) {
  if (document.cookie != "") {
    for (const pair of document.cookie.split(";")) {
      const [name, value] = pair.trim().split("=");
      if (names.indexOf(name) > -1) {
        localStorage.setItem(name, atob(value));
      }
    }
  }
}

export function discordToken(): DiscordToken | null {
  const data = localStorage.getItem("discord:token");
  return data ? JSON.parse(data) : null;
}

export function discordUser(): DiscordUser | null {
  const data = localStorage.getItem("discord:user");
  return data ? JSON.parse(data) : null;
}

export function avatar(
  user: DiscordUser,
  size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 = 128,
): string {
  if (user.avatar) {
    const isGif = user.avatar.startsWith("a_");
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
      isGif ? "gif" : "png"
    }?size=${size}`;
  }

  return `https://cdn.discordapp.com/embed/avatars/${
    user.discriminator
      ? (parseInt(user.discriminator) % 5)
      : ((BigInt(user.id) >> 22n) % 6n as unknown as number)
  }.png`;
}

export function discordSignOut() {
  localStorage.removeItem("discord:token");
  localStorage.removeItem("discord:user");
}

async function refreshToken(code: string): Promise<DiscordToken | null> {
  const response = await fetch(`api/auth/refresh?code=${code}`, {
    method: "GET",
  });

  if (response.ok) {
    const token = await response.text();
    localStorage.setItem("discord:token", token);
    return JSON.parse(token);
  }

  return null;
}
