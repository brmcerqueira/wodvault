import { locale } from "../i18n/locale.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { Interaction, InteractionResponseType } from "$harmony/mod.ts";

export async function setStorytellerSolver(
  interaction: Interaction,
  guild: Guild,
  input: { user: string },
) {
  if (interaction.guild!.ownerID != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.storytellerId = input.user;
  
  await saveGuild(guild);
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
