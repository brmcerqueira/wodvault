import { Character } from "./character.ts";

export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function characterTitle(character: Character): string {
  return `${character.name}${
    character.player != "" ? ` - ${character.player}` : ""
  }`;
}
