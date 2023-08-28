import { IconProps } from "phosphor-react";
import { CheckState } from "./Types";

export function callIfFunction(...args: any[]) {
  if (typeof args[0] === "function") args[0](...args.splice(1));
}

export function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getLast<T>(array: T[]): T {
  return Array.isArray(array) ? array[array.length - 1] : null;
}

export function toCheckState(value: boolean | null): CheckState {
  if (value === null) return "indeterminate";
  return value ? "checked" : "unchecked";
}

export const iconOptions: IconProps = {
  weight: "bold",
  size: 20,
  color: "var(--shade40)",
};
