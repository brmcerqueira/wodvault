import { Character } from "../../character.ts";
import Peer, { DataConnection } from "$peerjs";

if (localStorage.getItem("myId") == null) {
  localStorage.setItem("myId", crypto.randomUUID());
}

export const myId = localStorage.getItem("myId") as string;

const hostConnections: Record<string, DataConnection> = {};
let observeCharacterCallback: ((character: Character) => void) | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

export function host(value: boolean): Promise<string | null> {
  if (value) {
    return createPeer(true);
  } else if (peer) {
    peer.destroy();
    peer = undefined;
  }

  return Promise.resolve(null);
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

    clientConnection.on("open", () => {
      resolve();
    });
  });
}

export async function pushCharacterData(data: string, owner: string | null = null): Promise<void> {
  if (clientConnection) {
    await clientConnection.send(data);
  } else if (owner === null || owner !== myId) {
    const keys = Object.keys(hostConnections);
    for (const key of keys) {
      const connection = hostConnections[key];
      if (connection.open) {
        if (owner === null || key === peerId(owner)) {
          await connection.send(data);
        }
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

function createPeer(host: boolean): Promise<string | null> {
  return new Promise((resolve) => {
    peer = new Peer(peerId(myId));

    peer.on("open", resolve);

    if (host) {
      peer.on("connection", (connection) => {
        hostConnections[connection.peer] = connection;
        connection.on("data", onData);
      });
    }
  });
}

function peerId(id: string): string {
  return `wodvault:${id}`;
}