import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { buildRollMessage } from "../buildRollMessage.ts";
import {
  getCharacterByUserId,
  InteractionResponseError,
} from "../utils.ts";
import { saveGuild } from "../persistence.ts";
import { Guild } from "../guild.ts";
import { sprintf } from "$std/fmt/printf.ts";
import { reRoll } from "../diceRoll.ts";
import { locale } from "../i18n/locale.ts";
import { saveCharacter } from "../persistence.ts";
import { CharacterKind } from "../../character.ts";
import { notify } from "../../services/broadcastService.ts";

export async function reRollSolver(
  interaction: Interaction,
  guild: Guild,
  dices: number,
) {
  const character = await getCharacterByUserId(guild, interaction.user.id);
  const id = character ? character.id : interaction.user.id;
  const roll = guild.lastRolls[id];
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

    delete guild.lastRolls[id];

    await saveGuild(guild);

    interaction.message!.reply({
      content: message.content,
      embeds: [message.embed],
    });
    if (character) {
      character.willpower.superficial += 1;
      await saveCharacter(character);
      notify(character);
    }
  } else {
    throw new InteractionResponseError(locale.unauthorized);
  }
}
