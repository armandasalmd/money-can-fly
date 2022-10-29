import classNames from "classnames";

import { ColorType } from "@utils/Types";

export interface LoaderProps {
  className?: string;
  color?: ColorType;
  hasMarginY?: boolean;
  text?: string;
}

export default function Loader(props: LoaderProps) {
  const classes = classNames("loader", {
    "loader--secondary": props.color === "secondary",
    "loader--marginY": props.hasMarginY,
  }, props.className);

  return (
    <div className={classes}>
      <div className="loader__wrapper">
        <div className="loader__inner one" />
        <div className="loader__inner two" />
        <div className="loader__inner three" />
      </div>
      <p className="loader__text">{props.text || "Loading..."}</p>
    </div>
  );
}
