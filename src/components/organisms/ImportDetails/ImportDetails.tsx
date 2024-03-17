import { FileCsv, MagnifyingGlass, TrafficCone } from "phosphor-react";
import { Input, Select } from "@atoms/index";
import { ReadLogsResponse } from "@endpoint/imports/readLogs";
import { createImportStateIcon } from "@utils/Import";
import { importRowStatePreset } from "@utils/SelectItems";
import { useState } from "react";
import { RowImportStatus, SuccessResponse, Transaction } from "@utils/Types";
import ImportItemList from "./ImportItemList";
import { patchRequest } from "@utils/Api";

interface ImportDetailsProps {
  importData: ReadLogsResponse;
  setImportData(data: ReadLogsResponse): void;
}

export default function ImportDetails(props: ImportDetailsProps) {
  const [filterText, setSearchText] = useState("");
  const [filterRowImportStatus, setFilterRowImportStatus] = useState<RowImportStatus | "">("");

  let filteredItems = props.importData.importItems.filter((o) => o.description.includes(filterText));

  if (filterRowImportStatus === "success") {
    filteredItems = filteredItems.filter((o) => o.isActive);
  } else if (filterRowImportStatus === "skipped") {
    filteredItems = filteredItems.filter((o) => !o.isActive);
  } else if (filterRowImportStatus === "failed") {
    filteredItems = [];
  }

  const hideItemList = props.importData.importState !== "success";

  function onSetActive(importItem: Transaction) {
    patchRequest<SuccessResponse<void>>("/api/transactions/setActive", {
      id: importItem._id,
      active: !importItem.isActive,
    }).then(({ success }) => {
      if (success) {
        importItem.isActive = !importItem.isActive;
        props.setImportData({
          ...props.importData,
          importItems: [...props.importData.importItems],
        });
      }
    });
  }

  return (
    <div className="importDetails">
      <div className="importDetails__header">
        <div className="importDetails__highlight">
          <div className="importDetails__icon">{createImportStateIcon(props.importData.importState)}</div>
          <p className="importDetails__text">{props.importData.message}</p>
        </div>
        <div className="importDetails__highlight">
          <div className="importDetails__icon">
            <FileCsv className="text" weight="duotone" size={28} />
          </div>
          <p className="importDetails__text">{props.importData.fileName}</p>
        </div>
      </div>

      {!hideItemList && (
        <div className="importDetails__filters">
          <Select
            value={filterRowImportStatus}
            onChange={(o) => setFilterRowImportStatus(o as any)}
            icon={TrafficCone}
            items={importRowStatePreset}
            placeholder="All items"
          />
          <Input icon={MagnifyingGlass} placeholder="Filter import items" value={filterText} onChange={setSearchText} />
        </div>
      )}

      {!hideItemList && <ImportItemList importItems={filteredItems} onSetActive={onSetActive} />}
    </div>
  );
}
