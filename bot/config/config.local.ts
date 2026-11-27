import type { ConfigType } from "./configType.ts";
import type { LevelName } from "@std/log";

const config: ConfigType = {
  discordToken: Deno.env.get("DISCORD_TOKEN")!,
  sseHost: Deno.env.get("SSE_HOST")!,
  databaseDir: Deno.env.get("LOG_LEVEL") ?? "./database",
  logLevel: (Deno.env.get("LOG_LEVEL") ?? "DEBUG") as LevelName,
};

export default config;
