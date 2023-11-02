import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { DayPickerRangeProps } from "react-day-picker/dist/index";
import { ArrowClockwise, Scales } from "phosphor-react";

import { Card, DateRangePicker } from "@atoms/index";
import { CalibrateDrawer } from "@organisms/index";
import BalanceComparisonChart from "./BalanceComparisonChart";
import { useDashboardData } from "@hooks/index";
import { BalanceAnalysisModel } from "@server/models";
import { balanceChartDateRange } from "@recoil/dashboard/atoms";
import { DisplaySections, DateRange } from "@utils/Types";
import { subscribe, unsubscribe } from "@utils/Events";

export default function DashChartCard() {
  const { data, mutate } = useDashboardData<BalanceAnalysisModel>(DisplaySections.BalanceAnalysis);
  const [reloading, setReloading] = useState(false);
  const [calibrateOpen, setCalibrateOpen] = useState(false);
  const [dateRange, setDateRange] = useRecoilState(balanceChartDateRange);

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: dateRange,
    onSelect: onChange,
  };

  function onChange(range: DateRange) {
    setDateRange(range);
    setReloading(true);

    mutate([], {
      balanceAnalysisDateRange: range
    }).then(() => setReloading(false));
  }

  useEffect(() => {
    function onCashBalanceChanged() {
      mutate([DisplaySections.Insights], {
        balanceAnalysisDateRange: dateRange
      });
    }

    subscribe("cashBalanceChanged", onCashBalanceChanged);

    return () => unsubscribe("cashBalanceChanged", onCashBalanceChanged);
  });

  return (
    <Card
      loading={data === null || reloading}
      error={data?.errorMessage}
      className="dashChart"
      header={{
        color: "info",
        title: "Balance analysis",
        description: data?.cardDescription ?? "Loading...",
      }}
      headerActions={[{
        icon: Scales,
        onClick: () => setCalibrateOpen(true),
        text: "Calibrate",
        type: "text"
      },{
        icon: ArrowClockwise,
        onClick: () => onChange(dateRange),
        text: "Refresh",
        type: "text"
      }]}
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
      <CalibrateDrawer open={calibrateOpen} setOpen={setCalibrateOpen} />
    </Card>
  );
}
