import { JSX } from "react/jsx-runtime";
import { SquareX } from "./common.tsx";
import { SquaresField } from "./squaresField.tsx";

export class SquaresXField extends SquaresField {
  protected override get fill(): JSX.Element {
    return SquareX;
  }
}
