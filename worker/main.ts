import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./bindings.ts";
import { get, put, shared } from "./character/mod.ts";
import { imageUpload } from "./imageUpload.ts";

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

app.get("/api/character/:key.json", get);

app.put("/api/character/:key.json", put);

app.get("/api/shared/:key.html", shared);

app.notFound((context) => {
  return context.body(null, 404);
});

export default app;
