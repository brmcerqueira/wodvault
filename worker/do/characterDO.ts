import { DurableObject } from "cloudflare:workers";
import { Character } from "../../character.ts";
import { ConnectionDO } from "./connectionDO.ts";

const connectionsKey: string = "connections";

export class CharacterDO extends DurableObject {
  private connections: Set<string> = new Set();
  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);

    this.ctx.blockConcurrencyWhile(async () => {
      const connections = await this.ctx.storage.get<string[]>(connectionsKey);
      if (connections) {
        for (const id of connections) {
          this.connections.add(id);
        }
      }
    });
  }

  public async subscribe(id: string) {
    this.connections.add(id);

    await this.ctx.storage.put(connectionsKey, [...this.connections]);
  }

  public async unsubscribe(id: string) {
    this.connections.delete(id);

    await this.ctx.storage.put(connectionsKey, [...this.connections]);
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
