import { TextAa, MagnifyingGlass } from "phosphor-react";
import { DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";
import { RecoilState, useRecoilState } from "recoil";

import { Button, Input, Select, DateRangePicker } from "@atoms/index";
import {
  amountFilterPreset,
  searchCategoryPreset,
  currencyPreset,
  SelectItem,
} from "@utils/SelectItems";
import useSWR from "swr";
import { publish } from "@utils/Events";
import { TransactionForm } from "@utils/Types";

interface TransactionSearchFormProps {
  filterFormState: RecoilState<TransactionForm>;
  showImportFilter?: boolean;
  showSubmitButton?: boolean;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res.items);

export default function TransactionSearchForm(props: TransactionSearchFormProps) {
  const [form, setForm] = useRecoilState(props.filterFormState);
  const { data: importSelectPreset } = useSWR<SelectItem[]>(
    "/api/imports/selectItems",
    props.showImportFilter ? fetcher : () => []
  );

  function onInputChange(value: string | boolean, name: string) {
    setForm({ ...form, [name]: value });
  }

  function setDateRange(value: DateRange | undefined) {
    setForm({ ...form, dateRange: value });
  }

  function onSubmit() {
    publish("searchFormSubmit", form);
  }

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: form.dateRange,
    onSelect: setDateRange,
  };

  return (
    <div className="tSearchForm">
      <div className="tSearchForm__inputs">
        <Select
          placeholder="None"
          items={amountFilterPreset}
          title="Amount filter"
          value={form.amountFilter}
          name="amountFilter"
          onChange={onInputChange}
        />
        <Select
          placeholder="All"
          items={currencyPreset}
          title="Currency"
          value={form.currency}
          name="currency"
          onChange={onInputChange}
        />
        <Select
          className="tSearchForm__spanFull"
          placeholder="All"
          items={searchCategoryPreset}
          title="Category"
          value={form.category}
          name="category"
          onChange={onInputChange}
        />
        {props.showImportFilter && (
          <Select
            className="tSearchForm__spanFull"
            placeholder="Not selected"
            items={importSelectPreset || []}
            title="Import filter"
            value={form.importId}
            name="importId"
            onChange={onInputChange}
          />
        )}
        <DateRangePicker options={pickerOptions} className="tSearchForm__spanFull" title="Transaction date" />
        <Input
          className="tSearchForm__spanFull"
          title="Filter description"
          value={form.searchTerm}
          icon={TextAa}
          name="searchTerm"
          onChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
      {props.showSubmitButton && (
        <Button icon={MagnifyingGlass} className="tSearchForm__button" centerText type="easy" onClick={onSubmit}>
          Apply filters
        </Button>
      )}
    </div>
  );
}
