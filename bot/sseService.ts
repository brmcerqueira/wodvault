import { Character } from "../character.ts";
import { CharacterEvents } from "../characterEvents.ts";
import { logger } from "./logger.ts";
import {
  allCharacters,
  getCharacter,
  myId,
  saveCharacter,
} from "./persistence.ts";

const characterEvents = new CharacterEvents(myId, {
  subscribe: Object.keys(allCharacters()),
}, async (update) => {
  logger.info(
    "Event received %v",
    JSON.stringify(update),
  );

  const characters = await allCharacters();

  if (update.character) {
    if (characters[update.character.id]) {
      const character = await getCharacter(update.character.id)!;
      if (character && character.timestamp < update.character.timestamp) {
        saveCharacter(update.character);
      } else {
        logger.info(
          "The character has already been updated: %v %v",
          JSON.stringify(character),
          JSON.stringify(update.character),
        );
      }
    } else {
      saveCharacter(update.character);
    }
  }
}, Deno.env.get("SSE_HOST")!);

export async function sendCharacterUpdate(character: Character) {
  await saveCharacter(character);
  await characterEvents.sendUpdate(character);
}
