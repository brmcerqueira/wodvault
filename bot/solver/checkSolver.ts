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
import { Guild } from "../guild.ts";
import { saveCharacter } from "../persistence.ts";
import { check } from "../diceRoll.ts";

export async function checkSolver(
  interaction: Interaction,
  guild: Guild,
  input?: { dices: number },
) {
  const character = await getCharacterByUserId(guild, interaction.user.id);

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
    await saveCharacter(character);
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
