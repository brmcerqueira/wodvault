import { Interaction } from "$harmony/mod.ts";
import { sendRoll } from "../sendRoll.ts";
import { Guild } from "../guild.ts";
import { getCharacterByUserId } from "../utils.ts";

export async function rollSolver(
  interaction: Interaction,
  guild: Guild,
  input: {
    dices: number;
    hunger?: number;
    difficulty?: number;
    description?: string;
  },
) {
  await sendRoll(
    interaction,
    guild,
    input.dices,
    input.hunger || 0,
    input.difficulty || 1,
    0,
    input.description,
    await getCharacterByUserId(guild, interaction.user.id),
  );
}
