interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({
          message: "API executada pelo Cloudflare Worker",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Frontend estático
    return env.ASSETS.fetch(request);
  },
};
