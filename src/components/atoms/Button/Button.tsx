import classNames from "classnames";
import { CSSProperties, PropsWithChildren, createElement } from "react";
import { IconComponentType } from "@utils/Types";

export type ButtonType = "default" | "easy" | "text" | "primary" | "danger" | "transparent";

export interface ButtonProps extends PropsWithChildren {
  centerText?: boolean;
  className?: string;
  disabled?: boolean;
  icon?: IconComponentType;
  onClick?(): void;
  style?: CSSProperties;
  tall?: boolean;
  type?: ButtonType;
  wrapContent?: boolean;
}

export default function Button(props: ButtonProps) {
  const classes = classNames(
    "button",
    {
      [`button--${props.type}`]: props.type,
      "button--centerText": props.centerText,
      "button--disabled": props.disabled,
      "button--tall": props.tall,
      "button--wrapContent": props.wrapContent,
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
      {props.children && <p>{props.children}</p>}
    </div>
  );
}
