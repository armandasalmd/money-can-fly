import { PropsWithChildren } from "react";
import classNames from "classnames";
import { X } from "phosphor-react";

export type MessageStyle = "card" | "bordered";
export type MessageColor = "success" | "error" | "warning" | "info";

export interface MessageProps extends PropsWithChildren {
  className?: string;
  messageStyle?: MessageStyle;
  colorType: MessageColor;
  onDismiss?(): void;
  fadeIn?: boolean;
  counterMargin?: boolean;
}

export default function Message(props: MessageProps) {
  const messageStyle = props.messageStyle || "card";
  const colorType = props.colorType || "info";

  const classes = classNames(
    "message",
    `message--${messageStyle}`,
    `message--${colorType}`,
    {
      "message--fade": props.fadeIn,
      "message--counterMargin": props.counterMargin,
    },
    props.className
  );

  if (!props.children) {
    return null;
  }

  return (
    <div className={classes}>
      <p className="message__text">{props.children}</p>
      {props.onDismiss && <X weight="bold" size={20} onClick={props.onDismiss} className="message__dismiss" />}
    </div>
  );
}
