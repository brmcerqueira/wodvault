import {
  EmbedField,
  Interaction,
  InteractionResponseType,
} from "$harmony/mod.ts";
import {
  colors,
  getCharacterByUserId,
  InteractionResponseError,
} from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { check } from "../diceRoll.ts";
import { sendCharacterUpdate } from "../peerService.ts";

export async function checkSolver(
  interaction: Interaction,
  input?: { dices: number },
) {
  const character = await getCharacterByUserId(interaction.user.id);

  if (character === undefined) {
    throw new InteractionResponseError(locale.characterNotFound);
  }

  const fields: EmbedField[] = [{
    name: locale.character,
    value: character.name,
    inline: true,
  }];

  const failed = !check(input?.dices || 1);

  if (failed) {
    character.hungerOrRage += 1;
    await sendCharacterUpdate(character);
    fields.push({
      name: locale.hunger,
      value: `**${character.hungerOrRage}**`,
      inline: true,
    });
  }

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: failed ? locale.characterCheckFailed : locale.characterCheck,
      thumbnail: {
        url: character.image,
      },
      color: failed ? colors.red : colors.green,
      fields,
    }],
  });
}
