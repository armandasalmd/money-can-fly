import { createElement } from "react";
import { HourglassMedium, CheckSquare, XSquare, ClockCounterClockwise } from "phosphor-react";

import { Import, ImportState } from "@utils/Types";
import { getImportTitle } from "@utils/Import";
import { Button, PopConfirm } from "@atoms/index";

const iconDict: Record<ImportState, any> = {
  undo: ClockCounterClockwise,
  running: HourglassMedium,
  success: CheckSquare,
  error: XSquare,
};

const colorDict: Record<ImportState, string> = {
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
      <div className="iItem__details" onClick={() => props?.onClick}>
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
