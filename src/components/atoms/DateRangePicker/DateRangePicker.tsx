import { useState, useRef } from "react";
import classNames from "classnames";
import { addYears } from "date-fns";
import { Calendar as CalendarIcon } from "phosphor-react";
import { DayPicker, DateRange, DayPickerRangeProps } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useOutsideClick } from "@hooks/index";
import { Button, DatePeriodSelect } from "@atoms/index";
import { callIfFunction } from "@utils/Global";
import { shortDate, getOneMonthRange, toLocalDate, toUTCDate } from "@utils/Date";

export interface DatePickerRangeProps {
  showIcon?: boolean;
  placeholder?: string;
  title?: string;
  className?: string;
  options: DayPickerRangeProps;
  selectMenuAbove?: boolean;
  withDatePresets?: boolean;
  wrapContent?: boolean;
}

function toReadDate(day: DateRange | undefined) {
  if (Object.hasOwn(day, "from")) {
    const _day = day as DateRange;

    return _day.to
      ? shortDate(_day.from) + " • " + shortDate(_day.to)
      : shortDate(_day.from);
  } else if (day instanceof Date) {
    return shortDate(day);
  }
}

export default function DatePickerRange(props: DatePickerRangeProps) {
  const now = new Date();
  const thisRef = useRef(null);
  const [show, setShow] = useState(false);
  const [datePeriod, setDatePeriod] = useState<DateRange | undefined>(
    getOneMonthRange()
  );
  const text = props.options.selected
    ? toReadDate(props.options.selected as DateRange)
    : props.placeholder || "Select date";
  const classes = classNames(
    "dateRangePicker",
    {
      "dateRangePicker--pickerAbove": props.selectMenuAbove,
      "dateRangePicker--withSelect": props.withDatePresets,
    },
    props.className
  );

  useOutsideClick(thisRef, () => setShow(false));

  function onDatePeriodChange(value: DateRange | undefined) {
    if (value) {
      value.from = toUTCDate(value.from);
      value.to = toUTCDate(value.to);
    }

    callIfFunction(props.options.onSelect, value);
    setDatePeriod(value);
  }

  return (
    <div className={classes}>
      <div className="dateRangePicker__main" ref={thisRef}>
        {props.title && <p className="dateRangePicker__label">{props.title}</p>}
        <Button
          wrapContent={props.wrapContent}
          ellipsis
          icon={props.showIcon === false ? undefined : CalendarIcon}
          onClick={() => setShow(!show)}
        >
          {text}
        </Button>
        {show && (
          <DayPicker
            className="dateRangePicker__picker"
            fromYear={addYears(now, -6).getFullYear()}
            toYear={addYears(now, 6).getFullYear()}
            captionLayout="dropdown"
            mode="range"
            selected={{
              ...props.options,
              from: toLocalDate(props.options?.selected?.from),
              to: toLocalDate(props.options?.selected?.to)
            }}
            onSelect={onDatePeriodChange}
          />
        )}
      </div>
      {props.withDatePresets && (
        <DatePeriodSelect
          monthsAhead={12}
          monthsBehind={24}
          onChange={onDatePeriodChange}
          menuAbove={props.selectMenuAbove}
          value={props.options.selected || datePeriod}
          placeholder="Custom period"
        />
      )}
    </div>
  );
}
