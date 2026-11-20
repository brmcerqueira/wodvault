import { response } from "../response.ts";
import { key } from "./key.ts";

export async function get(
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const value = await env.STORAGE.get(key(id));

  if (value) {
    return new Response(value, {
      status: 200,
      headers: response.corsHeaders,
    });
  }

  return new Response(null, {
    status: 404,
    headers: response.corsHeaders,
  });
}
