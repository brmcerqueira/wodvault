import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { getStorytellerId, setRollChannelId } from "../persistence.ts";

export async function setRollChannelSolver(
  interaction: Interaction,
  input: { value: string },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setRollChannelId(input.value);

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerChangeRollChannel,
      color: colors.gray,
      fields: [{
        name: locale.rollChannel,
        value: `<#${input.value}>`,
        inline: true,
      }],
    }],
  });
}
