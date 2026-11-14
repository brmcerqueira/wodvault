import { Character } from "./character.ts";

export function timestamp(): number {
  return Date.now();
}

export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function characterTitle(character: Character): string {
  return `${character.name}${
    character.player != "" ? ` - ${character.player}` : ""
  }`;
}

export type ConnectionType = { send: (data: string) => void | Promise<void> };

export type SendCharactersData = {
  characters: Character[];
  remove: string[];
};

export async function sendCharacters(
  connection: ConnectionType,
  data: SendCharactersData,
) {
  await connection.send(
    JSON.stringify(data),
  );
}
