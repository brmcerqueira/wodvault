import { Hono } from "hono";
import { Bindings } from "../bindings.ts";
import { get } from "./get.ts";
import { put } from "./put.ts";
import { shared } from "./shared.tsx";

const app = new Hono<Bindings>();

app.get("/:key", get);

app.put("/:key", put);

app.get("/shared/:key", shared);

export default app;
