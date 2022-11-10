import { useState } from "react";
import { MagnifyingGlass } from "phosphor-react";
import { DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";

import { Button, Input, Select, DateRangePicker } from "@atoms/index";
import { Category, Currency, TransactionStatusFilter } from "@utils/Types";
import {
  amountFilterPreset,
  categotyPreset,
  currencyPreset,
  transactionStatusPreset,
} from "@utils/SelectItems";
import { dateFromNow } from "@utils/Global";

export interface TransactionForm {
  amountFilter: string | undefined;
  statusFilter: TransactionStatusFilter | undefined;
  category: Category | undefined;
  currency: Currency | undefined;
  dateRange: DateRange | undefined;
  searchTerm: string;
}

export interface TransactionSearchFormProps {
  showStatusFilter?: boolean;
  onSubmit: (state: TransactionForm) => void;
}

export default function TransactionSearchForm(
  props: TransactionSearchFormProps
) {
  const [form, setForm] = useState<TransactionForm>({
    amountFilter: undefined,
    statusFilter: undefined,
    category: undefined,
    currency: undefined,
    dateRange: {
      from: dateFromNow(-7),
      to: dateFromNow(0),
    },
    searchTerm: "",
  });

  function onInputChange(value: string | boolean, name: string) {
    setForm({ ...form, [name]: value });
  }

  function setDateRange(value: DateRange | undefined) {
    setForm({ ...form, dateRange: value });
  }

  function onSubmit() {
    props.onSubmit(form);
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
        type="primary"
        onClick={onSubmit}
      >
        Apply filters
      </Button>
    </div>
  );
}
