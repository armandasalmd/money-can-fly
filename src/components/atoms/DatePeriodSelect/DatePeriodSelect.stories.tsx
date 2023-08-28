import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import DatePeriodSelectRange, { DatePeriodSelectProps } from "./DatePeriodSelect";
import { getOneMonthRange } from "@utils/Date";
import { DateRange } from "@utils/Types";

export default {
  title: "Atoms/DatePeriodSelect",
  component: DatePeriodSelectRange,
} as Meta;

function DatePeriodSelectRangeWithState(props: DatePeriodSelectProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getOneMonthRange()
  );

  return (
    <DatePeriodSelectRange
      {...props}
      value={dateRange}
      onChange={setDateRange}
    />
  );
}

const Template: Story<DatePeriodSelectProps> = (args) => (
  <DatePeriodSelectRangeWithState {...args} />
);

export const Default = Template.bind({});
Default.args = {
  placeholder: "Select date range...",
  title: "Date period",
  fixedWidth: true,
  monthsAhead: 12,
  monthsBehind: 12,
} as DatePeriodSelectProps;
