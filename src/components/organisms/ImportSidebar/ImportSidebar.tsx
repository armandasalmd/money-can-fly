import { ImportList, TagList } from "@molecules/index";
import { getImportTitle, toDisplayDate } from "@utils/Global";
import { Import } from "@utils/Types";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Drawer, Message } from "@atoms/index";
import { ReadLogsResponse } from "@endpoint/imports/readLogs";

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.items);
const PAGE_SIZE = 12;

interface ImportSidebarProps {
  setSubtitle: (subtitle: string) => void;
  runningImportId: string;
  setRunningImportId: (runningImportId: string) => void;
}

export default function ImportSidebar(props: ImportSidebarProps) {
  const [message, setMessage] = useState("");
  const { data, error, size, setSize, mutate } = useSWRInfinite<Import>(
    (index) => `/api/imports/read?skip=${index * PAGE_SIZE}&take=${PAGE_SIZE}`,
    fetcher
  );
  const [importLogsData, setImportLogsData] = useState<ReadLogsResponse | null>(null);

  function onLoadMore() {
    setSize(size + 1);
  }

  const imports: Import[] = data ? [].concat(...data) : [];

  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = imports.length === 0;
  const lastFetch: Import[] = data ? data[data?.length - 1] : ([] as any);
  const isEnd = isEmpty || imports.length < PAGE_SIZE || lastFetch?.length < PAGE_SIZE;

  const latestImport = imports[0];
  const latestImportDate = latestImport
    ? `Last import ${toDisplayDate(latestImport.date)} • Showing ${imports.length} imports`
    : "No imports yet";

  function onUndo(id: string) {
    fetch(`/api/imports/undo`, {
      method: "DELETE",
      body: JSON.stringify({ importId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          props.setRunningImportId(id);
          setMessage("Successfully triggered import undo.");
        }
      });
  }

  function onShowLogs(item: Import) {
    fetch(`/api/imports/readLogs?importId=${item._id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setImportLogsData(data.result);
        }
      });
  }

  useEffect(() => {
    props.setSubtitle(latestImportDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!props.runningImportId) {
      const running = imports.find((o) => o.importState === "running");

      if (running) {
        props.setRunningImportId(running._id);
      }
    } else {
      mutate();
    }

    const running = imports.find((o) => o._id === props.runningImportId);

    if (running) {
      if (running.importState === "success") {
        props.setRunningImportId("");
      } else {
        const interval = setInterval(() => mutate(), 5000);

        return () => clearInterval(interval);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, data, mutate]);

  return (
    <>
      <Message colorType="success" messageStyle="bordered" onDismiss={() => setMessage("")} fadeIn>
        {message}
      </Message>
      <ImportList
        onUndo={onUndo}
        items={imports}
        showEmpty={isEmpty}
        showLoadMore={!isEnd}
        showSkeletons={isLoadingMore}
        onLoadMore={onLoadMore}
        onClick={onShowLogs}
      />
      {
        importLogsData !== null && (
          <Drawer onClose={() => setImportLogsData(null)} open title="Import logs" subtitle={getImportTitle(importLogsData)}>
            <p className="text" style={{marginBottom: 16}}>{importLogsData?.message}.{` Balance was ${importLogsData.balanceWasAltered ? "" : "not "}altered.`}</p>
            <TagList emptyTitle="No process logs" vertical editable={false} values={importLogsData?.logs ?? []} />
          </Drawer>
        )
      }
      
    </>
  );
}
