import { response } from "../response.ts";
import { key } from "./key.ts";

export async function put(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  await env.STORAGE.put(
    key(id),
    JSON.stringify(await request.json()),
  );

  return new Response(null, {
    status: 200,
    headers: response.corsHeaders,
  });
}
