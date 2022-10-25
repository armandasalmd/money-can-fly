import classNames from "classnames";
import { CSSProperties, PropsWithChildren, createElement } from "react";
import { IconComponentType } from "@utils/Types";

type ButtonType = "default" | "easy" | "text" | "primary" | "danger" | "gentle" | "dashed";

export interface ButtonProps extends PropsWithChildren {
  centerText?: boolean;
  className?: string;
  icon?: IconComponentType;
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
      "button--tall": props.tall,
    },
    props.className
  );
  return (
    <div className={classes} style={props.style} onClick={props.onClick}>
      {props.icon &&
        createElement(props.icon, {
          weight: "bold",
          size: 20,
        })}
      <p>{props.children}</p>
    </div>
  );
}