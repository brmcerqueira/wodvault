import { ButtonStyle, Interaction, InteractionResponseType, MessageComponentData, MessageComponentType } from "$harmony/mod.ts";
import { colors } from "./utils.ts";
import { saveGuild } from "./persistence.ts";
import { Guild } from "./guild.ts";
import { Character, CharacterKind } from "../character.ts";
import { roll } from "./diceRoll.ts";
import { buildRollMessage } from "./buildRollMessage.ts";
import { reRollButton } from "./actions/module.ts";
import { locale } from "./i18n/locale.ts";

export async function sendRoll(
  interaction: Interaction,
  guild: Guild,
  dices: number,
  hunger: number,
  difficulty: number,
  modifier: number,
  description?: string,
  character?: Character,
): Promise<void> {
  const authorId = interaction.user.id;

  if (guild.difficulty) {
    difficulty = guild.difficulty;
    guild.difficulty = null;
  }

  if (guild.modifier) {
    modifier += guild.modifier;
    guild.modifier = null;
  }

  dices += modifier;

  const result = roll(dices, hunger, difficulty, modifier);

  const margin = dices - hunger;

  const message = await buildRollMessage(
    result,
    authorId,
    character?.kind == CharacterKind.Werewolf || false,
    description,
    character,
  );

  let components: MessageComponentData[] | undefined;

  if (margin > 0) {
    const buttons: MessageComponentData[] = [
      reRollButton({
        emoji: {
          name: "1️⃣",
        },
        style: ButtonStyle.SECONDARY,
      }, 1),
    ];

    if (margin >= 2) {
      buttons.push(reRollButton({
        emoji: {
          name: "2️⃣",
        },
        style: ButtonStyle.SECONDARY,
      }, 2));
    }

    if (margin >= 3) {
      buttons.push(reRollButton({
        emoji: {
          name: "3️⃣",
        },
        style: ButtonStyle.SECONDARY,
      }, 3));
    }

    components = [{
      type: MessageComponentType.ActionRow,
      components: buttons,
    }];
  }

  guild.lastRolls[character ? character.id : authorId] = {
    content: message.content,
    result,
  };

  await saveGuild(guild);

  if (
    guild.rollChannelId && interaction.channel && interaction.channel.id !== guild.rollChannelId
  ) {
    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.rollExecuted,
        color: colors.green,
      }],
      ephemeral: true,
    });

    interaction.client.channels.sendMessage(guild.rollChannelId, {
      content: message.content,
      embeds: [message.embed],
      components,
    });
  } else {
    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: message.content,
      embeds: [message.embed],
      components,
    });
  }
}
