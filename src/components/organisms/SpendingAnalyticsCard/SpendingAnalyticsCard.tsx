import { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { ArrowClockwise, MagnifyingGlass } from "phosphor-react";
import { format } from "date-fns";

import SpendingChart from "./SpendingChart";
import { Card, CardHeaderAction, DatePeriodSelect, Info } from "@atoms/index";
import { DateRange, DisplaySections } from "@utils/Types";
import { useDashboardData } from "@hooks/index";
import { SpendingAnalysisModel } from "@server/models";
import { publish } from "@utils/Events";
import { spendingChartDateRanges } from "@recoil/dashboard/atoms";

export default function SpendingAnalyticsCard() {
  const { data, mutate } = useDashboardData<SpendingAnalysisModel>(DisplaySections.SpendingAnalysis);
  const [reloading, setReloading] = useState(false);
  const [dateRanges, _setDateRanges] = useRecoilState(spendingChartDateRanges);

  const updateDateRanges = useCallback(function update(dateRanges: DateRange[]) {
    _setDateRanges(dateRanges);
    setReloading(true);

    mutate([DisplaySections.SpendingAnalysis], {
      spendingChartRanges: dateRanges
    }).then(() => setReloading(false));
  }, [mutate, _setDateRanges]);

  function searchTransactions(dateRange: DateRange) {
    if (dateRange) {
      publish("transactionSearchFormSubmit", {
        amountFilter: "spendingOnly",
        category: "notInvestments",
        dateRange,
      });
    }
  }

  function onDateChange(newValue: DateRange, index: number) {
    if (index < dateRanges.length) {
      const newList = [...dateRanges];
      newList[index] = newValue;
      updateDateRanges(newList);
    }
  }

  const actions: CardHeaderAction[] = [{
    icon: ArrowClockwise,
    onClick: () => updateDateRanges([...dateRanges]),
    type: "text",
    tooltip: "Refresh",
  }];

  if (dateRanges.filter(o => o !== null).length === 1) {
    actions.unshift({
      icon: MagnifyingGlass,
      onClick: () => searchTransactions(dateRanges[0]),
      type: "text",
      text: format(new Date(dateRanges[0].from), "yyyy MMMM"),
      tooltip: "Show all chart transactions",
    });
  }

  const monthPickers = dateRanges.map((dateRange, index) => {
    return (
      <DatePeriodSelect
        clearable
        title={`Dataset ${index + 1}`}
        required={index === 0}
        key={index}
        monthsAhead={0}
        monthsBehind={18}
        onChange={(value) => onDateChange(value, index)}
        menuAbove
        value={dateRange}
        placeholder={`Select dataset ${index + 1}`}
        />
    );
  });

  return (
    <Card
      loading={data === null || reloading}
      error={data?.errorMessage}
      header={{
        color: "info",
        title: "Spending breakdown",
        description: data?.cardDescription ?? "Loading...",
      }}
      headerActions={actions}
      noDivider
      className="spendingChart"
    >
      <div className="spendingChart__content">
        <div className="spendingChart__chart">
          <SpendingChart datasets={data?.datasets ?? []} onSearch={searchTransactions} />
        </div>
        <Info>Click on the point to reveal transactions</Info>
        <div className="spendingChart__filters">
          {monthPickers}
        </div>
      </div>
    </Card>
  );
}
