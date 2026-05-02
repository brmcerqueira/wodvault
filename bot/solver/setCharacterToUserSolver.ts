import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { Guild } from "../guild.ts";
import { autocompleteCharacters, colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { saveGuild } from "../persistence.ts";
import { getCharacter } from "../persistence.ts";

export async function setCharacterToUserSolver(
  interaction: Interaction,
  guild: Guild,
  input: {
    player: string;
    character: {
      value?: string;
      focused: boolean;
    };
  },
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  if (input.character.focused) {
    await autocompleteCharacters(interaction, input.character.value);
  } else {
    const character = await getCharacter(input.character.value!);

    guild.characters[input.player] = input.character.value!;

    await saveGuild(guild);

    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.storytellerSetCharacterToUser,
        color: colors.gray,
        fields: [{
          name: locale.character,
          value: character!.name,
          inline: true,
        }, {
          name: locale.player,
          value: `<@${input.player}>`,
          inline: true,
        }],
        thumbnail: {
          url: character!.image,
        },
      }],
    });
  }
}
