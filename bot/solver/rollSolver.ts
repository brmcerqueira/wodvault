import { Interaction } from "$harmony/mod.ts";
import { sendRoll } from "../sendRoll.ts";
import { getCharacterByUserId } from "../utils.ts";

export async function rollSolver(
  interaction: Interaction,
  input: {
    dices: number;
    hunger?: number;
    difficulty?: number;
    description?: string;
  },
) {
  await sendRoll(
    interaction,
    input.dices,
    input.hunger || 0,
    input.difficulty || 1,
    0,
    input.description,
    await getCharacterByUserId(interaction.user.id),
  );
}
