import { Character } from "../character.ts";
import { CharacterEvents } from "../characterEvents.ts";
import config from "./config/mod.ts";
import { logger } from "./logger.ts";
import {
  allCharacters,
  getCharacter,
  myId,
  saveCharacter,
} from "./persistence.ts";

export const characterEvents = new CharacterEvents(myId, {
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
        await saveCharacter(update.character);
      } else {
        logger.info(
          "The character has already been updated: %v %v",
          JSON.stringify(character),
          JSON.stringify(update.character),
        );
      }
    } else {
      await saveCharacter(update.character);
    }
  }
}, config.sseHost);

export async function sendCharacterUpdate(character: Character) {
  await saveCharacter(character);
  await characterEvents.sendUpdate(character);
}
