import { createElement, PropsWithChildren, useState, useRef, useEffect } from "react";
import { WarningCircle } from "phosphor-react";

import { Button, ButtonProps } from "@atoms/index";
import { useOutsideClick } from "@hooks/index";

import { callIfFunction } from "@utils/Global";
import { IconComponentType } from "@utils/Types";

export type PopConfirmPlacement = "bottomLeft" | "bottomCenter" | "bottomRight" | "topCenter" | "topLeft" | "topRight";

export interface PopConfirmProps extends PropsWithChildren {
  onConfirm?(): void;
  placement: PopConfirmPlacement;
  title?: string;
  cancelButtonProps?: ButtonProps;
  cancelText?: string;
  description: string;
  icon?: IconComponentType;
  okButtonProps?: ButtonProps;
  okText?: string;
  onCancel?(): void;
}

export default function PopConfirm(props: PopConfirmProps) {
  const [visible, setVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useOutsideClick(popupRef, () => setVisible(false), targetRef);

  function onCancel() {
    setVisible(false);
    callIfFunction(props.onCancel);
  }

  function onConfirm() {
    setVisible(false);
    props.onConfirm();
  }

  const popup = (
    <div
      className={`popConfirm__popup popup popup--${props.placement}`}
      ref={popupRef}
    >
      {createElement(props.icon || WarningCircle, {
        className: "popup__icon",
        size: 20,
        weight: "fill",
        color: props.icon ? "var(--shade40)" : "var(--color-warning)",
      })}
      <h3 className="popup__title">{props.title || "Are you sure?"}</h3>
      {props.description && <p className="popup__description">{props.description}</p>}
      <div className="popup__actions">
        <Button {...props.cancelButtonProps} onClick={onCancel} wrapContent small>
          {props.cancelText || "No"}
        </Button>
        {props.onConfirm && (
          <Button {...props.okButtonProps} onClick={onConfirm} wrapContent small type="danger">
            {props.okText || "Yes"}
          </Button>
        )}
      </div>
    </div>
  );

  function syncPopupPosition(placement: PopConfirmPlacement, target: HTMLElement = null) {
    if (!targetRef.current || !popupRef.current) return;

    const targetPos = targetRef.current.getBoundingClientRect();

    if (placement.startsWith("bottom")) {
      const top = targetPos.top + targetPos.height + 8;

      if (target && top < target.getBoundingClientRect().top) {
        setVisible(false); // Hide popup if scroll out of scroll container
        return;
      }

      if (placement === "bottomCenter") {
        popupRef.current.style.left = `${targetPos.left + targetPos.width / 2 - popupRef.current.offsetWidth / 2}px`;
      } else if (placement === "bottomRight") {
        popupRef.current.style.left = `${targetPos.left + targetPos.width - popupRef.current.offsetWidth}px`;
      }

      popupRef.current.style.top = `${top}px`;
      popupRef.current.style.bottom = "unset";
    } else if (placement.startsWith("top")) {
      const bottom = window.innerHeight - targetPos.top + 8;

      if (target && bottom < target.getBoundingClientRect().bottom) {
        setVisible(false); // Hide popup if scroll out of scroll container
        return;
      }

      if (placement === "topCenter") {
        popupRef.current.style.left = `${targetPos.left + targetPos.width / 2 - popupRef.current.offsetWidth / 2}px`;
      } else if (placement === "topRight") {
        popupRef.current.style.left = `${targetPos.left + targetPos.width - popupRef.current.offsetWidth}px`;
      }

      popupRef.current.style.bottom = `${bottom}px`;
      popupRef.current.style.top = "unset";
    }
  }

  useEffect(() => {
    syncPopupPosition(props.placement);

    function scrollHandler(ev: Event) {
      if (visible && popupRef.current && ev.target instanceof HTMLElement) {
        ev.target.contains(popupRef.current) && syncPopupPosition(props.placement, ev.target);
      }
    }

    document.addEventListener("scroll", scrollHandler, true);

    return () => {
      document.removeEventListener("scroll", scrollHandler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef, popupRef, visible, props.placement]);

  return (
    <div className="popConfirm">
      <div className="popConfirm__target" ref={targetRef} onClick={() => setVisible(!visible)}>
        {props.children}
      </div>
      {visible && popup}
    </div>
  );
}
