import { renderToStaticMarkup } from "react-dom/server";
import { Character, CharacterKind } from "../../character.ts";
import { response } from "../response.ts";
import { key } from "./key.ts";

export async function shared(
  request: Request,
  env: Env,
  id: string,
): Promise<Response> {
  const value = await env.STORAGE.get(key(id));
  const character = value ? JSON.parse(value) as Character : null;

  if (character) {
    return new Response(
      renderToStaticMarkup(
        <Metadata character={character} url={request.url} />,
      ),
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

function Metadata(props: { character: Character; url: string }) {
  const redirectUrl = new URL("/", props.url);

  redirectUrl.hash = `/${
    props.character.kind === CharacterKind.Vampire ? "vampire" : "werewolf"
  }?shared=true&key=${btoa(props.character.id)}`;

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta property="og:title" content={props.character.name} />
        <meta property="og:description" content={props.character.player} />
        <meta property="og:image" content={props.character.image ?? ""} />
        <meta property="og:url" content={props.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.character.name} />
        <meta name="twitter:description" content={props.character.player} />
        <meta name="twitter:image" content={props.character.image ?? ""} />
        <meta http-equiv="refresh" content={`0;url=${redirectUrl}`} />
      </head>
      <body></body>
    </html>
  );
}
