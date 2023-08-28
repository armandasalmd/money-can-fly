import { format } from "date-fns";
import { capitalise } from "./Global";

export function getImportTitle(item: {source: string, date: string | Date}): string {
  if (!item) return "";
  return `${capitalise(item?.source)} - ${format(
    typeof item.date === "string" ? new Date(item.date) : item.date,
    "dd/MM/yyyy HH:mm"
  )}`;
}