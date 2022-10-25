import { CSSProperties } from "react";
import classNames from "classnames";
import { callIfFunction } from "@utils/Global";

type InputType = "warning" | "error";

interface InputProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  icon?: any;
  placeholder?: string;
  setValue?(value: string): void;
  style?: CSSProperties;
  maxWidth?: string | number;
  name?: string;
  onSubmit?(): void;
  required?: boolean;
  password?: boolean;
  tall?: boolean;
  title?: string;
  type?: InputType;
  value?: string;
}

export default function Input(props: InputProps) {
  const classes = classNames(
    "input",
    {
      [`input--${props.type}`]: props.type,
      "input--disabled": props.disabled,
      "input--tall": props.tall,
      "input--error": props.error,
      "input--required": props.required,
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

  return (
    <div className={classes} style={props.style}>
      {props.icon && <div className="input__icon">{props.icon}</div>}
      {props.title && <p className="input__title">{props.title}</p>}
      {props.error && <p className="input__error">{props.error}</p>}
      <input
        name={props.name}
        type={props.password ? "password" : "text"}
        value={props.value || ""}
        onChange={({ target }) => setValue(target.value)}
        placeholder={props.placeholder || "Enter value"}
        style={{ maxWidth: props.maxWidth }}
        onKeyUp={props.onSubmit === undefined ? undefined : onKeyUp}
      />
    </div>
  );
}
