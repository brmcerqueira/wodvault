import { Guild } from "../guild.ts";
import { Interaction } from "$harmony/mod.ts";
import { Solver } from "../utils.ts";

export function groupSolver<T = any>(
  solvers: Record<string, Solver>,
): Solver<Record<string, T>> {
  return async (
    interaction: Interaction,
    guild: Guild,
    input?: Record<string, T>,
  ) => {
      for (const key in input) {
        const data = input[key];

        if (data) {
            await solvers[key](interaction, guild, data);
            break;
        }
      }
  };
}
