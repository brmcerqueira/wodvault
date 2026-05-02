import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { getStorytellerId, setModifier } from "../persistence.ts";

export async function setModifierSolver(
  interaction: Interaction,
  input: { value: number },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setModifier(input.value);
  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerChangeModifier,
      color: colors.gray,
      fields: [{
        name: locale.modifier,
        value: `**${input.value}**`,
        inline: true,
      }],
    }],
  });
}
