import { createElement, PropsWithChildren } from "react";
import { X } from "phosphor-react";
import classNames from "classnames";

import { IconComponentType } from "@utils/Types";
import { iconOptions } from "@utils/Global";

export type TagType = "default" | "easy" | "positive" | "negative";

interface TagProps extends PropsWithChildren {
  closable?: boolean;
  closeIcon?: IconComponentType;
  clickMetaData?: any;
  disabled?: boolean;
  onClose?(value: string): void;
  onClick?(data: any, event: React.MouseEvent<HTMLElement>): void;
  type?: TagType;
}

export default function Tag(props: TagProps) {
  return (
    <div
      onClick={(e) => props.onClick && props.onClick(props.clickMetaData, e)}
      className={classNames("tag", {
        "tag--disabled": props.disabled,
        [`tag--${props.type}`]: (props.type || "default") !== "default"
      })}
    >
      <span>{props.children}</span>
      {props.closable === true &&
        createElement(props.closeIcon || X, {
          ...iconOptions,
          size: 18,
          color: "var(--shade40)",
          onClick: (e) => {
            e.stopPropagation();
            props.onClose(props.children as string);
          },
          className: "tag__closeIcon",
        })}
    </div>
  );
}
