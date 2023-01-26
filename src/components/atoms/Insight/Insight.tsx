import { PropsWithChildren } from "react";
import classNames from "classnames";

import { ActionColor } from "@utils/Types";

export interface InsightProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  color: ActionColor;
  loading?: boolean;
}

export default function Insight({ title, subtitle, color, loading, children }: InsightProps) {
  if (loading) {
    return (
      <div className={classNames("insight", `insight--${color}`, "insight--loading")}>
        <div className="insight__skeleton"></div>
        <div className="insight__skeleton insight__skeleton--tall"></div>
        <div className="insight__skeleton insight__skeleton--colored"></div>
        <div></div>
      </div>
    );
  }

  return (
    <div className={classNames("insight", `insight--${color}`)}>
      <h3 className="insight__title">{title}{subtitle && <span>{subtitle}</span>}</h3>
      <div className="insight__content">{children}</div>
    </div>
  );
}
