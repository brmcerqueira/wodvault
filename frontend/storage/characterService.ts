import { Character } from "../../character.ts";
import { CharacterUpdate } from "../../sseTypes.ts";
import { timestamp } from "../../timestamp.ts";
import { storage } from "./storage.ts";

export async function saveCharacter(character: Character) {
  character.timestamp = timestamp();
  await storage.instance.characters.save(character);
}

export async function treatCharacterUpdate(update: CharacterUpdate) {
  if (update.character) {
    const character = await storage.instance.characters.get(
      update.character.id,
    );
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
    const character = await storage.instance.characters.get(update.remove);
    if (character) {
      await storage.instance.characters.remove(character.id);
    }
  }
}
