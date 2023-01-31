import { useState } from "react";
import { DayPickerRangeProps, DateRange } from "react-day-picker/dist/index";

import { Card, DateRangePicker } from "@atoms/index";
import BalanceComparisonChart from "./BalanceComparisonChart";
import { useDashboardData } from "@hooks/index";
import { BalanceAnalysisModel } from "@server/models";
import { getPeriodNow } from "@utils/Global";
import { DisplaySections } from "@utils/Types";
import { ArrowClockwise } from "phosphor-react";

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

  const isError = data?.errorMessage;

  return (
    <Card
      loading={data === null}
      error={isError}
      className="dashChart"
      header={{
        color: "info",
        title: "Balance analysis & expectations",
        description: data?.cardDescription ?? "Loading...",
      }}
      headerActions={[{
        icon: ArrowClockwise,
        onClick: () => onChange(dateRange),
        text: "Refresh",
        type: "text"
      }]}
      noHeaderSpacing={!isError}
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
