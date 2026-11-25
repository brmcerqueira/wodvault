import { Interaction, InteractionResponseType } from "harmony";
import { colors, host, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import {
  getStorytellerId,
  saveCharacter,
  setCharacterIdByUserId,
} from "../persistence.ts";
import { characterEvents } from "../sseService.ts";

export async function importCharacterSolver(
  interaction: Interaction,
  input: {
    code: string;
    player?: string;
  },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(
      locale.unauthorized,
    );
  }

  const character = await characterEvents.getCharacter(input.code);

  if (character) {
    await saveCharacter(character);

    await characterEvents.subscribe({
      subscribe: [character.id],
    });

    const fields = [{
      name: locale.character,
      value: character.name,
      inline: true,
    }];

    if (input.player) {
      await setCharacterIdByUserId(input.player, character.id);
      fields.push({
        name: locale.player,
        value: `<@${input.player}>`,
        inline: true,
      });
    }

    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.storytellerImportCharacter,
        color: colors.gray,
        fields,
        thumbnail: {
          url: host(character.image),
        },
      }],
    });
  } else {
    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.storytellerImportCharacterNotFound,
        color: colors.red,
      }],
    });
  }
}
