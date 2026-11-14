import {
  ButtonStyle,
  Interaction,
  InteractionResponseType,
  MessageComponentData,
  MessageComponentType,
} from "harmony";
import { colors } from "./utils.ts";
import { Character, CharacterKind } from "../character.ts";
import { roll } from "./diceRoll.ts";
import { buildRollMessage } from "./buildRollMessage.ts";
import { reRollButton } from "./actions/module.ts";
import { locale } from "./i18n/locale.ts";
import {
  getDifficulty,
  getModifier,
  getRollChannelId,
  setDifficulty,
  setLastRoll,
  setModifier,
} from "./persistence.ts";

export async function sendRoll(
  interaction: Interaction,
  dices: number,
  hunger: number,
  difficulty: number,
  modifier: number,
  description?: string,
  character?: Character,
): Promise<void> {
  const authorId = interaction.user.id;

  const persistedDifficulty = await getDifficulty();
  if (persistedDifficulty !== null) {
    difficulty = persistedDifficulty;
    await setDifficulty(null);
  }

  const persistedModifier = await getModifier();
  if (persistedModifier !== null) {
    modifier += persistedModifier;
    await setModifier(null);
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

  await setLastRoll(character ? character.id : authorId, {
    content: message.content,
    result,
  });

  const rollChannelId = await getRollChannelId();

  if (
    rollChannelId && interaction.channel &&
    interaction.channel.id !== rollChannelId
  ) {
    await interaction.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [{
        title: locale.rollExecuted,
        color: colors.green,
      }],
      ephemeral: true,
    });

    interaction.client.channels.sendMessage(rollChannelId, {
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
