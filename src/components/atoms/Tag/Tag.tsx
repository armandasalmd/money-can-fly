import { createElement, PropsWithChildren } from "react";
import { X } from "phosphor-react";
import classNames from "classnames";

import { IconComponentType } from "@utils/Types";
import { iconOptions } from "@utils/Global";

interface TagProps extends PropsWithChildren {
  closable?: boolean;
  closeIcon?: IconComponentType;
  onClose?(value: string): void;
  disabled?: boolean;
}

export default function Tag(props: TagProps) {
  return (
    <div className={classNames("tag", props.disabled && "tag--disabled")}>
      <span>{props.children}</span>
      {props.closable === true &&
        createElement(props.closeIcon || X, {
          ...iconOptions,
          size: 18,
          color: "var(--shade40)",
          onClick: () => props.onClose(props.children as string),
          className: "tag__closeIcon",
        })}
    </div>
  );
}
