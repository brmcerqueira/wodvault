import { DurableObject } from "cloudflare:workers";
import { CharacterUpdate } from "../../sseTypes.ts";
import { send, Subscription } from "webpush";
import { vapid } from "../vapid.ts";

export interface IConnectionDO {
  fetch(request: Request): Promise<Response>;
  sendCharacterUpdate(update: CharacterUpdate): Promise<void>;
}

export class ConnectionDO extends DurableObject implements IConnectionDO {
  private encoder = new TextEncoder();
  private controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  private subscription: Subscription | undefined;
  private interval: number | undefined;

  constructor(
    state: DurableObjectState,
    env: Env,
  ) {
    super(state, env);
  }

  override async fetch(_request: Request): Promise<Response> {
    this.cancel();

    return new Response(
      new ReadableStream<Uint8Array>({
        start: (controller) => {
          this.start(controller);
        },
        cancel: () => {
          this.cancel();
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      },
    );
  }

  private start(controller: ReadableStreamDefaultController<Uint8Array>) {
    this.controller = controller;

    this.enqueue(": connected\n\n");

    this.interval = setInterval(() => {
      this.enqueue(": ping\n\n");
    }, 20_000);
  }

  private cancel() {
    console.info(`connection[${this.ctx.id}]-cancel`);
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    this.controller = undefined;
  }

  private enqueue(message: string) {
    if (!this.controller) return;

    try {
      console.info(`connection[${this.ctx.id}]-enqueue -> ${message}`);
      this.controller.enqueue(this.encoder.encode(message));
    } catch {
      this.cancel();
    }
  }

  public async sendCharacterUpdate(update: CharacterUpdate): Promise<void> {
    const message = JSON.stringify(update);
    if (this.controller) {
      this.enqueue(`data: ${message}\n\n`);
    } else if (this.subscription) {
      console.info(`connection[${this.ctx.id}]-web-push -> ${message}`);
      await send(this.subscription, message, {
        vapid: vapid(this.env),
        subscriber: "https://example.com/webpush",
        ttl: 60,
      });
    }
  }
}
