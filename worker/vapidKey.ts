import type { Context } from "hono";
import type { Bindings } from "./bindings.ts";

export async function vapidKey(
  context: Context<Bindings>,
): Promise<Response> {
  return context.json(null, 404);
}
