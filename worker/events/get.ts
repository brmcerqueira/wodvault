import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { getConnectionStub } from "../do/mod.ts";

export function get(
  context: Context<Bindings>,
): Promise<Response> {
  const stub = getConnectionStub(context.env, context.req.param("key")!);
  return stub.fetch(context.req.raw);
}
