import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { buildRollMessage } from "../buildRollMessage.ts";
import {
  getCharacterByUserId,
  InteractionResponseError,
} from "../utils.ts";
import { sprintf } from "$std/fmt/printf.ts";
import { reRoll } from "../diceRoll.ts";
import { locale } from "../i18n/locale.ts";
import { getLastRoll, setLastRoll } from "../persistence.ts";
import { CharacterKind } from "../../character.ts";
import { sendCharacterUpdate } from "../webSocketService.ts";

export async function reRollSolver(
  interaction: Interaction,
  dices: number,
) {
  const character = await getCharacterByUserId(interaction.user.id);
  const id = character ? character.id : interaction.user.id;
  const roll = await getLastRoll(id);
  if (roll && (roll.result.amount - roll.result.hunger) > 0) {
    await interaction.respond({
      type: InteractionResponseType.UPDATE_MESSAGE,
      content: roll.content,
      components: [],
    });

    const message = buildRollMessage(
      reRoll(roll.result, dices),
      interaction.user.id,
      character?.kind == CharacterKind.Werewolf || false,
      sprintf(locale.reRollHelperText, dices),
      character,
    );

    await setLastRoll(id, null);

    interaction.message!.reply({
      content: message.content,
      embeds: [message.embed],
    });
    if (character) {
      character.willpower.superficial += 1;
      await sendCharacterUpdate(character);
    }
  } else {
    throw new InteractionResponseError(locale.unauthorized);
  }
}
