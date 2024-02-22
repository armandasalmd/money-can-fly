import { useEffect, useState, useRef } from "react";
import { atom } from "recoil";

import { ImportList, TagList } from "@molecules/index";
import { toDisplayDate } from "@utils/Date";
import { getImportTitle } from "@utils/Import";
import { Import } from "@utils/Types";
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
  const [importLogsData, setImportLogsData] = useState<ReadLogsResponse | null>(null);

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
    getRequest<any>("/api/imports/readLogs", {
      importId: item._id,
    }).then((data) => {
      if (data.success === true) {
        setImportLogsData(data.result);
      }
    });
  }

  useEffect(() => {
    const latestImportDate = items[0] ? `Last import ${toDisplayDate(items[0].date)} • Showing ${items.length} imports` : "No imports yet";

    props.setSubtitle(latestImportDate);
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

    const running = items.find((o) => o._id === props.runningImportId);

    if (running) {
      if (running.importState === "success") {
        props.setRunningImportId("");
      } else {
        const interval = setInterval(mutate, 5000);

        return () => clearInterval(interval);
      }
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
      {importLogsData !== null && (
        <Drawer onClose={() => setImportLogsData(null)} open title="Import logs" subtitle={getImportTitle(importLogsData)}>
          <p className="text" style={{ marginBottom: 8 }}>{`Balance was ${importLogsData.balanceWasAltered ? "" : "not "}altered`}</p>
          <p className="text" style={{ marginBottom: 8 }}>
            File name {importLogsData.fileName || "unknown"}
          </p>
          <p className="text" style={{ marginBottom: 16 }}>
            {importLogsData?.message}
          </p>
          <TagList emptyTitle="No process logs" vertical editable={false} values={importLogsData?.logs ?? []} />
        </Drawer>
      )}
    </>
  );
}
