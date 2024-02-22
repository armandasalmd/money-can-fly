import { useRecoilValue, useResetRecoilState } from "recoil";
import { NoteBlank } from "phosphor-react";

import { Button, Drawer } from "@atoms/index";
import { TagList, TransactionSearchForm } from "@molecules/index";
import { selectedFilterTags, filterFormState } from "@recoil/dashboard/atoms";

interface FilterSectionProps {
  open: boolean;
  setOpen(open: boolean): void;
}

export default function FilterSection(props: FilterSectionProps) {
  const filterTags = useRecoilValue(selectedFilterTags);
  const resetFilters = useResetRecoilState(filterFormState);

  const clearButton = <Button type="text" icon={NoteBlank} onClick={resetFilters}>Clear</Button>;

  return (
    <div className="tSidebar__filterSection">
      <Drawer
        size="small"
        open={props.open}
        onClose={props.setOpen}
        title="Filter transactions"
        subtitle="Choose filters on close"
        extra={clearButton}
      >
        <TransactionSearchForm filterFormState={filterFormState} showSubmitButton />
      </Drawer>
      <TagList type="easy" values={filterTags} />
    </div>
  );
}
