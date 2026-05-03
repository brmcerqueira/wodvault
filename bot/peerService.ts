import Peer, { DataConnection } from "$peerjs";
import { Character } from "../character.ts";
import {
  ConnectionStatus,
  peerId,
  PeerKind,
  sendCharacters,
  SendCharactersData,
} from "../utils.ts";
import { logger } from "./logger.ts";
import { allCharacters, getHostId, myId, saveCharacter } from "./persistence.ts";

let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;
let _connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;

export function connectionStatus(): ConnectionStatus {
  return _connectionStatus;
}

function createPeer(): Promise<void> {
  return new Promise((resolve) => {
    peer = new Peer(peerId(myId, PeerKind.Bot));

    peer.on("open", (id) => {
      logger.info("[PeerJS][peer:open] %v", id);
      resolve();
    });
    peer.on("error", (error) => {
      logger.error(error);
    });
    peer.on("disconnected", (id) => {
      _connectionStatus = ConnectionStatus.Disconnected;
      logger.info("[PeerJS][peer:disconnected] %v", id);
    });
    peer.on("close", () => {
      _connectionStatus = ConnectionStatus.Disconnected;
      logger.info("[PeerJS][peer:close]");
    });
  });
}

export async function connect(id: string): Promise<void> {
  if (peer) {
    peer.destroy();
    peer = undefined;
    _connectionStatus = ConnectionStatus.Disconnected;
  } else {
    await createPeer();
  }

  if (clientConnection) {
    clientConnection.close();
  }

  const hostPeerId = peerId(id, PeerKind.Host);

  return new Promise((resolve) => {
    clientConnection = peer!.connect(hostPeerId);
    clientConnection.on("data", incomingCharacters);
    clientConnection.on("error", (error) => {
      logger.error(error);
    });
    clientConnection.on("close", () => {
      _connectionStatus = ConnectionStatus.Disconnected;
      logger.info("[PeerJS][clientConnection:close] %v", hostPeerId);
    });
    clientConnection.on("open", () => {
      _connectionStatus = ConnectionStatus.Connected;
      resolve();
    });
  });
}

export async function sendCharacterUpdate(character: Character) {
  await saveCharacter(character);

  if (clientConnection) {
    await sendCharacters(clientConnection, {
      characters: [character],
      remove: [],
    });
  }
}

async function incomingCharacters(json: unknown): Promise<void> {
  const data = JSON.parse(json as string) as SendCharactersData;
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

  if (clientConnection && updateRemoteCharacters.length > 0) {
    await sendCharacters(clientConnection, {
      characters: updateRemoteCharacters,
      remove: [],
    });
  }
}

const id = await getHostId();

if (id) {
  await connect(id);
}
