import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { getConnectionStub } from "../do/mod.ts";

export async function webPushSubscription(
  context: Context<Bindings>,
): Promise<Response> {
  const stub = getConnectionStub(context.env, context.req.param("key")!);

  await stub.webPushSubscription(await context.req.json());

  return context.json(null, 200);
}
