import { getImageDataURL } from "../endpoints/image.ts";
import { getCharactersByIds } from "../persistence/characterDao.ts";
import { getGuild } from "../persistence/guildDao.ts";

export async function voiceCss(guildId: string, hide: string[] = []): Promise<string> {
  const guild = await getGuild(guildId);

  if (guild.storytellerId) {
    hide.push(guild.storytellerId);
  }

  const discordIds = Object.fromEntries(
    Object.entries(guild.characters).map(([key, value]) => [value, key])
    .filter(pair => hide.indexOf(pair[1]) === -1),
  );

  const characters = await getCharactersByIds(Object.keys(discordIds));

  return `
    body {
      background-color: rgba(0, 0, 0, 0);
      margin: 0em;
      overflow: hidden;
    }

    .voice_state {
      display: flex;
      justify-content: flex-end;
      padding-right: 0.625em;
    }

    .voice_state img {
      display: none;
    }

    .wrapper_speaking .voice_username::before {
        border: 0.125em solid #C71585 !important;
    }

    ${
     (await Promise.all(characters.map(async (character) =>
      `li[data-userid="${discordIds[character._id]}"] .voice_username::before {
        content: "";
        display: inline-block;
        width: 2.813em;
        height: 2.813em;
        margin-right: 0.375em;
        border-radius: 1em;
        border: 0.125em solid transparent;
        background-image: url(${await getImageDataURL(character.image)});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        vertical-align: middle;
    } 

    li[data-userid="${discordIds[character._id]}"] .voice_username span::after {
      content: "(${character.player})";
      color: #DC143C;
      margin-left: 0.375em;
    }
    `
    ))).join("\n    ")
  }

    ${
    hide.map((id) =>
      `li[data-userid="${id}"] {
      display: none;
    }
    `
    ).join("\n    ")
  }
  `;
}
