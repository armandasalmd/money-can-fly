import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { DateRange, DayPickerProps } from "react-day-picker/dist/index";

import DatePickerRange, { DatePickerRangeProps } from "./DateRangePicker";
import { dateFromNow } from "@utils/Global";

export default {
  title: "Atoms/DatePickerRange",
  component: DatePickerRange,
} as Meta;

function DatePickerRangeWithState(props: DatePickerRangeProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dateFromNow(-30),
    to: dateFromNow(0),
  });
  const pickerOptions: DayPickerProps = {
    selected: dateRange,
    onSelect: setDateRange
  };

  return <DatePickerRange {...props} options={pickerOptions} />;
}

const Template: Story<DatePickerRangeProps> = (args) => <DatePickerRangeWithState {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: "Date range",
  title: "Date range",
} as DatePickerRangeProps;
