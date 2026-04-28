import { Character } from "../../../character.ts";
import Peer, { DataConnection } from "$peerjs";
import {
  allCharacters,
  getCharacter,
  localStorageCharacterKey,
  removeCharacter,
  saveCharacter,
} from "./characterService.ts";
import { myId, setHostId } from "./preferencesService.ts";

const hostConnections: Record<string, DataConnection> = {};
let observeCharactersUpdateCallback:
  | ((characters: Character[], remove: string[]) => void)
  | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

export enum ConnectionStatus {
 Disconnected,
 Connecting,
 Connected,
}

type SendCharactersData = {
  characters: Character[],
  remove: string[],
}

let _connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;

export function connectionStatus(): ConnectionStatus {
  return _connectionStatus;
}

export async function sendCharacterUpdate(character: Character) {
  saveCharacter(character);

  if (clientConnection) {
    await sendCharacters(clientConnection, { characters: [character], remove: [] });
  } else if (character.owner === null || character.owner !== myId) {
    const keys = Object.keys(hostConnections);
    for (const key of keys) {
      const connection = hostConnections[key];
      if (connection.open) {
        if (character.owner === null || key === peerId(character.owner)) {
          await sendCharacters(connection, { characters: [character], remove: [] });
        }
        else if (character.owner !== null && key !== peerId(character.owner)) {          
          await sendCharacters(connection, { characters: [], remove: [character.id] });
        }
      } else {
        delete hostConnections[key];
      }
    }
  }
}

async function sendCharacters(
  connection: DataConnection,
  data: SendCharactersData
) {
  await connection.send(
    JSON.stringify(data),
  );
}

export async function host(): Promise<void> {
 if (peer) {
    peer.destroy();
    peer = undefined;
    _connectionStatus = ConnectionStatus.Disconnected;
  }

  if (_connectionStatus === ConnectionStatus.Disconnected) {
    await createPeer(true);
    setHostId(myId);
  }
  else {
    setHostId(null);
    _connectionStatus = ConnectionStatus.Disconnected;
  }
}

export function disconnect() {
  if (clientConnection) {
    clientConnection.close();
    clientConnection = undefined;
  }
  setHostId(null);
  _connectionStatus = ConnectionStatus.Disconnected;
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
    clientConnection.on("data", incomingCharacters(clientConnection));
    clientConnection.on("error", (error) => {
      console.error("[PeerJS][clientConnection:error]", {
        target: peerId(id),
        error,
      });
    });
    clientConnection.on("close", () => {
      _connectionStatus = ConnectionStatus.Disconnected;
      console.error("[PeerJS][clientConnection:close]", {
        target: peerId(id),
      });
    });

    clientConnection.on("open", () => {
      _connectionStatus = ConnectionStatus.Connected;
      setHostId(id);
      resolve();
    });
  });
}

export function observeCharactersUpdate(
  callback: (characters: Character[], remove: string[]) => void,
) {
  observeCharactersUpdateCallback = callback;
}

function incomingCharacters(connection: DataConnection): (json: unknown) => void {
  return (json) => {
    const data = JSON.parse(json as string) as SendCharactersData;
    const characters: Character[] = [];
    const remove: string[] = [];
    const updateRemoteCharacters: Character[] = [];
    const keys = allCharacters();
    for (const remoteCharacter of data.characters) {
      if (keys.includes(localStorageCharacterKey(remoteCharacter.id))) {
        const character = getCharacter(remoteCharacter.id)!;
        if (character.timestamp < remoteCharacter.timestamp) {
          saveCharacter(remoteCharacter);
          characters.push(remoteCharacter);
        }
        else if (character.timestamp > remoteCharacter.timestamp) {
          updateRemoteCharacters.push(character);
        }
      }
      else {
        saveCharacter(remoteCharacter);
        characters.push(remoteCharacter);
      }
    }

    for (const id of data.remove) {
      if (keys.includes(localStorageCharacterKey(id))) {
        removeCharacter(id);
        remove.push(id);
      }
    }

    if (updateRemoteCharacters.length > 0) {
      sendCharacters(connection, { characters: updateRemoteCharacters, remove: [] });
    }

    if (observeCharactersUpdateCallback) {
      observeCharactersUpdateCallback(characters, remove);
    }
  }
}

function createPeer(host: boolean): Promise<void> {
  return new Promise((resolve) => {
    peer = new Peer(peerId(myId));

    peer.on("open", (id) => {
      if (host) {
          _connectionStatus = ConnectionStatus.Connected;
      }
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
      _connectionStatus = ConnectionStatus.Disconnected;
      console.error("[PeerJS][peer:disconnected]", {
        host,
        myId: peerId(myId),
      });
    });
    peer.on("close", () => {
      _connectionStatus = ConnectionStatus.Disconnected;
      console.error("[PeerJS][peer:close]", { host, myId: peerId(myId) });
    });

    if (host) {
      peer.on("connection", (connection) => {
        hostConnections[connection.peer] = connection;
        console.log("[PeerJS][host:connection]", { peer: connection.peer });
        connection.on("data", incomingCharacters(connection));
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
            if (character === null) {
              continue;
            }
            if (
              character.owner === null ||
              connection.peer === peerId(character.owner)
            ) {
              characters.push(character);
            }
          }

          try {
            sendCharacters(connection, { characters, remove: [] });
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
