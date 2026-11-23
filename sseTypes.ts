import { Character } from "./character.ts";

export type CharactersSubscribe = {
  subscribe?: string[];
  unsubscribe?: string[];
};

export type CharacterUpdate = {
  character?: Character;
  remove?: string;
};
