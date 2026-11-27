import { Hono } from "hono";
import { Bindings } from "../bindings.ts";
import { get } from "./get.ts";
import { subscribe } from "./subscribe.ts";
import { pushSubscription } from "./pushSubscription.ts";

const app = new Hono<Bindings>();

app.get("/:key", get);

app.put("/:key/subscribe", subscribe);

app.put("/:key/push/subscription", pushSubscription);

export default app;
