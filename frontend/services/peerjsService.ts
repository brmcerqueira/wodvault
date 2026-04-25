import { Character } from "../../character.ts";
import Peer, { DataConnection } from "$peerjs";

const hostConnections: Record<string, DataConnection> = {};
let observeCharacterCallback: ((character: Character) => void) | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

export function host(value: boolean): Promise<string | null> {
  if (value) {
    return createPeer();
  } else if (peer) {
    peer.destroy();
    peer = undefined;
  }

  return Promise.resolve(null);
}

export async function connect(id: string): Promise<void> {
  if (peer === undefined) {
    await createPeer();
  }

  if (clientConnection) {
    clientConnection.close();
  }

  return new Promise((resolve) => {
    clientConnection = peer!.connect(id);
    clientConnection.on("data", onData);

    clientConnection.on("open", () => {
      resolve();
    });
  });
}

export async function pushData(data: string): Promise<void> {
  if (clientConnection) {
    await clientConnection.send(data);
  } else {
    for (const key in hostConnections) {
      const connection = hostConnections[key];
      if (connection.open) {
        await connection.send(data);
      } else {
        delete hostConnections[key];
      }
    }
  }
}

export function observeCharacter(callback: (character: Character) => void) {
  observeCharacterCallback = callback;
}

function onData(data: unknown) {
  if (observeCharacterCallback) {
    observeCharacterCallback(JSON.parse(data as string));
  }
}

function createPeer(): Promise<string | null> {
  return new Promise((resolve) => {
    peer = new Peer();

    peer.on("open", resolve);

    peer.on("connection", (connection) => {
      hostConnections[connection.connectionId] = connection;
      connection.on("data", onData);
    });
  });
}
