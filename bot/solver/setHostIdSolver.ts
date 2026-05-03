import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { getStorytellerId, setHostId } from "../persistence.ts";
import { connect } from "../peerService.ts";

export async function setHostIdSolver(
  interaction: Interaction,
  input: { value: string },
) {
  const storytellerId = await getStorytellerId();
  if (storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  await setHostId(input.value);

  await connect(input.value);

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerChangeHostId,
      color: colors.gray,
      fields: [{
        name: locale.hostId,
        value: `**${input.value}**`,
        inline: true,
      }],
    }],
  });
}
