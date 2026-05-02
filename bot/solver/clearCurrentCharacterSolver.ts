import { Interaction, InteractionResponseType } from "$harmony/mod.ts";
import { locale } from "../i18n/locale.ts";
import { Guild } from "../guild.ts";
import { saveGuild } from "../persistence.ts";
import { colors, InteractionResponseError } from "../utils.ts";

export async function clearCurrentCharacterSolver(
  interaction: Interaction,
  guild: Guild,
) {
  if (guild.storytellerId != interaction.user.id) {
    throw new InteractionResponseError(locale.unauthorized);
  }

  guild.currentCharacterId = null;

  await saveGuild(guild);
  await interaction.respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    embeds: [{
      title: locale.storytellerClearCurrentCharacter,
      color: colors.red,
    }],
  });
}
