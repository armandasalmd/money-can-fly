import { useState, useRef } from "react";
import classNames from "classnames";
import { Calendar as CalendarIcon } from "phosphor-react";
import { DayPicker, DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";
import { useOutsideClick } from "@hooks/index";
import "react-day-picker/dist/style.css";

import { Button } from "@atoms/index";
import { dateString } from "@utils/Global";

export interface DatePickerRangeProps {
  showIcon?: boolean;
  placeholder?: string;
  title?: string;
  className?: string;
  options: DayPickerRangeProps;
}

function toReadDate(day: DateRange | undefined) {
  if (Object.hasOwn(day, "from")) {
    const _day = day as DateRange;

    return _day.to ? dateString(_day.from) + " - " + dateString(_day.to) : dateString(_day.from);
  } else if (day instanceof Date) {
    return dateString(day);
  }
}

export default function DatePickerRange(props: DatePickerRangeProps) {
  const thisRef = useRef(null);
  const [show, setShow] = useState(false);
  const text = props.options.selected ? toReadDate(props.options.selected as DateRange) : props.placeholder || "Select date";
  const classes = classNames("dateRangePicker", props.className);

  useOutsideClick(thisRef, () => setShow(false));

  return (
    <div className={classes} ref={thisRef}>
      {props.title && <p>{props.title}</p>}
      <Button
        ellipsis
        icon={props.showIcon === false ? undefined : CalendarIcon}
        type="default"
        onClick={() => setShow(!show)}
      >
        {text}
      </Button>
      {show && (
        <DayPicker
          className="dateRangePicker__picker"
          mode="range"
          {...props.options}
        />
      )}
    </div>
  );
}
