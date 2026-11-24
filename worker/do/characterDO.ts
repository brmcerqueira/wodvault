import { DurableObject } from "cloudflare:workers";
import { ConnectionDO } from "./connectionDO.ts";
import { CharacterUpdate } from "../../sseTypes.ts";

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
        console.info(
          `character[${this.ctx.id}]-connections -> ${connections.join(" | ")}`,
        );
        for (const id of connections) {
          this.connections.add(id);
        }
      }
    });
  }

  public async subscribe(id: string) {
    console.info(`character[${this.ctx.id}]-subscribe -> ${id}`);
    this.connections.add(id);
    await this.ctx.storage.put(connectionsKey, [...this.connections]);
  }

  public async unsubscribe(id: string) {
    console.info(`character[${this.ctx.id}]-unsubscribe -> ${id}`);
    this.connections.delete(id);
    await this.ctx.storage.put(connectionsKey, [...this.connections]);
  }

  public notify(update: CharacterUpdate, myConnectionKey: string) {
    console.info(
      `character[${this.ctx.id}]-notify -> myConnectionKey: ${myConnectionKey} update: ${
        JSON.stringify(update)
      } connections: ${[...this.connections].join(" | ")}`,
    );
    for (const key of this.connections) {
      if (myConnectionKey !== key) {
        const stub = this.env.CONNECTIONS.get(
          this.env.CONNECTIONS.idFromName(key),
        ) as unknown as ConnectionDO;

        if (stub.isConnected) {
          stub.sendCharacterUpdate(update);
        }
      }
    }
  }
}
