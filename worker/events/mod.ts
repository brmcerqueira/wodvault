import { Hono } from "hono";
import { Bindings } from "../bindings.ts";
import { get } from "./get.ts";
import { subscribe } from "./subscribe.ts";

const app = new Hono<Bindings>();

app.get("/:key", get);

app.put("/:key/subscribe", subscribe);

export default app;
