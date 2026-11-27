import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import type { CharactersSubscribe } from "../../sseTypes.ts";
import { getCharacterStub } from "../do/mod.ts";

export async function subscribe(
  context: Context<Bindings>,
): Promise<Response> {
  const key = context.req.param("key")!;
  const body = await context.req.json() as CharactersSubscribe;

  if (body.subscribe) {
    for (const id of body.subscribe) {
      const stub = getCharacterStub(context.env, id);
      await stub.subscribe(key);
    }
  }

  if (body.unsubscribe) {
    for (const id of body.unsubscribe) {
      const stub = getCharacterStub(context.env, id);
      await stub.unsubscribe(key);
    }
  }

  return context.json(null, 200);
}
