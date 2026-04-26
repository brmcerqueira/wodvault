import { FreshContext } from "$fresh/server.ts";
import { withJson } from "../../withJson.ts";

export async function handler(_request: Request, context: FreshContext) {
  try {
    return await context.next();
  } catch (error) {
    const message = error instanceof Error ? error.message : error as string;

    return withJson({ error: message }, 500);
  }
}
