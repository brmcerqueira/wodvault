import type { LevelName } from "@std/log";

export type ConfigType = {
  discordToken: string;
  sseHost: string;
  databaseDir: string;
  logLevel: LevelName;
};
