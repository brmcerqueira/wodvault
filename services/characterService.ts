import * as dao from "../persistence/characterDao.ts";
import { add, notify, remove } from "./broadcastService.ts";
import { characterSchema } from "../domain/validation/characterSchema.ts";
import { Character, CharacterMode } from "../domain/character.ts";
import { getDiscordUser } from "../endpoints/discord.ts";
import { locale } from "../i18n/backend/locale.ts";
import { DiscordUser } from "../types.ts";

export async function getCharacter(clientId: string, id: string) {
  const character = await dao.getCharacter(id);

  if (!character) {
    throw new Error(locale.characterNotFound);
  }

  add(clientId, id);

  return character;
}

export async function characterOwnership(
  token: string,
  clientId: string,
  id: string,
  owner: boolean,
): Promise<Character> {
  const user = await getDiscordUser(token);

  if (user == null) {
    throw new Error(locale.unauthorized);
  }

  const character = await dao.getCharacter(user.id);

  if (
    user && character &&
    (owner || (!owner && character.owner == user.id))
  ) {
    if (owner) {
      character.owner = user.id;
    } else {
      character.owner = null;
    }

    await dao.saveCharacter(character);
  } else {
    throw new Error(locale.unauthorized);
  }

  add(clientId, id);

  return character;
}

export async function deleteCharacter(
  token: string | null,
  clientId: string,
  id: string,
) {
  remove(clientId, id);

  if (token) {
    const user = await getDiscordUser(token);

    const character = await dao.getCharacter(id);

    if (character && user && character.owner == user.id) {
      await dao.deleteCharacter(character);
    }
  }
}

export async function saveCharacter(
  token: string | null,
  webSocketId: string,
  data: unknown,
) {
  const user = token ? await getDiscordUser(token) : null;

  const character = characterSchema.parse(data);

  const oldCharacter = await dao.getCharacter(character._id);

  if (oldCharacter) {
    character.owner = oldCharacter.owner;

    if (
      !canEdit(
        oldCharacter,
        character,
        user,
      )
    ) {
      throw new Error(locale.unauthorized);
    }
  } else {
    if (user == null) {
      throw new Error(locale.unauthorized);
    }
    character.owner = user.id;
  }

  notify(character, webSocketId);

  await dao.saveCharacter(character);
}

function canEdit(
  oldCharacter: Character,
  character: Character,
  user: DiscordUser | null,
): boolean {
  if (user && user.id != character.owner) {
    if (oldCharacter.mode != character.mode) {
      return false;
    }

    if (
      character.mode == CharacterMode.Closed &&
      detectDifference(
        oldCharacter,
        character,
        "superficial",
        "aggravated",
        "hungerOrRage",
      )
    ) {
      return false;
    }
  }

  return true;
}

function detectDifference(
  oldData: any,
  data: any,
  ...ignore: string[]
): boolean {
  for (
    const key of new Set([
      ...Object.keys(oldData ?? {}),
      ...Object.keys(data ?? {}),
    ])
  ) {
    const oldValue = oldData?.[key];
    const value = data?.[key];

    if (Array.isArray(oldValue) && Array.isArray(value)) {
      if (!arraysEqual(oldValue, value)) {
        return true;
      }
    }
    if (isObject(oldValue) && isObject(value)) {
      return detectDifference(oldValue, value, ...ignore);
    } else if (oldValue !== value && ignore.indexOf(key) == -1) {
      return true;
    }
  }

  return false;
}

function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function arraysEqual(oldArray: any[], array: any[]): boolean {
  if (oldArray.length !== array.length) return false;
  return oldArray.every((oldValue, index) => deepEqual(oldValue, array[index]));
}

function deepEqual(oldData: any, data: any): boolean {
  if (Array.isArray(oldData) && Array.isArray(data)) {
    return arraysEqual(oldData, data);
  } else if (isObject(oldData) && isObject(data)) {
    for (
      const key of new Set([...Object.keys(oldData), ...Object.keys(data)])
    ) {
      if (!deepEqual(oldData[key], data[key])) return false;
    }
    return true;
  } else {
    return oldData === data;
  }
}
