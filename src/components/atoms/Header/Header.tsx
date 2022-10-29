import classNames from "classnames";
import { ActionColor, Size } from "@utils/Types";

type HeaderColor = "primary" | ActionColor;

export interface HeaderProps {
  className?: string;
  color?: HeaderColor;
  size?: Size;
  title: string;
  description?: string;
}

export default function Header(props: HeaderProps) {
  const classes = classNames(
    "header",
    {
      [`header--${props.color}`]: props.color && props.color !== "primary",
    },
    props.className
  );

  return (
    <div className={classes}>
      <div className="header__line" />
      {props.size === "large" && <h2>{props.title}</h2>}
      {(!props.size || props.size === "medium") && <h3>{props.title}</h3>}
      {props.size === "small" && <h4>{props.title}</h4>}
      {props.description && <p className="header__description">{props.description}</p>}
    </div>
  );
}