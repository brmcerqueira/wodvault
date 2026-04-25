export enum WebSocketMessageKind {
  Observe,
  Character,
}

export type WebSocketMessage<T> = { kind: WebSocketMessageKind; data: T };