import { Character } from "../../character.ts";
import Peer from "$peerjs";

const peer = new Peer();

export function observeCharacter(callback: (character: Character) => void) {
}

peer.on("open", (id) => {
  console.log("My peer ID:", id);

  const otherId = prompt("Enter the ID of the peer to connect to:");

  console.log("Trying to connect to:", otherId);

  if (otherId) {
    const connection = peer.connect(otherId);

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
