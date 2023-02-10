import { useRef, useEffect, useState, ReactNode, PropsWithChildren } from "react";
import classNames from "classnames";
import { X } from "phosphor-react";

import { useOutsideClick } from "@hooks/index";
import { iconOptions } from "@utils/Global";
import { Message } from "@atoms/index";

type DrawerSize = "default" | "large" | "small";

export interface DrawerProps extends PropsWithChildren {
  className?: string;
  destroyOnClose?: boolean;
  open: boolean;
  extra?: ReactNode;
  onClose: (open: boolean) => void;
  size?: DrawerSize;
  title: string;
  subtitle?: string;
  error?: string;
  noPadding?: boolean;
}

export default function Drawer(props: DrawerProps) {
  const [previousOpen, setPreviousOpen] = useState(props.open);
  const [animatingExit, setAnimatingExit] = useState<boolean | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const classes = classNames("drawer", props.className, {
    "drawer--large": props.size === "large",
    "drawer--small": props.size === "small",
    "drawer--open": props.open,
    "drawer--animatingExit": animatingExit,
    "drawer--noPadding": props.noPadding,
  });

  function close() {
    setAnimatingExit(true);
    setTimeout(() => {
      props.onClose(false);
      setAnimatingExit(false);
    }, 400);
  }

  useOutsideClick(cardRef, () => {
    if (props.open) {
      close();
    }
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previousOpen === true && animatingExit === null && props.open === false) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousOpen, animatingExit, props.open]);

  useEffect(() => {
    if (previousOpen != props.open) {
      setPreviousOpen(props.open);
    }
  }, [props.open, previousOpen]);

  if (!animatingExit && !props.open && props.destroyOnClose) {
    return null;
  }

  return (
    <div className={classes}>
      <div className="drawer__mask"></div>
      <div className="drawer__card" ref={cardRef}>
        <div className="drawer__header">
          <div className="drawer__closeIcon" onClick={close}>
            <X {...iconOptions} />
          </div>
          <div className="drawer__headerText">
            <h2 className="drawer__title">{props.title}</h2>
            {props.subtitle && <p className="drawer__subtitle">{props.subtitle}</p>}
          </div>
          {props.extra && <div className="drawer__extra">{props.extra}</div>}
        </div>
        {props.error && (
          <Message colorType="error" messageStyle="bordered" className="drawer__message" fadeIn>
            {props.error}
          </Message>
        )}
        <div className="drawer__body">{props.children}</div>
      </div>
    </div>
  );
}
