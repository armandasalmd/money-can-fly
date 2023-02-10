import { useState } from "react";
import classNames from "classnames";
import { SkipBack, SkipForward } from "phosphor-react";

import { Button, Input } from "@atoms/index";
import { useDebounce } from "@hooks/index";
import { callIfFunction } from "@utils/Global";

export interface PaginationProps {
  currentPage: number;
  maxPage: number;
  jump(page: number): void;
}

export default function Pagination(props: PaginationProps) {
  const { currentPage, jump } = props;
  const [pageVal, setPageVal] = useState(null);
  const classes = classNames("pagination", {});

  useDebounce(onChange, 1000, [pageVal]);

  const placeholder = "Page " + currentPage + "/" + props.maxPage;

  function onChange() {
    if (pageVal !== null) {
      callIfFunction(jump, pageVal);
      setPageVal(null);
    }
  }

  function handleInput(value: string) {
    let parsed = parseInt(value);
    
    if (!isNaN(parsed)) {
      handleChange(parsed - (pageVal || currentPage));
    }
  }

  function handleChange(change: number) {
    let targetPage = (pageVal || currentPage) + change;

    if (props.maxPage < targetPage) {
      targetPage = props.maxPage;
    } else if (targetPage <= 0) {
      targetPage = 1;
    }

    setPageVal(targetPage);
  }

  return <div className={classes}>
    <Button disabled={currentPage <= 1} wrapContent icon={SkipBack} onClick={() => handleChange(-1)} />
    <Input style={{width: 100}} fixedWidth placeholder={placeholder} setValue={handleInput} value={pageVal || ""} />
    <Button disabled={currentPage >= props.maxPage} wrapContent icon={SkipForward} onClick={() => handleChange(1)} />
  </div>;
}
