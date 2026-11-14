import { ButtonComponent } from "harmony";
import { dicePoolSolver } from "../solver/dicePoolSolver.ts";
import { DicePoolInput } from "../utils.ts";
import { button, ButtonOptions } from "./common.ts";

export const dicePoolButton: (
  options: ButtonOptions,
  value: number,
) => ButtonComponent = button<DicePoolInput>(
  (context) => ({ name: { value: context[0], focused: false } }),
  dicePoolSolver,
);
