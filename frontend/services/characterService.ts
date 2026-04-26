import { Character, CharacterKind, CharacterMode } from "../../character.ts";
import Peer, { DataConnection } from "$peerjs";

const hostConnections: Record<string, DataConnection> = {};
let observeCharacterCallback: ((character: Character) => void) | undefined;
let peer: Peer | undefined = undefined;
let clientConnection: DataConnection | undefined = undefined;

if (localStorage.getItem("myId") == null) {
  localStorage.setItem("myId", crypto.randomUUID());
}

export const myId = localStorage.getItem("myId") as string;

export function buildCharacter(kind: CharacterKind): Character {
  return {
    _id: crypto.randomUUID(),
    details: "",
    image: "",
    name: "",
    player: "",
    owner: null,
    deleted: false,
    mode: CharacterMode.Opened,
    kind: kind,
    attributes: {
      physical: {
        strength: 1,
        dexterity: 1,
        stamina: 1,
      },
      social: {
        charisma: 1,
        manipulation: 1,
        composure: 1,
      },
      mental: {
        intelligence: 1,
        wits: 1,
        resolve: 1,
      },
    },
    skills: {
      physical: {
        athletics: 0,
        brawl: 0,
        craft: 0,
        drive: 0,
        firearms: 0,
        melee: 0,
        larceny: 0,
        stealth: 0,
        survival: 0,
      },
      social: {
        animalKen: 0,
        etiquette: 0,
        insight: 0,
        intimidation: 0,
        leadership: 0,
        performance: 0,
        persuasion: 0,
        streetwise: 0,
        subterfuge: 0,
      },
      mental: {
        academics: 0,
        awareness: 0,
        finance: 0,
        investigation: 0,
        medicine: 0,
        occult: 0,
        politics: 0,
        science: 0,
        technology: 0,
      },
    },
    health: {
      superficial: 0,
      aggravated: 0,
      penalty: 0,
      start: 3,
    },
    willpower: {
      superficial: 0,
      aggravated: 0,
      penalty: 0,
    },
    experience: {
      total: 0,
      spent: 0,
    },
    specialties: {},
    advantages: {},
    flaws: {},
    hungerOrRage: 0,
    //Vampire
    resonance: "",
    ambition: "",
    desire: "",
    predator: "",
    clan: "",
    generation: 0,
    humanity: {
      total: 0,
      stains: 0,
    },
    bloodPotency: 0,
    disciplines: {},
    //Werewolf
    auspice: "",
    tribe: "",
    renown: {
      glory: 0,
      honor: 0,
      wisdom: 0,
    },
    harano: 0,
    hauglosk: 0,
    gifts: {},
    rites: [],
  };
}

function localStorageCharacterKey(id: string): string {
  return `character:${id}`;
}

export function allCharacters(): string[] {
  const result: string[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key?.startsWith("character:")) {
      const [_, id] = key.split(":");
      result.push(id.trim());
    }
  }

  return result;
}

export function getCharacter(id: string): Character {
  return JSON.parse(localStorage.getItem(localStorageCharacterKey(id))!);
}

export async function saveCharacter(character: Character) {
  const data = JSON.stringify(character);
  localStorage.setItem(localStorageCharacterKey(character._id), data);

  if (clientConnection) {
    await clientConnection.send(data);
  } else if (character.owner === null || character.owner !== myId) {
    const keys = Object.keys(hostConnections);
    for (const key of keys) {
      const connection = hostConnections[key];
      if (connection.open) {
        if (character.owner === null || key === peerId(character.owner)) {
          await connection.send(data);
        }
      } else {
        delete hostConnections[key];
      }
    }
  }
}

export function removeCharacter(id: string) {
  localStorage.removeItem(localStorageCharacterKey(id));
}

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

        for (const key of allCharacters()) {
          const character = getCharacter(key);
          if (character.owner === null || key === peerId(character.owner)) {
            connection.send(JSON.stringify(character));
          }
        }
      });
    }
  });
}

function peerId(id: string): string {
  return `wodvault:${id}`;
}
