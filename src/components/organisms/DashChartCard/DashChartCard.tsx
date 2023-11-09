import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { DayPickerRangeProps } from "react-day-picker/dist/index";
import { ArrowClockwise, ArrowLeft, ArrowRight, Faders, Scales } from "phosphor-react";
import { addMonths, endOfMonth } from "date-fns";

import { Button, Card, DateRangePicker } from "@atoms/index";
import { CalibrateDrawer } from "@organisms/index";
import { useDashboardData } from "@hooks/index";
import { BalanceAnalysisModel } from "@server/models";
import { balanceChartDateRange } from "@recoil/dashboard/atoms";
import { DisplaySections, DateRange } from "@utils/Types";
import { subscribe, unsubscribe } from "@utils/Events";
import DashChart from "./DashChart";
import { getUTCFirstOfMonth, toUTCDate } from "@utils/Date";
import { BalanceAnalysisSettingsDrawer } from "@components/templates";

export default function DashChartCard() {
  const { data, mutate } = useDashboardData<BalanceAnalysisModel>(DisplaySections.BalanceAnalysis);
  const [reloading, setReloading] = useState(false);
  const [calibrateOpen, setCalibrateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dateRange, setDateRange] = useRecoilState(balanceChartDateRange);

  const pickerOptions: DayPickerRangeProps = {
    mode: "range",
    selected: dateRange,
    onSelect: onChange,
  };

  function onPreviousRange() {
    const from = addMonths(getUTCFirstOfMonth(dateRange.from), -1);

    onChange({ from, to: endOfMonth(toUTCDate(from)) });
  }

  function onNextRange() {
    const to = addMonths(endOfMonth(toUTCDate(dateRange.to)), 1);

    onChange({ from: getUTCFirstOfMonth(to), to });
  }

  function onChange(range: DateRange) {
    setDateRange(range);
    setReloading(true);

    mutate([], {
      balanceAnalysisDateRange: range,
    }).then(() => setReloading(false));
  }

  useEffect(() => {
    function onCashBalanceChanged() {
      mutate([DisplaySections.Insights], {
        balanceAnalysisDateRange: dateRange,
      });
    }

    subscribe("cashBalanceChanged", onCashBalanceChanged);

    return () => unsubscribe("cashBalanceChanged", onCashBalanceChanged);
  });

  useEffect(() => {
    if (data && data.dateRange) {
      setDateRange({
        from: new Date(data.dateRange.from),
        to: new Date(data.dateRange.to)
      });
    }
  }, [data, setDateRange]);

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
      headerActions={[
        {
          icon: Faders,
          onClick: () => setSettingsOpen(true),
          tooltip: "Chart settings",
          type: "text",
        },
        {
          icon: Scales,
          onClick: () => setCalibrateOpen(true),
          tooltip: "Calibrate",
          type: "text",
        },
        {
          icon: ArrowClockwise,
          onClick: () => onChange(dateRange),
          tooltip: "Refresh",
          type: "text",
        },
      ]}
      noDivider
    >
      <div className="dashChart__content">
        <div className="dashChart__chart">
          <DashChart apiModel={data} />
        </div>
        {dateRange && (
          <div className="dashChart__filters">
            <Button wrapContent icon={ArrowLeft} onClick={onPreviousRange} />
            <DateRangePicker selectMenuAbove wrapContent withDatePresets options={pickerOptions} />
            <Button wrapContent icon={ArrowRight} onClick={onNextRange} />
          </div>
        )}
      </div>
      <CalibrateDrawer open={calibrateOpen} setOpen={setCalibrateOpen} />
      <BalanceAnalysisSettingsDrawer open={settingsOpen} onClose={setSettingsOpen} />
    </Card>
  );
}
