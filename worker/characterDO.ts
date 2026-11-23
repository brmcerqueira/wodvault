import { DurableObject } from "cloudflare:workers";
import { Character } from "../character.ts";

export class CharacterDO extends DurableObject {
  constructor(
    private state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  async saveCharacter(character: Character) {
    await this.state.storage.put(
      "character",
      character,
    );
  }

  async getCharacter() {
    return await this.state.storage.get<Character>(
      "character",
    );
  }
}
