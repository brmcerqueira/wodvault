import type { ConfigType } from "./configType.ts";
import type { LevelName } from "@std/log";

const config: ConfigType = {
  discordToken: Deno.env.get("DISCORD_TOKEN")!,
  sseHost: "https://wodvault.brmcerqueira.workers.dev",
  databaseDir: Deno.env.get("LOG_LEVEL") ?? "./database",
  logLevel: (Deno.env.get("LOG_LEVEL") ?? "DEBUG") as LevelName,
};

export default config;
