import { Character } from "./character.ts";

/*const beforeTime = Date.now();

const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");

const text = await response.text();
const match = text.match(/^ts=(.+)$/m);

const datetime = match ? new Date(Number(match[1]) * 1000) : new Date();

const afterTime = Date.now();

const offset = datetime.getTime() + ((afterTime - beforeTime) / 2) - afterTime;
*/
export function timestamp(): number {
  return Date.now(); //+ offset;
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
