import { Interaction, InteractionResponseType } from "harmony";
import { locale } from "../i18n/locale.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { getStorytellerId, setRollChannelId } from "../persistence.ts";

export async function clearRollChannelSolver(
  interaction: Interaction,
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setRollChannelId(null);
  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerClearRollChannel,
      color: colors.red,
    }],
  });
}
