import { DurableObject } from "cloudflare:workers";
import { CharacterUpdate } from "../../sseTypes.ts";

export class ConnectionDO extends DurableObject {
  private encoder = new TextEncoder();
  private controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  private interval: number | undefined;

  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  override async fetch(request: Request): Promise<Response> {
    this.cancel();

    const stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        this.start(controller);
      },
      cancel: () => {
        this.cancel();
      },
    });

    request.signal.addEventListener(
      "abort",
      () => this.cancel(),
      { once: true },
    );

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }

  private start(controller: ReadableStreamDefaultController<Uint8Array>) {
    this.controller = controller;

    this.enqueue(": connected\n\n");

    this.interval = setInterval(() => {
      this.enqueue(": ping\n\n");
    }, 20_000);
  }

  private cancel() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    this.controller = undefined;
  }

  private enqueue(message: string) {
    if (!this.controller) return;

    try {
      this.controller.enqueue(this.encoder.encode(message));
    } catch {
      this.cancel();
    }
  }

  public get isConnected(): boolean {
    return this.controller !== undefined;
  }

  public sendCharacterUpdate(update: CharacterUpdate) {
    this.enqueue(`data: ${JSON.stringify(update)}\n\n`);
  }
}
