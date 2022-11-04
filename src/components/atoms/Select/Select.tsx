import { createElement, useState, useRef } from "react";
import classNames from "classnames";
import SelectIconSvg from "./SelectIconSvg";

import { IconComponentType } from "@utils/Types";
import { callIfFunction } from "@utils/Global";
import SelectMenu, { ItemSelectHandler } from "./SelectMenu";
import { SelectItem } from "@utils/SelectItems";

export interface SelectProps {
  className?: string;
  disabled?: boolean;
  icon?: IconComponentType;
  items: SelectItem[];
  name?: string;
  onChange?: (value: string, name: string) => void;
  setValue?(value: string, item: object): void;
  menuAbove?: boolean;
  placeholder?: string;
  required?: boolean;
  value?: string;
  tall?: boolean;
  title?: string;
  fixedWidth?: boolean;
}

export default function Select(props: SelectProps) {
  const thisRef = useRef<HTMLDivElement>(null);
  const notSelectedItem: SelectItem = {
    label: props.placeholder || "Please select...",
    value: "not_selected",
  };
  const [isOpen, setIsOpen] = useState(false);
  const classes = classNames(
    "select",
    {
      "select--disabled": props.disabled,
      "select--tall": props.tall,
      "select--fixedWidth": props.fixedWidth,
      "select--open": isOpen,
      "select--required": props.required,
    },
    props.className
  );

  const onChange: ItemSelectHandler = (value, label, e) => {
    e.target.blur(); // remove focus
    setIsOpen(false);
    if (props.disabled !== true) {
      callIfFunction(props.onChange, value, props.name);
    }
  };

  const iconLeft =
    props.icon &&
    createElement(props.icon, {
      weight: "bold",
      size: 20,
      className: "select__icon",
    });

  const selectedLabel = props.items.find(function (item) {
    return item.value === props.value;
  })?.label;

  return (
    <div className={classes} ref={thisRef}>
      {props.title && <p className="select__title">{props.title}</p>}
      <div
        className="select__input"
        onClick={(e) => {
          if (props.disabled !== true) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="select__inputMain">
          {iconLeft}
          <p className="select__inputText">
            {selectedLabel || notSelectedItem.label}
          </p>
        </div>
        <SelectIconSvg />
      </div>
      {isOpen && (
        <SelectMenu
          close={() => setIsOpen(false)}
          baseRef={thisRef}
          items={
            props.required ? props.items : [notSelectedItem, ...props.items]
          }
          selectedValue={props.value}
          onChange={onChange}
          menuAbove={props.menuAbove}
        />
      )}
    </div>
  );
}
