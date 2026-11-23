import type { Context } from "hono";
import type { Bindings } from "./bindings.ts";

export async function events(
  context: Context<Bindings>,
): Promise<Response> {
  const stub = context.env.CONNECTIONS.get(
    context.env.CONNECTIONS.idFromName(context.req.param("key")!),
  );

  return stub.fetch(context.req.raw);
}
