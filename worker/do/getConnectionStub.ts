import { ConnectionDO } from "./connectionDO.ts";

export function getConnectionStub(
  env: Env,
  name: string,
): ConnectionDO {
  return env.CONNECTIONS.get(
    env.CONNECTIONS.idFromName(name),
  ) as unknown as ConnectionDO;
}
