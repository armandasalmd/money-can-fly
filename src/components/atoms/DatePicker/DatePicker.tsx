import classNames from "classnames";
import { useState, useRef } from "react";
import { Calendar } from "phosphor-react";
import { DayPicker } from "react-day-picker";
import { format, isSameMonth, addYears } from "date-fns";

import { Button } from "@atoms/index";
import { useOutsideClick } from "@hooks/index";
import { callIfFunction } from "@utils/Global";

export interface DatePickerProps {
  placeholder?: string;
  title?: string;
  name?: string;
  onSelect?: (date: Date, name: string) => void;
  required?: boolean;
  value: Date | undefined;
  error?: string;
  goToToday?: boolean;
}

export default function DatePicker(props: DatePickerProps) {
  const thisRef = useRef(null);
  const buttonRef = useRef(null);
  const [show, setShow] = useState(false);
  const placeholder = props.placeholder || "Select a date";
  const now = new Date();

  const [month, setMonth] = useState<Date>(props.value || now);

  useOutsideClick(thisRef, () => setShow(false), buttonRef);

  function onDayClick(day: Date) {
    if (!day && props.required) {
      day = new Date();
    }

    setShow(false);
    callIfFunction(props.onSelect, day, props.name);
  }

  let footer = props.goToToday ? (
    <Button wrapContent small disabled={isSameMonth(now, month)} onClick={() => setMonth(now)}>
      Go to today
    </Button>
  ) : undefined;

  return (
    <div
      className={classNames("datePicker", {
        "datePicker--required": props.required,
      })}
      ref={thisRef}
    >
      {props.title && <p className="datePicker__label">{props.title}</p>}
      <div ref={buttonRef}>
        <Button icon={Calendar} onClick={() => setShow(!show)}>
          {props.value ? format(props.value, "yyyy.MM.dd") : placeholder}
        </Button>
        {show && (
          <DayPicker
            className="datePicker__picker"
            captionLayout="dropdown"
            fromYear={addYears(now, -6).getFullYear()}
            toYear={addYears(now, 6).getFullYear()}
            mode="single"
            onMonthChange={setMonth}
            month={month}
            selected={props.value}
            onSelect={onDayClick}
            defaultMonth={props.value || new Date()}
            footer={footer}
          />
        )}
      </div>
      {props.error && <p className="input__error">{props.error}</p>}
    </div>
  );
}
