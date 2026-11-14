import { Interaction, InteractionResponseType } from "harmony";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { getStorytellerId, setDifficulty } from "../persistence.ts";

export async function setDifficultySolver(
  interaction: Interaction,
  input: { value: number },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setDifficulty(input.value);

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerChangeDifficulty,
      color: colors.gray,
      fields: [{
        name: locale.difficulty,
        value: `**${input.value}**`,
        inline: true,
      }],
    }],
  });
}
