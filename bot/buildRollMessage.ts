import { EmbedPayload, EmojiPayload } from "harmony";
import { Character } from "../character.ts";
import { RollResult, RollStatus } from "./diceRoll.ts";
import { colors, emojis, host } from "./utils.ts";
import { locale } from "./i18n/locale.ts";

export function buildRollMessage(
  result: RollResult,
  authorId: string,
  werewolf: boolean,
  title?: string,
  character?: Character,
): { content: string; embed: EmbedPayload } {
  const embed: EmbedPayload = {};

  if (title) {
    embed.title = title;
  }

  if (character) {
    embed.thumbnail = {
      url: host(character.image),
    };
  }

  const content = result.dices.sort((left, right) =>
    right.isHunger == left.isHunger
      ? (right.value - left.value)
      : (right.isHunger ? 1 : -1)
  ).map((dice) => {
    let emoji: EmojiPayload | null = null;
    if (werewolf) {
      if (dice.isHunger) {
        if (dice.value == 1 || dice.value == 2) {
          emoji = emojis.brutal;
        } else if (dice.value == 10) {
          emoji = emojis.werewolfCriticalRed;
        } else if (dice.value >= 6 && dice.value <= 9) {
          emoji = emojis.werewolfSuccessRed;
        } else {
          emoji = emojis.noneRed;
        }
      } else {
        if (dice.value == 10) {
          emoji = emojis.werewolfCriticalBlack;
        } else if (dice.value >= 6 && dice.value <= 9) {
          emoji = emojis.werewolfSuccessBlack;
        } else {
          emoji = emojis.noneBlack;
        }
      }
    } else {
      if (dice.isHunger) {
        if (dice.value == 1) {
          emoji = emojis.bestial;
        } else if (dice.value == 10) {
          emoji = emojis.messy;
        } else if (dice.value >= 6 && dice.value <= 9) {
          emoji = emojis.successRed;
        } else {
          emoji = emojis.noneRed;
        }
      } else {
        if (dice.value == 10) {
          emoji = emojis.critical;
        } else if (dice.value >= 6 && dice.value <= 9) {
          emoji = emojis.successBlack;
        } else {
          emoji = emojis.noneBlack;
        }
      }
    }
    return `<:${emoji!.name}:${emoji!.id}>`;
  }).join(" ");

  let statusLabel = "";

  switch (result.status) {
    case RollStatus.BestialFailure:
      statusLabel = locale.bestialFailure;
      embed.color = colors.red;
      break;
    case RollStatus.Failure:
      statusLabel = locale.failure;
      embed.color = colors.orange;
      break;
    case RollStatus.Success:
      statusLabel = locale.success;
      embed.color = colors.green;
      break;
    case RollStatus.RegularCritical:
      statusLabel = locale.regularCritical;
      embed.color = colors.blue;
      break;
    case RollStatus.MessyCritical:
      statusLabel = locale.messyCritical;
      embed.color = colors.purple;
      break;
  }

  embed.fields = [{
    name: locale.dices,
    value: result.hunger > 0
      ? `${result.amount} / ${result.hunger}`
      : result.amount.toString(),
    inline: true,
  }, {
    name: locale.difficulty,
    value: result.difficulty.toString(),
    inline: true,
  }, {
    name: locale.successes,
    value: result.successes.toString(),
    inline: true,
  }, {
    name: locale.status,
    value: `**${statusLabel}**`,
    inline: true,
  }];

  if (character) {
    embed.fields.push({
      name: locale.character,
      value: character.name,
      inline: true,
    });
  }

  embed.fields.push({
    name: locale.player,
    value: `<@${authorId}>`,
    inline: true,
  });

  if (result.modifier != 0) {
    embed.fields.push({
      name: locale.modifier,
      value: result.modifier.toString(),
      inline: true,
    });
  }

  return { content, embed };
}
