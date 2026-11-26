import { IConnectionDO } from "./connectionDO.ts";

export function getConnectionStub(
  env: Env,
  name: string,
): IConnectionDO {
  return env.CONNECTIONS.get(
    env.CONNECTIONS.idFromName(name),
  ) as IConnectionDO;
}
