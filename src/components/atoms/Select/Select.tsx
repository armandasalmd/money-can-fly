import { createElement, useState } from "react";
import classNames from "classnames";
import SelectIconSvg from "./SelectIconSvg";

import { IconComponentType } from "@utils/Types";
import { callIfFunction } from "@utils/Global";
import SelectMenu, { SelectItem, ItemSelectHandler } from "./SelectMenu";

export interface SelectProps {
  className?: string;
  disabled?: boolean;
  icon?: IconComponentType;
  items: SelectItem[];
  name?: string;
  onChange?(value: string, item: object): void;
  placeholder?: string;
  required?: boolean;
  value?: string;
  tall?: boolean;
  title?: string;
  fixedWidth?: boolean;
}

export default function Select(props: SelectProps) {
  const notSelectedItem: SelectItem = { label: props.placeholder || "Please select...", value: "not_selected" };
  const [isOpen, setIsOpen] = useState(false);
  const classes = classNames(
    "select",
    {
      "select--disabled": props.disabled,
      "select--tall": props.tall,
      "select--fixedWidth": props.fixedWidth,
      "select--open": isOpen,
    },
    props.className
  );

  const onChange: ItemSelectHandler = (value, label, e) => {
    e.target.blur(); // remove focus
    setIsOpen(false);
    callIfFunction(props.onChange, value, { label, value });
  };

  const menuItems = [
    <option value={notSelectedItem.value} key={notSelectedItem.value} disabled={props.required} hidden={props.required}>
      {notSelectedItem.label}
    </option>,
    ...props.items.map(function (item: SelectItem) {
      return (
        <option value={item.value} key={item.value}>
          {item.label}
        </option>
      );
    }),
  ];

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
    <div className={classes}>
      {props.title && <p className="select__title">{props.title}</p>}
      <div className="select__input" onClick={() => setIsOpen(!isOpen)}>
        <div className="select__inputMain">
          {iconLeft}
          <p className="select__inputText">{selectedLabel || notSelectedItem.label}</p>
        </div>
        <SelectIconSvg />
      </div>
      {isOpen && (
        <SelectMenu
          items={props.required ? props.items : [notSelectedItem, ...props.items]}
          selectedValue={props.value}
          onChange={onChange}
        />
      )}
      <select name={props.name} value={props.value || notSelectedItem.value} onChange={()=>{}}>
        {menuItems}
      </select>
    </div>
  );
}
