import { Character } from "../character.ts";
import { sendCharacters, SendCharactersData } from "../utils.ts";
import { logger } from "./logger.ts";
import { locale } from "./i18n/locale.ts";
import { allCharacters, saveCharacter } from "./persistence.ts";

let socket: WebSocket | undefined = undefined;
let abortController: AbortController | undefined;

const imgbbApiKey = Deno.env.get("IMGBB_API_KEY")!;

export function start(port: number): void {
  if (abortController) {
    logger.info("[WS] endpoint already running on port %v", port);
    return;
  }

  abortController = new AbortController();

  Deno.serve(
    {
      port,
      signal: abortController.signal,
      onListen: ({ port }) =>
        logger.info("[WS] endpoint listening on %v", port),
    },
    (request) => {
      const url = new URL(request.url);

      if (url.pathname === "/webSocket") {
        const upgrade = Deno.upgradeWebSocket(request);

        socket = upgrade.socket;

        socket.onopen = () => {
          logger.info("[WS] client connected");
        };

        socket.onmessage = incomingCharacters;

        socket.onclose = () => {
          logger.info("[WS] client disconnected");
        };

        socket.onerror = (error) => {
          logger.error(error);
        };

        return upgrade.response;
      }

      return new Response(locale.notFound, { status: 404 });
    },
  );
}

export function abort(): void {
  if (!abortController) {
    logger.info("[WS] endpoint is not running");
    return;
  }

  abortController.abort();
  abortController = undefined;
  logger.info("[WS] endpoint aborted");
}

export async function sendCharacterUpdate(character: Character) {
  await saveCharacter(character);
  await sendCharacterBySocket(character);
}

async function sendCharacterBySocket(character: Character) {
  if (socket) {
    await sendCharacters(socket, {
      characters: [character],
      remove: [],
    });
  }
}

async function incomingCharacters(
  this: WebSocket,
  event: MessageEvent<string>,
) {
  logger.info("[WS] Incoming Characters %v", event.data);
  const data = JSON.parse(event.data) as SendCharactersData;
  const updateRemoteCharacters: Character[] = [];
  const characters = await allCharacters();
  const keys = Object.keys(characters);
  for (const remoteCharacter of data.characters) {
    if (keys.includes(remoteCharacter.id)) {
      const character = characters[remoteCharacter.id];
      if (character.timestamp < remoteCharacter.timestamp) {
        await incomingCharacter(remoteCharacter);
      } else if (character.timestamp > remoteCharacter.timestamp) {
        updateRemoteCharacters.push(character);
      }
    } else {
      await incomingCharacter(remoteCharacter);
    }
  }

  if (updateRemoteCharacters.length > 0) {
    await sendCharacters(this, {
      characters: updateRemoteCharacters,
      remove: [],
    });
  }
}

async function incomingCharacter(character: Character) {
  const isBase64 = character.image.startsWith("data:image/");

  if (isBase64) {
    const image = character.image.replace(/^data:image\/\w+;base64,/, "");
    const form = new FormData();

    form.append("image", image);
    form.append("name", character.name);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbApiKey)}`,
      {
        method: "POST",
        body: form,
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      logger.error(
        "Can't upload image for '%v' -> %v",
        character.id,
        await response.text(),
      );
      return;
    }

    const result = await response.json();
    const remoteUrl: string | undefined = result.data?.thumb?.url ??
      result.data?.image?.url ?? result.data?.url;

    if (!remoteUrl) {
      logger.error(
        "Can't upload image for '%v' -> %v",
        character.id,
        JSON.stringify(result),
      );
      return;
    }

    character.image = remoteUrl;

    logger.info(
      "Upload image for '%v' -> %v",
      character.id,
      character.image,
    );
  }

  await saveCharacter(character);

  if (isBase64) {
    await sendCharacterBySocket(character);
  }
}
