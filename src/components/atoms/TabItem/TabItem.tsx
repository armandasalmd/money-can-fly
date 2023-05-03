import classNames from "classnames";
import { callIfFunction } from "@utils/Global";
import { TabItemProps } from "./TabItemProps";

export default function TabItem(props: TabItemProps) {
  const classes = classNames("tabItem", {
    "tabItem--active": props.active,
  });

  function onClick() {
    if (props.active === false) {
      callIfFunction(props.onClick, props.id);
    }
  }

  return (
    <div className={classes} onClick={onClick}>
      <div className="tabItem__text">{props.text}</div>
    </div>
  );
}
