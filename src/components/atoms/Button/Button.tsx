import classNames from "classnames";
import { CSSProperties, PropsWithChildren, createElement } from "react";
import { IconComponentType } from "@utils/Types";

export type ButtonType = "default" | "easy" | "text" | "primary" | "danger" | "transparent";

export interface ButtonProps extends PropsWithChildren {
  centerText?: boolean;
  className?: string;
  disabled?: boolean;
  ellipsis?: boolean;
  icon?: IconComponentType;
  onClick?(): void;
  style?: CSSProperties;
  tall?: boolean;
  type?: ButtonType;
  wrapContent?: boolean;
  tooltip?: string;
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
      "button--ellipsis": props.ellipsis,
      "button--iconOnly": !props.children && props.icon,
    },
    props.className
  );

  let iconColor = "var(--shade50)";

  if (props.type === "primary") {
    iconColor = "white";
  } else if (props.type === "danger") {
    iconColor = "var(--color-danger)";
  } else if (props.type === "easy" || props.type === "transparent") {
    iconColor = "var(--color-text-primary)";
  }

  return (
    <div title={props.tooltip} className={classes} style={props.style} onClick={props.disabled ? undefined : props.onClick}>
      {props.icon &&
        createElement(props.icon, {
          weight: "bold",
          size: 20,
          color: iconColor,
        })}
      {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
    </div>
  );
}
