import { Character } from "../../../character.ts";
import { CharacterEvents } from "../../../characterEvents.ts";
import type { CharacterUpdate } from "../../../sseTypes.ts";
import { myId } from "./preferencesService.ts";
import {
  saveCharacter,
  storage,
  treatCharacterUpdate,
} from "../../storage/mod.ts";

type CharacterUpdateCallback = (update: CharacterUpdate) => void;

let characterUpdateCallback:
  | CharacterUpdateCallback
  | undefined;

export const characterEvents = new CharacterEvents(myId, {
  subscribe: (await storage.characters.all()).map((character) => character.id),
}, async (update) => {
  console.log("Event received:", update);

  await treatCharacterUpdate(update);

  if (characterUpdateCallback) {
    characterUpdateCallback(update);
  }
}, "");

export function observeCharacterUpdate(
  callback: CharacterUpdateCallback,
) {
  characterUpdateCallback = callback;
}

export async function sendCharacterUpdate(character: Character) {
  saveCharacter(character);
  await characterEvents.sendUpdate(character);
}
