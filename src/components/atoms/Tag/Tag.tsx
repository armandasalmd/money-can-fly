import { createElement, PropsWithChildren } from "react";
import { X } from "phosphor-react";
import classNames from "classnames";

import { IconComponentType } from "@utils/Types";
import { iconOptions } from "@utils/Global";

export type TagType = "default" | "easy";

interface TagProps extends PropsWithChildren {
  closable?: boolean;
  closeIcon?: IconComponentType;
  disabled?: boolean;
  onClose?(value: string): void;
  type?: TagType;
}

export default function Tag(props: TagProps) {
  return (
    <div
      className={classNames("tag", {
        "tag--disabled": props.disabled,
        "tag--easy": props.type === "easy",
      })}
    >
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
