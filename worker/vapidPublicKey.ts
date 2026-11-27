import type { Context } from "hono";
import type { Bindings } from "./bindings.ts";
import { vapidPublicKey as publicKey } from "webpush";
import { vapid } from "./vapid.ts";

export async function vapidPublicKey(
  context: Context<Bindings>,
): Promise<Response> {
  return context.text(
    await publicKey(vapid(context.env)),
  );
}
