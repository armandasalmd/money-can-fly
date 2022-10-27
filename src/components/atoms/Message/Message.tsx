import { PropsWithChildren, createElement } from "react";
import classNames from "classnames";
import { X } from "phosphor-react";

export type MessageStyle = "card" | "bordered";
export type MessageColor = "success" | "error" | "warning" | "info";

export interface MessageProps extends PropsWithChildren {
  messageStyle?: MessageStyle;
  colorType: MessageColor;
  onDismiss?(): void;
}

export default function Message(props: MessageProps) {
  const messageStyle = props.messageStyle || "card";
  const colorType = props.colorType || "info";

  const classes = classNames("message", {
    [`message--${props.messageStyle}`]: messageStyle,
    [`message--${props.colorType}`]: colorType,
  });

  return <div className={classes}>
    <p className="message__text">
      {props.children}
    </p>
    {props.onDismiss && <X weight="bold" size={20} onClick={props.onDismiss} className="message__dismiss" />}
  </div>;
}
