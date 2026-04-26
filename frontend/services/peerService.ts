import { Character } from "../../character.ts";
import Peer, { DataConnection } from "$peerjs";
import { allCharacters, getCharacter, myId, saveCharacter } from "./characterService.ts";

const hostConnections: Record<string, DataConnection> = {};
let observeCharacterUpdateCallback:
  | ((character: Character) => void)
  | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

type PeerMessage = {
  type: "characterUpdate";
  character: Character;
} | {
  type: "characterAdds";
  characters: Character[];
};

export async function sendCharacterUpdate(character: Character) {
  saveCharacter(character);

  if (clientConnection) {
    await send(clientConnection, character);
  } else if (character.owner === null || character.owner !== myId) {
    const keys = Object.keys(hostConnections);
    for (const key of keys) {
      const connection = hostConnections[key];
      if (connection.open) {
        if (character.owner === null || key === peerId(character.owner)) {
          await send(connection, character);
        }
      } else {
        delete hostConnections[key];
      }
    }
  }
}

async function send(
  connection: DataConnection,
  character: Character,
) {
  await connection.send(
    JSON.stringify({ type: "characterUpdate", character }),
  );
}

export async function host(value: boolean): Promise<void> {
  if (value) {
    await createPeer(true);
  } else if (peer) {
    peer.destroy();
    peer = undefined;
  }
}

export async function connect(id: string): Promise<void> {
  if (peer === undefined) {
    await createPeer(false);
  }

  if (clientConnection) {
    clientConnection.close();
  }

  return new Promise((resolve) => {
    clientConnection = peer!.connect(peerId(id));
    clientConnection.on("data", onData);
    clientConnection.on("error", (error) => {
      console.error("[PeerJS][clientConnection:error]", {
        target: peerId(id),
        error,
      });
    });
    clientConnection.on("close", () => {
      console.error("[PeerJS][clientConnection:close]", {
        target: peerId(id),
      });
    });

    clientConnection.on("open", () => {
      resolve();
    });
  });
}

export function observeCharacterUpdate(
  callback: (character: Character) => void,
) {
  observeCharacterUpdateCallback = callback;
}

function onData(data: unknown) {
  let message: PeerMessage;

  try {
    message = JSON.parse(data as string) as PeerMessage;
  } catch (error) {
    console.error("[PeerJS][onData:parseError]", { data, error });
    return;
  }

  if (message.type === "characterUpdate") {
    if (observeCharacterUpdateCallback) {
      observeCharacterUpdateCallback(message.character);
    }
  } else if (message.type === "characterAdds") {
    for (const character of message.characters) {
      saveCharacter(character);
    }
  }
}

function createPeer(host: boolean): Promise<void> {
  return new Promise((resolve) => {
    peer = new Peer(peerId(myId));

    peer.on("open", (id) => {
      console.log("[PeerJS][peer:open]", { id, host });
      resolve();
    });
    peer.on("error", (error) => {
      console.error("[PeerJS][peer:error]", {
        host,
        myId: peerId(myId),
        error,
      });
    });
    peer.on("disconnected", () => {
      console.error("[PeerJS][peer:disconnected]", {
        host,
        myId: peerId(myId),
      });
    });
    peer.on("close", () => {
      console.error("[PeerJS][peer:close]", { host, myId: peerId(myId) });
    });

    if (host) {
      peer.on("connection", (connection) => {
        hostConnections[connection.peer] = connection;
        console.log("[PeerJS][host:connection]", { peer: connection.peer });
        connection.on("data", onData);
        connection.on("error", (error) => {
          console.error("[PeerJS][hostConnection:error]", {
            peer: connection.peer,
            error,
          });
        });
        connection.on("close", () => {
          console.error("[PeerJS][hostConnection:close]", {
            peer: connection.peer,
          });
          delete hostConnections[connection.peer];
        });

        connection.on("open", () => {
          const characters: Character[] = [];

          for (const key of allCharacters()) {
            const character = getCharacter(key);
            if (
              character.owner === null ||
              connection.peer === peerId(character.owner)
            ) {
              characters.push(character);
            }
          }

          try {
            connection.send(
              JSON.stringify({ type: "characterAdds", characters }),
            );
          } catch (error) {
            console.error("[PeerJS][hostConnection:sendCharacterAddsError]", {
              peer: connection.peer,
              error,
            });
          }
        });
      });
    }
  });
}

function peerId(id: string): string {
  return `wodvault-${id}`;
}
