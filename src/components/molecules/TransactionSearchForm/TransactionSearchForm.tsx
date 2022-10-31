import { useState } from "react";
import { MagnifyingGlass } from "phosphor-react";
import { DateRange, DayPickerRangeProps } from "react-day-picker/dist/index";

import { Button, Input, Select, DateRangePicker } from "@atoms/index";
import { Category, Currency } from "@utils/Types";
import { categotyPreset, currencyPreset } from "@utils/SelectPresets";
import { dateFromNow } from "@utils/Global";

export interface TransactionForm {
  category: Category;
  currency: Currency;
  dateRange: DateRange | undefined;
  searchTerm: string;
}

export interface TransactionSearchFormProps {
  onSubmit: (state: TransactionForm) => void;
}

export default function TransactionSearchForm(props: TransactionSearchFormProps) {
  const [form, setForm] = useState<TransactionForm>({
    category: "other",
    currency: "GBP",
    dateRange: {
      from: dateFromNow(-30),
      to: dateFromNow(0),
    },
    searchTerm: "",
  });

  function onInputChange(value: string, name: string) {
    setForm({ ...form, [name]: value });
  }

  function setDateRange(value: DateRange | undefined) {
    setForm({ ...form, dateRange: value });
  }

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: form.dateRange,
    onSelect: setDateRange
  };

  return (
    <div className="tSearchForm">
      <div className="tSearchForm__inputs">
        <Select items={categotyPreset} title="Category" value={form.category} name="category" onChange={onInputChange} />
        <Select items={currencyPreset} title="Currency" value={form.currency} name="currency" onChange={onInputChange} />
        <DateRangePicker options={pickerOptions} className="tSearchForm__spanFull" title="Transaction date" />
        <Input className="tSearchForm__spanFull" title="Filter description" value={form.searchTerm} icon={MagnifyingGlass} name="searchTerm" onChange={onInputChange} />
      </div>
      <Button className="tSearchForm__button" centerText type="primary" onClick={() => props.onSubmit(form)}>
        Apply filters
      </Button>
    </div>
  );
}
