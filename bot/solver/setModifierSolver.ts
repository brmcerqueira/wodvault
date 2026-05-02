import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { Guild } from "../guild.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { saveGuild } from "../persistence.ts";

export async function setModifierSolver(
  interaction: Interaction,
  guild: Guild,
  input: { value: number },
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.modifier = input.value;

  await saveGuild(guild);
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
