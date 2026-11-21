import { Hono } from "hono";
import type { Bindings } from "./bindings.ts";
import { get, put, shared } from "./character/mod.ts";
import { imageUpload } from "./imageUpload.ts";
import { response } from "./response.ts";

const app = new Hono<Bindings>();

app.all("/api/upload", imageUpload);

app.get("/api/character/:key.json", get);

app.put("/api/character/:key.json", put);

app.get("/api/shared/:key.html", shared);

app.notFound(() => {
  return new Response(null, {
    status: 404,
    headers: response.corsHeaders,
  });
});

export default app;
