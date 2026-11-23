import { DurableObject } from "cloudflare:workers";
import { Character } from "../character.ts";
import { ConnectionDO } from "./connectionDO.ts";

export class CharacterDO extends DurableObject {
  private connections: Set<DurableObjectId> = new Set();
  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  public subscribe(id: DurableObjectId) {
    this.connections.add(id);
  }

  public unsubscribe(id: DurableObjectId) {
    this.connections.delete(id);
  }

  public notify(character: Character) {
    for (const id of this.connections) {
      const stub = this.env.CONNECTIONS.get(id) as unknown as ConnectionDO;
      stub.sendCharacter(character);
    }
  }
}
