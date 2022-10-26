import classNames from "classnames";

type HeaderColor = "primary" | "success" | "warning" | "error" | "info";
type HeaderSize = "small" | "medium" | "large";

export interface HeaderProps {
  className?: string;
  color?: HeaderColor;
  size?: HeaderSize;
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