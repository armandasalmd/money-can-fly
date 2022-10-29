import classNames from "classnames";
import { Check } from "phosphor-react";

import { callIfFunction } from "@utils/Global";

type CheckState = "checked" | "unchecked" | "indeterminate";

export interface CheckboxProps {
  onCheck?(state: CheckState, checked: boolean): void;
  horizontal?: boolean;
  title: string;
  value: CheckState;
}

export default function Checkbox(props: CheckboxProps) {
  const classes = classNames("checkbox",`checkbox--${props.value}`, {
    "checkbox--horizontal": props.horizontal,
  });

  function onCheck() {
    const newValue = props.value === "unchecked" ? "checked" : "unchecked";
    callIfFunction(props.onCheck, newValue, newValue === "checked");
  }

  return (
    <div className={classes}>
      <p className="checkbox__text">
        {props.title}
      </p>
      <div className={`checkbox__input ${props.value}`} onClick={onCheck}>
        {props.value === "indeterminate" && <div className="checkbox__indeterminate" />}
        {props.value === "checked" && <Check className="checkbox__checked" weight="bold" size={16} />}
      </div>
    </div>
  );
}
