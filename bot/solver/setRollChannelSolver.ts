import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";

export async function setRollChannelSolver(
  interaction: Interaction,
  guild: Guild,
  input: { value: string },
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.rollChannelId = input.value;

  await saveGuild(guild);
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
