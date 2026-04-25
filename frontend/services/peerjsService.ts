import { Character } from "../../character.ts";
import Peer from "$peerjs";

const peer = new Peer();

export function observeCharacter(callback: (character: Character) => void) {
	
}

peer.on("open", (id) => {
  console.log("My peer ID:", id);
});

peer.on("connection", (conn) => {
  conn.on("data", (data) => {
    console.log("Received:", data);
  });
});
    
const id = prompt("Enter the ID of the peer to connect to:");

if (id) {
    const connection = peer.connect(id);

    connection.on("open", () => {
        connection.send("Hello, peer! 👋");
    });
}