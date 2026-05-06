import { Handlers } from "$fresh/server.ts";
import { withJson } from "../../withJson.ts";

export const handler: Handlers = {
  GET() {
    return withJson(new Date().toISOString());
  },
};
