import { DurableObject } from "cloudflare:workers";
import { Character } from "../character.ts";

export class ConnectionDO extends DurableObject {
  private encoder = new TextEncoder();
  private controller!: ReadableStreamDefaultController<Uint8Array>;
  private interval: number | undefined;

  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  override async fetch(_request: Request): Promise<Response> {
    return new Response(
      new ReadableStream<Uint8Array>({
        start: (c) => this.start(c),
        cancel: () => this.cancel(),
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      },
    );
  }

  private start(controller: ReadableStreamDefaultController<Uint8Array>) {
    this.controller = controller;

    this.interval = setInterval(() => {
      try {
        this.enqueue(": ping\n\n");
      } catch {
        this.cancel();
      }
    }, 30_000);
  }

  private cancel() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private enqueue(message: string) {
    this.controller.enqueue(
      this.encoder.encode(message),
    );
  }

  public sendCharacter(character: Character) {
    this.enqueue(`data: ${JSON.stringify(character)}\n\n`);
  }
}
