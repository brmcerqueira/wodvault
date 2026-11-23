import { DurableObject } from "cloudflare:workers";
import { Character } from "../../character.ts";
import { ConnectionDO } from "./connectionDO.ts";

export class CharacterDO extends DurableObject {
  private connections: Set<string> = new Set();
  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  public subscribe(id: string) {
    this.connections.add(id);
  }

  public unsubscribe(id: string) {
    this.connections.delete(id);
  }

  public notify(character: Character, myConnectionKey: string) {
    for (const key of this.connections) {
      if (myConnectionKey !== key) {
        const stub = this.env.CONNECTIONS.get(
          this.env.CONNECTIONS.idFromName(key),
        ) as unknown as ConnectionDO;

        if (stub.isConnected) {
          stub.sendCharacter(character);
        }
      }
    }
  }
}
