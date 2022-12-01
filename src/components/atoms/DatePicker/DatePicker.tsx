import classNames from "classnames";
import { useState, useRef } from "react";
import { Calendar } from "phosphor-react";
import { DayPicker } from "react-day-picker";
import format from "date-fns/format";

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
}

export default function DatePicker(props: DatePickerProps) {
  const thisRef = useRef(null);
  const buttonRef = useRef(null);
  const [show, setShow] = useState(false);
  const placeholder = props.placeholder || "Select a date";

  useOutsideClick(thisRef, () => setShow(false), buttonRef);

  function onDayClick(day: Date) {
    if (!day && props.required) {
      day = new Date();
    }

    setShow(false);
    callIfFunction(props.onSelect, day, props.name);
  }

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
            mode="single"
            selected={props.value}
            onSelect={onDayClick}
            defaultMonth={props.value || new Date()}
          />
        )}
      </div>
    </div>
  );
}
