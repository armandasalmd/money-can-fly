import classNames from "classnames";
import { CSSProperties, PropsWithChildren, ReactElement } from "react";

type ButtonType = "default" | "easy" | "text" | "primary" | "danger" | "gentle" | "dashed";

interface ButtonProps extends PropsWithChildren {
  centerText?: boolean;
  className?: string;
  icon?: ReactElement;
  onClick?(): void;
  style?: CSSProperties;
  tall?: boolean;
  type?: ButtonType;
}

export default function Button(props: ButtonProps) {
  const classes = classNames(
    "button",
    {
      [`button--${props.type}`]: props.type,
      "button--centerText": props.centerText,
      "button--tall": props.tall
    },
    props.className
  );
  return (
    <div className={classes} style={props.style}>
      {props.icon}
      <p>{props.children}</p>
    </div>
  );
}
