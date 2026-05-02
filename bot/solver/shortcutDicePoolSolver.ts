import {
  Interaction,
  InteractionResponseType,
  MessageComponentType,
} from "$harmony/mod.ts";
import { autocompleteDicePools, DicePoolInput } from "../utils.ts";
import { dicePoolButton } from "../actions/module.ts";
import { locale } from "../i18n/locale.ts";

export async function shortcutDicePoolSolver(
  interaction: Interaction,
  input: DicePoolInput,
) {
  if (input.name.focused) {
    await autocompleteDicePools(interaction, input.name.value);
  } else {
    const index = parseInt(input.name.value!);

    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: locale.dicePools.length > index
          ? locale.dicePools[index]
          : index.toString(),
      components: [{
        type: MessageComponentType.ACTION_ROW,
        components: [
          dicePoolButton(
            {
              emoji: {
                name: "🎲",
              },
            },
            index,
          ),
        ],
      }],
    });
  }
}
