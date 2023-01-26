import { useState } from "react";
import { DayPickerRangeProps, DateRange } from "react-day-picker/dist/index";

import { Card, DateRangePicker } from "@atoms/index";
import BalanceComparisonChart from "./BalanceComparisonChart";
import { useDashboardData } from "@hooks/index";
import { BalanceAnalysisModel } from "@server/models";
import { getPeriodNow } from "@utils/Global";
import { DisplaySections } from "@utils/Types";

export default function DashChartCard() {
  const { data, mutate } = useDashboardData<BalanceAnalysisModel>(DisplaySections.BalanceAnalysis);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getPeriodNow()
  );

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: dateRange,
    onSelect: onChange,
  };

  function onChange(range: DateRange) {
    setDateRange(range);
    
    mutate([], {
      balanceAnalysisDateRange: range
    });
  }

  return (
    <Card
      loading={data === null}
      className="dashChart"
      header={{
        color: "info",
        title: "Balance analysis & predictions",
        description: data?.cardDescription ?? "Loading...",
      }}
      noHeaderSpacing
      noDivider
    >
      <div className="dashChart__content">
        <div className="dashChart__chart">
          <BalanceComparisonChart apiModel={data} />
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
