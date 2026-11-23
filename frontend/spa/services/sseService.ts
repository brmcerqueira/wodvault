import { Character } from "../../../character.ts";
import { CharactersSubscribe } from "../../../charactersSubscribe.ts";
import { myId } from "./preferencesService.ts";
import { allCharacters } from "./characterService.ts";

let observeCharactersUpdateCallback:
  | ((characters: Character[], remove: string[]) => void)
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
  const data = JSON.parse(event.data);

  console.log("Event received:", data);

  if (observeCharactersUpdateCallback) {
    observeCharactersUpdateCallback([data], []);
  }
};

connection.onerror = (event) => {
  console.error("SSE error:", event);
};

export function observeCharactersUpdate(
  callback: (characters: Character[], remove: string[]) => void,
) {
  observeCharactersUpdateCallback = callback;
}
