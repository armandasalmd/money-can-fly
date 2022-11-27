import { createElement } from "react";
import { format } from "date-fns";
import { HourglassMedium, CheckSquare, XSquare, ClockCounterClockwise } from "phosphor-react";

import { Import, ImportState } from "@utils/Types";
import { capitalise } from "@utils/Global";
import { Button } from "@atoms/index";

type ImportMapper = {
  [key in ImportState]: any;
};

const iconDict: ImportMapper = {
  undo: ClockCounterClockwise,
  running: HourglassMedium,
  success: CheckSquare,
  error: XSquare,
};

const colorDict: ImportMapper = {
  running: "var(--shade50)",
  success: "var(--color-success)",
  error: "var(--color-error)",
  undo: "var(--shade30)",
};

interface ImportItemProps extends Import {
  onUndo: (id: string) => void;
}

export default function ImportItem(props: ImportItemProps) {
  return (
    <div className="iItem">
      <div className="iItem__details">
        <h5 className="iItem__title">{`${capitalise(props.source)} - ${format(
          new Date(props.date),
          "dd/MM/yyyy HH:mm"
        )}`}</h5>
        <p className="iItem__subtitle">{props.message}</p>
      </div>
      <div className="iItem__right">
        {props.importState === "success" && <Button tooltip="Undo import" icon={ClockCounterClockwise} type="text" onClick={() => props.onUndo(props._id)} />}
        <div className="iItem__icon">
          {createElement(iconDict[props.importState], {
            size: 28,
            color: colorDict[props.importState],
            weight: "duotone",
          })}
        </div>
      </div>
    </div>
  );
}
