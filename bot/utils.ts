import {
  ApplicationCommandChoice,
  EmojiPayload,
  Interaction,
  InteractionResponseType,
} from "$harmony/mod.ts";
import { Character } from "../character.ts";
import { characterTitle } from "../utils.ts";
import { dicePools } from "./dicePools.ts";
import { locale } from "./i18n/locale.ts";
import { getCharacter, getCharacterIdByUserId, getCharactersByTerm, getCurrentCharacterId, getStorytellerId } from "./persistence.ts";

export const separator = "^";

export const colors = {
  red: 15158332,
  green: 3066993,
  gray: 9807270,
  orange: 15105570,
  blue: 3447003,
  purple: 10181046,
};

export const emojis: {
  bestial: EmojiPayload | null;
  brutal: EmojiPayload | null;
  critical: EmojiPayload | null;
  messy: EmojiPayload | null;
  noneBlack: EmojiPayload | null;
  noneRed: EmojiPayload | null;
  successBlack: EmojiPayload | null;
  successRed: EmojiPayload | null;
  werewolfCriticalBlack: EmojiPayload | null;
  werewolfCriticalRed: EmojiPayload | null;
  werewolfSuccessBlack: EmojiPayload | null;
  werewolfSuccessRed: EmojiPayload | null;
} & Record<string, EmojiPayload | null> = {
  bestial: null,
  brutal: null,
  critical: null,
  messy: null,
  noneBlack: null,
  noneRed: null,
  successBlack: null,
  successRed: null,
  werewolfCriticalBlack: null,
  werewolfCriticalRed: null,
  werewolfSuccessBlack: null,
  werewolfSuccessRed: null,
};

export class InteractionResponseError extends Error {}

export type AttributeType =
  | keyof Character["attributes"]["physical"]
  | keyof Character["attributes"]["social"]
  | keyof Character["attributes"]["mental"];

export type ComposeInput = {
  attribute?: AttributeType;
  renown?: keyof Character["renown"];
  secondaryAttribute?: AttributeType;
  skillPhysical?: keyof Character["skills"]["physical"];
  skillSocial?: keyof Character["skills"]["social"];
  skillMental?: keyof Character["skills"]["mental"];
  discipline?: keyof Character["disciplines"];
  difficulty?: number;
  modifier?: number;
  description?: string;
};

export type DicePoolInput = {
  name: {
    value?: string;
    focused: boolean;
  };
};

export type Solver<T = any> = (
  interaction: Interaction,
  input?: T,
) => Promise<void>;

export async function getCharacterByUserId(
  id: string,
): Promise<Character | undefined> {
  let characterId: string | null | undefined;

  const storytellerId = await getStorytellerId();
  if (storytellerId === id) {
    characterId = await getCurrentCharacterId();
  } else {
    characterId = await getCharacterIdByUserId(id);
  }

  if (characterId) {
    return await getCharacter(characterId) ?? undefined;
  }

  return undefined;
}

export async function autocompleteCharacters(
  interaction: Interaction,
  term?: string,
) {
  const characters = await getCharactersByTerm(
    25,
    term?.toLowerCase(),
  );

  await interaction.respond({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    choices: characters.map((character) => ({
      name: characterTitle(character),
      value: character.id,
    })),
  });
}

export async function autocompleteDicePools(
  interaction: Interaction,
  term?: string,
) {
  term = term?.toLowerCase();

  const choices: ApplicationCommandChoice[] = [];

  for (let index = 0; index < dicePools.length; index++) {
    if (choices.length == 25) {
      break;
    } else {
      const name = locale.dicePools.length > index
        ? locale.dicePools[index]
        : index.toString();
      if (
        term === undefined || term === "" ||
        name.toLowerCase().indexOf(term) > -1
      ) {
        choices.push({
          value: index.toString(),
          name: name.substring(0, 100),
        });
      }
    }
  }

  await interaction.respond({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    choices,
  });
}

export function host(path: string) {
  return `https://wodvault.wod.deno.net/${path}`;
}