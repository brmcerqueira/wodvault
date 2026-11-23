import { Character } from "../../../character.ts";
import { CharacterEvents } from "../../../characterEvents.ts";
import type { CharacterUpdate } from "../../../sseTypes.ts";
import { myId } from "./preferencesService.ts";
import {
  allCharacters,
  getCharacter,
  localStorageCharacterKey,
  removeCharacter,
  saveCharacter,
} from "./characterService.ts";

type CharacterUpdateCallback = (update: CharacterUpdate) => void;

let characterUpdateCallback:
  | CharacterUpdateCallback
  | undefined;

const characterEvents = new CharacterEvents(myId, {
  subscribe: allCharacters(),
}, (update) => {
  console.log("Event received:", update);

  const keys = allCharacters();

  if (update.character) {
    if (keys.includes(localStorageCharacterKey(update.character.id))) {
      const character = getCharacter(update.character.id)!;
      if (character.timestamp < update.character.timestamp) {
        saveCharacter(update.character);
      } else {
        console.log(
          "The character has already been updated: ",
          character,
          update.character,
        );
      }
    } else {
      saveCharacter(update.character);
    }
  }

  if (update.remove) {
    if (keys.includes(localStorageCharacterKey(update.remove))) {
      removeCharacter(update.remove);
    }
  }

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
