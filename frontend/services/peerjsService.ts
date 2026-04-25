import { Character } from "../../character.ts";
import Peer, { DataConnection } from "$peerjs";

let observeCharacterCallback: ((character: Character) => void) | undefined;
let peer: Peer | undefined = undefined;
let connection: DataConnection | undefined = undefined;

export function host(value: boolean): Promise<string | null> {
  if (value) {
    return createPeer();
  }
  else if (peer) {
    peer.destroy();
    peer = undefined;
  } 

  return Promise.resolve(null);
}

export async function connect(id: string): Promise<void> {
  if (peer === undefined) {
    await createPeer();
  }

  if (connection) {
    connection.close();
  }

  return new Promise((resolve) => {
    connection = peer!.connect(id);

    connection.on("open", () => {
      resolve();
    });
  });
}

export async function pushData(data: string): Promise<void> {
  await connection?.send(data);
}

export function observeCharacter(callback: (character: Character) => void) {
  observeCharacterCallback = callback;
}

function createPeer(): Promise<string | null> {
  return new Promise((resolve) => {
    peer = new Peer();

    peer.on("open", resolve);

    peer.on("connection", (connection) => {
      connection.on("data", (data) => {
        if (observeCharacterCallback) {
          observeCharacterCallback(JSON.parse(data as string));
        }
      });
    });
  });
}