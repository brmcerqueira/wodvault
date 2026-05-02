import { Character } from "../character.ts";
import { Guild } from "./guild.ts";

const kvPromise = Deno.openKv();

const character = "character";
const guildKey = (id: string) => ["guild", id] as const;
const characterKey = (id: string) => [character, id] as const;

export async function getGuild(id: string): Promise<Guild> {
  const kv = await kvPromise;
  const result = await kv.get<Guild>(guildKey(id));
  return result.value ?? {
    id: id,
    currentCharacterId: null,
    storytellerId: null,
    difficulty: null,
    modifier: null,
    rollChannelId: null,
    characters: {},
    lastRolls: {},
  };
}

export async function saveGuild(guild: Guild) {
  const kv = await kvPromise;
  await kv.set(guildKey(guild.id), guild);
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  const kv = await kvPromise;
  const result = await kv.get<Character>(characterKey(id));
  return result.value ?? undefined;
}

export async function getCharactersByOwnerId(
  id: string,
  limit: number,
  term?: string
): Promise<Character[]> {
  const kv = await kvPromise;
  const characters: Character[] = [];
  const termNormalized = term?.trim().toLowerCase();

  for await (const entry of kv.list<Character>({ prefix: [character] })) {
    const item = entry.value;

    if (item.owner !== id) {
      continue;
    }

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

  return characters;
}

export async function saveCharacter(character: Character) {
  const kv = await kvPromise;
  await kv.set(characterKey(character.id), character);
}