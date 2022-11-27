import { MagnifyingGlass } from "phosphor-react";
import { DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";
import { useRecoilState } from "recoil";

import { Button, Input, Select, DateRangePicker } from "@atoms/index";
import {
  amountFilterPreset,
  categotyPreset,
  currencyPreset,
  SelectItem,
  transactionStatusPreset,
} from "@utils/SelectItems";
import { filterFormState } from "@recoil/transactions/atoms";
import useSWR from "swr";
import { publish } from "@utils/Events";

interface TransactionSearchFormProps {
  showImportFilter?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json()).then((res) => res.items);

export default function TransactionSearchForm(props: TransactionSearchFormProps) {
  const [form, setForm] = useRecoilState(filterFormState);
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
    publish("transactionSearchFormSubmit", form);
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
          placeholder="All"
          items={categotyPreset}
          title="Category"
          value={form.category}
          name="category"
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
          placeholder="All"
          items={transactionStatusPreset}
          title="Status filter"
          value={form.statusFilter}
          name="statusFilter"
          onChange={onInputChange}
        />
        <Select
          placeholder="None"
          items={amountFilterPreset}
          title="Amount filter"
          value={form.amountFilter}
          name="amountFilter"
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
          icon={MagnifyingGlass}
          name="searchTerm"
          onChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
      <Button className="tSearchForm__button" centerText type="easy" onClick={onSubmit}>
        Apply filters
      </Button>
    </div>
  );
}
