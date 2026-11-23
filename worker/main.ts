import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./bindings.ts";
import { get, put, shared } from "./character/mod.ts";
import { events } from "./events.ts";
import { imageUpload } from "./imageUpload.ts";
import { subscribe } from "./subscribe.ts";

export { CharacterDO } from "./characterDO.ts";
export { ConnectionDO } from "./connectionDO.ts";

const app = new Hono<Bindings>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/api/events/:key", events);

app.put("/api/events/:key/subscribe", subscribe);

app.all("/api/upload", imageUpload);

app.get("/api/character/:key.json", get);

app.put("/api/character/:key.json", put);

app.get("/api/shared/:key.html", shared);

app.notFound((context: Context<Bindings>) => {
  return context.body(null, 404);
});

export default app;
