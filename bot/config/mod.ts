import { ConfigType } from "./configType.ts";

const profile = Deno.env.get("PROFILE");

const config: ConfigType = (await import(
  `./config${profile ? `.${profile}` : ""}.ts`
)).default;

export default config;
