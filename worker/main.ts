import type { Env } from "./env.ts";
import { imageUpload } from "./imageUpload.ts";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/upload")) {
      return imageUpload(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
