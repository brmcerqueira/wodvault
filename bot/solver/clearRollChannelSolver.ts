import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { locale } from "../i18n/locale.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";
import { colors, InteractionResponseError } from "../utils.ts";

export async function clearRollChannelSolver(
  interaction: Interaction,
  guild: Guild,
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.rollChannelId = null;

  await saveGuild(guild);
  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerClearRollChannel,
      color: colors.red,
    }],
  });
}
