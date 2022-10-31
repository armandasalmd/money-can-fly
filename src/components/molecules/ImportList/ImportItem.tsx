// import classNames from "classnames";
import { createElement } from "react";
import { format } from "date-fns";
import { HourglassMedium, CheckSquare, XSquare } from "phosphor-react";

import { Import, ImportState } from "@utils/Types";
import { capitalise } from "@utils/Global";

type ImportMapper = {
  [key in ImportState]: any;
}

const iconDict: ImportMapper = {
  running: HourglassMedium,
  success: CheckSquare,
  error: XSquare,
};

const colorDict: ImportMapper = {
  running: "var(--shade50)",
  success: "var(--color-success)",
  error: "var(--color-error)",
};

export default function ImportItem(props: Import) {
  return (
    <div className="iItem">
      <div className="iItem__details">
        <h5 className="iItem__title">{`${capitalise(props.bank)} ${format(props.date, "dd/MM/yyyy HH:ss")}`}</h5>
        <p className="iItem__subtitle">{props.message}</p>
      </div>
      {createElement(iconDict[props.state], {
        className: "iItem__icon",
        size: 28,
        color: colorDict[props.state],
        weight: "duotone"
      })}
    </div>
  );
}
