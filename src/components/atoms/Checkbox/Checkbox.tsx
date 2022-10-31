import classNames from "classnames";
import { Check } from "phosphor-react";

import { callIfFunction } from "@utils/Global";
import { CheckState } from "@utils/Types";

export interface CheckboxProps {
  onCheck?(state: CheckState, checked: boolean): void;
  onChange?(value: boolean, name: string): void;
  name?: string;
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
    callIfFunction(props.onChange, newValue === "checked", props.name || null);
  }

  return (
    <div className={classes} onClick={onCheck}>
      <p className="checkbox__text">
        {props.title}
      </p>
      <div className={`checkbox__input ${props.value}`}>
        {props.value === "indeterminate" && <div className="checkbox__indeterminate" />}
        {props.value === "checked" && <Check className="checkbox__checked" weight="bold" size={16} />}
      </div>
    </div>
  );
}
