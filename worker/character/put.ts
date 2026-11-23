import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { key as storageKey } from "./key.ts";
import { Character } from "../../character.ts";
import { CharacterDO } from "../characterDO.ts";

export async function put(
  context: Context<Bindings>,
): Promise<Response> {
  const key = context.req.param("key")!;
  const character = await context.req.json() as Character;

  await context.env.STORAGE.put(
    storageKey(key),
    JSON.stringify(character),
  );

  const stub = context.env.CHARACTERS.get(
    context.env.CHARACTERS.idFromName(key),
  ) as unknown as CharacterDO;

  stub.notify(character);

  return context.json(null, 200);
}
