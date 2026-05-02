import { Interaction } from "$harmony/mod.ts";
import { Guild } from "../guild.ts";
import { locale } from "../i18n/locale.ts";
import {
  autocompleteDicePools,
  DicePoolInput,
  getCharacterByUserId,
  InteractionResponseError,
} from "../utils.ts";
import { sendRoll } from "../sendRoll.ts";
import { dicePools } from "../dicePools.ts";

export async function dicePoolSolver(
  interaction: Interaction,
  guild: Guild,
  input: DicePoolInput,
) {
  if (input.name.focused) {
    await autocompleteDicePools(interaction, input.name.value);
  } else {
    const character = await getCharacterByUserId(guild, interaction.user.id);

    if (character === undefined) {
      throw new InteractionResponseError(locale.characterNotFound);
    }

    const index = parseInt(input.name.value!);
    const result = dicePools[index](character);
    await sendRoll(
      interaction,
      guild,
      result.dices,
      character.hungerOrRage,
      result.difficulty,
      result.modifier,
      locale.dicePools[index],
      character,
    );
  }
}
