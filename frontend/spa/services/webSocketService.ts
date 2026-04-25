import { Character } from "../../../domain/character.ts";
import { WebSocketMessage, WebSocketMessageKind } from "../../../types.ts";
import { allCharacters, saveCharacter } from "./characterService.ts";

export const webSocketId = crypto.randomUUID();

function buildWebSocket() {
  const socket = new WebSocket(
    `${globalThis.location.protocol === "https:" ? "wss" : "ws"}://${globalThis.location.host}/api/webSocket/${webSocketId}`
  );

  socket.onopen = () => {
    console.info("✅ Websocket connection opened.");
    const post: WebSocketMessage<string[]> = {
      kind: WebSocketMessageKind.Observe,
      data: allCharacters(),
    };
    socket.send(JSON.stringify(post));
  };

  socket.onmessage = (e) => {
    const message: WebSocketMessage<Character> = JSON.parse(e.data);
    if (message.kind == WebSocketMessageKind.Character) {
      saveCharacter(message.data, true);
      if (observeCharacterCallback) {
        observeCharacterCallback(message.data);
      }
    }
  };

  socket.onclose = (e) => {
    console.warn("⚠️ Websocket connection closed. Reconnecting in 3s...", e.reason);
    setTimeout(buildWebSocket, 3000);
  };
}

buildWebSocket();

let observeCharacterCallback: ((character: Character) => void) | undefined;

export function observeCharacter(callback: (character: Character) => void) {
  observeCharacterCallback = callback;
}
