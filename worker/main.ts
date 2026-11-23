import type { Context } from "hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./bindings.ts";
import character from "./character/mod.ts";
import events from "./events/mod.ts";
import { imageUpload } from "./imageUpload.ts";

export { CharacterDO, ConnectionDO } from "./do/mod.ts";

const app = new Hono<Bindings>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.all("/api/upload", imageUpload);

app.route("/api/events", events);

app.route("/api/character", character);

app.notFound((context: Context<Bindings>) => {
  return context.body(null, 404);
});

export default app;
