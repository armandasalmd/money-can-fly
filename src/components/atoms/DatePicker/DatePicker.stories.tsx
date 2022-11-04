import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import DatePicker, { DatePickerProps } from "./DatePicker";

export default {
  title: "Atoms/DatePicker",
  component: DatePicker,
} as Meta;

function DatePickerRangeWithState(props: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return <DatePicker {...props} value={date} onSelect={setDate} />;
}

const Template: Story<DatePickerProps> = (args) => (
  <DatePickerRangeWithState {...args} />
);

export const Default = Template.bind({});
Default.args = {
  placeholder: "Select date...",
  title: "Date selection",
  required: true,
} as DatePickerProps;
