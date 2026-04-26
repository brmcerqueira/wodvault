/** @jsxImportSource $react */
/** @jsxRuntime automatic */

import { JSX } from "$react/jsx-runtime";

export type NamedFieldProps = { name: string }
export type GetUpdateFieldProps<T> = { get: () => T, update: (value?: T) => void }
export type TotalFieldProps = { total: number }
export type FieldProps<T> = GetUpdateFieldProps<T> & NamedFieldProps
export type SmFieldProps = { sm?: number }

export const CircleFill = <i className="bi bi-circle-fill" />;
export const Circle = <i className="bi bi-circle" />;
export const SquareFill = <i className="bi bi-square-fill" />;
export const SquareX = <i className="bi bi-x-square" />;
export const SquareSlash = <i className="bi bi-slash-square" />;
export const Square = <i className="bi bi-square" />;

export function GenericMeter(
  props: { amount: number; put: (index: number) => JSX.Element },
) {
  const indexSpace = props.amount > 5
    ? (Math.ceil(props.amount / 2) + 1)
    : 0;
  const elements: JSX.Element[] = [];
  for (let i = 1; i <= props.amount; i++) {
    if (i == indexSpace) {
      elements.push(<i>&ensp;</i>);
    }

    elements.push(props.put(i));
  }
  return <>{elements}</>;
};

export function Meter(
  props: {
    value: number;
    total: number;
    empty: JSX.Element;
    fill: JSX.Element;
  },
) {
  return <GenericMeter
    amount={props.total}
    put={(i) => i <= props.value ? props.fill : props.empty}
  />
}

export function calculateSpent(old: number, value: number, multiplier: number): number {
  let spent = 0;
  const growing = value >= old;
  for (
    let index = (growing ? old : value) + 1;
    index <= (growing ? value : old);
    index++
  ) {
    const result = index * multiplier;
    spent += growing ? result : -result;
  }
  return spent;
}

export function format(message: string, ...args: any[]): string {
  let index = 0;
  return message.replace(/%[vs]/g, (match) => {
    const value = args[index++];
    return match === "%v" ? String(value) : match === "%s" ? String(value) : match;
  });
}