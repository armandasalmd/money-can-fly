import React, { createElement, CSSProperties } from "react";
import classNames from "classnames";

import { callIfFunction } from "@utils/Global";
import { IconComponentType } from "@utils/Types";

export interface InputProps {
  className?: string;
  dropdownExtension?: React.ReactNode;
  disabled?: boolean;
  error?: string;
  icon?: IconComponentType;
  placeholder?: string;
  setValue?(value: string): void;
  style?: CSSProperties;
  name?: string;
  onChange?(value: string, name: string): void;
  onChangeEvent?(e: React.ChangeEvent<HTMLInputElement>): void;
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

  function onKeyUp(event: any) {
    // Enter key capture
    if (event.keyCode === 13) {
      event.preventDefault();
      callIfFunction(props.onSubmit);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    callIfFunction(props.onChange, value, name || null);
    callIfFunction(props.setValue, e.target.value);
    callIfFunction(props.onChangeEvent, e);
  }

  const iconLeft =
    props.icon &&
    createElement(props.icon, {
      weight: "bold",
      size: 20,
    });

  return (
    <div className={classes} style={props.style}>
      {props.title && <p className="input__title">{props.title}</p>}
      <div
        className={classNames("input__main", {
          "input__main--hasDropdown": props.dropdownExtension,
        })}
      >
        {iconLeft && (
          <div
            className={classNames("input__icon", {
              "input__icon--noTitle": !props.title,
            })}
          >
            {iconLeft}
          </div>
        )}
        <input
          name={props.name}
          disabled={props.disabled}
          type={props.password ? "password" : "text"}
          value={props.value || ""}
          onChange={onChange}
          placeholder={props.placeholder || "Enter value..."}
          onKeyUp={props.onSubmit && onKeyUp}
        />
        {props.dropdownExtension ? props.dropdownExtension : null}
      </div>
      {props.error && <p className="input__error">{props.error}</p>}
    </div>
  );
}
