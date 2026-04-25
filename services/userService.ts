import { getDiscordToken, getDiscordUser } from "../endpoints/discord.ts";
import { locale } from "../i18n/backend/locale.ts";
import { getUser, saveUser } from "../persistence/userDao.ts";
import { DiscordToken, DiscordUser } from "../types.ts";

export async function authenticateUser(code: string): Promise<{ token: DiscordToken, user: DiscordUser }> {
  const token = await getDiscordToken(code);

  if (token) {
    const user = await getDiscordUser(token.access_token);

    if (user) {
      if (await getUser(user.id) === undefined) {
        await saveUser({
          _id: user.id,
          name: user.global_name,
          email: user.email,
          creationDate: new Date(),
        });
      }

      return {
        token,
        user
      };
    }
  }

  throw new Error(locale.unauthorized); 
}

export async function refreshToken(code: string): Promise<DiscordToken> {
  const token = await getDiscordToken(code, true);

  if (token) {
    return token;
  }

  throw new Error(locale.unauthorized); 
}