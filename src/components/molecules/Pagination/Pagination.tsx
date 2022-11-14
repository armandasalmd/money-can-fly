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
  const [pageVal, setPageVal] = useState("");
  const classes = classNames("pagination", {});

  useDebounce(onChange, 1000, [pageVal]);

  const placeholder = "Page " + currentPage + "/" + props.maxPage;

  function onChange() {
    if (pageVal !== "") {
      callIfFunction(jump, pageVal);
      setPageVal("");
    }
  }

  function handleInput(value: string) {
    let parsed = parseInt(value);
    
    if (!isNaN(parsed)) {
      if (props.maxPage < parsed) {
        parsed = props.maxPage;
      } else if (parsed === 0) {
        parsed = 1;
      }

      setPageVal(parsed.toString());
    }
  }

  return <div className={classes}>
    <Button disabled={currentPage <= 1} wrapContent icon={SkipBack} onClick={() => handleInput((currentPage - 1).toString())} />
    <Input style={{width: 100}} fixedWidth placeholder={placeholder} setValue={handleInput} value={pageVal} />
    <Button disabled={currentPage >= props.maxPage} wrapContent icon={SkipForward} onClick={() => handleInput((currentPage + 1).toString())} />
  </div>;
}
