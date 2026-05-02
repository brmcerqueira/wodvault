import { locale } from "../i18n/locale.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { setStorytellerId } from "../persistence.ts";

export async function setStorytellerSolver(
  interaction: Interaction,
  input: { user: string },
) {
  if (interaction.guild!.ownerID != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setStorytellerId(input.user);

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerUpdate,
      color: colors.gray,
      fields: [{
        name: locale.storyteller,
        value: `<@${input.user}>`,
        inline: true,
      }],
    }],
  });
}
