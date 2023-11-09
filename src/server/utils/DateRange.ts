import { IBalanceAnalysisSection } from "@server/models";
import { getUTCNow } from "@utils/Date";
import { DateRange } from "@utils/Types";
import { addDays } from "date-fns";

export function getDefaultDateRangeFromSettings(settings: IBalanceAnalysisSection): Required<DateRange> {
  let now = getUTCNow();
  
  now.setUTCHours(0, 0, 0, 0);
  
  return {
    from: addDays(now, -settings.defaultDaysBeforeNow),
    to: addDays(now, settings.defaultDaysAfterNow)
  };
}