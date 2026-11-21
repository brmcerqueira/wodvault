import type { Context } from "hono";
import type { Bindings } from "../bindings.ts";
import { Character, CharacterKind } from "../../character.ts";
import { locale } from "../i18n/locale.ts";
import { key } from "./key.ts";

export async function shared(
  context: Context<Bindings>,
): Promise<Response> {
  const value = await context.env.STORAGE.get(key(context.req.param("key")!));
  const character = value ? JSON.parse(value) as Character : null;

  if (character) {
    return context.html(
      Metadata({ character, url: context.req.url }).toString(),
      200,
      {
        "Content-Type": "text/html; charset=UTF-8",
      },
    );
  }

  return context.html("", 404);
}

function Metadata(props: { character: Character; url: string }) {
  const redirectUrl = new URL("/", props.url);

  redirectUrl.hash = `/${
    props.character.kind === CharacterKind.Vampire ? "vampire" : "werewolf"
  }?shared=true&key=${btoa(props.character.id)}`;

  let description = `${locale.player}: ${props.character.player} · `;

  if (props.character.kind === CharacterKind.Vampire) {
    description +=
      `${locale.clan}: ${props.character.clan} · ${locale.predator}: ${props.character.predator} · ${locale.generation}: ${props.character.generation}`;
  } else {
    description +=
      `${locale.tribe}: ${props.character.tribe} · ${locale.auspice}: ${props.character.auspice}`;
  }

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta property="og:title" content={props.character.name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={props.character.image ?? ""} />
        <meta property="og:url" content={props.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.character.name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={props.character.image ?? ""} />
        <meta http-equiv="refresh" content={`0;url=${redirectUrl}`} />
      </head>
      <body />
    </html>
  );
}
