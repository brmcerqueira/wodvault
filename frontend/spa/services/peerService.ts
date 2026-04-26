import { Character } from "../../../character.ts";
import Peer, { DataConnection } from "$peerjs";
import {
  allCharacters,
  getCharacter,
  localStorageCharacterKey,
  saveCharacter,
} from "./characterService.ts";
import { hostId, myId, setHostId } from "./preferencesService.ts";

const hostConnections: Record<string, DataConnection> = {};
let observeCharactersUpdateCallback:
  | ((characters: Character[]) => void)
  | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

export async function sendCharacterUpdate(character: Character) {
  saveCharacter(character);

  if (clientConnection) {
    await sendCharacters(clientConnection, character);
  } else if (character.owner === null || character.owner !== myId) {
    const keys = Object.keys(hostConnections);
    for (const key of keys) {
      const connection = hostConnections[key];
      if (connection.open) {
        if (character.owner === null || key === peerId(character.owner)) {
          await sendCharacters(connection, character);
        }
      } else {
        delete hostConnections[key];
      }
    }
  }
}

async function sendCharacters(
  connection: DataConnection,
  ...characters: Character[]
) {
  await connection.send(
    JSON.stringify(characters),
  );
}

export async function host(value: boolean): Promise<void> {
 if (peer) {
    peer.destroy();
    peer = undefined;
  }

  if (value) {
    await createPeer(true);
    setHostId(myId);
  }
  else {
    setHostId(null);
  }
}

export function disconnect() {
  if (clientConnection) {
    clientConnection.close();
    clientConnection = undefined;
  }
  setHostId(null);
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
      setHostId(id);
      resolve();
    });
  });
}

export function observeCharactersUpdate(
  callback: (characters: Character[]) => void,
) {
  observeCharactersUpdateCallback = callback;
}

function onData(data: unknown) {
  const characters = JSON.parse(data as string) as Character[];
  const keys = allCharacters();
  for (const character of characters) {
    if (!keys.includes(localStorageCharacterKey(character._id))) {
      saveCharacter(character);
    }
  }

  if (observeCharactersUpdateCallback) {
    observeCharactersUpdateCallback(characters);
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
            sendCharacters(connection, ...characters);
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

const id = hostId()

if (id !== null && id !== myId) {
  await connect(id);
}

function peerId(id: string): string {
  return `wodvault-${id}`;
}
