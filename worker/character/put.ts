import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { key as storageKey } from "./key.ts";
import { Character } from "../../character.ts";
import { getCharacterStub } from "../do/mod.ts";

export async function put(
  context: Context<Bindings>,
): Promise<Response> {
  const key = context.req.param("key")!;
  const character = await context.req.json() as Character;

  await context.env.STORAGE.put(
    storageKey(character.id),
    JSON.stringify(character),
  );

  const stub = getCharacterStub(context.env, character.id);

  await stub.notify({ character }, key);

  return context.json(null, 200);
}
