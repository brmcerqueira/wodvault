import type { Context } from "hono";
import { SSEStreamingApi, streamSSE } from "hono/streaming";
import type { Bindings } from "./bindings.ts";

export async function events(
  context: Context<Bindings>,
): Promise<Response> {
  context.header("Cache-Control", "no-cache");
  context.header("Content-Encoding", "Identity");

  return streamSSE(context, async (stream) => {
    ping(stream);
  });
}

async function ping(stream: SSEStreamingApi) {
  while (!stream.aborted) {
    await stream.write(": ping\n\n");
    await stream.sleep(30_000);
  }
}
