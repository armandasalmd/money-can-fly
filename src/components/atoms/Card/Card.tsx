import { CSSProperties, PropsWithChildren } from "react";
import classNames from "classnames";

import Header, { HeaderProps } from "@atoms/Header/Header";
import Button, { ButtonType } from "@atoms/Button/Button";
import { Message, Loader, PopConfirm, PopConfirmProps } from "@atoms/index";
import { IconComponentType } from "@utils/Types";

export interface CardHeaderAction {
  icon?: IconComponentType;
  text: string;
  onClick?(): void;
  type: ButtonType;
  tooltip?: string;
  popConfirm?: PopConfirmProps;
}

export interface CardProps extends PropsWithChildren {
  className?: string;
  closeError?(): void;
  error?: string;
  header?: HeaderProps;
  headerActions?: CardHeaderAction[];
  loading?: boolean;
  loadingText?: string;
  padded?: boolean;
  noContentPaddingX?: boolean;
  noContentPaddingY?: boolean;
  noHeaderSpacing?: boolean;
  noDivider?: boolean;
  style?: CSSProperties;
  wrap?: boolean;
}

export default function Card(props: CardProps) {
  const classes = classNames(
    "card",
    {
      "card--padded": props.padded,
      "card--noContentPaddingX": props.noContentPaddingX,
      "card--noContentPaddingY": props.noContentPaddingY,
      "card--wrap": props.wrap,
      "card--loading": props.loading,
      "card--noDivider": props.noDivider,
      "card--noHeaderSpacing": props.noHeaderSpacing,
    },
    props.className
  );

  const headerActions = props.headerActions?.map((action, index) => {
    const button = (
      <Button
        key={index}
        wrapContent
        onClick={action.popConfirm ? undefined : action.onClick}
        type={action.type}
        icon={action.icon}
        tooltip={action.tooltip}
      >
        {action.text}
      </Button>
    );

    if (action.popConfirm) {
      return (
        <PopConfirm key={index} {...action.popConfirm} onConfirm={action.onClick}>
          {button}
        </PopConfirm>
      );
    } else {
      return button;
    }
  });

  const hasPopConfirm = props.headerActions?.some((action) => action.popConfirm);

  return (
    <div className={classes} style={props.style}>
      <div className="card__header">
        {props.header && <Header className="card__headerTitle" {...props.header} />}
        {props.headerActions && (
          <div className="card__headerActions" style={{ transform: hasPopConfirm ? "unset" : undefined }}>
            {headerActions}
          </div>
        )}
      </div>
      {props.error && (
        <Message className="card__error" colorType="error" fadeIn messageStyle="bordered" onDismiss={props.closeError}>
          {props.error}
        </Message>
      )}
      <div className="card__content">{props.children}</div>
      {props.loading && <Loader className="card__loader" text={props.loadingText} color="secondary" />}
    </div>
  );
}
