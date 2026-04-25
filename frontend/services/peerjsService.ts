import { Character } from "../../character.ts";
import Peer from "$peerjs";

let peer: Peer | undefined = undefined;

export function host(value: boolean): Promise<string | null> {
  if (value && peer === undefined) {
    return new Promise((resolve) => {
      peer = new Peer();

      peer.on("open", (id) => {
        resolve(id);

        const otherId = prompt("Enter the ID of the peer to connect to:");
        console.log("Trying to connect to:", otherId);

        if (otherId) {
          const connection = peer!.connect(otherId);
          connection.on("open", () => {
            connection.send("Hello, peer! 👋");
          });
        }
      });

      peer.on("connection", (conn) => {
        conn.on("data", (data) => {
          console.log("Received:", data);
        });
      });
    });
  } else if (!value && peer) {
    peer.destroy();
    peer = undefined;
  }

  return Promise.resolve(null);
}

export function observeCharacter(callback: (character: Character) => void) {
}