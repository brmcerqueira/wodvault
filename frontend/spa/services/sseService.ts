import { Character } from "../../../character.ts";
import type {
  CharactersSubscribe,
  CharacterUpdate,
} from "../../../sseTypes.ts";
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

const connection = new EventSource(
  `/api/events/${myId}`,
);

connection.onopen = () => {
  console.log("SSE connected");

  fetch(
    `api/events/${myId}/subscribe`,
    {
      method: "PUT",
      body: JSON.stringify({
        subscribe: allCharacters(),
      } as CharactersSubscribe),
    },
  );
};

connection.onmessage = (event) => {
  const data = JSON.parse(event.data) as CharacterUpdate;

  console.log("Event received:", data);

  const keys = allCharacters();

  if (data.character) {
    if (keys.includes(localStorageCharacterKey(data.character.id))) {
      const character = getCharacter(data.character.id)!;
      if (character.timestamp < data.character.timestamp) {
        saveCharacter(data.character);
      } else {
        console.log(
          "The character has already been updated: ",
          character,
          data.character,
        );
      }
    } else {
      saveCharacter(data.character);
    }
  }

  if (data.remove) {
    if (keys.includes(localStorageCharacterKey(data.remove))) {
      removeCharacter(data.remove);
    }
  }

  if (characterUpdateCallback) {
    characterUpdateCallback(data);
  }
};

connection.onerror = (event) => {
  console.error("SSE error:", event);
};

export function observeCharacterUpdate(
  callback: CharacterUpdateCallback,
) {
  characterUpdateCallback = callback;
}

export async function sendCharacterUpdate(character: Character) {
  saveCharacter(character);

  await fetch(
    `api/character/${myId}`,
    {
      method: "PUT",
      body: JSON.stringify(character),
    },
  );
}
