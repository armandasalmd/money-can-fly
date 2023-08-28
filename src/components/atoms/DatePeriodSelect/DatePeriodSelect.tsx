import { format, formatISO, addMonths} from "date-fns";

import { Select, SelectProps } from "@atoms/index";
import { SelectItem } from "@utils/SelectItems";
import { callIfFunction } from "@utils/Global";
import { getUTCNow, getOneMonthRange } from "@utils/Date";
import { DateRange } from "@utils/Types";

const TODAY_SUFFIX = " (now)";

export interface DatePeriodSelectProps
  extends Omit<SelectProps, "onChange" | "value" | "items"> {
  monthsAhead?: number;
  monthsBehind?: number;
  onChange?: (value: DateRange, name: string) => void;
  value: DateRange | undefined;
}

function dateRangeToString(value: DateRange) {
  if (!value || !value.from || !value.to) {
    return "";
  }

  return `${formatISO(value.from, { representation: "date" })}~${formatISO(
    value.to,
    { representation: "date" }
  )}`;
}

function generateSelectItems(
  monthsAhead: number,
  monthsBehind: number
): SelectItem[] {
  const periodNow = getUTCNow(1);
  const items: SelectItem[] = [];

  for (let i = monthsAhead; i >= 1; i--) {
    const loopPeriod = addMonths(periodNow, i);

    items.push(getSelectItem(loopPeriod));
  }

  items.push(getSelectItem(periodNow, TODAY_SUFFIX));

  for (let i = -1; i > -monthsBehind; i--) {
    const loopPeriod = addMonths(periodNow, i);

    items.push(getSelectItem(loopPeriod));
  }

  return items;

  function getSelectItem(periodStart: Date, suffix?: string): SelectItem {
    return {
      label: format(periodStart, "yyyy MMMM") + (suffix || ""),
      value: dateRangeToString(getOneMonthRange(periodStart)),
    };
  }
}

function stringToDateRange(value: string): DateRange {
  if (!value) return null;

  const [from, to] = value.split("~");

  return {
    from: new Date(from),
    to: new Date(to),
  };
}

export default function DatePeriodSelect(props: DatePeriodSelectProps) {
  const { monthsAhead = 6, monthsBehind = 6, value, ...rest } = props;
  const items = generateSelectItems(monthsAhead, monthsBehind);

  function onChange(value: string, name: string) {
    callIfFunction(props.onChange, stringToDateRange(value), name);
  }

  return (
    <div
      className="datePeriodSelect"
      style={{ width: "max-content", minWidth: 216 }}
    >
      <Select
        {...rest}
        items={items}
        onChange={onChange}
        value={dateRangeToString(value)}
      />
    </div>
  );
}
