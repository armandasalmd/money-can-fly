import { createElement, CSSProperties } from "react";
import classNames from "classnames";

import { callIfFunction } from "@utils/Global";
import { IconComponentType } from "@utils/Types";

export interface InputProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  icon?: IconComponentType;
  placeholder?: string;
  setValue?(value: string): void;
  style?: CSSProperties;
  name?: string;
  onSubmit?(): void;
  required?: boolean;
  password?: boolean;
  tall?: boolean;
  title?: string;
  value?: string;
  fixedWidth?: boolean;
}

export default function Input(props: InputProps) {
  const classes = classNames(
    "input",
    {
      "input--disabled": props.disabled,
      "input--tall": props.tall,
      "input--error": props.error,
      "input--required": props.required,
      "input--fixedWidth": props.fixedWidth,
    },
    props.className
  );

  function setValue(value: string) {
    callIfFunction(props.setValue, value);
  }

  function onKeyUp(event: any) {
    // Enter key capture
    if (event.keyCode === 13) {
      event.preventDefault();
      callIfFunction(props.onSubmit);
    }
  }

  const iconLeft = props.icon && createElement(props.icon, {
    weight: "bold",
    size: 20,
  });

  return (
    <div className={classes} style={props.style}>
      {iconLeft && <div className="input__icon">{iconLeft}</div>}
      {props.title && <p className="input__title">{props.title}</p>}
      <input
        name={props.name}
        disabled={props.disabled}
        type={props.password ? "password" : "text"}
        value={props.value || ""}
        onChange={({ target }) => setValue(target.value)}
        placeholder={props.placeholder || "Enter value..."}
        onKeyUp={props.onSubmit && onKeyUp}
      />
      {props.error && <p className="input__error">{props.error}</p>}
    </div>
  );
}
