import { CharacterDO } from "./characterDO.ts";

export function getCharacterStub(
  env: Env,
  name: string,
): CharacterDO {
  return env.CHARACTERS.get(
    env.CHARACTERS.idFromName(name),
  ) as unknown as CharacterDO;
}
