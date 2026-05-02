import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { colors, InteractionResponseError } from "../utils.ts";
import { locale } from "../i18n/locale.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";

export async function setDifficultySolver(
  interaction: Interaction,
  guild: Guild,
  input: { value: number },
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.difficulty = input.value;

  await saveGuild(guild);

  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerChangeDifficulty,
      color: colors.gray,
      fields: [{
        name: locale.difficulty,
        value: `**${input.value}**`,
        inline: true,
      }],
    }],
  });
}
