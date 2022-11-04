import { PropsWithChildren } from "react";
import classNames from "classnames";

import { ActionColor } from "@utils/Types";

export interface InsightProps extends PropsWithChildren {
  title: string;
  color: ActionColor;
}

export default function Insight({ title, color, children }: InsightProps) {
  return (
    <div className={classNames("insight", `insight--${color}`)}>
      <h3 className="insight__title">{title}</h3>
      <div className="insight__content">{children}</div>
    </div>
  );
}
