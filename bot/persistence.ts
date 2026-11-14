import { Character } from "../character.ts";
import { timestamp } from "../utils.ts";
import { RollResult } from "./diceRoll.ts";
import { logger } from "./logger.ts";

const databaseDir = Deno.env.get("DATABASE_DIR") ?? "./database";

await Deno.mkdir(databaseDir, { recursive: true });

const kv = await Deno.openKv(`${databaseDir}/bot.db`);

const character = "character";
const characterKey = (id: string) => [character, id] as const;
const userIdCharacterIdKey = (id: string) =>
  ["userId_characterId", id] as const;
const lastRollKey = (id: string) => ["lastRoll", id] as const;
const storytellerIdKey = ["storytellerId"] as const;
const rollChannelIdKey = ["rollChannelId"] as const;
const difficultyKey = ["difficulty"] as const;
const modifierKey = ["modifier"] as const;
const currentCharacterIdKey = ["currentCharacterId"] as const;

export type LastRoll = {
  content: string;
  result: RollResult;
};

async function setNullableValue<T>(key: Deno.KvKey, value: T | null) {
  if (value === null) {
    logger.debug("[KV] delete %v", key);
    await kv.delete(key);
  } else {
    logger.debug("[KV] set %v = %v", key, value);
    await kv.set(key, value);
  }
}

async function getNullableValue<T>(key: Deno.KvKey): Promise<T | null> {
  const result = await kv.get<T>(key);
  logger.debug("[KV] get %v = %v", key, result.value);
  return result.value ?? null;
}

export async function getStorytellerId(): Promise<string | null> {
  return await getNullableValue(storytellerIdKey);
}

export async function getRollChannelId(): Promise<string | null> {
  return await getNullableValue(rollChannelIdKey);
}

export async function getDifficulty(): Promise<number | null> {
  return await getNullableValue(difficultyKey);
}

export async function getModifier(): Promise<number | null> {
  return await getNullableValue(modifierKey);
}

export async function getCurrentCharacterId(): Promise<string | null> {
  return await getNullableValue(currentCharacterIdKey);
}

export async function setStorytellerId(id: string | null) {
  await setNullableValue(storytellerIdKey, id);
}

export async function setRollChannelId(value: string | null) {
  await setNullableValue(rollChannelIdKey, value);
}

export async function setDifficulty(value: number | null) {
  await setNullableValue(difficultyKey, value);
}

export async function setModifier(value: number | null) {
  await setNullableValue(modifierKey, value);
}

export async function setCurrentCharacterId(value: string | null) {
  await setNullableValue(currentCharacterIdKey, value);
}

export async function setCharacterIdByUserId(id: string, value: string | null) {
  await setNullableValue(userIdCharacterIdKey(id), value);
}

export async function getCharacter(id: string): Promise<Character | null> {
  return await getNullableValue(characterKey(id));
}

export async function getCharacterIdByUserId(
  id: string,
): Promise<string | null> {
  return await getNullableValue(userIdCharacterIdKey(id));
}

export async function setLastRoll(id: string, value: LastRoll | null) {
  await setNullableValue(lastRollKey(id), value);
}

export async function getLastRoll(id: string): Promise<LastRoll | null> {
  return await getNullableValue(lastRollKey(id));
}

export async function allCharacters(): Promise<Record<string, Character>> {
  const characters: Record<string, Character> = {};
  for await (const entry of kv.list<Character>({ prefix: [character] })) {
    characters[entry.value.id] = entry.value;
  }
  logger.debug("[KV] list characters = %v", Object.keys(characters).length);
  return characters;
}

export async function getCharactersByTerm(
  limit: number,
  term?: string,
): Promise<Character[]> {
  const characters: Character[] = [];
  const termNormalized = term?.trim().toLowerCase();

  for await (const entry of kv.list<Character>({ prefix: [character] })) {
    const item = entry.value;

    if (
      termNormalized &&
      !item.name.toLowerCase().includes(termNormalized)
    ) {
      continue;
    }

    characters.push(item);

    if (characters.length >= limit) {
      break;
    }
  }

  logger.debug(
    "[KV] getCharactersByTerm term=%v = %v",
    term,
    characters.length,
  );
  return characters;
}

export async function saveCharacter(character: Character) {
  character.timestamp = timestamp();
  logger.debug("[KV] saveCharacter %v", character.id);
  await kv.set(characterKey(character.id), character);
}
