import { MagnifyingGlass } from "phosphor-react";
import { DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";
import { useRecoilState } from "recoil";

import { Button, Input, Select, DateRangePicker } from "@atoms/index";
import {
  amountFilterPreset,
  categotyPreset,
  currencyPreset,
  transactionStatusPreset,
} from "@utils/SelectItems";
import { filterFormState } from "@recoil/transactions/atoms";

export default function TransactionSearchForm() {
  const [form, setForm] = useRecoilState(filterFormState);

  function onInputChange(value: string | boolean, name: string) {
    setForm({ ...form, [name]: value });
  }

  function setDateRange(value: DateRange | undefined) {
    setForm({ ...form, dateRange: value });
  }

  function onSubmit() {
    // fetch new data
    // change recoil state
    // else will automatically re-render
    console.log("Submit form", form);
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
        <DateRangePicker
          options={pickerOptions}
          className="tSearchForm__spanFull"
          title="Transaction date"
        />
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
      <Button
        className="tSearchForm__button"
        centerText
        type="easy"
        onClick={onSubmit}
      >
        Apply filters
      </Button>
    </div>
  );
}
