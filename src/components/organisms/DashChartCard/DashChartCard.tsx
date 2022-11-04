import { useState } from "react";
import { DayPickerRangeProps, DateRange } from "react-day-picker/dist/index";

import { Card, DateRangePicker, getPeriodNow } from "@atoms/index";
import { amountForDisplay, percentForDisplay } from "@utils/Currency";
import { ActionColor } from "@utils/Types";
import BalanceComparisonChart from "./BalanceComparisonChart";

export default function DashChartCard() {
  const amountAbove = { amount: 59.21, currency: "GBP" } as any;
  const percentAbove = 0.192;
  const color: ActionColor = percentAbove > 0 ? "success" : "error";
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getPeriodNow()
  );

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: dateRange,
    onSelect: setDateRange,
  };

  return (
    <Card
      className="dashChart"
      header={{
        color: color,
        title: "Actual Vs Expected",
        description: `${amountForDisplay(amountAbove)} (${percentForDisplay(
          percentAbove
        )}) above expected`,
      }}
      noDivider
    >
      <div className="dashChart__content">
        <div className="dashChart__chart">
          <BalanceComparisonChart />
        </div>
        <div className="dashChart__filters">
          <DateRangePicker
            selectMenuAbove
            wrapContent
            withDatePresets
            options={pickerOptions}
          />
        </div>
      </div>
    </Card>
  );
}
