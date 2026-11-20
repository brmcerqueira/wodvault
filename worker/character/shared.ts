import { Character } from "../../character.ts";
import { response } from "../response.ts";
import { key } from "./key.ts";

export async function shared(
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const value = await env.STORAGE.get(key(id));
  const character = value ? JSON.parse(value) as Character : null;

  if (character) {
    return new Response(
      `
        <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />

            <meta property="og:title" content="${character.name}" />
            <meta property="og:description" content="${character.player}" />
            <meta property="og:image" content="${character.image ?? ""}" />
            <meta property="og:url" content="#/open?key=${btoa(id)}" />
            <meta property="og:type" content="website" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${character.name}" />
            <meta name="twitter:description" content="${character.player}" />
            <meta name="twitter:image" content="${character.image ?? ""}" />
          </head>
          <body></body>
        </html>
      `,
      {
        status: 200,
        headers: {
          ...response.corsHeaders,
          "Content-Type": "text/html; charset=UTF-8",
        },
      },
    );
  }

  return new Response(null, {
    status: 404,
    headers: response.corsHeaders,
  });
}
