import { Character } from "./character.ts";

export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function characterTitle(character: Character): string {
  return `${character.name}${character.player != "" ? ` - ${character.player}` : ""}`;
}

export enum ConnectionStatus {
  Disconnected,
  Connecting,
  Connected,
}

export enum PeerKind {
  Host,
  Client,
  Bot
}

export type SendCharactersData = {
  characters: Character[],
  remove: string[],
}

const prefix = "wodvault";

export function peerId(id: string, kind: PeerKind): string {
  return `${prefix}-${PeerKind[kind].toLowerCase()}-${id}`;
}

export function isPeerKind(id: string, kind: PeerKind): boolean {
  return id.startsWith(`${prefix}-${PeerKind[kind].toLowerCase()}`);
}

export async function sendCharacters(
  connection: { send: (data: string) => void | Promise<void> },
  data: SendCharactersData
) {
  await connection.send(
    JSON.stringify(data),
  );
}