import { Character } from "../../../character.ts";
import { CharacterEvents } from "../../../characterEvents.ts";
import type { CharacterUpdate } from "../../../sseTypes.ts";
import { myId } from "./preferencesService.ts";
import { saveCharacter } from "./characterService.ts";
import { storage } from "../../storage/mod.ts";

type CharacterUpdateCallback = (update: CharacterUpdate) => void;

let characterUpdateCallback:
  | CharacterUpdateCallback
  | undefined;

export const characterEvents = new CharacterEvents(myId, {
  subscribe: (await storage.characters.all()).map((character) => character.id),
}, async (update) => {
  console.log("Event received:", update);

  if (update.character) {
    const character = await storage.characters.get(update.character.id);
    if (character) {
      if (character.timestamp < update.character.timestamp) {
        await saveCharacter(update.character);
      } else {
        console.log(
          "The character has already been updated: ",
          character,
          update.character,
        );
      }
    } else {
      await saveCharacter(update.character);
    }
  }

  if (update.remove) {
    const character = await storage.characters.get(update.remove);
    if (character) {
      await storage.characters.remove(character.id);
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
