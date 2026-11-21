import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { response } from "../response.ts";
import { key } from "./key.ts";

export async function put(
  context: Context<Bindings>,
): Promise<Response> {
  await context.env.STORAGE.put(
    key(context.req.param("key")!),
    JSON.stringify(await context.req.json()),
  );

  return new Response(null, {
    status: 200,
    headers: response.corsHeaders,
  });
}
