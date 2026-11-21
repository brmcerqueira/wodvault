import { get, put, shared } from "./character/mod.ts";
import { imageUpload } from "./imageUpload.ts";
import { response } from "./response.ts";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/upload")) {
      return imageUpload(request, env);
    }

    if (
      url.pathname.startsWith("/api/character/") &&
      url.pathname.endsWith(".json")
    ) {
      const match = url.pathname.match(/\/([^/]+)\.json/);

      const key = match?.[1];

      if (key) {
        if (request.method === "GET") {
          return get(request, env, key);
        }

        if (request.method === "PUT") {
          return put(request, env, key);
        }
      }

      return new Response(null, {
        status: 404,
        headers: response.corsHeaders,
      });
    }

    if (
      url.pathname.startsWith("/api/shared/") &&
      url.pathname.endsWith(".html")
    ) {
      const match = url.pathname.match(/\/([^/]+)\.html/);

      const key = match?.[1];

      if (key) {
        if (request.method === "GET") {
          return shared(request, env, key);
        }
      }

      return new Response(null, {
        status: 404,
        headers: response.corsHeaders,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
