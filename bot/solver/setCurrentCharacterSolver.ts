import { locale } from "../i18n/locale.ts";
import {
  getCharacter,
  getStorytellerId,
  setCurrentCharacterId,
} from "../persistence.ts";
import {
  autocompleteCharacters,
  colors,
  host,
  InteractionResponseError,
} from "../utils.ts";
import { Interaction, InteractionResponseType } from "$harmony/mod.ts";

export async function setCurrentCharacterSolver(
  interaction: Interaction,
  input: {
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
    const character = await getCharacter(input.character.value!);

    await setCurrentCharacterId(input.character.value!);

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
          url: host(character!.image),
        },
      }],
    });
  }
}
