import { CSSProperties, PropsWithChildren } from "react";
import classNames from "classnames";

import Header, { HeaderProps } from "@atoms/Header/Header";
import Button, { ButtonType } from "@atoms/Button/Button";
import { Loader } from "@atoms/index";
import { IconComponentType } from "@utils/Types";

export interface CardHeaderAction {
  icon?: IconComponentType;
  text: string;
  onClick?(): void;
  type: ButtonType;
}

export interface CardProps extends PropsWithChildren {
  className?: string;
  error?: string;
  header?: HeaderProps;
  headerActions?: CardHeaderAction[];
  loading?: boolean;
  loadingText?: string;
  padded?: boolean;
  noContentPaddingX?: boolean;
  noContentPaddingY?: boolean;
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
    },
    props.className
  );

  const headerActions = props.headerActions?.map((action, index) => (
    <Button key={index} wrapContent onClick={action.onClick} type={action.type} icon={action.icon}>{action.text}</Button>
  ));

  return (
    <div className={classes} style={props.style}>
      <div className="card__header">
        {props.header && <Header className="card__headerTitle" {...props.header} />}
        {props.headerActions && <div className="card__headerActions">{headerActions}</div>}
      </div>
      {props.error && <div className="card__error">{props.error}</div>}
      <div className="card__content">{props.children}</div>
      {props.loading && <Loader className="card__loader" text={props.loadingText} color="secondary" />}
    </div>
  );
}