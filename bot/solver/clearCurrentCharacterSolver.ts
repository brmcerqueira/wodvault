import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { locale } from "../i18n/locale.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { getStorytellerId, setCurrentCharacterId } from "../persistence.ts";

export async function clearCurrentCharacterSolver(
  interaction: Interaction
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setCurrentCharacterId(null);
  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerClearCurrentCharacter,
      color: colors.red,
    }],
  });
}
