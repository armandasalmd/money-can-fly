import { useState, useRef } from "react";
import classNames from "classnames";
import { Calendar as CalendarIcon } from "phosphor-react";
import { DayPicker, DateRange, DayPickerRangeProps } from "react-day-picker";
import { useOutsideClick } from "@hooks/index";
import "react-day-picker/dist/style.css";

import { Button, DatePeriodSelect, getPeriodNow } from "@atoms/index";
import { callIfFunction, dateString } from "@utils/Global";

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
      ? dateString(_day.from) + " - " + dateString(_day.to)
      : dateString(_day.from);
  } else if (day instanceof Date) {
    return dateString(day);
  }
}

export default function DatePickerRange(props: DatePickerRangeProps) {
  const thisRef = useRef(null);
  const [show, setShow] = useState(false);
  const [datePeriod, setDatePeriod] = useState<DateRange | undefined>(
    getPeriodNow()
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
            mode="range"
            {...props.options}
            onSelect={onDatePeriodChange}
          />
        )}
      </div>
      {props.withDatePresets && (
        <DatePeriodSelect
          monthsAhead={12}
          monthsBehind={12}
          onChange={onDatePeriodChange}
          menuAbove={props.selectMenuAbove}
          value={datePeriod}
          placeholder="Custom period"
        />
      )}
    </div>
  );
}
