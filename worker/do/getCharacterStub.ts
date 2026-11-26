import { ICharacterDO } from "./characterDO.ts";

export function getCharacterStub(
  env: Env,
  name: string,
): ICharacterDO {
  return env.CHARACTERS.get(
    env.CHARACTERS.idFromName(name),
  ) as ICharacterDO;
}
