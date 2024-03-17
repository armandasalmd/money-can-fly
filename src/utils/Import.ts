import { createElement } from "react";
import { format } from "date-fns";
import { capitalise } from "./Global";
import { ImportState } from "./Types";
import { ClockCounterClockwise, HourglassMedium, CheckSquare, XSquare } from "phosphor-react";

const importStateIconDict: Record<ImportState, any> = {
  undo: ClockCounterClockwise,
  running: HourglassMedium,
  success: CheckSquare,
  error: XSquare,
};

const importStateColorDict: Record<ImportState, string> = {
  running: "var(--shade50)",
  success: "var(--color-success)",
  error: "var(--color-error)",
  undo: "var(--shade30)",
};

export function getImportTitle(item: { source: string; date: string | Date; balanceWasAltered: boolean }): string {
  if (!item) return "";
  return `${capitalise(item?.source)} - ${format(typeof item.date === "string" ? new Date(item.date) : item.date, "yyyy-MM-dd HH:mm")} ${
    !item.balanceWasAltered ? "(Balance not altered)" : ""
  }`;
}

export function createImportStateIcon(importState: ImportState) {
  return createElement(importStateIconDict[importState], {
    size: 28,
    color: importStateColorDict[importState],
    weight: "duotone",
  });
}