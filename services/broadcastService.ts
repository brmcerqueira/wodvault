import { Character } from "../domain/character.ts";

type CharacterCallback = (character: Character) => void;

const observes: Record<
  string,
  { callback: CharacterCallback; ids: string[] }
> = {};
const notifyMap: Record<string, string[]> = {};

export function observe(
  webSocketId: string,
  callback: CharacterCallback,
  ids: string[],
): void {
  observes[webSocketId] = { callback, ids };
  for (const id of ids) {
    add(webSocketId, id);
  }
}

export function removeObserve(webSocketId: string) {
  const ids = observes[webSocketId].ids;
  delete observes[webSocketId];
  for (const id of ids) {
    if (notifyMap[id]) {
      const index = notifyMap[id].indexOf(webSocketId);
      if (index > -1) {
        notifyMap[id].splice(index, 1);
      }
    }
  }
}

export function notify(character: Character, webSocketId?: string) {
  if (notifyMap[character._id]) {
    for (const id of notifyMap[character._id]) {
      if (webSocketId === undefined || id != webSocketId) {
        observes[id]?.callback(character);
      }
    }
  }
}

export function add(webSocketId: string, id: string) {
  if (observes[webSocketId]) {
    if (notifyMap[id] === undefined) {
      notifyMap[id] = [];
    }

    if (notifyMap[id].indexOf(webSocketId) == -1) {
      notifyMap[id].push(webSocketId);
    }

    if (observes[webSocketId].ids.indexOf(id) == -1) {
      observes[webSocketId].ids.push(id);
    }
  }
}

export function remove(webSocketId: string, id: string) {
  const webSocketIndex = notifyMap[id].indexOf(webSocketId);

  if (webSocketIndex > -1) {
    notifyMap[id].splice(webSocketIndex, 1);
  }

  const index = observes[webSocketId].ids.indexOf(id);

  if (index > -1) {
    observes[webSocketId].ids.splice(index, 1);
  }
}
