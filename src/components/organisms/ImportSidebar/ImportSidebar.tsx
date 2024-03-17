import { useEffect, useState, useRef } from "react";
import { atom } from "recoil";

import { ImportList } from "@molecules/index";
import { ImportDetails } from "@organisms/index";
import { toDisplayDate } from "@utils/Date";
import { getImportTitle } from "@utils/Import";
import { Import, SuccessResponse } from "@utils/Types";
import { Drawer, Message } from "@atoms/index";
import { ReadLogsResponse } from "@endpoint/imports/readLogs";
import { deleteRequest, getRequest } from "@utils/Api";
import { useInfiniteScroll } from "@hooks/index";

const PAGE_SIZE = 15;

interface ImportSidebarProps {
  setSubtitle: (subtitle: string) => void;
  runningImportId: string;
  setRunningImportId: (runningImportId: string) => void;
}

const emptyFiltersAtom = atom({
  key: "empty",
  default: null
});

export default function ImportSidebar(props: ImportSidebarProps) {
  const [message, setMessage] = useState("");
  const observerTarget = useRef(null);
  const [importData, setImportData] = useState<ReadLogsResponse | null>(null);

  const { mutate, items, loading, empty } = useInfiniteScroll<Import>(observerTarget, emptyFiltersAtom, async function (page) {
    const { items } = await getRequest<{ total: number; items: Import[] }>("/api/imports/read", {
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return items;
  });

  function onUndo(importId: string) {
    deleteRequest<any>("/api/imports/undo", { importId }).then((data) => {
      if (data.success === true) {
        props.setRunningImportId(importId);
        setMessage("Successfully triggered import undo.");
      }
    });
  }

  function onShowLogs(item: Import) {
    getRequest<SuccessResponse<ReadLogsResponse>>("/api/imports/readLogs", {
      importId: item._id,
    }).then((data) => {
      if (data.success === true) {
        setImportData(data.data);
      }
    });
  }

  useEffect(() => {
    const latestImportDate = items[0] ? `Last import ${toDisplayDate(items[0].date)} • Showing ${items.length} imports` : "No imports yet";

    props.setSubtitle(latestImportDate);

    const running = items.find((o) => o._id === props.runningImportId);

    if (running) {
      if (running.importState !== "running") {
        props.setRunningImportId("");
      } else {
        const interval = setTimeout(mutate, 2500);

        return () => clearTimeout(interval);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (!props.runningImportId) {
      const running = items.find((o) => o.importState === "running");

      if (running) {
        props.setRunningImportId(running._id);
      }
    } else {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.runningImportId]);

  return (
    <>
      <Message colorType="success" messageStyle="bordered" onDismiss={() => setMessage("")} fadeIn>
        {message}
      </Message>
      <ImportList
        onUndo={onUndo}
        items={items}
        showEmpty={empty}
        showSkeletons={loading}
        onClick={onShowLogs}
      />
      <div ref={observerTarget} className="pixel" />
      {importData !== null && (
        <Drawer noPadding onClose={() => setImportData(null)} size="small" open title="Import details" subtitle={getImportTitle(importData)}>
          <ImportDetails importData={importData} setImportData={setImportData} />
        </Drawer>
      )}
    </>
  );
}
