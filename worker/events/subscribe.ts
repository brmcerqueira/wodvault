import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import type { CharactersSubscribe } from "../../sseTypes.ts";
import { CharacterDO } from "../do/mod.ts";

export async function subscribe(
  context: Context<Bindings>,
): Promise<Response> {
  const key = context.req.param("key")!;
  const body = await context.req.json() as CharactersSubscribe;

  if (body.subscribe) {
    for (const id of body.subscribe) {
      const stub = getCharacterDO(context, id);
      await stub.subscribe(key);
    }
  }

  if (body.unsubscribe) {
    for (const id of body.unsubscribe) {
      const stub = getCharacterDO(context, id);
      await stub.unsubscribe(key);
    }
  }

  return context.json(null, 200);
}

function getCharacterDO(context: Context<Bindings>, key: string): CharacterDO {
  return context.env.CHARACTERS.get(
    context.env.CHARACTERS.idFromName(key),
  ) as unknown as CharacterDO;
}
