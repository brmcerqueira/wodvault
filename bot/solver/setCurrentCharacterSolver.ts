import { locale } from "../i18n/locale.ts";
import { getCharacter } from "../persistence.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";
import {
  autocompleteCharacters,
  colors,
  InteractionResponseError,
} from "../utils.ts";
import { Interaction, InteractionResponseType } from "$harmony/mod.ts";

export async function setCurrentCharacterSolver(
  interaction: Interaction,
  guild: Guild,
  input: {
    character: {
      value?: string;
      focused: boolean;
    };
  },
) {
  if (interaction.guild!.ownerID != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  if (input.character.focused) {
    await autocompleteCharacters(interaction, input.character.value);
  } else {
    const character = await getCharacter(input.character.value!);

    guild.currentCharacterId = input.character.value!;

    await saveGuild(guild);

    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.storytellerSetCurrentCharacter,
        color: colors.gray,
        fields: [{
          name: locale.character,
          value: character!.name,
          inline: true,
        }],
        thumbnail: {
          url: character!.image,
        },
      }],
    });
  }
}
