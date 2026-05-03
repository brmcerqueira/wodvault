import { Character } from "../character.ts";
import { sendCharacters, SendCharactersData } from "../utils.ts";
import { logger } from "./logger.ts";
import { allCharacters, saveCharacter } from "./persistence.ts";

let socket: WebSocket | undefined = undefined;
let abortController: AbortController | undefined;

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
        logger.info("[WS] endpoint listening on :%v", port),
    },
    (request) => {
      const url = new URL(request.url);

      if (url.pathname === "/ws") {
        const upgrade = Deno.upgradeWebSocket(request);
        
        socket = upgrade.socket;

        socket.onopen = () => {
          logger.info("[WS] client connected");
        };

        socket.onmessage = incomingCharacters;

        socket.onclose = () => {
          logger.info("[WS] client disconnected");
        };

        socket.onerror = (event) => {
          logger.error("[WS] client error %v", event);
        };

        return upgrade.response;
      }

      return new Response("Not found", { status: 404 });
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
    const data = JSON.parse(event.data) as SendCharactersData;
    const updateRemoteCharacters: Character[] = [];
    const characters = await allCharacters();
    const keys = Object.keys(characters);
    for (const remoteCharacter of data.characters) {
      if (keys.includes(remoteCharacter.id)) {
        const character = characters[remoteCharacter.id];
        if (character.timestamp < remoteCharacter.timestamp) {
          await saveCharacter(remoteCharacter);
        } else if (character.timestamp > remoteCharacter.timestamp) {
          updateRemoteCharacters.push(character);
        }
      } else {
        await saveCharacter(remoteCharacter);
      }
    }

    if (updateRemoteCharacters.length > 0) {
      await sendCharacters(this, {
        characters: updateRemoteCharacters,
        remove: [],
      });
    }
}
