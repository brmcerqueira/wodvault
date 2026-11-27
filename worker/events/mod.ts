import { Hono } from "hono";
import { Bindings } from "../bindings.ts";
import { get } from "./get.ts";
import { subscribe } from "./subscribe.ts";
import { webPushSubscription } from "./webPushSubscription.ts";

const app = new Hono<Bindings>();

app.get("/:key", get);

app.put("/:key/subscribe", subscribe);

app.put("/:key/web/push/subscription", webPushSubscription);

export default app;
