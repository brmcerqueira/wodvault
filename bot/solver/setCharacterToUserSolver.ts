import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import {
  autocompleteCharacters,
  colors,
  host,
  InteractionResponseError,
} from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { getCharacter, getStorytellerId, setCharacterIdByUserId } from "../persistence.ts";

export async function setCharacterToUserSolver(
  interaction: Interaction,
  input: {
    player: string;
    character: {
      value?: string;
      focused: boolean;
    };
  },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  if (input.character.focused) {
    await autocompleteCharacters(interaction, input.character.value);
  } else {
    await setCharacterIdByUserId(input.player, input.character.value!);

    const character = await getCharacter(input.character.value!);

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
          url: host(character!.image),
        },
      }],
    });
  }
}
