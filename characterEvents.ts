import { Character } from "./character.ts";
import { CharactersSubscribe, CharacterUpdate } from "./sseTypes.ts";

export class CharacterEvents {
  constructor(
    private id: string,
    initSubscribe: CharactersSubscribe,
    onCharacterUpdate: (update: CharacterUpdate) => void,
    private host: string,
  ) {
    const connection = new EventSource(
      `${this.host}/api/events/${id}`,
    );

    connection.onopen = () => {
      this.subscribe(initSubscribe);
    };

    connection.onmessage = (event) => {
      onCharacterUpdate(JSON.parse(event.data) as CharacterUpdate);
    };

    connection.onerror = (event) => {
      console.error("SSE error:", event);
    };
  }

  public async subscribe(data: CharactersSubscribe) {
    await fetch(
      `${this.host}/api/events/${this.id}/subscribe`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  }

  public async sendUpdate(character: Character) {
    await fetch(
      `${this.host}/api/character/${this.id}`,
      {
        method: "PUT",
        body: JSON.stringify(character),
      },
    );
  }
}
