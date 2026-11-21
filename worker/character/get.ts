import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { key } from "./key.ts";

export async function get(
  context: Context<Bindings>,
): Promise<Response> {
  const value = await context.env.STORAGE.get(key(context.req.param("key")!));

  if (value) {
    return context.body(value, 200);
  }

  return context.json(null, 404);
}
