import { useEffect, useRef } from "react";
import classNames from "classnames";

import { callIfFunction } from "@utils/Global";
import { SelectItem } from "@utils/SelectItems";
import { useOutsideClick } from "@hooks/index";

export type ItemSelectHandler = (
  value: string,
  label: string,
  e: React.ChangeEvent<HTMLSelectElement>
) => void;

interface SelectMenuItemProps extends SelectItem {
  selected: boolean;
  onClick: ItemSelectHandler;
}

function SelectMenuItem(props: SelectMenuItemProps) {
  const classes = classNames("selectMenuItem", {
    "selectMenuItem--selected": props.selected,
  });

  return (
    <div
      className={classes}
      onClick={(e) =>
        callIfFunction(props.onClick, props.value, props.label, e)
      }
    >
      {props.label}
    </div>
  );
}

export interface SelectMenuProps {
  items: SelectItem[];
  selectedValue: string;
  onChange: ItemSelectHandler;
  baseRef: React.RefObject<HTMLDivElement>;
  close: (value: boolean) => void;
  menuAbove?: boolean;
}

export default function SelectMenu(props: SelectMenuProps) {
  const thisRef = useRef<HTMLDivElement>(null);

  useOutsideClick(thisRef, () => props.close(false), props.baseRef);

  let l = true;

  useEffect(() => {
    const selectedElement = thisRef.current?.querySelector(
      ".selectMenuItem--selected"
    );
    
    if (selectedElement && l) {
      const relativeTop = selectedElement.getBoundingClientRect().y - thisRef.current.getBoundingClientRect().y;

      l = false;
      thisRef.current.scrollTo({
        top: Math.max(0, relativeTop - 8),
      })
    }
  }, [props.selectedValue])

  return (
    <div
      ref={thisRef}
      className={classNames("selectMenu", {
        "selectMenu--above": props.menuAbove,
      })}
      style={{ width: props.baseRef?.current?.offsetWidth || 100 }}
    >
      {(!props.items || props.items.length === 0) && (
        <SelectMenuItem
          label="No items"
          value=""
          selected={false}
          onClick={() => {}}
        />
      )}
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
