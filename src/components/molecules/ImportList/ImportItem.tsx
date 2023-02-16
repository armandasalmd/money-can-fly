import { createElement } from "react";
import { format } from "date-fns";
import { HourglassMedium, CheckSquare, XSquare, ClockCounterClockwise } from "phosphor-react";

import { Import, ImportState } from "@utils/Types";
import { capitalise, callIfFunction, getImportTitle } from "@utils/Global";
import { Button, PopConfirm } from "@atoms/index";

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
  onClick?: () => void;
}

export default function ImportItem(props: ImportItemProps) {
  let undoButton = undefined;

  if (props.importState === "success") {
    undoButton = (
      <PopConfirm
        title="Undo this import?"
        description="This will delete all transaction that were added by this import"
        placement="bottomRight"
        onConfirm={() => props.onUndo(props._id)}
      >
        <Button
          tooltip="Undo import"
          icon={ClockCounterClockwise}
          type="text"
        />
      </PopConfirm>
    );
  }

  return (
    <div className="iItem">
      <div className="iItem__details" onClick={() => callIfFunction(props.onClick)}>
        <h5 className="iItem__title">{getImportTitle(props)}</h5>
        <p className="iItem__subtitle">{props.message}</p>
      </div>
      <div className="iItem__right">
        {undoButton}
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
