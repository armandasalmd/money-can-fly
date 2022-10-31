import { useRef } from "react";
import classNames from "classnames";

import { callIfFunction } from "@utils/Global";
import { SelectItem } from "@utils/SelectItems";
import { useOutsideClick } from "@hooks/index";

export type ItemSelectHandler = (value: string, label: string, e: React.ChangeEvent<HTMLSelectElement>) => void;

interface SelectMenuItemProps extends SelectItem {
  selected: boolean;
  onClick: ItemSelectHandler;
}

function SelectMenuItem(props: SelectMenuItemProps) {
  const classes = classNames("selectMenuItem", {
    "selectMenuItem--selected": props.selected,
  });

  return (
    <div className={classes} onClick={(e) => callIfFunction(props.onClick, props.value, props.label, e)}>
      {props.label}
    </div>
  );
}

export interface SelectMenuProps {
  items: SelectItem[];
  selectedValue: string;
  onChange: ItemSelectHandler;
  baseRef: React.RefObject<HTMLDivElement>;
  close: () => void;
}

export default function SelectMenu(props: SelectMenuProps) {
  const thisRef = useRef<HTMLDivElement>(null);

  useOutsideClick(thisRef, props.close, props.baseRef);

  return (
    <div ref={thisRef} className="selectMenu" style={{width: props.baseRef?.current?.offsetWidth || 100 }}>
      {(!props.items || props.items.length === 0) && <SelectMenuItem label="No items" value="" selected={false} onClick={() => {}} />}
      {props.items &&
        props.items.map(function (item, index) {
          return (
            <SelectMenuItem
              selected={props.selectedValue === item.value}
              {...item}
              key={index}
              onClick={props.onChange}
            />
          );
        })}
    </div>
  );
}
