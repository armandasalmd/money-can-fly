import { useEffect, useState } from "react";
import classNames from "classnames";
import { SkipBack, SkipForward } from "phosphor-react";

import { Button, Input } from "@atoms/index";
import { useDebounce } from "@hooks/index";
import { callIfFunction } from "@utils/Global";

export interface PaginationProps {
  defaultPage?: number;
  pageCount: number;
  onChange?(page: number): void;
}

export default function Pagination(props: PaginationProps) {
  const [page, setPage] = useState(props.defaultPage || 1);
  const [pageVal, setPageVal] = useState("");
  const classes = classNames("pagination", {});

  useDebounce(onChange, 1000, [page]);

  const placeholder = "Page " + page + "/" + props.pageCount;

  function onChange() {
    callIfFunction(props.onChange, page);
    setPageVal("");
  }

  function handleInput(value: string) {
    let parsed = parseInt(value);
    
    if (!isNaN(parsed)) {
      if (props.pageCount < parsed) {
        parsed = props.pageCount;
      } else if (parsed === 0) {
        parsed = 1;
      }

      setPageVal(parsed.toString());
      setPage(parsed);
    }
  }

  useEffect(() => {
    if (page > props.pageCount) {
      setPage(props.pageCount);
    }
  }, [props.pageCount, page])

  return <div className={classes}>
    <Button disabled={page <= 1} wrapContent icon={SkipBack} onClick={setPage.bind(null, page - 1)} />
    <Input style={{width: 100}} fixedWidth placeholder={placeholder} setValue={handleInput} value={pageVal} />
    <Button disabled={page >= props.pageCount} wrapContent icon={SkipForward} onClick={setPage.bind(null, page + 1)} />
  </div>;
}
